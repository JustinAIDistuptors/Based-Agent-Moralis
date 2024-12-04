import React from 'react';

export const TradeAlert = ({ type, message, onClose }) => {
  const types = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <div className={`p-4 rounded-lg ${types[type]} relative`}>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
      <p>{message}</p>
    </div>
  );
};