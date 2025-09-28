// @ts-nocheck
import React from 'react';
import { useWeb3 } from '../hooks/useWeb3';

const ConnectWallet = () => {
  const { 
    account, 
    connecting, 
    connect, 
    disconnect, 
    switchToRootstock, 
    isConnected, 
    isCorrectNetwork, 
    chainId 
  } = useWeb3();

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && account) {
    if (!isCorrectNetwork) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ 
            background: '#fee2e2', 
            border: '1px solid #fca5a5', 
            color: '#991b1b', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '16px' 
          }}>
            <p style={{ fontWeight: '600', margin: '0 0 8px 0' }}>⚠️ Wrong Network</p>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Please switch to Rootstock Testnet (Chain ID: 31)
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
              Current: Chain ID {chainId}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={switchToRootstock}
              style={{ 
                background: '#ea580c', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '6px', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: '600' 
              }}
            >
              Switch to Rootstock
            </button>
            <button
              onClick={disconnect}
              style={{ 
                background: '#6b7280', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '6px', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '14px' 
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ 
          background: '#dcfce7', 
          border: '1px solid #bbf7d0', 
          color: '#166534', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '16px' 
        }}>
          <p style={{ fontWeight: '600', margin: '0 0 8px 0' }}>✅ Wallet Connected</p>
          <div style={{ fontSize: '14px' }}>
            <p style={{ margin: '4px 0' }}>
              Address: <code style={{ 
                background: 'rgba(255,255,255,0.3)', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontSize: '12px' 
              }}>
                {formatAddress(account)}
              </code>
            </p>
            <p style={{ margin: '4px 0' }}>Network: Rootstock Testnet ✅</p>
          </div>
        </div>
        <button
          onClick={disconnect}
          style={{ 
            background: '#dc2626', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '6px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '14px' 
          }}
        >
          Disconnect Wallet
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ 
        background: '#dbeafe', 
        border: '1px solid #bfdbfe', 
        color: '#1d4ed8', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <p style={{ fontWeight: '600', margin: '0 0 8px 0' }}>🔗 Connect Your Wallet</p>
        <p style={{ margin: 0, fontSize: '14px' }}>
          Connect MetaMask to interact with your POAPs on Rootstock
        </p>
      </div>

      <button
        onClick={connect}
        disabled={connecting}
        style={{ 
          background: connecting ? '#9ca3af' : '#3b82f6', 
          color: 'white', 
          padding: '12px 24px', 
          borderRadius: '8px', 
          border: 'none', 
          cursor: connecting ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          minWidth: '180px',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          if (!connecting) {
            e.target.style.background = '#2563eb';
            e.target.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseOut={(e) => {
          if (!connecting) {
            e.target.style.background = '#3b82f6';
            e.target.style.transform = 'translateY(0)';
          }
        }}
      >
        {connecting ? '🔄 Connecting...' : '🦊 Connect MetaMask'}
      </button>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#ebeef3ff' }}>
        <p style={{ marginBottom: '8px' }}>New to MetaMask or need testnet tokens?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a 
            href="https://metamask.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#ebeef3ff', textDecoration: 'underline' }}
          >
            📥 Install MetaMask
          </a>
          <a 
            href="https://faucet.rootstock.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#ebeef3ff', textDecoration: 'underline' }}
          >
            🚰 Get Test Tokens
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
