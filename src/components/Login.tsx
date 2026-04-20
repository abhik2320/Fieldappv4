import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock, User, ShieldCheck, Activity, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [shake, setShake] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Employee ID is required";
    } else if (!email.includes('@')) {
      newErrors.email = "Please enter a valid corporate email";
    }
    
    if (!password) {
      newErrors.password = "Security password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (validate()) {
      setIsLoading(true);
      // Simulate professional auth delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      onLogin(email);
      toast.success("Authentication successful", {
        description: `Welcome back to SAF Pharma Portal.`
      });
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error("Validation Failed", {
        description: "Please check the highlighted fields."
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 relative overflow-hidden font-sans bg-slate-950">
      {/* Immersive Medical Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=2000" 
          alt="Medical Research"
          className="w-full h-full object-cover opacity-30 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#004d35]/80 via-[#004d35]/60 to-[#004d35]/90" />
      </div>

      {/* Floating Abstract Medical Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-secondary/20 rounded-full blur-[120px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-sm"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-4 rounded-2xl shadow-2xl mb-4 border border-white/20"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-[3px] bg-red-600 mb-[3px] rounded-full"></div>
              <span className="text-[#004d35] font-black text-3xl leading-none tracking-tighter">saf</span>
              <div className="w-12 h-[3px] bg-blue-900 mt-[2px] rounded-full"></div>
            </div>
          </motion.div>
          <h1 className="text-white text-2xl font-bold tracking-tight text-center flex flex-col items-center">
            <span className="font-brand font-black text-4xl tracking-tighter">
              <span className="text-white">Field</span>
              <span className="text-red-500">Force</span>
            </span>
          </h1>
        </div>

        {/* Glassmorphism Login Card */}
        <motion.div 
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden"
        >
          {/* Subtle Inner Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10" noValidate>
            <div className="space-y-1">
              <label className="text-white/70 text-[9px] font-bold uppercase tracking-widest ml-1">Employee ID / Email</label>
              <div className="group relative transition-all duration-300">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`}>
                  <User size={16} />
                </div>
                <Input
                  type="email"
                  placeholder="name@safpharma.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  className={`bg-white/5 h-12 pl-11 rounded-xl text-white placeholder:text-white/20 transition-all text-sm ${errors.email ? 'border-red-500/50 bg-red-500/5 focus-visible:ring-red-500/30' : 'border-white/10 focus-visible:ring-primary/50 focus-visible:bg-white/10'}`}
                  required
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="text-red-400 text-[9px] font-bold flex items-center gap-1 ml-1"
                  >
                    <AlertCircle size={10} /> {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-white/70 text-[9px] font-bold uppercase tracking-widest">Security Password</label>
                <button type="button" className="text-white/40 text-[9px] hover:text-white transition-colors font-medium">
                  Forgot?
                </button>
              </div>
              <div className="group relative transition-all duration-300">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`}>
                  <Lock size={16} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  className={`bg-white/5 h-12 pl-11 pr-11 rounded-xl text-white placeholder:text-white/20 transition-all text-sm ${errors.password ? 'border-red-500/50 bg-red-500/5 focus-visible:ring-red-500/30' : 'border-white/10 focus-visible:ring-primary/50 focus-visible:bg-white/10'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="text-red-400 text-[9px] font-bold flex items-center gap-1 ml-1"
                  >
                    <AlertCircle size={10} /> {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-13 bg-gradient-to-r from-[#006847] to-[#004d35] text-white font-black text-base rounded-xl shadow-[0_20px_40px_-12px_rgba(0,77,53,0.4)] transition-all active:scale-[0.98] mt-4 relative overflow-hidden group border border-white/10"
            >
              {/* Animated Shine Effect */}
              <motion.div 
                initial={{ x: '-100%', skewX: -20 }}
                animate={{ x: '200%' }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 h-full pointer-events-none"
              />

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Activity className="animate-pulse text-emerald-300" size={18} />
                    <span className="tracking-tight text-xs">AUTHENTICATING</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="tracking-widest uppercase text-xs">Access Portal</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ShieldCheck size={16} className="text-emerald-400" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading Progress Bar */}
              {isLoading && (
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute bottom-0 left-0 h-1.5 bg-emerald-400 shadow-[0_0_10px_#34d399] w-full"
                />
              )}
              
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
            </Button>
          </form>
        </motion.div>

        {/* Trust Badge Footer */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
            <ShieldCheck size={14} />
            <span>FieldForce Secure Network</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
