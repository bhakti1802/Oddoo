// src/pages/SwapRequests.js
import React, { useEffect, useState } from 'react';
import API from '../api';

export default function SwapRequests() {
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    const fetchSwaps = async () => {
      const res = await API.get('/swaps/me');
      setSwaps(res.data);
    };
    fetchSwaps();
  }, []);

  const respond = async (id, action) => {
    try {
      await API.post(`/swaps/${id}/${action}`);
      setSwaps((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, status: action } : s
        )
      );
    } catch (err) {
      alert('Failed to respond to swap');
    }
  };

  const deleteSwap = async (id) => {
    try {
      await API.delete(`/swaps/${id}/delete`);
      setSwaps((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <div>
      <h2>Swap Requests</h2>
      <ul>
        {swaps.map((swap) => (
          <li key={swap._id}>
            <p>
              From: {swap.fromUserId.name} → To: {swap.toUserId.name} <br />
              Status: {swap.status}
            </p>

            {swap.status === 'pending' && (
              swap.toUserId._id === swap.fromUserId._id ? null : (
                <>
                  <button onClick={() => respond(swap._id, 'accept')}>Accept</button>
                  <button onClick={() => respond(swap._id, 'reject')}>Reject</button>
                </>
              )
            )}

            {swap.fromUserId._id === swap.toUserId._id && swap.status === 'pending' && (
              <button onClick={() => deleteSwap(swap._id)}>Cancel Request</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
