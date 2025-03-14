import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  useEffect(() => {
    // Check if user is logged in and has admin role
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

    // Load initial data
    fetchTopics();
    fetchFeedbacks();
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

  const fetchFeedbacks = async (topicId = null) => {
    try {
      setLoading(true);
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      
      let url = 'http://localhost:8080/api/feedback';
      if (topicId) {
        url += `?topicId=${topicId}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `${email}:${password}`,
          'Content-Type': 'application/json'
        }
      });

      

      const data = await response.json();
      setLoading(false);
      
      if (data.success) {
        setFeedbacks(data.feedbacks || []);
      } else {
        alert(data.message || 'Failed to load feedbacks');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching feedbacks:', error);
      alert('Error loading feedbacks: ' + error.message);
    }
  };

  const handleTopicChange = (e) => {
    const value = e.target.value;
    setSelectedTopicId(value);
    fetchFeedbacks(value || null);
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setEditContent(feedback.content);
  };

  const handleSaveEdit = async () => {
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      
      const response = await fetch(`http://localhost:8080/api/feedback/edit/${editingFeedback.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `${email}:${password}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editContent,
          topicId: editingFeedback.topicId
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Feedback updated successfully');
        setEditingFeedback(null);
        fetchFeedbacks(selectedTopicId);
      } else {
        alert(data.message || 'Failed to update feedback');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      alert('Error updating feedback: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this feedback?')) {
      return;
    }
    
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      
      const response = await fetch(`http://localhost:8080/api/feedback/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${email}:${password}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Feedback deleted successfully');
        fetchFeedbacks(selectedTopicId);
      } else {
        alert(data.message || 'Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Error deleting feedback: ' + error.message);
    }
  };

  const getTopicTitle = (topicId) => {
    if (!topicId) return 'N/A';
    const topic = topics.find(t => t.id === parseInt(topicId));
    return topic ? topic.title : 'Unknown Topic';
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
        <h1>Admin Dashboard - Manage Feedback</h1>
        <div>
          <select 
            value={selectedTopicId} 
            onChange={handleTopicChange}
            style={{ padding: '8px', marginRight: '10px' }}
          >
            <option value="">All Topics</option>
            {topics.map(topic => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
          <button 
            onClick={() => navigate('/topics')}
            style={{ padding: '8px 16px', backgroundColor: '#555555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
          >
            Manage Topics
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
          {feedbacks.length === 0 ? (
            <p>No feedback found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>User ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Topic</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Content</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Created At</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map(feedback => (
                  <tr key={feedback.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{feedback.id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{feedback.userId}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{getTopicTitle(feedback.topicId)}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {editingFeedback && editingFeedback.id === feedback.id ? (
                        <textarea 
                          value={editContent} 
                          onChange={(e) => setEditContent(e.target.value)}
                          style={{ width: '100%', minHeight: '60px' }}
                        />
                      ) : (
                        feedback.content
                      )}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {new Date(feedback.createdAt).toLocaleString()}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {editingFeedback && editingFeedback.id === feedback.id ? (
                        <div>
                          <button 
                            onClick={handleSaveEdit}
                            style={{ backgroundColor: '#444444', color: 'white', border: 'none', padding: '6px 12px', marginRight: '5px', cursor: 'pointer' }}
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingFeedback(null)}
                            style={{ backgroundColor: '#999999', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button 
                            onClick={() => handleEdit(feedback)}
                            style={{ backgroundColor: '#555555', color: 'white', border: 'none', padding: '6px 12px', marginRight: '5px', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(feedback.id)}
                            style={{ backgroundColor: '#777777', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;