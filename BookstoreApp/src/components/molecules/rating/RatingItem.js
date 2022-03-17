import React, { useState } from 'react'
import { Rating, Header, Text as RNText } from 'react-native-elements';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';
import { DATE_TIME_VN_24H, COLOR_PRIMARY } from '../../../constants';
import RatingReplyItem from './RatingReplyItem';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useToken } from '../../../hooks/customHooks';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        borderColor: '#ccc',
        borderTopWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    createdAt: {
        color: "#626063",
        fontSize: 13
    },
    reviewText: {
        marginTop: 12
    },
    repliesCtn: {
        borderColor: "#ccc",
        borderLeftWidth: 1,
        marginTop: 16
    },
    hideShowRepliesbtn: {
        marginRight: 12
    },
    displayFlexRow: {
        display: "flex",
        flexDirection: 'row'
    }
})

function RatingItem(props) {

    const { review, hideReplies, containerStyle = {} } = props;
    const { id, rating, reviewHeader, reviewText, createdAt, author, replies = [] } = review;
    const [showReplies, setShowReplies] = useState(false);

    const navigation = useNavigation();
    const [, , tokenValid] = useToken()

    function navigateToReplyScreen() {
        if (!tokenValid) {
            navigation.navigate("LoginSignupScreen", {
                from: {
                    stack: 'ReplyReviewScreen',
                    params: {
                        id
                    }
                }
            })
        } else {
            navigation.navigate("ReplyReviewScreen", {
                id
            });
        }
    }
    return (
        <View style={{ ...styles.container, ...containerStyle }}>
            <View style={styles.header}>
                <Rating
                    readonly startingValue={rating}
                    ratingBackgroundColor="#ccc"
                    imageSize={14} ratingCount={5} />
                <Text style={styles.createdAt}>{moment(createdAt).format("DD MMM, YYYY")}</Text>
            </View>
            <View>
                <RNText h4 h4Style={{ fontSize: 18 }}>{reviewHeader}</RNText>
            </View>
            <View>
                <Text style={styles.createdAt}>{author.fullName ?? author.username}</Text>
            </View>
            {reviewText !== null && reviewText !== undefined && reviewText !== '' && <View>
                <Text style={styles.reviewText}>{reviewText}</Text>
            </View>}
            <View style={{ ...styles.displayFlexRow, marginTop: 12 }}>
                {replies.length > 0 && <TouchableOpacity style={styles.hideShowRepliesbtn} onPress={() => setShowReplies(prev => !prev)}>
                    <Text style={{ color: COLOR_PRIMARY }}>{showReplies ? "Ẩn" : 'Hiện'} trả lời</Text>
                </TouchableOpacity>}
                <TouchableOpacity onPress={navigateToReplyScreen}>
                    <Text style={{ color: COLOR_PRIMARY }}>Gửi trả lời</Text>
                </TouchableOpacity>
            </View>
            {!hideReplies && showReplies && <View style={styles.repliesCtn}>
                {replies.map(r => (
                    <RatingReplyItem key={r.id} reply={r} />
                ))}
            </View>}
        </View>)

}

export default RatingItem;