import { ADD_SINGLE_ITEM_TO_CART, ADDING_SINGLE_ITEMS_TO_CART, ADD_SINGLE_ITEMS_TO_FAILED, CHANGE_CART_ITEM_QTY_FAILED, CHANGE_CART_ITEM_QTY_SUCCESSFULLY, CHANGING_CART_ITEM_QTY, REMOVE_ITEM_FROM_CART_SUCCESSFULLY, RESET_CART, INIT_CART } from "../../constants";
import { calculateDiscount } from "../../utils/common";
import AsyncStorage from "@react-native-community/async-storage";


const calculateCartTotalQty = (items) => {
    if (items.length === 0) return 0;
    if (items.length === 1) return items[0].qty;
    let totalQty = 0;
    for (let item of items) {
        totalQty += item.qty;
    }
    return totalQty;
}

const calculateCartSubTotal = (items) => {
    if (items.length === 0) return 0;
    if (items.length === 1) {
        const [discountedPrice, discountRate] = calculateDiscount(items[0].basePrice, items[0].discounts);
        return items[0].qty * discountedPrice;
    }
    let subTotal = 0;
    for (let item of items) {
        const [discountedPrice, discountRate] = calculateDiscount(item.basePrice, item.discounts);
        subTotal += discountedPrice * item.qty;
    }
    return subTotal;
}
// const bsCartJSON = AsyncStorage.getItem('bs_cart');
// let cartItems = [];
// try {
//     cartItems = JSON.parse(bsCartJSON);
//     if (!Array.isArray(cartItems)) {
//         cartItems = [];
//     }
// } catch{
//     cartItems = [];
// }

const initialState = {
    items: [],
    adding: false,
    cartTotalQty: 0,
    cartSubTotal: 0
}

export default function cartReducer(state = initialState, action) {
    console.log(state)
    let items = [...state.items];
    let itemExisted = null;
    switch (action.type) {
        case INIT_CART: 
            return{
                items: action.cartItems,
                adding: false,
                cartTotalQty: calculateCartTotalQty(action.cartItems),
                cartSubTotal: calculateCartSubTotal(action.cartItems)
            }
        case ADDING_SINGLE_ITEMS_TO_CART:
        case CHANGING_CART_ITEM_QTY:
            return {
                ...state,
                adding: true
            }
        case ADD_SINGLE_ITEM_TO_CART:
            itemExisted = items.find(item => item.id === action.item.id);
            if (itemExisted) {
                itemExisted.qty = itemExisted.qty + parseInt(action.qty)
            } else {
                items.push({ ...action.item, qty: action.qty });
            }
            AsyncStorage.setItem('bs_cart', JSON.stringify(items));
            return {
                ...state,
                cartTotalQty: calculateCartTotalQty(items),
                cartSubTotal: calculateCartSubTotal(items),
                items,
                adding: false
            }
        case CHANGE_CART_ITEM_QTY_SUCCESSFULLY:
            itemExisted = items.find(item => item.id === action.item.id);
            if (itemExisted) {
                itemExisted.qty = parseInt(action.qty)
            }
            AsyncStorage.setItem('bs_cart', JSON.stringify(items));
            return {
                ...state,
                adding: false,
                cartTotalQty: calculateCartTotalQty(items),
                cartSubTotal: calculateCartSubTotal(items),
                items,
            }
        case CHANGE_CART_ITEM_QTY_FAILED:
        case ADD_SINGLE_ITEMS_TO_FAILED:
            return {
                ...state,
                adding: false
            }
        case REMOVE_ITEM_FROM_CART_SUCCESSFULLY:
            items = items.filter(item => item.id !== action.itemId);
            AsyncStorage.setItem('bs_cart', JSON.stringify(items));
            return {
                ...state,
                items,
                cartTotalQty: calculateCartTotalQty(items),
                cartSubTotal: calculateCartSubTotal(items)
            }
        case RESET_CART:
            return {
                items: [],
                adding: false,
                cartTotalQty: 0,
                cartSubTotal: 0
            }
        default: return state;
    }
}