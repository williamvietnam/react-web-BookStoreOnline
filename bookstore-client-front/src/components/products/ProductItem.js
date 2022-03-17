import React, { Fragment } from 'react';
import './products.css';
import { NavLink, useHistory } from 'react-router-dom';
import { Popover, Button, message, Rate } from 'antd';
import { FILTER_TYPE_AUTHOR, RESET_FILTERS } from '../../constants';
import { connect } from 'react-redux';
import { changeFilter } from '../../redux/actions/filtersActions';
import { withApollo } from '@apollo/react-hoc';
import { addSingleItemToCartAysnc } from '../../redux/actions/cartAction';
import { useMutation } from '@apollo/react-hooks';
import { ADD_BOOK_TO_WISH_LIST } from '../../api/bookApi';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import { calculateDiscount } from '../../utils/common';
import isTokenValid from '../../utils/tokenValidation';

function ProductItem(props) {
  const { id, thumbnail, basePrice, availableCopies, title, authors, description, reviews,
    discounts = { discountedPrice: 0, discountRate: 0, discountAmount: 0 } } = props.book;
  const { discountedPrice, discountRate, discountAmount } = discounts;
  const { width, thumbHeight, changeFilter, addSingleItemToCart, cart } = props;
  const tokenValid = isTokenValid(localStorage.getItem('token'));
  const history = useHistory();
  const [addBookToWishList, { loading: addingToWishList }] = useMutation(ADD_BOOK_TO_WISH_LIST, {
    onError() {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau");
    },
    onCompleted(data) {
      if (data.addBookToWishList.statusCode === 200) {
        message.success("Đã thêm vào danh sách ưa thích")
      } else {
        message.error(data.addBookToWishList.message);
      }
    }
  });
  const productDialog = (<div id="express-buy-dialog" className="express-buy-l" >
    <div className="loading" style={{}} />
    <div className="content" id={105165} ng-show="productItem">
      <div className="t-view ng-binding">
        {title}
      </div>
      <div className="au-view">
        {/* ngRepeat: item in productItem.Authors */}
        {authors.map((item, index) => (
          <Fragment key={item.id} ><a onClick={() => {
            changeFilter(RESET_FILTERS);
            changeFilter(FILTER_TYPE_AUTHOR, item.id);
            history.push('/books');
          }}>{item.pseudonym}</a>{index !== authors.length - 1 && ','} </Fragment>
        ))}
      </div>
      {reviews.avgRating > 0 && <Rate disabled style={{ fontSize: 13 }} allowHalf value={reviews.avgRating}></Rate>}
      <div className="des-view ng-binding">
        <div className="product__info__main">
          <div className="product__overview">
            <div className="product_overview_content" style={{ height: 200 }} dangerouslySetInnerHTML={{ __html: description }}></div>
            <div className="fade-footer"><NavLink to={`/book/${id}`} className="read-more text-primary font-weight-bold">Xem thêm</NavLink></div></div>
        </div>
      </div>
      <div className="p-view">
        <span className="real-price ng-binding"><NumberFormat value={discountedPrice} displayType={'text'}
          suffix="đ" thousandSeparator={true} /></span> &nbsp;&nbsp;
      {discountRate > 0 && <span className="price ng-binding" ng-show="productItem.DiscountPercent>0">
          <NumberFormat value={basePrice} displayType={'text'}
            suffix="đ" thousandSeparator={true} /></span>}
        {discountRate > 0 && <div className="discount-percent" ng-show="productItem.DiscountPercent>0">
          <label> Giảm giá </label>
          <span className="ng-binding"><NumberFormat suffix="%" thousandSeparator={true} value={discountRate * 100} /> </span>
        </div>}
        <div className="clearfix" />
      </div>
      {/* <div className="gift-view ng-hide" ng-show="productItem.HasGift">
      <div className="l">
        <i className="fa fa-2x fa-gift" />
      </div>
      <div className="r ng-binding">
      </div>
      <div className="clearfix" />
    </div> */}
      <div className="vloader express-loading" style={{ display: 'none' }} />
      <form className="ng-pristine ng-valid" onSubmit={(e) => {
        e.preventDefault();
        addSingleItemToCart(props.book, 1)
      }} >
        <Button loading={cart.adding} htmlType="submit" className="btn-buy btn btn-bb add-to-cart">THÊM VÀO GIỎ HÀNG</Button>
        {/* <div className="pre-box ng-hide" ng-show="productItem.IsNotPublished && productItem.QuantityRemain==null && !productItem.IsOutOff">
        <small className="ng-binding">Sách này sắp phát hành </small>
        <br />
        <input type="submit" className="btn-pre btn btn-primary buy-now" defaultValue="Đặt hàng trước" />
      </div> */}
        {/* <div className="request-box ng-hide" ng-show="productItem.IsOutOff ">
        <small>Hàng này không còn </small>
        <br />
        <a className="btn btn-request btn-danger">
          <i className="fa fa-bullhorn" /> Báo tôi khi có hàng
        </a>
      </div> */}
      </form>
      <form action="/BookBuy/AddToFavorite" data-ajax-begin="AddToFavBegin" data-ajax-success="AddToFavSuccess" data-ajax="true" method="post" className="ng-pristine ng-valid">
        <input type="hidden" name="productid" className="productid" defaultValue={105165} />
        <a className="btn btn-default btn-fav"
          onClick={() => {
            if (tokenValid) {
              addBookToWishList({
                variables: {
                  bookId: id
                }
              })
            } else {
              history.push('/auth/login', {
                from: history.location.pathname
              });
            }
          }}>
          <i className="fa fa-heart" />
          Thêm vào yêu thích
      </a>
      </form>
    </div>
  </div>)
  return (
    <Popover content={productDialog} placement="left"> <div className="product product__style--3" style={{ width }}>
      <div className="col-12">
        {/* <div className="product__thumb" style={{height: 380}}> */}
        <div className="product__thumb" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: thumbHeight }}>
          <NavLink className="first__img" to={`/book/${id}`}><img src={thumbnail} alt="product image" /></NavLink>
          {/* <a className="second__img animation1" href="single-product.html"><img src={thumbnail} alt="product image" /></a> */}
          {discountRate > 0 && <div className="hot__box">
            <span className="hot-label"><NumberFormat value={discountRate * 100} displayType={'text'}
              suffix="%" prefix="-" thousandSeparator={true} /></span>
          </div>}
        </div>
        <div className="product__content content--center">
          <h4><NavLink to={`/book/${id}`}>{title}</NavLink></h4>
          {availableCopies > 0 && <ul className="prize d-flex">
            <li><NumberFormat value={discountedPrice} displayType={'text'}
              suffix="đ" thousandSeparator={true} /></li>
            {discountRate > 0 && <li className="old_prize"><NumberFormat value={basePrice} displayType={'text'}
              suffix="đ" thousandSeparator={true} /></li>}
          </ul>}
          {
            availableCopies <= 0 && <ul className="prize d-flex">
              <li>Hết hàng</li></ul>
          }
          <div className="action">
            <div className="actions_inner">
              <ul className="add_to_links">
                <li><a className="cart" title="Thêm vào giỏ hàng" onClick={() => addSingleItemToCart(props.book, 1)}><i className="bi bi-shopping-cart-full" /></a></li>
                <li><a className="wishlist" onClick={() => addBookToWishList({
                  variables: {
                    bookId: id
                  }
                })} title="Thêm vào yêu thích"><i className="bi bi-heart-beat" /></a></li>
              </ul>
            </div>
          </div>
          {/* <div className="product__hover--content">
            <ul className="rating d-flex">
              <li className="on"><i className="fa fa-star-o" /></li>
              <li className="on"><i className="fa fa-star-o" /></li>
              <li className="on"><i className="fa fa-star-o" /></li>
              <li><i className="fa fa-star-o" /></li>
              <li><i className="fa fa-star-o" /></li>
            </ul>
          </div> */}
        </div>
      </div>
    </div></Popover>)
}

const mapStateToProps = state => {
  return {
    cart: state.cart
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeFilter: (type, value) => {
      dispatch(changeFilter(type, value));
    },
    addSingleItemToCart: (item, qty) => {
      dispatch(addSingleItemToCartAysnc(ownProps.client, item, qty));
    }
  }
}

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(ProductItem));