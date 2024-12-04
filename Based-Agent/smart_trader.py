from typing import Optional, Dict, Any
from mexc_trading import MEXCTrader
from solana_integration import SolanaTrader, DexSwapper
import asyncio

class SmartTrader:
    def __init__(self,
                 mexc_api_key: Optional[str] = None,
                 mexc_api_secret: Optional[str] = None,
                 solana_private_key: Optional[str] = None):
        
        # Initialize traders
        self.mexc = MEXCTrader(mexc_api_key, mexc_api_secret) if mexc_api_key else None
        self.solana = SolanaTrader(solana_private_key) if solana_private_key else None
        self.dex = DexSwapper()
        
        # Track active positions
        self.active_trades = {}
        
    async def execute_trade(self,
                         token: str,
                         side: str,
                         leverage: int = None,
                         quantity: float = 1.0,
                         stop_loss_percent: float = 2.0,
                         take_profit_percent: float = 6.0) -> Dict:
        """Execute trade on either MEXC or DEX based on token availability"""
        
        try:
            # First try MEXC if leverage is required
            if leverage and self.mexc:
                try:
                    symbol = f"{token}USDT"
                    trade = self.mexc.place_leveraged_trade(
                        symbol=symbol,
                        side=side,
                        quantity=quantity,
                        leverage=leverage,
                        stop_loss_percent=stop_loss_percent,
                        take_profit_percent=take_profit_percent
                    )
                    self.active_trades[symbol] = {
                        'platform': 'MEXC',
                        'details': trade
                    }
                    return {
                        'status': 'success',
                        'platform': 'MEXC',
                        'trade': trade
                    }
                except Exception as e:
                    print(f"MEXC trade failed: {str(e)}")
            
            # If MEXC fails or no leverage required, try DEX
            if self.solana:
                # Get best swap route
                route = await self.dex.get_best_route(
                    input_token='USDC',
                    output_token=token,
                    amount=quantity
                )
                
                if route:
                    # Execute swap
                    swap = await self.dex.execute_swap(route)
                    self.active_trades[token] = {
                        'platform': 'Solana DEX',
                        'details': swap
                    }
                    return {
                        'status': 'success',
                        'platform': 'Solana DEX',
                        'trade': swap
                    }
            
            raise Exception("No trading platform available or token not found")
            
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e)
            }
    
    async def close_position(self, token: str) -> Dict:
        """Close position on either platform"""
        
        if token not in self.active_trades:
            return {
                'status': 'error',
                'error': 'No active trade found'
            }
        
        trade = self.active_trades[token]
        try:
            if trade['platform'] == 'MEXC':
                result = self.mexc.close_position(token)
            else:
                # Close DEX position
                route = await self.dex.get_best_route(
                    input_token=token,
                    output_token='USDC',
                    amount=trade['details']['amount']
                )
                result = await self.dex.execute_swap(route)
            
            del self.active_trades[token]
            return {
                'status': 'success',
                'platform': trade['platform'],
                'result': result
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e)
            }
    
    async def get_balances(self) -> Dict:
        """Get balances across all platforms"""
        balances = {}
        
        if self.mexc:
            try:
                mexc_balance = self.mexc.get_account_info()
                balances['MEXC'] = mexc_balance
            except Exception as e:
                balances['MEXC'] = f"Error: {str(e)}"
        
        if self.solana:
            try:
                sol_balance = await self.solana.get_sol_balance()
                usdc_balance = await self.solana.get_token_balance('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')  # USDC
                balances['Solana'] = {
                    'SOL': sol_balance,
                    'USDC': usdc_balance
                }
            except Exception as e:
                balances['Solana'] = f"Error: {str(e)}"
        
        return balances