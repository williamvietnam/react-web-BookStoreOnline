import moment from 'moment';

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

function getOrderStatusColor(status) {
    switch (status) {
        case "Ordered":
            return "#4DC2F7"
        case "Processing":
            return "#108ee9"
        case "Completed":
            return "#87d068"
        case "Canceled":
            return "#f50"
        default: return "#4DC2F7"
    }
}

function calculateDiscount(basePrice, discounts) {
    let discountedPrice = basePrice;
    let discountRate = 0;
    for (let discount of discounts) {
        if (moment(discount.from).isBefore(moment()) && moment(discount.to).isAfter(moment())) {
            discountedPrice = (discountedPrice - (discountedPrice * discount.discountRate));
            discountRate = discount.discountRate;
        }
    }
    return [discountedPrice, discountRate];
}

function convertErrString(errString) {
    return errString.replace("GraphQL error: ", '').replace("Network error: ", '');
}

export { getOrderStatusText, calculateDiscount, convertErrString, getOrderStatusColor };