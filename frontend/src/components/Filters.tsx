import React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface FiltersProps {
  status: string;
  setStatus: (value: string) => void;
  source: string;
  setSource: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  onReset: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
  status,
  setStatus,
  source,
  setSource,
  sort,
  setSort,
  onReset,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-900 bg-slate-900/30 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
        <SlidersHorizontal className="h-4 w-4 text-brand-500" />
        Filter & Sort
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        {/* Status selection */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 font-medium sm:hidden">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 outline-none transition-all focus:border-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Source selection */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 font-medium sm:hidden">Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 outline-none transition-all focus:border-brand-500"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        {/* Sort order selection */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 font-medium sm:hidden">Sort By</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 outline-none transition-all focus:border-brand-500"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Clear Filter Button */}
        {(status || source || sort !== "latest") && (
          <button
            onClick={onReset}
            className="col-span-2 mt-1 sm:mt-0 flex items-center justify-center gap-1 rounded-lg border border-dashed border-slate-700 bg-slate-900/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:border-slate-500 hover:text-slate-200 active:scale-95"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;
