import React from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import {useDispatch} from 'react-redux';
import { changeFilter } from '../../redux/actions/filtersActions';

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#c5e5fa",
        borderRadius: 25,
        paddingVertical: 4,
        paddingHorizontal: 12,
        textAlign: "center",
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 4,
        borderWidth: 1,
        borderColor: 'transparent',
        overflow: 'hidden',
        height: 32
    },
    buttonText: {
        textAlign: "center",
        fontSize: 12,
        marginRight: 8
    },
});

function SelectedFilter(props){

    const {text, value,type} = props;
    const dispatch = useDispatch();
    return (
        <TouchableOpacity style={styles.button} onPress={()=>dispatch(changeFilter(type,value))}>
            <Text style={styles.buttonText}>{text}</Text>
            <Icon containerStyle={{top: 0.8}} type="antdesign" name="closecircle" size={16} color="#4287f5"></Icon>
        </TouchableOpacity>
    )
}

export default SelectedFilter;