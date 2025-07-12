import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    availability: '',
    isPublic: true,
    skillsOffered: '',
    skillsWanted: '',
  });

  const navigate = useNavigate();

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/me');
        setFormData({
          ...res.data,
          skillsOffered: res.data.skillsOffered?.join(', ') || '',
          skillsWanted: res.data.skillsWanted?.join(', ') || '',
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await API.put('/users/me', {
        ...formData,
        skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()),
        skillsWanted: formData.skillsWanted.split(',').map(s => s.trim()),
      });
      alert('Profile updated!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSave}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
        <input name="availability" value={formData.availability} onChange={handleChange} placeholder="Availability" />

        <textarea
          name="skillsOffered"
          value={formData.skillsOffered}
          onChange={handleChange}
          placeholder="Skills you offer (comma-separated)"
        />
        <textarea
          name="skillsWanted"
          value={formData.skillsWanted}
          onChange={handleChange}
          placeholder="Skills you want (comma-separated)"
        />
        <label>
          <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} />
          Make profile public
        </label>
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
