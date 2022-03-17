import React from 'react';
import { Overlay, Text as RNText } from 'react-native-elements';
import { Text, TouchableOpacity, ActivityIndicator,View, Dimensions } from 'react-native';
import { COLOR_PRIMARY, COLOR_BUTTON_LINK } from '../../constants';

const {width} = Dimensions.get('window');

function PopConfirm({ isVisible, onBackdropPress, title, text, onConfirm, onCancel, loading,
    confirmText = "ĐỒNG Ý", cancelText = "KHÔNG" }) {


    return (
        <Overlay isVisible={isVisible} 
        overlayStyle={{
            minWidth: width * 0.8,
            padding: 12,
        }}
         onBackdropPress={onBackdropPress}>
            {loading ? <ActivityIndicator animating /> :
                <><RNText h4 h4Style={{ fontSize: 20,marginBottom: 8 }}>{title}</RNText>
                    <Text style={{ color: '#626063' ,marginBottom: 16}}>{text}</Text>
                    <View style={{ display: 'flex', 
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={onConfirm}>
                            <Text style={{ color: COLOR_BUTTON_LINK }}>{confirmText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginLeft: 12}} onPress={onCancel}>
                            <Text style={{
                                color: "#fff",
                                paddingVertical: 4,
                                paddingHorizontal: 12,
                                backgroundColor: COLOR_BUTTON_LINK
                            }}>{cancelText}</Text>
                        </TouchableOpacity>
                    </View></>}
        </Overlay>
    )

}

export default PopConfirm;