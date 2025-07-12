import React, { useState } from 'react';
import API from '../api';
import SwapRequestButton from '../components/SwapRequestButton';


export default function Browse() {
  const [skill, setSkill] = useState('');
  const [results, setResults] = useState([]);

  const searchUsers = async () => {
    try {
      const res = await API.get(`/users/search?skill=${skill}`);
      setResults(res.data);
    } catch (err) {
      alert('Error searching users');
    }
  };

  return (
    <div>
      <h2>Browse Public Profiles</h2>
      <input
        type="text"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        placeholder="Search by skill"
      />
      <button onClick={searchUsers}>Search</button>
      <SwapRequestButton toUserId={user._id} />

      <ul>
        {results.map((user) => (
          <li key={user._id}>
            <h4>{user.name}</h4>
            <p>Email: {user.email}</p>
            <p>Offered: {user.skillsOffered.join(', ')}</p>
            <p>Wanted: {user.skillsWanted.join(', ')}</p>
            <p>Availability: {user.availability}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
