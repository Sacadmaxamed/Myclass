import React from 'react';
import { Database, Download, Upload, AlertTriangle } from 'lucide-react';

export default function Backup() {
  const handleExport = () => {
    const data = {
      classes: JSON.parse(localStorage.getItem('myclass_classes') || '[]'),
      students: JSON.parse(localStorage.getItem('myclass_students') || '[]'),
      attendance: JSON.parse(localStorage.getItem('myclass_attendance') || '[]'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `myclass_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-slate-800">Data & Backup</h2>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4">
        <AlertTriangle className="text-amber-600 shrink-0" />
        <div>
          <h3 className="font-bold text-amber-900">Local Storage Only</h3>
          <p className="text-sm text-amber-700">Your data is currently stored only on this device. Be sure to export backups regularly to avoid data loss.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={handleExport}
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4"
        >
          <div className="bg-teal-100 text-teal-600 p-4 rounded-2xl">
            <Download size={32} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Export JSON</h4>
            <p className="text-xs text-slate-400">Download all your records</p>
          </div>
        </button>

        <button className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4 opacity-50 cursor-not-allowed">
          <div className="bg-slate-100 text-slate-600 p-4 rounded-2xl">
            <Upload size={32} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Import Data</h4>
            <p className="text-xs text-slate-400">Restore from backup (Coming soon)</p>
          </div>
        </button>
      </div>
    </div>
  );
}
