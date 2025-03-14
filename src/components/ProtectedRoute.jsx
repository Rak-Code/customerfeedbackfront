import { Navigate } from 'react-router-dom';

// Protected route component to handle role-based access
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');
  const role = localStorage.getItem('role');
  
  // If user is not logged in, redirect to login
  if (!email || !password) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified and user's role doesn't match, show access denied
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Access Denied</h1>
      <p>You don't have permission to access this page.</p>
      <div style={{ marginTop: '20px' }}>
        {role === 'ADMIN' ? 
          <a href="/admin" style={{ 
            padding: '8px 16px', 
            backgroundColor: '#1a73e8', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px' 
          }}>Go to Admin Dashboard</a>
        : 
          <a href="/feedback" style={{ 
            padding: '8px 16px', 
            backgroundColor: '#1a73e8', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px' 
          }}>Go to Feedback</a>
        }
      </div>
    </div>;
  }
  
  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
