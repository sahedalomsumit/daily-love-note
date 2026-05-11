import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const statusColors = {
  'DISCONNECTED': 'bg-red-500',
  'QR_READY': 'bg-yellow-500',
  'AUTHENTICATED': 'bg-blue-500',
  'READY': 'bg-green-500',
};

const StatusBadge = ({ status }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={twMerge(clsx(
        "w-3 h-3 rounded-full animate-pulse",
        statusColors[status] || 'bg-gray-500'
      ))} />
      <span className="text-sm font-medium text-gray-700">
        {status || 'UNKNOWN'}
      </span>
    </div>
  );
};

export default StatusBadge;
