import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const TriggerButton = ({ onSuccess, disabled: parentDisabled }) => {
  const [loading, setLoading] = useState(false);

  const handleTrigger = async () => {
    setLoading(true);
    try {
      const response = await api.post('/trigger');
      toast.success('Message sent successfully!');
      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleTrigger}
      disabled={loading || parentDisabled}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-200"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <Send size={20} />
      )}
      <span>Send Now</span>
    </button>
  );
};

export default TriggerButton;
