import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ORDER_BY_ID, UPDATE_ORDER_STATUS } from '../../../api/orderApi';
import { message, Table, Empty, Button, Popconfirm } from 'antd';
import { getOrderStatusText } from '../../../utils/common';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../../constants';

const columns = [
    {
        title: <b>Sản phẩm</b>,
        dataIndex: 'product',
        key: 'product',
        width: '60%',
        render: product => product?<NavLink to={`/book/${product.id}`}>{product.title}</NavLink>:<div>(Sản phẩm không tồn tại)</div>,
    },
    {
        title: <b>Giá</b>,
        dataIndex: 'price',
        key: 'price',
        render: price => <NumberFormat value={price} displayType={'text'}
            suffix="đ" thousandSeparator={true} />
    },
    {
        title: <b>Số lượng</b>,
        dataIndex: 'quantity',
        key: 'quantity',
    }
];

function OrderDetail(props) {

    const params = useParams();

    const { orderId } = params;
    const { error, loading, data = {}, refetch } = useQuery(GET_ORDER_BY_ID, {
        onError(error) {
            message.error(error.toString());
        },
        variables: {
            id: orderId
        }
    })

    const [updateOrderStatus, { error: errorUpdatingOrderStatus, loading: updatingOrderStatus }] = useMutation(UPDATE_ORDER_STATUS, {
        onError(error) {
            message.error("Có lỗi xảy ra, vui lòng thử lại sau");
        },
        onCompleted() {
            message.success("Cập nhật trạng thái đơn hàng thành công");
            refetch();
        }
    });

    if (loading) {

    }
    if (error) {

    }
    console.log(data)
    const order = data.getOrderById ? data.getOrderById : {};
    const {  recipientDistrict: district= {}, recipientWard: ward = {},orderNumber, recipientProvince: province = {} ,
        recipientAddress: address, recipientPhone: phone, recipientFullName: fullName,
        shippingMethod = {}, paymentMethod = {}, orderStatus, id, createdAt,
        items = [{ item: {} }], grandTotal, subTotal } = order;
    const fullAddress = `${address}, ${ward.name}, ${district.name}, ${province.name}`;
    const mapDataToTable = (orderItems) => {
        return orderItems.map(orderItem => {
            return {
                key: orderItem.id,
                product: orderItem.item?{
                    title: orderItem.item.title,
                    id: orderItem.item.id
                }:null,
                price: orderItem.price,
                quantity: orderItem.quantity,

            }
        })
    }
    return (
        <div style={{ flex: 2, padding: '0 0 0 0' }}>
            <h5 style={{ fontWeight: 300 }}>Chi tiết đơn hàng #{orderNumber} - <b>{getOrderStatusText(orderStatus)}</b></h5>
            <p className="fs-12"><i>Ngày đặt hàng: {moment(createdAt).format(DATE_TIME_VN_24H)}</i></p>
            <NavLink to={`/auth/account/order/tracking/${id}`}><Button style={{marginTop: 6, marginBottom: 36}} type="primary"> Theo dõi đơn hàng</Button></NavLink>

            <div className="row">
                <div className="col-12 col-md-4">
                    <div className="card" style={{ height: "100%" }}>
                        <div className="card-header">Địa chỉ giao hàng</div>
                        <div className="card-body">
                            <h6 className="name  m-b-6">{fullName}</h6>
                            <p className="address fs-13" title={fullAddress}>
                                Địa chỉ: {fullAddress}         </p>
                            <p className="address fs-13">Việt Nam</p>
                            <p className="phone fs-13">Điện thoại: {phone}</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4" >
                    <div className="card" style={{ height: "100%" }}>
                        <div className="card-header">Hình thức vận chuyển</div>
                        <div className="card-body">
                            <p>{shippingMethod.name}</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card" style={{ height: "100%" }}>
                        <div className="card-header">Hình thức thanh toán</div>
                        <div className="card-body">
                            <p>{paymentMethod.name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-12 col-md-12">
                    <Table loading={loading} columns={columns} size="middle" scroll pagination={false}
                        dataSource={mapDataToTable(items)}
                        locale={{
                            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Đơn hàng không có sản phẩm nào." />
                        }}>
                    </Table>
                </div>
            </div>
            <br />
            <div className="row" style={{ justifyContent: 'flex-end' }}>
                <div className="col-12 col-md-5">
                    <div className="d-flex w-100 m-b-8" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <p>Tạm tính</p>
                        <NumberFormat value={subTotal} displayType={'text'}
                            suffix="đ" thousandSeparator={true} />
                    </div>
                    <div className="d-flex w-100 m-b-8" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <p>Phí vận chuyển</p>
                        <NumberFormat value={shippingMethod.id==="FAST_DELIVERY"?16000:0} displayType={'text'}
                            suffix="đ" thousandSeparator={true} />
                    </div>
                    <div className="d-flex w-100 m-b-8" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <p>Thành tiền</p>
                        <NumberFormat value={grandTotal} style={{ color: 'red', fontSize: 18, fontWeight: 600 }} displayType={'text'}
                            suffix="đ" thousandSeparator={true} />
                    </div>
                    {orderStatus !== "Completed" && orderStatus !== "Canceled" && <Popconfirm
                        title="Bạn có chắc muốn hủy đơn hàng này không?"
                        onConfirm={() => updateOrderStatus({
                            variables: {
                                orderId,
                                orderStatus: "Canceled"
                            }
                        })}
                        okText="Đồng ý"
                        cancelText="Không"
                    >
                        <Button loading={updatingOrderStatus}
                            type="danger" size="default">HỦY ĐƠN HÀNG</Button>
                    </Popconfirm>}
                </div>
            </div>
        </div>
    )

}

export default OrderDetail;