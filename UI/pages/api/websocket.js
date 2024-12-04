import { Server } from 'socket.io';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', socket => {
      console.log('Client connected');

      socket.on('subscribe_trades', () => {
        // Subscribe to trade updates
        socket.join('trades');
      });

      socket.on('subscribe_balances', () => {
        // Subscribe to balance updates
        socket.join('balances');
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;