import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { UserPlus, Mail, Lock, User, Shield, AlertCircle } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "sales"]).default("sales"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: signup, loading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "sales",
    },
  });

  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    const success = await signup(data);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[60%] w-[50%] rounded-full bg-brand-500/10 blur-[130px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] h-[60%] w-[50%] rounded-full bg-violet-500/10 blur-[130px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-400 font-extrabold text-white shadow-xl shadow-brand-500/30">
            ⚡
          </span>
          <h2 className="mt-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
            Create an Account
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Join SmartLeads and coordinate your sales funnel.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 shadow-glass md:p-8">
          <h3 className="text-lg font-bold text-white mb-6">Sign Up</h3>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-brand-500/80 focus:bg-slate-900 focus:ring-1 focus:ring-brand-500/50"
                />
              </div>
              {errors.name && (
                <p className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold mt-0.5">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-brand-500/80 focus:bg-slate-900 focus:ring-1 focus:ring-brand-500/50"
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold mt-0.5">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-brand-500/80 focus:bg-slate-900 focus:ring-1 focus:ring-brand-500/50"
                />
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold mt-0.5">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Role selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Select Role</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Shield className="h-4 w-4" />
                </span>
                <select
                  {...register("role")}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 pl-10 pr-4 text-sm text-slate-100 outline-none transition-all focus:border-brand-500/80 focus:bg-slate-900"
                >
                  <option value="sales">Sales Representative</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-500 active:scale-98 disabled:opacity-40"
            >
              <UserPlus className="h-4.5 w-4.5" />
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
