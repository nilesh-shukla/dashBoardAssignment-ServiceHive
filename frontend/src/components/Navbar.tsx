import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LogOut, UserCheck, ShieldAlert } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="glass-panel sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 px-4 py-3 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand identity */}
        <Link to="/" className="flex items-center gap-2 transition-transform active:scale-95">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-violet-400 font-extrabold text-white shadow-md shadow-brand-500/20">
            ⚡
          </span>
          <div className="hidden sm:block">
            <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              SmartLeads
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-400">
              MERN Dashboard
            </p>
          </div>
        </Link>

        {/* User profile & controls */}
        {user && (
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden items-center gap-3 text-right sm:flex">
              <div>
                <p className="text-sm font-semibold text-slate-100">{user.name}</p>
                <p className="text-[11px] text-slate-400">{user.email}</p>
              </div>

              {/* Dynamic role badge */}
              {user.role === "admin" ? (
                <span className="flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400">
                  <ShieldAlert className="h-3 w-3" />
                  Admin
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-400">
                  <UserCheck className="h-3 w-3" />
                  Sales Rep
                </span>
              )}
            </div>

            {/* Logout controller */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-rose-500/10 hover:text-rose-400 active:scale-95"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
