from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from spl.token.instructions import get_associated_token_address
from spl.token.client import Token
import json

class SolanaTrader:
    def __init__(self, private_key: str = None, network: str = 'mainnet-beta'):
        self.network = 'https://api.mainnet-beta.solana.com' if network == 'mainnet-beta' else 'https://api.devnet.solana.com'
        self.client = AsyncClient(self.network)
        self.keypair = Keypair.from_bytes(bytes.fromhex(private_key)) if private_key else Keypair()

    async def get_token_balance(self, token_address: str) -> float:
        """Get balance of a specific SPL token"""
        try:
            token = await Token.get_token(self.client, Pubkey.from_string(token_address))
            ata = get_associated_token_address(self.keypair.pubkey(), token.pubkey)
            balance = await token.get_balance(ata)
            return balance.ui_amount
        except Exception as e:
            print(f"Error getting token balance: {str(e)}")
            return 0.0

    async def get_sol_balance(self) -> float:
        """Get SOL balance"""
        try:
            response = await self.client.get_balance(self.keypair.pubkey())
            return response.value / 1e9  # Convert lamports to SOL
        except Exception as e:
            print(f"Error getting SOL balance: {str(e)}")
            return 0.0

    async def swap_tokens(self, from_token: str, to_token: str, amount: float):
        """Swap tokens using Jupiter aggregator"""
        try:
            # Here we'd integrate with Jupiter for best swap routes
            # For now this is a placeholder
            pass
        except Exception as e:
            print(f"Error swapping tokens: {str(e)}")
            return None

class DexSwapper:
    def __init__(self):
        # Initialize connections to various DEXes
        self.jupiter_url = "https://quote-api.jup.ag/v6"
        self.raydium_url = "https://api.raydium.io/v2"
        
    async def get_best_route(self, input_token: str, output_token: str, amount: float):
        """Find best swap route across DEXes"""
        # Query Jupiter aggregator for best route
        pass

    async def execute_swap(self, route: dict):
        """Execute swap using the best route"""
        pass

    async def get_token_price(self, token_address: str) -> float:
        """Get token price in USDC"""
        pass