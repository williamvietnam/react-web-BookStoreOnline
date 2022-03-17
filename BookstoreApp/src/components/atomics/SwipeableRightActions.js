import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLOR_BUTTON_LINK } from '../../constants';

function SwipeableRightActions({ onDelete, onEdit,deleting }) {

    return (
        <View style={styles.container}>
            {onDelete && <TouchableOpacity onPress={onDelete}
                style={{ ...styles.item, backgroundColor: 'red' }}>
                {deleting?<ActivityIndicator color="#fff" animating/>:<Icon color="#fff" type="material-community" name="delete" />}
            </TouchableOpacity>}
            {onEdit && <TouchableOpacity onPress={onEdit}
                style={{ ...styles.item, backgroundColor: COLOR_BUTTON_LINK }} >
                <Icon color="#fff" type="material-community" name="pencil" />
            </TouchableOpacity>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
    },
    item: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        paddingHorizontal: 8
    }
})

export default SwipeableRightActions;