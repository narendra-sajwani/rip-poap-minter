// @ts-nocheck
import { useRefresh } from '../context/RefreshContext';
import React, { useState, useEffect } from 'react';
import { useWeb3, useRIFPOAP } from '../hooks/useWeb3';
import { DEFAULT_EVENT_ID, RIF_POAP_CONTRACT_ADDRESS } from '../utils/constants';

const CollectionView = () => {
  const { account, isConnected, isCorrectNetwork } = useWeb3();
  const rifPoapContract = useRIFPOAP();
  
  const [poapBalance, setPoapBalance] = useState(0);
  const [userPoaps, setUserPoaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const { refreshTrigger } = useRefresh();

  useEffect(() => {
    const fetchCollection = async () => {
      if (!rifPoapContract || !account || !isCorrectNetwork) return;
      
      setLoading(true);
      try {
        // Get total POAP balance
        const balance = await rifPoapContract.balanceOf(account);
        setPoapBalance(parseInt(balance.toString()));

        // Get POAPs for current event
        const eventPoaps = await rifPoapContract.getUserPOAPsForEvent(account, DEFAULT_EVENT_ID);
        setUserPoaps(eventPoaps.map(id => id.toString()));
        
      } catch (error) {
        console.error('Error fetching collection:', error);
      }
      setLoading(false);
    };

    fetchCollection();
  }, [rifPoapContract, account, isCorrectNetwork, refreshTrigger]);

  if (!isConnected) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <p style={{ color: '#6b7280' }}>🔗 Connect your wallet to view your POAP collection</p>
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
        <p style={{ color: '#6b7280' }}>Loading your POAP collection...</p>
      </div>
    );
  }

  if (poapBalance === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '32px' }}>
          <span style={{ fontSize: '96px', display: 'block', marginBottom: '16px' }}>🎫</span>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>No POAPs Yet</h3>
          <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '14px' }}>
            You haven't minted any POAPs yet. Start by minting your first POAP above!
          </p>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            <p>💡 POAPs are proof-of-attendance NFTs that commemorate your participation in events</p>
          </div>
        </div>
      </div>
    );
  }

  const eventPoapsCount = userPoaps.length;

  return (
    <div style={{ padding: '20px' }}>
      {/* Collection Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>🏆</span>
          <p style={{ fontWeight: '600', color: '#1e40af', margin: '0 0 4px 0', fontSize: '14px' }}>Total POAPs</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb', margin: '0' }}>{poapBalance}</p>
        </div>
        
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>🎯</span>
          <p style={{ fontWeight: '600', color: '#166534', margin: '0 0 4px 0', fontSize: '14px' }}>This Event</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a', margin: '0' }}>{eventPoapsCount}</p>
        </div>
        
        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>⭐</span>
          <p style={{ fontWeight: '600', color: '#6b21a8', margin: '0 0 4px 0', fontSize: '14px' }}>Status</p>
          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#9333ea', margin: '0' }}>
            {eventPoapsCount > 0 ? 'Attendee' : 'Visitor'}
          </p>
        </div>
      </div>

      {/* POAP Cards */}
      {eventPoapsCount > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            🎫 Your ETHGlobal New Delhi POAPs
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {userPoaps.map((tokenId) => (
              <POAPCard key={tokenId} tokenId={tokenId} />
            ))}
          </div>
        </div>
      )}

      {/* Collection Value */}
      <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '1px solid #fde68a', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <h4 style={{ fontWeight: '600', color: '#92400e', margin: '0 0 8px 0', fontSize: '14px' }}>💎 Collection Value</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '12px' }}>
          <div>
            <p style={{ color: '#a16207', margin: '0 0 4px 0' }}>RIF Tokens Spent:</p>
            <p style={{ fontWeight: 'bold', color: '#92400e', margin: '0' }}>{eventPoapsCount * 10} RIF</p>
          </div>
          <div>
            <p style={{ color: '#a16207', margin: '0 0 4px 0' }}>Events Attended:</p>
            <p style={{ fontWeight: 'bold', color: '#92400e', margin: '0' }}>{eventPoapsCount > 0 ? 1 : 0}</p>
          </div>
        </div>
      </div>

      {/* Share Collection */}
      <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
          🌟 Show off your POAP collection!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              const text = `I just minted my ETHGlobal New Delhi 2025 POAP! 🏆 Built on @rootstock_io using RIF tokens. #ETHGlobal #Rootstock #Bitcoin`;
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
              window.open(url, '_blank');
            }}
            style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }}
          >
            📱 Share on Twitter
          </button>
          <button
            onClick={() => {
              const text = `Check out my POAP collection! I have ${poapBalance} POAPs including ETHGlobal New Delhi 2025. View my collection on Rootstock blockchain.`;
              navigator.clipboard.writeText(text);
              alert('Collection info copied to clipboard!');
            }}
            style={{ background: '#6b7280', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }}
          >
            📋 Copy Info
          </button>
        </div>
      </div>
    </div>
  );
};

// Individual POAP Card Component
const POAPCard = ({ tokenId }) => {
  return (
    <div style={{ 
      background: 'white', 
      border: '1px solid #e5e7eb', 
      borderRadius: '8px', 
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ 
        aspectRatio: '1', 
        background: 'linear-gradient(135deg, #fb923c, #ea580c)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <span style={{ fontSize: '48px' }}>🏆</span>
      </div>
      <div style={{ padding: '16px' }}>
        <h5 style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px', color: '#1f2937' }}>
          ETHGlobal New Delhi 2025 POAP
        </h5>
        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
          Token ID: #{tokenId}
        </p>
        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
          Proof of attendance for ETHGlobal New Delhi hackathon
        </p>
        <div style={{ paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
            <span style={{ color: '#6b7280' }}>Cost: 10 RIF</span>
            <a
              href={`https://explorer.testnet.rsk.co/token/${RIF_POAP_CONTRACT_ADDRESS}?tab=tokens&item=${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#ea580c', textDecoration: 'underline' }}
            >
              View →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionView;
