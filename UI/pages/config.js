import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Config() {
  const [config, setConfig] = useState({
    mexcApiKey: '',
    mexcApiSecret: '',
    solanaPrivateKey: '',
    discordBotToken: '',
    riskManagement: {
      maxLeverage: 10,
      defaultStopLoss: 2,
      defaultTakeProfit: 6,
      maxPositionSize: 1000
    }
  });

  const saveConfig = async () => {
    try {
      const response = await fetch('/api/bot/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        alert('Configuration saved successfully');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error saving configuration');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Bot Configuration</title>
      </Head>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Bot Configuration</h2>

          <div className="space-y-6">
            {/* API Keys */}
            <div>
              <h3 className="text-lg font-medium mb-4">API Keys</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">MEXC API Key</label>
                  <input 
                    type="password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={config.mexcApiKey}
                    onChange={(e) => setConfig({...config, mexcApiKey: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">MEXC API Secret</label>
                  <input 
                    type="password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={config.mexcApiSecret}
                    onChange={(e) => setConfig({...config, mexcApiSecret: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Solana Private Key</label>
                  <input 
                    type="password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={config.solanaPrivateKey}
                    onChange={(e) => setConfig({...config, solanaPrivateKey: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discord Bot Token</label>
                  <input 
                    type="password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={config.discordBotToken}
                    onChange={(e) => setConfig({...config, discordBotToken: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Risk Management */}
            <div>
              <h3 className="text-lg font-medium mb-4">Risk Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Leverage</label>
                  <input 
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={config.riskManagement.maxLeverage}
                    onChange={(e) => setConfig({
                      ...config,
                      riskManagement: {
                        ...config.riskManagement,
                        maxLeverage: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default Stop Loss (%)</label>
                  <input 
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={config.riskManagement.defaultStopLoss}
                    onChange={(e) => setConfig({
                      ...config,
                      riskManagement: {
                        ...config.riskManagement,
                        defaultStopLoss: parseFloat(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default Take Profit (%)</label>
                  <input 
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={config.riskManagement.defaultTakeProfit}
                    onChange={(e) => setConfig({
                      ...config,
                      riskManagement: {
                        ...config.riskManagement,
                        defaultTakeProfit: parseFloat(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Position Size (USDT)</label>
                  <input 
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={config.riskManagement.maxPositionSize}
                    onChange={(e) => setConfig({
                      ...config,
                      riskManagement: {
                        ...config.riskManagement,
                        maxPositionSize: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={saveConfig}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
