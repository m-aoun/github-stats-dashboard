import type { GitHubRepo } from "../types";

interface TopReposListProps {
  repos: GitHubRepo[];
}

export function TopReposList({ repos }: TopReposListProps) {
  if (repos.length === 0) return null;

  return (
    <ul className="repo-list">
      {repos.map((repo, index) => (
        <li key={repo.id} className="repo-list-item">
          <span className="repo-rank">{index + 1}</span>
          <div className="repo-list-body">
            <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-name">
              {repo.name}
            </a>
            {repo.description && <p className="repo-description">{repo.description}</p>}
            <div className="repo-list-meta">
              {repo.language && <span className="repo-language">{repo.language}</span>}
              <span className="repo-stars">★ {repo.stargazers_count.toLocaleString()}</span>
              <span className="repo-forks">⑂ {repo.forks_count.toLocaleString()}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
