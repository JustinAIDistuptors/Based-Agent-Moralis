import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const configPath = path.join(process.cwd(), 'config.json');
  
  if (req.method === 'GET') {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      res.status(200).json({ channels: config.monitored_channels || [] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { channelId } = req.body;
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      if (!config.monitored_channels) {
        config.monitored_channels = [];
      }
      
      if (!config.monitored_channels.includes(channelId)) {
        config.monitored_channels.push(channelId);
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      }
      
      res.status(200).json({ channels: config.monitored_channels });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { channelId } = req.body;
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      if (config.monitored_channels) {
        config.monitored_channels = config.monitored_channels.filter(
          id => id !== channelId
        );
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      }
      
      res.status(200).json({ channels: config.monitored_channels });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
