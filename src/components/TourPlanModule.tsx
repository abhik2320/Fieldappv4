import React, { useState } from 'react';
import { Calendar as CalendarIcon, Pencil, ChevronLeft, Plus, Save, Send, Download, Search, Filter, CheckCircle2, X, Check, MoreVertical, ChevronRight, MapPin, Clock, ShieldCheck, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TourPlan, TourDay, Status } from '@/src/types';
import { MOCK_TOUR_PLANS } from '@/src/mockData';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function TourPlanModule() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedPlan, setSelectedPlan] = useState<TourPlan | null>(null);
  const [plans, setPlans] = useState<TourPlan[]>(MOCK_TOUR_PLANS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [pendingMonth, setPendingMonth] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const availableMonths = [
    "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026"
  ].filter(m => !plans.some(p => p.monthYear === m));

  const handleAddMonth = (month: string) => {
    const newPlan: TourPlan = {
      id: Math.random().toString(),
      monthYear: month,
      status: 'Incomplete',
      days: Array.from({ length: 30 }, (_, i) => ({
        date: `${i + 1}th ${month}`,
        nature: 'Field Work',
        visitType: 'HEAD QUARTER',
        from: 'NATUNHUT',
        to: 'NATUNHUT'
      }))
    };
    setPlans([newPlan, ...plans]);
    toast.success(`Tour plan for ${month} created!`);
    return newPlan;
  };

  const handleDelete = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    toast.success("Tour plan deleted successfully");
  };

  const filteredPlans = plans.filter(p => {
    const s = search.toLowerCase();
    const matchesSearch = p.monthYear.toLowerCase().includes(s);
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (view === 'detail' && selectedPlan) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="tour-detail"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="h-full"
        >
          <TourPlanDetail 
            plan={selectedPlan} 
            isReadOnly={isReadOnly}
            onBack={() => setView('list')} 
            onSave={(updatedPlan) => {
              setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
              setView('list');
              toast.success("Tour plan updated successfully!");
            }}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 font-sans">
      {/* Premium Pharma Header */}
      <header className="bg-gradient-to-br from-[#004d35] via-[#005c41] to-[#006847] text-white p-6 pb-16 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="corp-grid-tour" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#corp-grid-tour)" />
          </svg>
        </div>

        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md">
              <CalendarIcon size={24} className="text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Tour Programme</h1>
              <p className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-widest">Monthly Travel Planning</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20"
                >
                  <Plus size={22} />
                </motion.button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 bg-white rounded-2xl border-none shadow-2xl" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Select Month</h3>
                    <CalendarIcon size={14} className="text-emerald-500" />
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {availableMonths.map(month => (
                      <button
                        key={month}
                        onClick={() => setPendingMonth(month)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between group",
                          pendingMonth === month 
                            ? "bg-emerald-600 text-white shadow-md" 
                            : "hover:bg-emerald-50 text-slate-600 hover:text-emerald-700"
                        )}
                      >
                        {month}
                        {pendingMonth === month && <Check size={12} />}
                      </button>
                    ))}
                    {availableMonths.length === 0 && (
                      <p className="text-center text-[10px] text-slate-400 py-4 font-bold italic">All months planned</p>
                    )}
                  </div>

                  <Button 
                    disabled={!pendingMonth}
                    onClick={() => {
                      if (pendingMonth) {
                        const newPlan = handleAddMonth(pendingMonth);
                        setSelectedPlan(newPlan);
                        setIsReadOnly(false);
                        setView('detail');
                        setIsPopoverOpen(false);
                        setPendingMonth(null);
                      }
                    }}
                    className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg transition-all text-[10px] tracking-widest uppercase"
                  >
                    Confirm Selection
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <div className="p-3 -mt-10 space-y-3 relative z-20 pb-8">
        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
            <Input 
              placeholder="Search months..." 
              className="pl-10 h-9 bg-white border-none shadow-lg rounded-xl text-xs font-medium focus-visible:ring-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "h-9 w-9 p-0 bg-white border-none shadow-lg rounded-xl flex items-center justify-center transition-colors",
                  filterStatus !== 'all' ? "text-emerald-600" : "text-slate-400"
                )}
              >
                <Filter size={16} />
                {filterStatus !== 'all' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4 bg-white rounded-2xl border-none shadow-2xl" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Filters</h3>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:bg-transparent"
                    onClick={() => setFilterStatus('all')}
                  >
                    Reset
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-8 border-slate-100 rounded-lg bg-slate-50/50 font-bold text-slate-800 text-[11px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="all" className="text-[11px] font-bold">All Status</SelectItem>
                      {['Pending', 'Approved', 'Rejected', 'Incomplete'].map(status => (
                        <SelectItem key={status} value={status} className="text-[11px] font-bold">
                          {status === 'Pending' ? 'Pending for Approval' : status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </motion.div>

        {/* Tour Plan List */}
        <div className="space-y-1.5">
          <AnimatePresence>
            {filteredPlans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                layout
              >
                <Card className="border-none shadow-sm rounded-xl bg-slate-50/50 overflow-hidden group hover:shadow-md hover:bg-white transition-all duration-300 relative border border-slate-100/30">
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 group-hover:w-1",
                    plan.status === 'Approved' ? "bg-emerald-500" : 
                    plan.status === 'Rejected' ? "bg-rose-500" : 
                    plan.status === 'Incomplete' ? "bg-amber-400" : "bg-blue-400"
                  )}></div>

                  <CardContent className="p-3 pl-5 relative">
                    {/* Status Badge - Absolute Top Right Corner */}
                    <div className={cn(
                      "absolute top-3 right-3 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest transition-all duration-300 z-10 shadow-sm",
                      plan.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" : 
                      plan.status === 'Rejected' ? "bg-rose-50 text-rose-600 border border-rose-100/50" : 
                      plan.status === 'Incomplete' ? "bg-amber-50 text-amber-600 border border-amber-100/50" :
                      "bg-blue-50 text-blue-600 border border-blue-100/50"
                    )}>
                      {plan.status === 'Pending' ? 'Pending for Approval' : plan.status}
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Info Section */}
                      <div className="flex items-center gap-4">
                        {/* Icon Section */}
                        <div className="shrink-0">
                          <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-500 border border-slate-100 group-hover:border-emerald-100 shadow-inner">
                            <CalendarIcon size={22} strokeWidth={1.5} />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 pr-16">
                          <h3 className="text-[15px] font-black text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors leading-none">
                            {plan.monthYear}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              plan.status === 'Approved' ? "bg-emerald-500" : 
                              plan.status === 'Rejected' ? "bg-rose-500" : 
                              plan.status === 'Incomplete' ? "bg-amber-400" : "bg-blue-400"
                            )}></div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Monthly Schedule</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Action Buttons */}
                      <div className="flex items-center justify-end">
                        {/* Action Buttons Container - Bottom Right */}
                        <motion.div 
                          initial={{ x: 10, opacity: 0, scale: 0.9 }}
                          animate={{ x: 0, opacity: 1, scale: 1 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            delay: 0.1 
                          }}
                          className="flex gap-1.5 bg-slate-50/50 p-1 rounded-xl border border-slate-100/50 shrink-0 backdrop-blur-sm"
                        >
                          <motion.button 
                            whileHover={{ scale: 1.1, y: -1, backgroundColor: '#f0f9ff' }}
                            whileTap={{ scale: 0.9 }} 
                            className="w-8 h-8 flex items-center justify-center text-blue-600 rounded-lg transition-all bg-white shadow-sm border border-slate-100/50"
                            onClick={() => {
                              setSelectedPlan(plan);
                              setIsReadOnly(true);
                              setView('detail');
                            }}
                            title="View Details"
                          >
                            <Eye size={16} strokeWidth={2} />
                          </motion.button>
                          
                          {plan.status !== 'Approved' && (
                            <>
                              <motion.button 
                                whileHover={{ scale: 1.1, y: -1, backgroundColor: '#fffbeb' }}
                                whileTap={{ scale: 0.9 }} 
                                className="w-8 h-8 flex items-center justify-center text-amber-600 rounded-lg transition-all shadow-sm border border-slate-100/50 bg-white"
                                onClick={() => {
                                  setSelectedPlan(plan);
                                  setIsReadOnly(false);
                                  setView('detail');
                                }}
                                title="Edit Plan"
                              >
                                <Pencil size={16} strokeWidth={2} />
                              </motion.button>

                              <motion.button 
                                whileHover={{ scale: 1.1, y: -1, backgroundColor: '#fff1f2' }}
                                whileTap={{ scale: 0.9 }} 
                                onClick={() => handleDelete(plan.id)}
                                className="w-8 h-8 flex items-center justify-center text-rose-600 rounded-lg transition-all shadow-sm border border-slate-100/50 bg-white"
                                title="Delete Plan"
                              >
                                <Trash2 size={16} strokeWidth={2} />
                              </motion.button>
                            </>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredPlans.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon size={24} className="text-slate-300" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No plans found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TourPlanDetail({ plan, isReadOnly, onBack, onSave }: { plan: TourPlan, isReadOnly: boolean, onBack: () => void, onSave: (p: TourPlan) => void }) {
  const [days, setDays] = useState<(TourDay & { isDuplicate?: boolean })[]>(
    plan.days.map(day => ({ ...day, isDuplicate: false }))
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<TourDay | null>(null);

  const duplicateDay = (index: number) => {
    const newDays = [...days];
    const dayToDuplicate = { ...newDays[index], isDuplicate: true, isEdited: false };
    newDays.splice(index + 1, 0, dayToDuplicate);
    setDays(newDays);
    toast.success(`Entry for ${dayToDuplicate.date} duplicated`);
  };

  const deleteDay = (index: number) => {
    const dayToDelete = days[index];
    const newDays = days.filter((_, i) => i !== index);
    setDays(newDays);
    toast.success(`Entry for ${dayToDelete.date} removed`);
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...days[index] });
  };

  const handleEditSave = () => {
    if (editingIndex !== null && editForm) {
      const newDays = [...days];
      newDays[editingIndex] = { ...editForm, isEdited: true };
      setDays(newDays);
      setEditingIndex(null);
      setEditForm(null);
      toast.success("Entry updated successfully");
    }
  };

  const natureOptions = ["Field Work", "Meeting", "Leave", "Holiday", "Transit", "Office Work"];
  const visitTypeOptions = ["HEAD QUARTER", "EX-STATION", "OUT-STATION"];
  const locationOptions = ["NATUNHUT", "KOLKATA", "SILIGURI", "DURGAPUR", "MALDA", "ASANSOL"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Simplified Corporate Header */}
      <header className="bg-gradient-to-r from-[#003d2a] to-[#005c41] text-white px-6 py-4 shadow-lg relative overflow-hidden shrink-0">
        <div className="flex items-center justify-between relative z-10">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack} 
            className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 backdrop-blur-md"
          >
            <ChevronLeft size={18} />
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-lg font-black tracking-tight uppercase">TOUR PLAN</h1>
            <p className="text-[9px] font-bold text-emerald-200 uppercase tracking-widest">{plan.monthYear}</p>
          </div>

          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
            <CalendarIcon size={16} className="text-emerald-300" />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-3 space-y-3 max-w-xl mx-auto pb-24"
        >
          {days.map((day, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className={cn(
                "border-none shadow-sm rounded-2xl overflow-hidden border border-slate-100/50 group transition-all duration-300",
                day.isEdited
                  ? "bg-blue-50/60 border-blue-100/50"
                  : day.isDuplicate 
                    ? "bg-amber-50/60 border-amber-100/50" 
                    : "bg-emerald-50/60 border-emerald-100/50"
              )}>
                <CardContent className="p-3 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center",
                        day.isEdited ? "bg-blue-100/50" : day.isDuplicate ? "bg-amber-100/50" : "bg-emerald-50"
                      )}>
                        <CalendarIcon size={12} className={day.isEdited ? "text-blue-600" : day.isDuplicate ? "text-amber-600" : "text-emerald-600"} />
                      </div>
                      <span className="font-black text-slate-800 text-[11px] uppercase tracking-tight">{day.date}</span>
                    </div>
                    {!isReadOnly && (
                      <div className="flex gap-1.5">
                        <motion.button 
                          whileTap={{ scale: 0.9 }} 
                          onClick={() => handleEditClick(idx)}
                          className="w-6 h-6 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm border border-blue-100/50"
                        >
                          <Pencil size={10} />
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.9 }} 
                          onClick={() => duplicateDay(idx)}
                          className="w-6 h-6 bg-amber-50 text-amber-600 rounded-md flex items-center justify-center hover:bg-amber-100 transition-colors shadow-sm border border-amber-100/50"
                        >
                          <Plus size={10} />
                        </motion.button>
                        {day.isDuplicate && (
                          <motion.button 
                            whileTap={{ scale: 0.9 }} 
                            onClick={() => deleteDay(idx)}
                            className="w-6 h-6 bg-rose-50 text-rose-600 rounded-md flex items-center justify-center hover:bg-rose-100 transition-colors shadow-sm border border-rose-100/50"
                          >
                            <Trash2 size={10} />
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Nature of Work</span>
                      <p className="text-[10px] font-bold text-slate-700">{day.nature}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Visit Type</span>
                      <p className="text-[10px] font-bold text-slate-700">{day.visitType}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">From</span>
                      <p className="text-[10px] font-bold text-slate-700">{day.from}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">To</span>
                      <p className="text-[10px] font-bold text-slate-700">{day.to}</p>
                    </div>
                  </div>

                  {day.remarks && (
                    <div className="mt-2 pt-2 border-t border-slate-50 space-y-0.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Remarks</span>
                      <p className="text-[10px] font-medium text-slate-600 italic">"{day.remarks}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {!isReadOnly && (
            <div className="pt-4 space-y-3">
              <motion.div variants={itemVariants}>
                <Button 
                  className="w-full h-11 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-black rounded-xl shadow-sm transition-all text-[10px] tracking-[0.1em] uppercase flex items-center justify-center gap-2"
                  onClick={() => onSave({ ...plan, days, status: 'Incomplete' })}
                >
                  <Save size={14} />
                  Save as Draft
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg transition-all text-[10px] tracking-[0.1em] uppercase group flex items-center justify-center gap-2"
                  onClick={() => onSave({ ...plan, days, status: 'Pending' })}
                >
                  <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Submit for Approval
                  <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  variant="ghost"
                  className="w-full h-11 text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-black rounded-xl transition-all text-[10px] tracking-[0.1em] uppercase flex items-center justify-center gap-2"
                  onClick={onBack}
                >
                  <X size={14} />
                  Cancel
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && setEditingIndex(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-[#003d2a] to-[#005c41] p-6 text-white">
            <DialogTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Pencil size={18} className="text-emerald-400" />
              Edit Schedule
            </DialogTitle>
            <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mt-1">{editForm?.date}</p>
          </DialogHeader>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nature of Work</Label>
                <Select 
                  value={editForm?.nature} 
                  onValueChange={(val) => setEditForm(prev => prev ? { ...prev, nature: val } : null)}
                >
                  <SelectTrigger className="h-10 border-slate-100 rounded-xl bg-slate-50/50 font-bold text-slate-800 text-[11px] focus:ring-emerald-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    {natureOptions.map(opt => (
                      <SelectItem key={opt} value={opt} className="text-[11px] font-bold focus:bg-emerald-50 focus:text-emerald-600">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Visit Type</Label>
                <Select 
                  value={editForm?.visitType} 
                  onValueChange={(val) => setEditForm(prev => prev ? { ...prev, visitType: val } : null)}
                >
                  <SelectTrigger className="h-10 border-slate-100 rounded-xl bg-slate-50/50 font-bold text-slate-800 text-[11px] focus:ring-emerald-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    {visitTypeOptions.map(opt => (
                      <SelectItem key={opt} value={opt} className="text-[11px] font-bold focus:bg-emerald-50 focus:text-emerald-600">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">From</Label>
                <Select 
                  value={editForm?.from} 
                  onValueChange={(val) => setEditForm(prev => prev ? { ...prev, from: val } : null)}
                >
                  <SelectTrigger className="h-10 border-slate-100 rounded-xl bg-slate-50/50 font-bold text-slate-800 text-[11px] focus:ring-emerald-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    {locationOptions.map(opt => (
                      <SelectItem key={opt} value={opt} className="text-[11px] font-bold focus:bg-emerald-50 focus:text-emerald-600">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">To</Label>
                <Select 
                  value={editForm?.to} 
                  onValueChange={(val) => setEditForm(prev => prev ? { ...prev, to: val } : null)}
                >
                  <SelectTrigger className="h-10 border-slate-100 rounded-xl bg-slate-50/50 font-bold text-slate-800 text-[11px] focus:ring-emerald-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    {locationOptions.map(opt => (
                      <SelectItem key={opt} value={opt} className="text-[11px] font-bold focus:bg-emerald-50 focus:text-emerald-600">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Remarks</Label>
              <Textarea 
                placeholder="Add any additional notes here..."
                className="min-h-[80px] border-slate-100 rounded-xl bg-slate-50/50 font-medium text-slate-800 text-[11px] resize-none focus-visible:ring-emerald-500/20"
                value={editForm?.remarks || ''}
                onChange={(e) => setEditForm(prev => prev ? { ...prev, remarks: e.target.value } : null)}
              />
            </div>
          </div>

          <DialogFooter className="p-6 pt-0">
            <Button 
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg transition-all text-[10px] tracking-[0.1em] uppercase flex items-center justify-center gap-2"
              onClick={handleEditSave}
            >
              <Check size={14} />
              Update Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
