import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { FlatList } from 'react-native-gesture-handler';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_USER_ADDRESSES, DELETE_USER_ADDRESS } from '../api/userAddressApi';
import { showToast } from '../utils/common';
import AddressItem from '../components/atomics/AddressItem';
import Empty from '../components/atomics/Empty';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SwipeableRightActions from '../components/atomics/SwipeableRightActions';
import { Overlay, Button } from 'react-native-elements';
import PopConfirm from '../components/atomics/PopConfirm';
import { useNavigation } from '@react-navigation/native';
import { COLOR_BUTTON_PRIMARY } from '../constants';
import { YellowBox } from 'react-native';
import AddressList from '../components/organisms/shared/AddressList';

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

function AddressListScreen(props) {

    return (
        <View style={{ position: 'relative', display: 'flex', height: '100%', backgroundColor: '#fff' }}>
            <HeaderBackAction title="Sổ địa chỉ" />
            <AddressList />
        </View>
    )
}

export default AddressListScreen;