import React, { useState, Fragment } from 'react';
import MiniCart from '../../cart/MiniCart'
import { Fade, Button } from '@material-ui/core';
import useScroll from '../../../custom-hooks/useScroll';
import { NavLink, useHistory } from 'react-router-dom';
import SearchBoxContainer from '../../../containers/shared/search/SearchBoxContainer';
import { Popover } from 'antd';
import { connect } from 'react-redux';
import isTokenValid from '../../../utils/tokenValidation';
import { logout } from '../../../redux/actions/authAction';
import { changeFilter } from '../../../redux/actions/filtersActions';
import { useQuery } from '@apollo/react-hooks';
import { GET_CATEGORIES } from '../../../api/categoryApi';
import { GET_AUTHORS } from '../../../api/authorApi';
import { FILTER_TYPE_AUTHOR, FILTER_TYPE_CAT,RESET_FILTERS } from '../../../constants';
import { GET_COLLECTIONS } from '../../../api/collectionApi';

function Header(props) {

  const { user, token } = props.auth;
  const { logout, cart, changeFilter } = props;

  const [showSearch, setShowSearch] = useState(false);

  const history = useHistory();

  const isSticky = useScroll(200);

  const { loading: loadingCateories, data: dataCategories = {} } = useQuery(GET_CATEGORIES, {
    variables: {
      first: 8
    },
    onError(err) {
      console.log(err.toString());
    }
  });

  const { loading: loadingAuthors, data: dataAuthors = {} } = useQuery(GET_AUTHORS, {
    variables: {
      first: 8
    },
    onError(err) {
      console.log(err.toString());
    }
  });

  const { loading: loadingCollection, data: dataCollections = {getCollections: {}} } = useQuery(GET_COLLECTIONS, {
    variables: {
      first: 8
    },
    onError(err) {
      console.log(err.toString());
    }
  });

  const toggleSearch = () => {
    setShowSearch(prevShowSearch => !prevShowSearch);//the call back must return a value
  }

  const closeSearch = () => {
    setShowSearch(false);
  }

  const authDropDown = !isTokenValid(token) ? (<Fragment>
    <div className="p-b-8">
      <NavLink to="/auth/login">
        <Button variant="contained" color="primary">
          Đăng nhập
      </Button>
      </NavLink>
    </div>
    <div >
      <NavLink to="/auth/signup">
        <Button variant="contained" className='w-100' color="primary">
          Đăng ký
      </Button>
      </NavLink>
    </div>
  </Fragment>
  ) : (<Fragment>
    <ul style={{ listStyleType: 'none', lineHeight: 2 }}>
      <li><NavLink to="/auth/account/orders/history"><i className="fa fa-list-ol"></i>&nbsp;Đơn hàng</NavLink></li>
      <li><NavLink to="/auth/account/edit"><i className="fa fa-user-circle"></i>&nbsp;Tài khoản</NavLink></li>
      <li><NavLink to="/auth/account/wish-list"><i className="fa fa-heart"></i>&nbsp;Sản phẩm yêu thích</NavLink></li>
      <li><a onClick={logout} ><i className="fa fa-sign-out"></i>&nbsp;Đăng xuất</a></li>
    </ul>
  </Fragment>);

  return (
    <header id="wn__header" className={`header__area header__absolute sticky__header ${isSticky && "is-sticky"}`}>
      <Fade in={showSearch} timeout={300}>
        <div><SearchBoxContainer onClose={closeSearch} /></div>
      </Fade>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 col-sm-6 col-6 col-lg-2">
            <div className="logo">
              <NavLink to="/">
                <img src="/images/logo/logo.png" alt="logo images" />
              </NavLink>
            </div>
          </div>
          <div className="col-lg-8 d-none d-lg-block">
            <nav className="mainmenu__nav">
              <ul className="meninmenu d-flex justify-content-start">
                <li className="drop with--one--item"><NavLink to="/">Trang chủ</NavLink></li>
                <li className="drop"><NavLink to="/books">Sách</NavLink>
                  <div className="megamenu mega03">
                    <ul className="item item03">
                      <li className="title">Thể loại</li>
                      {
                        dataCategories.getCategories && dataCategories.getCategories.map(item => (
                          <li key={item.id} onClick={() => {
                            changeFilter(RESET_FILTERS);
                            changeFilter(FILTER_TYPE_CAT, item.id);
                            history.push("/books");
                          }}><a>{item.name} </a></li>
                        ))
                      }
                      <li ><NavLink to="/books" style={{ fontWeight: 600 }}>Tất cả thể loại <i className="fs-13 fa fa-angle-right"></i></NavLink></li>
                      {/* <li><a href="shop-grid.html">Business </a></li>
                      <li><a href="shop-grid.html">Cookbooks </a></li>
                      <li><a href="shop-grid.html">Health &amp; Fitness </a></li>
                      <li><a href="shop-grid.html">History </a></li> */}
                    </ul>
                    <ul className="item item03">
                      <li className="title">Tác giả</li>
                      {dataAuthors.getAuthors && dataAuthors.getAuthors.map(item => (
                        <li key={item.id} onClick={() => {
                          changeFilter(RESET_FILTERS);
                          changeFilter(FILTER_TYPE_AUTHOR, item.id);
                          history.push("/books");
                        }}><a>{item.pseudonym} </a></li>
                      ))}
                      <li><NavLink to="/books" style={{ fontWeight: 600 }}>Tất cả tác giả <i className="fs-13 fa fa-angle-right"></i></NavLink></li>
                    </ul>
                    <ul className="item item03">
                      <li className="title">Tuyển tập</li>
                      {!loadingCollection &&dataCollections.getCollections&&dataCollections.getCollections.collections && dataCollections.getCollections.collections.map(item => (
                        <li key={item.id} onClick={() => {
                          history.push("/collection/"+item.id);
                        }}><a>{item.name} </a></li>
                      ))}
                      <li><NavLink to="/collections" style={{ fontWeight: 600 }}>Tất cả tuyển tập <i className="fs-13 fa fa-angle-right"></i></NavLink></li>
                    </ul>
                  </div>
                </li>
                <li className="drop with--one--item"><NavLink to="/best-seller">Bán chạy</NavLink></li>
              </ul>
            </nav>
          </div>
          <div className="col-md-6 col-sm-6 col-6 col-lg-2">
            <ul className="header__sidebar__right d-flex justify-content-end align-items-center">
              <li className="shop_search p-r-20 p-l-10" onClick={toggleSearch}><a className="search__active" href="#" /></li>
              <li className="shopcart">
                <Popover style={{ overflow: 'auto' }} placement="bottom" content={
                  <div><MiniCart cart={cart} /></div>
                }>
                  <a className="cartbox_active" href="#"><span className="product_qun">{cart.cartTotalQty}</span>
                  </a>
                </Popover>
                {/* Start Shopping Cart */}
                {/* End Shopping Cart */}
              </li>
              <li className="setting__bar__icon">
                <Popover content={authDropDown} placement="bottom">
                  <a className="setting__active" href="#" />
                </Popover>
              </li>
            </ul>
          </div>
        </div>
        {/* Start Mobile Menu */}
        <div className="row d-none">
          <div className="col-lg-12 d-none">
            <nav className="mobilemenu__nav">
              <ul className="meninmenu">
                <li><a href="index.html">Home</a></li>
                <li><a href="#">Pages</a>
                  <ul>
                    <li><a href="about.html">About Page</a></li>
                    <li><a href="portfolio.html">Portfolio</a>
                      <ul>
                        <li><a href="portfolio.html">Portfolio</a></li>
                        <li><a href="portfolio-details.html">Portfolio Details</a></li>
                      </ul>
                    </li>
                    <li><a href="my-account.html">My Account</a></li>
                    <li><a href="cart.html">Cart Page</a></li>
                    <li><a href="checkout.html">Checkout Page</a></li>
                    <li><a href="wishlist.html">Wishlist Page</a></li>
                    <li><a href="error404.html">404 Page</a></li>
                    <li><a href="faq.html">Faq Page</a></li>
                    <li><a href="team.html">Team Page</a></li>
                  </ul>
                </li>
                <li><a href="shop-grid.html">Shop</a>
                  <ul>
                    <li><a href="shop-grid.html">Shop Grid</a></li>
                    <li><a href="single-product.html">Single Product</a></li>
                  </ul>
                </li>
                <li><a href="blog.html">Blog</a>
                  <ul>
                    <li><a href="blog.html">Blog Page</a></li>
                    <li><a href="blog-details.html">Blog Details</a></li>
                  </ul>
                </li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
        {/* End Mobile Menu */}
        <div className="mobile-menu d-block d-lg-none">
        </div>
        {/* Mobile Menu */}
      </div>
    </header>);
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    cart: state.cart
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeFilter: (type, value) => {
      dispatch(changeFilter(type, value));
    },
    logout: () => {
      dispatch(logout());
    },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);