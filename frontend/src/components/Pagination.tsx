import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (value: number) => void;
  totalLeads: number;
  limit: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  setPage,
  totalLeads,
  limit,
}) => {
  if (totalPages <= 1) return null;

  const startLead = (page - 1) * limit + 1;
  const endLead = Math.min(page * limit, totalLeads);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-900 pt-4 mt-6">
      {/* Information tracker */}
      <span className="text-xs text-slate-400">
        Showing <span className="font-semibold text-slate-200">{startLead}</span> to{" "}
        <span className="font-semibold text-slate-200">{endLead}</span> of{" "}
        <span className="font-semibold text-slate-200">{totalLeads}</span> leads
      </span>

      {/* Control buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition-all hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="text-xs text-slate-300">
          Page <span className="font-semibold text-white">{page}</span> of{" "}
          <span className="font-semibold text-slate-400">{totalPages}</span>
        </span>

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition-all hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
