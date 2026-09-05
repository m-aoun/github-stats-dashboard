import type { GitHubUser } from "../types";
import { accountAge } from "../utils/stats";

interface ProfileCardProps {
  user: GitHubUser;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="card profile-card">
      <img className="avatar" src={user.avatar_url} alt={`${user.login}'s avatar`} width={96} height={96} />
      <div className="profile-info">
        <h1>{user.name ?? user.login}</h1>
        <a className="username" href={user.html_url} target="_blank" rel="noreferrer">
          @{user.login}
        </a>
        {user.bio && <p className="bio">{user.bio}</p>}
        <div className="profile-meta">
          {user.location && <span>{user.location}</span>}
          {user.company && <span>{user.company}</span>}
          <span>
            Joined {formatDate(user.created_at)} ({accountAge(user.created_at)} ago)
          </span>
        </div>
        <div className="follow-counts">
          <span>
            <strong>{user.followers.toLocaleString()}</strong> followers
          </span>
          <span>
            <strong>{user.following.toLocaleString()}</strong> following
          </span>
          <span>
            <strong>{user.public_repos.toLocaleString()}</strong> public repos
          </span>
        </div>
      </div>
    </div>
  );
}
