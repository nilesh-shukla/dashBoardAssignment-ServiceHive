import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4.5 w-4.5 text-slate-400" />
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search leads by name, email, or company..."
        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all focus:border-brand-500/80 focus:bg-slate-900 focus:ring-1 focus:ring-brand-500/50"
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 active:scale-90"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
