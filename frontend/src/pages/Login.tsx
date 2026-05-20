import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login, loading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    // Clear auth errors when mounting
    clearError();
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 overflow-hidden">
      {/* Dynamic ambient glowing backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[60%] w-[50%] rounded-full bg-brand-500/10 blur-[130px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] h-[60%] w-[50%] rounded-full bg-violet-500/10 blur-[130px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo badge */}
        <div className="flex flex-col items-center mb-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-400 font-extrabold text-white shadow-xl shadow-brand-500/30">
            ⚡
          </span>
          <h2 className="mt-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
            Welcome to SmartLeads
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Identify, track, and close more deals.
          </p>
        </div>

        {/* Panel Form */}
        <div className="glass-panel rounded-3xl p-6 shadow-glass md:p-8">
          <h3 className="text-lg font-bold text-white mb-6">Sign In</h3>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
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

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-500 active:scale-98 disabled:opacity-40"
            >
              <LogIn className="h-4.5 w-4.5" />
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Quick test parameters */}
          <div className="mt-6 border-t border-slate-900 pt-4">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Test Accounts:</p>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
              <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-2">
                <span className="font-semibold text-rose-400 block mb-0.5">Admin Account</span>
                <span>admin@leads.com</span><br/>
                <span>Pass: admin123</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-2">
                <span className="font-semibold text-brand-400 block mb-0.5">Sales Account</span>
                <span>sales@leads.com</span><br/>
                <span>Pass: sales123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote links */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
