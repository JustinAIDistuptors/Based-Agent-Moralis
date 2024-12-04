import React from 'react';
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const AnalyticsDashboard = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* PnL Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Profit/Loss Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.pnlHistory}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="pnl" 
                  stroke="#10b981"
                  name="PnL (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trade Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Trade Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Win Rate</p>
              <p className="text-2xl font-bold">
                {data.stats.winRate}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Trades</p>
              <p className="text-2xl font-bold">
                {data.stats.totalTrades}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Profit</p>
              <p className="text-2xl font-bold text-green-500">
                {data.stats.avgProfit > 0 && '+'}{data.stats.avgProfit}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Loss</p>
              <p className="text-2xl font-bold text-red-500">
                {data.stats.avgLoss}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentTrades.map((trade, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{trade.symbol}</p>
                  <p className="text-sm text-gray-500">{trade.date}</p>
                </div>
                <div>
                  <p className={`font-bold ${trade.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trade.profit > 0 && '+'}{trade.profit}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Asset Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.assetDistribution.map((asset, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span>{asset.name}</span>
                  <span>{asset.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${asset.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
