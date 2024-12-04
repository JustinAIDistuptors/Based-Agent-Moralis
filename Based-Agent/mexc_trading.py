import hmac
import hashlib
import requests
import time
from typing import Dict, Any, Optional
import os
import json

class MEXCTrader:
    def __init__(self, api_key: str, api_secret: str, testnet: bool = False):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = 'https://api.mexc.com' if not testnet else 'https://api.mexc.com/api/v3/test'

    def _generate_signature(self, params: Dict) -> str:
        query_string = '&'.join([f'{k}={v}' for k, v in sorted(params.items())])
        return hmac.new(self.api_secret.encode('utf-8'),
                       query_string.encode('utf-8'),
                       hashlib.sha256).hexdigest()

    def _send_request(self, method: str, endpoint: str, params: Dict = None, signed: bool = True) -> Dict:
        url = f'{self.base_url}{endpoint}'
        headers = {'Content-Type': 'application/json'}

        if signed:
            timestamp = int(time.time() * 1000)
            params = params or {}
            params['timestamp'] = timestamp
            params['recvWindow'] = 5000
            signature = self._generate_signature(params)

            headers.update({
                'X-MEXC-APIKEY': self.api_key,
                'X-MEXC-SIGNATURE': signature
            })

        response = requests.request(method,
                                  url,
                                  headers=headers,
                                  params=params if method == 'GET' else None,
                                  json=params if method == 'POST' else None)
        response.raise_for_status()
        return response.json()

    def get_account_info(self) -> Dict:
        """Get account information including balances"""
        return self._send_request('GET', '/api/v3/account')

    def place_order(self,
                    symbol: str,
                    side: str,
                    order_type: str,
                    quantity: float,
                    price: float = None,
                    leverage: int = None,
                    stop_price: float = None,
                    position_side: str = None) -> Dict:
        """Place a new order

        Args:
            symbol: Trading pair symbol (e.g., 'BTCUSDT')
            side: 'BUY' or 'SELL'
            order_type: 'LIMIT', 'MARKET', etc.
            quantity: Order quantity
            price: Order price (required for LIMIT orders)
            leverage: Leverage multiple (for futures trading)
            stop_price: Stop price for stop orders
            position_side: 'LONG' or 'SHORT' for futures

        Returns:
            Dict with order details
        """
        params = {
            'symbol': symbol,
            'side': side,
            'type': order_type,
            'quantity': quantity
        }

        if price:
            params['price'] = price
        if stop_price:
            params['stopPrice'] = stop_price
        if position_side:
            params['positionSide'] = position_side

        if leverage:
            # Set leverage first for futures trading
            leverage_params = {
                'symbol': symbol,
                'leverage': leverage
            }
            self._send_request('POST', '/api/v3/margin/leverage', leverage_params)

        return self._send_request('POST', '/api/v3/order', params)

    def get_open_orders(self, symbol: str = None) -> Dict:
        """Get all open orders or orders for a specific symbol"""
        params = {}
        if symbol:
            params['symbol'] = symbol
        return self._send_request('GET', '/api/v3/openOrders', params)

    def cancel_order(self, symbol: str, order_id: int) -> Dict:
        """Cancel an existing order"""
        params = {
            'symbol': symbol,
            'orderId': order_id
        }
        return self._send_request('DELETE', '/api/v3/order', params)

    def get_position_info(self, symbol: str = None) -> Dict:
        """Get current position information"""
        params = {}
        if symbol:
            params['symbol'] = symbol
        return self._send_request('GET', '/api/v3/positionRisk', params)

    def get_leverage_brackets(self, symbol: str) -> Dict:
        """Get leverage brackets for futures trading"""
        params = {'symbol': symbol}
        return self._send_request('GET', '/api/v3/leverageBracket', params)

    def change_margin_type(self, symbol: str, margin_type: str) -> Dict:
        """Change margin type between 'ISOLATED' and 'CROSSED'"""
        params = {
            'symbol': symbol,
            'marginType': margin_type
        }
        return self._send_request('POST', '/api/v3/marginType', params)

    def set_leverage(self, symbol: str, leverage: int) -> Dict:
        """Set leverage for a symbol"""
        params = {
            'symbol': symbol,
            'leverage': leverage
        }
        return self._send_request('POST', '/api/v3/leverage', params)

    def get_mark_price(self, symbol: str) -> Dict:
        """Get current mark price and funding rate for a symbol"""
        params = {'symbol': symbol}
        return self._send_request('GET', '/api/v3/premiumIndex', params)

