import moment from 'moment';
import { Platform, ToastAndroid } from 'react-native';

function getOrderStatusText(status) {
    switch (status) {
        case "Ordered":
            return "Đặt hàng thành công"
        case "Processing":
            return "Đang xử lý"
        case "GettingProduct":
            return "Đang lấy hàng";
        case "Packaged":
            return "Đóng gói";
        case "HandOver":
            return "Bàn giao vận chuyển";
        case "Shipping":
            return "Đang vận chuyển"
        case "Completed":
            return "Giao hàng thành công"
        case "Canceled":
            return "Đã hủy"
        default: return "Đặt hàng thành công"
    }
}

function calculateDiscount(basePrice, discounts) {
    let discountedPrice = basePrice;
    let discountAmount = 0;
    let discountRate = 0;
    for (let discount of discounts) {

        if (moment(discount.from).isBefore(moment()) && moment(discount.to).isAfter(moment())) {
            if (discount.usePercentage) {
                discountedPrice = (discountedPrice - (discountedPrice * discount.discountRate));
            } else {
                if (discountedPrice >= discount.discountAmount) {
                    discountedPrice = (discountedPrice - discount.discountAmount)
                } else {
                    discountedPrice = 0;
                }
            }
        }
    }
    discountAmount = basePrice - discountedPrice;
    discountRate = discountAmount / basePrice;
    return [discountedPrice, discountRate, discountAmount];
}

function showToast(err) {
    if (Platform.OS === "android") {
        ToastAndroid.show(err, 3000);
    } else {
    }
}

const getTotalScore = (data) => {
    if (!data) return 0;
    return data.fiveStar * 5 + data.fourStar * 4 + data.threeStar * 3
        + data.twoStar * 2 + data.oneStar * 1;
}

function roundHalf(num) {
    return Math.round(num * 2) / 2;
}

const calculateReviewScore = (data) => {
    if (!data) return 0;
    const totalScore = getTotalScore(data);
    return roundHalf(Math.round((totalScore / data.totalCount) * 10) / 10);
}

function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 450;
}
export {
    getOrderStatusText,
    calculateDiscount,
    showToast,
    calculateReviewScore,
    getTotalScore,
    roundHalf,
    isCloseToBottom
};