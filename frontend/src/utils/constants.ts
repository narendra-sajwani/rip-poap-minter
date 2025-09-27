// Contract addresses
export const RIF_TOKEN_ADDRESS: string = "0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE";
export const RIF_POAP_CONTRACT_ADDRESS: string = process.env.REACT_APP_RIF_POAP_CONTRACT_ADDRESS || "";

// Network configuration
export const ROOTSTOCK_TESTNET = {
  chainId: '0x1f' as const, // 31 in hex
  chainName: 'Rootstock Testnet' as const,
  nativeCurrency: {
    name: 'Rootstock BTC' as const,
    symbol: 'RBTC' as const,
    decimals: 18 as const,
  },
  rpcUrls: ['https://public-node.testnet.rsk.co'] as readonly string[],
  blockExplorerUrls: ['https://explorer.testnet.rsk.co'] as readonly string[],
};

// Updated ABIs to match your deployed contract
export const RIF_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
] as const;

export const RIF_POAP_ABI = [
  // Main functions
  "function mintPOAP(uint256 _eventId) external",
  "function events(uint256) view returns (tuple(string name, string description, string imageURI, uint256 startDate, uint256 endDate, bool active, uint256 totalMinted))",
  "function hasAttended(address, uint256) view returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function getUserPOAPsForEvent(address _user, uint256 _eventId) view returns (uint256[])",
  "function tokenURI(uint256 _tokenId) view returns (string)",
  "function getCounters() view returns (uint256 eventCount, uint256 tokenCount)",
  
  // Events
  "event POAPMinted(address indexed recipient, uint256 indexed tokenId, uint256 indexed eventId)",
] as const;

// Constants
export const MINT_PRICE: string = "10";
export const MINT_PRICE_WEI: string = "10000000000000000000"; // 10 * 10^18
export const DEFAULT_EVENT_ID: number = 1;

// Custom error messages
export const CONTRACT_ERRORS = {
  InvalidEventId: "Invalid event ID selected",
  EventNotActive: "This event is not currently active", 
  AlreadyMinted: "You have already minted a POAP for this event",
  TokenTransferFailed: "RIF token transfer failed. Check your balance and approval.",
  NoTokensToWithdraw: "No tokens to withdraw",
  TokenDoesNotExist: "This token does not exist",
} as const;

export const ETHGLOBAL_EVENT = {
  name: "ETHGlobal New Delhi 2025",
  description: "Proof of attendance for ETHGlobal New Delhi hackathon",
  location: "New Delhi, India", 
  dates: "September 26-28, 2025",
} as const;
