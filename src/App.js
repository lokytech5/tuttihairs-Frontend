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
import VerifyEmail from './components/auth/VerifyEmail';
import VerifyEmailMessage from './components/auth/VerifyEmailMessage';

import PaymentPage from './pages/payment/PaymentPage';
import PaymentSucessfulPage from './components/payment/PaymentSucessfulPage'

import AdminPage from './pages/admin/AdminPanelPage';
import ProtectedRoute from './private/ProtectedRoute';

import UserProfilePage from './pages/users/UserProfilePage';
import UserSettingPage from './pages/users/UserSettingPage';
import UserOrders from './components/users/UserOrders';

import CategoryProducts from './components/category/CategoryProducts';
import CategoryDetails from './components/category/CategoryDetails';
import Product from './components/products/Product';
import ProductView from './components/products/ProductView';
import CuratedCollectionDetails from './components/home/CuratedCollectionDetails';
import ShoppingCartReview from './components/cart/ShoppingCartReview';
import ShippingForm from './components/shipping/ShippingForm';
import OrderReview from './components/shipping/OrderReview';
import AboutMe from './components/about/AboutMe';
import TrainingClassPage from './components/trainingClasses/TrainingClassPage';
import TrainingClassPriceConfirmation from './components/trainingClasses/TrainingClassPriceConfirmation';
import TrainingClassPhoneVerifyForm from './components/trainingClasses/TrainingClassPhoneVerifyForm';
import TrainingClassForm from './components/trainingClasses/TrainingClassForm';
import TrainingClassOrder from './components/trainingClasses/TrainingClassOrder';

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
          <Route path='/about' element={<AboutMe />} />

          {/*Authentication component section*/}
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path='/email-sent' element={<VerifyEmailMessage />} />
          {/*End of Authentication component section*/}

          {/*Ecommerce Payment component section*/}
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/thankyou' element={<PaymentSucessfulPage />} />
          {/*End of Ecommerce Payment component section*/}

          {/*Users component section*/}
          <Route path='/user-profile' element={<UserProfilePage />} />
          <Route path='/user-setting' element={<UserSettingPage />} />
          <Route path='/user-orders' element={<UserOrders />} />
          {/*End of Users component section*/}

          {/*ProductCategory and collection component section*/}
          <Route path='/collection/:collectionId' element={<CuratedCollectionDetails />} />
          <Route path='/categories/:categoryId' element={<CategoryProducts />} />
          {/*End of ProductCategory and collection component section*/}

          {/*Product component section*/}
          <Route path='/product/:productId' element={<CategoryDetails />} />
          <Route path='/product-list' element={<Product />} />
          <Route path='/productView/:productId' element={<ProductView />} />
          {/*End of Product component section*/}

          {/*shoppingCart and orders component section*/}
          <Route path='/checkout' element={<ShoppingCartReview />} />
          <Route path='/shipping' element={<ShippingForm />} />
          <Route path='/orderReview/:orderId' element={<OrderReview />} />
          {/*End of shoppingCart and orders component section*/}

          {/*TrainingClasses component section*/}
          <Route path='/training' element={<TrainingClassPage />} />
          <Route path='/register/:classId' element={<TrainingClassPriceConfirmation />} />
          <Route path='/trainingConfirmation' element={<TrainingClassOrder />} />
          <Route path='/verifiyPhone' element={<TrainingClassPhoneVerifyForm />} />
          <Route path='/trainingRegisterForm' element={<TrainingClassForm />} />
          {/*End of TrainingClasses component section*/}

          {/*Admin component section*/}
          <Route path="/admin" element={<ProtectedRoute requiredRole={["admin"]} />} >
            <Route index element={<AdminPage />} />
          </Route>
        </Routes>
      </Router>

    </>
  );
}

export default App;
