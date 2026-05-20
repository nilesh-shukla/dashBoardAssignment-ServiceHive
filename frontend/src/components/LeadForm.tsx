import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Save, AlertCircle } from "lucide-react";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(["New", "Contacted", "Qualified", "Lost"]).default("New"),
  source: z.enum(["Website", "Instagram", "Referral"], {
    errorMap: () => ({ message: "Source must be Website, Instagram, or Referral" }),
  }),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  initialData?: any;
  onSubmit: (data: LeadFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "New",
      source: "Website",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Lead Name *</label>
          <input
            type="text"
            {...register("name")}
            placeholder="John Doe"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-brand-500 focus:bg-slate-900"
          />
          {errors.name && (
            <p className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold mt-0.5">
              <AlertCircle className="h-3 w-3" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Email Address *</label>
          <input
            type="email"
            {...register("email")}
            placeholder="john@example.com"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-brand-500 focus:bg-slate-900"
          />
          {errors.email && (
            <p className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold mt-0.5">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Phone Number</label>
          <input
            type="text"
            {...register("phone")}
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-brand-500 focus:bg-slate-900"
          />
        </div>

        {/* Company input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Company Name</label>
          <input
            type="text"
            {...register("company")}
            placeholder="Tech Solutions Ltd"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-brand-500 focus:bg-slate-900"
          />
        </div>

        {/* Status selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Lead Status</label>
          <select
            {...register("status")}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all focus:border-brand-500"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Source selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Lead Source *</label>
          <select
            {...register("source")}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all focus:border-brand-500"
          >
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
          {errors.source && (
            <p className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold mt-0.5">
              <AlertCircle className="h-3 w-3" />
              {errors.source.message}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-900 pt-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-850 active:scale-95 disabled:opacity-40"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-500 active:scale-95 disabled:opacity-40"
        >
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Lead"}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
