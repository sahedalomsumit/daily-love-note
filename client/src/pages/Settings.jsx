import React, { useState, useEffect } from 'react';
import api from '../api';
import { Shield, Smartphone, Globe, ExternalLink } from 'lucide-react';

const Settings = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await api.get('/status');
        setStatus(data);
      } catch (error) {
        console.error('Failed to fetch status');
      }
    };
    fetchStatus();
  }, []);

  const maskPhone = (phone) => {
    if (!phone) return '...';
    return `*******${phone.slice(-3)}`;
  };


  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>

      <div className="grid gap-6">
        {/* Configuration Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Shield size={16} />
            Security & Configuration
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                  <Smartphone size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Your WhatsApp (Sender)</p>
                  <p className="text-xs text-gray-400">Source of all messages</p>
                </div>
              </div>
              <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-600">
                {maskPhone(status?.senderPhone)}
              </code>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 text-pink-500 rounded-lg">
                  <Smartphone size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Wife's Phone (Recipient)</p>
                  <p className="text-xs text-gray-400">Target for daily notes</p>
                </div>
              </div>
              <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-600">
                {maskPhone(status?.wifePhone)}
              </code>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">App Secret</p>
                  <p className="text-xs text-gray-400">VITE_APP_SECRET</p>
                </div>
              </div>
              <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-600">
                ••••••••••••••••
              </code>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Timezone</p>
                  <p className="text-xs text-gray-400">Daily send time</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">7:00 AM BST (UTC+6)</p>
            </div>
          </div>
        </div>

        {/* External Cron Setup */}
        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Automation Setup</h3>
            <a 
              href="https://cron-job.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors"
            >
              cron-job.org <ExternalLink size={14} />
            </a>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              To automate the daily message, set up these jobs:
            </p>
            
            <div className="space-y-3">
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <p className="text-xs font-bold text-pink-400 uppercase mb-2">Job 1: Keep Alive</p>
                <p className="text-sm font-mono break-all text-gray-100">GET YOUR_BACKEND_URL/api/health</p>
                <p className="text-xs text-gray-400 mt-2">Schedule: Every 10 minutes</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <p className="text-xs font-bold text-pink-400 uppercase mb-2">Job 2: Daily Trigger</p>
                <p className="text-sm font-mono break-all text-gray-100">POST YOUR_BACKEND_URL/api/trigger</p>
                <div className="mt-2 space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Header Required:</p>
                  <code className="text-xs bg-black/30 px-2 py-0.5 rounded">Authorization: Bearer YOUR_APP_SECRET</code>
                </div>
                <p className="text-xs text-gray-400 mt-2">Schedule: Once daily at your preferred time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
