import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { fetchAllPublicRepos, fetchGitHubUser, GitHubApiError } from "./api/github";
import { LanguageChart } from "./components/LanguageChart";
import { ProfileCard } from "./components/ProfileCard";
import { SearchBar } from "./components/SearchBar";
import { StatTiles } from "./components/StatTiles";
import { StatusBanner } from "./components/StatusBanner";
import { TopReposChart } from "./components/TopReposChart";
import { TopReposList } from "./components/TopReposList";
import type { FetchState, GitHubRepo, GitHubUser } from "./types";
import { aggregateLanguages, topReposByStars, totalForks, totalStars } from "./utils/stats";

const DEFAULT_USERNAME = "octocat";

function App() {
  const [state, setState] = useState<FetchState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [username, setUsername] = useState<string>(DEFAULT_USERNAME);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);

  // Guards against an earlier, slower request overwriting a later one's result.
  const requestId = useRef(0);

  const runSearch = useCallback(async (name: string) => {
    const thisRequest = ++requestId.current;
    setState("loading");
    setErrorMessage(undefined);
    setUsername(name);

    try {
      const fetchedUser = await fetchGitHubUser(name);
      const fetchedRepos = await fetchAllPublicRepos(name);

      if (requestId.current !== thisRequest) return; // stale response, ignore

      setUser(fetchedUser);
      setRepos(fetchedRepos.filter((repo) => !repo.fork));
      setState("success");
    } catch (err) {
      if (requestId.current !== thisRequest) return;

      if (err instanceof GitHubApiError) {
        setState(err.kind);
        setErrorMessage(err.message);
      } else {
        setState("error");
        setErrorMessage("An unexpected error occurred.");
      }
      setUser(null);
      setRepos([]);
    }
  }, []);

  // Auto-search the example username on first load so the page isn't empty.
  useEffect(() => {
    runSearch(DEFAULT_USERNAME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const languageData = repos.length > 0 ? aggregateLanguages(repos) : [];
  const topRepos = repos.length > 0 ? topReposByStars(repos, 8) : [];
  const stars = repos.length > 0 ? totalStars(repos) : 0;
  const forks = repos.length > 0 ? totalForks(repos) : 0;

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>GitHub Stats Dashboard</h1>
        <p className="app-subtitle">
          Type any public GitHub username to see their language mix, top repos, and stats at a glance.
        </p>
        <SearchBar onSearch={runSearch} isLoading={state === "loading"} initialValue={DEFAULT_USERNAME} />
      </header>

      <main className="app-main">
        {state === "loading" && <StatusBanner kind="loading" username={username} />}
        {state === "not_found" && <StatusBanner kind="not_found" username={username} />}
        {state === "rate_limited" && <StatusBanner kind="rate_limited" />}
        {state === "error" && <StatusBanner kind="error" message={errorMessage} />}

        {state === "success" && user && (
          <>
            <ProfileCard user={user} />

            <StatTiles
              tiles={[
                { label: "Public repos", value: user.public_repos.toLocaleString() },
                { label: "Total stars received", value: stars.toLocaleString() },
                { label: "Total forks received", value: forks.toLocaleString() },
                { label: "Followers", value: user.followers.toLocaleString() },
              ]}
            />

            <div className="chart-grid">
              <section className="card">
                <h2>Language breakdown</h2>
                <p className="card-subtitle">By primary language across {repos.length} non-fork repos</p>
                <LanguageChart data={languageData} />
              </section>

              <section className="card">
                <h2>Top repos by stars</h2>
                <p className="card-subtitle">Ranked by stargazer count</p>
                <TopReposChart repos={topRepos} />
              </section>
            </div>

            <section className="card">
              <h2>Repo details</h2>
              <TopReposList repos={topRepos} />
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Data from the{" "}
          <a href="https://docs.github.com/en/rest" target="_blank" rel="noreferrer">
            GitHub REST API
          </a>{" "}
          · unauthenticated requests are capped at 60/hour ·{" "}
          <a href="https://github.com/m-aoun" target="_blank" rel="noreferrer">
            @m-aoun
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
