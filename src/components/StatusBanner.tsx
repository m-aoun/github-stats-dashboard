interface StatusBannerProps {
  kind: "loading" | "not_found" | "rate_limited" | "error";
  username?: string;
  message?: string;
}

export function StatusBanner({ kind, username, message }: StatusBannerProps) {
  if (kind === "loading") {
    return (
      <div className="status-banner status-loading" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <span>Fetching data for {username ? `@${username}` : "user"}…</span>
      </div>
    );
  }

  if (kind === "not_found") {
    return (
      <div className="status-banner status-error" role="alert">
        <strong>User not found.</strong>
        <span>
          There's no public GitHub account called {username ? `"${username}"` : "that"}. Double-check the
          spelling and try again.
        </span>
      </div>
    );
  }

  if (kind === "rate_limited") {
    return (
      <div className="status-banner status-warning" role="alert">
        <strong>GitHub API rate limit reached.</strong>
        <span>
          Unauthenticated requests to the GitHub API are capped at 60 per hour, per IP. Wait a bit and try
          again.
        </span>
      </div>
    );
  }

  return (
    <div className="status-banner status-error" role="alert">
      <strong>Something went wrong.</strong>
      <span>{message ?? "Could not reach the GitHub API. Please try again."}</span>
    </div>
  );
}
