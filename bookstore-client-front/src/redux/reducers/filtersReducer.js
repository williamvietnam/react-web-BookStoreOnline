import { FILTER_TYPE_CAT, FILTER_TYPE_PRICE, FILTER_TYPE_AUTHOR, FILTER_TYPE_PUBLISHER, RESET_FILTERS } from "../../constants"
import _ from 'lodash';

const initialState = {
    category: undefined,
    price: undefined,
    author: undefined,
    publisher: undefined
}

export default function filtersReducer(state = initialState, action) {
    switch (action.type) {
        case FILTER_TYPE_CAT:
            return {
                ...state,
                category: action.value !== state.category ? action.value : undefined
            }
        case FILTER_TYPE_PRICE:
            return {
                ...state,
                price: !_.isEqual(action.value, state.price) ? action.value : undefined
            }
        case FILTER_TYPE_AUTHOR:
            return {
                ...state,
                author: action.value !== state.author ? action.value : undefined
            }
        case FILTER_TYPE_PUBLISHER:
            return {
                ...state,
                publisher: action.value !== state.publisher ? action.value : undefined
            }
        case RESET_FILTERS:
            return initialState;
        default:
            return state;
    }
}