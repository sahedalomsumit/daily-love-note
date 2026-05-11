import React from 'react';
import { format } from 'date-fns';
import { Heart, Send, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

const MessageCard = ({ message }) => {
  const isSent = message.status === 'sent';
  const date = message.sentAt?.seconds 
    ? new Date(message.sentAt.seconds * 1000) 
    : new Date();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className={clsx(
            "p-2 rounded-lg",
            isSent ? "bg-pink-50 text-pink-500" : "bg-red-50 text-red-500"
          )}>
            {isSent ? <Heart size={18} fill={isSent ? "currentColor" : "none"} /> : <AlertCircle size={18} />}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {format(date, 'MMM dd, yyyy • hh:mm a')}
            </p>
          </div>
        </div>
        <span className={clsx(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
          message.triggeredBy === 'auto' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
        )}>
          {message.triggeredBy}
        </span>
      </div>
      
      <p className="text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
        {message.content}
      </p>

      {!isSent && (
        <p className="mt-3 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          Failed to deliver
        </p>
      )}
    </div>
  );
};

export default MessageCard;
