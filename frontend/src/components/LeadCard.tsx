import React from "react";
import { Link } from "react-router-dom";
import { Lead } from "../types/lead";
import { Mail, Phone, Building, ArrowUpRight, Eye } from "lucide-react";

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  // Status style helper
  const getStatusStyle = (status: Lead["status"]) => {
    switch (status) {
      case "New":
        return "border-blue-500/20 bg-blue-500/10 text-blue-400";
      case "Contacted":
        return "border-amber-500/20 bg-amber-500/10 text-amber-400";
      case "Qualified":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
      case "Lost":
        return "border-rose-500/20 bg-rose-500/10 text-rose-400";
      default:
        return "border-slate-500/20 bg-slate-500/10 text-slate-400";
    }
  };

  // Source style helper
  const getSourceStyle = (source: Lead["source"]) => {
    switch (source) {
      case "Website":
        return "border-indigo-500/20 bg-indigo-500/10 text-indigo-400";
      case "Instagram":
        return "border-pink-500/20 bg-pink-500/10 text-pink-400";
      case "Referral":
        return "border-teal-500/20 bg-teal-500/10 text-teal-400";
      default:
        return "border-slate-500/20 bg-slate-500/10 text-slate-400";
    }
  };

  return (
    <div className="glass-panel glass-panel-hover flex flex-col justify-between rounded-2xl p-5 shadow-glass">
      <div>
        {/* Name and Quick link */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-base font-bold text-white tracking-tight leading-snug sm:text-lg">
              {lead.name}
            </h3>
            {lead.company ? (
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Building className="h-3 w-3 text-slate-500" />
                {lead.company}
              </p>
            ) : (
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 italic">
                <Building className="h-3 w-3" />
                Independent
              </p>
            )}
          </div>
          <Link
            to={`/leads/${lead._id}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/40 border border-slate-800 text-slate-400 transition-colors hover:bg-brand-500 hover:text-white"
            title="Inspect Details"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Contact info list */}
        <div className="mt-4 flex flex-col gap-2 text-xs text-slate-300">
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-2 truncate hover:text-brand-400 transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">{lead.email}</span>
          </a>

          {lead.phone ? (
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-2 hover:text-brand-400 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
              <span>{lead.phone}</span>
            </a>
          ) : (
            <div className="flex items-center gap-2 text-slate-600 italic">
              <Phone className="h-3.5 w-3.5 flex-shrink-0" />
              <span>No number</span>
            </div>
          )}
        </div>
      </div>

      {/* Badges indicators */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-900 pt-3">
        <div className="flex flex-wrap gap-1.5">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${getStatusStyle(
              lead.status
            )}`}
          >
            {lead.status}
          </span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${getSourceStyle(
              lead.source
            )}`}
          >
            {lead.source}
          </span>
        </div>

        <Link
          to={`/leads/${lead._id}`}
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-brand-400"
        >
          <Eye className="h-3 w-3" />
          Details
        </Link>
      </div>
    </div>
  );
};

export default LeadCard;
