import React, { Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import SideMenu from './components/menu/SideMenu';
import Header from './components/menu/Header';
import ProductList from './components/products/product-list/ProductList';
import ReviewList from './components/reviews/ReviewList';
import './css/util.css'
import 'antd/dist/antd.css';
import ListCommon from './components/shared/ListCommon';
import { Switch, Route, useHistory, useLocation, Redirect } from 'react-router-dom';
import CategoryList from './components/categories/CategoryList';
import CollectionList from './components/collections/CollectionList';
import UserList from './components/users/UserList';
import ProductDetail from './components/products/ProductDetail';
import Login from './components/auth/Login';
import PrivateRoute from './components/shared/PrivateRoute';
import CategoryDetail from './components/categories/CategoryDetail';
import { DELETE_BOOKS } from './api/bookApi';
import { DELETE_REVIEWS } from './api/reviewApi';
import { DELETE_CATEGORIES } from './api/categoryApi';
import { DELETE_COLLECTIONS } from './api/collectionApi';
import { UPDATE_USER } from './api/authApi';
import CollectionCreate from './components/collections/CollectionCreate';
import CollectionEdit from './components/collections/CollectionEdit';
import OrderList from './components/orders/OrderList';
import { CREATE_ORDER } from './api/orderApi';
import Dashboard from './components/dashboard/Dashboard';
import OrderDetail from './components/orders/OrderDetail';
import UserDetail from './components/users/UserDetail';
import { DELETE_DISCOUNTS } from './api/discountApi';
import DiscountList from './components/discounts/DiscountList';
import DiscountCreate from './components/discounts/DiscountCreate';
import DiscountEdit from './components/discounts/DiscountEdit';
import { DELETE_AUTHORS } from './api/authorApi';
import AuthorList from './components/authors/AuthorList';
import PublisherList from './components/publishers/PublisherList';
import AuthorCreate from './components/authors/AuthorCreate';
import AuthorEdit from './components/authors/AuthorEdit';
import { DELETE_PUBLISHERS } from './api/publisherApi';
import PublisherEdit from './components/publishers/PublisherEdit';
import PublisherCreate from './components/publishers/PublisherCreate';
import isTokenValid from './utils/tokenValidation';
import CreateUser from './components/users/CreateUser';

const ProductListWrapper = ListCommon(ProductList, 'title_DESC', "Sách", DELETE_BOOKS);
const OrderListWrapper = ListCommon(OrderList, 'createdAt_DESC', "Đơn hàng", CREATE_ORDER);
const ReviewListWrapper = ListCommon(ReviewList, 'createdAt_DESC', "Đánh giá", DELETE_REVIEWS);
const CategoryListWrapper = ListCommon(CategoryList, 'createdAt_DESC', "Thể loại", DELETE_CATEGORIES);
const CollecionListWrapper = ListCommon(CollectionList, 'createdAt_DESC', "Tuyển tập", DELETE_COLLECTIONS);
const UserListWrapper = ListCommon(UserList, 'createdAt_DESC', "Người dùng", UPDATE_USER);
const DiscountListWrapper = ListCommon(DiscountList, 'createdAt_DESC', "Giảm giá", DELETE_DISCOUNTS);
const AuthorListWrapper = ListCommon(AuthorList, 'createdAt_DESC', "Tác giả", DELETE_AUTHORS);
const PublisherListWrapper = ListCommon(PublisherList, 'createdAt_DESC', "Nhà xuất bản", DELETE_PUBLISHERS);

function App() {

  const history = useHistory();
  const location = useLocation();
  const token = localStorage.getItem('token');
  if (!isTokenValid(token)) {
      return <Login />
  }
  return (
    <div className="App">
      {location.pathname.indexOf('/auth/login') < 0 && <Fragment>
        <SideMenu />
        <Header />
      </Fragment>}
      <div className="content-outer">
        <Switch>
          <Route path="/" exact render={(props) => <PrivateRoute render={() => <Dashboard {...props} />} />} />
          <Route path="/dashboard" exact render={(props) => <PrivateRoute render={() => <Dashboard {...props} />} />} />
          <Route path="/catalog/books" exact render={(props) => <PrivateRoute render={() => <ProductListWrapper onClickCreate={() => history.push('/catalog/book/create')} {...props} />} />} />
          <Route path="/catalog/reviews" exact render={(props) => <PrivateRoute render={() => <ReviewListWrapper onClickCreate={() => history.push('/catalog/review/create')} {...props} />} />} />
          <Route path="/catalog/categories" exact render={(props) => <PrivateRoute render={() => <CategoryListWrapper onClickCreate={() => history.push('/catalog/category/create')} {...props} />} />} />
          <Route path="/catalog/authors" exact render={(props) => <PrivateRoute render={() => <AuthorListWrapper onClickCreate={() => history.push('/catalog/author/create')} {...props} />} />} />
          <Route path="/catalog/publishers" exact render={(props) => <PrivateRoute render={() => <PublisherListWrapper onClickCreate={() => history.push('/catalog/publisher/create')} {...props} />} />} />
          <Route path="/catalog/collections" exact render={(props) => <PrivateRoute render={() => <CollecionListWrapper onClickCreate={() => history.push('/catalog/collection/create')} {...props} />} />} />
          <Route path="/catalog/book/create" exact render={(props) => <PrivateRoute render={() => <ProductDetail isCreating {...props} />} />} />
          <Route path="/catalog/author/create" exact render={(props) => <PrivateRoute render={() => <AuthorCreate {...props} />} />} />
          <Route path="/catalog/book/edit/:id" exact render={(props) => <PrivateRoute render={() => <ProductDetail isCreating={false} {...props} />} />} />
          <Route path="/catalog/category/create" exact render={(props) => <PrivateRoute render={() => <CategoryDetail isCreating {...props} />} />} />
          <Route path="/catalog/category/edit/:id" exact render={(props) => <PrivateRoute render={() => <CategoryDetail isCreating={false} {...props} />} />} />
          <Route path="/sale/order/list" exact render={(props) => <PrivateRoute render={() => <OrderListWrapper {...props} showCreate={false} showDelete={false} />} />} />
          <Route path="/users/users" exact render={(props) => <PrivateRoute render={() => <UserListWrapper
            showDelete={false}
            onClickCreate={() => history.push('/users/create')} {...props} />} />} />
          <Route path="/promotion/discounts" exact render={(props) => <PrivateRoute render={() => <DiscountListWrapper onClickCreate={() => history.push('/promotion/discount/create')} {...props} />} />} />
          <Route path="/promotion/discount/create" exact render={(props) => <PrivateRoute render={() => <DiscountCreate {...props} />} />} />
          <Route path="/promotion/discount/edit/:id" exact render={(props) => <PrivateRoute render={() => <DiscountEdit {...props} />} />} />
          <Route path="/users/edit/:id" exact render={(props) => <PrivateRoute render={() => <UserDetail {...props} />} />} />
          <Route path="/users/create" exact render={(props) => <PrivateRoute render={() => <CreateUser {...props} />} />} />
          <Route path="/catalog/collection/create" exact render={(props) => <PrivateRoute render={() => <CollectionCreate {...props} />} />} />
          <Route path="/catalog/collection/edit/:id" exact render={(props) => <PrivateRoute render={() => <CollectionEdit {...props} />} />} />
          <Route path="/catalog/author/edit/:id" exact render={(props) => <PrivateRoute render={() => <AuthorEdit {...props} />} />} />
          <Route path="/catalog/publisher/edit/:id" exact render={(props) => <PrivateRoute render={() => <PublisherEdit {...props} />} />} />
          <Route path="/catalog/publisher/create" exact render={(props) => <PrivateRoute render={() => <PublisherCreate {...props} />} />} />
          <Route path="/sale/order/edit/:id" exact render={(props) => <PrivateRoute render={() => <OrderDetail {...props} />} />} />
          <Route path="/auth/login" exact render={(props) => <Login  {...props} />} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
