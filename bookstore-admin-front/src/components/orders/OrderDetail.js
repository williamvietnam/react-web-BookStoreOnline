import React, { useState, Fragment, useEffect } from 'react';
import { Collapse, Button, Form, Input, message, Drawer, Select, Table, Row, Col, Skeleton, Card, Steps } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useHistory, NavLink, useParams } from 'react-router-dom';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import useScroll from '../../custom-hooks/useScroll';
import NumberFormat from 'react-number-format';
import { GET_ORDER_BY_ID, UPDATE_ORDER_ADDRESS, UPDATE_ORDER_STATUS, UPDATE_PAYMENT_STATUS } from '../../api/orderApi';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../constants';
import { getOrderStatusText } from '../../utils/common';
import { GET_WARDS, GET_DISTRICTS, GET_PROVINCES } from '../../api/userAddressApi';
import TextArea from 'antd/lib/input/TextArea';
import './order-step.css';

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
const { Panel } = Collapse;
const { Option } = Select;
const { Step } = Steps;

function OrderDetail(props) {

    const { id } = useParams();

    const history = useHistory();
    const isScrolled = useScroll(62);
    const [orderUpdateInfo, setOrderUpdateInfo] = useState({
        orderStatus: '',
        paymentStatus: false,
        recipientWard: '',
        recipientDistrict: '',
        recipientProvince: '',
        recipientFullName: '',
        recipientPhone: '',
        recipientAddress: '',
        orderSteps: []
    });

    const [edittingAddress, setEdittingAddress] = useState(false);
    const [edittingOrderStatus, setEdittingOrderStatus] = useState(false);
    const [edittingPaymentStatus, setEdittingPaymentStatus] = useState(false);

    // const onInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setInputs(prev => {
    //         return {
    //             ...prev,
    //             [name]: value
    //         }
    //     })
    // }
    const handleInputChange = (e) => {
        const { target } = e;
        const { name, value } = target;
        setOrderUpdateInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }
    const { loading, error, data = {
        getOrderById: {
            customer: {},
            item: {},
            recipientProvince: {},
            recipientWard: {},
            recipientDistrict: {},
            paymentMethod: {},
            shippingMethod: {}
        }
    },
        refetch } = useQuery(GET_ORDER_BY_ID, {
            onError() {
                message.error("Có lỗi xảy ra khi lấy dữ liệu");
            },
            onCompleted(data) {
                const { getOrderById } = data;
                if (getOrderById) {
                    setOrderUpdateInfo({
                        orderStatus: getOrderById.orderStatus,
                        paymentStatus: getOrderById.paymentStatus,
                        recipientWard: getOrderById.recipientWard.id,
                        recipientDistrict: getOrderById.recipientDistrict.id,
                        recipientProvince: getOrderById.recipientProvince.id,
                        recipientFullName: getOrderById.recipientFullName,
                        recipientPhone: getOrderById.recipientPhone,
                        recipientAddress: getOrderById.recipientAddress,
                        orderSteps: getOrderById.orderSteps
                    });
                }
            },
            variables: {
                id
            }
        });

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
        },
        {
            title: <div className="d-flex">
                <span className="m-r-12">Tựa đề</span>
                {/* <div className="d-flex" style={{flexDirection: 'column'}}>
                    <i className="fa fa-sort-asc"></i>
                    <i className="fa fa-sort-desc"></i>
                </div> */}
            </div>,
            dataIndex: 'title',
            ellipsis: true,
            colSpan: 4,
            key: 'title',
            render: (title) => {
                return {
                    children: title,
                    props: {
                        colSpan: 4
                    }
                }
            },
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalItemPrice',
            key: 'totalItemPrice',
        }
    ];

    const createDataSource = (orderItems) => {
        if (!orderItems) return [];
        return orderItems.map((item, index) => {
            return {
                key: item.id,
                title: item.item?<NavLink to={`/catalog/book/edit/${item.item.id}`}>{item.item.title}</NavLink>:<span>(Sản phẩm không tồn tại)</span>,
                price: <NumberFormat value={item.price} displayType={'text'}
                    suffix="đ" thousandSeparator={true} />,
                totalItemPrice: <NumberFormat value={item.totalItemPrice} displayType={'text'}
                    suffix="đ" thousandSeparator={true} />,
                quantity: <NumberFormat value={item.quantity} displayType={'text'}
                    thousandSeparator={true} />,
                thumbnail: <img width="50" src={item.item?item.item.thumbnail:'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132484366.jpg'} />,
                discount: <NumberFormat value={item.discount} displayType={'text'}
                    suffix="đ" thousandSeparator={true} />
            }
        })
    }

    const { data: provinces = {}, loading: provinceLoading } = useQuery(GET_PROVINCES, {
        onError(error) {
            // message.error("")
            console.log(error)
        }
    });

    let [getDistricts, { loading: loadingDistricts, data: dataDistricts = {} }] = useLazyQuery(GET_DISTRICTS, {
        onError(error) {
            console.log(error)
        }
    })

    let [getWards, { loading: loadingWards, data: dataWards = {} }] = useLazyQuery(GET_WARDS, {
        onError(error) {
            console.log(error)
        }
    })

    useEffect(() => {
        if (orderUpdateInfo.recipientProvince)
            getDistricts({
                variables: {
                    provinceId: orderUpdateInfo.recipientProvince
                }
            })
        else {
            setOrderUpdateInfo(prev => ({
                ...prev,
                district: ''
            }))
        }
    }, [orderUpdateInfo.recipientProvince]);

    useEffect(() => {
        if (orderUpdateInfo.recipientDistrict)
            getWards({
                variables: {
                    districtId: orderUpdateInfo.recipientDistrict
                }
            })
        else {
            setOrderUpdateInfo(prev => ({
                ...prev,
                ward: ''
            }))
        }
    }, [orderUpdateInfo.recipientDistrict]);

    const [updateOrderAddress, { loading: updatingOrderAddress }] = useMutation(UPDATE_ORDER_ADDRESS, {
        onError() {
            console.log("Có lỗi xảy ra khi cập nhật địa chỉ giao hàng, vui lòng thử lại sau");
        },
        onCompleted() {
            message.success("Cập nhật thành công");
            refetch();
            setEdittingAddress(false);
        }
    });

    const [updateOrderStatus, { loading: updatingOrderStatus }] = useMutation(UPDATE_ORDER_STATUS, {
        onError() {
            console.log("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng, vui lòng thử lại sau");
        },
        onCompleted() {
            message.success("Cập nhật thành công");
            refetch();
            setEdittingOrderStatus(false);
        }
    });

    const [updatePaymentStatus, { loading: updatingPaymentStatus }] = useMutation(UPDATE_PAYMENT_STATUS, {
        onError() {
            console.log("Có lỗi xảy ra khi cập nhật trạng thái thanh toán, vui lòng thử lại sau");
        },
        onCompleted() {
            message.success("Cập nhật thành công");
            refetch();
            setEdittingPaymentStatus(false);
        }
    });

    return (
        <div className="content-wrapper">
            <div className={`content-header m-b-20`}>
                {loading ? <Skeleton active /> : <Fragment>
                    <h3>Chi tiết đơn hàng - {data.getOrderById.orderNumber}</h3>
                    {/* <div className="pull-right">
                    <Button type="primary"><SaveOutlined className="m-l-2" /> Lưu</Button>
                </div> */}
                </Fragment>}
            </div>
            <div className="content-body">
                <Collapse bordered defaultActiveKey={['1']}>
                    <Panel header={<span><i className="fa fa-info m-r-12"></i><b>Thông tin đơn hàng</b></span>} key="1" showArrow={false}>
                        {loading ? <Skeleton active /> :
                            <Row gutter={16}>
                                <Col span={12}>
                                    <div>
                                        <label>Mã đơn hàng: &nbsp;</label>
                                        <div className="m-l-16">{data.getOrderById.orderNumber}</div>
                                    </div>
                                    <div>
                                        <label>Ngày tạo: &nbsp;</label>
                                        <div className="m-l-16">{moment(data.getOrderById.createdAt).format(DATE_TIME_VN_24H)}</div>
                                    </div>
                                    <div>
                                        <label>Khách hàng: &nbsp;</label>
                                        <div className="m-l-16">
                                            <NavLink to={`/users/edit/${data.getOrderById.customer.id}`} >{data.getOrderById.customer.email}</NavLink>
                                        </div>
                                    </div>
                                    <div>
                                        <label>Trạng thái đơn hàng: &nbsp;</label>
                                        <div className="m-l-16">
                                            {edittingOrderStatus && <Select style={{ minWidth: 200 }} name="orderStatus"
                                                onChange={(val) => setOrderUpdateInfo(prev => ({ ...prev, orderStatus: val }))}
                                                value={orderUpdateInfo.orderStatus}>
                                                <Option value="Ordered">Đặt hàng thành công</Option>
                                                <Option value="Processing">Đang xử lý</Option>
                                                <Option value="GettingProduct">Đang lấy hàng</Option>
                                                <Option value="Packaged">Đóng gói</Option>
                                                <Option value="HandOver">Bàn giao vận chuyển</Option>
                                                <Option value="Shipping">Đang vận chuyển</Option>
                                                <Option value="Completed">Giao hàng thành công</Option>
                                                <Option value="Canceled">Đã hủy</Option>
                                            </Select>}
                                            {!edittingOrderStatus && getOrderStatusText(data.getOrderById.orderStatus)}
                                            <div className="m-t-4">
                                                {edittingOrderStatus &&
                                                    <Button className="m-r-4" type="primary" loading={updatingOrderStatus} onClick={() => {
                                                        updateOrderStatus({
                                                            variables: {
                                                                orderId: id,
                                                                orderStatus: orderUpdateInfo.orderStatus
                                                            }
                                                        })
                                                    }}  ><SaveOutlined />&nbsp; Lưu</Button>}
                                                <Button onClick={() => setEdittingOrderStatus(!edittingOrderStatus)}
                                                    type="ghost">{edittingOrderStatus ? "Hủy" : "Sửa"}</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div>
                                        <label>Tạm tính: &nbsp;</label>
                                        <div className="m-l-16"><NumberFormat value={data.getOrderById.subTotal} displayType={'text'}
                                            suffix="đ" thousandSeparator={true} /></div>
                                    </div>
                                    <div>
                                        <label>Thành tiền: &nbsp;</label>
                                        <div className="m-l-16"><NumberFormat value={data.getOrderById.grandTotal} displayType={'text'}
                                            suffix="đ" thousandSeparator={true} /></div>
                                    </div>
                                    <div>
                                        <label>Phương thức thanh toán: &nbsp;</label>
                                        <div className="m-l-16">
                                            {data.getOrderById.paymentMethod.name}
                                        </div>
                                    </div>
                                    {/* <div>
                                        <label>Trạng thái thanh toán: &nbsp;</label>
                                        <div className="m-l-16">
                                            {edittingPaymentStatus && <Select style={{ minWidth: 200 }} name="paymentStatus"
                                                onChange={(val) => setOrderUpdateInfo(prev => ({ ...prev, paymentStatus: val }))}
                                                value={orderUpdateInfo.paymentStatus}>
                                                <Option value={false}>Chưa thanh toán</Option>
                                                <Option value={true}>Đã thanh toán</Option>
                                            </Select>}
                                            {!edittingPaymentStatus && (data.getOrderById.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán")}
                                            <div className="m-t-4">
                                                {edittingPaymentStatus &&
                                                    <Button className="m-r-4" type="primary" loading={updatingPaymentStatus} onClick={() => {
                                                        updatePaymentStatus({
                                                            variables: {
                                                                orderId: id,
                                                                paymentStatus: orderUpdateInfo.paymentStatus
                                                            }
                                                        })
                                                    }}  ><SaveOutlined />&nbsp; Lưu</Button>}
                                                <Button onClick={() => setEdittingPaymentStatus(prev => !prev)}
                                                    type="ghost">{edittingPaymentStatus ? "Hủy" : "Sửa"}</Button>
                                            </div>
                                        </div>
                                    </div> */}
                                </Col>
                            </Row>}

                    </Panel>
                    <Panel header={<span><i className="fa fa-file-text m-r-12"></i><b>Chi tiết trạng thái đơn hàng</b></span>} key="2" showArrow={false}>
                        <div className="d-flex flex-column" >
                            <div className=" p-l-20 p-r-20" style={{ flex: 1 }}>
                                <div>Trạng thái hiện tại: <b>{getOrderStatusText(orderUpdateInfo.orderStatus)}</b></div>
                                <br />
                                <Steps size="small" direction="horizontal" className="order-status-steps" progressDot current={getStepOrder(orderUpdateInfo.orderStatus)}>
                                    <Step description="Đặt hàng thành công" />
                                    <Step description="Đang xử lý" />
                                    <Step description="Đang lấy hàng" />
                                    <Step description="Đóng gói" />
                                    <Step description="Bàn giao vận chuyển" />
                                    <Step description="Đang vận chuyển" />
                                    <Step description="Giao hàng thành công" />
                                </Steps>
                            </div>
                            <hr />
                            <div className="p-l-20">
                                <div style={{width: 500}}>
                                    <h5>Chi tiết trạng thái</h5>
                                    {orderUpdateInfo.orderSteps.map((item, index) => (<div key={item.id}>
                                        <div className="d-flex justify-content-between wrap" style={{ maxWidth: 500 }}>
                                            <p>{moment(item.createdAt).format("HH:mm DD/MM/YYYY")}</p>
                                            <p><b>{getOrderStatusText(item.orderStatus)}</b></p>
                                        </div>
                                    </div>))}
                                </div>
                            </div>
                        </div>
                    </Panel>
                    <Panel header={<span><i className="fa fa-truck m-r-12"></i><b>Giao hàng</b></span>} key="3" showArrow={false}>
                        {loading ? <Skeleton active /> : <Row gutter={16}>
                            <Col span={12}>
                                <div className="card" >
                                    <h5 className="card-header fs-15">Địa chỉ giao hàng</h5>
                                    <hr />
                                    <div className="card-body">
                                        <h6 className="name fs-14 m-b-6"><label className="m-b-4">Tên người nhận:</label>
                                            {edittingAddress && <div><Input style={{ maxWidth: 300 }}
                                                onChange={handleInputChange}
                                                name="recipientFullName" value={orderUpdateInfo.recipientFullName} /></div>}
                                            {!edittingAddress && data.getOrderById.recipientFullName}
                                        </h6>
                                        <div className="address fs-13 m-b-8 " title={data.getOrderById.recipientAddress}>
                                            <label className="m-b-4">Địa chỉ:</label>
                                            {edittingAddress && <div><TextArea rows={3}
                                                onChange={handleInputChange}
                                                name="recipientAddress"
                                                value={orderUpdateInfo.recipientAddress} /></div>}
                                            {!edittingAddress && data.getOrderById.recipientAddress}
                                        </div>
                                        <div className="address fs-13 m-b-8"><label className="m-b-4">Tỉnh/Thành phố:</label>
                                            {edittingAddress && <div><Select style={{ minWidth: 200 }} name="province" loading={provinceLoading} value={orderUpdateInfo.recipientProvince} onChange={(value) => {
                                                setOrderUpdateInfo(prev => ({ ...prev, recipientProvince: value }))
                                            }}>
                                                <Option value="">Chọn tỉnh/thành phố</Option>
                                                {provinces.getProvinces && provinces.getProvinces.length && provinces.getProvinces.map(item => (
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                ))}
                                            </Select></div>}
                                            {!edittingAddress && data.getOrderById.recipientProvince.name}
                                        </div>
                                        <div className="address fs-13 m-b-8"><label className="m-b-4">Quận/Huyện:</label>
                                            {edittingAddress && <div>
                                                <Select style={{ minWidth: 200 }} loading={loadingDistricts} value={orderUpdateInfo.recipientDistrict} onChange={(value) => {
                                                    setOrderUpdateInfo(prev => ({ ...prev, recipientDistrict: value }))
                                                }}>
                                                    <Option value="">Chọn quận/huyện</Option>
                                                    {orderUpdateInfo.recipientDistrict && dataDistricts.getDistricts &&
                                                        dataDistricts.getDistricts.length && dataDistricts.getDistricts.map(item => (
                                                            <Option key={item.id} value={item.id}>{item.name}</Option>
                                                        ))}
                                                </Select></div>}
                                            {!edittingAddress && data.getOrderById.recipientDistrict.name}
                                        </div>
                                        <div className="address fs-13 m-b-8"><label className="m-b-4">Phường/Xã:</label>
                                            {edittingAddress && <div>
                                                <Select style={{ minWidth: 200 }} loading={loadingWards} value={orderUpdateInfo.recipientWard} onChange={(value) => {
                                                    setOrderUpdateInfo(prev => ({ ...prev, recipientWard: value }))
                                                }}>
                                                    <Option value="">Chọn phường/xã</Option>
                                                    {orderUpdateInfo.recipientWard && dataWards.getWards && dataWards.getWards.length && dataWards.getWards.map(item => (
                                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                                    ))}
                                                </Select>
                                            </div>}
                                            {!edittingAddress && data.getOrderById.recipientWard.name}
                                        </div>
                                        <div className="address fs-13 m-b-8"><label className="m-b-4">Quốc gia:</label> Việt Nam</div>
                                        <div className="phone fs-13 m-b-8"><label className="m-b-4">Điện thoại:</label>
                                            {edittingAddress &&
                                                <div><Input style={{ maxWidth: 300 }} name="recipientPhone" onChange={handleInputChange}
                                                    value={orderUpdateInfo.recipientPhone} /></div>}
                                            {!edittingAddress && data.getOrderById.recipientPhone}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    {edittingAddress && <Button loading={updatingOrderAddress} className="m-r-4" type="primary" onClick={() => {
                                        const updateData = { ...orderUpdateInfo };
                                        delete updateData.orderStatus;
                                        updateOrderAddress({
                                            variables: {
                                                orderId: id,
                                                data: updateData
                                            }
                                        })
                                    }} ><SaveOutlined />&nbsp; Lưu</Button>}
                                    <Button type="primary" onClick={() => setEdittingAddress(!edittingAddress)}>{!edittingAddress ? 'Sửa' : 'Hủy'}</Button>
                                </div>
                            </Col>
                            <Col span={12}>
                                <Col span={12}>
                                    <div className="card" >
                                        <h5 className="card-header fs-15">Phương thức giao hàng</h5>
                                        <hr />
                                        <div className="card-body">
                                            <h6 className="name fs-14 m-b-6">{data.getOrderById.shippingMethod.name}</h6>
                                        </div>
                                    </div>
                                </Col>
                            </Col>
                        </Row>}
                    </Panel>
                    <Panel header={<span><i className="fa fa-book m-r-12"></i><b>Sách</b></span>} key="4" showArrow={false}>
                        {loading ? <Skeleton active /> : <Table columns={columns}
                            loading={loading}
                            pagination={false}
                            dataSource={createDataSource(data.getOrderById.items)} />}
                    </Panel>
                </Collapse>
            </div>
        </div >

    )

}

export default OrderDetail;