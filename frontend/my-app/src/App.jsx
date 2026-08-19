import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Landing from "./components/Landing/Landing";
import UserPage from "./components/User/UserPage";
import AdminPage from "./components/Admin/AdminPage";
import IssuerLogin from "./components/issuer/IssuerLogin";
import IssuerDashboard from "./components/issuer/IssuerDashboard";
import IssueCertificate from "./components/issuer/IssueCertificate";
import ProtectedIssuerRoute from "./components/issuer/ProtectedIssuerRoute";
import IssuedCertificates from "./components/issuer/IssuedCertificates";
import IssuerInformation from "./components/issuer/IssuerInformation";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<LandingRoute />} />
        <Route path="/user" element={<UserRoute />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/issuer/login" element={<IssuerLogin />} />
        <Route
          path="/issuer/dashboard"
          element={<ProtectedIssuerRoute><IssuerDashboard /></ProtectedIssuerRoute>}
        />
        <Route
          path="/issuer/issue"
          element={<ProtectedIssuerRoute><IssueCertificate /></ProtectedIssuerRoute>}
        />
        <Route
          path="/issuer/certificates"
          element={<ProtectedIssuerRoute><IssuedCertificates /></ProtectedIssuerRoute>}
        />
        <Route
          path="/issuer/information"
          element={<ProtectedIssuerRoute><IssuerInformation /></ProtectedIssuerRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function LandingRoute() {
  const navigate = useNavigate();
  return <Landing onUser={() => navigate("/user")} onAdmin={() => navigate("/admin")} onIssuer={() => navigate("/issuer/login")} />;
}

function UserRoute() {
  const navigate = useNavigate();
  return <UserPage onBack={() => navigate("/")} />;
}

function AdminRoute() {
  const navigate = useNavigate();
  return <AdminPage onBack={() => navigate("/")} />;
}

export default App;