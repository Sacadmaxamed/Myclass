import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import { Student, Class } from '../types';
import { Plus, UserPlus, GraduationCap, ArrowLeft, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentList() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState<{
    name: string;
    rollNumber: string;
    motherName: string;
    phone: string;
    gender: 'Male' | 'Female' | 'Other';
  }>({ 
    name: '', 
    rollNumber: '', 
    motherName: '', 
    phone: '', 
    gender: 'Male' 
  });

  useEffect(() => {
    if (classId) {
      const cls = storage.getClasses().find(c => c.id === classId);
      if (cls) {
        setCurrentClass(cls);
        setStudents(storage.getStudents(classId));
      } else {
        navigate('/classes');
      }
    }
  }, [classId, navigate]);

  useEffect(() => {
    if (isAdding) {
      setNewStudent(prev => ({
        ...prev,
        rollNumber: (students.length + 1).toString().padStart(2, '0')
      }));
    }
  }, [isAdding, students.length]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !classId) return;

    const student: Student = {
      id: crypto.randomUUID(),
      classId,
      name: newStudent.name,
      rollNumber: newStudent.rollNumber,
      motherName: newStudent.motherName,
      phone: newStudent.phone,
      gender: newStudent.gender,
    };

    storage.saveStudent(student);
    setStudents([...students, student]);
    setNewStudent({ 
      name: '', 
      rollNumber: '', 
      motherName: '', 
      phone: '', 
      gender: 'Male' 
    });
    setIsAdding(false);
  };

  if (!currentClass) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">{currentClass.name}</h2>
          <p className="text-slate-500">Manage Students</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg text-slate-700 flex items-center gap-2">
              <GraduationCap className="text-teal-600" />
              Student Roster ({students.length})
            </h3>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-teal-50 text-teal-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-teal-100 transition-colors"
            >
              <UserPlus size={18} />
              Add Student
            </button>
          </div>

          <AnimatePresence>
            {isAdding && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleAddStudent}
                className="mb-8 p-6 bg-slate-50 rounded-2xl space-y-4 overflow-hidden border border-slate-200 shadow-inner"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Student Name</label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium"
                      value={newStudent.name}
                      onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Mother's Name</label>
                    <input
                      type="text"
                      placeholder="Enter Mother's Name"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium"
                      value={newStudent.motherName}
                      onChange={e => setNewStudent({ ...newStudent, motherName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter Phone Number"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium"
                      value={newStudent.phone}
                      onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Roll No (Auto)</label>
                      <input
                        type="text"
                        readOnly
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-bold text-teal-700 outline-none cursor-not-allowed"
                        value={newStudent.rollNumber}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Gender</label>
                      <select
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium appearance-none"
                        value={newStudent.gender}
                        onChange={e => setNewStudent({ ...newStudent, gender: e.target.value as any })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="px-6 py-2.5 text-slate-500 font-bold border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-teal-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-teal-600/20 active:scale-95 transition-transform"
                  >
                    Save Student
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {students.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No students enrolled in this class.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student, idx) => (
                <div 
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-black text-lg border-2 border-white shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg group-hover:text-teal-700 transition-colors">
                        {student.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          Roll: <span className="text-slate-600">{student.rollNumber}</span>
                        </p>
                        {student.phone && (
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            Phone: <span className="text-slate-600">{student.phone}</span>
                          </p>
                        )}
                        {student.gender && (
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            Gender: <span className="text-slate-600">{student.gender}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
