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

function generateOrderNumber(count){
    let orderNumber = ""
    if (count<10){
        orderNumber = "00000000" + count
    }else if (count >=10&&count<100){
        orderNumber = "0000000" + count
    }else if (count >=100&&count<1000){
        orderNumber = "000000" + count
    }else if (count >=1000&&count<10000){
        orderNumber = "00000" + count
    }else if (count >=10000&&count<100000){
        orderNumber = "0000" + count
    }else if (count >=100000&&count<1000000){
        orderNumber = "000" + count
    }else if (count >=1000000&&count<10000000){
        orderNumber = "00" + count
    }else if (count >=10000000&&count<100000000){
        orderNumber = "0" + count
    }else if (count >=100000000&&count<1000000000){
        orderNumber = ""+ count;
    }
    return orderNumber;
}

function calculateDiscount(basePrice, discounts){
    let discountedPrice = basePrice;
    let discountAmount = 0;
    let discountRate = 0;
    for (let discount of discounts) {

      if (moment(discount.from).isBefore(moment()) && moment(discount.to).isAfter(moment())) {
        if (discount.usePercentage) {
            discountedPrice = (discountedPrice - (discountedPrice * discount.discountRate));
        } else {
            if (discountedPrice>=discount.discountAmount) {
                discountedPrice = (discountedPrice - discount.discountAmount)
            }else{
                discountedPrice = 0;
            }
        }
      }
    }
    discountAmount = basePrice - discountedPrice;
    discountRate = discountAmount/basePrice;
    return [discountedPrice, discountRate, discountAmount];
}
export {getOrderStatusText,calculateDiscount,generateOrderNumber};