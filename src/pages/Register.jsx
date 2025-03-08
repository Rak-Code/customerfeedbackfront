import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.text();
    alert(data);
    if (data === "User registered successfully!") {
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleRegister} className="bg-white p-6 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input type="text" placeholder="Username" className="w-full p-2 border mb-2"
          onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" className="w-full p-2 border mb-2"
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 border mb-2"
          onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full bg-gray-200 text-gray-700 p-2 rounded">Register</button>
        <button
        className="w-full bg-gray-200 text-gray-700 px-4 py-2 mt-6 rounded"
        onClick={() => navigate("/login")}
      >
        Alredy have a account ? Login
      </button>
      </form>
    </div>
  );
};

export default Register;
