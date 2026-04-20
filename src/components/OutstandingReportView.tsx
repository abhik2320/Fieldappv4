import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Download, Printer, User, FileText, ShoppingBag, MapPin, Calculator, Calendar, ArrowDownRight, Tag, Boxes, ShieldCheck, Receipt, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OutstandingReport, OutstandingPartySummary, OutstandingDocument } from '../types';
import { cn } from '@/lib/utils';

interface OutstandingReportViewProps {
  data: OutstandingReport;
  onBack: () => void;
}

export default function OutstandingReportView({ data, onBack }: OutstandingReportViewProps) {
  const [drillPath, setDrillPath] = useState<{ party: OutstandingPartySummary | null }>({
    party: null
  });

  const handlePartyClick = (party: OutstandingPartySummary) => {
    setDrillPath({ party });
  };

  const resetDrill = () => {
    if (drillPath.party) {
        setDrillPath({ party: null });
    } else {
        onBack();
    }
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={resetDrill} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
                {drillPath.party ? 'Party Ledger' : 'Outstanding'}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {drillPath.party ? drillPath.party.partyName : 'A/R Analysis'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-slate-50 text-slate-600 rounded-xl border border-slate-200">
               <Printer size={18} />
            </button>
            <button className="p-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20">
               <Download size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <AnimatePresence mode="wait">
          {/* Level 1: Party Wise Summary */}
          {!drillPath.party && (
            <motion.div 
               key="party-list"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-3"
            >
              <div className="flex items-center justify-between px-1">
                 <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Party Balances</h2>
                 <p className="text-[9px] font-bold text-slate-300 uppercase">{data.parties.length} Accounts</p>
              </div>
              {data.parties.map(party => (
                <Card 
                  key={party.partyId} 
                  onClick={() => handlePartyClick(party)}
                  className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-200/60 overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-inner">
                           <User size={22} />
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-[13px] font-black text-slate-800 leading-none">{party.partyName}</h3>
                           <div className="flex items-center gap-1.5">
                              <MapPin size={10} className="text-slate-300" />
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{party.headquarter}</p>
                           </div>
                        </div>
                     </div>
                     <div className="text-right space-y-1">
                        <div className="flex items-center justify-end gap-1.5">
                           <p className={cn(
                              "text-[14px] font-black leading-none",
                              party.totalOutstanding < 0 ? "text-rose-600" : "text-emerald-600"
                           )}>
                              ₹{party.totalOutstanding.toLocaleString()}
                           </p>
                           <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{party.documents.length} Docs</p>
                     </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Level 2: Document List for Selected Party */}
          {drillPath.party && (
             <motion.div 
                key="doc-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
             >
                <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl shadow-slate-900/10 relative overflow-hidden">
                   <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-80">Party Overview</p>
                            <h2 className="text-xl font-black tracking-tight leading-none uppercase">{drillPath.party.partyName}</h2>
                         </div>
                         <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                            <ShieldCheck size={20} />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Outstanding</p>
                            <p className={cn(
                               "text-xl font-black tracking-tight leading-none",
                               drillPath.party.totalOutstanding < 0 ? "text-rose-400" : "text-emerald-400"
                            )}>₹{drillPath.party.totalOutstanding.toLocaleString()}</p>
                         </div>
                         <div className="space-y-1 text-right sm:text-left border-l border-white/5 pl-4">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Division</p>
                            <p className="text-[13px] font-black tracking-tight leading-none uppercase">{drillPath.party.division}</p>
                         </div>
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between px-1">
                      <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Aging Documents</h2>
                      <p className="text-[9px] font-bold text-slate-300 uppercase">{drillPath.party.documents.length} Entries</p>
                   </div>
                   {drillPath.party.documents.map(doc => (
                      <Card 
                        key={doc.id} 
                        className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100 overflow-hidden"
                      >
                         <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-start">
                               <div className="flex items-center gap-3">
                                  <div className={cn(
                                     "w-10 h-10 rounded-xl flex items-center justify-center border",
                                     doc.docType === 'INVOICE' 
                                        ? "bg-blue-50 text-blue-600 border-blue-100" 
                                        : "bg-rose-50 text-rose-600 border-rose-100"
                                  )}>
                                     {doc.docType === 'INVOICE' ? <Receipt size={18} /> : <FileText size={18} />}
                                  </div>
                                  <div>
                                     <h4 className="text-[11px] font-black text-slate-800 leading-none mb-1 uppercase tracking-tight">{doc.docNo}</h4>
                                     <div className="flex items-center gap-1.5">
                                        <Calendar size={10} className="text-slate-300" />
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{doc.invDate} • {doc.docType}</p>
                                     </div>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className={cn(
                                     "text-[14px] font-black leading-none",
                                     doc.amount < 0 ? "text-rose-600" : "text-slate-900"
                                  )}>₹{doc.amount.toLocaleString()}</p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Amount</p>
                               </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50">
                               <div className="space-y-1">
                                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Dispatch Date</p>
                                  <p className="text-[11px] font-black text-slate-700 leading-none">{doc.dispatchDate || 'N/A'}</p>
                               </div>
                               <div className="space-y-1 text-right sm:text-left">
                                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Outstanding</p>
                                  <p className={cn(
                                     "text-[11px] font-black leading-none",
                                     (doc.outstandingDays || 0) > 45 ? "text-rose-600" : "text-slate-700"
                                  )}>{doc.outstandingDays ? `${doc.outstandingDays} Days` : 'N/A'}</p>
                               </div>
                            </div>

                            {doc.comment && (
                               <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                  <MessageCircle size={14} className="text-slate-400 shrink-0" />
                                  <p className="text-[10px] font-bold text-slate-600 italic tracking-tight">{doc.comment}</p>
                               </div>
                            )}

                            {doc.docType === 'INVOICE' && (
                               <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 border-none shadow-none text-[9px] font-black uppercase h-9 rounded-xl">
                                  Open Comment
                               </Button>
                            )}
                         </CardContent>
                      </Card>
                   ))}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
