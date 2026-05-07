import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import { Class, Student, AttendanceRecord } from '../types';
import { Check, X, Save, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AttendanceProps {
  markMode?: boolean;
}

export default function Attendance({ markMode }: AttendanceProps) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<Record<string, 'present' | 'absent'>>({});

  useEffect(() => {
    const allCls = storage.getClasses();
    setClasses(allCls);

    if (classId && markMode) {
      const cls = allCls.find(c => c.id === classId);
      if (cls) {
        setCurrentClass(cls);
        const stus = storage.getStudents(classId);
        setStudents(stus);
        
        // Load existing records for this date if any
        const existingRecords = storage.getAttendance(classId).find(r => r.date === date);
        if (existingRecords) {
          const recObj: Record<string, 'present' | 'absent'> = {};
          existingRecords.records.forEach(r => {
            recObj[r.studentId] = r.status;
          });
          setRecords(recObj);
        } else {
          // Initialize with all present
          const init: Record<string, 'present' | 'absent'> = {};
          stus.forEach(s => { init[s.id] = 'present'; });
          setRecords(init);
        }
      }
    }
  }, [classId, markMode, date]);

  const handleToggle = (studentId: string) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const handleSave = () => {
    if (!classId) return;
    const record: AttendanceRecord = {
      id: crypto.randomUUID(),
      classId,
      date,
      records: Object.entries(records).map(([studentId, status]) => ({
        studentId,
        status: status as 'present' | 'absent'
      }))
    };
    storage.saveAttendance(record);
    navigate('/attendance');
  };

  if (!markMode) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-slate-800">Select Class for Attendance</h2>
        <div className="grid gap-3">
          {classes.map((cls, idx) => (
            <motion.div 
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/attendance/${cls.id}`)}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-teal-50 transition-colors group"
            >
              <div>
                <h3 className="font-bold text-slate-800">{cls.name}</h3>
                <p className="text-sm text-slate-500">{cls.teacher}</p>
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

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-800">{currentClass.name}</h2>
            <p className="text-slate-500">Mark Attendance</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
            <CalendarIcon size={18} className="text-slate-400" />
            <input 
              type="date" 
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {students.map((student) => (
          <div 
            key={student.id}
            onClick={() => handleToggle(student.id)}
            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              records[student.id] === 'present' 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-rose-50 border-rose-200'
            }`}
          >
            <div>
              <h4 className={`font-bold ${records[student.id] === 'present' ? 'text-emerald-800' : 'text-rose-800'}`}>
                {student.name}
              </h4>
              <p className="text-xs opacity-60 font-semibold tracking-wider">ROLL: {student.rollNumber}</p>
            </div>
            <div className={`p-2 rounded-full ${
              records[student.id] === 'present' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-rose-500 text-white'
            }`}>
              {records[student.id] === 'present' ? <Check size={20} /> : <X size={20} />}
            </div>
          </div>
        ))}

        {students.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p>Please add students to this class first.</p>
            <button 
              onClick={() => navigate(`/classes/${currentClass.id}`)}
              className="text-teal-600 font-bold hover:underline mt-2"
            >
              Add Students
            </button>
          </div>
        )}
      </div>

      {students.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
          <button
            onClick={handleSave}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
            id="btn-save-attendance"
          >
            <Save size={20} />
            Save Attendance
          </button>
        </div>
      )}
    </div>
  );
}
