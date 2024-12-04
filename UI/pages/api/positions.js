export default function handler(req, res) {
  if (req.method === 'GET') {
    // Here we would fetch actual positions from the bot
    res.status(200).json({
      positions: []
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
