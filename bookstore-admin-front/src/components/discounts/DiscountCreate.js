import React, { useState, Fragment } from 'react';
import { Collapse, Button, Form, Input, message, Switch, DatePicker, InputNumber } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import useScroll from '../../custom-hooks/useScroll';
import { CREATE_DISCOUNT } from '../../api/discountApi';
import { DATE_TIME_VN_24H,DATE_TIME_US_24H } from '../../constants';
import moment from 'moment';

const { Panel } = Collapse;
const { RangePicker } = DatePicker;

function DiscountCreate(props) {

    const [inputs, setInputs] = useState({
        name: '',
        usePercentage: true,
        from: moment(),
        to: moment(),
        discountRate: 0,
        discountAmount: 0
    });
    const history = useHistory();
    const isScrolled = useScroll(62);

    const [createDiscount, { loading: creatingDiscount }] = useMutation(CREATE_DISCOUNT, {
        onError() {
            message.error("Có lỗi xảy ra khi tạo giảm giá");
        },
        onCompleted(data) {
            message.success("Tạo thành công");
            history.push('/promotion/discount/edit/' + data.createDiscount.id);
        }
    });

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    return (
        <div className="content-wrapper">
            <div className={`content-header m-b-20${isScrolled ? ' sticky' : ''}`}>
                <h3>Thêm giảm giá</h3>
                <div className="pull-right">
                    <Button type="primary"
                        loading={creatingDiscount}
                        onClick={async () => {
                            createDiscount({
                                variables: {
                                    data: {
                                        ...inputs,
                                        discountRate: parseFloat(inputs.discountRate)/100,
                                        from: new Date(inputs.from).getTime(),
                                        to: new Date(inputs.to).getTime(),
                                    }
                                }
                            })
                        }} ><SaveOutlined className="m-l-2" /> Tạo</Button>
                </div>
            </div>
            <div className="content-body">
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<span><i className="fa fa-info m-r-12"></i><b>Thông tin giảm giá</b></span>} key="1" showArrow={false}>
                        <div className="">
                            <div className="m-b-8" >
                                <label style={{ minWidth: 200 }}>
                                    Tên
                                </label>
                                <span><Input style={{ maxWidth: 600 }} name="name" value={inputs.name} onChange={onInputChange} /></span>
                            </div>
                            <div className="m-b-8">
                                <label style={{ minWidth: 200 }}>Sử dụng phần trăm</label>
                                <Switch name="usePercentage" checked={inputs.usePercentage} onChange={(val) => setInputs(prev => ({ ...prev, usePercentage: val }))} />
                            </div>
                            {inputs.usePercentage && <div className="m-b-8">
                                <label style={{ minWidth: 200 }}>Phần trăm giảm giá</label>
                                <InputNumber min={0} max={100} step={1} name="discountRate" value={inputs.discountRate} onChange={(val) => setInputs(prev => ({ ...prev, discountRate: val }))} />
                            </div>}
                            {!inputs.usePercentage && <div className="m-b-8">
                                <label style={{ minWidth: 200 }}>Số tiền giảm giá (đ)</label>
                                <InputNumber min={0} step={1000} style={{ minWidth: 200 }} name="discountRate" value={inputs.discountAmount} onChange={(val) => setInputs(prev => ({ ...prev, discountAmount: val }))} />
                            </div>}
                            <div className="m-b-8">
                                <label style={{ minWidth: 200 }}>Khoảng thời gian áp dụng</label>
                                <RangePicker showTime format={DATE_TIME_VN_24H}
                                    value={[inputs.from, inputs.to]}
                                    onChange={(val) => setInputs(prev => ({ ...prev, from: val[0], to: val[1] }))} />
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </div >

    )

}

export default DiscountCreate;