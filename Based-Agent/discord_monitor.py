import discord
from discord.ext import commands
import os
from typing import Callable, Dict, Any
from mexc_trading import TradingBot
import re
import json
import asyncio

class SignalMonitor(commands.Bot):
    def __init__(self, command_prefix: str, trading_bot: TradingBot, intents: discord.Intents):
        super().__init__(command_prefix=command_prefix, intents=intents)
        self.trading_bot = trading_bot
        self.signal_patterns = {
            'long': r'(?i)LONG[:\s]*(\w+).*Entry[:\s]*(\d+\.?\d*).*Leverage[:\s]*(\d+)x?',
            'short': r'(?i)SHORT[:\s]*(\w+).*Entry[:\s]*(\d+\.?\d*).*Leverage[:\s]*(\d+)x?'
        }
        self.monitored_channels = []
        self.load_config()

    def load_config(self):
        """Load configuration from config.json"""
        try:
            with open('config.json', 'r') as f:
                config = json.load(f)
                self.monitored_channels = config.get('monitored_channels', [])
        except FileNotFoundError:
            print("Config file not found. Using default settings.")

    async def process_signal(self, message: discord.Message):
        """Process a trading signal from Discord"""
        content = message.content

        # Check for long signals
        long_match = re.search(self.signal_patterns['long'], content)
        if long_match:
            symbol, entry, leverage = long_match.groups()
            try:
                trade = self.trading_bot.place_leveraged_trade(
                    symbol=f"{symbol}USDT",
                    side="LONG",
                    quantity=1.0,  # Adjust based on your risk management
                    leverage=int(leverage),
                    stop_loss_percent=2.0,  # Customize
                    take_profit_percent=6.0  # Customize
                )
                await message.channel.send(f"✅ Executed LONG trade:\n{json.dumps(trade, indent=2)}")
            except Exception as e:
                await message.channel.send(f"❌ Error executing trade: {str(e)}")
            return

        # Check for short signals
        short_match = re.search(self.signal_patterns['short'], content)
        if short_match:
            symbol, entry, leverage = short_match.groups()
            try:
                trade = self.trading_bot.place_leveraged_trade(
                    symbol=f"{symbol}USDT",
                    side="SHORT",
                    quantity=1.0,  # Adjust based on your risk management
                    leverage=int(leverage),
                    stop_loss_percent=2.0,  # Customize
                    take_profit_percent=6.0  # Customize
                )
                await message.channel.send(f"✅ Executed SHORT trade:\n{json.dumps(trade, indent=2)}")
            except Exception as e:
                await message.channel.send(f"❌ Error executing trade: {str(e)}")

    @commands.command()
    async def add_channel(self, ctx, channel_id: int):
        """Add a channel to monitor for signals"""
        if channel_id not in self.monitored_channels:
            self.monitored_channels.append(channel_id)
            await ctx.send(f"Now monitoring channel {channel_id}")
            self.save_config()
        else:
            await ctx.send("Channel already being monitored")

    @commands.command()
    async def remove_channel(self, ctx, channel_id: int):
        """Remove a channel from monitoring"""
        if channel_id in self.monitored_channels:
            self.monitored_channels.remove(channel_id)
            await ctx.send(f"Stopped monitoring channel {channel_id}")
            self.save_config()
        else:
            await ctx.send("Channel not being monitored")

    @commands.command()
    async def list_channels(self, ctx):
        """List all monitored channels"""
        if self.monitored_channels:
            channels = "\n".join([str(c) for c in self.monitored_channels])
            await ctx.send(f"Monitored channels:\n{channels}")
        else:
            await ctx.send("No channels are being monitored")

    @commands.command()
    async def status(self, ctx):
        """Check bot status and active trades"""
        active_trades = self.trading_bot.active_trades
        if active_trades:
            trades = json.dumps(active_trades, indent=2)
            await ctx.send(f"Active trades:\n{trades}")
        else:
            await ctx.send("No active trades")

    def save_config(self):
        """Save configuration to config.json"""
        config = {
            'monitored_channels': self.monitored_channels
        }
        with open('config.json', 'w') as f:
            json.dump(config, f, indent=2)

    async def on_ready(self):
        """Called when the bot is ready"""
        print(f'Logged in as {self.user} (ID: {self.user.id})')
        print('------')

    async def on_message(self, message: discord.Message):
        """Called when a message is received"""
        # Ignore messages from the bot itself
        if message.author == self.user:
            return

        # Process commands
        await self.process_commands(message)

        # Check if message is in a monitored channel
        if message.channel.id in self.monitored_channels:
            await self.process_signal(message)

def run_discord_bot(trading_bot: TradingBot, token: str):
    """Run the Discord bot"""
    intents = discord.Intents.default()
    intents.message_content = True
    bot = SignalMonitor('!', trading_bot, intents=intents)
    bot.run(token)
