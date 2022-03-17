import React from 'react';
import './cart.css';
import MiniCartItem from './MiniCartItem';
import NumberFormat from 'react-number-format';
import { Empty } from 'antd';
import {NO_ITEM_IN_CART} from '../../constants';
import { NavLink } from 'react-router-dom';
import { removeItemFromCartSuccessfully } from '../../redux/actions/cartAction';
import {connect} from 'react-redux';

function MiniCart(props){
    const {cart,removeItemFromCart} = props;
    const {items,cartTotalQty,cartSubTotal} = cart;

    return (
           <div className="block-minicart minicart__active is-visible" style={{position: "relative"}}>
        <div className="minicart-content-wrapper">
          {/* <div className="micart__close" onClick={props.toggleCart}>
            <span>Đóng</span>
          </div> */}
          <div className="items-total d-flex justify-content-between">
            <span>{cartTotalQty} cuốn</span>
            <span>Tổng tiền</span>
          </div>
          <div className="total_amount text-right">
            <span><NumberFormat value={cartSubTotal} displayType={'text'}
                      suffix="đ" thousandSeparator={true} /></span>
          </div>
          <div className="mini_action checkout">
            <NavLink to="/checkout/cart" className="checkout__btn">Đến giỏ hàng</NavLink>
          </div>
          <div className="single__items">
            <div className="miniproduct">
              {items&&items.length?items.map(item=>(
                <MiniCartItem cartItem={item} removeItemFromCart={()=>removeItemFromCart(item.id)} key={item.id}/>
              )):<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={NO_ITEM_IN_CART}/>}
            </div>
          </div>
        </div>
      </div>
    )
}
const mapDispatchToProps = dispatch => {
  return {
    removeItemFromCart: (itemId) => {
      dispatch(removeItemFromCartSuccessfully(itemId));
    },
  }
}

export default connect(null, mapDispatchToProps)(MiniCart);