import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, GraduationCap, User, MoreVertical } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  const getSubTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/classes')) return 'Dashboard : Classess :';
    if (path.startsWith('/attendance')) return 'Dashboard : Attendance :';
    if (path.startsWith('/reports')) return 'Dashboard : Reports :';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-teal-700 text-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-teal-800 rounded-lg transition-colors"
              id="back-button"
            >
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
            <div className="bg-white p-1 rounded">
              <GraduationCap className="text-teal-700" size={24} />
            </div>
          </div>
          
          <div className="bg-white px-8 py-1 rounded shadow-sm">
            <h1 className="text-2xl font-display font-bold text-slate-800 tracking-tight leading-none">MyClass</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center border-2 border-teal-600">
              <User size={20} className="text-slate-600" />
            </div>
            <MoreVertical size={24} />
          </div>
        </div>
        
        <div className="bg-teal-700 border-t border-teal-600/30 px-4 py-1.5 overflow-hidden">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-[13px] font-bold text-teal-50">
            <span className="tracking-tight">{getSubTitle()}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-3 md:p-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
