import React from 'react';
import { User, FlaskConical, Home, Map, FileText, Wallet, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const tabs = [
    { id: 'doctor', label: 'Doctor', icon: User },
    { id: 'chemist', label: 'Chemist', icon: FlaskConical },
    { id: 'tour', label: 'Tour', icon: Map },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dcr', label: 'DCR', icon: FileText },
    { id: 'expense', label: 'Expense', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
  ];

  return (
    <div className="mobile-container">
      <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch]">
        {children}
      </main>

      <nav className="bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around items-center h-[72px] px-1 z-50 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 outline-none"
            >
              <div className={cn(
                "relative z-10 transition-all duration-300 flex flex-col items-center gap-1",
                isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
              )}>
                <div className={cn(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive ? "bg-emerald-50 scale-110" : "bg-transparent"
                )}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-tight transition-all duration-300",
                  isActive ? "text-emerald-700" : "text-slate-400"
                )}>
                  {tab.label}
                </span>
              </div>
              
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute top-0 w-12 h-1 bg-emerald-500 rounded-b-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
