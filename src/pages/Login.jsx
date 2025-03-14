import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    const storedRole = localStorage.getItem("role");
    
    if (storedEmail && storedPassword && storedRole) {
      // Redirect based on role
      if (storedRole === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/feedback");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginStatus("Logging in...");
    
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      // First check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login failed with status:", response.status);
        console.error("Error response:", errorText);
        
        try {
          // Try to parse as JSON, but handle case where it's plain text
          const errorData = JSON.parse(errorText);
          setLoginStatus(errorData.message || "Login failed");
        } catch (e) {
          // If it's not valid JSON, use the text directly
          setLoginStatus(errorText || "Login failed");
        }
        return;
      }
      
      // If we get here, response is ok, try to parse as JSON
      let data;
      try {
        const responseText = await response.text();
        console.log("Raw response:", responseText);
        data = JSON.parse(responseText);
      } catch (error) {
        console.error("Error parsing response:", error);
        setLoginStatus("Error parsing server response");
        return;
      }
      
      console.log("Login response:", data);

      // Only proceed if we have data and it indicates success
      if (data && data.success) {
        setLoginStatus("Login successful! Redirecting...");
        
        // Store authentication information in localStorage as individual items
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id);
        
        console.log("Authentication data stored in localStorage");
        
        // Add a small delay before redirecting
        setTimeout(() => {
          console.log("Redirecting to", data.role === "ADMIN" ? "/admin" : "/feedback");
          
          // Redirect based on role
          if (data.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/feedback");
          }
        }, 500);
      } else {
        setLoginStatus(data.message || "Login failed");
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginStatus("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 shadow-md rounded-md w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        
        {loginStatus && (
          <div className={`p-2 mb-4 rounded text-center ${
            loginStatus.includes("successful") ? "bg-green-100 text-green-700" : 
            loginStatus === "Logging in..." ? "bg-blue-100 text-blue-700" : 
            "bg-red-100 text-red-700"
          }`}>
            {loginStatus}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <button 
          type="submit"
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Login
        </button>
        
        <button
          type="button"
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => navigate("/register")}
        >
          Don't have an account? Register
        </button>
      </form>
    </div>
  );
};

export default Login;
