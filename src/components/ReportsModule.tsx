import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight, FileText, Search, User, FlaskConical, ShoppingBag, ShieldCheck, MapPin, Clock, TrendingUp, Info, ArrowLeft, Download, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { DCR, DCREntry, DeviationReport, SalesRegister, CRNRegister, CollectionRegister, OutstandingReport } from '../types';
import { MOCK_DCRS, MOCK_DOCTORS, MOCK_CHEMISTS, MOCK_DEVIATIONS, MOCK_SALES_REGISTER, MOCK_CRN_REGISTER, MOCK_COLLECTION_REGISTER, MOCK_OUTSTANDING_REPORT } from '../mockData';
import DCRReportView from './DCRReportView';
import DeviationReportView from './DeviationReportView';
import SalesRegisterView from './SalesRegisterView';
import CRNRegisterView from './CRNRegisterView';
import CollectionRegisterView from './CollectionRegisterView';
import OutstandingReportView from './OutstandingReportView';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ReportsModule() {
  const [selectedDate, setSelectedDate] = useState<string>('2024-10-12');
  const [viewingDcr, setViewingDcr] = useState<DCR | null>(null);
  const [viewingDeviation, setViewingDeviation] = useState<DeviationReport | null>(null);
  const [viewingSales, setViewingSales] = useState<SalesRegister | null>(null);
  const [viewingCrn, setViewingCrn] = useState<CRNRegister | null>(null);
  const [viewingCollection, setViewingCollection] = useState<CollectionRegister | null>(null);
  const [viewingOutstanding, setViewingOutstanding] = useState<OutstandingReport | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);

  // Sales Register Filters
  const [salesFilters, setSalesFilters] = useState({
    cnf: 'SAF FERMION LTD',
    month: 'March',
    year: '2026',
    fromDate: '2026-03-01',
    toDate: '2026-03-31',
    division: 'SELECT',
    invoiceRequired: 'Yes'
  });

  // CRN Register Filters
  const [crnFilters, setCrnFilters] = useState({
    cnf: 'SAF FERMION LTD',
    type: 'NON-SALABLE',
    fromDate: '2026-03-01',
    toDate: '2026-04-20'
  });

  // Collection Register Filters
  const [collectionFilters, setCollectionFilters] = useState({
    cnf: 'SAF FERMION LTD',
    paymentMode: 'ALL',
    fromDate: '2026-03-01',
    toDate: '2026-04-20',
    range61to90: 'No',
    rangeOver90: 'No'
  });

  // Outstanding Report Filters
  const [outstandingFilters, setOutstandingFilters] = useState({
    cnf: 'SAF FERMION LTD',
    division: 'SAF-MAIN',
    toDate: '2026-04-20'
  });

  const REPORTS = [
    { id: 'dcr', name: 'DCR Report', icon: FileText, color: 'bg-emerald-600', description: 'Daily compliance logs' },
    { id: 'deviation', name: 'Deviation Report', icon: ShieldCheck, color: 'bg-rose-600', description: 'Task variance tracking' },
    { id: 'sales', name: 'Sales Register', icon: TrendingUp, color: 'bg-blue-600', description: 'Transaction history' },
    { id: 'collection', name: 'Collection Register', icon: ShoppingBag, color: 'bg-amber-600', description: 'Payment recovery logs' },
    { id: 'crn', name: 'CRN Register', icon: Info, color: 'bg-indigo-600', description: 'Credit note registry' },
    { id: 'outstanding', name: 'Outstanding', icon: Clock, color: 'bg-slate-800', description: 'Pending dues analysis' },
  ];

  // Filter DCRs based on selected date
  const handleFetchReport = () => {
    if (selectedReportType === 'dcr') {
      const found = MOCK_DCRS.find(d => d.date === selectedDate);
      if (found) {
        setViewingDcr(found);
      } else {
        setViewingDcr(null);
      }
    } else if (selectedReportType === 'deviation') {
      // For deviation, we'll just show the first mock report as a placeholder for "current cycle"
      setViewingDeviation(MOCK_DEVIATIONS[0]);
    } else if (selectedReportType === 'sales') {
      setViewingSales(MOCK_SALES_REGISTER);
    } else if (selectedReportType === 'crn') {
      setViewingCrn(MOCK_CRN_REGISTER);
    } else if (selectedReportType === 'collection') {
      setViewingCollection(MOCK_COLLECTION_REGISTER);
    } else if (selectedReportType === 'outstanding') {
      setViewingOutstanding(MOCK_OUTSTANDING_REPORT);
    }
  };

  return (
    <div className="min-h-full bg-slate-50/50 p-5 space-y-6">
      {/* Dynamic Header */}
      {!viewingDcr && (
        <header className="space-y-1 mb-8">
           <div className="flex items-center gap-1.5 flex-wrap">
              <div className="w-4 h-[1.5px] bg-emerald-500 rounded-full"></div>
              <p className="text-emerald-600 text-[9px] font-black uppercase tracking-[0.3em]">Insights & Analytics</p>
              {selectedReportType && (
                <>
                  <div className="w-1 h-[1px] bg-slate-300 rounded-full"></div>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
                    {REPORTS.find(r => r.id === selectedReportType)?.name}
                  </p>
                </>
              )}
           </div>
           <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
             {selectedReportType ? REPORTS.find(r => r.id === selectedReportType)?.name : 'Report Portal'}
           </h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit compliant report generator</p>
        </header>
      )}

      <AnimatePresence mode="wait">
        {viewingDcr ? (
          <DCRReportView dcr={viewingDcr} onBack={() => setViewingDcr(null)} />
        ) : viewingDeviation ? (
          <DeviationReportView report={viewingDeviation} onBack={() => setViewingDeviation(null)} />
        ) : viewingSales ? (
          <SalesRegisterView data={viewingSales} onBack={() => setViewingSales(null)} />
        ) : viewingCrn ? (
          <CRNRegisterView data={viewingCrn} onBack={() => setViewingCrn(null)} />
        ) : viewingCollection ? (
          <CollectionRegisterView data={viewingCollection} onBack={() => setViewingCollection(null)} />
        ) : viewingOutstanding ? (
          <OutstandingReportView data={viewingOutstanding} onBack={() => setViewingOutstanding(null)} />
        ) : !selectedReportType ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 gap-2"
          >
            {REPORTS.map((report) => (
              <div 
                key={report.id} 
                onClick={() => setSelectedReportType(report.id)}
                className="w-full bg-white border-none shadow-sm rounded-2xl p-4 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all flex items-center justify-start gap-4 h-[80px] ring-1 ring-slate-200/60"
              >
                <div className={cn("absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110 opacity-5", report.color)}></div>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-sm", report.color, "text-white")}>
                  <report.icon size={22} />
                </div>
                <div className="flex-1 text-left min-w-0 z-10">
                  <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight mb-0.5">{report.name}</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight opacity-70 leading-none">{report.description}</p>
                </div>
                <div className="shrink-0 opacity-20 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="selector"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Back Button */}
            <button 
              onClick={() => setSelectedReportType(null)}
              className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Reports
            </button>

            {/* Date Selection Control */}
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 space-y-8 ring-1 ring-slate-100">
               <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-600 shadow-sm">
                      {selectedReportType === 'dcr' ? <Calendar size={32} /> : <Search size={32} />}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tighter uppercase">Generate {REPORTS.find(r => r.id === selectedReportType)?.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {selectedReportType === 'dcr' 
                      ? 'Select a fieldwork date to view compliance details' 
                      : `Configure filters to generate the ${REPORTS.find(r => r.id === selectedReportType)?.name}`}
                  </p>
               </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-6 ring-1 ring-slate-100/50 shadow-inner">
                     {selectedReportType === 'dcr' ? (
                       <input 
                         type="date" 
                         value={selectedDate}
                         onChange={(e) => setSelectedDate(e.target.value)}
                         className="w-full bg-transparent border-none outline-none text-xl font-black text-slate-800 text-center tracking-tighter"
                       />
                     ) : selectedReportType === 'deviation' ? (
                       <div className="text-center py-2 space-y-2">
                          <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Active Cycle</p>
                          <p className="text-xl font-black text-slate-800 tracking-tighter">16 MAR - 15 APR 2026</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">Based on latest expense statement</p>
                       </div>
                     ) : selectedReportType === 'crn' ? (
                        <div className="space-y-5 text-left">
                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">Select C & A</label>
                              <Select value={crnFilters.cnf} onValueChange={(v) => setCrnFilters({...crnFilters, cnf: v})}>
                                 <SelectTrigger className="h-11 bg-white border-none rounded-xl text-[11px] font-black shadow-sm ring-1 ring-slate-200">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="SAF FERMION LTD" className="font-bold uppercase tracking-tight">SAF FERMION LTD</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>

                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">Select Type</label>
                              <Select value={crnFilters.type} onValueChange={(v) => setCrnFilters({...crnFilters, type: v})}>
                                 <SelectTrigger className="h-11 bg-white border-none rounded-xl text-[11px] font-black shadow-sm ring-1 ring-slate-200">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="NON-SALABLE" className="font-bold uppercase tracking-tight">NON-SALABLE</SelectItem>
                                    <SelectItem value="SALABLE" className="font-bold uppercase tracking-tight">SALABLE</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                 <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">From Date</label>
                                 <div className="h-11 bg-white rounded-xl px-4 flex items-center shadow-sm ring-1 ring-slate-200 group">
                                   <input 
                                      type="date" 
                                      value={crnFilters.fromDate}
                                      onChange={(e) => setCrnFilters({...crnFilters, fromDate: e.target.value})}
                                      className="w-full bg-transparent focus:outline-none text-[11px] font-black text-slate-800"
                                   />
                                   <Calendar size={14} className="text-slate-300 ml-2" />
                                 </div>
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">To Date</label>
                                 <div className="h-11 bg-white rounded-xl px-4 flex items-center shadow-sm ring-1 ring-slate-200 group">
                                   <input 
                                      type="date" 
                                      value={crnFilters.toDate}
                                      onChange={(e) => setCrnFilters({...crnFilters, toDate: e.target.value})}
                                      className="w-full bg-transparent focus:outline-none text-[11px] font-black text-slate-800"
                                   />
                                   <Calendar size={14} className="text-slate-300 ml-2" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     ) : selectedReportType === 'collection' ? (
                        <div className="space-y-5 text-left">
                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">Select C&F</label>
                              <Select value={collectionFilters.cnf} onValueChange={(v) => setCollectionFilters({...collectionFilters, cnf: v})}>
                                 <SelectTrigger className="h-11 bg-white border-none rounded-xl text-[11px] font-black shadow-sm ring-1 ring-slate-200">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="SAF FERMION LTD" className="font-bold uppercase tracking-tight">SAF FERMION LTD</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>

                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">Payment Mode</label>
                              <Select value={collectionFilters.paymentMode} onValueChange={(v) => setCollectionFilters({...collectionFilters, paymentMode: v})}>
                                 <SelectTrigger className="h-11 bg-white border-none rounded-xl text-[11px] font-black shadow-sm ring-1 ring-slate-200">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="ALL" className="font-bold uppercase tracking-tight">ALL MODES</SelectItem>
                                    <SelectItem value="NEFT" className="font-bold uppercase tracking-tight">NEFT</SelectItem>
                                    <SelectItem value="CHEQUE" className="font-bold uppercase tracking-tight">CHEQUE</SelectItem>
                                    <SelectItem value="CASH" className="font-bold uppercase tracking-tight">CASH</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                 <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">From Date</label>
                                 <div className="h-11 bg-white rounded-xl px-4 flex items-center shadow-sm ring-1 ring-slate-200 group">
                                   <input 
                                      type="date" 
                                      value={collectionFilters.fromDate}
                                      onChange={(e) => setCollectionFilters({...collectionFilters, fromDate: e.target.value})}
                                      className="w-full bg-transparent focus:outline-none text-[11px] font-black text-slate-800"
                                   />
                                   <Calendar size={14} className="text-slate-300 ml-2" />
                                 </div>
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">To Date</label>
                                 <div className="h-11 bg-white rounded-xl px-4 flex items-center shadow-sm ring-1 ring-slate-200 group">
                                   <input 
                                      type="date" 
                                      value={collectionFilters.toDate}
                                      onChange={(e) => setCollectionFilters({...collectionFilters, toDate: e.target.value})}
                                      className="w-full bg-transparent focus:outline-none text-[11px] font-black text-slate-800"
                                   />
                                   <Calendar size={14} className="text-slate-300 ml-2" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     ) : selectedReportType === 'outstanding' ? (
                        <div className="space-y-5 text-left">
                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">Select C & A</label>
                              <Select value={outstandingFilters.cnf} onValueChange={(v) => setOutstandingFilters({...outstandingFilters, cnf: v})}>
                                 <SelectTrigger className="h-11 bg-white border-none rounded-xl text-[11px] font-black shadow-sm ring-1 ring-slate-200">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="SAF FERMION LTD" className="font-bold uppercase tracking-tight">SAF FERMION LTD</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>

                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">Division</label>
                              <Select value={outstandingFilters.division} onValueChange={(v) => setOutstandingFilters({...outstandingFilters, division: v})}>
                                 <SelectTrigger className="h-11 bg-white border-none rounded-xl text-[11px] font-black shadow-sm ring-1 ring-slate-200">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="SAF-MAIN" className="font-bold uppercase tracking-tight">SAF-MAIN</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>

                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">To Date</label>
                              <div className="h-11 bg-white rounded-xl px-4 flex items-center shadow-sm ring-1 ring-slate-200 group">
                                <input 
                                   type="date" 
                                   value={outstandingFilters.toDate}
                                   onChange={(e) => setOutstandingFilters({...outstandingFilters, toDate: e.target.value})}
                                   className="w-full bg-transparent focus:outline-none text-[11px] font-black text-slate-800"
                                />
                                <Calendar size={14} className="text-slate-300 ml-2" />
                              </div>
                           </div>
                        </div>
                     ) : selectedReportType === 'sales' ? (
                       <div className="space-y-5 text-left">
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">Select C&F</label>
                             <Select value={salesFilters.cnf} onValueChange={(v) => setSalesFilters({...salesFilters, cnf: v})}>
                                <SelectTrigger className="h-11 bg-white border-none rounded-xl text-[11px] font-black shadow-sm ring-1 ring-slate-200">
                                   <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                   <SelectItem value="SAF FERMION LTD" className="font-bold uppercase tracking-tight">SAF FERMION LTD</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">Report Month</label>
                                <Select value={salesFilters.month} onValueChange={(v) => setSalesFilters({...salesFilters, month: v})}>
                                   <SelectTrigger className="h-11 bg-white border-none rounded-xl text-[11px] font-black shadow-sm ring-1 ring-slate-200">
                                      <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent className="rounded-xl border-none shadow-2xl">
                                      {['January', 'February', 'March', 'April', 'May'].map(m => (
                                        <SelectItem key={m} value={m} className="font-bold uppercase tracking-tight">{m}</SelectItem>
                                      ))}
                                   </SelectContent>
                                </Select>
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">Report Year</label>
                                <div className="h-11 bg-white rounded-xl px-4 flex items-center shadow-sm ring-1 ring-slate-200">
                                  <input 
                                     type="number" 
                                     value={salesFilters.year} 
                                     onChange={(e) => setSalesFilters({...salesFilters, year: e.target.value})}
                                     className="w-full bg-transparent focus:outline-none text-[11px] font-black text-slate-800"
                                  />
                                </div>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">From Date</label>
                                <div className="h-11 bg-white rounded-xl px-4 flex items-center shadow-sm ring-1 ring-slate-200 group">
                                  <input 
                                     type="date" 
                                     value={salesFilters.fromDate}
                                     onChange={(e) => setSalesFilters({...salesFilters, fromDate: e.target.value})}
                                     className="w-full bg-transparent focus:outline-none text-[11px] font-black text-slate-800"
                                  />
                                  <Calendar size={14} className="text-slate-300 ml-2" />
                                </div>
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">To Date</label>
                                <div className="h-11 bg-white rounded-xl px-4 flex items-center shadow-sm ring-1 ring-slate-200 group">
                                  <input 
                                     type="date" 
                                     value={salesFilters.toDate}
                                     onChange={(e) => setSalesFilters({...salesFilters, toDate: e.target.value})}
                                     className="w-full bg-transparent focus:outline-none text-[11px] font-black text-slate-800"
                                  />
                                  <Calendar size={14} className="text-slate-300 ml-2" />
                                </div>
                             </div>
                          </div>

                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest leading-none block">Select Division</label>
                             <Select value={salesFilters.division} onValueChange={(v) => setSalesFilters({...salesFilters, division: v})}>
                                <SelectTrigger className="h-11 bg-white border-none rounded-xl text-[11px] font-black shadow-sm ring-1 ring-slate-200">
                                   <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                   <SelectItem value="SELECT" className="font-bold uppercase tracking-tight">SELECT DIVISION</SelectItem>
                                   <SelectItem value="SAF-MAIN" className="font-bold uppercase tracking-tight">SAF-MAIN</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                       </div>
                     ) : (
                       <div className="text-center py-4 space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Filter: All Records</p>
                          <p className="text-xs font-bold text-slate-300 uppercase underline decoration-dotted">Custom Range Picker coming soon</p>
                       </div>
                     )}
                  </div>

                  <Button 
                    onClick={handleFetchReport}
                    disabled={selectedReportType !== 'dcr' && selectedReportType !== 'deviation' && selectedReportType !== 'sales' && selectedReportType !== 'crn' && selectedReportType !== 'collection' && selectedReportType !== 'outstanding'}
                    className={cn(
                      "w-full h-16 text-white font-black rounded-2xl shadow-2xl transition-all active:scale-[0.98] uppercase text-[11px] tracking-[0.25em] flex items-center justify-center gap-3 group",
                      (selectedReportType === 'dcr' || selectedReportType === 'deviation' || selectedReportType === 'sales' || selectedReportType === 'crn' || selectedReportType === 'collection' || selectedReportType === 'outstanding') ? "bg-slate-900 hover:bg-black" : "bg-slate-200 cursor-not-allowed text-slate-400 shadow-none border border-slate-300"
                    )}
                  >
                    {(selectedReportType === 'dcr' || selectedReportType === 'deviation' || selectedReportType === 'sales' || selectedReportType === 'crn' || selectedReportType === 'collection' || selectedReportType === 'outstanding') ? 'Generate Report' : 'Integration Pending'} 
                    {(selectedReportType === 'dcr' || selectedReportType === 'deviation' || selectedReportType === 'sales' || selectedReportType === 'crn' || selectedReportType === 'collection' || selectedReportType === 'outstanding') && <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />}
                  </Button>
               </div>
               
               <div className="pt-4 border-t border-slate-50">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] text-center italic">
                     Data integrity verified by encrypted audit logs
                  </p>
               </div>
            </Card>

            {/* Quick Access or Info Card */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-5 border border-slate-100 flex items-start gap-4">
               <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <Info size={16} />
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">Module Information</h4>
                  <p className="text-[9px] text-slate-500 leading-relaxed font-medium uppercase">
                    This report module aggregates data from the field force activity, inventory, and financial systems for {selectedReportType !== 'dcr' ? 'extended auditing' : 'daily monitoring'}.
                  </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
