import { useState } from 'react';
import Head from 'next/head';
import { RealTimeChart } from '../components/RealTimeChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Backtest() {
  const [backtest, setBacktest] = useState({
    startDate: '',
    endDate: '',
    initialBalance: 1000,
    leverageRange: [1, 10],
    pairs: [],
    signalPatterns: [],
    running: false,
    results: null
  });

  const [availablePairs] = useState([
    'BTC/USDT',
    'ETH/USDT',
    'SOL/USDT',
    'AVAX/USDT',
    'MATIC/USDT'
  ]);

  const runBacktest = async () => {
    try {
      setBacktest({ ...backtest, running: true });
      const response = await fetch('/api/bot/backtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backtest)
      });
      
      const results = await response.json();
      setBacktest({
        ...backtest,
        running: false,
        results
      });
    } catch (error) {
      console.error('Backtest error:', error);
      setBacktest({ ...backtest, running: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Trading Bot Backtest</title>
      </Head>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Backtest Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={backtest.startDate}
                      onChange={(e) => setBacktest({ ...backtest, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={backtest.endDate}
                      onChange={(e) => setBacktest({ ...backtest, endDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Initial Balance */}
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Balance (USDT)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={backtest.initialBalance}
                    onChange={(e) => setBacktest({ ...backtest, initialBalance: parseFloat(e.target.value) })}
                  />
                </div>

                {/* Trading Pairs */}
                <div>
                  <label className="block text-sm font-medium mb-1">Trading Pairs</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availablePairs.map(pair => (
                      <button
                        key={pair}
                        onClick={() => {
                          if (backtest.pairs.includes(pair)) {
                            setBacktest({
                              ...backtest,
                              pairs: backtest.pairs.filter(p => p !== pair)
                            });
                          } else {
                            setBacktest({
                              ...backtest,
                              pairs: [...backtest.pairs, pair]
                            });
                          }
                        }}
                        className={`p-2 rounded ${backtest.pairs.includes(pair) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                      >
                        {pair}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Backtest Button */}
                <button
                  onClick={runBacktest}
                  disabled={backtest.running}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded font-medium disabled:opacity-50"
                >
                  {backtest.running ? 'Running...' : 'Start Backtest'}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          {backtest.results && (
            <Card>
              <CardHeader>
                <CardTitle>Backtest Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded">
                      <p className="text-sm text-gray-500">Total Profit/Loss</p>
                      <p className={`text-2xl font-bold ${backtest.results.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {backtest.results.totalPnL >= 0 ? '+' : ''}{backtest.results.totalPnL}%
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                      <p className="text-sm text-gray-500">Win Rate</p>
                      <p className="text-2xl font-bold">{backtest.results.winRate}%</p>
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <RealTimeChart data={backtest.results.equityCurve} />

                  {/* Trade List */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Trade History</h3>
                    <div className="max-h-60 overflow-y-auto">
                      {backtest.results.trades.map((trade, index) => (
                        <div key={index} className="border-b p-2">
                          <div className="flex justify-between">
                            <span>{trade.pair}</span>
                            <span className={trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                              {trade.profit >= 0 ? '+' : ''}{trade.profit}%
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(trade.date).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
