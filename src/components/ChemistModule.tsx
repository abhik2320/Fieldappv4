import React, { useState } from 'react';
import { Search, Plus, FileDown, Clock, Eye, Pencil, ChevronLeft, ChevronRight, User, Phone, Mail, ShieldCheck, Trash2, MapPin, FlaskConical, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Chemist, Status } from '@/src/types';
import { MOCK_CHEMISTS } from '@/src/mockData';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'motion/react';

export default function ChemistModule() {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [search, setSearch] = useState('');
  const [filterAreas, setFilterAreas] = useState<string[]>([]);
  const [areaSearch, setAreaSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [chemists, setChemists] = useState<Chemist[]>(MOCK_CHEMISTS);

  const areas = Array.from(new Set(chemists.map(c => c.area))).filter((a): a is string => !!a).sort();
  const statuses: Status[] = ['Pending', 'Approved', 'Rejected', 'Incomplete'];

  const filteredChemists = chemists.filter(c => {
    const s = search.toLowerCase();
    const matchesSearch = (c.name?.toLowerCase() || '').includes(s) || 
                         (c.area?.toLowerCase() || '').includes(s);
    const matchesArea = filterAreas.length === 0 || filterAreas.includes(c.area);
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    
    return matchesSearch && matchesArea && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setChemists(prev => prev.filter(c => c.id !== id));
    toast.success("Chemist record deleted successfully");
  };

  if (view === 'add') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="add-chemist"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="h-full"
        >
          <AddChemist onBack={() => setView('list')} onSave={(c) => {
            const newChemist: Chemist = {
              ...c,
              id: Math.random().toString(),
              status: 'Pending',
              area: c.area || 'N/A'
            };
            setChemists([...chemists, newChemist]);
            setView('list');
            toast.success("Chemist added successfully!");
          }} />
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
            <pattern id="corp-grid-list" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#corp-grid-list)" />
          </svg>
        </div>

        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md">
              <FlaskConical size={24} className="text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Chemist Registry</h1>
              <p className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-widest">Manage Pharma Network</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-md"
            >
              <Download size={18} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('add')}
              className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20"
            >
              <Plus size={22} />
            </motion.button>
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
              placeholder="Search chemists..." 
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
                  (filterAreas.length > 0 || filterStatus !== 'all') ? "text-emerald-600" : "text-slate-400"
                )}
              >
                <Filter size={16} />
                {(filterAreas.length > 0 || filterStatus !== 'all') && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 bg-white rounded-2xl border-none shadow-2xl" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Filters</h3>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:bg-transparent"
                    onClick={() => {
                      setFilterAreas([]);
                      setFilterStatus('all');
                      setAreaSearch('');
                    }}
                  >
                    Reset All
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Area</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full border-slate-100 rounded-lg bg-slate-50/50 font-bold text-slate-800 text-[11px] justify-between px-2 hover:bg-slate-100 transition-colors">
                        <span className="truncate">
                          {filterAreas.length === 0 ? "All Areas" : `${filterAreas.length} Selected`}
                        </span>
                        <ChevronRight size={12} className="rotate-90 text-slate-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 bg-white rounded-xl border-none shadow-2xl" align="start" side="right">
                      <div className="space-y-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 h-3 w-3" />
                          <Input 
                            placeholder="Search area..." 
                            className="pl-8 h-8 text-[10px] bg-slate-50 border-none rounded-lg font-bold focus-visible:ring-emerald-500/20"
                            value={areaSearch}
                            onChange={(e) => setAreaSearch(e.target.value)}
                          />
                        </div>
                        <ScrollArea className="h-48 pr-2">
                          <div className="space-y-0.5">
                            {areas.filter(a => a.toLowerCase().includes(areaSearch.toLowerCase())).map(area => (
                              <div key={area} className="flex items-center space-x-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer" onClick={() => {
                                if (filterAreas.includes(area)) setFilterAreas(filterAreas.filter(a => a !== area));
                                else setFilterAreas([...filterAreas, area]);
                              }}>
                                <Checkbox 
                                  id={`area-${area}`} 
                                  checked={filterAreas.includes(area)}
                                  onCheckedChange={(checked) => {
                                    if (checked) setFilterAreas([...filterAreas, area]);
                                    else setFilterAreas(filterAreas.filter(a => a !== area));
                                  }}
                                  className="h-3.5 w-3.5 border-slate-200 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 rounded-sm"
                                />
                                <label htmlFor={`area-${area}`} className="text-[10px] font-bold text-slate-600 group-hover:text-slate-900 cursor-pointer flex-1 truncate">
                                  {area}
                                </label>
                              </div>
                            ))}
                            {areas.filter(a => a.toLowerCase().includes(areaSearch.toLowerCase())).length === 0 && (
                              <p className="text-[10px] text-slate-400 text-center py-4 font-bold">No areas found</p>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-8 border-slate-100 rounded-lg bg-slate-50/50 font-bold text-slate-800 text-[11px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="all" className="text-[11px] font-bold">All Status</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status} className="text-[11px] font-bold">{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </motion.div>

        {/* Chemist List - Ultra High Density */}
        <div className="space-y-1.5">
          <AnimatePresence>
            {filteredChemists.map((chemist, idx) => (
              <motion.div
                key={chemist.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                layout
              >
                <Card className="border-none shadow-sm rounded-xl bg-white overflow-hidden group hover:shadow-md transition-all duration-300 relative border border-slate-100/30">
                  {/* Status Indicator Bar */}
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 group-hover:w-1",
                    chemist.status === 'Approved' ? "bg-emerald-500" : 
                    chemist.status === 'Rejected' ? "bg-rose-500" : 
                    "bg-amber-400"
                  )}></div>

                  <CardContent className="p-2 pl-4 relative">
                    {/* Status Badge - Absolute Top Right Corner */}
                    <div className={cn(
                      "absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[6px] font-black uppercase tracking-wider transition-all duration-300 z-10",
                      chemist.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border border-emerald-100/30" : 
                      chemist.status === 'Rejected' ? "bg-rose-50 text-rose-600 border border-rose-100/30" : 
                      "bg-amber-50 text-amber-600 border border-amber-100/30"
                    )}>
                      {chemist.status}
                    </div>

                    <div className="flex flex-col gap-1">
                      {/* Info Section */}
                      <div className="flex items-start gap-2.5">
                        {/* Avatar Section */}
                        <div className="relative shrink-0">
                          <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-300">
                            <User size={18} strokeWidth={1.5} />
                          </div>
                          <div className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm",
                            chemist.status === 'Approved' ? "bg-emerald-500" : 
                            chemist.status === 'Rejected' ? "bg-rose-500" : "bg-amber-400"
                          )}></div>
                        </div>

                        <div className="min-w-0 flex-1 pr-12">
                          <div className="flex items-center gap-1">
                            <h3 className="text-[12px] font-black text-slate-800 truncate tracking-tight group-hover:text-emerald-700 transition-colors leading-tight">
                              {chemist.name}
                            </h3>
                            {chemist.status === 'Approved' && (
                              <ShieldCheck size={11} className="text-emerald-500 shrink-0" />
                            )}
                          </div>
                          
                          <p className="text-[8px] font-black text-emerald-600/90 uppercase tracking-wider mt-0.5 truncate">
                            {chemist.contactPerson}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Row: Area and Action Buttons */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-slate-400 min-w-0">
                          <MapPin size={9} className="shrink-0" />
                          <p className="text-[9px] font-medium truncate">
                            {chemist.area}
                          </p>
                        </div>

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
                          className="flex gap-1 bg-slate-50/30 p-0.5 rounded-lg border border-slate-100/50 shrink-0"
                        >
                          <motion.button 
                            whileHover={{ scale: 1.15, y: -1, backgroundColor: '#f0f9ff' }}
                            whileTap={{ scale: 0.9 }} 
                            className="w-7 h-7 flex items-center justify-center text-blue-600 rounded-md transition-all bg-white shadow-sm border border-slate-100/50"
                            title="View Details"
                          >
                            <Eye size={14} strokeWidth={2} />
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.15, y: -1, backgroundColor: '#fffbeb' }}
                            whileTap={{ scale: 0.9 }} 
                            className="w-7 h-7 flex items-center justify-center text-amber-600 rounded-md transition-all shadow-sm border border-slate-100/50 bg-white"
                            title="Edit Record"
                          >
                            <Pencil size={14} strokeWidth={2} />
                          </motion.button>

                          {chemist.status === 'Pending' && (
                            <motion.button 
                              whileHover={{ scale: 1.15, y: -1, backgroundColor: '#fff1f2' }}
                              whileTap={{ scale: 0.9 }} 
                              onClick={() => handleDelete(chemist.id)}
                              className="w-7 h-7 flex items-center justify-center text-rose-600 rounded-md transition-all shadow-sm border border-slate-100/50 bg-white"
                              title="Delete Record"
                            >
                              <Trash2 size={14} strokeWidth={2} />
                            </motion.button>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AddChemist({ onBack, onSave }: { onBack: () => void, onSave: (c: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    mobile: '',
    email: '',
    address1: '',
    address2: '',
    state: '',
    city: '',
    headquarter: '',
    territory: '',
    area: '',
    pincode: '',
    stocklist1: '',
    stocklist2: '',
    avgPurchase: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.contactPerson) newErrors.contactPerson = 'Required';
    if (!formData.mobile) newErrors.mobile = 'Required';
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Invalid 10-digit number';
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.address1) newErrors.address1 = 'Required';
    if (!formData.state) newErrors.state = 'Required';
    if (!formData.city) newErrors.city = 'Required';
    if (!formData.headquarter) newErrors.headquarter = 'Required';
    if (!formData.territory) newErrors.territory = 'Required';
    if (!formData.area) newErrors.area = 'Required';
    if (!formData.pincode) newErrors.pincode = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    } else {
      toast.error("Please fill all required fields correctly");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
            <h1 className="text-lg font-black tracking-tight uppercase">ADD CHEMIST</h1>
            <p className="text-[9px] font-bold text-emerald-200 uppercase tracking-widest">Chemist Registration</p>
          </div>

          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
            <FlaskConical size={16} className="text-emerald-300" />
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
          {/* Shop Details Section */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Shop Details</h3>
            </div>
            
            <motion.div variants={itemVariants} className="space-y-1">
              <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Name of Chemist <span className="text-red-500">*</span></Label>
              <Input 
                placeholder="Chemist Name"
                className={cn(
                  "h-9 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300 border focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500 text-[11px]",
                  errors.name && "border-red-500 focus-visible:border-red-500"
                )}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              {errors.name && <p className="text-[8px] text-red-500 font-bold ml-1">{errors.name}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1">
              <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Person <span className="text-red-500">*</span></Label>
              <Input 
                placeholder="Enter Contact Person"
                className={cn(
                  "h-9 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300 border focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500 text-[11px]",
                  errors.contactPerson && "border-red-500 focus-visible:border-red-500"
                )}
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
              />
              {errors.contactPerson && <p className="text-[8px] text-red-500 font-bold ml-1">{errors.contactPerson}</p>}
            </motion.div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Contact Info</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <motion.div variants={itemVariants} className="space-y-1">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300" size={10} />
                  <Input 
                    placeholder="10-digit"
                    className={cn(
                      "h-9 pl-8 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-200 border focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500 text-[11px]",
                      errors.mobile && "border-red-500 focus-visible:border-red-500"
                    )}
                    value={formData.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({...formData, mobile: val});
                      if (errors.mobile) setErrors(prev => ({ ...prev, mobile: '' }));
                    }}
                  />
                </div>
                {errors.mobile && <p className="text-[8px] text-red-500 font-bold ml-1">{errors.mobile}</p>}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300" size={10} />
                  <Input 
                    placeholder="Email ID"
                    className={cn(
                      "h-9 pl-8 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-200 border focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500 text-[11px]",
                      errors.email && "border-red-500 focus-visible:border-red-500"
                    )}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                  />
                </div>
                {errors.email && <p className="text-[8px] text-red-500 font-bold ml-1">{errors.email}</p>}
              </motion.div>
            </div>
          </div>

          {/* Location Details Section */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Location Details</h3>
            </div>

            <motion.div variants={itemVariants} className="space-y-1">
              <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Address 1 <span className="text-red-500">*</span></Label>
              <Textarea 
                placeholder="Enter Address"
                className={cn(
                  "min-h-[60px] border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300 border focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500 text-[11px] resize-none",
                  errors.address1 && "border-red-500 focus-visible:border-red-500"
                )}
                value={formData.address1}
                onChange={(e) => setFormData({...formData, address1: e.target.value})}
              />
              {errors.address1 && <p className="text-[8px] text-red-500 font-bold ml-1">{errors.address1}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1">
              <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Address 2 (Optional)</Label>
              <Textarea 
                placeholder="Enter Address"
                className="min-h-[60px] border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300 border focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500 text-[11px] resize-none"
                value={formData.address2}
                onChange={(e) => setFormData({...formData, address2: e.target.value})}
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-2">
              <motion.div variants={itemVariants} className="space-y-1">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">State <span className="text-red-500">*</span></Label>
                <Select onValueChange={(v) => setFormData({...formData, state: v})}>
                  <SelectTrigger className={cn(
                    "h-9 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 border focus:ring-emerald-500/10 focus:border-emerald-500 text-[11px]",
                    errors.state && "border-red-500"
                  )}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    {['West Bengal', 'Bihar', 'Odisha'].map(opt => (
                      <SelectItem key={opt} value={opt} className="rounded-lg font-bold py-1.5 text-[11px]">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-[8px] text-red-500 font-bold ml-1">{errors.state}</p>}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">City/Town <span className="text-red-500">*</span></Label>
                <Select onValueChange={(v) => setFormData({...formData, city: v})}>
                  <SelectTrigger className={cn(
                    "h-9 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 border focus:ring-emerald-500/10 focus:border-emerald-500 text-[11px]",
                    errors.city && "border-red-500"
                  )}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    {['Kolkata', 'Howrah', 'Durgapur'].map(opt => (
                      <SelectItem key={opt} value={opt} className="rounded-lg font-bold py-1.5 text-[11px]">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && <p className="text-[8px] text-red-500 font-bold ml-1">{errors.city}</p>}
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <motion.div variants={itemVariants} className="space-y-1">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">HeadQuater <span className="text-red-500">*</span></Label>
                <Select onValueChange={(v) => setFormData({...formData, headquarter: v})}>
                  <SelectTrigger className={cn(
                    "h-9 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 border focus:ring-emerald-500/10 focus:border-emerald-500 text-[11px]",
                    errors.headquarter && "border-red-500"
                  )}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    {['KOLKATA', 'SILIGURI'].map(opt => (
                      <SelectItem key={opt} value={opt} className="rounded-lg font-bold py-1.5 text-[11px]">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.headquarter && <p className="text-[8px] text-red-500 font-bold ml-1">{errors.headquarter}</p>}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Territory <span className="text-red-500">*</span></Label>
                <Select onValueChange={(v) => setFormData({...formData, territory: v})}>
                  <SelectTrigger className={cn(
                    "h-9 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 border focus:ring-emerald-500/10 focus:border-emerald-500 text-[11px]",
                    errors.territory && "border-red-500"
                  )}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    {['SECTOR 5', 'PARK STREET'].map(opt => (
                      <SelectItem key={opt} value={opt} className="rounded-lg font-bold py-1.5 text-[11px]">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.territory && <p className="text-[8px] text-red-500 font-bold ml-1">{errors.territory}</p>}
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <motion.div variants={itemVariants} className="space-y-1">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Area <span className="text-red-500">*</span></Label>
                <Select onValueChange={(v) => setFormData({...formData, area: v})}>
                  <SelectTrigger className={cn(
                    "h-9 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 border focus:ring-emerald-500/10 focus:border-emerald-500 text-[11px]",
                    errors.area && "border-red-500"
                  )}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    {['GARIA', 'BEHALA', 'SALT LAKE'].map(opt => (
                      <SelectItem key={opt} value={opt} className="rounded-lg font-bold py-1.5 text-[11px]">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.area && <p className="text-[8px] text-red-500 font-bold ml-1">{errors.area}</p>}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode <span className="text-red-500">*</span></Label>
                <Input 
                  placeholder="000000"
                  className={cn(
                    "h-9 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300 border focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500 text-[11px]",
                    errors.pincode && "border-red-500 focus-visible:border-red-500"
                  )}
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                />
                {errors.pincode && <p className="text-[8px] text-red-500 font-bold ml-1">{errors.pincode}</p>}
              </motion.div>
            </div>
          </div>

          {/* Business Details Section */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Business Details</h3>
            </div>

            <motion.div variants={itemVariants} className="space-y-1">
              <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Stocklist Supplying 1</Label>
              <Input 
                placeholder="Enter Stocklist"
                className="h-9 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300 border focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500 text-[11px]"
                value={formData.stocklist1}
                onChange={(e) => setFormData({...formData, stocklist1: e.target.value})}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1">
              <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Stocklist Supplying 2</Label>
              <Input 
                placeholder="Enter Stocklist"
                className="h-9 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300 border focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500 text-[11px]"
                value={formData.stocklist2}
                onChange={(e) => setFormData({...formData, stocklist2: e.target.value})}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1">
              <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Avg Purchase Per Month</Label>
              <Select onValueChange={(v) => setFormData({...formData, avgPurchase: v})}>
                <SelectTrigger className="h-9 border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-800 border focus:ring-emerald-500/10 focus:border-emerald-500 text-[11px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                  {['< 10,000', '10,000 - 50,000', '> 50,000'].map(opt => (
                    <SelectItem key={opt} value={opt} className="rounded-lg font-bold py-1.5 text-[11px]">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div variants={itemVariants} className="pt-2">
              <Button 
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg transition-all text-[10px] tracking-[0.1em] uppercase group"
                onClick={handleSave}
              >
                Confirm Registration
                <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
