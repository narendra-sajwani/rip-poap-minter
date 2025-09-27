import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ROOTSTOCK_TESTNET, RIF_TOKEN_ADDRESS, RIF_POAP_CONTRACT_ADDRESS, RIF_TOKEN_ABI, RIF_POAP_ABI } from '../utils/constants';

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setSigner(provider.getSigner());
            
            // Get chain ID - Fixed TypeScript warning
            if (window.ethereum) {
              window.ethereum.request({ method: 'eth_chainId' })
                .then((chainId: string) => setChainId(parseInt(chainId, 16)));
            }
          }
        })
        .catch(console.error);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setSigner(provider.getSigner());
        } else {
          setAccount(null);
          setSigner(null);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16));
        window.location.reload();
      });
    }
  }, []);

  const connect = async (): Promise<void> => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      setAccount(accounts[0]);
      setSigner(provider!.getSigner());
      
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(chainId, 16));
      
    } catch (error) {
      console.error('Connection failed:', error);
    }
    setConnecting(false);
  };

  const switchToRootstock = async (): Promise<void> => {
    if (!window.ethereum) return; // Fixed TypeScript warning
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ROOTSTOCK_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902 && window.ethereum) { // Fixed TypeScript warning
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ROOTSTOCK_TESTNET],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  const disconnect = (): void => {
    setAccount(null);
    setSigner(null);
    setChainId(null);
  };

  const isConnected = !!account;
  const isCorrectNetwork = chainId === 31;

  return {
    account,
    provider,
    signer,
    chainId,
    connecting,
    connect,
    disconnect,
    switchToRootstock,
    isConnected,
    isCorrectNetwork,
  };
};

// Contract hooks
export const useRIFToken = (signer: ethers.Signer | null = null): ethers.Contract | null => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (RIF_TOKEN_ADDRESS) {
      try {
        if (signer) {
          const contract = new ethers.Contract(RIF_TOKEN_ADDRESS, RIF_TOKEN_ABI, signer);
          setContract(contract);
        } else {
          // For read-only operations, use provider
          const provider = new ethers.providers.JsonRpcProvider('https://public-node.testnet.rsk.co');
          const contract = new ethers.Contract(RIF_TOKEN_ADDRESS, RIF_TOKEN_ABI, provider);
          setContract(contract);
        }
      } catch (error) {
        console.error('Error creating RIF token contract:', error);
      }
    } else {
      setContract(null);
    }
  }, [signer]);

  return contract;
};

export const useRIFPOAP = (signer: ethers.Signer | null = null): ethers.Contract | null => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (signer && RIF_POAP_CONTRACT_ADDRESS) {
      try {
        const contract = new ethers.Contract(RIF_POAP_CONTRACT_ADDRESS, RIF_POAP_ABI, signer);
        setContract(contract);
      } catch (error) {
        console.error('Error creating RIF POAP contract:', error);
      }
    } else {
      setContract(null);
    }
  }, [signer]);

  return contract;
};
