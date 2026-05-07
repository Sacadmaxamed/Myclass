import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import { Class, Student, AttendanceRecord } from '../types';
import { BarChart3, TrendingUp, TrendingDown, ChevronRight, PieChart, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface ReportsProps {
  detailMode?: boolean;
}

export default function Reports({ detailMode }: ReportsProps) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const allCls = storage.getClasses();
    setClasses(allCls);

    if (classId && detailMode) {
      const cls = allCls.find(c => c.id === classId);
      if (cls) {
        setCurrentClass(cls);
        setStudents(storage.getStudents(classId));
        setAttendance(storage.getAttendance(classId));
      }
    }
  }, [classId, detailMode]);

  const calculateStats = (studentId: string) => {
    const relevantRecords = attendance.map(a => a.records.find(r => r.studentId === studentId)).filter(Boolean);
    const total = relevantRecords.length;
    const present = relevantRecords.filter(r => r?.status === 'present').length;
    const percentage = total === 0 ? 0 : Math.round((present / total) * 100);
    return { total, present, percentage };
  };

  const calculateClassOverall = () => {
    let totalPresent = 0;
    let totalPossible = 0;
    attendance.forEach(day => {
      day.records.forEach(r => {
        totalPossible++;
        if (r.status === 'present') totalPresent++;
      });
    });
    return totalPossible === 0 ? 0 : Math.round((totalPresent / totalPossible) * 100);
  };

  if (!detailMode) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-slate-800">Attendance Reports</h2>
        <div className="grid gap-3">
          {classes.map((cls, idx) => (
            <motion.div 
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/reports/${cls.id}`)}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-teal-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-teal-100 text-teal-600 p-3 rounded-xl">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{cls.name}</h3>
                  <p className="text-sm text-slate-500">View performance</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </motion.div>
          ))}
          {classes.length === 0 && (
            <p className="text-center py-12 text-slate-400">No classes available.</p>
          )}
        </div>
      </div>
    );
  }

  if (!currentClass) return null;

  const classPercentage = calculateClassOverall();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-8 rounded-3xl text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-display font-bold">{currentClass.name}</h2>
            <p className="text-teal-100 mt-1 opacity-80 uppercase tracking-widest text-sm font-bold">Overall Attendance</p>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <PieChart size={32} />
          </div>
        </div>
        <div className="mt-8 flex items-end gap-2">
          <span className="text-6xl font-display font-bold">{classPercentage}%</span>
          <span className="mb-2 text-teal-200 font-medium tracking-tight">target 75%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Days Recorded</p>
            <p className="text-2xl font-display font-bold text-slate-800">{attendance.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-teal-100 text-teal-600 p-3 rounded-2xl">
            <Users size={24} className="lucide-react lucide-users" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Students</p>
            <p className="text-2xl font-display font-bold text-slate-800">{students.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-display font-bold text-slate-800 mb-6">Student Performance</h3>
        <div className="space-y-4">
          {students.map(student => {
            const { percentage, total, present } = calculateStats(student.id);
            return (
              <div key={student.id} className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="font-bold text-slate-700">{student.name}</span>
                  <span className={`text-sm font-bold ${percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {percentage}%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={`h-full rounded-full ${percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  {present} of {total} sessions attended
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
