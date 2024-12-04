import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const PositionCard = ({ position, onClose }) => {
  const isProfit = parseFloat(position.pnl) > 0;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{position.symbol}</h3>
        <span className={`flex items-center ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
          {isProfit ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
          {position.pnl}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Entry Price</p>
          <p className="font-medium">${position.entryPrice}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="font-medium">${position.currentPrice}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Size</p>
          <p className="font-medium">{position.size} {position.symbol}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Leverage</p>
          <p className="font-medium">{position.leverage}x</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => onClose(position.symbol)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Close Position
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
          Edit SL/TP
        </button>
      </div>
    </div>
  );
};