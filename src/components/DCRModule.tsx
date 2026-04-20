import React, { useState } from 'react';
import { ChevronRight, Info, Pencil, Trash2, Plus, MapPin, CheckCircle2, Loader2, FileText, User, ShieldCheck, ShoppingBag, FlaskConical, History, Power, Wallet, Upload, X, TrendingUp, Check, Minus, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { DCR, DCREntry, MiscExpense } from '@/src/types';
import { MOCK_DCRS, MOCK_DOCTORS, MOCK_CHEMISTS } from '@/src/mockData';
import { cn } from '@/lib/utils';

const AVAILABLE_SAMPLES = ['Symphony-X', 'Vitality-Z', 'Nu-Core', 'Glow-Max', 'Pure-Vita'];
const AVAILABLE_LEAVE_BEHINDS = ['Sample Pen', 'Desk Calendar', 'Product Brochure', 'Medical Journal', 'Branded Pad'];

export default function DCRModule({ onStatusChange }: { onStatusChange?: (status: 'Draft' | 'Started' | 'Completed') => void }) {
  const [dcr, setDcr] = useState<DCR>(MOCK_DCRS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!dcr.date) newErrors.date = 'Required';
    if (!dcr.workNature) newErrors.workNature = 'Required';
    if (!dcr.visitType) newErrors.visitType = 'Required';
    if (!dcr.fromLocation) newErrors.fromLocation = 'Required';
    if (!dcr.toLocation) newErrors.toLocation = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartDay = async () => {
    if (validate()) {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      const updatedDcr = { ...dcr, status: 'Started' as const };
      setDcr(updatedDcr);
      onStatusChange?.('Started');
      toast.success("Day Started Successfully", {
        description: "You are now in the field. Report your visits as you go.",
        icon: <CheckCircle2 className="text-emerald-500" size={18} />
      });
    } else {
      toast.error("Please fill all required fields correctly");
    }
  };

  const isStarted = dcr.status === 'Started' || dcr.status === 'Completed';

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 pb-24">
      {/* Dynamic Header */}
      <header className="bg-gradient-to-br from-[#004d35] via-[#005c41] to-[#006847] text-white p-6 pb-16 rounded-b-[3rem] shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="dcr-single-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dcr-single-pattern)" />
          </svg>
        </div>

        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-md">
                <FileText size={20} className="text-emerald-300" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none uppercase">Report Center</h1>
                <div className="flex items-center gap-2 mt-1.5 font-bold">
                  <p className="text-[9px] text-emerald-300/80 uppercase tracking-widest leading-none">
                    {isStarted ? 'In-Field Live' : 'Day Activation'}
                  </p>
                  {dcr.headquarter && (
                    <div className="flex items-center gap-2">
                       <div className="w-[1px] h-3 bg-emerald-300/30" />
                       <div className="flex items-center gap-1">
                          <MapPin size={10} className="text-emerald-400" />
                          <p className="text-[9px] text-white uppercase tracking-widest leading-none">HQ: {dcr.headquarter}</p>
                       </div>
                    </div>
                  )}
                </div>
                {!isStarted && (
                  <div className="flex items-center gap-1.5 mt-2 bg-amber-400/20 px-2.5 py-1 rounded-xl border border-amber-400/20 backdrop-blur-md inline-flex">
                    <History size={12} className="text-amber-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.15em]">Last Report: <span className="text-amber-400 ml-1">12 Oct</span></span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {isStarted && (
             <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-400/20">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
               <span className="text-[9px] font-black text-white uppercase tracking-widest">Active Session</span>
             </div>
          )}
        </div>
      </header>

      <div className="px-4 -mt-10 space-y-4 relative z-20">
        <div className="space-y-4">
          {/* Day Logistics Card - Persistent */}
          <Card className={cn(
            "border-none shadow-xl rounded-3xl overflow-hidden transition-all duration-500",
            (dcr.status === 'Draft') && !isEditingConfig ? "bg-[#3d0808] text-white" : "bg-white ring-1 ring-slate-100"
          )}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
                  (dcr.status === 'Draft') && !isEditingConfig ? "bg-rose-500/10 border-rose-500/20 text-rose-300" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                )}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest leading-none">Day Configuration</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {(dcr.status !== 'Draft' || isEditingConfig) && (
                      <p className="text-[10px] font-bold text-emerald-600/80 truncate max-w-[150px]">
                        {dcr.fromLocation} → {dcr.toLocation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {dcr.status === 'Draft' && !isEditingConfig && (
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditingConfig(true)}
                    className="h-8 px-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-rose-300 text-[9px] font-black uppercase tracking-widest"
                   >
                     <Pencil size={12} className="mr-1" /> Modify
                   </Button>
                )}
                {dcr.status === 'Draft' && !isEditingConfig && <div className="px-3 py-1 bg-rose-500/20 rounded-full border border-rose-500/30 text-[8px] font-black uppercase tracking-widest text-rose-400">LOCKED</div>}
                {dcr.status === 'Draft' && isEditingConfig && <div className="px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-[8px] font-black uppercase tracking-widest text-emerald-400">OPEN</div>}
                {isStarted && <div className="px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-[8px] font-black uppercase tracking-widest text-emerald-400">CONFIRMED</div>}
              </div>
            </div>

            <div className="overflow-hidden border-t border-slate-50/10">
              <div className="p-4 space-y-4 pb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className={cn("text-[9px] font-black uppercase tracking-widest ml-1", (dcr.status === 'Draft') && !isEditingConfig ? "text-rose-300/60" : "text-slate-900")}>Report Date</Label>
                    <Input 
                      type="date" 
                      value={dcr.date} 
                      disabled={!isEditingConfig}
                      onChange={(e) => setDcr({...dcr, date: e.target.value})} 
                      className={cn(
                        "h-9 border-none rounded-xl text-[11px] font-black transition-colors ring-1 ring-slate-100",
                        (dcr.status === 'Draft') && !isEditingConfig ? "bg-white/5 text-white" : "bg-slate-50 text-slate-800"
                      )} 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className={cn("text-[9px] font-black uppercase tracking-widest ml-1", (dcr.status === 'Draft') && !isEditingConfig ? "text-rose-300/60" : "text-slate-900")}>Work Nature</Label>
                    <Select disabled={!isEditingConfig} value={dcr.workNature} onValueChange={(v) => setDcr({...dcr, workNature: v})}>
                      <SelectTrigger className={cn(
                        "h-9 border-none rounded-xl text-[11px] font-black transition-colors ring-1 ring-slate-100",
                        (dcr.status === 'Draft') && !isEditingConfig ? "bg-white/5 text-white" : "bg-slate-50 text-slate-800"
                      )}>
                         <SelectValue placeholder="Select Nature" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none">
                        {['Field Work', 'Office Work', 'Meeting'].map(opt => (
                          <SelectItem key={opt} value={opt} className="text-xs font-bold">{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className={cn("text-[9px] font-black uppercase tracking-widest ml-1", (dcr.status === 'Draft') && !isEditingConfig ? "text-rose-300/60" : "text-slate-900")}>Visit Type</Label>
                  <Select disabled={!isEditingConfig} value={dcr.visitType} onValueChange={(v) => setDcr({...dcr, visitType: v})}>
                    <SelectTrigger className={cn(
                      "h-9 border-none rounded-xl text-[11px] font-black transition-colors ring-1 ring-slate-100",
                      (dcr.status === 'Draft') && !isEditingConfig ? "bg-white/5 text-white" : "bg-slate-50 text-slate-800"
                    )}>
                       <SelectValue placeholder="Select Visit Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none">
                      {['HEAD QUARTER', 'EX-STATION', 'OUT-STATION'].map(opt => (
                        <SelectItem key={opt} value={opt} className="text-xs font-bold">{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.visitType && <p className="text-[8px] text-rose-500 font-bold ml-2 uppercase tracking-widest">{errors.visitType}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className={cn("text-[9px] font-black uppercase tracking-widest ml-1", (dcr.status === 'Draft') && !isEditingConfig ? "text-rose-300/60" : "text-slate-900")}>From Location</Label>
                    <Select disabled={!isEditingConfig} value={dcr.fromLocation} onValueChange={(v) => setDcr({...dcr, fromLocation: v})}>
                      <SelectTrigger className={cn(
                        "h-9 border-none rounded-xl text-[11px] font-black transition-colors ring-1 ring-slate-100",
                        (dcr.status === 'Draft') && !isEditingConfig ? "bg-white/5 text-white" : "bg-slate-50 text-slate-800"
                      )}>
                         <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none">
                        {['NATUNHUT', 'GARIA', 'BEHALA', 'SALT LAKE', 'ASANSOL', 'HOWRAH', 'KOLKATA'].map(loc => (
                          <SelectItem key={loc} value={loc} className="text-xs font-bold">{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className={cn("text-[9px] font-black uppercase tracking-widest ml-1", (dcr.status === 'Draft') && !isEditingConfig ? "text-rose-300/60" : "text-slate-900")}>To Location</Label>
                    <Select disabled={!isEditingConfig} value={dcr.toLocation} onValueChange={(v) => setDcr({...dcr, toLocation: v})}>
                      <SelectTrigger className={cn(
                        "h-9 border-none rounded-xl text-[11px] font-black transition-colors ring-1 ring-slate-100",
                        (dcr.status === 'Draft') && !isEditingConfig ? "bg-white/5 text-white" : "bg-slate-50 text-slate-800"
                      )}>
                         <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none">
                        {['NATUNHUT', 'GARIA', 'BEHALA', 'SALT LAKE', 'ASANSOL', 'HOWRAH', 'KOLKATA'].map(loc => (
                          <SelectItem key={loc} value={loc} className="text-xs font-bold">{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {dcr.status === 'Draft' && (
                  <Button 
                    className={cn(
                      "w-full h-12 text-white font-black rounded-2xl text-[11px] tracking-[0.2em] uppercase transition-all shadow-xl group",
                      isEditingConfig && dcr.date && dcr.workNature && dcr.visitType && dcr.fromLocation && dcr.toLocation
                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20" 
                        : "bg-slate-300 opacity-50 cursor-not-allowed shadow-none"
                    )}
                    onClick={handleStartDay}
                    disabled={!isEditingConfig || isSubmitting || !dcr.date || !dcr.workNature || !dcr.visitType || !dcr.fromLocation || !dcr.toLocation}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>Initialize Field Day <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Reporting Section - Integrated */}
          {isStarted && (
            <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <DCRList 
                dcr={dcr} 
                onUpdateEntry={(updatedEntry) => {
                  setDcr(prev => {
                    const exists = prev.entries.some(e => e.id === updatedEntry.id);
                    return {
                      ...prev,
                      entries: exists 
                        ? prev.entries.map(e => e.id === updatedEntry.id ? updatedEntry : e)
                        : [...prev.entries, updatedEntry]
                    };
                  });
                }}
                onDeleteEntry={(entryId) => {
                  setDcr(prev => ({
                    ...prev,
                    entries: prev.entries.filter(e => e.id !== entryId)
                  }));
                }}
                onSave={(data) => {
                  setDcr(data);
                  onStatusChange?.(data.status);
                  toast.success("Final DCR Submitted Successfully!");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DCRList({ dcr, onUpdateEntry, onDeleteEntry, onSave }: { dcr: DCR, onUpdateEntry: (e: DCREntry) => void, onDeleteEntry: (id: string) => void, onSave: (d: DCR) => void }) {
  const [category, setCategory] = useState<'Doctor' | 'Chemist' | 'Stockist' | 'Non-Listed Doctor' | null>('Doctor');
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DCREntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sign-Off States (Inline)
  const [remarks, setRemarks] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [editableDistance, setEditableDistance] = useState(dcr.distance || 0);
  const [miscExpenses, setMiscExpenses] = useState<MiscExpense[]>(dcr.miscExpenses || []);

  // Visit Reporting States (Inline)
  const [visitRemarks, setVisitRemarks] = useState('');
  const [visitSamples, setVisitSamples] = useState<string[]>([]);
  const [visitLeaveBehinds, setVisitLeaveBehinds] = useState<{name: string, quantity: number}[]>([]);

  const masterList = category === 'Doctor' ? MOCK_DOCTORS : category === 'Chemist' ? MOCK_CHEMISTS : [];
  const filteredEntries = category ? dcr.entries.filter(e => e.type === category) : [];
  const loggedIds = new Set(filteredEntries.map(e => e.targetId));
  const filteredMaster = masterList.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !loggedIds.has(m.id)
  );

  const categories = [
    { id: 'Doctor', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'Chemist', icon: FlaskConical, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'Stockist', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'Non-Listed Doctor', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const totalVisits = dcr.entries.length;
  const doctorCount = dcr.entries.filter(e => e.type === 'Doctor').length;
  const chemistCount = dcr.entries.filter(e => e.type === 'Chemist').length;
  const stockistCount = dcr.entries.filter(e => e.type === 'Stockist').length;
  const unlistedCount = dcr.entries.filter(e => e.type === 'Non-Listed Doctor').length;
  const completedVisits = dcr.entries.filter(e => e.remarks).length;

  const handleEndDay = async () => {
    setIsFinalSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const docUrls = files.map(f => URL.createObjectURL(f));
    const finalizedDcr = {
      ...dcr,
      status: 'Completed' as const,
      endDayRemarks: remarks,
      distance: editableDistance,
      expenseDocs: docUrls,
      miscExpenses: miscExpenses
    };
    setIsFinalSubmitting(false);
    onSave(finalizedDcr);
  };

  const handleUpdateVisit = () => {
    if (!editingEntry) return;
    const updated = {
      ...editingEntry,
      remarks: visitRemarks,
      samples: visitSamples,
      leaveBehinds: visitLeaveBehinds
    };
    onUpdateEntry(updated);
    setEditingEntry(null);
    setVisitRemarks('');
    setVisitSamples([]);
    setVisitLeaveBehinds([]);
    toast.success("Visit Reported Successfully");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
   
  const addMiscExpense = (type: string) => {
    const newExp: MiscExpense = {
      id: `misc-${Date.now()}`,
      type: type === 'Other' ? '' : type,
      amount: 0,
      attachments: []
    };
    setMiscExpenses([...miscExpenses, newExp]);
  };

  const updateMiscExpense = (id: string, updates: Partial<MiscExpense>) => {
    setMiscExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const removeMiscExpense = (id: string) => {
    setMiscExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const handleMiscFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = (Array.from(e.target.files) as File[]).map(f => URL.createObjectURL(f));
      updateMiscExpense(id, { attachments: [...(miscExpenses.find(ex => ex.id === id)?.attachments || []), ...newFiles] });
    }
  };

  const isCompleted = dcr.status === 'Completed';
  const totalMiscExpense = miscExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalExpense = (dcr.expenseAmount || 0) + (dcr.allowanceAmount || 0) + totalMiscExpense;

  return (
    <div className="flex flex-col space-y-4">
      {/* Progress Monitor */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xs font-black uppercase text-slate-800 tracking-widest leading-none">Day Progress</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{dcr.date}</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{completedVisits} / {totalVisits} Logged</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id as any);
                setEditingEntry(null);
              }}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all duration-300",
                category === cat.id ? "bg-emerald-50 border-emerald-200 shadow-sm" : "bg-slate-50 border-transparent opacity-60"
              )}
            >
              <div className={cn("p-1.5 rounded-lg", cat.bg, cat.color)}>
                <cat.icon size={16} />
              </div>
              <span className="text-[7px] font-black uppercase text-slate-600 text-center truncate w-full">
                {cat.id}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* INLINE VISIT ENTRY AREA */}
      {!isCompleted && editingEntry && (
        <div className="bg-white rounded-[2rem] p-6 border-2 border-emerald-500 shadow-2xl space-y-6 animate-in zoom-in-95 duration-500 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
              <ClipboardCheck size={120} className="text-emerald-900" />
           </div>

           <div className="flex items-center justify-between border-b border-slate-50 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                    <Pencil size={20} />
                 </div>
                 <div>
                    <h4 className="text-[13px] font-black uppercase tracking-tight text-slate-900 leading-none">Reporting Visit</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{editingEntry.targetName || 'Manual Call Entry'}</p>
                 </div>
              </div>
              <button onClick={() => setEditingEntry(null)} className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-90">
                 <X size={18} />
              </button>
           </div>
           
           <div className="space-y-6 relative z-10">
              {editingEntry.type === 'Non-Listed Doctor' && (
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-900">Practitioner Name</Label>
                  <Input 
                    value={editingEntry.targetName || ''}
                    onChange={(e) => setEditingEntry({...editingEntry, targetName: e.target.value})}
                    placeholder="Enter full name"
                    className="h-11 bg-slate-50 border-none rounded-2xl text-[11px] font-bold shadow-inner"
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-400">Products Detailed</Label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SAMPLES.map(sample => (
                    <button
                      key={sample}
                      onClick={() => {
                        const exists = visitSamples.includes(sample);
                        setVisitSamples(exists 
                          ? visitSamples.filter(s => s !== sample)
                          : [...visitSamples, sample]
                        );
                      }}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border",
                        visitSamples.includes(sample)
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                          : "bg-white border-slate-100 text-slate-400 hover:border-emerald-200"
                      )}
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-400">Leave Behinds</Label>
                  <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest px-2 py-0.5 bg-amber-50 rounded-full">{visitLeaveBehinds.length} ITEMS</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Select onValueChange={(val) => {
                    if (val && !visitLeaveBehinds.find(lb => lb.name === val)) {
                      setVisitLeaveBehinds(prev => [...prev, { name: val, quantity: 1 }]);
                    }
                  }}>
                    <SelectTrigger className="h-11 bg-slate-50/50 border-slate-100 border-dashed border-2 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-none">
                       <Plus size={14} className="mr-2" /> Add Giveaway
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {AVAILABLE_LEAVE_BEHINDS.map(item => (
                        <SelectItem key={item} value={item} disabled={visitLeaveBehinds.some(l => l.name === item)} className="font-bold py-3 text-[10px] uppercase">{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2">
                    {visitLeaveBehinds.map((lb, idx) => (
                      <div key={idx} className="bg-emerald-50/50 border border-emerald-100 rounded-xl px-3 py-2 flex items-center gap-3">
                        <span className="text-[9px] font-black text-emerald-800 uppercase tracking-tight">{lb.name}</span>
                        <div className="flex items-center gap-1.5 bg-white rounded-lg p-0.5 border border-emerald-100/50">
                          <button onClick={() => setVisitLeaveBehinds(prev => prev.map((l, i) => i === idx ? {...l, quantity: Math.max(1, l.quantity - 1)} : l))} className="w-5 h-5 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"><Minus size={10} /></button>
                          <span className="text-[10px] font-black text-slate-800 w-4 text-center">{lb.quantity}</span>
                          <button onClick={() => setVisitLeaveBehinds(prev => prev.map((l, i) => i === idx ? {...l, quantity: l.quantity + 1} : l))} className="w-5 h-5 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"><Plus size={10} /></button>
                        </div>
                        <button onClick={() => setVisitLeaveBehinds(prev => prev.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-rose-500"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                   <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Interaction Remarks</Label>
                   <div className="flex gap-1.5">
                     {['Done', 'Postive', 'FollowUp'].map(tag => (
                       <button key={tag} onClick={() => setVisitRemarks(prev => prev ? `${prev}, ${tag}` : tag)} className="text-[8px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full hover:bg-emerald-500 hover:text-white transition-all whitespace-nowrap">{tag}</button>
                     ))}
                   </div>
                </div>
                <Textarea 
                  value={visitRemarks}
                  onChange={(e) => setVisitRemarks(e.target.value)}
                  placeholder="Summarize call interaction..."
                  className="bg-slate-50 border-none rounded-[1.5rem] text-[11px] font-bold p-5 resize-none min-h-[140px] shadow-inner outline-none ring-0 placeholder:text-slate-300"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 h-14 bg-slate-50 border-none rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all text-slate-400"
                  onClick={() => setEditingEntry(null)}
                >
                  Discard
                </Button>
                <Button 
                  className="flex-[2] h-14 bg-slate-900 hover:bg-black text-white font-black rounded-[1.5rem] text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group"
                  onClick={handleUpdateVisit}
                  disabled={!visitRemarks.trim()}
                >
                  Finalize Entry Log <Check size={18} className="ml-2 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
           </div>
        </div>
      )}

      {/* SEARCH AREA */}
      {!isCompleted && category && !editingEntry && (
        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input 
              placeholder={`Search ${category}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-9 bg-white border-slate-100 rounded-xl text-[10px] font-bold ring-1 ring-slate-100 focus-visible:ring-emerald-500/20"
            />
          </div>

          {category === 'Non-Listed Doctor' && (
            <Button 
              variant="outline"
              className="w-full h-12 border-dashed border-2 border-emerald-200 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 rounded-2xl flex items-center justify-center gap-2"
              onClick={() => {
                setSearchQuery('');
                setVisitRemarks('');
                setVisitSamples([]);
                setVisitLeaveBehinds([]);
                setEditingEntry({
                  id: `new-${Date.now()}`,
                  type: category,
                  targetId: '',
                  targetName: '',
                  superiors: [],
                  samples: [],
                  remarks: ''
                });
              }}
            >
              <Plus size={14} /> Manual {category} Entry
            </Button>
          )}
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {!category ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 grayscale opacity-30">
               <div className="w-14 h-14 bg-slate-100 rounded-3xl flex items-center justify-center">
                  <User size={28} className="text-slate-400" />
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Select a category to view reports</p>
            </div>
          ) : !editingEntry && (
            <div className="space-y-6">
              {/* Logged Visits Section */}
              {filteredEntries.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Logged Visits ({filteredEntries.length})</p>
                    <div className="h-px flex-1 mx-3 bg-emerald-100" />
                  </div>
                  {filteredEntries.map((entry, idx) => (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="border-none shadow-sm rounded-2xl overflow-hidden group transition-all duration-300 bg-white ring-1 ring-slate-100">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex gap-3 min-w-0">
                               <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-emerald-50 border-emerald-100 text-emerald-600">
                                 <CheckCircle2 size={18} />
                               </div>
                               <div className="min-w-0">
                                 <h4 className="text-[13px] font-black text-slate-800 tracking-tight truncate leading-none mb-1">{entry.targetName || 'Incomplete Entry'}</h4>
                                 <div className="flex items-center gap-1.5 mt-1">
                                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{entry.type}</p>
                                   <span className="w-1 h-1 rounded-full bg-slate-200" />
                                   {(() => {
                                     const target = entry.type === 'Doctor' 
                                       ? MOCK_DOCTORS.find(d => d.id === entry.targetId) 
                                       : MOCK_CHEMISTS.find(c => c.id === entry.targetId);
                                     return target?.headquarter && (
                                       <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">HQ: {target.headquarter}</p>
                                     );
                                   })()}
                                 </div>
                               </div>
                            </div>
                            {!isCompleted && (
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-8 h-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                  onClick={() => {
                                    setVisitRemarks(entry.remarks);
                                    setVisitSamples(entry.samples || []);
                                    setVisitLeaveBehinds(entry.leaveBehinds || []);
                                    setEditingEntry(entry);
                                  }}
                                >
                                  <Pencil size={14} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-8 h-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  onClick={() => onDeleteEntry(entry.id)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Master List Section */}
              {!isCompleted && filteredMaster.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Available {category} List</p>
                    <div className="h-px flex-1 mx-3 bg-slate-100/50" />
                  </div>
                  {filteredMaster.map((target, idx) => (
                    <motion.div
                      key={target.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <Card className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100 overflow-hidden hover:ring-emerald-200 transition-all active:scale-[0.98]" 
                        onClick={() => {
                          setVisitRemarks('');
                          setVisitSamples([]);
                          setVisitLeaveBehinds([]);
                          setEditingEntry({
                            id: `new-${Date.now()}`,
                            type: category as any,
                            targetId: target.id,
                            targetName: target.name,
                            superiors: [],
                            samples: [],
                            remarks: ''
                          });
                        }}
                      >
                        <CardContent className="p-3 flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
                                {category === 'Doctor' ? <User size={14} /> : <FlaskConical size={14} />}
                             </div>
                             <div>
                                <h4 className="text-[11px] font-black text-slate-800 tracking-tight leading-none mb-0.5">{target.name}</h4>
                                <div className="flex items-center gap-1.5">
                                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{target.area}</p>
                                   <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                                   <p className="text-[8px] font-black text-emerald-600/60 uppercase tracking-widest">HQ: {target.headquarter}</p>
                                </div>
                             </div>
                          </div>
                          <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg border border-emerald-100 shadow-sm transition-transform active:scale-90">
                             <Plus size={12} />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* INLINE SIGN-OFF AREA - THE 'MODAL ELIMINATION' */}
      {dcr.status === 'Started' && !editingEntry && (
        <div className="space-y-6 pt-10 border-t border-slate-200 border-dashed animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-3 px-1">
             <div className="w-12 h-12 bg-emerald-50 rounded-[1.25rem] flex items-center justify-center border border-emerald-100 shadow-sm">
                <Power size={22} className="text-emerald-500" />
             </div>
             <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none">Day Sign-Off</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Submit terminal reporting & expenses</p>
             </div>
          </div>

          <div className="space-y-6">
            {/* REFINED EXPENSE DETAILS - MATCHING DAY CONFIG STYLE */}
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white ring-1 ring-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-emerald-50 border-emerald-100 text-emerald-600">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest leading-none">Expense Details</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-widest">
                         Submission Audit • {dcr.date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest text-emerald-500">READY</div>
                </div>
              </div>

              <div className="overflow-hidden border-t border-slate-50">
                <div className="p-4 space-y-4 pb-6">

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-900">Origin Location</Label>
                      <div className="h-9 bg-slate-50 border-none rounded-xl text-[11px] font-black flex items-center px-3 text-slate-700 ring-1 ring-slate-100/50">
                        {dcr.fromLocation}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-900">Destination</Label>
                      <div className="h-9 bg-slate-50 border-none rounded-xl text-[11px] font-black flex items-center px-3 text-slate-700 ring-1 ring-slate-100/50">
                        {dcr.toLocation}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-900">Distance (KM)</Label>
                      <Input 
                        type="number" 
                        value={editableDistance} 
                        onChange={(e) => setEditableDistance(parseInt(e.target.value) || 0)}
                        className="h-9 bg-slate-50 border-none rounded-xl text-[11px] font-black ring-1 ring-slate-100/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-900">Headquarter</Label>
                      <div className="h-9 bg-slate-50 border-none rounded-xl text-[11px] font-black flex items-center px-3 text-slate-700 ring-1 ring-slate-100/50">
                        {dcr.headquarter || 'None'}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 bg-emerald-600 p-4 rounded-2xl border border-emerald-700/10 flex items-center justify-between shadow-lg shadow-emerald-900/10 transition-transform active:scale-[0.99] group mt-2">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                          <TrendingUp size={16} />
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-[9px] font-black text-white/70 uppercase tracking-widest leading-none">Total Claim Amount</p>
                        </div>
                     </div>
                     <p className="text-2xl font-black text-white tracking-tighter tabular-nums leading-none">₹{totalExpense.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* MISCELLANEOUS EXPENSES - DYNAMIC LIST */}
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white ring-1 ring-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="p-4 flex items-center justify-between border-b border-slate-50">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-blue-50 border-blue-100 text-blue-600">
                        <ShoppingBag size={20} />
                     </div>
                     <div>
                        <h3 className="text-xs font-black uppercase tracking-widest leading-none">Miscellaneous Exp.</h3>
                        <p className="text-[10px] font-bold text-blue-600/80 uppercase tracking-widest mt-1">Travel, Stay & Other bills</p>
                     </div>
                  </div>
                  <Select onValueChange={(val: string) => addMiscExpense(val)}>
                     <SelectTrigger className="w-32 h-9 rounded-xl bg-emerald-50 border-none text-[9px] font-black uppercase tracking-widest ring-1 ring-emerald-100/50 hover:bg-emerald-100 transition-colors text-emerald-700">
                        <Plus size={14} className="mr-1.5 text-emerald-500 stroke-[3px]" /> <SelectValue placeholder="ADD NEW" />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl border-none">
                        {['Train ticket', 'Flight', 'Bus', 'Auto', 'Hotel', 'Other'].map(opt => (
                           <SelectItem key={opt} value={opt} className="text-xs font-bold uppercase">{opt}</SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <div className="p-4 space-y-3">
                  {miscExpenses.length === 0 ? (
                     <div className="py-8 flex flex-col items-center justify-center text-center opacity-40 grayscale">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                           <ShoppingBag size={20} className="text-slate-400" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest">No additional claims added</p>
                     </div>
                  ) : (
                     <div className="space-y-3">
                        {miscExpenses.map((exp) => (
                           <div key={exp.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3 relative group">
                              <button 
                                 onClick={() => removeMiscExpense(exp.id)}
                                 className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 shadow-sm transition-all"
                              >
                                 <X size={14} />
                              </button>

                              <div className="grid grid-cols-2 gap-3">
                                 <div className="space-y-1">
                                    <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-600">Expense Type</Label>
                                    {['Train ticket', 'Flight', 'Bus', 'Auto', 'Hotel'].includes(exp.type) ? (
                                       <div className="h-9 flex items-center px-4 bg-white border border-slate-100 rounded-xl text-[11px] font-black text-slate-800 uppercase ring-1 ring-slate-100/50">
                                          {exp.type}
                                       </div>
                                    ) : (
                                       <Input 
                                          value={exp.type}
                                          onChange={(e) => updateMiscExpense(exp.id, { type: e.target.value })}
                                          placeholder="Specify type..."
                                          className="h-9 bg-white border-slate-100 rounded-xl text-[11px] font-black ring-1 ring-slate-100/50"
                                       />
                                    )}
                                 </div>
                                 <div className="space-y-1">
                                    <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-600">Amount (₹)</Label>
                                    <Input 
                                       type="number"
                                       value={exp.amount || ''}
                                       onChange={(e) => updateMiscExpense(exp.id, { amount: parseInt(e.target.value) || 0 })}
                                       placeholder="0"
                                       className="h-9 bg-white border-slate-100 rounded-xl text-[11px] font-black ring-1 ring-slate-100/50"
                                    />
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <div className="flex items-center justify-between">
                                    <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-400">Bills & Vouchers</Label>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{exp.attachments.length} Files Attached</span>
                                 </div>
                                 <div className="flex flex-wrap gap-2">
                                    {exp.attachments.map((url, i) => (
                                       <div key={i} className="relative group/file">
                                          <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm p-1">
                                             <FileText size={14} className="text-blue-400" />
                                          </div>
                                          <button 
                                             onClick={() => updateMiscExpense(exp.id, { attachments: exp.attachments.filter((_, idx) => idx !== i) })}
                                             className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover/file:opacity-100 transition-opacity"
                                          >
                                             <X size={8} />
                                          </button>
                                       </div>
                                    ))}
                                    <label className="w-10 h-10 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-white cursor-pointer transition-all">
                                       <Plus size={14} />
                                       <input type="file" multiple className="hidden" onChange={(e) => handleMiscFileChange(exp.id, e)} />
                                    </label>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </Card>

            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100 relative overflow-hidden flex flex-col justify-center ring-1 ring-slate-100">
               <div className="relative space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                     <Info size={14} className="text-emerald-500" />
                     <Label className="text-[10px] font-black text-slate-800 uppercase tracking-widest text-slate-600">Summary Remarks</Label>
                  </div>
                  <Textarea 
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Today's fieldwork summary..."
                    className="bg-slate-50 border-none rounded-2xl text-[11px] font-bold text-slate-800 placeholder:text-slate-400 resize-none min-h-[120px] p-5 focus-visible:ring-1 focus-visible:ring-emerald-500/30 shadow-inner outline-none ring-0"
                  />
               </div>
            </div>

            <Button 
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-[2rem] shadow-2xl shadow-emerald-900/20 transition-all text-[12px] tracking-[0.25em] uppercase group active:scale-[0.98]"
              onClick={handleEndDay}
              disabled={!remarks.trim() || isFinalSubmitting}
            >
              {isFinalSubmitting ? <Loader2 className="animate-spin text-white" size={24} /> : (
                <div className="flex items-center gap-3">
                   Initialize Final Report Sync 
                   <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" /> 
                </div>
              )}
            </Button>
          </div>
        </div>
      )}
      
      {isCompleted && (
        <div className="space-y-4 pt-10">
          <div className="bg-white border-2 border-emerald-100 rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-700 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
             <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm ring-1 ring-emerald-100 mb-6">
                <CheckCircle2 size={40} className="text-emerald-500" />
             </div>
             <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Sync Successful</h3>
             <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest opacity-60 mt-1">Field report transmitted to corporate</p>
             
             <div className="grid grid-cols-2 gap-3 pt-6">
               <div className="bg-blue-50/50 p-4 rounded-[1.5rem] border border-blue-100 flex flex-col justify-center items-center">
                  <p className="text-[7px] font-black text-blue-600 uppercase tracking-widest mb-1 leading-none">Doctors</p>
                  <p className="text-lg font-black text-blue-700">{doctorCount}</p>
               </div>
               <div className="bg-emerald-50/50 p-4 rounded-[1.5rem] border border-emerald-100 flex flex-col justify-center items-center">
                  <p className="text-[7px] font-black text-emerald-600 uppercase tracking-widest mb-1 leading-none">Chemists</p>
                  <p className="text-lg font-black text-emerald-700">{chemistCount}</p>
               </div>
               <div className="bg-amber-50/50 p-4 rounded-[1.5rem] border border-amber-100 flex flex-col justify-center items-center">
                  <p className="text-[7px] font-black text-amber-600 uppercase tracking-widest mb-1 leading-none">Stockists</p>
                  <p className="text-lg font-black text-amber-700">{stockistCount}</p>
               </div>
               <div className="bg-purple-50/50 p-4 rounded-[1.5rem] border border-purple-100 flex flex-col justify-center items-center">
                  <p className="text-[7px] font-black text-purple-600 uppercase tracking-widest mb-1 leading-none">Unlisted</p>
                  <p className="text-lg font-black text-purple-700">{unlistedCount}</p>
               </div>

               <div className="col-span-2 bg-emerald-50/50 p-6 rounded-[2.25rem] border border-emerald-100 flex flex-col justify-center items-center mt-2 shadow-inner">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1 leading-none">Total Claim Amount</p>
                  <p className="text-3xl font-black text-emerald-700 leading-none tracking-tighter">₹{totalExpense.toLocaleString()}</p>
               </div>
             </div>

             <Button 
                className="w-full h-14 bg-slate-900 shadow-2xl text-white font-black rounded-[1.75rem] text-[11px] tracking-[0.3em] uppercase mt-10 transition-all active:scale-95"
                onClick={() => window.location.reload()}
              >
                Launch New Cycle
              </Button>
          </div>
        </div>
      )}
    </div>
  );
}
