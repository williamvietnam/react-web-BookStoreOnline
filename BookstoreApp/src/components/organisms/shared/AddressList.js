import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Overlay, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { YellowBox } from 'react-native';
import { GET_USER_ADDRESSES, DELETE_USER_ADDRESS } from '../../../api/userAddressApi';
import SwipeableRightActions from '../../atomics/SwipeableRightActions';
import AddressItem from '../../atomics/AddressItem';
import PopConfirm from '../../atomics/PopConfirm';
import Empty from '../../atomics/Empty';
import { COLOR_BUTTON_PRIMARY } from '../../../constants';
import { showToast } from '../../../utils/common';

YellowBox.ignoreWarnings([
    'Non-serializable values were found in the navigation state',
]);

function AddressList(props) {
    const navigation = useNavigation();
    const { loading, data = { getUserAddresses: [] }, refetch } = useQuery(GET_USER_ADDRESSES, {
        onError() {
            showToast("Có lỗi xảy ra khi lấy địa chỉ");
        },
        fetchPolicy: 'cache-and-network'
    });
    const [overlayVisible, setOverlayVisible] = useState(false);
    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    };
    const [deleteAddress, { loading: deletingAddress }] = useMutation(DELETE_USER_ADDRESS, {
        onError(err) {
            showToast("Có lỗi xảy ra khi xóa địa chỉ");
        },
        onCompleted() {
            showToast("Đã xóa");
            setOverlayVisible(false);
            refetch();
        }
    })
    const [addressToDeleteId, setAddressToDeleteId] = useState(undefined);

    function renderAddress({ item, index }) {
        return <Swipeable renderRightActions={() => <SwipeableRightActions
            onDelete={() => { setOverlayVisible(true); setAddressToDeleteId(item.id) }}
            onEdit={() => navigation.navigate("EditAddressScreen", {
                address: item,
                refetch
            })}
        />}>
            <AddressItem address={item} hideBorder={index === data.getUserAddresses.length} />
        </Swipeable>
    }


    return (
        <>
            <PopConfirm isVisible={overlayVisible}
                onBackdropPress={toggleOverlay}
                title="Xóa địa chỉ"
                text="Bạn thực sự muốn xóa địa chỉ này?"
                loading={deletingAddress}
                onCancel={() => setOverlayVisible(false)}
                onConfirm={() => {
                    deleteAddress({
                        variables: {
                            id: addressToDeleteId
                        }
                    })
                }}
            />
            {loading ? <View style={{ paddingTop: 150, height: '100%' }}>
                <ActivityIndicator animating />
            </View> : <FlatList data={data.getUserAddresses}
                renderItem={renderAddress}
                ListEmptyComponent={
                    <View style={{ marginTop: 50 }}>
                        <Empty emptyText="Bạn chưa có địa chỉ nào" />
                    </View>}></FlatList>}
            <View style={{
                paddingHorizontal: 12, paddingVertical: 8,
                borderColor: '#ccc',
                borderTopWidth: 1,
                backgroundColor: '#fff'
            }}>
                <Button title="THÊM ĐỊA CHỈ MỚI" onPress={() => {
                    navigation.navigate('AddAddressScreen', {
                        refetch
                    })
                }}
                    buttonStyle={{ backgroundColor: COLOR_BUTTON_PRIMARY }} />
            </View>
        </>
    )
}

export default AddressList;