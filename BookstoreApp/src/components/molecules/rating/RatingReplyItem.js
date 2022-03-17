import React from 'react'
import { Rating, Header, Text as RNText } from 'react-native-elements';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../../constants';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 8
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    createdAt: {
        color: "#626063",
        fontSize: 13
    },
    reviewText: {
        marginBottom: 2
    }
})

function RatingReplyItem(props) {

    const { reply } = props;
    const { id, text, updatedAt, author } = reply;
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.reviewText}>{text}</Text>
            </View>
            <View style={styles.header}>
                <Text style={styles.createdAt}>{author.fullName ?? author.username} {`\u2022`} {moment(updatedAt).format("DD MMM, YYYY")}</Text>
            </View>
        </View>)

}

export default RatingReplyItem;