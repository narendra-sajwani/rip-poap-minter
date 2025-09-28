# 🏆 Root POAP

**Decentralized Event Proof-of-Attendance Protocol on Rootstock**

[![Rootstock](https://img.shields.io/badge/Blockchain-Rootstock-orange)](https://rootstock.io/)
[![RIF Token](https://img.shields.io/badge/Payment-RIF%20Token-blue)](https://www.rifos.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Root POAP revolutionizes event attendance verification by combining **Proof of Attendance Protocol (POAP) NFTs** with the **RIF token economy** on **Rootstock's Bitcoin-secured blockchain**.

## 🌟 Features

- 🎫 **Mint POAP NFTs** with RIF token payments
- 🔗 **Bitcoin-secured** through Rootstock blockchain
- 📱 **Responsive Web3 interface** with MetaMask integration
- 🖼️ **NFT Collection Management** with real-time updates
- 🔒 **Secure smart contracts** using OpenZeppelin standards
- ⚡ **Gas optimized** with custom error handling
- 🌐 **On-chain metadata** with Base64 encoding

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- **MetaMask** browser extension
- **Git**

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/root-poap.git
    cd root-poap
    ```

2. **Install dependencies**

    ```bash
    # Install root dependencies (for smart contracts)
    npm install

    # Install frontend dependencies
    cd frontend
    npm install
    ```

3. **Configure environment variables**

    Create `frontend/.env` file:

    ```bash
    REACT_APP_RIF_TOKEN_ADDRESS=0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE
    REACT_APP_RIF_POAP_CONTRACT_ADDRESS=0xE9C389bB749c706F2b61d5Ad4c7eb75dB9dD004d
    REACT_APP_CHAIN_ID=31
    ```

4. **Run the application**

    ```bash
    # Make sure you're in the frontend directory
    cd frontend
    npm start
    ```

5. **Open your browser**

    Navigate to `http://localhost:3000`

## 🔧 Setup Requirements

### MetaMask Configuration

1. **Install MetaMask** browser extension
2. **Add Rootstock Testnet** (the app will prompt you automatically)
3. **Get test RIF tokens** from [Rootstock Faucet](https://faucet.rootstock.io/)

### Network Details

- **Network Name**: Rootstock Testnet
- **RPC URL**: https://public-node.testnet.rsk.co
- **Chain ID**: 31
- **Currency Symbol**: RBTC
- **Block Explorer**: https://explorer.testnet.rsk.co

## 📁 Project Structure

```
root-poap/
├── contracts/              # Smart contracts
│   ├── RIFPoap.sol         # Main POAP contract
│   └── interfaces/         # Contract interfaces
├── scripts/                # Deployment scripts
│   └── deploy.js          # Contract deployment
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   ├── public/            # Static assets
│   └── .env               # Environment variables
├── test/                  # Smart contract tests
├── hardhat.config.js      # Hardhat configuration
└── package.json          # Project dependencies
```

## 🏗️ Technology Stack

### Smart Contracts

- **Solidity 0.8.28** - Smart contract language
- **Hardhat** - Development framework
- **OpenZeppelin** - Security-audited contract library
- **Rootstock Testnet** - Bitcoin-secured blockchain

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Ethers.js 5.7** - Ethereum library
- **Custom Hooks** - Web3 state management

### Integration

- **MetaMask** - Wallet connection
- **RIF Token** - Payment system
- **POAP Standard** - NFT proof of attendance

## 🔨 Development

### Smart Contract Development

1. **Compile contracts**

    ```bash
    npm run compile
    ```

2. **Run tests**

    ```bash
    npm test
    ```

3. **Deploy to testnet**

    ```bash
    npm run deploy
    ```

4. **Verify contract** (optional)
    ```bash
    npx hardhat verify --network rootstock_testnet DEPLOYED_CONTRACT_ADDRESS
    ```

### Frontend Development

1. **Start development server**

    ```bash
    cd frontend
    npm start
    ```

2. **Build for production**

    ```bash
    npm run build
    ```

3. **Type checking**
    ```bash
    npm run type-check
    ```

## 🎮 How to Use

1. **Connect Wallet**
    - Click "Connect MetaMask"
    - Switch to Rootstock Testnet when prompted

2. **Get RIF Tokens**
    - Visit [Rootstock Faucet](https://faucet.rootstock.io/)
    - Request tRIF tokens for minting

3. **Mint POAP**
    - Click "Approve" to allow RIF token spending
    - Click "Mint POAP" to create your attendance proof
    - Wait for blockchain confirmation

4. **View Collection**
    - See your minted POAPs in the collection section
    - Share your achievements on social media

## 📊 Smart Contract Details

### Main Contract: `RIFPoap.sol`

**Key Functions:**

- `mintPOAP(uint256 eventId)` - Mint a new POAP
- `events(uint256 eventId)` - Get event details
- `hasAttended(address user, uint256 eventId)` - Check attendance
- `getUserPOAPsForEvent(address user, uint256 eventId)` - Get user's POAPs

**Contract Address (Testnet):**

```
RIF Token: 0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE
POAP Contract: [Your deployed contract address]
```

## 🚨 Important Notes

### Environment Variables

- Environment variables must be in `frontend/.env`, not project root
- All React env vars must start with `REACT_APP_`
- Restart the development server after changing `.env`

### RIF Token Requirements

- **Minimum 10 RIF tokens** required for minting
- Get test tokens from Rootstock faucet
- Ensure you're on Rootstock Testnet (Chain ID: 31)

### MetaMask Integration

- The app automatically detects and prompts network switching
- Manual network addition is handled by the application
- Ensure MetaMask is unlocked and connected

## 🐛 Troubleshooting

### Common Issues

**"Contract not loaded" error:**

- Check that `REACT_APP_RIF_POAP_CONTRACT_ADDRESS` is set in `frontend/.env`
- Ensure you're connected to Rootstock Testnet
- Verify the contract address is correct

**RIF balance shows 0:**

- Confirm you're on Rootstock Testnet (Chain ID 31)
- Get test RIF tokens from the faucet
- Check if MetaMask is connected to the correct account

**Approval/Minting fails:**

- Ensure you have enough RBTC for gas fees
- Check RIF token balance is sufficient (10+ RIF)
- Verify network connection is stable

**TypeScript errors:**

- Run `npm install` in both root and frontend directories
- Check that all imports have correct file extensions
- Ensure environment variables are properly typed

## 🚀 Deployment

### Smart Contract Deployment

1. Configure your private key in root `.env`
2. Run deployment script: `npm run deploy`
3. Update frontend `.env` with contract address
4. Restart frontend application

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy the build/ directory to your hosting service
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Rootstock** for providing Bitcoin-secured smart contract platform
- **RIF** for the token economy integration
- **OpenZeppelin** for security-audited smart contract library
- **ETHGlobal** for hosting the hackathon
- **React** and **TypeScript** communities for excellent tooling

- **RIF**: [https://www.rifos.org/](https://www.rifos.org/)
- **Rootstock Faucet**: [https://faucet.rootstock.io/](https://faucet.rootstock.io/)
- **Block Explorer**: [https://explorer.testnet.rsk.co/](https://explorer.testnet.rsk.co/)

---

**Built with ❤️ for ETHGlobal New Delhi 2025**

_Empowering decentralized event experiences on Bitcoin's secure foundation._
