import { useState, useEffect } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import HomeModule from './components/HomeModule';
import DoctorModule from './components/DoctorModule';
import ChemistModule from './components/ChemistModule';
import TourPlanModule from './components/TourPlanModule';
import DCRModule from './components/DCRModule';
import ReportsModule from './components/ReportsModule';
import { MOCK_DCRS } from './mockData';
import ExpenseModule from './components/ExpenseModule';
import { Toaster } from '@/components/ui/sonner';
import { WifiOff, Bell, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Day Status tracking
  const [dcrStatus, setDcrStatus] = useState<'Draft' | 'Started' | 'Completed'>(MOCK_DCRS[0].status);
  const isDayLocked = dcrStatus === 'Draft';

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are back online!", {
        description: "Data will now sync with the server."
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline", {
        description: "You can still view cached data and draft reports."
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleUpdate = (event: any) => {
      const registration = event.detail;
      toast("Update Available", {
        description: "A new version of the app is available. Update now for the latest features.",
        action: {
          label: "Update",
          onClick: () => {
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            window.location.reload();
          }
        },
        icon: <RefreshCw className="text-blue-500 animate-spin" size={16} />,
        duration: Infinity,
      });
    };

    window.addEventListener('sw-update-available', handleUpdate);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('sw-update-available', handleUpdate);
    };
  }, []);

  if (!user) {
    return (
      <>
        <Login onLogin={setUser} />
        <Toaster position="bottom-center" />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeModule onTabChange={setActiveTab} onLogout={() => setUser(null)} />;
      case 'doctor':
        return <DoctorModule />;
      case 'chemist':
        return <ChemistModule />;
      case 'tour':
        return <TourPlanModule />;
      case 'dcr':
        return <DCRModule onStatusChange={setDcrStatus} />;
      case 'reports':
        return <ReportsModule />;
      case 'expense':
        return <ExpenseModule />;
      default:
        return <HomeModule onTabChange={setActiveTab} onLogout={() => setUser(null)} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {!isOnline && (
        <div className="bg-red-600 text-white text-[10px] py-1 px-4 flex items-center justify-center gap-2 sticky top-0 z-50 animate-pulse">
          <WifiOff size={12} /> WORKING OFFLINE - DATA WILL SYNC WHEN CONNECTED
        </div>
      )}
      {renderContent()}
      <Toaster position="bottom-center" />
    </Layout>
  );
}
