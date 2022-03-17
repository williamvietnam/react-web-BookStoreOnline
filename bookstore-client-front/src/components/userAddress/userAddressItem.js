import React, { useState } from 'react';
import { Button, message } from 'antd';
import { DELETE_USER_ADDRESS } from '../../api/userAddressApi';
import { useMutation } from '@apollo/react-hooks';
import { ERROR_OCCURED } from '../../constants';

function UserAddressItem(props) {

    const { next,userAddress,setOrderInfo, checkingOut=true ,isFullWidth, setEdittingAddress,refetchUserAddresses,setDrawerVisible} = props;
    const { fullName, phone, province, district, ward, address,id } = userAddress;
    const [deleteUserAddress, {loading: deletingUserAddress}]= useMutation(DELETE_USER_ADDRESS,{
        onCompleted(data) {
            refetchUserAddresses();
            setDrawerVisible(false)
        },
        onError(error) {
            message.error(ERROR_OCCURED);
        }
    })
    const fullAddress = `${address}, ${ward.name}, ${district.name}, ${province.name}`;
    return (
        <div className={`col-12 m-b-16${isFullWidth?' col-sm-12':' col-sm-6'}`}>
            <div className="card">
                <div className="card-body">
                    <h6 className="name  m-b-6">{fullName}</h6>
                    <p className="address fs-13" title={fullAddress}>
                        Địa chỉ: {fullAddress}         </p>
                    <p className="address fs-13">Việt Nam</p>
                    <p className="phone fs-13">Điện thoại: {phone}</p>
                    <p className="action">
                        {checkingOut&&<Button className="m-r-8" type="primary" onClick={()=>{
                            setOrderInfo(prev=>({...prev, orderAddress: userAddress}));
                            next();
                        }}>
                            Giao đến địa chỉ này
                        </Button>}
                        <Button className="m-r-8" 
                        onClick={()=>{
                            setEdittingAddress({
                                ...userAddress,
                                ward: userAddress.ward.id,
                                district: userAddress.district.id,
                                province: userAddress.province.id
                            })
                            setDrawerVisible(true);
                        }}
                        type="default">Sửa</Button>
                        <Button type="default" loading={deletingUserAddress}
                        onClick={()=>deleteUserAddress({
                            variables: {
                                id
                            }
                        })}
                        >Xóa</Button>
                    </p>
                </div>
            </div>
        </div>)
}

export default UserAddressItem;