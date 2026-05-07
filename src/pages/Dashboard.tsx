import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  UserCheck, 
  BarChart3, 
  User, 
  Database,
  PlusCircle
} from 'lucide-react';
import { motion } from 'motion/react';

const MENU_ITEMS = [
  { id: 'classes', icon: BookOpen, label: 'CLASSES', path: '/classes', color: 'bg-teal-500' },
  { id: 'attendance', icon: UserCheck, label: 'ATTENDANCE', path: '/attendance', color: 'bg-teal-600' },
  { id: 'reports', icon: BarChart3, label: 'REPORTS', path: '/reports', color: 'bg-teal-700' },
  { id: 'profile', icon: User, label: 'PROFILE', path: '/profile', color: 'bg-slate-700' },
  { id: 'backup', icon: Database, label: 'BACKUP', path: '/backup', color: 'bg-slate-600' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MENU_ITEMS.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(item.path)}
            className={`${item.color} p-6 rounded-2xl text-white shadow-md hover:shadow-xl transition-all flex items-center gap-4 group active:scale-95`}
            id={`menu-item-${item.id}`}
          >
            <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <item.icon size={28} />
            </div>
            <span className="text-lg font-display font-semibold tracking-wide">{item.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-widest">Recent Activity</h2>
        <div className="text-center py-8 text-slate-400">
          <p>No recent activity. Start by adding a class!</p>
          <button 
            onClick={() => navigate('/add-class')}
            className="mt-4 inline-flex items-center gap-2 text-teal-600 font-semibold hover:underline"
          >
            <PlusCircle size={18} />
            Add New Class
          </button>
        </div>
      </div>
    </div>
  );
}
