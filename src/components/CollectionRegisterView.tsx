import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Download, Printer, User, FileText, ShoppingBag, MapPin, Calculator, Calendar, ArrowDownRight, Tag, Boxes, ShieldCheck, Wallet, Landmark, ReceiptText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CollectionRegister, CollectionEntry } from '../types';
import { cn } from '@/lib/utils';

interface CollectionRegisterViewProps {
  data: CollectionRegister;
  onBack: () => void;
}

// Helper to group by party
const groupByParty = (entries: CollectionEntry[]) => {
  const groups: Record<string, { partyName: string; hq: string; totalAmount: number; entries: CollectionEntry[] }> = {};
  entries.forEach(entry => {
    if (!groups[entry.partyName]) {
      groups[entry.partyName] = { partyName: entry.partyName, hq: entry.hq, totalAmount: 0, entries: [] };
    }
    groups[entry.partyName].totalAmount += entry.amount;
    groups[entry.partyName].entries.push(entry);
  });
  return Object.values(groups);
};

// Helper to group by payment no within a party
const groupByPayment = (entries: CollectionEntry[]) => {
  const groups: Record<string, { paymentNo: string; paymentDate: string; paymentMode: string; chequeNo: string; bank: string; totalAmount: number; entries: CollectionEntry[] }> = {};
  entries.forEach(entry => {
    if (!groups[entry.paymentNo]) {
      groups[entry.paymentNo] = { 
        paymentNo: entry.paymentNo, 
        paymentDate: entry.paymentDate, 
        paymentMode: entry.paymentMode,
        chequeNo: entry.chequeNo,
        bank: entry.bank,
        totalAmount: 0, 
        entries: [] 
      };
    }
    groups[entry.paymentNo].totalAmount += entry.amount;
    groups[entry.paymentNo].entries.push(entry);
  });
  return Object.values(groups);
};

