import axios, { AxiosError } from "axios";
import type { GitHubRepo, GitHubUser } from "../types";

const BASE_URL = "https://api.github.com";

export class GitHubApiError extends Error {
  kind: "not_found" | "rate_limited" | "error";

  constructor(kind: "not_found" | "rate_limited" | "error", message: string) {
    super(message);
    this.kind = kind;
    this.name = "GitHubApiError";
  }
}

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/vnd.github+json",
  },
});

function toApiError(err: unknown): GitHubApiError {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError;
    const status = axiosErr.response?.status;

    if (status === 404) {
      return new GitHubApiError("not_found", "GitHub user not found.");
    }

    // GitHub signals rate limiting either with 403 + a zeroed remaining header,
    // or (less commonly) with 429.
    const remaining = axiosErr.response?.headers?.["x-ratelimit-remaining"];
    if (status === 403 && remaining === "0") {
      return new GitHubApiError(
        "rate_limited",
        "GitHub API rate limit exceeded for unauthenticated requests. Please wait a bit and try again."
      );
    }
    if (status === 429) {
      return new GitHubApiError(
        "rate_limited",
        "GitHub API rate limit exceeded. Please wait a bit and try again."
      );
    }
    if (status === 403) {
      return new GitHubApiError(
        "rate_limited",
        "GitHub API request was forbidden, likely due to rate limiting. Please try again shortly."
      );
    }

    return new GitHubApiError(
      "error",
      axiosErr.message || "Something went wrong talking to the GitHub API."
    );
  }

  return new GitHubApiError("error", "Something went wrong talking to the GitHub API.");
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  try {
    const { data } = await client.get<GitHubUser>(`/users/${encodeURIComponent(username)}`);
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}

/**
 * Fetches every public repo for a user, paging through the GitHub REST API
 * (100 per page, capped at 500 repos / 5 pages so a single busy profile can't
 * make the dashboard hammer the rate limit into the ground).
 */
export async function fetchAllPublicRepos(username: string): Promise<GitHubRepo[]> {
  const perPage = 100;
  const maxPages = 5;
  const repos: GitHubRepo[] = [];

  try {
    for (let page = 1; page <= maxPages; page++) {
      const { data } = await client.get<GitHubRepo[]>(
        `/users/${encodeURIComponent(username)}/repos`,
        {
          params: {
            per_page: perPage,
            page,
            sort: "updated",
            type: "owner",
          },
        }
      );
      repos.push(...data);
      if (data.length < perPage) break;
    }
    return repos;
  } catch (err) {
    throw toApiError(err);
  }
}
