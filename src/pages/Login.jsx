import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.text();

    if (data === "Login successful!") {
      localStorage.setItem("userEmail", email);
      navigate("/feedback");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input type="email" placeholder="Email" className="w-full p-2 border mb-2"
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 border mb-2"
          onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full bg-gray-200 text-gray-700 p-2 rounded">Login</button>
        <button
        className="w-full bg-gray-200 text-gray-700 px-4 py-2 mt-6 rounded"
        onClick={() => navigate("/")}
      >
        Don't have a account ? Register
      </button>
      </form>
    </div>
  );
};

export default Login;
