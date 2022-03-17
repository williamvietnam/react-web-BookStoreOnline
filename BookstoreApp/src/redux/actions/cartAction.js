import { ADD_SINGLE_ITEM_TO_CART, ADDING_SINGLE_ITEMS_TO_CART, RESET_CART,
     ADD_SINGLE_ITEMS_TO_FAILED, INIT_CART,ERROR_OCCURED,ADD_ITEM_TO_CART_SUCCEEDED, CHANGING_CART_ITEM_QTY, CHANGE_CART_ITEM_QTY_SUCCESSFULLY, CHANGE_CART_ITEM_QTY_FAILED, REMOVE_ITEM_FROM_CART_SUCCESSFULLY } from "../../constants"
import { GET_BOOK_QTY } from "../../api/bookApi"
import { showToast } from "../../utils/common"
import AsyncStorage from "@react-native-community/async-storage"

export const initCart = (cartItems)=>{
    return {
        type: INIT_CART,
        cartItems
    }
}

const addingSingleItemToCart = ()=>{
    return {
        type: ADDING_SINGLE_ITEMS_TO_CART
    }
}

export const addSingleItemToCart = (item,qty)=>{
    return {
        type: ADD_SINGLE_ITEM_TO_CART,
        item,
        qty
    }
}

const addSingleItemToCartFail = ()=>{
    return {
        type: ADD_SINGLE_ITEMS_TO_FAILED
    }
}

const changingCartItemQty = ()=>{
    return {
        type: CHANGING_CART_ITEM_QTY
    }
}

const changeCartItemQtySuccess = (item,qty)=>{
    return {
        type: CHANGE_CART_ITEM_QTY_SUCCESSFULLY,
        item,
        qty
    }
}

const changeCartItemQtyFailed = ()=>{
    return {
        type: CHANGE_CART_ITEM_QTY_FAILED,
    }
}

export const removeItemFromCartSuccessfully = (itemId)=>{
    return{
        type: REMOVE_ITEM_FROM_CART_SUCCESSFULLY,
        itemId
    }
}

export const resetCart = ()=>{
    AsyncStorage.removeItem('bs_cart');
    return {
        type: RESET_CART
    }
}

export const changeCartItemQtyAsync = (client, item,qty)=>{
    return async dispatch=>{
        try{
            dispatch(changingCartItemQty());
            const res = await client.query({
                query: GET_BOOK_QTY,
                variables: {
                    id: item.id
                }
            });
            if (!qty||qty<=0){
                showToast(`Số cuốn sách không hợp lệ`);
                return;
            }
            const {qty: availableCopies} = res.data.getItemStockQty;
            if (availableCopies===null||availableCopies===undefined) throw new Error();
            if (qty>availableCopies){
                showToast(`Chỉ còn ${availableCopies} cuốn.`);
                dispatch(changeCartItemQtyFailed());
            }else{
                dispatch(changeCartItemQtySuccess(item,qty));
                showToast(ADD_ITEM_TO_CART_SUCCEEDED);
            }
        }catch(ex){
            showToast(ERROR_OCCURED);
            dispatch(changeCartItemQtyFailed());
        }
    }
}

export const addSingleItemToCartAysnc = (client, item,qty)=>{
    return async dispatch=>{
        try{
            dispatch(addingSingleItemToCart());
            const res = await client.query({
                query: GET_BOOK_QTY,
                fetchPolicy: 'network-only',
                variables: {
                    id: item.id
                }
            });
            if (!qty||qty<=0){
                showToast(`Số cuốn sách không hợp lệ`);
                return;
            }
            const {qty: availableCopies} = res.data.getItemStockQty;
            if (availableCopies===null||availableCopies===undefined) throw new Error();
            if (qty>availableCopies){
                showToast(`Chỉ còn ${availableCopies} cuốn.`);
                dispatch(addSingleItemToCartFail());
            }else{
                dispatch(addSingleItemToCart(item,qty));
                showToast(ADD_ITEM_TO_CART_SUCCEEDED);
            }
        }catch(ex){
            showToast(ERROR_OCCURED);
            dispatch(addSingleItemToCartFail());
        }
    }
}
