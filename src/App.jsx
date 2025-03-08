import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feedback from "./pages/Feedback";
import Admin from "./pages/Admin";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Register />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
};

export default App;
