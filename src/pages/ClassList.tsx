import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  Calendar, 
  MoreVertical, 
  UserCheck, 
  BarChart3, 
  FileText, 
  Monitor,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import { Class } from '../types';
import { motion } from 'motion/react';

export default function ClassList() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const allCls = storage.getClasses();
    setClasses(allCls);
    
    const studentCounts: Record<string, number> = {};
    allCls.forEach(cls => {
      studentCounts[cls.id] = storage.getStudents(cls.id).length;
    });
    setCounts(studentCounts);
  }, []);

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 border border-slate-300 p-1 rounded min-w-[80px] justify-center">
          <Monitor size={20} className="text-teal-700" />
          <span className="font-bold text-slate-700">{classes.length}</span>
        </div>
        <button
          onClick={() => navigate('/add-class')}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center gap-2 font-bold text-sm shadow-sm transition-transform active:scale-95"
          id="btn-add-class-top"
        >
          <Plus size={18} strokeWidth={3} />
          Add New Class
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">No classes found. Tap Add New Class to start.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {classes.map((cls, index) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              id={`class-card-${cls.id}`}
            >
              {/* Card Header */}
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-display font-bold text-teal-700 leading-none">
                    {cls.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-4 text-[13px] font-bold text-slate-500">
                    <div className="flex items-center gap-1">
                      <span>{new Date(cls.startDate).toLocaleDateString('eb-GB')}</span>
                      <span className="text-[10px]">To</span>
                      <span>{cls.endDate ? new Date(cls.endDate).toLocaleDateString('eb-GB') : new Date().toLocaleDateString('eb-GB')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-normal">Incharge :</span>
                      <span className="uppercase text-slate-700 font-black">{cls.teacher.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 font-bold text-teal-700">
                    <Users size={18} />
                    <span className="text-sm">{counts[cls.id] || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-teal-700">
                    <UserCheck size={18} />
                    <span className="text-sm">0</span>
                  </div>
                </div>
              </div>

              {/* Action Grid */}
              <div className="border-t border-slate-100 p-2 grid grid-cols-5 gap-1">
                {[
                  { icon: Users, label: 'Students', action: () => navigate(`/classes/${cls.id}`) },
                  { icon: CheckCircle2, label: 'Attendance', action: () => navigate(`/attendance/${cls.id}`) },
                  { icon: BarChart3, label: 'Reports', action: () => navigate(`/reports/${cls.id}`) },
                  { icon: FileText, label: 'Exams', action: () => {} },
                  { icon: MoreVertical, label: 'More...', action: () => {} },
                ].map((btn, i) => (
                  <button
                    key={i}
                    onClick={btn.action}
                    className="flex flex-col items-center gap-1 py-2 px-1 hover:bg-slate-50 rounded-lg transition-colors group active:scale-90"
                  >
                    <div className="bg-teal-600 p-1.5 rounded text-white group-hover:scale-110 transition-transform">
                      <btn.icon size={18} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 group-hover:text-teal-700">{btn.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
