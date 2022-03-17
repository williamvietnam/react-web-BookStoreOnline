import React, { useState, Fragment } from 'react';
import { Skeleton, Empty } from 'antd';
import UserAddressDrawer from '../shared/UserAddressDrawer';
import { useQuery } from '@apollo/react-hooks';
import { GET_USER_ADDRESSES } from '../../api/userAddressApi';
import UserAddressItem from '../userAddress/userAddressItem';

function CheckoutAddress(props) {

    const [drawerVisible, setDrawerVisible] = useState(false);
    const { next, setOrderInfo } = props;
    const { error: errorGettingUserAddresses, refetch: refetchUserAddresses,
        loading: loadingUserAddresses, data: dataUserAddresses = {} } = useQuery(GET_USER_ADDRESSES);
    const [edittingAddress, setEdittingAddress] = useState({
        fullName: '',
        phone: '',
        address: '',
        province: '',
        district: '',
        id: '',
        ward: ''
    });
    return (
        <div>
            <h5>Địa chỉ giao hàng</h5>
            {dataUserAddresses.getUserAddresses && dataUserAddresses.getUserAddresses.length > 0 &&
                <p className="m-t-8 font-weight-bold" style={{ color: '#000' }}>Chọn một địa chỉ giao hàng có sẵn bên dưới: </p>}
            <br />
            <div className="row">
                {loadingUserAddresses ? <Fragment>
                    <div className="col-12 col-sm-6 m-b-16">
                        <div className="card">
                            <div className="card-body">
                                <Skeleton active />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 m-b-16">
                        <div className="card">
                            <div className="card-body">
                                <Skeleton active />
                            </div>
                        </div>
                    </div>
                </Fragment> : dataUserAddresses.getUserAddresses && dataUserAddresses.getUserAddresses.length ?
                        dataUserAddresses.getUserAddresses.map(item => (
                            <UserAddressItem next={next} userAddress={item} key={item}
                                refetchUserAddresses={refetchUserAddresses} setDrawerVisible={setDrawerVisible}
                                checkingOut={true} setEdittingAddress={setEdittingAddress}
                                setOrderInfo={setOrderInfo} />
                        )) : <div className="d-flex justify-content-center w-100">
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Bạn chưa có địa chỉ giao hàng nào" />
                        </div>}
            </div>
            <p className="m-t-8 fs-12" style={{ color: '#000' }}>Bạn muốn giao hàng tới một địa chỉ khác?
                <a className="text-primary" onClick={() => {
                    setEdittingAddress({
                        fullName: '',
                        phone: '',
                        address: '',
                        province: '',
                        district: '',
                        ward: ''
                    });
                    setDrawerVisible(true)
                }}>Thêm địa chỉ giao hàng mới</a>
            </p>
            <UserAddressDrawer
                drawerVisible={drawerVisible}
                setDrawerVisible={setDrawerVisible}
                isCreating={!edittingAddress.id} edittingAddress={edittingAddress}
                refetchUserAddresses={refetchUserAddresses} />
        </div>
    )
}

export default CheckoutAddress;