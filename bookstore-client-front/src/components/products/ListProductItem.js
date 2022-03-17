import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { useMutation } from '@apollo/react-hooks';
import { ADD_BOOK_TO_WISH_LIST } from '../../api/bookApi';
import { message } from 'antd';
import isTokenValid from '../../utils/tokenValidation';

function ListProductItem(props) {
  const { id, thumbnail, basePrice, title } = props.book;
  const { width, thumbHeight } = props;
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
  return (
    <div className="list__view">
      <div className="thumb" style={{ height: thumbHeight }}>
        <NavLink className="first__img" to={`/book/${id}`}><img src={thumbnail} alt="product images" /></NavLink>
        {/*<NavLink className="second__img animation1" to={`/book/${id}`}><img src="images/product/2.jpg" alt="product images" /></NavLink>*/}
      </div>
      <div className="content">
        <h2><NavLink to={"single-product.html"}>{title}</NavLink></h2>
        <ul className="rating d-flex">
          <li className="on"><i className="fa fa-star-o" /></li>
          <li className="on"><i className="fa fa-star-o" /></li>
          <li className="on"><i className="fa fa-star-o" /></li>
          <li className="on"><i className="fa fa-star-o" /></li>
          <li><i className="fa fa-star-o" /></li>
          <li><i className="fa fa-star-o" /></li>
        </ul>
        <ul className="prize__box">
          <li> <NumberFormat value={basePrice} displayType={'text'}
            suffix="đ" thousandSeparator={true} /> </li>
          <li className="old__prize"><NumberFormat value={basePrice} displayType={'text'}
            suffix="đ" thousandSeparator={true} /></li>
        </ul>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor. Donec non est at libero vulputate rutrum. Morbi ornare lectus quis justo gravida semper. Nulla tellus mi, vulputate adipiscing cursus eu, suscipit id nulla.</p>
        <ul className="cart__action d-flex">
          <li className="cart"><a href="cart.html">Add to cart</a></li>
          <li className="wishlist"
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
          }}><a /></li>
        </ul>
      </div>
    </div>
  )
}

export default ListProductItem;