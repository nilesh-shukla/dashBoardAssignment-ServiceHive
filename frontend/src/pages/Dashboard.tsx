import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuthStore } from "../store/authStore";
import useDebounce from "../hooks/useDebounce";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import LeadCard from "../components/LeadCard";
import LeadForm from "../components/LeadForm";
import MainLayout from "../layouts/MainLayout";
import { Lead, PaginationInfo } from "../types/lead";
import { Download, Plus, RefreshCw, X, FileSpreadsheet } from "lucide-react";

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Search, Filtering, and Pagination States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal and Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Debounce search query
  const debouncedSearch = useDebounce(search, 500);

  // Trigger data fetching on filter/search modifications
  useEffect(() => {
    fetchLeads();
  }, [debouncedSearch, status, source, sort, page]);

  // Reset page when filter elements change to prevent out of bounds queries
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, source, sort]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await API.get("/leads", {
        params: {
          search: debouncedSearch,
          status,
          source,
          sort,
          page,
          limit: 9, // Fit nicely in a 3x3 grid
        },
      });
      if (response.data.success) {
        setLeads(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error("Error fetching leads:", err);
      showToast("Failed to fetch leads list.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setStatus("");
    setSource("");
    setSort("latest");
    setSearch("");
  };

  const handleCreateLead = async (data: any) => {
    setActionLoading(true);
    try {
      const response = await API.post("/leads", data);
      if (response.data.success) {
        showToast("Lead registered successfully!");
        setIsFormOpen(false);
        fetchLeads();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to create lead.";
      showToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      showToast("Generating CSV report...");
      const response = await API.get("/leads/export", {
        responseType: "blob",
      });
      
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Leads_Export_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast("CSV file downloaded successfully!");
    } catch (err) {
      console.error("Export failed:", err);
      showToast("CSV export failed. Administrative access required.", "error");
    }
  };

  return (
    <MainLayout>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-lg transition-all duration-300 ${
            toast.type === "success"
              ? "border-emerald-500/20 bg-slate-900/90 text-emerald-400"
              : "border-rose-500/20 bg-slate-900/90 text-rose-400"
          }`}
        >
          <span className="text-xs font-semibold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-200">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Header controls section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            Leads Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Realtime client conversion tracker and lead profiles.
          </p>
        </div>

        {/* Global Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* CSV Export Button (Admin check) */}
          {user?.role === "admin" && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/50 px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white active:scale-95"
              title="Download Leads Database in CSV Format"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}

          {/* Create Lead Button */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/10 active:scale-95"
          >
            <Plus className="h-4.5 w-4.5" />
            Create Lead
          </button>

          {/* Quick Refresh */}
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 text-slate-400 transition-all hover:bg-slate-800 hover:text-white active:scale-95 disabled:opacity-50"
            title="Refresh Leads"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-brand-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search and Advanced Filters */}
      <div className="space-y-4 mb-6">
        <SearchBar search={search} setSearch={setSearch} />
        <Filters
          status={status}
          setStatus={setStatus}
          source={source}
          setSource={setSource}
          sort={sort}
          setSort={setSort}
          onReset={handleResetFilters}
        />
      </div>

      {/* Main leads grid layout */}
      {loading ? (
        // Skeleton loader
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl p-5 shadow-glass space-y-4 pulse-light">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-4.5 bg-slate-800 rounded-md w-2/3"></div>
                  <div className="h-3 bg-slate-800/60 rounded-md w-1/2"></div>
                </div>
                <div className="h-8 w-8 bg-slate-800 rounded-lg"></div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-slate-850 rounded-md w-3/4"></div>
                <div className="h-3 bg-slate-850 rounded-md w-1/2"></div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-900/60">
                <div className="flex gap-2">
                  <div className="h-5 bg-slate-850 rounded-full w-14"></div>
                  <div className="h-5 bg-slate-850 rounded-full w-16"></div>
                </div>
                <div className="h-3 bg-slate-850 rounded-md w-10"></div>
              </div>
            </div>
          ))}
        </div>
      ) : leads.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <LeadCard key={lead._id} lead={lead} />
          ))}
        </div>
      ) : (
        // Empty State card
        <div className="glass-panel flex flex-col items-center justify-center rounded-2xl py-16 px-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/40 text-slate-400 mb-4 border border-slate-800">
            <FileSpreadsheet className="h-6 w-6 text-brand-400" />
          </span>
          <h3 className="text-lg font-bold text-white">No Leads Found</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-400">
            We couldn't find any leads matching those filters. Try searching for different names or resetting queries.
          </p>
          {(status || source || search) && (
            <button
              onClick={handleResetFilters}
              className="mt-5 rounded-lg bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 active:scale-95"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* Pagination controls */}
      {!loading && leads.length > 0 && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          setPage={setPage}
          totalLeads={pagination.total}
          limit={pagination.limit}
        />
      )}

      {/* Overlay Modal for Creating Lead */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white sm:text-lg">Register New Lead</h3>
                <p className="text-[11px] text-slate-400">Enter client particulars below to seed pipeline.</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <LeadForm
              onSubmit={handleCreateLead}
              onCancel={() => setIsFormOpen(false)}
              loading={actionLoading}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;
