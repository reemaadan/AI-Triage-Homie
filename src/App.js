import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import TopBar from "./components/TopBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotEmail from "./pages/ForgotEmail";
import ForgotCode from "./pages/ForgotCode";
import ForgotReset from "./pages/ForgotReset";
import Dashboard from "./pages/Dashboard";
import PatientDetail from "./pages/PatientDetail";

export default function App() {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard");
  return (
    <>
      {isDashboard ? <TopBar /> : <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotEmail />} />
        <Route path="/forgot/code" element={<ForgotCode />} />
        <Route path="/forgot/reset" element={<ForgotReset />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient/:pid" element={<PatientDetail />} />
      </Routes>
    </>
  );
}
