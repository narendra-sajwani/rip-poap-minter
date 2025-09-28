import { useRefresh } from '../context/RefreshContext';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3, useRIFToken, useRIFPOAP } from '../hooks/useWeb3';
import { useContractWrite } from '../hooks/useContract';
import { DEFAULT_EVENT_ID, MINT_PRICE, RIF_TOKEN_ADDRESS, RIF_TOKEN_ABI, RIF_POAP_ABI } from '../utils/constants';
import { parseContractError } from '../utils/errorHandler';

const MintPOAP: React.FC = () => {
  const { account, signer, isConnected, isCorrectNetwork } = useWeb3();
  const rifTokenContract = useRIFToken(signer);
  const rifPoapContract = useRIFPOAP(signer);
  
  const [rifBalance, setRifBalance] = useState<string>('0');
  const [rifAllowance, setRifAllowance] = useState<string>('0');
  const [hasAttended, setHasAttended] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>('approve');
  const [loading, setLoading] = useState<boolean>(false);

  const approveWrite = useContractWrite(rifTokenContract, 'approve');
  const mintWrite = useContractWrite(rifPoapContract, 'mintPOAP');
  const { triggerRefresh } = useRefresh();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!account || !isCorrectNetwork) return;
      
      setLoading(true);
      try {
        // Create contracts directly if hooks fail
        let rifContract = rifTokenContract;
        let poapContract = rifPoapContract;
        
        if (!rifContract && account) {
          // Fallback: create contract directly
          const provider = new ethers.providers.JsonRpcProvider('https://public-node.testnet.rsk.co');
          rifContract = new ethers.Contract(RIF_TOKEN_ADDRESS, RIF_TOKEN_ABI, provider);
        }
        
        if (rifContract) {
          // Get RIF balance
          const balance = await rifContract.balanceOf(account);
          setRifBalance(balance.toString());
          console.log('RIF Balance:', balance.toString(), 'Formatted:', ethers.utils.formatEther(balance));

          // Get RIF allowance if POAP contract exists
          if (poapContract) {
            const allowance = await rifContract.allowance(account, poapContract.address);
            setRifAllowance(allowance.toString());
            console.log('RIF Allowance:', allowance.toString());
          }
        }

        // Check if already minted
        if (poapContract) {
          const attended = await poapContract.hasAttended(account, DEFAULT_EVENT_ID);
          setHasAttended(attended);
        }

        // Set current step based on allowance
        const hasEnoughAllowance = ethers.BigNumber.from(rifAllowance || '0').gte(ethers.utils.parseEther(MINT_PRICE));
        setCurrentStep(hasEnoughAllowance ? 'mint' : 'approve');
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [rifTokenContract, rifPoapContract, account, isCorrectNetwork]);

  const formatTokenAmount = (amount: string): string => {
    try {
      return parseFloat(ethers.utils.formatEther(amount)).toFixed(2);
    } catch {
      return '0.00';
    }
  };

  const hasEnoughRIF = ethers.BigNumber.from(rifBalance || '0').gte(ethers.utils.parseEther(MINT_PRICE));
  const hasEnoughAllowance = ethers.BigNumber.from(rifAllowance || '0').gte(ethers.utils.parseEther(MINT_PRICE));

  const handleApprove = async () => {
  console.log('🔍 Approve button clicked!');
  console.log('rifTokenContract:', rifTokenContract);
  console.log('rifPoapContract:', rifPoapContract);
  console.log('rifPoapContract.address:', rifPoapContract?.address);
  
  if (!rifTokenContract || !rifPoapContract) {
    console.error('❌ Missing contracts:', { rifTokenContract, rifPoapContract });
    alert('Contract not loaded. Please refresh and try again.');
    return;
  }

  try {
    console.log('🚀 Starting approval...');
    console.log('Approving:', rifPoapContract.address);
    console.log('Amount:', ethers.utils.parseEther(MINT_PRICE).toString());
    
    const result = await approveWrite.write(rifPoapContract.address, ethers.utils.parseEther(MINT_PRICE));
    console.log('✅ Approval result:', result);
    
    // Refresh allowance after successful approval
    setTimeout(async () => {
      try {
        const newAllowance = await rifTokenContract.allowance(account, rifPoapContract.address);
        setRifAllowance(newAllowance.toString());
        setCurrentStep('mint');
      } catch (error) {
        console.error('Error refreshing allowance:', error);
      }
    }, 2000);
  } catch (error: any) { // Fix TypeScript error
    console.error('❌ Approval failed:', error);
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    alert(`Approval failed: ${errorMessage}`);
  }
};

  const handleMint = async () => {
    if (!rifPoapContract) return;

    try {
      console.log('🚀 Starting mint...');
      await mintWrite.write(DEFAULT_EVENT_ID);
      
      // Trigger refresh after successful mint
      setTimeout(() => {
        setHasAttended(true);
        triggerRefresh(); // Add this line
        console.log('🔄 Refreshing all components after mint');
      }, 3000); // Increased timeout for blockchain confirmation
    } catch (error: any) {
      console.error('Minting failed:', error);
    }
  };

  if (!isConnected) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <p style={{ color: '#6b7280' }}>🔗 Please connect your wallet to continue</p>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <p style={{ color: '#6b7280' }}>⚠️ Please switch to Rootstock Testnet</p>
      </div>
    );
  }

  if (hasAttended) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#166534', padding: '16px', borderRadius: '8px' }}>
          <span style={{ fontSize: '32px', marginRight: '12px' }}>🎉</span>
          <div>
            <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '8px 0' }}>POAP Already Minted!</p>
            <p style={{ fontSize: '14px', margin: '0' }}>You have successfully minted your POAP.</p>
          </div>
        </div>
      </div>
    );
  }

  if (mintWrite.success) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#166534', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
          <span style={{ fontSize: '48px', marginRight: '12px' }}>🏆</span>
          <div>
            <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '8px 0' }}>POAP Minted Successfully!</p>
            <p style={{ fontSize: '14px', margin: '0' }}>Your ETHGlobal New Delhi 2025 POAP has been minted.</p>
          </div>
          {mintWrite.txHash && (
            <a
              href={`https://explorer.testnet.rsk.co/tx/${mintWrite.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#166534', textDecoration: 'underline', fontSize: '12px', display: 'block', marginTop: '8px' }}
            >
              View transaction on explorer →
            </a>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          border: '4px solid #f3f4f6', 
          borderTop: '4px solid #3b82f6', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite', 
          margin: '0 auto 16px' 
        }}></div>
        <p style={{ color: '#6b7280' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* RIF Balance Display */}
      <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <h4 style={{ fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>💰 Your RIF Balance</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#6b7280' }}>Available:</span>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#ea580c' }}>{formatTokenAmount(rifBalance)} RIF</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <span style={{ color: '#6b7280' }}>Required:</span>
          <span style={{ fontWeight: 'bold', color: '#ea580c' }}>{MINT_PRICE} RIF</span>
        </div>
        {!hasEnoughRIF && (
          <div style={{ marginTop: '12px', padding: '8px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '4px', color: '#991b1b', fontSize: '14px' }}>
            ⚠️ Insufficient RIF tokens. You need at least {MINT_PRICE} RIF to mint.
          </div>
        )}
      </div>

      {/* Minting Steps */}
      <div style={{ marginBottom: '16px' }}>
        {/* Step 1: Approve */}
        <div style={{ 
          padding: '16px', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          background: hasEnoughAllowance ? '#f0fdf4' : (currentStep === 'approve' ? '#eff6ff' : '#f9fafb'),
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>
                {hasEnoughAllowance ? '✅' : '1️⃣'}
              </span>
              <div>
                <p style={{ fontWeight: '600', margin: 0, fontSize: '14px', color: '#ea580c' }}>Approve RIF Tokens</p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0' }}>Allow contract to spend RIF</p>
              </div>
            </div>
            {!hasEnoughAllowance && (
              <button
                onClick={handleApprove}
                disabled={!hasEnoughRIF || approveWrite.loading}
                style={{ 
                  background: (hasEnoughRIF && !approveWrite.loading) ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: (hasEnoughRIF && !approveWrite.loading) ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {approveWrite.loading ? '⏳ Approving...' : 'Approve'}
              </button>
            )}
          </div>
          {approveWrite.error && (
            <p style={{ color: '#dc2626', fontSize: '12px', margin: '8px 0 0 0' }}>
              ❌ {parseContractError(approveWrite.error)}
            </p>
          )}
        </div>

        {/* Step 2: Mint */}
        <div style={{ 
          padding: '16px', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px',
          background: currentStep === 'mint' ? '#f0fdf4' : '#f9fafb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>2️⃣</span>
              <div>
                <p style={{ fontWeight: '600', margin: 0, fontSize: '14px', color: '#ea580c' }}>Mint POAP</p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0' }}>Mint your POAP NFT</p>
              </div>
            </div>
            <button
              onClick={handleMint}
              disabled={!hasEnoughAllowance || !hasEnoughRIF || mintWrite.loading}
              style={{
                background: (hasEnoughAllowance && hasEnoughRIF && !mintWrite.loading) ? '#16a34a' : '#9ca3af',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: (hasEnoughAllowance && hasEnoughRIF && !mintWrite.loading) ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {mintWrite.loading ? '⏳ Minting...' : 'Mint POAP'}
            </button>
          </div>
          {mintWrite.error && (
            <p style={{ color: '#dc2626', fontSize: '12px', margin: '8px 0 0 0' }}>
              ❌ {parseContractError(mintWrite.error)}
            </p>
          )}
        </div>
      </div>

      {/* Need RIF Tokens */}
      {!hasEnoughRIF && (
        <div style={{ background: '#fefce8', border: '1px solid #fef3c7', padding: '16px', borderRadius: '8px' }}>
          <h4 style={{ fontWeight: '600', color: '#854d0e', marginBottom: '8px', fontSize: '14px' }}>🪙 Need RIF Tokens?</h4>
          <p style={{ fontSize: '12px', color: '#a16207', marginBottom: '12px' }}>
            You need RIF tokens to mint POAPs. Get them from:
          </p>
          <a
            href="https://faucet.rootstock.io/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ca8a04', textDecoration: 'underline', fontSize: '12px' }}
          >
            🚰 Rootstock Testnet Faucet
          </a>
        </div>
      )}
    </div>
  );
};

export default MintPOAP;
