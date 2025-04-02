🫖 TEA Swap Bot

Automated script to swap TEA for tokens (LEAF, DAUN, HRBL) on Uniswap (Tea-Sepolia) at random intervals.

✨ Features

✅ Randomized swaps (105–110 per cycle)

✅ Random token selection (LEAF, DAUN, HRBL)

✅ Automated execution (Runs continuously)

✅ Repeats every 1440–1450 minutes


🛠 Setup
```
git clone https://github.com/kontia1/tea.git && cd tea
```

1️⃣ Install Dependencies
```
npm install
```

2️⃣ Configure Wallet
Create a wallet.txt file and add your private key (one per line).
```
nano wallet.txt
```


3️⃣ Run the Bot
```
node main.js
```

🔄 How It Works

Reads wallets from wallet.txt

Performs randomized swaps for each wallet

Waits 1440–1450 minutes before repeating
