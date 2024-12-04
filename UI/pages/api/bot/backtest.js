import { backtest_strategy } from '../../../../Based-Agent/backtester';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const config = req.body;
    
    // Validate required fields
    const requiredFields = ['startDate', 'endDate', 'initialBalance', 'pairs'];
    for (const field of requiredFields) {
      if (!config[field]) {
        return res.status(400).json({
          status: 'error',
          message: `Missing required field: ${field}`
        });
      }
    }

    // Run backtest
    const results = await backtest_strategy(config);

    if (results.status === 'error') {
      return res.status(500).json(results);
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error('Backtest error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
