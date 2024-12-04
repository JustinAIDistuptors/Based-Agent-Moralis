from typing import Dict, Optional
from decimal import Decimal

class RiskManager:
    def __init__(self, config: Dict):
        self.max_position_size = Decimal(str(config.get('maxPositionSize', 1000)))
        self.max_leverage = int(config.get('maxLeverage', 10))
        self.default_stop_loss = Decimal(str(config.get('defaultStopLoss', 2.0)))
        self.default_take_profit = Decimal(str(config.get('defaultTakeProfit', 6.0)))
        self.max_daily_drawdown = Decimal(str(config.get('maxDailyDrawdown', 5.0)))
        self.max_total_risk = Decimal(str(config.get('maxTotalRisk', 20.0)))
        
        self.daily_pnl = Decimal('0')
        self.open_positions = {}

    def calculate_position_size(self,
                              account_balance: Decimal,
                              entry_price: Decimal,
                              stop_loss: Optional[Decimal] = None) -> Dict:
        """Calculate safe position size based on risk parameters"""
        if stop_loss is None:
            stop_loss = entry_price * (1 - self.default_stop_loss / 100)

        risk_amount = account_balance * Decimal('0.02')  # 2% risk per trade
        risk_per_unit = abs(entry_price - stop_loss)
        
        # Calculate base position size
        position_size = risk_amount / risk_per_unit
        
        # Apply maximum position size limit
        position_size = min(position_size, self.max_position_size)
        
        return {
            'size': position_size,
            'risk_amount': risk_amount,
            'stop_loss': stop_loss,
            'take_profit': entry_price * (1 + self.default_take_profit / 100)
        }

    def can_open_position(self,
                         symbol: str,
                         side: str,
                         size: Decimal,
                         leverage: int) -> Dict:
        """Check if new position meets risk criteria"""
        # Check leverage limit
        if leverage > self.max_leverage:
            return {
                'allowed': False,
                'reason': f'Leverage {leverage}x exceeds maximum {self.max_leverage}x'
            }

        # Check daily drawdown
        if self.daily_pnl <= -self.max_daily_drawdown:
            return {
                'allowed': False,
                'reason': f'Daily drawdown limit reached: {self.daily_pnl}%'
            }

        # Calculate total risk
        total_risk = sum(pos['risk_amount'] for pos in self.open_positions.values())
        if total_risk >= self.max_total_risk:
            return {
                'allowed': False,
                'reason': f'Maximum total risk reached: {total_risk}%'
            }

        return {'allowed': True}

    def update_position(self,
                       symbol: str,
                       pnl: Decimal,
                       is_closed: bool = False) -> None:
        """Update position and risk metrics"""
        self.daily_pnl += pnl
        
        if is_closed:
            if symbol in self.open_positions:
                del self.open_positions[symbol]

    def reset_daily_metrics(self) -> None:
        """Reset daily risk metrics"""
        self.daily_pnl = Decimal('0')

    def get_adjusted_stops(self,
                          symbol: str,
                          current_price: Decimal,
                          position: Dict) -> Dict:
        """Calculate adjusted stop loss and take profit levels"""
        if symbol not in self.open_positions:
            return {}

        entry_price = Decimal(str(position['entry_price']))
        pnl_percent = (current_price - entry_price) / entry_price * 100

        # Move stop loss to breakeven if in profit
        if pnl_percent >= 2:
            return {
                'stop_loss': entry_price,
                'take_profit': position['take_profit']
            }

        return {
            'stop_loss': position['stop_loss'],
            'take_profit': position['take_profit']
        }
