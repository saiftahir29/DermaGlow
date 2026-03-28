import './App.css';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useEffect, useState } from 'react';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import SkinAssessment from './pages/SkinAssessment';
import Layout from './components/Layout';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import WelcomePage from './pages/WelcomePage';
import ResetPassword from './pages/Auth/ResetPassword';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import LoadingSpinner from './components/LoadingSpinner';
import Report from './pages/Report';
import Home from './pages/Home';
import AdminLayout from './components/AdminLayout';
import ClinicsList from './pages/Admin/ClinicsList.jsx';
import ClinicForm from './pages/Admin/ClinicForm.jsx';
import ClinicDetail from './pages/ClinicDetail';
import ExploreClinics from './pages/ExploreClinics';
import UserClinicDetail from './pages/UserClinicDetail';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (token && userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [location]);

  if (loading) return <LoadingSpinner />;

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : user?.role === "user" ? (
        <>
          {/* User routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<WelcomePage />} />
            <Route path="assessment" element={<SkinAssessment />} />
            <Route path="chat/:chatId" element={<Chat />} />
            <Route path="report" element={<Report />} />
            <Route path="explore-clinics" element={<ExploreClinics />} />
            <Route path="clinic/:id" element={<UserClinicDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="clinics" element={<ClinicsList />} />
            <Route path="clinics/new" element={<ClinicForm />} />
            <Route path="clinics/:id" element={<ClinicDetail />} />
            <Route path="clinics/:id/edit" element={<ClinicForm />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin/clinics" replace />} />
        </>
      )}

      {/* Public route */}
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
