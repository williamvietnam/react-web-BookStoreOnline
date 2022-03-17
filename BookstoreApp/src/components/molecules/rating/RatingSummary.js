import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { Rating } from 'react-native-elements';
import { Bar } from 'react-native-progress';
import { calculateReviewScore, roundHalf } from '../../../utils/common';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%'
    },
    avgRatingCtn: {
        display: "flex", 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRightColor: '#ccc',
        // borderRightWidth: 1, 
        paddingHorizontal: 12,
        width: 100
    },
    starPercentageRowCtn: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        paddingRight: 12,
    },
    starPercentageRow: {
        marginVertical: 4,
        display: "flex",
        width: '100%',
        overflow: 'scroll',
        flexDirection: 'row',
        alignItems: 'center',
    },
    percentageText: {
        fontSize: 11,
        color: '#626063',
    },
    bar: {
        height: 7,
        marginRight: 8,
        marginLeft: 8,
        // maxWidth: 125
    }

})

function RatingSummary(props) {

    const { bookReviews, gettingBookReviews } = props;

    const avgRating = calculateReviewScore(bookReviews.getBookReviewsByBook);
    const { fiveStar, fourStar, threeStar, twoStar, oneStar, totalCount } = bookReviews.getBookReviewsByBook;
    let fourStarPercent = 0;
    let threeStarPercent = 0;
    let twoStarPercent = 0;
    let fiveStarPercent = 0;
    let oneStarPercent = 0;
    if (totalCount > 0) {
        fourStarPercent = roundHalf(fourStar / totalCount * 100);
        threeStarPercent = roundHalf(threeStar / totalCount * 100);
        twoStarPercent = roundHalf(twoStar / totalCount * 100);
        fiveStarPercent = roundHalf(fiveStar / totalCount * 100);
        oneStarPercent = roundHalf(oneStar / totalCount * 100);
    }
    return (
        <View style={styles.container}>
            <View style={styles.avgRatingCtn}>
                {gettingBookReviews ? <ActivityIndicator /> : <>
                    <Text style={{ fontSize: 36, fontWeight: '700' }}>{isNaN(avgRating) && !avgRating ? 0 : avgRating.toFixed(1)}</Text>
                    <Rating
                        readonly startingValue={isNaN(avgRating) && !avgRating ? 0 : avgRating}
                        ratingBackgroundColor="#ccc"
                        imageSize={13} ratingCount={5} />
                    <Text style={{ color: '#626063', fontSize: 11, textAlign: 'center' }}>{Intl.NumberFormat().format(bookReviews.getBookReviewsByBook.totalCount)} đánh giá</Text>
                </>}
            </View>
            <View style={styles.starPercentageRowCtn}>
                <View style={styles.starPercentageRow}>
                    <Rating
                        readonly startingValue={5}
                        ratingBackgroundColor="#ccc"
                        imageSize={10} ratingCount={5} />
                    <Bar progress={isNaN(fiveStarPercent) ? 0 : fiveStarPercent / 100} animated={false} color="#16687a" style={styles.bar} />
                    <Text style={styles.percentageText}>{fiveStarPercent}% ({fiveStar})</Text>
                </View>
                <View style={styles.starPercentageRow}>
                    <Rating
                        readonly startingValue={4}
                        ratingBackgroundColor="#ccc"
                        imageSize={10} ratingCount={5} />
                    <Bar progress={isNaN(fourStarPercent) ? 0 : fourStarPercent / 100} animated={false} color="#16687a" style={styles.bar} />
                    <Text style={styles.percentageText}>{fourStarPercent}% ({fourStar})</Text>
                </View>
                <View style={styles.starPercentageRow}>
                    <Rating
                        readonly startingValue={3}
                        ratingBackgroundColor="#ccc"
                        imageSize={10} ratingCount={5} />
                    <Bar progress={isNaN(threeStarPercent) ? 0 : threeStarPercent / 100} animated={false} color="#16687a" style={styles.bar} />
                    <Text style={styles.percentageText}>{threeStarPercent}% ({threeStar})</Text>
                </View>
                <View style={styles.starPercentageRow}>
                    <Rating
                        readonly startingValue={2}
                        ratingBackgroundColor="#ccc"
                        imageSize={10} ratingCount={5} />
                    <Bar progress={isNaN(twoStarPercent) ? 0 : twoStarPercent / 100} animated={false} color="#16687a" style={styles.bar} />
                    <Text style={styles.percentageText}>{twoStarPercent}% ({twoStar})</Text>
                </View>
                <View style={styles.starPercentageRow}>
                    <Rating
                        readonly startingValue={1}
                        ratingBackgroundColor="#ccc"
                        imageSize={10} ratingCount={5} />
                    <Bar progress={isNaN(oneStarPercent) ? 0 : oneStarPercent / 100} animated={false} color="#16687a" style={styles.bar} />
                    <Text style={styles.percentageText}>{oneStarPercent}% ({oneStar})</Text>
                </View>
            </View>
        </View>
    )

}

export default RatingSummary;