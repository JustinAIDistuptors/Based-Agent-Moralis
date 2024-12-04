import { SmartTrader } from '../../../smart_trader';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { token } = req.body;
      
      const trader = new SmartTrader(
        process.env.MEXC_API_KEY,
        process.env.MEXC_API_SECRET,
        process.env.SOLANA_PRIVATE_KEY
      );
      
      const result = await trader.close_position(token);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
