import React from 'react';
import { useWeb3, useRIFToken, useRIFPOAP } from '../hooks/useWeb3';
import { RIF_TOKEN_ADDRESS, RIF_POAP_CONTRACT_ADDRESS } from '../utils/constants';

const ContractDebug: React.FC = () => {
  const { signer, isConnected, isCorrectNetwork } = useWeb3();
  const rifTokenContract = useRIFToken(signer);
  const rifPoapContract = useRIFPOAP(signer);

  return (
    <div style={{ 
      background: '#f3f4f6', 
      padding: '16px', 
      borderRadius: '8px', 
      margin: '20px 0',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1f2937' }}>🔧 Contract Debug</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div>
          <p><strong>Connection Status:</strong></p>
          <p>Connected: {isConnected ? '✅' : '❌'}</p>
          <p>Correct Network: {isCorrectNetwork ? '✅' : '❌'}</p>
          <p>Has Signer: {signer ? '✅' : '❌'}</p>
        </div>
        <div>
          <p><strong>Contract Addresses:</strong></p>
          <p>RIF Token: {RIF_TOKEN_ADDRESS}</p>
          <p>POAP Contract: {RIF_POAP_CONTRACT_ADDRESS || '❌ MISSING'}</p>
        </div>
        <div>
          <p><strong>Contract Objects:</strong></p>
          <p>RIF Contract: {rifTokenContract ? '✅' : '❌'}</p>
          <p>POAP Contract: {rifPoapContract ? '✅' : '❌'}</p>
        </div>
        <div>
          <p><strong>Environment Variables:</strong></p>
          <p>RIF Token ENV: {process.env.REACT_APP_RIF_TOKEN_ADDRESS ? '✅' : '❌'}</p>
          <p>POAP Contract ENV: {process.env.REACT_APP_RIF_POAP_CONTRACT_ADDRESS ? '✅' : '❌'}</p>
        </div>
      </div>
      {rifPoapContract && (
        <div style={{ marginTop: '12px' }}>
          <p><strong>POAP Contract Address:</strong> {rifPoapContract.address}</p>
        </div>
      )}
    </div>
  );
};

export default ContractDebug;
