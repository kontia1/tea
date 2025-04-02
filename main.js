import { ethers } from "ethers";
import fs from "fs";

// RPC provider and contract details
const RPC_URL = "https://tea-sepolia.g.alchemy.com/public";
const CONTRACTS = {
  ROUTERS: {
    UNISWAP: "0xE15efbaA098AA81BaB70c471FeA760684dc776ae"
  },
  UNISWAPTOKENS: {
    LEAF: "0x0281e0e9Df9920E994051fC3798fd1565F6d28BF",
    DAUN: "0xb1885A41876ff1BcB107a80A352A800b3D394f6F",
    WETH: "0x7752dBd604a5C43521408ee80486853dCEb4cceB",
    HRBL: "0x7d7D20Ea5afb64Fc7beC15ba4670FF08B5E838b6"
  }
};

// Read wallet private keys from wallet.txt
const wallets = fs.readFileSync('wallet.txt', 'utf8').trim().split("\n").map(pk => new ethers.Wallet(pk, new ethers.JsonRpcProvider(RPC_URL)));

// Initialize Uniswap Router contract
const router = new ethers.Contract(CONTRACTS.ROUTERS.UNISWAP, [
  "function swapExactETHForTokens(uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) payable external returns (uint256[])"
]);

const amountIn = ethers.parseUnits("0.001", "ether"); // Amount of TEA to swap
const slippageTolerance = 0.5; // 0.5% slippage

function getAmountOutMinWithSlippage(amountOutMin) {
  return BigInt(amountOutMin) * BigInt(1000 + slippageTolerance * 10) / BigInt(1000);
}

// Function to execute swaps for a single wallet
async function executeSwapsForWallet(wallet) {
  while (true) { // Infinite loop to keep swapping
    console.log(`\n🔄 Starting swaps for wallet: ${wallet.address}`);

    const tokens = Object.keys(CONTRACTS.UNISWAPTOKENS).filter(t => t !== "WETH");
    const numSwaps = Math.floor(Math.random() * (110 - 105 + 1)) + 105;

    for (let i = 1; i <= numSwaps; i++) {
      const tokenName = tokens[Math.floor(Math.random() * tokens.length)];
      const tokenAddress = CONTRACTS.UNISWAPTOKENS[tokenName];
      const path = [CONTRACTS.UNISWAPTOKENS.WETH, tokenAddress];
      const deadline = Math.floor(Date.now() / 1000) + 600;
      const amountOutMinWithSlippage = getAmountOutMinWithSlippage("62588048821489");

      console.log(`[${wallet.address}] Swapping TEA for ${tokenName} via Uniswap...`);

      try {
        const tx = await router.connect(wallet).swapExactETHForTokens(
          amountOutMinWithSlippage,
          path,
          wallet.address,
          deadline,
          { value: amountIn, gasLimit: 170000 }
        );
        await tx.wait();
        console.log(`✅ Swap successful for ${tokenName}! Transaction: https://sepolia.tea.xyz/tx/${tx.hash}`);
      } catch (error) {
        console.error(`❌ Swap failed for ${tokenName}: ${error.reason || error.message}`);
      }
    }

    // Random delay for this wallet before restarting swaps
    const delayMinutes = Math.floor(Math.random() * (1450 - 1440 + 1)) + 1440;
    console.log(`⏳ Wallet ${wallet.address} will wait ${delayMinutes} minutes before restarting swaps...\n`);
    await new Promise(resolve => setTimeout(resolve, delayMinutes * 60 * 1000));
  }
}

// Start swapping process for each wallet independently
wallets.forEach(wallet => executeSwapsForWallet(wallet));
