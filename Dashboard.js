import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch current user's profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/users/me');
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching profile', err);
        navigate('/');
      }
    };
    fetchUser();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {user.name} 👋</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Location:</strong> {user.location || 'N/A'}</p>
      <p><strong>Availability:</strong> {user.availability || 'Not set'}</p>

      <div>
        <h3>Skills Offered</h3>
        <ul>
          {user.skillsOffered && user.skillsOffered.length > 0 ? (
            user.skillsOffered.map((skill, i) => <li key={i}>{skill}</li>)
          ) : <li>No skills added</li>}
        </ul>
      </div>

      <div>
        <h3>Skills Wanted</h3>
        <ul>
          {user.skillsWanted && user.skillsWanted.length > 0 ? (
            user.skillsWanted.map((skill, i) => <li key={i}>{skill}</li>)
          ) : <li>No skills listed</li>}
        </ul>
      </div>

      <button onClick={() => navigate('/profile')}>Edit Profile</button>
      <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
    </div>
  );
}
