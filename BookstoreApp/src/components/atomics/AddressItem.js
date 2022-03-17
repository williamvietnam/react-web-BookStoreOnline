import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function AddressItem(props){

    const { fullName, phone, province, district, ward, address,id } = props.address;
    const fullAddress = `${address}, ${ward.name}, ${district.name}, ${province.name}`;

    return(
        <View style={{...styles.container}}>
            <Text style={styles.recipientName}>{fullName}</Text>
            <Text style={styles.commonText}>{fullAddress}</Text>
            <Text style={styles.commonText}>{phone}</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderColor: '#ccc',
        borderBottomWidth: 1
    },
    recipientName: {
        fontSize: 17,
        marginBottom: 6,
        fontWeight: '700'
    },
    commonText: {
        color: '#626063'
    }
})

export default AddressItem;