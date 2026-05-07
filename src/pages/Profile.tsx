import React from 'react';
import { User, Settings, Mail, Shield } from 'lucide-react';

export default function Profile() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-slate-800">Your Profile</h2>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
          <User size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Admin User</h3>
        <p className="text-slate-500">School Administrator</p>
      </div>

      <div className="grid gap-4">
        {[
          { icon: Settings, label: 'App Settings', sub: 'Theme, Notifications' },
          { icon: Mail, label: 'Contact Support', sub: 'Get help with MyClass' },
          { icon: Shield, label: 'Privacy Policy', sub: 'How we handle your data' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="bg-slate-100 p-2 rounded-xl text-slate-600">
              <item.icon size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-800">{item.label}</p>
              <p className="text-xs text-slate-400">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
