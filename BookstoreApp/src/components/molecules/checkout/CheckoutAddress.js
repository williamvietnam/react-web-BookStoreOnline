import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_USER_ADDRESSES } from '../../../api/userAddressApi';
import { showToast } from '../../../utils/common';
import AddressListCheckout from '../../organisms/checkout/AddressListCheckout';

function CheckoutAddress(props){

    return(
        <AddressListCheckout />
    )
}

export default CheckoutAddress;