export default function CollectionRegisterView({ data, onBack }: CollectionRegisterViewProps) {
  const [drillPath, setDrillPath] = useState<{ party: any | null; payment: any | null }>({
    party: null,
    payment: null
  });

  const parties = groupByParty(data.entries);

  const handlePartyClick = (party: any) => {
    setDrillPath({ party, payment: null });
  };

  const handlePaymentClick = (payment: any) => {
    setDrillPath(prev => ({ ...prev, payment }));
  };

  const resetDrill = () => {
    if (drillPath.payment) {
        setDrillPath(prev => ({ ...prev, payment: null }));
    } else if (drillPath.party) {
        setDrillPath({ party: null, payment: null });
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
                {drillPath.payment ? 'Adjustment Details' : drillPath.party ? 'Payments' : 'Collection Register'}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {drillPath.payment ? drillPath.payment.paymentNo : drillPath.party ? drillPath.party.partyName : 'Revenue Audit Trail'}
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
                 <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Party Collection</h2>
                 <p className="text-[9px] font-bold text-slate-300 uppercase">{parties.length} Parties Found</p>
              </div>
              {parties.map(party => (
                <Card 
                  key={party.partyName} 
                  onClick={() => handlePartyClick(party)}
                  className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-200/60 overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                           <User size={22} />
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-[13px] font-black text-slate-800 leading-none">{party.partyName}</h3>
                           <div className="flex items-center gap-1.5">
                              <MapPin size={10} className="text-slate-300" />
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{party.hq}</p>
                           </div>
                        </div>
                     </div>
                     <div className="text-right space-y-1">
                        <div className="flex items-center justify-end gap-1.5">
                           <p className="text-[14px] font-black text-slate-900 leading-none">₹{party.totalAmount.toLocaleString()}</p>
                           <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{party.entries.length} Collections</p>
                     </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Level 2: List of Payments/Collections for Party */}
          {drillPath.party && !drillPath.payment && (
             <motion.div 
                key="payment-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
             >
                <div className="bg-amber-600 text-white p-5 rounded-3xl shadow-xl shadow-amber-900/10 relative overflow-hidden">
                   <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-amber-200 uppercase tracking-widest mb-1 opacity-80">Party Ledger</p>
                            <h2 className="text-xl font-black tracking-tight leading-none uppercase">{drillPath.party.partyName}</h2>
                         </div>
                         <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                            <Wallet size={20} />
                         </div>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-amber-200 uppercase tracking-widest">Total Collected Balance</p>
                         <p className="text-2xl font-black tracking-tighter leading-none">₹{drillPath.party.totalAmount.toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between px-1">
                      <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Transaction Entries</h2>
                      <p className="text-[9px] font-bold text-slate-300 uppercase">{groupByPayment(drillPath.party.entries).length} Payments</p>
                   </div>
                   {groupByPayment(drillPath.party.entries).map(pay => (
                      <Card 
                        key={pay.paymentNo} 
                        onClick={() => handlePaymentClick(pay)}
                        className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100 overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
                      >
                         <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                     {pay.paymentMode === 'NEFT' ? <Landmark size={18} /> : <ReceiptText size={18} />}
                                  </div>
                                  <div>
                                     <h4 className="text-[11px] font-black text-slate-800 leading-none mb-1 uppercase tracking-tight">{pay.paymentNo}</h4>
                                     <div className="flex items-center gap-1.5">
                                        <Calendar size={10} className="text-slate-300" />
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{pay.paymentDate} • {pay.paymentMode}</p>
                                     </div>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className="text-[14px] font-black text-amber-600 leading-none">₹{pay.totalAmount.toLocaleString()}</p>
                                  <div className="flex items-center justify-end gap-1 mt-1">
                                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Adjusted</p>
                                     <ChevronRight size={10} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                                  </div>
                               </div>
                            </div>
                         </CardContent>
                      </Card>
                   ))}
                </div>
             </motion.div>
          )}

          {/* Level 3: Breakdown of adjusted invitations for current payment */}
          {drillPath.payment && (
            <motion.div 
               key="adjustment-detail"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="space-y-6"
            >
               {/* Payment Info Card */}
               <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden ring-1 ring-slate-100">
                  <div className="p-6 space-y-6">
                     <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                        <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10",
                           drillPath.payment.paymentMode === 'NEFT' ? "bg-amber-600" : "bg-slate-900"
                        )}>
                           {drillPath.payment.paymentMode === 'NEFT' ? <Landmark size={22} /> : <ReceiptText size={22} />}
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Collection Receipt</p>
                           <h3 className="text-[15px] font-black text-slate-800 uppercase tracking-tight leading-none">{drillPath.payment.paymentNo}</h3>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Payment Date</p>
                           <p className="text-sm font-black text-slate-800 leading-none">{drillPath.payment.paymentDate}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Mode</p>
                           <p className="text-sm font-black text-slate-600 leading-none uppercase">{drillPath.payment.paymentMode}</p>
                        </div>
                        {drillPath.payment.bank && (
                           <div className="col-span-2 space-y-1">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Bank Details</p>
                              <p className="text-[11px] font-black text-slate-700 leading-none uppercase">{drillPath.payment.bank} {drillPath.payment.chequeNo && `• Chq: ${drillPath.payment.chequeNo}`}</p>
                           </div>
                        )}
                        <div className="col-span-2 bg-slate-900 text-white rounded-2xl p-4 flex justify-between items-center shadow-lg shadow-slate-900/20">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Net Collected Amount</p>
                              <p className="text-xl font-black text-white leading-none">₹{drillPath.payment.totalAmount.toLocaleString()}</p>
                           </div>
                           <ShoppingBag size={24} className="text-slate-700" />
                        </div>
                     </div>
                  </div>
               </Card>

               {/* Applied Invoices Section */}
               <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                     <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Invoices Adjusted</h2>
                     <p className="text-[9px] font-bold text-slate-300 uppercase">{drillPath.payment.entries.length} Invoices</p>
                  </div>
                  {drillPath.payment.entries.map((adj: CollectionEntry) => (
                    <Card key={adj.id} className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100 overflow-hidden">
                       <CardContent className="p-4 space-y-4">
                          <div className="flex justify-between items-start">
                             <div className="space-y-1 max-w-[70%]">
                                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest leading-none">Invoice No</p>
                                <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight leading-6">{adj.adjWithInvoice}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                                       <Calendar size={8} /> {adj.invoiceDate}
                                    </div>
                                    <div className={cn(
                                       "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                       adj.days > 45 ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                                    )}>
                                       {adj.days} Days
                                    </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[14px] font-black text-slate-900 leading-none">₹{adj.amount.toLocaleString()}</p>
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1 leading-none">Amt Adjusted</p>
                             </div>
                          </div>

                          {(adj.range61to90 || adj.rangeOver90) && (
                             <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50">
                                <div className="space-y-1 text-center bg-amber-50/50 py-2 rounded-xl border border-amber-100/50">
                                   <p className="text-[7px] font-black text-amber-400 uppercase tracking-tighter leading-none mb-1">61-90 Days</p>
                                   <p className="text-[11px] font-black text-amber-600 leading-none">₹{adj.range61to90?.toLocaleString() || '0'}</p>
                                </div>
                                <div className="space-y-1 text-center bg-rose-50/50 py-2 rounded-xl border border-rose-100/50">
                                   <p className="text-[7px] font-black text-rose-400 uppercase tracking-tighter leading-none mb-1">&gt; 90 Days</p>
                                   <p className="text-[11px] font-black text-rose-600 leading-none">₹{adj.rangeOver90?.toLocaleString() || '0'}</p>
                                </div>
                             </div>
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
