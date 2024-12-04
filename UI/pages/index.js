import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [activePositions, setActivePositions] = useState([]);
  const [balances, setBalances] = useState({});
  const [monitoredChannels, setMonitoredChannels] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Trading Bot Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Trading Bot Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Active Positions</h3>
            <p className="text-3xl font-bold text-gray-900">{activePositions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">MEXC Balance</h3>
            <p className="text-3xl font-bold text-gray-900">$0.00</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Solana Balance</h3>
            <p className="text-3xl font-bold text-gray-900">0 SOL</p>
          </div>
        </div>

        {/* Active Positions */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Active Positions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leverage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PnL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activePositions.map((position, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{position.token}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{position.side}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{position.entryPrice}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{position.leverage}x</td>
                      <td className="px-6 py-4 whitespace-nowrap">{position.pnl}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-red-600 hover:text-red-900">Close</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Monitored Channels */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monitored Discord Channels</h2>
            <div className="space-y-4">
              {monitoredChannels.map((channel, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{channel.name}</span>
                  <button className="text-red-600 hover:text-red-900">Remove</button>
                </div>
              ))}
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                Add Channel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
