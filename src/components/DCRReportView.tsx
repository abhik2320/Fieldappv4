import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, User, FlaskConical, ShoppingBag, MapPin, Clock, TrendingUp, Info, ArrowLeft, Download, Printer, CheckCircle2, Wallet, ShieldCheck, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_DOCTORS, MOCK_CHEMISTS } from '../mockData';
import { DCR } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DCRReportViewProps {
  dcr: DCR;
  onBack: () => void;
}

export default function DCRReportView({ dcr, onBack }: DCRReportViewProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Doctor: false,
    Chemist: false,
    Stockist: false,
    'Non-Listed Doctor': false,
    Expense: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const groupedEntries = {
    Doctor: dcr.entries.filter(e => e.type === 'Doctor'),
    Chemist: dcr.entries.filter(e => e.type === 'Chemist'),
    Stockist: dcr.entries.filter(e => e.type === 'Stockist'),
    'Non-Listed Doctor': dcr.entries.filter(e => e.type === 'Non-Listed Doctor'),
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    
    // Save current states
    const originalSections = { ...openSections };
    
    // Expand all sections for export
    setOpenSections({
      Doctor: true,
      Chemist: true,
      Stockist: true,
      'Non-Listed Doctor': true,
      Expense: true
    });

    // Wait for animations and re-render
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(reportRef.current!, {
          scale: 2, // Higher quality
          useCORS: true,
          logging: false,
          backgroundColor: '#f8fafc', // match slate-50
          windowWidth: reportRef.current?.scrollWidth,
          windowHeight: reportRef.current?.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width / 2, canvas.height / 2]
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`DCR_Report_${dcr.date}_${dcr.fromLocation}_to_${dcr.toLocation}.pdf`);
      } catch (error) {
        console.error("PDF Export failed:", error);
      } finally {
        // Restore original states
        setOpenSections(originalSections);
        setIsExporting(false);
      }
    }, 500); // Buffer for animation to complete
  };

  const SectionHeader = ({ id, title, icon: Icon, colorClass, count, subtitle, isOpen }: { id: string, title: string, icon: any, colorClass: string, count: number, subtitle?: string, isOpen: boolean }) => (
    <button 
      onClick={() => toggleSection(id)}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 transition-all duration-300", 
        colorClass,
        isOpen ? "rounded-t-2xl" : "rounded-2xl",
        "ring-1 ring-black/5 shadow-sm active:scale-[0.98]"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/40 p-1.5 rounded-lg">
          <Icon size={16} className="opacity-80" />
        </div>
        <div className="text-left">
          <h3 className="text-[11px] font-black uppercase tracking-[0.1em]">{title}</h3>
          <p className="text-[8px] font-bold opacity-60 uppercase">
            {subtitle || (count > 0 ? `${count} Total Visit${count !== 1 ? 's' : ''}` : 'Expand')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {!isOpen && (
          <div className="px-2 py-0.5 bg-black/5 rounded-md text-[8px] font-bold opacity-50 uppercase tracking-tighter">
            Expand
          </div>
        )}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "circOut" }}
        >
          <ChevronDown size={14} className="opacity-50" />
        </motion.div>
      </div>
    </button>
  );

  const VisitCard = ({ entry, idx }: { entry: any, idx: number, key?: string }) => (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white ring-1 ring-slate-100 transition-all hover:ring-opacity-50 mb-2">
       <div className="p-3 flex items-center justify-between border-b border-slate-50 bg-slate-50/20">
          <div className="flex items-center gap-2">
             <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 text-slate-500 text-[10px] font-black">
                {idx + 1}
             </div>
             <div>
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{entry.targetName}</h4>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{entry.type}</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[8px] font-black text-emerald-600 uppercase flex items-center justify-end gap-1">
                <CheckCircle2 size={10} /> Logged
             </p>
          </div>
       </div>
       <CardContent className="p-3 space-y-3">
          {entry.remarks && (
            <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
               <p className="text-[9px] font-medium text-slate-600 leading-relaxed italic">
                  "{entry.remarks}"
               </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {entry.samples && entry.samples.length > 0 && (
              <div className="space-y-1.5">
                 <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <ShoppingBag size={8} /> Samples Detailed
                 </p>
                 <div className="flex flex-wrap gap-1">
                    {entry.samples.map((s: any, si: number) => (
                      <span key={si} className="bg-slate-900 text-white text-[8px] font-bold px-2 py-0.5 rounded-md uppercase">
                         {s.name} <span className="opacity-50 ml-1">x{s.quantity}</span>
                      </span>
                    ))}
                 </div>
              </div>
            )}
            
            {entry.leaveBehinds && entry.leaveBehinds.length > 0 && (
              <div className="space-y-1.5">
                 <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Info size={8} /> Promotional
                 </p>
                 <div className="flex flex-wrap gap-1">
                    {entry.leaveBehinds.map((lb: any, li: number) => (
                      <span key={li} className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded-md border border-emerald-100 uppercase">
                         {lb.name} ({lb.quantity})
                      </span>
                    ))}
                 </div>
              </div>
            )}
          </div>
       </CardContent>
    </Card>
  );

  const totalMisc = dcr.miscExpenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const grandTotal = (dcr.expenseAmount || 0) + (dcr.allowanceAmount || 0) + totalMisc;

  return (
    <motion.div 
      ref={reportRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 pb-24"
    >
      {/* PLACE OF VISIT / LOGISTICS - FIRST SECTION */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-5 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-6 opacity-5 print:hidden">
            <FileText size={120} className="text-white" />
         </div>
         
         <div className="flex justify-between items-center mb-6 relative z-10">
            <button 
              onClick={onBack}
              className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white/50 hover:bg-white/20 transition-colors print:hidden"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex gap-2 print:hidden">
               <Button onClick={handlePrint} variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white">
                  <Printer size={16} />
               </Button>
               <Button 
                 onClick={handleExportPDF} 
                 disabled={isExporting}
                 className="h-8 bg-white text-slate-900 text-[9px] font-black uppercase tracking-widest px-4 rounded-xl shadow-lg"
               >
                  {isExporting ? (
                    <div className="flex items-center gap-2">
                       <Loader2 size={14} className="animate-spin" />
                       Scaling...
                    </div>
                  ) : (
                    <>
                       <Download size={14} className="mr-2" /> Export PDF
                    </>
                  )}
               </Button>
            </div>
         </div>

         <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <MapPin size={20} className="text-white" />
               </div>
               <div>
                  <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-0.5">Route Configuration</p>
                  <h2 className="text-lg font-black tracking-tighter uppercase">
                     {dcr.fromLocation} <span className="mx-2 opacity-30">→</span> {dcr.toLocation}
                  </h2>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
               <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <p className="text-[7px] font-black text-white/40 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-[10px] font-black uppercase">{dcr.date}</p>
               </div>
               <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <p className="text-[7px] font-black text-white/40 uppercase tracking-widest mb-1">HQ</p>
                  <p className="text-[10px] font-black uppercase">{dcr.headquarter || 'WEST BENGAL'}</p>
               </div>
               <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <p className="text-[7px] font-black text-white/40 uppercase tracking-widest mb-1">Distance</p>
                  <p className="text-[10px] font-black uppercase">{dcr.distance || 0} KM</p>
               </div>
            </div>
         </div>
      </div>

      {/* VISIT CATEGORIES */}
      <div className="space-y-3">
        {groupedEntries.Doctor.length > 0 && (
          <div>
            <SectionHeader 
              id="Doctor" 
              title="Doctor Visits" 
              icon={User} 
              colorClass="bg-blue-300/40 text-blue-900" 
              count={groupedEntries.Doctor.length} 
              isOpen={openSections.Doctor}
            />
            <AnimatePresence initial={false}>
              {openSections.Doctor && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pb-4 px-2 border-x-2 border-b-2 border-blue-200/50 rounded-b-2xl mb-4 bg-blue-50/10">
                    {groupedEntries.Doctor.map((e, i) => <VisitCard key={e.id} entry={e} idx={i} />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {groupedEntries.Chemist.length > 0 && (
          <div>
            <SectionHeader 
              id="Chemist" 
              title="Chemist Visits" 
              icon={FlaskConical} 
              colorClass="bg-emerald-300/40 text-emerald-900" 
              count={groupedEntries.Chemist.length} 
              isOpen={openSections.Chemist}
            />
            <AnimatePresence initial={false}>
              {openSections.Chemist && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pb-4 px-2 border-x-2 border-b-2 border-emerald-200/50 rounded-b-2xl mb-4 bg-emerald-50/10">
                    {groupedEntries.Chemist.map((e, i) => <VisitCard key={e.id} entry={e} idx={i} />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {groupedEntries.Stockist.length > 0 && (
          <div>
            <SectionHeader 
              id="Stockist" 
              title="Stockist Visits" 
              icon={ShoppingBag} 
              colorClass="bg-amber-300/40 text-amber-900" 
              count={groupedEntries.Stockist.length} 
              isOpen={openSections.Stockist}
            />
            <AnimatePresence initial={false}>
              {openSections.Stockist && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pb-4 px-2 border-x-2 border-b-2 border-amber-200/50 rounded-b-2xl mb-4 bg-amber-50/10">
                    {groupedEntries.Stockist.map((e, i) => <VisitCard key={e.id} entry={e} idx={i} />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {groupedEntries['Non-Listed Doctor'].length > 0 && (
          <div>
            <SectionHeader 
              id="Non-Listed Doctor" 
              title="Non-Listed Practitioner" 
              icon={ShieldCheck} 
              colorClass="bg-purple-300/40 text-purple-900" 
              count={groupedEntries['Non-Listed Doctor'].length} 
              isOpen={openSections['Non-Listed Doctor']}
            />
            <AnimatePresence initial={false}>
              {openSections['Non-Listed Doctor'] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pb-4 px-2 border-x-2 border-b-2 border-purple-200/50 rounded-b-2xl mb-4 bg-purple-50/10">
                    {groupedEntries['Non-Listed Doctor'].map((e, i) => <VisitCard key={e.id} entry={e} idx={i} />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* SUMMARY & EXPENSES - LAST SECTION */}
      <div className="space-y-3">
        <SectionHeader 
          id="Expense" 
          title="Expense Details" 
          icon={Wallet} 
          colorClass="bg-slate-200 text-slate-900" 
          count={0} 
          subtitle={`Total Expense: ₹${grandTotal}`}
          isOpen={openSections.Expense}
        />
        <AnimatePresence initial={false}>
          {openSections.Expense && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pb-8 px-2 border-x-2 border-b-2 border-slate-200/50 rounded-b-2xl mb-4 bg-slate-50/10">
                <div className="bg-white rounded-[2rem] p-5 shadow-xl ring-1 ring-slate-100 space-y-4">
                   <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                      <div className="flex items-center gap-2">
                         <Wallet size={16} className="text-slate-400" />
                         <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-800">Expense</h3>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Standard Expenses</p>
                         <p className="text-[13px] font-black text-slate-800">₹{(dcr.expenseAmount || 0) + (dcr.allowanceAmount || 0)}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Misc / Additional</p>
                         <p className="text-[13px] font-black text-emerald-600">₹{totalMisc}</p>
                      </div>
                   </div>

                   <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Grand Total Payable</p>
                      <p className="text-xl font-black text-slate-900 tracking-tighter">
                        ₹{grandTotal}
                      </p>
                   </div>
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-5 border border-slate-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Info size={40} className="text-slate-300" />
                   </div>
                   <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                     <TrendingUp size={10} /> Field Narrative
                   </h4>
                   <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                      {dcr.endDayRemarks || "No fieldwork summary provided for this date."}
                   </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
