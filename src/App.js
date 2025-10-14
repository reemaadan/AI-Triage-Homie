import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import TopBar from "./components/TopBar"; // <- new
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotEmail from "./pages/ForgotEmail";
import ForgotCode from "./pages/ForgotCode";
import ForgotReset from "./pages/ForgotReset";
import Dashboard from "./pages/Dashboard"; // <- new

export default function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {isDashboard ? <TopBar /> : <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Forgot password flow */}
        <Route path="/forgot" element={<ForgotEmail />} />
        <Route path="/forgot/code" element={<ForgotCode />} />
        <Route path="/forgot/reset" element={<ForgotReset />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
