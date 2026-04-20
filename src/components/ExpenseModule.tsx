import React, { useState } from 'react';
import { ChevronLeft, Plus, Pencil, Trash2, Eye, Upload, Camera, CheckCircle2, AlertCircle, Loader2, Wallet, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Expense } from '@/src/types';
import { cn } from '@/lib/utils';

export default function ExpenseModule() {
  const [startDate, setStartDate] = useState('2025-08-01');
  const [endDate, setEndDate] = useState('2025-08-31');
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', date: '16th Aug, 2025', name: 'Travel', km: 15, fareAllow: 150 }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Partial<Expense>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingDates, setIsSubmittingDates] = useState(false);
  const [expenseErrors, setExpenseErrors] = useState<{ name?: string; fareAllow?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapturePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Photo captured: ${file.name}`);
      setCurrentExpense(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const handleAddExpense = () => {
    setCurrentExpense({ date: '16th Aug, 2025' });
    setExpenseErrors({});
    setIsDialogOpen(true);
  };

  const validateExpense = () => {
    const errors: { name?: string; fareAllow?: string } = {};
    if (!currentExpense.name) errors.name = "Expense name is required";
    if (!currentExpense.fareAllow) errors.fareAllow = "Amount is required";
    setExpenseErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveExpense = async () => {
    if (validateExpense()) {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (currentExpense.id) {
        setExpenses(expenses.map(e => e.id === currentExpense.id ? currentExpense as Expense : e));
      } else {
        setExpenses([...expenses, { ...currentExpense, id: Math.random().toString() } as Expense]);
      }
      setIsSaving(false);
      setIsDialogOpen(false);
      toast.success("Expense Saved", {
        icon: <CheckCircle2 className="text-emerald-500" size={18} />
      });
    } else {
      toast.error("Validation Error", {
        description: "Please fill in all required fields."
      });
    }
  };

  const handleSubmitDates = async () => {
    setIsSubmittingDates(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmittingDates(false);
    toast.success("Date range submitted successfully");
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50">
      {/* Premium Pharma Header */}
      <header className="bg-gradient-to-br from-[#004d35] via-[#005c41] to-[#006847] text-white p-6 pb-16 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="expense-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#expense-grid)" />
          </svg>
        </div>

        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md">
              <Wallet size={24} className="text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Expense Manager</h1>
              <p className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-widest">Generate & Track Claims</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-3 -mt-10 space-y-4 relative z-20 pb-24">
        {/* Date Selection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-none shadow-xl rounded-2xl bg-white overflow-hidden">
            <div className="bg-emerald-50/50 px-4 py-2 border-b border-emerald-100/50">
              <h3 className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={12} /> Date Range Selection
              </h3>
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</Label>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="h-9 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-700 focus-visible:ring-emerald-500/20" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</Label>
                  <Input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="h-9 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-700 focus-visible:ring-emerald-500/20" 
                  />
                </div>
              </div>
              <Button 
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg shadow-emerald-900/10 transition-all text-[10px] tracking-widest uppercase"
                onClick={handleSubmitDates}
                disabled={isSubmittingDates}
              >
                {isSubmittingDates ? <Loader2 className="animate-spin" size={16} /> : "Submit Range"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-white shadow-md rounded-full text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border border-emerald-100 group"
          >
            Generate Expense <Eye size={14} className="group-hover:text-emerald-500 transition-colors" />
          </motion.button>
        </div>

        {/* Expense List */}
        <div className="space-y-3">
          {expenses.map((exp, idx) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2"
            >
              {/* Visit Info Card */}
              <Card className="bg-purple-50/50 border-none shadow-sm rounded-xl overflow-hidden border-l-4 border-purple-400">
                <CardContent className="p-3 space-y-3">
                  <div className="flex justify-between items-center border-b border-purple-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-purple-600 shadow-sm">
                        <Calendar size={14} />
                      </div>
                      <span className="font-black text-[11px] text-slate-800 tracking-tight">{exp.date}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <motion.button whileTap={{ scale: 0.9 }} onClick={handleAddExpense} className="bg-white text-emerald-600 p-1.5 rounded-lg shadow-sm border border-emerald-100"><Plus size={14} /></motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setCurrentExpense(exp); setIsDialogOpen(true); }} className="bg-white text-amber-600 p-1.5 rounded-lg shadow-sm border border-amber-100"><Pencil size={14} /></motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} className="bg-white text-blue-600 p-1.5 rounded-lg shadow-sm border border-blue-100"><Upload size={14} /></motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Visit Type</p>
                      <p className="text-[10px] font-bold text-slate-700">HEAD QUARTER</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">From / To</p>
                      <p className="text-[10px] font-bold text-slate-700">NATUNHUT → NATUNHUT</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expense Details Card */}
              <Card className="bg-emerald-50/50 border-none shadow-sm rounded-xl overflow-hidden border-l-4 border-emerald-400">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1">
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-emerald-600/60 uppercase tracking-widest">Expense Name</p>
                        <p className="text-[10px] font-bold text-slate-700">{exp.name}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-emerald-600/60 uppercase tracking-widest">KM / Fare</p>
                        <p className="text-[10px] font-bold text-slate-700">{exp.km} KM • ₹{exp.fareAllow}</p>
                      </div>
                      <div className="col-span-2 space-y-0.5">
                        <p className="text-[8px] font-black text-emerald-600/60 uppercase tracking-widest">Attachment</p>
                        <p className="text-[10px] font-bold text-slate-500 italic truncate">{exp.fileName || 'No receipt attached'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 ml-4">
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setCurrentExpense(exp); setIsDialogOpen(true); }} className="w-8 h-8 bg-white text-amber-600 flex items-center justify-center rounded-lg shadow-sm border border-amber-100"><Pencil size={14} /></motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} className="w-8 h-8 bg-white text-rose-600 flex items-center justify-center rounded-lg shadow-sm border border-rose-100"><Trash2 size={14} /></motion.button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] rounded-[2rem] border-none p-0 overflow-hidden bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-[#004d35] to-[#006847] p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-black tracking-tight uppercase">Expense Details</DialogTitle>
              <p className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-widest">{currentExpense.date}</p>
            </DialogHeader>
          </div>
          
          <div className="p-6 space-y-5">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleCapturePhoto}
            />
            
            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex justify-center"
            >
              <Button 
                variant="outline" 
                className="w-full h-28 border-dashed border-2 border-emerald-100 bg-emerald-50/30 flex flex-col gap-2 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all rounded-2xl"
                onClick={triggerCamera}
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-600">
                  <Camera size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Capture Receipt Photo</span>
              </Button>
            </motion.div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className={cn("text-[9px] font-black uppercase tracking-widest ml-1", expenseErrors.name ? 'text-rose-500' : 'text-slate-400')}>Expense Name</Label>
                <Input 
                  placeholder="e.g., Travel, Food, Hotel"
                  value={currentExpense.name || ''} 
                  onChange={(e) => {
                    setCurrentExpense({...currentExpense, name: e.target.value});
                    if (expenseErrors.name) setExpenseErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  className={cn(
                    "h-10 bg-slate-50 border-none rounded-xl font-bold text-slate-700 focus-visible:ring-emerald-500/20",
                    expenseErrors.name && "ring-1 ring-rose-500"
                  )}
                />
                {expenseErrors.name && <p className="text-rose-500 text-[9px] font-bold ml-1 flex items-center gap-1"><AlertCircle size={10} /> {expenseErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Distance (KM)</Label>
                  <Input 
                    type="number"
                    placeholder="0"
                    value={currentExpense.km || ''} 
                    onChange={(e) => setCurrentExpense({...currentExpense, km: parseInt(e.target.value)})}
                    className="h-10 bg-slate-50 border-none rounded-xl font-bold text-slate-700 focus-visible:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className={cn("text-[9px] font-black uppercase tracking-widest ml-1", expenseErrors.fareAllow ? 'text-rose-500' : 'text-slate-400')}>Amount (₹)</Label>
                  <Input 
                    type="number"
                    placeholder="0.00"
                    value={currentExpense.fareAllow || ''} 
                    onChange={(e) => {
                      setCurrentExpense({...currentExpense, fareAllow: parseInt(e.target.value)});
                      if (expenseErrors.fareAllow) setExpenseErrors(prev => ({ ...prev, fareAllow: undefined }));
                    }}
                    className={cn(
                      "h-10 bg-slate-50 border-none rounded-xl font-bold text-slate-700 focus-visible:ring-emerald-500/20",
                      expenseErrors.fareAllow && "ring-1 ring-rose-500"
                    )}
                  />
                  {expenseErrors.fareAllow && <p className="text-rose-500 text-[9px] font-bold ml-1 flex items-center gap-1"><AlertCircle size={10} /> {expenseErrors.fareAllow}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 text-slate-500 font-black h-11 rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-100">Cancel</Button>
            <Button 
              onClick={handleSaveExpense} 
              disabled={isSaving} 
              className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg shadow-emerald-900/20 relative overflow-hidden group transition-all text-[10px] uppercase tracking-widest"
            >
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.div 
                    key="saving"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="animate-spin" size={14} />
                    <span>Saving...</span>
                  </motion.div>
                ) : (
                  <motion.span 
                    key="save"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    Save Entry
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
