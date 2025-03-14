import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Topics = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    active: true
  });

  // Check if user is logged in and is admin
  useEffect(() => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    const role = localStorage.getItem('role');

    if (!email || !password) {
      navigate('/login');
      return;
    }

    if (role !== 'ADMIN') {
      alert('You do not have permission to access this page');
      navigate('/feedback');
      return;
    }

    // Load topics
    fetchTopics();
  }, [navigate]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      
      const response = await fetch('http://localhost:8080/api/topics', {
        method: 'GET',
        headers: {
          'Authorization': `${email}:${password}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setLoading(false);
      
      if (data.success) {
        setTopics(data.topics || []);
      } else {
        alert(data.message || 'Failed to load topics');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching topics:', error);
      alert('Error loading topics: ' + error.message);
    }
  };

  const openModal = (topic = null) => {
    if (topic) {
      setEditingTopic(topic);
      setFormData({
        title: topic.title,
        description: topic.description,
        active: topic.active
      });
    } else {
      setEditingTopic(null);
      setFormData({
        title: '',
        description: '',
        active: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTopic(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title for the topic');
      return;
    }
    
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      
      const url = editingTopic 
        ? `http://localhost:8080/api/topics/${editingTopic.id}` 
        : 'http://localhost:8080/api/topics';
      
      const method = editingTopic ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `${email}:${password}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingTopic ? 'Topic updated successfully' : 'Topic created successfully');
        closeModal();
        fetchTopics();
      } else {
        alert(data.message || 'Failed to save topic');
      }
    } catch (error) {
      console.error('Error saving topic:', error);
      alert('Error saving topic: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this topic?')) {
      return;
    }
    
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      
      const response = await fetch(`http://localhost:8080/api/topics/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${email}:${password}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Topic deleted successfully');
        fetchTopics();
      } else {
        alert(data.message || 'Failed to delete topic');
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
      alert('Error deleting topic: ' + error.message);
    }
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1>Topics Management</h1>
        <div>
          <button 
            onClick={() => openModal()}
            style={{ padding: '8px 16px', backgroundColor: '#444444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
          >
            Add New Topic
          </button>
          <button 
            onClick={() => navigate('/admin')}
            style={{ padding: '8px 16px', backgroundColor: '#555555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
          >
            Back to Admin
          </button>
          <button 
            onClick={handleLogout}
            style={{ padding: '8px 16px', backgroundColor: '#777777', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {topics.length === 0 ? (
            <p>No topics found. Click 'Add New Topic' to create one.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Title</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Description</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Active</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Created</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {topics.map(topic => (
                  <tr key={topic.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{topic.id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{topic.title}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{topic.description}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{topic.active ? 'Yes' : 'No'}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {topic.createdAt ? new Date(topic.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <button 
                        onClick={() => openModal(topic)}
                        style={{ backgroundColor: '#555555', color: 'white', border: 'none', padding: '6px 12px', marginRight: '5px', cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(topic.id)}
                        style={{ backgroundColor: '#777777', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90%'
          }}>
            <h2>{editingTopic ? 'Edit Topic' : 'Add New Topic'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', minHeight: '100px' }}
                  rows={4}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    style={{ marginRight: '8px' }}
                  />
                  Active
                </label>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ padding: '8px 16px', backgroundColor: '#777777', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', backgroundColor: '#555555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {editingTopic ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topics;
