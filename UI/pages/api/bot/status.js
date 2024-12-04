import { SmartTrader } from '../../../smart_trader';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const trader = new SmartTrader(
        process.env.MEXC_API_KEY,
        process.env.MEXC_API_SECRET,
        process.env.SOLANA_PRIVATE_KEY
      );
      
      const balances = await trader.get_balances();
      const positions = trader.active_trades;
      
      res.status(200).json({
        status: 'active',
        balances,
        positions,
        lastUpdate: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
