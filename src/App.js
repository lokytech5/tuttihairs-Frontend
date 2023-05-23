import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import useStore from './zustand/store';
import Navigation from './components/shared/Navigation';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import PaymentPage from './pages/payment/PaymentPage';

import AdminPage from './pages/admin/AdminPanelPage';
import ProtectedRoute from './private/ProtectedRoute';

import UserProfilePage from './pages/users/UserProfilePage';
import UserSettingPage from './pages/users/UserSettingPage';

import CategoryProducts from './components/category/CategoryProducts';
import CategoryDetails from './components/category/CategoryDetails';
import Product from './components/products/Product';
import ProductView from './components/products/ProductView';
import CuratedCollectionDetails from './components/home/CuratedCollectionDetails';
import ShoppingCartReview from './components/cart/ShoppingCartReview';
import ShippingForm from './components/shipping/ShippingForm';

function App() {
  const loadToken = useStore((state) => state.loadToken);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

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

          <Route path='/user-profile' element={<UserProfilePage />} />
          <Route path='/user-setting' element={<UserSettingPage />} />

          <Route path='/collection/:collectionId' element={<CuratedCollectionDetails />} />
          <Route path='/categories/:categoryId' element={<CategoryProducts />} />
          <Route path='/product/:productId' element={<CategoryDetails />} />
          <Route path='/product-list' element={<Product />} />
          <Route path='/productView/:productId' element={<ProductView />} />

          <Route path='/checkout' element={<ShoppingCartReview />} />
          <Route path='/shipping' element={<ShippingForm />} />


          <Route path="/admin" element={<ProtectedRoute requiredRole={["admin"]} />} >
            <Route index element={<AdminPage />} />
          </Route>
        </Routes>
      </Router>

    </>
  );
}

export default App;
