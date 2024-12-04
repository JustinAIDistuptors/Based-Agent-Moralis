export default function handler(req, res) {
  if (req.method === 'GET') {
    // Here we would fetch actual balances from the bot
    res.status(200).json({
      mexc: 0,
      solana: 0
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
