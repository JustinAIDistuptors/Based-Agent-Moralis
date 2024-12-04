        start_time = int(datetime.strptime(config['startDate'], '%Y-%m-%d').timestamp() * 1000)
        end_time = int(datetime.strptime(config['endDate'], '%Y-%m-%d').timestamp() * 1000)
        
        summary = {
            'total_trades': 0,
            'winning_trades': 0,
            'total_pnl': 0,
            'equity_curve': [],
            'trades': []
        }
        
        for pair in config['pairs']:
            # Get historical data
            df = self.get_historical_data(pair, start_time, end_time)
            if df.empty:
                continue
                
            # Add indicators and analyze signals
            df = self.analyze_signals(df)
            
            # Run simulation
            simulation = self.simulate_trades(
                df=df,
                initial_capital=total_capital / len(config['pairs']),
                risk_per_trade=0.02
            )
            
            # Update summary
            summary['total_trades'] += len(simulation['trades'])
            summary['winning_trades'] += len([t for t in simulation['trades'] if t['pnl'] > 0])
            summary['total_pnl'] += simulation['total_return']
            
            # Add pair info to trades
            for trade in simulation['trades']:
                trade['pair'] = pair
                summary['trades'].append(trade)
            
            # Merge equity curves
            if not summary['equity_curve']:
                summary['equity_curve'] = simulation['equity_curve']
            else:
                # Combine equity curves by timestamp
                pass
        
        # Calculate final metrics
        summary['win_rate'] = (summary['winning_trades'] / summary['total_trades'] * 100) if summary['total_trades'] > 0 else 0
        summary['average_pnl'] = summary['total_pnl'] / summary['total_trades'] if summary['total_trades'] > 0 else 0
        
        return summary

def backtest_strategy(config: Dict[str, Any]) -> Dict[str, Any]:
    """Main backtesting function to be called from API"""
    try:
        tester = Backtester(
            api_key=os.getenv('MEXC_API_KEY'),
            api_secret=os.getenv('MEXC_API_SECRET')
        )
        
        results = tester.run_backtest(config)
        
        return {
            'status': 'success',
            'results': {
                'totalTrades': results['total_trades'],
                'winRate': round(results['win_rate'], 2),
                'totalPnL': round(results['total_pnl'], 2),
                'averagePnL': round(results['average_pnl'], 2),
                'trades': results['trades'],
                'equityCurve': results['equity_curve']
            }
        }
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e)
        }
