import React from 'react';
import { Steps, message, Button } from 'antd';
import { getOrderStatusText } from '../../../utils/common';
import './order-step.css';
import { useParams, NavLink } from 'react-router-dom';
import { GET_ORDER_BY_ID } from '../../../api/orderApi';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

const { Step } = Steps;

function getStepOrder(orderStatus) {
    switch (orderStatus) {
        case "Ordered":
            return 0;
        case "Processing":
            return 1;
        case "GettingProduct":
            return 2;
        case "Packaged":
            return 3;
        case "HandOver":
            return 4;
        case "Shipping":
            return 5;
        case "Completed":
            return 6;
    }
}

function OrderStatus(props) {

    const { orderId } = useParams();
    const { loading, data = { getOrderById: {} }, refetchData } = useQuery(GET_ORDER_BY_ID, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        fetchPolicy: 'cache-and-network',
        variables: {
            id: orderId
        }
    });
    const { createdAt, orderStatus, orderSteps=[], orderNumber } = data.getOrderById;
    const position = getStepOrder(orderStatus);

    return (
        <div style={{ flex: 2, padding: '0 0 0 0' }}>
            <div className="d-flex justify-content-between"><h5 style={{ fontWeight: 300 }}>Theo dõi đơn hàng #{orderNumber}<b></b></h5>
                <NavLink to={`/auth/account/order/${orderId}`}><Button type="primary">Chi tiết đơn hàng</Button></NavLink>
            </div>
            {/* <p className="fs-12"><i>Ngày đặt hàng: {moment(createdAt).format(DATE_TIME_VN_24H)}</i></p> */}
            <br />
            <div className="d-flex" >
                <div className=" p-l-20 p-r-20" style={{flex: 1}}>
                    <div>Trạng thái hiện tại: <b>{getOrderStatusText(orderStatus)}</b></div>
                    <br />
                    <Steps size="small" direction="vertical" className="order-status-steps" progressDot current={getStepOrder(orderStatus)}>
                        <Step description="Đặt hàng thành công" />
                        <Step description="Đang xử lý" />
                        <Step description="Đang lấy hàng" />
                        <Step description="Đóng gói" />
                        <Step description="Bàn giao vận chuyển" />
                        <Step description="Đang vận chuyển" />
                        <Step description="Giao hàng thành công" />
                    </Steps>
                </div>
                <div className="p-l-20" style={{borderLeft: '1px solid #ccc',flex: 1}}>
                    <h6>Chi tiết trạng thái</h6>
                    <br />
                    {orderSteps.map((item,index) => (<div key={item.id}>
                        <div className="d-flex justify-content-between p-t-8 p-b-8" >
                            <p>{moment(item.createdAt).format("HH:mm DD/MM/YYYY")}</p>
                            <p><b>{getOrderStatusText(item.orderStatus)}</b></p>
                        </div>
                        <hr />
                    </div>))}
                </div>
            </div>
            
        </div>)

}

export default OrderStatus;