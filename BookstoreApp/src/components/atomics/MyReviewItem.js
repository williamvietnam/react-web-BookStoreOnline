import React from 'react';
import { Image, Rating } from 'react-native-elements';
import { Text, StyleSheet, View, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

function MyReviewItem(props) {

    const { review } = props;
    const { id, rating, reviewHeader, reviewText, createdAt, author, replies = [], book = {} } = review;

    return (
        <View style={styles.container}>
            <Image containerStyle={styles.imgCtn} style={{ height: 90, resizeMode: 'contain' }}
                source={{ uri: book.thumbnail }} />
            <View>
                <Text style={{fontSize: 16, maxWidth: width-100}}>{book.title}</Text>
                <View style={{ display: "flex",alignItems: 'flex-start', marginTop: 8}}>
                    <Rating ratingCount={5}
                        imageSize={13}
                        readonly startingValue={rating} />
                    <Text style={{ fontWeight: '700', fontSize: 16, maxWidth: width-100 }}>{reviewHeader}</Text>
                </View>
                <Text style={{ color: '#626063', marginTop: 4,maxWidth: width-100 }}>
                    {reviewText}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderColor: '#ccc',
        borderBottomWidth: 1
    },
    imgCtn: {
        width: 70,
        marginRight: 8
    }
});

export default MyReviewItem;