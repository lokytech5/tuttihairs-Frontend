import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navigation from './components/shared/Navigation';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import PaymentPage from './pages/payment/PaymentPage';
import AdminPage from './pages/admin/AdminPanelPage';
import ProtectedRoute from './private/ProtectedRoute';

import ProfilePage from './pages/users/UserProfilePage';

function App() {
  
  return (
    <>
      <Router>
        <Navigation />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/payment' element={<PaymentPage />} />

          <Route path='/profile' element={<ProfilePage />} />


          <Route path="/admin" element={<ProtectedRoute requiredRole={["admin"]} />} >
            <Route index element={<AdminPage />} />
          </Route>
        </Routes>
      </Router>

    </>
  );
}

export default App;
