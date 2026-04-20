import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ChevronRight, Download, Printer, TrendingUp, User, FileText, ShoppingBag, MapPin, Calculator, Calendar, ArrowDownRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SalesRegister, PartySummary, InvoiceSummary, ProductDetail } from '../types';
import { cn } from '@/lib/utils';

interface SalesRegisterViewProps {
  data: SalesRegister;
  onBack: () => void;
}

export default function SalesRegisterView({ data, onBack }: SalesRegisterViewProps) {
  const [drillPath, setDrillPath] = useState<{ party: PartySummary | null; invoice: InvoiceSummary | null }>({
    party: null,
    invoice: null
  });

  const handlePartyClick = (party: PartySummary) => {
    setDrillPath({ party, invoice: null });
  };

  const handleInvoiceClick = (invoice: InvoiceSummary) => {
    setDrillPath(prev => ({ ...prev, invoice }));
  };

  const resetDrill = () => {
    if (drillPath.invoice) {
        setDrillPath(prev => ({ ...prev, invoice: null }));
    } else if (drillPath.party) {
        setDrillPath({ party: null, invoice: null });
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
                {drillPath.invoice ? 'Invoice Detail' : drillPath.party ? 'Invoice List' : 'Sales Register'}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {drillPath.invoice ? drillPath.invoice.invoiceNo : drillPath.party ? drillPath.party.partyName : 'Transaction Audit'}
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
                 <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Party Summary</h2>
                 <p className="text-[9px] font-bold text-slate-300 uppercase">{data.parties.length} Records found</p>
              </div>
              {data.parties.map(party => (
                <Card 
                  key={party.partyId} 
                  onClick={() => handlePartyClick(party)}
                  className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-200/60 overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                           <User size={22} />
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-[13px] font-black text-slate-800 leading-none">{party.partyName}</h3>
                           <div className="flex items-center gap-1.5">
                              <MapPin size={10} className="text-slate-300" />
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{party.headquarter} • {party.division}</p>
                           </div>
                        </div>
                     </div>
                     <div className="text-right space-y-1">
                        <div className="flex items-center justify-end gap-1.5">
                           <p className="text-[14px] font-black text-slate-900 leading-none">₹{party.totalNetValue.toLocaleString()}</p>
                           <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">PV: ₹{party.totalProductValue.toLocaleString()}</p>
                     </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Level 2: Invoice List for Selected Party */}
          {drillPath.party && !drillPath.invoice && (
             <motion.div 
                key="invoice-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
             >
                <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-xl shadow-blue-900/10 relative overflow-hidden">
                   <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1 opacity-80">Selected Merchant</p>
                            <h2 className="text-xl font-black tracking-tight leading-none uppercase">{drillPath.party.partyName}</h2>
                         </div>
                         <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                            <TrendingUp size={20} />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Cumm. Product Value</p>
                            <p className="text-[15px] font-black tracking-tight leading-none">₹{drillPath.party.totalProductValue.toLocaleString()}</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Total Net Value</p>
                            <p className="text-[15px] font-black tracking-tight leading-none">₹{drillPath.party.totalNetValue.toLocaleString()}</p>
                         </div>
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between px-1">
                      <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Invoices</h2>
                      <p className="text-[9px] font-bold text-slate-300 uppercase">{drillPath.party.invoices.length} Entries</p>
                   </div>
                   {drillPath.party.invoices.map(invoice => (
                      <Card 
                        key={invoice.invoiceNo} 
                        onClick={() => handleInvoiceClick(invoice)}
                        className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100 overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
                      >
                         <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                     <FileText size={18} />
                                  </div>
                                  <div>
                                     <h4 className="text-[11px] font-black text-slate-800 leading-none mb-1 uppercase tracking-tight">{invoice.invoiceNo}</h4>
                                     <div className="flex items-center gap-1.5">
                                        <Calendar size={10} className="text-slate-300" />
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{invoice.invoiceDate}</p>
                                     </div>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className="text-[14px] font-black text-emerald-600 leading-none">₹{invoice.netValue.toLocaleString()}</p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Net Outcome</p>
                               </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 py-2 border-t border-slate-50">
                               <div className="space-y-1">
                                  <p className="text-[8px] font-black text-slate-300 uppercase leading-none tracking-widest">Audit Refs</p>
                                  <p className="text-[9px] font-black text-slate-600 uppercase truncate">CN: {invoice.cnNo}</p>
                               </div>
                               <div className="space-y-1 text-right">
                                  <p className="text-[8px] font-black text-slate-300 uppercase leading-none tracking-widest">Marketing</p>
                                  <p className="text-[9px] font-black text-blue-600 uppercase">₹{invoice.marketingValue.toLocaleString()}</p>
                               </div>
                            </div>
                         </CardContent>
                      </Card>
                   ))}
                </div>
             </motion.div>
          )}

          {/* Level 3: Full Detailed Invoice Breakdown */}
          {drillPath.invoice && (
            <motion.div 
               key="invoice-detail"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="space-y-6"
            >
               {/* Invoice Master Data Card */}
               <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden ring-1 ring-slate-100">
                  <div className="p-6 space-y-6">
                     <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                           <Calculator size={22} />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Financial Breakdown</p>
                           <h3 className="text-[15px] font-black text-slate-800 uppercase tracking-tight leading-none">{drillPath.invoice.invoiceNo}</h3>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 flex items-center gap-1.5">
                              <Tag size={8} /> Product Value
                           </p>
                           <p className="text-sm font-black text-slate-800 leading-none">₹{drillPath.invoice.productValue.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Discount</p>
                           <p className="text-sm font-black text-rose-500 leading-none">₹{drillPath.invoice.discount.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">CGST / SGST</p>
                           <p className="text-sm font-black text-slate-600 leading-none">₹{drillPath.invoice.cgst.toLocaleString()} × 2</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 font-bold">Round Off</p>
                           <p className="text-sm font-black text-slate-600 leading-none">₹{drillPath.invoice.roundOff.toFixed(2)}</p>
                        </div>
                        <div className="col-span-2 bg-emerald-50 rounded-2xl p-4 flex justify-between items-center ring-1 ring-emerald-100">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Final Net Value</p>
                              <p className="text-xl font-black text-emerald-900 leading-none">₹{drillPath.invoice.netValue.toLocaleString()}</p>
                           </div>
                           <ShoppingBag size={24} className="text-emerald-200" />
                        </div>
                     </div>

                     <div className="space-y-4 pt-4 border-t border-slate-50">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1 text-left">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 italic">RSM Name</p>
                              <p className="text-[10px] font-black text-slate-700 leading-none uppercase">{drillPath.invoice.rsm}</p>
                           </div>
                           <div className="space-y-1 text-right">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 italic">DM Name</p>
                              <p className="text-[10px] font-black text-slate-700 leading-none uppercase">{drillPath.invoice.dm}</p>
                           </div>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">GSTIN Registry</p>
                           <p className="text-[10px] font-black text-slate-900 font-mono tracking-tighter">{drillPath.invoice.gstin}</p>
                        </div>
                     </div>
                  </div>
               </Card>

               {/* Product Details Section */}
               <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                     <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Itemized Logistics</h2>
                     <p className="text-[9px] font-bold text-slate-300 uppercase">{drillPath.invoice.products.length} Products</p>
                  </div>
                  {drillPath.invoice.products.map(product => (
                    <Card key={product.id} className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100 overflow-hidden">
                       <CardContent className="p-4 space-y-4">
                          <div className="flex justify-between items-start">
                             <div className="space-y-1">
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Product Title</p>
                                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-tight leading-none">{product.productName}</h4>
                             </div>
                             <div className="text-right">
                                <p className="text-[14px] font-black text-slate-900 leading-none">₹{product.value.toLocaleString()}</p>
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1 leading-none">Gross Value</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-50">
                             <div className="space-y-1 text-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Qty</p>
                                <p className="text-[11px] font-black text-slate-800 leading-none">{product.qty}</p>
                             </div>
                             <div className="space-y-1 text-center bg-blue-50/50 py-2 rounded-xl border border-blue-100/50">
                                <p className="text-[7px] font-black text-blue-400 uppercase tracking-tighter leading-none mb-1">Free</p>
                                <p className="text-[11px] font-black text-blue-600 leading-none">{product.free}</p>
                             </div>
                             <div className="space-y-1 text-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Rate</p>
                                <p className="text-[11px] font-black text-slate-800 leading-none">₹{product.rate.toFixed(0)}</p>
                             </div>
                             <div className="space-y-1 text-center bg-amber-50/50 py-2 rounded-xl border border-amber-100/50">
                                <p className="text-[7px] font-black text-amber-400 uppercase tracking-tighter leading-none mb-1">GST</p>
                                <p className="text-[11px] font-black text-amber-600 leading-none">₹{product.gst.toFixed(0)}</p>
                             </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                             <div className="flex items-center gap-1.5">
                                <ArrowDownRight size={14} className="text-blue-500" />
                                <p className="text-[9px] font-black text-blue-800 uppercase tracking-widest">Marketing Value</p>
                             </div>
                             <p className="text-[11px] font-black text-blue-900">₹{product.marketingValue.toLocaleString()}</p>
                          </div>
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
