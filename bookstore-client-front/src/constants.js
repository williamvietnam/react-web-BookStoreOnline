//Book constant
export const GETTING_BOOKS = "GETTING_BOOKS";
export const GET_BOOKS_SUCCESSFULLY = "GET_BOOKS_SUCCESSFULLY";
export const GET_BOOKS_FAILED = "GET_BOOKS_FAILED";
export const GETTING_BOOK = "GETTING_BOOK";
export const GET_BOOK_SUCCESSFULLY = "GET_BOOK_SUCCESSFULLY";
export const GET_BOOK_FAILED = "GET_BOOK_FAILED";
//End Book constant

//user settings constants
export const CHANGE_VIEW_MODE = "CHANGE_VIEW_MODE";
export const CHANGE_SHOP_PAGE = "CHANGE_SHOP_PAGE";
export const CHANGE_SORT_DIRECTION = "CHANGE_SORT_DIRECTION";
//end user settings constants

//common constants
export const VIEW_MODE_GRID = "VIEW_MODE_GRID";
export const VIEW_MODE_LIST = "VIEW_MODE_LIST";
export const SORT_DIRECTION_NAME_AZ = "title_ASC";
export const SORT_DIRECTION_NAME_ZA = "title_DESC";
export const SORT_DIRECTION_LATEST = "createdAt_DESC";
export const SORT_DIRECTION_PRICE_ASC = "basePrice_ASC";
export const SORT_DIRECTION_PRICE_DESC = "basePrice_DESC";
//end common constants

//filter types
export const FILTER_TYPE_CAT = 'poroduct--cat';
export const FILTER_TYPE_PRICE = 'pro--range';
export const FILTER_TYPE_TAG = 'poroduct--tag poroduct--cat';
export const FILTER_TYPE_AUTHOR = 'poroduct--auth poroduct--cat';
export const FILTER_TYPE_PUBLISHER = 'poroduct--pub poroduct--cat';
export const RESET_FILTERS = 'RESET_FILTERS';
//end filter types

//auth 

export const SIGNING_UP = 'SIGNING_UP';
export const SIGN_UP_SUCCESSFULLY = 'SIGN_UP_SUCCESSFULLY';
export const SIGN_UP_FAILED = 'SIGN_UP_FAILED';
export const LOGGING_IN = 'LOGGING_IN';
export const LOG_IN_SUCCESSFULLY = 'LOG_IN_SUCCESSFULLY';
export const LOG_IN_FAILED = 'LOG_IN_FAILED';
export const LOG_OUT = 'LOG_OUT';
export const UPDATING_USER = 'UPDATING_USER';
export const UPDATE_USER_SUCCESSFULLY = 'UPDATE_USER_SUCCESSFULLY';
export const UPDATE_USER_FAILED = 'UPDATE_USER_FAILED';

//end auth

//datetime
export const DATE_TIME_VN_24H = "HH:mm:ss DD-MM-YYYY"
export const DATE_VN = "DD-MM-YYYY"
export const DATE_US = "YYYY-MM-DD"

//end datetime

//cart
export const ADD_SINGLE_ITEM_TO_CART = "ADD_SINGLE_ITEM_TO_CART";
export const ADDING_SINGLE_ITEMS_TO_CART ="ADDING_SINGLE_ITEM_TO_CART";
export const ADD_SINGLE_ITEMS_TO_FAILED ="ADD_SINGLE_ITEM_TO_CART_FAILED";
export const CHANGING_CART_ITEM_QTY ="CHANGING_CART_ITEM_QTY";
export const CHANGE_CART_ITEM_QTY_SUCCESSFULLY ="CHANGE_CART_ITEM_QTY_SUCCESSFULLY";
export const CHANGE_CART_ITEM_QTY_FAILED ="CHANGE_CART_ITEM_QTY_FAILED";
export const REMOVE_ITEM_FROM_CART_SUCCESSFULLY = "REMOVE_ITEM_FROM_CART_SUCCESSFULLY";
export const RESET_CART = "RESET_CART";

//end cart

//error
export const ERROR_OCCURED = 'Có lỗi xảy ra, vui lòng thử lại sau.';
export const NO_ITEM_IN_CART = 'Bạn không có sản phẩm nào trong giỏ.';
export const ADD_ITEM_TO_CART_SUCCEEDED = 'Đã thêm vào giỏ hàng của bạn.';
//end error
