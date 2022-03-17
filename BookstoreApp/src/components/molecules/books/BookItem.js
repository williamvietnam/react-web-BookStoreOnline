import React, { useRef } from 'react';
import { Image, Icon, Rating } from 'react-native-elements';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import NumberFormat from 'react-number-format';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { COLOR_BUTTON_PRIMARY } from '../../../constants';

const styles = StyleSheet.create({
    container: {
        width: '50%',
        padding: 12,
        display: 'flex',
        borderColor: "#e1e5eb",
        borderBottomWidth: 1,
        flexDirection: 'column',
    },
    imgCtn: {
        paddingVertical: 4,
        display: 'flex',
        flexWrap: 'wrap',
    },
    ratingCtn: {
        marginVertical: 4,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingScore: {
        marginRight: 4
    },
    ratingCount: {
        fontSize: 11,
        color: "#ccc",
    },
    discountRate: {
        fontSize: 11,
        marginLeft: 8,
        color: "#ccc",
    },
    title: {
        fontSize: 12,
        height: 30
    },
    discountBadge: {
        backgroundColor: COLOR_BUTTON_PRIMARY,
        color:'#fff',
        position: 'absolute',
        borderRadius: 20,
        padding: 2,
        paddingHorizontal: 4,
        top: 8,
        right: 8,
        fontSize: 12
    }
})

function BookItem(props) {

    const { book, index } = props;
    const { id, thumbnail, title, basePrice, discounts, reviews } = book;
    const { discountedPrice, discountRate } = discounts;
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{ ...styles.container, borderRightWidth: index % 2 === 0 ? 1 : 0 }} onPress={() => navigation.navigate("BookDetailScreen", { id })}>
            <View>
                <Image containerStyle={styles.imgCtn} style={{
                    height: 135,
                    resizeMode: 'contain'
                }} source={{ uri: thumbnail }} PlaceholderContent={<Icon type="antdesign" name="picture" />} />

                <Text style={styles.title} ellipsizeMode="tail" numberOfLines={2}>{title}</Text>
                <View style={styles.ratingCtn}>
                    <Rating style={styles.ratingScore}
                        readonly startingValue={reviews.avgRating}
                        ratingBackgroundColor="#ccc"
                        imageSize={12} ratingCount={reviews.totalCount > 0 ? 5 : 0} />
                    {reviews.totalCount > 0 && <NumberFormat value={reviews.totalCount}
                        renderText={value => <Text style={styles.ratingCount}>({value})</Text>} displayType={'text'} thousandSeparator={true} />}
                </View>
                <View style={styles.ratingCtn}>
                    <NumberFormat value={discountedPrice} suffix={` đ`} renderText={value => <Text >{value}</Text>} displayType={'text'} thousandSeparator={true} />
                    {discountRate > 0 && <Text style={styles.discountRate}>-{discountRate * 100}%</Text>}
                </View>
            </View>
            {discountRate>0&&<Text style={styles.discountBadge}>
                -{discountRate*100}%
            </Text>}
        </TouchableOpacity>
    )
}

export default BookItem;