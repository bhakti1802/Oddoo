import React, { useState } from 'react';
import API from '../api';

export default function SwapRequestButton({ toUserId }) {
  const [status, setStatus] = useState('idle');

  const sendRequest = async () => {
    try {
      await API.post('/swaps', { toUserId });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div>
      {status === 'sent' ? (
        <p>Request Sent ✅</p>
      ) : status === 'error' ? (
        <p style={{ color: 'red' }}>Error sending request ❌</p>
      ) : (
        <button onClick={sendRequest}>Send Swap Request</button>
      )}
    </div>
  );
}
