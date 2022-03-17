import React, { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { View, StyleSheet, Text, Dimensions, TextInput, ScrollView } from 'react-native';
import { Image, Divider, Button, Input, Rating } from 'react-native-elements';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_BOOK_REVIEW } from '../api/reviewApi';
import { showToast } from '../utils/common';

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',
        backgroundColor: '#fff'
    },
    bookInfo: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6
    },
    bookTitle: {
        width: width - 90
    },
    img: {
        height: 70,
        resizeMode: 'contain'
    },
    imgCtn: {
        display: 'flex',
        width: 60,
        marginRight: 8
    },
    scrollView: {
        width: '100%',
    },
    sectionDivider: {
        height: 6,
        backgroundColor: '#ccc'
    },
    btnCtn: {
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    inputCtn: {
        paddingHorizontal: 12,
        marginVertical: 8,
        display: 'flex',
    },
    input: {
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#cdcdcd',
        paddingHorizontal: 8,
        marginVertical: 8,
        fontSize: 13
    }
})

function CreateReviewScreen() {

    const route = useRoute();
    const navigation = useNavigation();
    const { id, thumbnail, title } = route.params.book;

    const [inputs, setInputs] = useState({
        rating: 5,
        reviewHeader: '',
        reviewText: ''
    })

    function handleInputChange(name,val){
        setInputs(prev=>({
            ...prev,
            [name]: val
        }))
    };

    const [createReview, {loading}] = useMutation(CREATE_BOOK_REVIEW,{
        onError(){
            showToast("Có lỗi xảy ra khi thêm đánh giá");
        },
        onCompleted(){
            showToast("Thêm đánh giá thành công");
            navigation.navigate("ReviewScreen", {
                bookId: id,
                title,
                thumbnail
            })
        }
    })

    return (<View style={styles.container}>
        <HeaderBackAction title="Viết đánh giá" />
        <ScrollView style={styles.scrollView}>
            <View style={styles.bookInfo}>
                <Image style={styles.img}
                    containerStyle={styles.imgCtn}
                    source={{ uri: thumbnail }} />
                <Text style={styles.bookTitle}>{title}</Text>
            </View>
            <Divider style={styles.sectionDivider} />
            <View style={{ ...styles.inputCtn }}>
                <Text style={{ alignSelf: 'center', fontSize: 18 }}>Điểm số</Text>
                <Rating style={{ marginVertical: 8 }} startingValue={5}
                    ratingCount={5} imageSize={24} fractions={0} 
                    onFinishRating={(val) => handleInputChange('rating',val)} />
                <TextInput placeholder="Tiêu đề đánh giá"
                    value={inputs.reviewHeader}
                    onChangeText={(val)=>handleInputChange('reviewHeader',val)}
                    style={{ ...styles.input, paddingVertical: 6, height: 32 }} textAlignVertical="center"
                />
                <TextInput multiline numberOfLines={8}
                    value={inputs.reviewText}
                    onChangeText={(val)=>handleInputChange('reviewText',val)}
                    style={styles.input} textAlignVertical="top"
                    placeholder="Hãy chia sẻ đánh giá của bạn về sản phẩm này nhé" />
            </View>
        </ScrollView>
        <View style={styles.btnCtn}>
            <Button loading={loading} 
            onPress={()=>{
                createReview({
                    variables: {
                        data: {
                            reviewText: inputs.reviewText,
                            reviewHeader: inputs.reviewHeader,
                            rating: inputs.rating,
                            book: id
                        }
                    }
                })
            }}
             title="Gửi"></Button>
        </View>
    </View>)
}

export default CreateReviewScreen;