import React, { useState, useEffect } from 'react';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import QRScanner from '../components/QRScanner';
import MessageCard from '../components/MessageCard';
import TriggerButton from '../components/TriggerButton';
import { Calendar, Clock, Phone, Bot } from 'lucide-react';

const Dashboard = () => {
  const [status, setStatus] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const { data } = await api.get('/status');
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch status');
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/history');
      if (data.length > 0) {
        setLastMessage(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch history');
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchStatus(), fetchHistory()]);
      setLoading(false);
    };
    init();

    const interval = setInterval(fetchStatus, 5000); // Poll status every 5s
    return () => clearInterval(interval);
  }, []);

  const formatPhone = (phone) => {
    if (!phone) return 'Not Configured';
    const lastThree = phone.slice(-3);
    return `*******${lastThree}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">WhatsApp Connection</h3>
              <StatusBadge status={status?.status} />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{formatPhone(status?.wifePhone)}</p>
                <p className="text-[10px] text-gray-400">Target Recipient</p>
              </div>
            </div>
          </div>
        </div>


        {/* Schedule Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Next Scheduled Send</h3>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">7:00 AM BST</p>
                <p className="text-[10px] text-gray-400">Daily Automation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Model Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">AI Engine Stack</h3>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg mt-1">
                <Bot size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-700 truncate">
                  {status?.models?.[0] || 'Gemini 2.0 Flash'}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {status?.models?.slice(1, 4).map((m, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-gray-50 text-[9px] text-gray-400 rounded-md border border-gray-100">
                      {m}
                    </span>
                  ))}
                  {(status?.models?.length > 4) && (
                    <span className="px-1.5 py-0.5 bg-gray-50 text-[9px] text-gray-400 rounded-md border border-gray-100">
                      +{status.models.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
          </div>
          <div className="bg-linear-to-br from-pink-50 to-white p-8 rounded-4xl border border-pink-100/50 flex flex-col items-center text-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-pink-200/30 transition-colors"></div>
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-pink-500 mb-2 relative z-10">
              <Calendar size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 relative z-10">Manually Trigger Note</h3>
            <p className="text-sm text-gray-500 max-w-xs relative z-10">
              Can't wait for the schedule? Send a beautiful note to Tamanna right now.
            </p>
            <div className="relative z-10 w-full">
              <TriggerButton onSuccess={(newMsg) => setLastMessage(newMsg)} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Last Sent Message</h2>
          {lastMessage ? (
            <MessageCard message={lastMessage} />
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
              <p className="text-gray-400 italic">No messages sent yet</p>
            </div>
          )}
        </div>
      </div>

      {status?.status === 'QR_READY' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <QRScanner qr={status.qr} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
