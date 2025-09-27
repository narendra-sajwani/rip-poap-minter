export interface Event {
  name: string;
  description: string;
  imageURI: string;
  startDate: number;
  endDate: number;
  active: boolean;
  totalMinted: string;
}

export interface Web3State {
  account: string | null;
  provider: any;
  signer: any;
  chainId: number | null;
  connecting: boolean;
  isConnected: boolean;
  isCorrectNetwork: boolean;
}

export interface ContractWriteState {
  write: (...args: any[]) => Promise<any>;
  loading: boolean;
  error: any;
  txHash: string | null;
  success: boolean;
  reset: () => void;
}
