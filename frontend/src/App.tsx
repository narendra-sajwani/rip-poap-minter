import React from 'react';
import { RefreshProvider } from './context/RefreshContext';
import ConnectWallet from './components/ConnectWallet';
import EventDisplay from './components/EventDisplay';
import MintPOAP from './components/MintPOAP';
import CollectionView from './components/CollectionView';
import DebugInfo from './components/DebugInfo';
import ContractDebug from './components/ContractDebug';
import './App.css';

function App() {
  return (
    <RefreshProvider>
    <div className="App">
      <header className="App-header" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        minHeight: '100vh', 
        color: 'white',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              🏆 RIF POAP Minter
            </h1>
            <p style={{ fontSize: '18px', margin: '0 0 20px 0', opacity: 0.9 }}>
              Mint your ETHGlobal New Delhi 2025 POAP using RIF tokens
            </p>
            <div style={{ background: '#ea580c', color: 'white', padding: '12px 24px', borderRadius: '8px', display: 'inline-block' }}>
              <p style={{ fontWeight: '600', margin: 0, fontSize: '14px' }}>
                💰 Cost: 10 RIF tokens | 🔗 Powered by Rootstock
              </p>
            </div>
          </div>

          {/* Connect Wallet Section */}
          <div style={{ marginBottom: '32px' }}>
            <ConnectWallet />
          </div>

          {/* Main Content */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '32px', 
            marginBottom: '32px' 
          }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                🎉 Current Event
              </h2>
              <EventDisplay />
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                🎫 Mint Your POAP
              </h2>
              <MintPOAP />
            </div>
          </div>

          {/* Collection Section */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
              🖼️ Your POAP Collection
            </h2>
            <CollectionView />
          </div>

          {/* Footer */}
          <footer style={{ textAlign: 'center', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.2)', opacity: 0.8 }}>
            <p style={{ marginBottom: '8px', fontSize: '14px' }}>
              Built for ETHGlobal New Delhi 2025 hackathon
            </p>
            <p style={{ fontSize: '12px' }}>
              Using <strong>Rootstock</strong> (Bitcoin Sidechain) + <strong>RIF</strong> tokens
            </p>
            <div style={{ marginTop: '12px', fontSize: '10px', fontFamily: 'monospace' }}>
              <p>RIF Token: {process.env.REACT_APP_RIF_TOKEN_ADDRESS}</p>
              <p>POAP Contract: {process.env.REACT_APP_RIF_POAP_CONTRACT_ADDRESS || '❌ NOT SET'}</p>
            </div>
        </footer>
        </div>
      </header>
    </div>
    </RefreshProvider>
  );
}

export default App;
