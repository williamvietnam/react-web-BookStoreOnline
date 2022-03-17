import React from 'react';
import { useRoute } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import HTML from 'react-native-render-html';
import HeaderBackAction from '../components/atomics/HeaderBackAction';

function BookDescriptionScreen(props) {

    const route = useRoute();
    const { description } = route.params;

    return (<View style={{display: "flex", height: '100%'}}>
        <HeaderBackAction title="Mô tả sách" />
        <ScrollView style={{ paddingHorizontal: 12 }}>
            <HTML html={description}></HTML>
        </ScrollView>
    </View>)

}

export default BookDescriptionScreen;