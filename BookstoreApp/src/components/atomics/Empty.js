import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: 'center',
        width: '100%',
        padding: 8
    },
    text: {
        color: "#666666"
    }
})

function Empty({ emptyText="Không có dữ liệu" }) {

    return (
        <View style={styles.container}>
            <Icon color="#DEDEDE" type="antdesign" name="inbox"></Icon>
            <Text style={styles.text}>{emptyText}</Text>
        </View>
    )

}

export default Empty;