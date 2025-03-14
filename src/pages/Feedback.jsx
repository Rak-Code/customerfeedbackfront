import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [topics, setTopics] = useState([]);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    if (!email || !password) {
      navigate('/login');
      return;
    }

    // Load initial data
    fetchTopics();
    fetchUserFeedbacks();
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
      
      if (data.success) {
        setTopics(data.topics || []);
      } else {
        setError(data.message || 'Failed to load topics');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setError('Error loading topics: ' + error.message);
      setLoading(false);
    }
  };

  const fetchUserFeedbacks = async () => {
    try {
      setLoading(true);
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      
      const response = await fetch('http://localhost:8080/api/feedback/user', {
        method: 'GET',
        headers: {
          'Authorization': `${email}:${password}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        console.log("User feedbacks:", data.feedbacks);
        setUserFeedbacks(data.feedbacks || []);
      } else {
        setError(data.message || 'Failed to load your feedback');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user feedbacks:', error);
      setError('Error loading your feedback: ' + error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('Please enter feedback content');
      return;
    }

    try {
      setLoading(true);
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      
      const payload = {
        content: content.trim()
      };
      
      if (selectedTopicId) {
        payload.topicId = parseInt(selectedTopicId);
      }
      
      const response = await fetch('http://localhost:8080/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Authorization': `${email}:${password}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Feedback submitted successfully');
        setContent('');
        setSelectedTopicId('');
        fetchUserFeedbacks();
      } else {
        alert(data.message || 'Failed to submit feedback');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback: ' + error.message);
      setLoading(false);
    }
  };

  const handleEditStart = (feedback) => {
    setEditingFeedback(feedback);
    setEditContent(feedback.content);
    setSelectedTopicId(feedback.topicId ? feedback.topicId.toString() : '');
  };

  const handleEditCancel = () => {
    setEditingFeedback(null);
    setEditContent('');
  };

  const handleEditSave = async () => {
    if (!editContent.trim()) {
      alert('Please enter feedback content');
      return;
    }

    try {
      setLoading(true);
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      
      const payload = {
        content: editContent.trim(),
        topicId: selectedTopicId ? parseInt(selectedTopicId) : null
      };
      
      const response = await fetch(`http://localhost:8080/api/feedback/edit/${editingFeedback.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `${email}:${password}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Feedback updated successfully');
        setEditingFeedback(null);
        setEditContent('');
        setSelectedTopicId('');
        fetchUserFeedbacks();
      } else {
        alert(data.message || 'Failed to update feedback');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error updating feedback:', error);
      alert('Error updating feedback: ' + error.message);
      setLoading(false);
    }
  };

  const getTopicTitle = (topicId) => {
    if (!topicId) return 'General Feedback';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Customer Feedback Portal</h1>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#777777', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Logout
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', marginBottom: '15px', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {!editingFeedback && (
        <div style={{ 
          backgroundColor: '#f9f9f9', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Submit New Feedback</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Topic:</label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }}
            >
              <option value="">General Feedback</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Your Feedback:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Please enter your feedback here..."
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                minHeight: '120px' 
              }}
              rows={5}
            />
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#555555', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      )}

      {editingFeedback && (
        <div style={{ 
          backgroundColor: '#f9f9f9', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Edit Feedback</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Topic:</label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }}
            >
              <option value="">General Feedback</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Your Feedback:</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Please enter your feedback here..."
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                minHeight: '120px' 
              }}
              rows={5}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleEditSave}
              disabled={loading}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#555555', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

            <button 
              onClick={handleEditCancel}
              disabled={loading}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#777777', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h2>Your Previous Feedback</h2>
      
      {loading && !editingFeedback ? (
        <p>Loading your feedback...</p>
      ) : userFeedbacks.length === 0 ? (
        <p>You haven't submitted any feedback yet.</p>
      ) : (
        <div>
          {userFeedbacks.map(feedback => (
            <div 
              key={feedback.id}
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                padding: '15px', 
                marginBottom: '15px',
                backgroundColor: 'white' 
              }}
            >
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ 
                  backgroundColor: '#e3f2fd', 
                  color: '#1976d2', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '14px' 
                }}>
                  {getTopicTitle(feedback.topicId)}
                </span>
                <span style={{ color: '#757575', fontSize: '14px' }}>
                  {new Date(feedback.createdAt).toLocaleString()}
                </span>
              </div>
              <p style={{ margin: '10px 0', whiteSpace: 'pre-wrap' }}>{feedback.content}</p>
              <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <button
                  onClick={() => handleEditStart(feedback)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#555555',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
