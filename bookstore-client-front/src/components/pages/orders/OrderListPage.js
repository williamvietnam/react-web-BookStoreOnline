import React, { Fragment, useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { message, Table, Empty, Tag } from 'antd';
import { GET_ORDERS } from '../../../api/orderApi';
import { DATE_TIME_VN_24H, DATE_VN } from '../../../constants';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { getOrderStatusText } from '../../../utils/common';
import { NavLink } from 'react-router-dom';

const columns = [
    {
        title: <b>Mã đơn hàng</b>,
        dataIndex: 'orderNumber',
        key: 'orderNumber',
    },
    {
        title: <b>Ngày đặt hàng</b>,
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: <b>Sản phẩm</b>,
        dataIndex: 'items',
        key: 'items',
    },
    {
        title: <b>Tổng tiền</b>,
        dataIndex: 'grandTotal',
        key: 'grandTotal',
    },
    {
        title: <b>Trạng thái đơn hàng</b>,
        key: 'orderStatus',
        dataIndex: 'orderStatus',
        render: orderStatus => <Tag>{orderStatus}</Tag>
    }
];

function OrderList(props) {

    const [currentPage, setCurrentPage] = useState(1);

    const [getOrders, { error, loading, data = { getOrders: { orders: [], totalCount: 0 } } }] = useLazyQuery(GET_ORDERS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy thông tin đơn hàng, vui lòng thử lại sau.");
        },
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        getOrders({
            variables: {
                skip: (currentPage - 1) * 10,
                first: 10,
                orderBy: 'createdAt_DESC',
                selection: `{
                    id
                    orderNumber
                    items{
                        id
                        price
                        quantity
                        item{
                            id
                            title
                            thumbnail
                        }
                    }
                    grandTotal
                    recipientFullName
                    recipientPhone
                    recipientWard{
                         id
                         name
                    }
                     recipientDistrict{
                         id
                         name
                     }
                     recipientProvince{
                         id
                         name
                     }
                     recipientAddress
                    paymentMethod{
                        id
                        name
                    }
                    shippingMethod{
                        id
                        name
                    }
                    orderStatus
                    paymentStatus
                    createdAt
                }`
            }
        })
    }, [currentPage]);

    const mapDataToTable = (orders) => {
        if (orders.length === 0) return [];
        return orders.map(item => {
            return {
                key: item.id,
                orderNumber: <NavLink className="text-primary" to={`/auth/account/order/${item.id}`}>{item.orderNumber}</NavLink>,
                orderStatus: getOrderStatusText(item.orderStatus),
                createdAt: moment(item.createdAt).format(DATE_VN),
                grandTotal: <NumberFormat value={item.grandTotal} displayType={'text'}
                    suffix="đ" thousandSeparator={true} />,
                items: <Fragment>{item.items.map(orderItem => <div key={orderItem.id}>{orderItem.item?orderItem.item.title:'(Sản phẩm không tồn tại)'}</div>)}</Fragment>
            }
        });
    }

    return (
        <div className="d-flex w-100" >
            <div className="w-100">
                <h4>Đơn hàng của tôi</h4>
                <br />
                <Table loading={loading} columns={columns} size="middle" 
                    pagination={{
                        pageSize: 10,
                        total: data.getOrders.totalCount,
                        onChange(page) {
                            setCurrentPage(page)
                        }
                    }}
                    dataSource={mapDataToTable(data.getOrders.orders)} locale={{
                        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Bạn không có đơn hàng nào" />
                    }}>

                </Table>
            </div>
        </div>
    )
}

export default OrderList;