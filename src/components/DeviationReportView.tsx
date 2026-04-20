import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer, CheckCircle2, XCircle, AlertCircle, Calendar, MapPin, TrendingUp, ChevronRight, Info, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { DeviationReport } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DeviationReportViewProps {
  report: DeviationReport;
  onBack: () => void;
}

export default function DeviationReportView({ report, onBack }: DeviationReportViewProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fffcfc', // faint rose tint
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
      pdf.save(`Deviation_Report_${report.fromPeriod}_to_${report.toPeriod}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div 
      ref={reportRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24 px-4 bg-[#fffcfc]"
    >
      {/* Header Section */}
      <div className="bg-rose-900 text-white rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingUp size={140} className="text-white" />
        </div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white/50 hover:bg-white/20 transition-colors print:hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2 print:hidden">
            <Button onClick={handlePrint} variant="ghost" size="icon" className="h-10 w-10 text-white/50 hover:text-white">
              <Printer size={20} />
            </Button>
            <Button 
              onClick={handleExportPDF} 
              disabled={isExporting}
              className="h-10 bg-white text-rose-900 text-[10px] font-black uppercase tracking-widest px-6 rounded-2xl shadow-lg"
            >
              {isExporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Download size={16} className="mr-2" /> Export PDF
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
              <AlertCircle size={24} className="text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black text-rose-300 uppercase tracking-[0.3em] mb-1">Audit Record</p>
              <h2 className="text-xl font-black tracking-tighter uppercase leading-none">
                Deviation in Tour Programme
              </h2>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Reference Period</p>
              <p className="text-[11px] font-black uppercase tracking-tight">
                {report.fromPeriod} - {report.toPeriod}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Cycle Year</p>
              <p className="text-[11px] font-black uppercase tracking-tight">{report.cycle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Text */}
      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4">
        <p className="text-[10px] font-medium text-rose-900/70 italic leading-relaxed">
          "I have worked in the following places instead of the ones mentioned in my Tour Programme."
        </p>
      </div>

      {/* Deviation List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Detailed Deviations</h3>
        
        <div className="space-y-3">
          {report.entries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={cn(
                "border-none shadow-sm rounded-2xl overflow-hidden ring-1 transition-all",
                entry.status === 'Approved' ? "ring-emerald-100" : entry.status === 'Rejected' ? "ring-rose-100" : "ring-slate-100"
              )}>
                <div className="p-4 space-y-4">
                  {/* Row 1: Date & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Calendar size={14} className="text-slate-400" />
                       <span className="text-[11px] font-black text-slate-900">{entry.date}</span>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5",
                      entry.status === 'Approved' ? "bg-emerald-100 text-emerald-700" : entry.status === 'Rejected' ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                    )}>
                      {entry.status === 'Approved' ? (
                        <CheckCircle2 size={10} />
                      ) : entry.status === 'Rejected' ? (
                        <XCircle size={10} />
                      ) : (
                        <Info size={10} />
                      )}
                      {entry.status}
                    </div>
                  </div>

                  {/* Row 2: Comparison Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Planned Column */}
                    <div className="space-y-1.5 text-center">
                       <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Planned schedule</p>
                       <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-3 shadow-inner">
                          <div className="grid grid-cols-2 gap-2">
                             <div className="text-left">
                                <p className="text-[5px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Nature</p>
                                <p className="text-[8px] font-black text-slate-600 uppercase leading-none">{entry.plannedNature}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[5px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Visit Type</p>
                                <p className="text-[8px] font-black text-slate-600 uppercase leading-none">{entry.plannedVisitType}</p>
                             </div>
                          </div>
                          <div className="pt-2 border-t border-slate-200/50 flex flex-col items-center gap-1.5">
                             <div>
                                <p className="text-[5px] text-slate-400 font-bold uppercase tracking-widest mb-0.5 leading-none">From Location</p>
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter leading-none">{entry.plannedFrom}</p>
                             </div>
                             <div className="h-2 flex flex-col items-center justify-center opacity-30">
                                <ChevronDown size={8} />
                             </div>
                             <div>
                                <p className="text-[5px] text-slate-400 font-bold uppercase tracking-widest mb-0.5 leading-none">To Location</p>
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter leading-none">{entry.plannedTo}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Actual Column */}
                    <div className="space-y-1.5 text-center">
                       <p className="text-[7px] font-black text-emerald-500 uppercase tracking-widest leading-none">Actual activity</p>
                       <div className="bg-white border border-emerald-100 rounded-2xl p-3 space-y-3 shadow-sm ring-1 ring-emerald-50/50">
                          <div className="grid grid-cols-2 gap-2">
                             <div className="text-left">
                                <p className="text-[5px] text-emerald-400 font-bold uppercase tracking-widest mb-0.5">Nature</p>
                                <p className="text-[8px] font-black text-emerald-700 uppercase leading-none">{entry.actualNature}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[5px] text-emerald-400 font-bold uppercase tracking-widest mb-0.5">Visit Type</p>
                                <p className="text-[8px] font-black text-emerald-700 uppercase leading-none">{entry.actualVisitType}</p>
                             </div>
                          </div>
                          <div className="pt-2 border-t border-emerald-100/50 flex flex-col items-center gap-1.5">
                             <div>
                                <p className="text-[5px] text-emerald-400 font-bold uppercase tracking-widest mb-0.5 leading-none">From Location</p>
                                <p className="text-[10px] font-black text-emerald-900 uppercase tracking-tighter leading-none">{entry.actualFrom}</p>
                             </div>
                             <div className="h-2 flex flex-col items-center justify-center text-emerald-400">
                                <ChevronDown size={8} />
                             </div>
                             <div>
                                <p className="text-[5px] text-emerald-400 font-bold uppercase tracking-widest mb-0.5 leading-none">To Location</p>
                                <p className="text-[10px] font-black text-emerald-900 uppercase tracking-tighter leading-none truncate w-full">{entry.actualTo}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Row 3: Reason */}
                  <div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Reason for Deviation</p>
                    <p className="text-[10px] font-medium text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100 italic">
                      {entry.reason}
                    </p>
                  </div>

                  {entry.remarks && (
                    <div className="pt-3 border-t border-slate-50">
                       <p className="text-[8px] font-bold text-rose-400 uppercase tracking-widest mb-1">Supervisor Remarks</p>
                       <p className="text-[10px] font-black text-rose-600 uppercase tracking-tight">{entry.remarks}</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-center opacity-60">
        <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center">
          <CheckCircle2 size={24} className="text-slate-200" />
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">End of Deviation Report</p>
          <p className="text-[8px] font-medium text-slate-300 uppercase mt-1">Generated by PharmaPortal ERP</p>
        </div>
      </div>
    </motion.div>
  );
}
