import { useState } from 'react';
import { ethers } from 'ethers';
import { parseContractError, isUserRejectedError } from '../utils/errorHandler';

interface ContractWriteState {
  write: (...args: any[]) => Promise<ethers.ContractReceipt | void>; // Fixed return type
  loading: boolean;
  error: string | null;
  txHash: string | null;
  success: boolean;
  reset: () => void;
}

export const useContractWrite = (contract: ethers.Contract | null, functionName: string): ContractWriteState => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const write = async (...args: any[]): Promise<ethers.ContractReceipt | void> => { // Fixed return type
    console.log('🔍 useContractWrite called:', { contract: !!contract, functionName, args });
    
    if (!contract || !functionName) {
      const errorMsg = 'Contract or function not available';
      setError(errorMsg);
      console.error('❌', errorMsg, { contract, functionName });
      return;
    }

    // Check if function exists
    if (!contract[functionName]) {
      const errorMsg = `Function ${functionName} does not exist on contract`;
      setError(errorMsg);
      console.error('❌', errorMsg);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setTxHash(null);

    try {
      console.log('🚀 Calling contract function:', functionName, 'with args:', args);
      
      // Call the contract function
      const tx: ethers.ContractTransaction = await contract[functionName](...args);
      console.log('✅ Transaction sent:', tx.hash);
      setTxHash(tx.hash);

      // Wait for transaction confirmation
      console.log('⏳ Waiting for confirmation...');
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt);
      
      if (receipt.status === 1) {
        setSuccess(true);
        console.log('🎉 Transaction successful!');
      } else {
        setError('Transaction failed');
        console.error('❌ Transaction failed with status 0');
      }

      return receipt; // This is now correctly typed as ContractReceipt
    } catch (err: any) {
      console.error('❌ Contract write error:', err);
      
      if (!isUserRejectedError(err)) {
        const errorMessage = parseContractError(err);
        setError(errorMessage);
        console.error('❌ Parsed error:', errorMessage);
      } else {
        console.log('ℹ️ User rejected transaction');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = (): void => {
    setLoading(false);
    setError(null);
    setTxHash(null);
    setSuccess(false);
  };

  return {
    write,
    loading,
    error,
    txHash,
    success,
    reset,
  };
};
