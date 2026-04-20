import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, FlaskConical, Map, FileText, Wallet, Bell, Settings, Activity, ShieldCheck, ChevronRight, Target, LogOut, Clock, Calendar, MapPin, TrendingUp, BarChart3, PieChart as PieChartIcon, CheckCircle2, XCircle, AlertCircle, ShoppingBag, ArrowUpRight, ArrowDownRight, Zap, History, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar, PolarAngleAxis, LabelList } from 'recharts';

export default function HomeModule({ onTabChange, onLogout }: { onTabChange: (tab: string) => void, onLogout: () => void }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [address, setAddress] = useState<string>("Detecting location...");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddress(`${position.coords.latitude.toFixed(4)}°N, ${position.coords.longitude.toFixed(4)}°E`);
        },
        (error) => {
          setAddress("Location access denied");
        }
      );
    }

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'Total Doctors', value: '124', icon: User, color: 'bg-blue-500', tab: 'doctor', trend: '+4 this week' },
    { label: 'Total Chemists', value: '86', icon: FlaskConical, color: 'bg-emerald-500', tab: 'chemist', trend: '+2 this week' },
  ];

  const chartData = [
    { name: 'Mon', calls: 12 },
    { name: 'Tue', calls: 18 },
    { name: 'Wed', calls: 15 },
    { name: 'Thu', calls: 22 },
    { name: 'Fri', calls: 20 },
    { name: 'Sat', calls: 8 },
    { name: 'Sun', calls: 0 },
  ];

  const missedCallsData = [
    { month: 'Aug', calls: 42 },
    { month: 'Sep', calls: 35 },
    { month: 'Oct', calls: 28 },
  ];

  const salesPerformanceData = [
    { month: 'Aug', target: 400000, achievement: 380000 },
    { month: 'Sep', target: 450000, achievement: 410000 },
    { month: 'Oct', target: 500000, achievement: 420000 },
  ];

  const callAverageData = [
    { month: 'May', avg: 12.5 },
    { month: 'Jun', avg: 14.2 },
    { month: 'Jul', avg: 13.8 },
    { month: 'Aug', avg: 15.1 },
    { month: 'Sep', avg: 14.5 },
    { month: 'Oct', avg: 16.2 },
  ];

  const targetVsSaleData = [
    { name: 'Achievement', value: 84, fill: '#10b981' }
  ];

  const highRiskProducts = [
    { name: 'CardioPlus 50mg', risk: 'High', stock: 12, trend: 'down' },
    { name: 'NeuroFix Forte', risk: 'High', stock: 8, trend: 'up' },
    { name: 'GastroRelief', risk: 'Medium', stock: 24, trend: 'stable' },
  ];

  const simulatePushNotification = () => {
    toast("Compliance Alert", {
      description: "Your DCR for yesterday is pending submission. Please complete it to maintain 100% compliance.",
      action: {
        label: "Submit Now",
        onClick: () => onTabChange('dcr')
      },
      icon: <Activity className="text-red-500" size={16} />
    });
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 font-sans">
      {/* Premium Pharma Header */}
      <header className="bg-gradient-to-br from-[#004d35] via-[#005c41] to-[#006847] text-white p-5 pb-16 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden shrink-0">
        {/* Abstract Medical Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="hex" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0 L40 10 L40 30 L20 40 L0 30 L0 10 Z" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hex)" />
          </svg>
        </div>

        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5"
            >
              <div className="w-4 h-[1.5px] bg-emerald-400/50 rounded-full"></div>
              <p className="text-emerald-300/80 text-[9px] font-black uppercase tracking-[0.3em]">Pharma Executive</p>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              className="text-xl font-black tracking-tighter text-white leading-none"
            >
              Abhik Mitra
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.3 }}
              className="text-[8px] font-bold text-white uppercase tracking-[0.2em]"
            >
              System ID • FE-2024-0892
            </motion.p>
          </div>

          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={simulatePushNotification}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shadow-xl backdrop-blur-md relative group"
            >
              <Bell size={18} className="text-white/70" />
              <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border border-[#005c41]"></span>
              </span>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shadow-xl backdrop-blur-md"
            >
              <LogOut size={18} className="text-white/70" />
            </motion.button>
          </div>
        </div>
      </header>

      <div className="p-4 -mt-10 space-y-3 relative z-20 pb-6">
        {/* Row 1: Status Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-lg rounded-2xl bg-white/90 backdrop-blur-md overflow-hidden group">
              <div className="h-1 bg-emerald-500 w-full"></div>
              <CardContent className="p-2.5">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-600">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-[7px] font-black uppercase tracking-widest text-slate-400">Tour Cycle</h3>
                    <p className="text-[11px] font-black text-slate-900 leading-none">APPROVED</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-none shadow-lg rounded-2xl bg-white/90 backdrop-blur-md overflow-hidden group">
              <div className="h-1 bg-blue-500 w-full"></div>
              <CardContent className="p-2.5">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500/10 p-1.5 rounded-lg text-blue-600">
                    <History size={18} />
                  </div>
                  <div>
                    <h3 className="text-[7px] font-black uppercase tracking-widest text-slate-400">Last DCR</h3>
                    <p className="text-[11px] font-black text-slate-900 leading-none">12 OCT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Row 2: Sales Performance (More Compact) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-none shadow-xl rounded-[1.5rem] bg-slate-900 p-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-[40px]"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="bg-white/10 p-1.5 rounded-lg text-emerald-400 border border-white/10 backdrop-blur-md">
                  <Target size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-tight leading-none">Sales Target</h3>
                  <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Oct Performance</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-400 font-mono">84%</p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Target</p>
                  <p className="text-sm font-black text-white font-mono">₹ 5.0L</p>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <p className="text-[7px] font-bold text-emerald-400/50 uppercase tracking-widest mb-0.5">Achieved</p>
                  <p className="text-sm font-black text-emerald-400 font-mono">₹ 4.2L</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Row 3: Stats Grid (High Density) */}
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + (idx * 0.1) }}
            >
              <Card 
                className="border-none shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden bg-white"
                onClick={() => onTabChange(stat.tab)}
              >
                <CardContent className="p-2.5 flex items-center gap-2.5">
                  <div className={`${stat.color} p-2 rounded-xl text-white shadow-md`}>
                    <stat.icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-800 leading-none truncate">{stat.value}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Row 4: Call Average & Missed Calls (Compact Row) */}
        <div className="grid grid-cols-2 gap-2.5">
          <Card 
            className="border-none shadow-md rounded-2xl bg-white p-3 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => onTabChange('reports')}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                <Activity size={14} />
              </div>
              <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider">Average</h3>
            </div>
            <p className="text-xl font-black text-blue-600 font-mono leading-none">16.2</p>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Calls / Day</p>
          </Card>

          <Card className="border-none shadow-md rounded-2xl bg-white p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-red-50 p-1.5 rounded-lg text-red-500">
                <XCircle size={14} />
              </div>
              <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider">Missed</h3>
            </div>
            <p className="text-xl font-black text-red-600 font-mono leading-none">28</p>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Oct</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
