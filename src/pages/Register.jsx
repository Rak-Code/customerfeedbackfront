import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterStatus("Registering...");
    
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.text();
      
      if (data === "User registered successfully!" || response.ok) {
        setRegisterStatus("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setRegisterStatus("Registration failed: " + data);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterStatus("An error occurred during registration");
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#f5f5f5' 
    }}>
      <form 
        onSubmit={handleRegister} 
        style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
          width: '350px' 
        }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
          Register
        </h2>
        
        {registerStatus && (
          <div style={{ 
            padding: '8px', 
            marginBottom: '16px', 
            borderRadius: '4px', 
            textAlign: 'center',
            backgroundColor: registerStatus.includes("successful") ? '#e6f7e6' : 
                           registerStatus === "Registering..." ? '#e6f0ff' : '#ffebee',
            color: registerStatus.includes("successful") ? '#2e7d32' : 
                  registerStatus === "Registering..." ? '#1565c0' : '#c62828'
          }}>
            {registerStatus}
          </div>
        )}
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
            Username
          </label>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }}
            required 
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
            Email
          </label>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }}
            required 
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
            Password
          </label>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }}
            required 
          />
        </div>
        
        <button 
          type="submit"
          style={{ 
            width: '100%', 
            backgroundColor: '#555555', 
            color: 'white', 
            fontWeight: 'bold', 
            padding: '10px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Register
        </button>
        
        <button
          type="button"
          style={{ 
            width: '100%', 
            backgroundColor: '#777777', 
            color: 'white', 
            fontWeight: 'bold', 
            padding: '10px', 
            border: 'none', 
            borderRadius: '4px', 
            marginTop: '12px', 
            cursor: 'pointer' 
          }}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default Register;
