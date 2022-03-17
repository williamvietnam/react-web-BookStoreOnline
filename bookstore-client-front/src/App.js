import React, { Fragment, useState } from 'react';
import Header from './components/shared/headers/Header';
import 'antd/dist/antd.css';
import './App.css';
import './components/shared/headers/headers.css';
import BackToTop from './components/shared/BackToTop';
import Footer from './components/shared/footer/Footer';
import { Switch, Route, useHistory } from 'react-router-dom';
import ProductPage from './components/pages/products/ProductPage';
import HomePage from './components/pages/HomePage';
import NotFound404Page from './components/pages/NotFound404Page';
import ShopGridContainer from './containers/products/ShopGridContainer'
import LoginPage from './components/pages/auth/LoginPage';
import SignupPage from './components/pages/auth/SignupPage';
import './css/style.css';
import './components/pages/auth/util.css'
import AccountPage from './components/pages/auth/AccountPage';
import CartPage from './components/pages/cart/CartPage';
import CheckoutPage from './components/cart/CheckoutPage';
import PrivateRoute from './components/shared/PrivateRoute';
import CollectionsPage from './components/collection/CollectionsPage';
import CollectionPage from './components/collection/CollectionPage';
import ForgotPassword from './components/pages/auth/ForgotPassword';
import ResetPassword from './components/pages/auth/ResetPassword';
import BestSellerList from './components/shared/shop/BestSellerList';
import ActivationEmailPage from './components/pages/auth/ActivationEmailPage';

function App(props) {
    let history = useHistory();
    const isLoginPage = history.location.pathname.endsWith("/auth/login")  || history.location.pathname.endsWith("/email-activation") 
    || history.location.pathname.endsWith("/auth/signup") || history.location.pathname.indexOf("/reset-password")>=0
    return (
      <Fragment>
        <div id="back-to-top-anchor"></div>
        { !isLoginPage && <Header />}
        <Switch>
          <Route path="/" exact component={HomePage}></Route>
          <Route path="/home" exact component={HomePage}></Route>
          <Route path="/collections" exact component={CollectionsPage}></Route>
          <Route path="/collection/:id" exact component={CollectionPage}></Route>
          <Route path="/auth/login" exact component={LoginPage}></Route>
          <Route path="/reset-password" exact component={ForgotPassword}></Route>
          {/* <Route path="/reset-password/:token" exact component={ResetPassword}></Route> */}
          <Route path="/auth/signup" exact component={SignupPage}></Route>
          <Route path="/email-activation" exact component={ActivationEmailPage}></Route>
          <Route path="/auth/account" render={()=><PrivateRoute render={() => <AccountPage />} />}></Route>
          <Route path="/checkout/cart" exact render={()=><CartPage />}></Route>
          <Route path="/checkout" exact render={()=><PrivateRoute render={() => <CheckoutPage />} />}></Route>
          <Route path="/book/:id" component={ProductPage}></Route>
          <Route path="/books" exact render={(props) => <ShopGridContainer {...props} />}></Route>
          <Route path="/best-seller" exact render={(props) => <BestSellerList {...props} />}></Route>
          <Route component={NotFound404Page}></Route>
        </Switch>
        {!isLoginPage && <BackToTop />}
        {!isLoginPage && <Footer />}
      </Fragment>

    );
  }

export default App;
