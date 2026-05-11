import React from 'react';

const QRScanner = ({ qr }) => {
  if (!qr) return null;

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800">Scan QR Code</h3>
      <div className="p-4 bg-gray-50 rounded-xl">
        <img src={qr} alt="WhatsApp QR Code" className="w-64 h-64" />
      </div>
      <p className="text-sm text-gray-500 text-center">
        Open WhatsApp on your phone and scan this code to link your account.
      </p>
    </div>
  );
};

export default QRScanner;
