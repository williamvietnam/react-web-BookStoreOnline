import React, { Fragment } from 'react';
import { Card, Button, Empty } from 'antd';

import { connect } from 'react-redux';
import { withApollo } from '@apollo/react-hoc';
import { addSingleItemToCartAysnc, removeItemFromCartSuccessfully } from '../../../redux/actions/cartAction';
import CartPageItem from './CartPageItem';
import NumberFormat from 'react-number-format';
import { NO_ITEM_IN_CART } from '../../../constants';
import { NavLink } from 'react-router-dom';

function CartPage(props) {
    const { cart, removeItemFromCart } = props;
    return (
        <Fragment>
            <div className="ht__bradcaump__area bg-image--4" style={{maxHeight: 300}}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="bradcaump__inner text-center">
                                <h2 className="bradcaump-title">Giỏ hàng</h2>
                                <nav className="bradcaump-content">
                                    <NavLink className="breadcrumb_item" to="/">Trang chủ</NavLink>
                                    <span className="brd-separetor">/</span>
                                    <span className="breadcrumb_item active">Giỏ hàng</span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container m-t-20 p-b-20 p-t-20" style={{minHeight: 400}}>
                {cart.items && cart.items.length ?
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <Card>
                                {cart.items.map(item => (
                                    <CartPageItem book={item} removeItemFromCart={() => removeItemFromCart(item.id)} key={item.id} />
                                ))}
                            </Card>
                        </div>
                        <div className="col-12 col-md-4">
                            <Card>
                                <div className="d-flex m-b-20" style={{ justifyContent: 'space-between' }}><span>Tạm tính:</span>
                                    <NumberFormat value={cart.cartSubTotal} displayType={'text'}
                                        suffix="đ" thousandSeparator={true} /></div>
                                <hr />
                                <div className="d-flex m-t-20" style={{ justifyContent: 'space-between' }}><span>Thành tiền:</span>
                                    <h5 style={{ color: 'red' }}><NumberFormat value={cart.cartSubTotal} displayType={'text'}
                                        suffix="đ" thousandSeparator={true} /></h5></div>
                            </Card>
                            <NavLink to={'/checkout'} className="cart_page_checkout__btn">TIẾN HÀNH ĐẶT HÀNG</NavLink>
                        </div>
                    </div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={NO_ITEM_IN_CART} />}
            </div >
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        cart: state.cart
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addSingleItemToCart: (item, qty) => {
            dispatch(addSingleItemToCartAysnc(ownProps.client, item, qty));
        },
        removeItemFromCart: (itemId) => {
            dispatch(removeItemFromCartSuccessfully(itemId));
        }
    }
}

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(CartPage));