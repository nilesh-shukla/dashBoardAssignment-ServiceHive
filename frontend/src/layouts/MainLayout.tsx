import React from "react";
import Navbar from "../components/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Background glowing effects for premium dashboard aesthetic */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-brand-500/10 blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] h-[70%] w-[50%] rounded-full bg-violet-500/5 blur-[100px]"></div>
      </div>

      <Navbar />

      <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col">
        {children}
      </main>

      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} SmartLeads. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;

