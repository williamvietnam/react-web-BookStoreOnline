import React, { useEffect } from 'react';
import { message, Table, Button, Tag } from 'antd';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import NumberFormat from 'react-number-format';
import { NavLink } from 'react-router-dom';
import { GET_ORDERS } from '../../api/orderApi';
import { getOrderStatusText, getOrderStatusColor } from '../../utils/common';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../constants';

function OrderList(props) {
    const { selectedRowKeys, setSelectedRowKeys, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage
        , orderBy, setOrderBy, searchValues, canRefetch, setCanRefetch, setSearchValues, renderSort, getColumnSearchProps,
        filterDropdownCustom } = props;


    const { loading, data = { getOrders: { orders: [] } }, refetch } = useQuery(GET_ORDERS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            where: {
                OR: searchValues.orderStatus && searchValues.orderStatus.length ?
                    searchValues.orderStatus.map(os => ({ orderStatus: os }))
                    : undefined,
                OR: searchValues.paymentStatus && searchValues.paymentStatus.length ?
                    searchValues.paymentStatus.map(ps => ({ paymentStatus: ps }))
                    : undefined,
            },
            orderBy,
            first: rowsPerPage,
            skip: (currentPage - 1) * rowsPerPage,
            selection: `
                {
                    id
                    orderNumber
                    subTotal
                    grandTotal
                    recipientFullName
                    recipientPhone
                    paymentMethod{
                        id
                        name
                    }
                    shippingMethod{
                        id
                        name
                    }
                    customer{
                        id
                        email
                    }
                    orderStatus
                    paymentStatus
                    createdAt
                    updatedAt
                }
            `
        }
    });

    useEffect(() => {
        if (canRefetch) {
            refetch();
            setCanRefetch(false);
        }
    }, [canRefetch]);

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
        },
        {
            title: <div className="d-flex">
                <span className="m-r-12">Trạng thái đơn hàng</span>
                {/* <div className="d-flex" style={{flexDirection: 'column'}}>
                    <i className="fa fa-sort-asc"></i>
                    <i className="fa fa-sort-desc"></i>
                </div> */}
            </div>,
            dataIndex: 'orderStatus',
            ellipsis: true,
            colSpan: 1,
            key: 'orderStatus',
            render: (orderStatus) => {
                return {
                    children: orderStatus,
                    props: {
                        colSpan: 1
                    }
                }
            },
            filters: [{
                text: "Đặt hàng thành công",
                value: "Ordered"
            }, {
                text: "Đang xử lý",
                value: "Processing"
            }, {
                text: "Giao hàng thành công",
                value: "Completed"
            }, {
                text: "Đã hủy",
                value: "Canceled"
            }],
            filterDropdown: filterDropdownCustom('orderStatus', undefined, undefined, false)
        },
        // {
        //     title: <div className="d-flex">
        //         <span className="m-r-12">Trạng thái thanh toán</span>
        //         {/* <div className="d-flex" style={{flexDirection: 'column'}}>
        //             <i className="fa fa-sort-asc"></i>
        //             <i className="fa fa-sort-desc"></i>
        //         </div> */}
        //     </div>,
        //     dataIndex: 'paymentStatus',
        //     ellipsis: true,
        //     colSpan: 1,
        //     key: 'paymentStatus',
        //     render: (paymentStatus) => {
        //         return {
        //             children: paymentStatus,
        //             props: {
        //                 colSpan: 1
        //             }
        //         }
        //     },
        //     filters: [{
        //         text: "Đã thanh toán",
        //         value: true
        //     }, {
        //         text: "Chưa thanh toán",
        //         value: false
        //     }],
        //     filterDropdown: filterDropdownCustom('paymentStatus', undefined, undefined, false)
        // },
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'grandTotal',
            key: 'grandTotal',
            ...renderSort('grandTotal')
        }, {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            ...renderSort('createdAt')
        }];
    const createDataSource = (orders) => {
        if (!orders) return [];
        return orders.map((item, index) => {
            return {
                ...item,
                orderNumber: <NavLink to={`/sale/order/edit/${item.id}`}>{item.orderNumber}</NavLink>,
                key: item.id,
                createdAt: moment(item.createdAt).format(DATE_TIME_VN_24H),
                customer: <NavLink to={`/users/edit/${item.customer.id}`}>{item.customer.email}</NavLink>,
                grandTotal: <NumberFormat value={item.grandTotal} displayType={'text'}
                    suffix="đ" thousandSeparator={true} />,
                orderStatus: <Tag color={getOrderStatusColor(item.orderStatus)}> {getOrderStatusText(item.orderStatus)}</Tag>,
                // paymentStatus: <Tag color={item.paymentStatus ? "#87d068" : "#f50"}> {item.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}</Tag>,
            }
        })
    }

    return (
        <Table columns={columns} loading={loading}
            rowSelection={{
                selectedRowKeys,
                onChange(keys) {
                    setSelectedRowKeys(keys);
                }
            }}
            scroll={{ x: 1200 }}
            bordered={true}
            pagination={{
                pageSize: rowsPerPage,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total) =>
                    `Hiển thị ${(currentPage - 1) * rowsPerPage + 1} - ${currentPage * rowsPerPage <= data.getOrders.totalCount ? currentPage * rowsPerPage : data.getOrders.totalCount} trên ${data.getOrders.totalCount} kết quả`,
                showSizeChanger: true,
                onShowSizeChange(current, size) { this.current = 1; setRowsPerPage(size) },
                total: data.getOrders.totalCount,
                onChange: (page) => { setCurrentPage(page) }
            }}
            dataSource={createDataSource(data.getOrders.orders)} />

    )

}

export default OrderList;