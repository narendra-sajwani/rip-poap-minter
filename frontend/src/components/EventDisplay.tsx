// @ts-nocheck
import { useRefresh } from '../context/RefreshContext';
import React, { useState, useEffect } from 'react';
import { useWeb3, useRIFPOAP } from '../hooks/useWeb3';
import { DEFAULT_EVENT_ID, ETHGLOBAL_EVENT } from '../utils/constants';

const EventDisplay = () => {
  const { account, signer, isConnected, isCorrectNetwork } = useWeb3();
  const rifPoapContract = useRIFPOAP(signer);
  
  const [eventData, setEventData] = useState(null);
  const [hasAttended, setHasAttended] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refreshTrigger } = useRefresh();

  useEffect(() => {
    const fetchEventData = async () => {
      if (!rifPoapContract || !isCorrectNetwork) return;
      
      setLoading(true);
      try {
        // Get event data
        const event = await rifPoapContract.events(DEFAULT_EVENT_ID);
        setEventData({
          name: event.name,
          description: event.description,
          active: event.active,
          totalMinted: event.totalMinted.toString(),
        });

        // Check if user has attended (only if connected)
        if (account) {
          const attended = await rifPoapContract.hasAttended(account, DEFAULT_EVENT_ID);
          setHasAttended(attended);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
        // Use fallback data
        setEventData({
          name: ETHGLOBAL_EVENT.name,
          description: ETHGLOBAL_EVENT.description,
          active: true,
          totalMinted: '0',
        });
      }
      setLoading(false);
    };

    fetchEventData();
  }, [rifPoapContract, account, isCorrectNetwork, refreshTrigger]);

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
        <p style={{ color: '#6b7280' }}>Loading event details...</p>
      </div>
    );
  }

  const event = eventData || {
    name: ETHGLOBAL_EVENT.name,
    description: ETHGLOBAL_EVENT.description,
    active: true,
    totalMinted: '0',
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Event Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          margin: '0 auto 16px', 
          background: 'linear-gradient(135deg, #fb923c, #ea580c)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '36px' 
        }}>
          🎫
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          {event.name}
        </h3>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
          {event.description}
        </p>
      </div>

      {/* Event Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📅</span>
          <p style={{ fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0', fontSize: '14px' }}>Event Dates</p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
            {ETHGLOBAL_EVENT.dates}
          </p>
        </div>

        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📍</span>
          <p style={{ fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0', fontSize: '14px' }}>Location</p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
            {ETHGLOBAL_EVENT.location}
          </p>
        </div>

        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>👥</span>
          <p style={{ fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0', fontSize: '14px' }}>Total Minted</p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
            {event.totalMinted} POAPs
          </p>
        </div>

        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>
            {event.active ? '✅' : '❌'}
          </span>
          <p style={{ fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0', fontSize: '14px' }}>Status</p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
            {event.active ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>

      {/* User Status */}
      {isConnected && isCorrectNetwork && (
        <div>
          {hasAttended ? (
            <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#166534', padding: '16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', marginRight: '12px' }}>🎉</span>
                <div>
                  <p style={{ fontWeight: '600', margin: '0 0 4px 0', fontSize: '14px' }}>Already Minted!</p>
                  <p style={{ fontSize: '12px', margin: '0' }}>You have successfully minted your POAP for this event.</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#dbeafe', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', marginRight: '12px' }}>🎯</span>
                <div>
                  <p style={{ fontWeight: '600', margin: '0 0 4px 0', fontSize: '14px' }}>Ready to Mint!</p>
                  <p style={{ fontSize: '12px', margin: '0' }}>You can mint your POAP for this event with 10 RIF tokens.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Requirements */}
      <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '16px', borderRadius: '8px', marginTop: '24px' }}>
        <h4 style={{ fontWeight: '600', color: '#92400e', margin: '0 0 8px 0', fontSize: '14px' }}>📋 Requirements</h4>
        <ul style={{ fontSize: '12px', color: '#a16207', margin: '0', paddingLeft: '16px' }}>
          <li>Connected wallet on Rootstock Testnet</li>
          <li>Minimum 10 RIF tokens for minting</li>
          <li>One POAP per wallet address</li>
          <li>Event must be active</li>
        </ul>
      </div>
    </div>
  );
};

export default EventDisplay;
