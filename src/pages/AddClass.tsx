import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import { Class } from '../types';
import { Save, X } from 'lucide-react';

export default function AddClass() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.teacher) return;

    const newClass: Class = {
      id: crypto.randomUUID(),
      name: formData.name,
      teacher: formData.teacher,
      startDate: formData.startDate,
      endDate: formData.endDate,
      createdAt: Date.now(),
    };

    storage.saveClass(newClass);
    navigate('/classes');
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-slate-800">Add New Class</h2>
        <button 
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Class Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Mathematics 101"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            id="input-class-name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Teacher Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Prof. Smith"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
            value={formData.teacher}
            onChange={e => setFormData({ ...formData, teacher: e.target.value })}
            id="input-teacher-name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date</label>
            <input
              type="date"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              id="input-start-date"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">End Date (Optional)</label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              value={formData.endDate}
              onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              id="input-end-date"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-6 active:scale-95"
          id="btn-save-class"
        >
          <Save size={20} />
          Save Class
        </button>
      </form>
    </div>
  );
}
