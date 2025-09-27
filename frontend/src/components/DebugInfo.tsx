import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../hooks/useWeb3';
import { RIF_TOKEN_ADDRESS } from '../utils/constants';

const DebugInfo: React.FC = () => {
  const { account, signer, provider, isConnected, isCorrectNetwork } = useWeb3();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkEverything = async () => {
      if (!account || !provider || !isCorrectNetwork) return;

      try {
        const debug: any = {
          account,
          chainId: await provider.getNetwork().then((n: any) => n.chainId),
          rifTokenAddress: RIF_TOKEN_ADDRESS,
          hasProvider: !!provider,
          hasSigner: !!signer,
        };

        // Check RIF balance directly
        if (signer) {
          const rifContract = new ethers.Contract(
            RIF_TOKEN_ADDRESS,
            ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"],
            signer
          );
          
          try {
            const balance = await rifContract.balanceOf(account);
            const decimals = await rifContract.decimals();
            debug.rifBalance = balance.toString();
            debug.rifBalanceFormatted = ethers.utils.formatUnits(balance, decimals);
            debug.rifDecimals = decimals;
          } catch (error: any) {
            debug.rifError = error.message;
          }
        }

        setDebugInfo(debug);
      } catch (error: any) {
        console.error('Debug error:', error);
        setDebugInfo({ error: error.message });
      }
    };

    checkEverything();
  }, [account, provider, signer, isCorrectNetwork]);

  if (!isConnected) {
    return <div>Not connected</div>;
  }

  return (
    <div style={{ 
      background: '#f3f4f6', 
      padding: '16px', 
      borderRadius: '8px', 
      marginTop: '20px',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1f2937' }}>🔍 Debug Info</h4>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '11px' }}>
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};

export default DebugInfo;