# Create a trading bot class that uses MEXCTrader
class TradingBot:
    def __init__(self, api_key: str, api_secret: str, testnet: bool = False):
        self.trader = MEXCTrader(api_key, api_secret, testnet)
        self.active_trades = {}
    
    def place_leveraged_trade(self,
                            symbol: str,
                            side: str,
                            quantity: float,
                            leverage: int = 10,
                            stop_loss_percent: float = 5.0,
                            take_profit_percent: float = 10.0) -> Dict:
        """Place a leveraged trade with stop loss and take profit
        
        Args:
            symbol: Trading pair symbol (e.g., 'BTCUSDT')
            side: 'LONG' or 'SHORT'
            quantity: Trade size
            leverage: Leverage multiple
            stop_loss_percent: Stop loss percentage
            take_profit_percent: Take profit percentage
            
        Returns:
            Dict with trade details
        """
        # Get current mark price
        mark_price = float(self.trader.get_mark_price(symbol)['markPrice'])
        
        # Set leverage
        self.trader.set_leverage(symbol, leverage)
        
        # Calculate stop loss and take profit prices
        if side == 'LONG':
            entry_side = 'BUY'
            stop_loss = mark_price * (1 - stop_loss_percent/100)
            take_profit = mark_price * (1 + take_profit_percent/100)
        else:
            entry_side = 'SELL'
            stop_loss = mark_price * (1 + stop_loss_percent/100)
            take_profit = mark_price * (1 - take_profit_percent/100)
        
        # Place main order
        entry_order = self.trader.place_order(
            symbol=symbol,
            side=entry_side,
            order_type='MARKET',
            quantity=quantity,
            position_side=side
        )
        
        # Place stop loss order
        stop_loss_order = self.trader.place_order(
            symbol=symbol,
            side='SELL' if side == 'LONG' else 'BUY',
            order_type='STOP_MARKET',
            quantity=quantity,
            stop_price=stop_loss,
            position_side=side
        )
        
        # Place take profit order
        take_profit_order = self.trader.place_order(
            symbol=symbol,
            side='SELL' if side == 'LONG' else 'BUY', 
            order_type='TAKE_PROFIT_MARKET',
            quantity=quantity,
            stop_price=take_profit,
            position_side=side
        )
        
        trade_details = {
            'symbol': symbol,
            'side': side,
            'leverage': leverage,
            'entry_order': entry_order,
            'stop_loss_order': stop_loss_order,
            'take_profit_order': take_profit_order,
            'entry_price': mark_price,
            'stop_loss': stop_loss,
            'take_profit': take_profit
        }
        
        self.active_trades[symbol] = trade_details
        return trade_details
    
    def close_position(self, symbol: str) -> Dict:
        """Close an open position"""
        if symbol not in self.active_trades:
            raise ValueError(f'No active trade found for {symbol}')
            
        trade = self.active_trades[symbol]
        
        # Cancel stop loss and take profit orders
        self.trader.cancel_order(symbol, trade['stop_loss_order']['orderId'])
        self.trader.cancel_order(symbol, trade['take_profit_order']['orderId'])
        
        # Place market order to close position
        close_order = self.trader.place_order(
            symbol=symbol,
            side='SELL' if trade['side'] == 'LONG' else 'BUY',
            order_type='MARKET',
            quantity=trade['entry_order']['executedQty'],
            position_side=trade['side']
        )
        
        del self.active_trades[symbol]
        return close_order