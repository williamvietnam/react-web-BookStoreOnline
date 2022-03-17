import React, { useState, useEffect, Fragment } from 'react';
import { Steps, Button, message } from 'antd';
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';
import CheckoutLoginStep from './CheckoutLogin';
import { connect } from 'react-redux';
import isTokenValid from '../../utils/tokenValidation';
import CheckoutAddress from './CheckoutAddress';
import CheckoutPayment from './CheckoutPayment';
import { Redirect, NavLink } from 'react-router-dom';

const { Step } = Steps;

const steps = [
    {
        title: 'Đăng nhập',
        content: (props) => <CheckoutLoginStep {...props} />,
    },
    {
        title: 'Địa chỉ giao hàng',
        content: (props) => <CheckoutAddress {...props} />,
    },
    {
        title: 'Thanh toán',
        content: (props) => <CheckoutPayment {...props} />,
    },
];

function CheckoutPage(props) {

    const { auth, cart } = props;

    const tokenValid = isTokenValid(auth.token);

    const [current, setCurrent] = useState(tokenValid ? 1 : 0);

    const [orderInfo, setOrderInfo] = useState({
        orderAddress: {

        },
        paymentMethod: "COD",
        shippingMethod: "STD_DELIVERY",
        orderItems: cart.items,
        cartSubTotal: cart.cartSubTotal
    })

    useEffect(() => {
        if (tokenValid) {
            setCurrent(1);
        }
    }, [tokenValid]);

    useEffect(()=>{
        if (document.querySelector('.scroll-anchor')){
            document.querySelector('.scroll-anchor').scrollIntoView({});
        }
    },[])

    const next = () => {
        setCurrent(prev => prev + 1)
    }

    const prev = () => {
        setCurrent(prev => prev - 1)
    }

    if (cart.items.length === 0) {
        window.alert("Bạn không có sản phẩm nào trong giỏ hàng.");
        return (<Redirect to="/books" />)
    }

    return (
        <Fragment>
            <div className="ht__bradcaump__area bg-image--5" style={{ maxHeight: 300 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="bradcaump__inner text-center">
                                <h2 className="bradcaump-title">Thanh toán</h2>
                                <nav className="bradcaump-content">
                                    <NavLink className="breadcrumb_item" to="/">Trang chủ</NavLink>
                                    <span className="brd-separetor">/</span>
                                    <span className="breadcrumb_item active">Thanh toán</span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="scroll-anchor"></div>
            <div className="container m-t-100" style={{ padding: '20px 0' }}>
                <div className="row">
                    <div className="col-12">
                        <div style={{ maxWidth: '75%', margin: 'auto' }}>
                            <Steps style={{ color: 'red' }} labelPlacement="vertical" size="small" current={current}>
                                {steps.map(item => (
                                    <Step key={item.title} title={item.title} />
                                ))}
                            </Steps>
                        </div>
                        <br></br>
                        <div className="steps-content">{steps[current].content({ next, prev, setOrderInfo, orderInfo })}</div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        cart: state.cart
    }
}

export default connect(mapStateToProps, null)(CheckoutPage);