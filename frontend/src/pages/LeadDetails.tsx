import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuthStore } from "../store/authStore";
import MainLayout from "../layouts/MainLayout";
import LeadForm from "../components/LeadForm";
import { Lead } from "../types/lead";
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Calendar,
  ShieldAlert,
  Edit2,
  Trash2,
  X,
  FileClock,
  ExternalLink,
} from "lucide-react";

export const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLeadDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/leads/${id}`);
      if (response.data.success) {
        setLead(response.data.data);
      }
    } catch (err: any) {
      console.error(err);
      showToast("Failed to retrieve lead data details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!lead) return;
    setActionLoading(true);
    try {
      const response = await API.put(`/leads/${id}`, { status: newStatus });
      if (response.data.success) {
        setLead(response.data.data);
        showToast(`Lead status updated to ${newStatus}`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update status.";
      showToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateLeadInfo = async (formData: any) => {
    setActionLoading(true);
    try {
      const response = await API.put(`/leads/${id}`, formData);
      if (response.data.success) {
        setLead(response.data.data);
        setIsEditing(false);
        showToast("Lead details updated successfully!");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update lead information.";
      showToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!window.confirm("Are you absolutely sure you want to delete this lead? This action cannot be undone.")) return;
    setActionLoading(true);
    try {
      const response = await API.delete(`/leads/${id}`);
      if (response.data.success) {
        // Redirect back
        navigate("/");
      }
    } catch (err: any) {
      showToast("Access forbidden: Administrative rights required.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-brand-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!lead) {
    return (
      <MainLayout>
        <div className="glass-panel text-center py-16 rounded-2xl">
          <ShieldAlert className="h-10 w-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Lead Not Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            The profile you are looking for does not exist or has been deleted.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold hover:bg-slate-700"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl border px-4 py-2.5 shadow-lg ${
            toast.type === "success"
              ? "border-emerald-500/20 bg-slate-900/90 text-emerald-400"
              : "border-rose-500/20 bg-slate-900/90 text-rose-400"
          }`}
        >
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Nav back */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Core particulars Panel */}
        <div className="glass-panel rounded-2xl p-6 shadow-glass lg:col-span-2">
          <div className="flex items-start justify-between gap-4 border-b border-slate-900 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-white sm:text-2xl">{lead.name}</h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5" />
                {lead.company || "Independent Profile"}
              </p>
            </div>

            {/* Quick Actions (Admin rights check) */}
            <div className="flex items-center gap-2">
              {user?.role === "admin" && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Edit particulars"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleDeleteLead}
                    disabled={actionLoading}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                    title="Delete lead permanently"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Leads Details Particulars Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Email Address</span>
              <a
                href={`mailto:${lead.email}`}
                className="mt-1 flex items-center gap-2 text-sm text-slate-200 hover:text-brand-400 transition-colors"
              >
                <Mail className="h-4 w-4 text-brand-500 flex-shrink-0" />
                <span className="truncate">{lead.email}</span>
                <ExternalLink className="h-3 w-3 text-slate-600" />
              </a>
            </div>

            <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Phone Number</span>
              {lead.phone ? (
                <a
                  href={`tel:${lead.phone}`}
                  className="mt-1 flex items-center gap-2 text-sm text-slate-200 hover:text-brand-400"
                >
                  <Phone className="h-4 w-4 text-brand-500 flex-shrink-0" />
                  <span>{lead.phone}</span>
                </a>
              ) : (
                <p className="mt-1 text-sm text-slate-600 italic">No contact number registered</p>
              )}
            </div>

            <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Acquisition Source</span>
              <p className="mt-1.5">
                <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                  {lead.source}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Created Date</span>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                <Calendar className="h-4 w-4 text-slate-500" />
                {new Date(lead.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Status tracking timeline */}
        <div className="glass-panel rounded-2xl p-6 shadow-glass space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Status Controls</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Toggle conversion status dynamically.</p>
          </div>

          {/* Dynamic selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Current Status</label>
            <select
              value={lead.status}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              disabled={actionLoading}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all focus:border-brand-500"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Timeline modification tracker */}
          <div className="border-t border-slate-900 pt-4">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              <FileClock className="h-4 w-4 text-brand-500" />
              Modification Log
            </h4>
            <div className="relative pl-4 border-l border-slate-900 space-y-4 text-xs">
              <div className="relative">
                <span className="absolute -left-[21px] top-1.5 flex h-2 w-2 rounded-full bg-brand-500 ring-4 ring-slate-950"></span>
                <p className="font-semibold text-slate-200">Lead particulars verified</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Last updated:{" "}
                  {new Date(lead.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1.5 flex h-2 w-2 rounded-full bg-slate-850 ring-4 ring-slate-950"></span>
                <p className="font-semibold text-slate-400">Pipeline record registered</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {new Date(lead.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editing Overlay Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white sm:text-lg">Edit Lead particulars</h3>
                <p className="text-[11px] text-slate-400">Modify client pipeline coordinates below.</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <LeadForm
              initialData={lead}
              onSubmit={handleUpdateLeadInfo}
              onCancel={() => setIsEditing(false)}
              loading={actionLoading}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default LeadDetails;
