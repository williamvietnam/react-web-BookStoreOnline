import React, { Fragment } from 'react';
import { Button, Radio, message } from 'antd';
import { NavLink, useHistory } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_ORDER } from '../../api/orderApi';
import { resetCart } from '../../redux/actions/cartAction';
import { connect } from 'react-redux';
import { calculateDiscount } from '../../utils/common';

const { Group: RadioGroup } = Radio;

function CheckoutPayment(props) {
    const { orderInfo, setOrderInfo,prev,resetCart } = props;
    const { orderAddress, orderItems, cartSubTotal,paymentMethod,shippingMethod } = orderInfo;
    const { address, ward, district, province, fullName, phone } = orderAddress;
    const fullAddress = `${address}, ${ward.name}, ${district.name}, ${province.name}`;
    const history = useHistory();
    const [createOrder, {loading, data}] = useMutation(CREATE_ORDER, {
        onError(error){
            console.log(error.toString());
            message.error(error.toString())
        },
        onCompleted(data){
            message.success("Đặt hàng thành công");
            history.push(`/auth/account/order/${data.createOrder.id}`);
            resetCart();
        }
    });

    const onSubmit = e=>{
        e.preventDefault();
        createOrder({
            variables: {
                data: {
                    shippingMethod,
                    paymentMethod,
                    shippingAddress: orderAddress.id,
                    items: orderItems.map(item=>({
                        book: item.id,
                        quantity: item.qty
                    }))
                }
            }
        });
    }

    return (
        <div className="container m-t-20 p-b-20 p-t-20" >
            <div className="row m-b-20">
                <form className="col-12 col-md-8 m-b-20" onSubmit={onSubmit}>
                    <div>
                        <h5 className="m-b-12">1. Chọn hình thức giao hàng</h5>
                        <div className="card">
                            <div className="card-body">
                                <RadioGroup onChange={(e)=>{setOrderInfo(prev=>({...prev,shippingMethod: e.target.value}))}} value={shippingMethod}>
                                    <Radio value="STD_DELIVERY">Giao hàng tiêu chuẩn</Radio>
                                    <Radio value="FAST_DELIVERY">Giao hàng nhanh trong 4h (Phí vận chuyển 16,000VNĐ)</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div>
                        <h5 className="m-b-12">2. Chọn hình thức thanh toán</h5>
                        <div className="card">
                            <div className="card-body">
                                <RadioGroup value={paymentMethod}>
                                    <Radio value="COD">Thanh toán tiền mặt khi nhận hàng </Radio>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                    <br />
                    <Button loading={loading} htmlType="submit" style={{ width: '50%' }} size="large" type="danger">ĐẶT MUA</Button>
                    <div className="fs-12 m-t-6">(Xin vui lòng kiểm tra kĩ lại thông tin đơn hàng trước khi Đặt Mua)</div>
                </form>
                <div className="col-12 col-md-4">
                    <h5 className="m-b-12" style={{ visibility: "hidden" }}>Thông tin đơn hàng</h5>
                    <div className="card card-delivery-addr">
                        <div className="card-header">   
                        <div className="d-flex" style={{ justifyContent: 'space-between' }}>
                                <span>Địa chỉ giao hàng</span>
                                <Button size="small" onClick={prev} type="default">Sửa</Button>
                            </div></div>
                        <div className="card-body">
                            <h6 className="name  m-b-6">{fullName}</h6>
                            <p className="address fs-13" title={fullAddress}>
                                Địa chỉ: {fullAddress}         </p>
                            <p className="address fs-13">Việt Nam</p>
                            <p className="phone fs-13">Điện thoại: {phone}</p>
                        </div>
                    </div>
                    <br></br>
                    <div className="card card-order">
                        <div className="card-header">
                            <div className="d-flex" style={{ justifyContent: 'space-between' }}>
                                <span>Đơn hàng ({orderItems.length} sản phẩm)</span>
                                <NavLink to="/checkout/cart"><Button size="small" type="default">Sửa</Button></NavLink>
                            </div>
                        </div>
                        <div className="card-body">
                            {orderItems.map(item =>{
                                const {discountedPrice} = item.discounts;
                                return (
                                <div key={item.id} className="d-flex fs-11" style={{
                                    justifyContent: 'space-between', paddingBottom: 8,
                                    borderBottom: '1px solid rgba(0,0,0,.125)'
                                }}>
                                    <div style={{ maxWidth: "80%" }}>{item.qty} x <NavLink className="text-primary" to={"/book/" + item.id}>{item.title}</NavLink></div>
                                    <NumberFormat value={item.qty * discountedPrice} displayType={'text'}
                                        suffix="đ" thousandSeparator={true} />
                                </div>
                            )})}
                            <div className="m-t-8 fs-11 p-b-8" style={{
                                borderBottom: '2px solid #000'
                            }}>
                                <div className="d-flex" style={{
                                    justifyContent: 'space-between',
                                }}>
                                    <p className="fs-11">Tạm tính</p>
                                    <NumberFormat value={cartSubTotal} displayType={'text'}
                                        suffix="đ" thousandSeparator={true} />
                                </div>
                                <div className="d-flex" style={{
                                    justifyContent: 'space-between',
                                }}>
                                    <p className="fs-11">Phí vận chuyển</p>
                                    <NumberFormat value={shippingMethod==="FAST_DELIVERY"?16000:0} displayType={'text'}
                                        suffix="đ" thousandSeparator={true} />
                                </div>
                            </div>
                            <div className="m-t-8">
                                <div className="d-flex" style={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <h6 className="fs-11">Thành tiền: </h6>
                                    <NumberFormat style={{ fontSize: 19, color: 'red', fontWeight: 600 }} value={cartSubTotal+(shippingMethod==="FAST_DELIVERY"?16000:0)} displayType={'text'}
                                        suffix="đ" thousandSeparator={true} />
                                </div>
                                <div className="d-flex fs-12" style={{
                                    justifyContent: 'flex-end'
                                }}>
                                    <i>(Đã bao gồm VAT nếu có)</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

const mapDispatchToProps = dispatch=>{
    return{
        resetCart: ()=>{
            dispatch(resetCart());
        }
    }
}

export default connect(null,mapDispatchToProps)(CheckoutPayment);