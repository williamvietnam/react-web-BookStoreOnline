import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { calculateDiscount } from '../../utils/common';
import { useNavigation } from '@react-navigation/native';
import { Icon, Image } from 'react-native-elements';
import NumberFormat from 'react-number-format';
import { COLOR_BUTTON_PRIMARY } from '../../constants';

const {width} = Dimensions.get('window');

function WishListItem(props){
    const { book, hideBorderBottom } = props;
    const { id, title, thumbnail, basePrice, discounts = [] } = book;
    const [discountedPrice, discountRate, discountAmount] = calculateDiscount(basePrice, discounts);
    const navigation = useNavigation();
  
    return (
        <View style={{ ...styles.container, borderBottomWidth: hideBorderBottom ? 0 : 1 }}>
            <TouchableOpacity style={styles.ctnLeft} onPress={() => {
                navigation.navigate('BookDetailScreen', {
                    id
                })
            }}>
                <Image containerStyle={styles.imgCtn} style={{
                    height: 70,
                    resizeMode: 'contain'
                }} source={{ uri: thumbnail }} PlaceholderContent={<Icon type="antdesign" name="picture" />} />
                <View style={styles.infoCtn}>
                    <Text style={styles.bookTitle}>{title}</Text>
                    <NumberFormat value={discountedPrice} suffix={`đ`}
                        renderText={value => <Text style={styles.activePrice}>{value}</Text>}
                        displayType={'text'} thousandSeparator={true} />
                    {discountRate > 0 && <NumberFormat value={basePrice} suffix={`đ`}
                        renderText={value => <Text style={styles.oldPrice}>{value}</Text>} displayType={'text'}
                        thousandSeparator={true} />}
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 12
    },
    ctnLeft: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    ctnRight: {
    },
    imgCtn: {
        paddingVertical: 4,
        display: 'flex',
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginRight: 8
    },
    infoCtn: {

    },
    bookTitle: {
        marginBottom: 8,
        maxWidth: width - 80
    },
    activePrice: {
        color: COLOR_BUTTON_PRIMARY,
        fontSize: 16,
        fontWeight: '700'
    },
    oldPrice: {
        color: '#626063',
        textDecorationLine: 'line-through'
    }
});

export default WishListItem;