import os
from mexc_trading import TradingBot
from discord_monitor import run_discord_bot

def main():
    # Load environment variables
    mexc_api_key = os.getenv('MEXC_API_KEY')
    mexc_api_secret = os.getenv('MEXC_API_SECRET')
    discord_token = os.getenv('DISCORD_BOT_TOKEN')
    
    if not all([mexc_api_key, mexc_api_secret, discord_token]):
        raise ValueError(
            'Please set MEXC_API_KEY, MEXC_API_SECRET, and DISCORD_BOT_TOKEN environment variables'
        )
    
    # Initialize trading bot
    trading_bot = TradingBot(
        api_key=mexc_api_key,
        api_secret=mexc_api_secret,
        testnet=False  # Set to True for testing
    )
    
    # Run Discord bot
    run_discord_bot(trading_bot, discord_token)

if __name__ == '__main__':
    main()
