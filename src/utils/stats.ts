import type { GitHubRepo, LanguageSlice } from "../types";

const MAX_LANGUAGE_SLOTS = 7;

/**
 * Aggregates repos by their primary `language` field into slices suitable
 * for a pie/donut chart. Repos with a null language (e.g. data-only repos)
 * are excluded from the breakdown entirely - there is nothing to attribute
 * them to. Beyond the top MAX_LANGUAGE_SLOTS languages, the remainder are
 * folded into a single "Other" slice, per the token-ceiling rule: a
 * generated 9th+ hue is never distinguishable from an existing one, so we
 * cap identity-bearing slices instead of growing the palette.
 */
export function aggregateLanguages(repos: GitHubRepo[]): LanguageSlice[] {
  const counts = new Map<string, number>();

  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }

  const total = Array.from(counts.values()).reduce((sum, n) => sum + n, 0);
  if (total === 0) return [];

  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);

  const head = sorted.slice(0, MAX_LANGUAGE_SLOTS);
  const tail = sorted.slice(MAX_LANGUAGE_SLOTS);

  const slices: LanguageSlice[] = head.map(([language, count]) => ({
    language,
    count,
    percent: (count / total) * 100,
  }));

  if (tail.length > 0) {
    const otherCount = tail.reduce((sum, [, count]) => sum + count, 0);
    slices.push({
      language: "Other",
      count: otherCount,
      percent: (otherCount / total) * 100,
    });
  }

  return slices;
}

/** Total stars across every public repo. */
export function totalStars(repos: GitHubRepo[]): number {
  return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
}

/** Total forks across every public repo (used as a secondary stat). */
export function totalForks(repos: GitHubRepo[]): number {
  return repos.reduce((sum, repo) => sum + repo.forks_count, 0);
}

/** Top N repos ranked by star count, descending. Ties keep original order. */
export function topReposByStars(repos: GitHubRepo[], limit = 8): GitHubRepo[] {
  return [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit);
}

/** Years/months of account age from the ISO `created_at` string, human-readable. */
export function accountAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();

  let years = now.getFullYear() - created.getFullYear();
  let months = now.getMonth() - created.getMonth();

  if (now.getDate() < created.getDate()) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0 && months <= 0) return "This month";
  if (years <= 0) return `${months} month${months === 1 ? "" : "s"}`;
  if (months === 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years}y ${months}m`;
}
