import React from 'react';
import { View, StyleSheet, Text} from 'react-native';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import StepIndicator from 'react-native-step-indicator';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import { getOrderStatusText } from '../utils/common';
import { DATE_TIME_VN_24H } from '../constants';
import { GET_ORDER_BY_ID } from '../api/orderApi';
import { useQuery } from '@apollo/react-hooks';
import { ScrollView } from 'react-native-gesture-handler';
import { RefreshControl } from 'react-native';

function getStepOrder(orderStatus) {
    switch (orderStatus) {
        case "Ordered":
            return 1;
        case "Processing":
            return 2;
        case "GettingProduct":
            return 3;
        case "Packaged":
            return 4;
        case "HandOver":
            return 5;
        case "Shipping":
            return 6;
        case "Completed":
            return 7;
    }
}

function OrderStatusScreen(props) {

    const route = useRoute();
    const { id } = route.params;
    const { loading, data = { getOrderById: {} }, refetchData } = useQuery(GET_ORDER_BY_ID, {
        onError() {
            showToast("Có lỗi xảy ra khi lấy dữ liệu");
        },
        fetchPolicy: 'cache-and-network',
        onCompleted(data){
            console.log(data)
        },
        variables: {
            id
        }
    });
    const { createdAt, orderStatus,orderSteps } = data.getOrderById;
    const position = getStepOrder(orderStatus);

    return (
        <View>
            <HeaderBackAction showRight showRightOptions={{
                hideHome: true,
                hideMore: true,
                hideSearch: true
            }} title="Theo dõi đơn hàng" />

            <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refetchData}
                    />
                }>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Trạng thái đơn hàng</Text>
                    {/* <StepIndicator
                         customStyles={customStyles}
                        currentPosition={0}
                        stepCount={7}
                        direction="vertical"
                        labels={labels}
                    /> */}
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ marginRight: 8 }}>
                            <Text style={styles.statusText}>{moment(createdAt).format("DD/MM")}</Text>
                        </View>
                        <View style={{ width: 10, height: 222.5, backgroundColor: '#ddd', borderRadius: 15, overflow: "hidden" }}>
                            <View style={{ width: '100%', height: position * 21.2 + (position - 1) * 12.2, backgroundColor: '#59A238', borderRadius: 15 }}></View>
                        </View>
                        <View style={{ marginLeft: 8 }}>
                            <Text style={styles.statusText}>Đặt hàng thành công</Text>
                            <Text style={styles.statusText}>Đang xử lý</Text>
                            <Text style={styles.statusText}>Đang lấy hàng</Text>
                            <Text style={styles.statusText}>Đóng gói</Text>
                            <Text style={styles.statusText}>Bàn giao vận chuyển</Text>
                            <Text style={styles.statusText}>Đang vận chuyển</Text>
                            <Text style={styles.statusText}>Giao hàng thành công</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.sectionDivider}></View>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Chi tiết trạng thái</Text>
                    <View>
                        {orderSteps.map(item => (
                            <View style={{ display: 'flex', flexDirection: 'row', borderBottomWidth:1, borderColor: '#ccc' }} key={item.id}>
                                <Text style={{ fontWeight: 'bold', marginRight: 24 }}>{moment(item.createdAt).format("HH:mm DD/MM/YYYY")}</Text>
                                <Text style={styles.statusText}>{getOrderStatusText(item.orderStatus)}</Text>
                            </View>))}
                    </View>
                </View>
            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: '100%',
        backgroundColor: '#fff'
    },
    section: {
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    sectionDivider: {
        height: 6,
        backgroundColor: '#ccc'
    },
    text: {
        color: '#626063'
    },
    sectionHeader: {
        fontSize: 15,
        marginBottom: 8,
        fontWeight: '700'
    },
    statusText: { marginBottom: 12.5, textAlignVertical: 'bottom', color: '#626063' }
})

export default OrderStatusScreen;