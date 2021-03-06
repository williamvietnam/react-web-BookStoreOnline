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
                message.error("C?? l???i x???y ra khi l???y d??? li???u");
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
            title: '???nh',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
        },
        {
            title: <div className="d-flex">
                <span className="m-r-12">T???a ?????</span>
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
            title: 'S??? l?????ng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Gi??',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Gi???m gi??',
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: 'T???ng ti???n',
            dataIndex: 'totalItemPrice',
            key: 'totalItemPrice',
        }
    ];

    const createDataSource = (orderItems) => {
        if (!orderItems) return [];
        return orderItems.map((item, index) => {
            return {
                key: item.id,
                title: item.item?<NavLink to={`/catalog/book/edit/${item.item.id}`}>{item.item.title}</NavLink>:<span>(S???n ph???m kh??ng t???n t???i)</span>,
                price: <NumberFormat value={item.price} displayType={'text'}
                    suffix="??" thousandSeparator={true} />,
                totalItemPrice: <NumberFormat value={item.totalItemPrice} displayType={'text'}
                    suffix="??" thousandSeparator={true} />,
                quantity: <NumberFormat value={item.quantity} displayType={'text'}
                    thousandSeparator={true} />,
                thumbnail: <img width="50" src={item.item?item.item.thumbnail:'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132484366.jpg'} />,
                discount: <NumberFormat value={item.discount} displayType={'text'}
                    suffix="??" thousandSeparator={true} />
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
            console.log("C?? l???i x???y ra khi c???p nh???t ?????a ch??? giao h??ng, vui l??ng th??? l???i sau");
        },
        onCompleted() {
            message.success("C???p nh???t th??nh c??ng");
            refetch();
            setEdittingAddress(false);
        }
    });

    const [updateOrderStatus, { loading: updatingOrderStatus }] = useMutation(UPDATE_ORDER_STATUS, {
        onError() {
            console.log("C?? l???i x???y ra khi c???p nh???t tr???ng th??i ????n h??ng, vui l??ng th??? l???i sau");
        },
        onCompleted() {
            message.success("C???p nh???t th??nh c??ng");
            refetch();
            setEdittingOrderStatus(false);
        }
    });

    const [updatePaymentStatus, { loading: updatingPaymentStatus }] = useMutation(UPDATE_PAYMENT_STATUS, {
        onError() {
            console.log("C?? l???i x???y ra khi c???p nh???t tr???ng th??i thanh to??n, vui l??ng th??? l???i sau");
        },
        onCompleted() {
            message.success("C???p nh???t th??nh c??ng");
            refetch();
            setEdittingPaymentStatus(false);
        }
    });

    return (
        <div className="content-wrapper">
            <div className={`content-header m-b-20`}>
                {loading ? <Skeleton active /> : <Fragment>
                    <h3>Chi ti???t ????n h??ng - {data.getOrderById.orderNumber}</h3>
                    {/* <div className="pull-right">
                    <Button type="primary"><SaveOutlined className="m-l-2" /> L??u</Button>
                </div> */}
                </Fragment>}
            </div>
            <div className="content-body">
                <Collapse bordered defaultActiveKey={['1']}>
                    <Panel header={<span><i className="fa fa-info m-r-12"></i><b>Th??ng tin ????n h??ng</b></span>} key="1" showArrow={false}>
                        {loading ? <Skeleton active /> :
                            <Row gutter={16}>
                                <Col span={12}>
                                    <div>
                                        <label>M?? ????n h??ng: &nbsp;</label>
                                        <div className="m-l-16">{data.getOrderById.orderNumber}</div>
                                    </div>
                                    <div>
                                        <label>Ng??y t???o: &nbsp;</label>
                                        <div className="m-l-16">{moment(data.getOrderById.createdAt).format(DATE_TIME_VN_24H)}</div>
                                    </div>
                                    <div>
                                        <label>Kh??ch h??ng: &nbsp;</label>
                                        <div className="m-l-16">
                                            <NavLink to={`/users/edit/${data.getOrderById.customer.id}`} >{data.getOrderById.customer.email}</NavLink>
                                        </div>
                                    </div>
                                    <div>
                                        <label>Tr???ng th??i ????n h??ng: &nbsp;</label>
                                        <div className="m-l-16">
                                            {edittingOrderStatus && <Select style={{ minWidth: 200 }} name="orderStatus"
                                                onChange={(val) => setOrderUpdateInfo(prev => ({ ...prev, orderStatus: val }))}
                                                value={orderUpdateInfo.orderStatus}>
                                                <Option value="Ordered">?????t h??ng th??nh c??ng</Option>
                                                <Option value="Processing">??ang x??? l??</Option>
                                                <Option value="GettingProduct">??ang l???y h??ng</Option>
                                                <Option value="Packaged">????ng g??i</Option>
                                                <Option value="HandOver">B??n giao v???n chuy???n</Option>
                                                <Option value="Shipping">??ang v???n chuy???n</Option>
                                                <Option value="Completed">Giao h??ng th??nh c??ng</Option>
                                                <Option value="Canceled">???? h???y</Option>
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
                                                    }}  ><SaveOutlined />&nbsp; L??u</Button>}
                                                <Button onClick={() => setEdittingOrderStatus(!edittingOrderStatus)}
                                                    type="ghost">{edittingOrderStatus ? "H???y" : "S???a"}</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div>
                                        <label>T???m t??nh: &nbsp;</label>
                                        <div className="m-l-16"><NumberFormat value={data.getOrderById.subTotal} displayType={'text'}
                                            suffix="??" thousandSeparator={true} /></div>
                                    </div>
                                    <div>
                                        <label>Th??nh ti???n: &nbsp;</label>
                                        <div className="m-l-16"><NumberFormat value={data.getOrderById.grandTotal} displayType={'text'}
                                            suffix="??" thousandSeparator={true} /></div>
                                    </div>
                                    <div>
                                        <label>Ph????ng th???c thanh to??n: &nbsp;</label>
                                        <div className="m-l-16">
                                            {data.getOrderById.paymentMethod.name}
                                        </div>
                                    </div>
                                    {/* <div>
                                        <label>Tr???ng th??i thanh to??n: &nbsp;</label>
                                        <div className="m-l-16">
                                            {edittingPaymentStatus && <Select style={{ minWidth: 200 }} name="paymentStatus"
                                                onChange={(val) => setOrderUpdateInfo(prev => ({ ...prev, paymentStatus: val }))}
                                                value={orderUpdateInfo.paymentStatus}>
                                                <Option value={false}>Ch??a thanh to??n</Option>
                                                <Option value={true}>???? thanh to??n</Option>
                                            </Select>}
                                            {!edittingPaymentStatus && (data.getOrderById.paymentStatus ? "???? thanh to??n" : "Ch??a thanh to??n")}
                                            <div className="m-t-4">
                                                {edittingPaymentStatus &&
                                                    <Button className="m-r-4" type="primary" loading={updatingPaymentStatus} onClick={() => {
                                                        updatePaymentStatus({
                                                            variables: {
                                                                orderId: id,
                                                                paymentStatus: orderUpdateInfo.paymentStatus
                                                            }
                                                        })
                                                    }}  ><SaveOutlined />&nbsp; L??u</Button>}
                                                <Button onClick={() => setEdittingPaymentStatus(prev => !prev)}
                                                    type="ghost">{edittingPaymentStatus ? "H???y" : "S???a"}</Button>
                                            </div>
                                        </div>
                                    </div> */}
                                </Col>
                            </Row>}

                    </Panel>
                    <Panel header={<span><i className="fa fa-file-text m-r-12"></i><b>Chi ti???t tr???ng th??i ????n h??ng</b></span>} key="2" showArrow={false}>
                        <div className="d-flex flex-column" >
                            <div className=" p-l-20 p-r-20" style={{ flex: 1 }}>
                                <div>Tr???ng th??i hi???n t???i: <b>{getOrderStatusText(orderUpdateInfo.orderStatus)}</b></div>
                                <br />
                                <Steps size="small" direction="horizontal" className="order-status-steps" progressDot current={getStepOrder(orderUpdateInfo.orderStatus)}>
                                    <Step description="?????t h??ng th??nh c??ng" />
                                    <Step description="??ang x??? l??" />
                                    <Step description="??ang l???y h??ng" />
                                    <Step description="????ng g??i" />
                                    <Step description="B??n giao v???n chuy???n" />
                                    <Step description="??ang v???n chuy???n" />
                                    <Step description="Giao h??ng th??nh c??ng" />
                                </Steps>
                            </div>
                            <hr />
                            <div className="p-l-20">
                                <div style={{width: 500}}>
                                    <h5>Chi ti???t tr???ng th??i</h5>
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
                    <Panel header={<span><i className="fa fa-truck m-r-12"></i><b>Giao h??ng</b></span>} key="3" showArrow={false}>
                        {loading ? <Skeleton active /> : <Row gutter={16}>
                            <Col span={12}>
                                <div className="card" >
                                    <h5 className="card-header fs-15">?????a ch??? giao h??ng</h5>
                                    <hr />
                                    <div className="card-body">
                                        <h6 className="name fs-14 m-b-6"><label className="m-b-4">T??n ng?????i nh???n:</label>
                                            {edittingAddress && <div><Input style={{ maxWidth: 300 }}
                                                onChange={handleInputChange}
                                                name="recipientFullName" value={orderUpdateInfo.recipientFullName} /></div>}
                                            {!edittingAddress && data.getOrderById.recipientFullName}
                                        </h6>
                                        <div className="address fs-13 m-b-8 " title={data.getOrderById.recipientAddress}>
                                            <label className="m-b-4">?????a ch???:</label>
                                            {edittingAddress && <div><TextArea rows={3}
                                                onChange={handleInputChange}
                                                name="recipientAddress"
                                                value={orderUpdateInfo.recipientAddress} /></div>}
                                            {!edittingAddress && data.getOrderById.recipientAddress}
                                        </div>
                                        <div className="address fs-13 m-b-8"><label className="m-b-4">T???nh/Th??nh ph???:</label>
                                            {edittingAddress && <div><Select style={{ minWidth: 200 }} name="province" loading={provinceLoading} value={orderUpdateInfo.recipientProvince} onChange={(value) => {
                                                setOrderUpdateInfo(prev => ({ ...prev, recipientProvince: value }))
                                            }}>
                                                <Option value="">Ch???n t???nh/th??nh ph???</Option>
                                                {provinces.getProvinces && provinces.getProvinces.length && provinces.getProvinces.map(item => (
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                ))}
                                            </Select></div>}
                                            {!edittingAddress && data.getOrderById.recipientProvince.name}
                                        </div>
                                        <div className="address fs-13 m-b-8"><label className="m-b-4">Qu???n/Huy???n:</label>
                                            {edittingAddress && <div>
                                                <Select style={{ minWidth: 200 }} loading={loadingDistricts} value={orderUpdateInfo.recipientDistrict} onChange={(value) => {
                                                    setOrderUpdateInfo(prev => ({ ...prev, recipientDistrict: value }))
                                                }}>
                                                    <Option value="">Ch???n qu???n/huy???n</Option>
                                                    {orderUpdateInfo.recipientDistrict && dataDistricts.getDistricts &&
                                                        dataDistricts.getDistricts.length && dataDistricts.getDistricts.map(item => (
                                                            <Option key={item.id} value={item.id}>{item.name}</Option>
                                                        ))}
                                                </Select></div>}
                                            {!edittingAddress && data.getOrderById.recipientDistrict.name}
                                        </div>
                                        <div className="address fs-13 m-b-8"><label className="m-b-4">Ph?????ng/X??:</label>
                                            {edittingAddress && <div>
                                                <Select style={{ minWidth: 200 }} loading={loadingWards} value={orderUpdateInfo.recipientWard} onChange={(value) => {
                                                    setOrderUpdateInfo(prev => ({ ...prev, recipientWard: value }))
                                                }}>
                                                    <Option value="">Ch???n ph?????ng/x??</Option>
                                                    {orderUpdateInfo.recipientWard && dataWards.getWards && dataWards.getWards.length && dataWards.getWards.map(item => (
                                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                                    ))}
                                                </Select>
                                            </div>}
                                            {!edittingAddress && data.getOrderById.recipientWard.name}
                                        </div>
                                        <div className="address fs-13 m-b-8"><label className="m-b-4">Qu???c gia:</label> Vi???t Nam</div>
                                        <div className="phone fs-13 m-b-8"><label className="m-b-4">??i???n tho???i:</label>
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
                                    }} ><SaveOutlined />&nbsp; L??u</Button>}
                                    <Button type="primary" onClick={() => setEdittingAddress(!edittingAddress)}>{!edittingAddress ? 'S???a' : 'H???y'}</Button>
                                </div>
                            </Col>
                            <Col span={12}>
                                <Col span={12}>
                                    <div className="card" >
                                        <h5 className="card-header fs-15">Ph????ng th???c giao h??ng</h5>
                                        <hr />
                                        <div className="card-body">
                                            <h6 className="name fs-14 m-b-6">{data.getOrderById.shippingMethod.name}</h6>
                                        </div>
                                    </div>
                                </Col>
                            </Col>
                        </Row>}
                    </Panel>
                    <Panel header={<span><i className="fa fa-book m-r-12"></i><b>S??ch</b></span>} key="4" showArrow={false}>
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