import React from 'react';
import { NavLink } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { Input } from 'antd';
import { connect } from 'react-redux';
import { addSingleItemToCartAysnc, changeCartItemQtyAsync } from '../../../redux/actions/cartAction';
import { withApollo } from '@apollo/react-hoc';
import { calculateDiscount } from '../../../utils/common';

function CartPageItem(props) {

    const { book, changeCartItemQty, removeItemFromCart} = props;
    const {discountedPrice} =  book.discounts;

    return (
        <div className="row shopping-cart-item p-b-8 m-b-8" style={{ flexWrap: 'nowrap', borderBottom: '1px solid #ccc' }}>
            <div className="col-md-2 img-thumnail-custom">
                <p className="image">
                    <img className="img-responsive" src={book.thumbnail} />
                </p>
            </div>
            <div className="col-md-10">
                <div className="row">
                    <div className="col-12 col-md-9">
                        <p className="font-weight-bold fs-15">
                            <NavLink to="/">
                                {book.title}
                            </NavLink>
                        </p>
                        <p className="cart-item-price">
                            <span className="font-weight-bold">
                                <NumberFormat value={discountedPrice} displayType={'text'}
                                    suffix="đ" thousandSeparator={true} />
                            </span>
                        </p>
                        <p className="fs-12">
                            <a onClick={removeItemFromCart} className="text-primary">
                                Xóa
                            </a>
                        </p>
                    </div>
                    <div className="col-12 col-md-3">
                        <Input value={book.qty}
                            onChange={(e) => {
                                let value = Math.abs(parseInt(e.target.value));
                                if (value !== book.qty) {
                                    changeCartItemQty(book, value);
                                }
                            }}
                            style={{
                                width: 100
                            }} type="number" />
                    </div>
                </div>
            </div>
        </div>
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
        changeCartItemQty: (item, qty) => {
            dispatch(changeCartItemQtyAsync(ownProps.client, item, qty));
        },
    }
}

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(CartPageItem));
