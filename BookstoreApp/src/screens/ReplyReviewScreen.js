import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { Rating, Text as RNText, Input, Button } from 'react-native-elements';
import RatingReplyItem from '../components/molecules/rating/RatingReplyItem';
import { useRoute } from '@react-navigation/native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_REVIEW_BY_ID, CREATE_REVIEW_REPLY } from '../api/reviewApi';
import { showToast } from '../utils/common';
import moment from 'moment';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: '100%',
        backgroundColor: '#fff'
    },
    ScrollView: {
        paddingHorizontal: 10,
        marginVertical: 12
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
    },
    replyInputCtn: {
        width: '100%',
        flexWrap: 'wrap',
        alignItems: 'center',
        display: "flex",
        paddingVertical: 12,
        borderColor: '#ccc',
        borderTopWidth: 1
    }
})

function ReplyReviewScreen(props) {

    const route = useRoute();
    const { id } = route.params;
    const [text, setText] = useState("");
    const { loading, data = { getReviewById: { replies: [], author: {}, book: {} } }, refetch } = useQuery(GET_REVIEW_BY_ID, {
        variables: {
            id
        },
        onError(err) {
            console.log(err.message)
            showToast("Có lỗi xảy ra khi lấy dữ liệu");
        }
    });

    const [createReviewReply, { loading: creatingReply }] = useMutation(CREATE_REVIEW_REPLY, {
        onError(err) {
            showToast("Có lỗi xảy ra khi gửi trả lời" + err);
        },
        onCompleted() {
            refetch();
            setText("");
            showToast("Đã gửi trả lời");
        }
    })

    const { rating, reviewHeader, reviewText, createdAt, author, book, replies = [] } = data.getReviewById;

    return (
        <View style={styles.container}>
            <HeaderBackAction title="Trả lời đánh giá" />
            {loading?<ActivityIndicator style={{height: '100%'}} animating />:<ScrollView style={{ ...styles.ScrollView }}>
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
                <View style={styles.repliesCtn}>
                    {replies.map(r => (
                        <RatingReplyItem key={r.id} reply={r} />
                    ))}
                </View>
            </ScrollView>}
            <View style={{ ...styles.replyInputCtn }}>
                <Input multiline={true} placeholder="Viết câu trả lời"
                    value={text} onChangeText={(text) => setText(text)}
                    inputStyle={{ fontSize: 12, margin: 0, padding: 0 }}
                    inputContainerStyle={{ height: 30 }}
                />
                <Button buttonStyle={{ width: '50%' }}
                    loading={creatingReply}
                    loadingStyle={{ width: '100%' }}
                    onPress={() => {
                        createReviewReply({
                            variables: {
                                data: {
                                    text,
                                    bookReview: id,
                                    book: book.id
                                }
                            }
                        })
                    }}
                    titleStyle={{ textAlign: 'center', width: '100%' }} title="Gửi"></Button>
            </View>
        </View>
    )

}

export default ReplyReviewScreen;