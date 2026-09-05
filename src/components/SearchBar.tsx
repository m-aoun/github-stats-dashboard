import { useState, type FormEvent } from "react";

interface SearchBarProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export function SearchBar({ onSearch, isLoading, initialValue = "" }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <label htmlFor="username-input" className="visually-hidden">
        GitHub username
      </label>
      <input
        id="username-input"
        type="text"
        placeholder="Enter a GitHub username (e.g. torvalds)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
      <button type="submit" disabled={isLoading || value.trim().length === 0}>
        {isLoading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
