import React from 'react';
import { View, StyleSheet, SectionList } from 'react-native';
import BookSection from './books/BookSection';
import { Divider } from 'react-native-elements';
import { GET_BOOKS, GET_BEST_SELLER } from '../../api/bookApi';

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: "#ccc",
        height: '100%'
    }
})

const sections = [{
    title: "Sách mới",
    variables: {
        orderBy: 'createdAt_DESC',
        first: 15,
        skip: 0
    },
},
{
    title: "Kinh điển",
    variables: {
        where: {
            categories_some: {
                id: "ck63t10bb00c30818qwhmi7no"
            }
        },
        orderBy: 'createdAt_DESC',
        first: 15,
        skip: 0
    },
}, 
{
    title: "Bán chạy",
    variables: {
        first: 15,
        skip: 0
    },
    isBestSeller: true
},
{
    title: "Đang khuyến mại",
    variables: {
        where: {
            discounts_some: {
                from_lte: new Date(),
                to_gte: new Date() 
            }
        },
        orderBy: 'createdAt_DESC',
        first: 15,
        skip: 0
    },
}]


function HomeScreenContent(props) {

    return (
        <View style={styles.outerContainer}>
            {sections.map((section,index) => <BookSection key={index} name={section.title} isBestSeller={section.isBestSeller}
                variables={section.variables} />)}
        </View>
    )

}

export default HomeScreenContent;