import { FILTER_TYPE_CAT, FILTER_TYPE_PRICE, FILTER_TYPE_AUTHOR, FILTER_TYPE_PUBLISHER, RESET_FILTERS, APPLY_FILTERS, RESET_FILTERS_TEMP, FILTER_TYPE_RATING, FILTER_TYPE_COLLECTION } from "../../constants"
import _ from 'lodash';

const initialState = {
    category: undefined,
    categoryTemporary: undefined,
    price: undefined,
    priceTemporary: undefined,
    author: undefined,
    authorTemporary: undefined,
    publisher: undefined,
    publisherTemporary: undefined,
    rating: undefined,
    ratingTemporary: undefined,
    collection: undefined,
    collectionTemporary: undefined
}

export default function filtersReducer(state = initialState, action) {
    switch (action.type) {
        case FILTER_TYPE_CAT:
            if (action.isTemporary) {
                return {
                    ...state,
                    categoryTemporary: action.value?.id !== state.categoryTemporary?.id ? action.value : undefined
                }
            }
            return {
                ...state,
                category: action.value?.id !== state.category?.id ? action.value : undefined,
                categoryTemporary: action.value?.id !== state.categoryTemporary?.id ? action.value : undefined
            }
        case FILTER_TYPE_PRICE:
            if (action.isTemporary) {
                return {
                    ...state,
                    priceTemporary: action.value?.id !== state.priceTemporary?.id ? action.value : undefined
                }
            }
            return {
                ...state,
                price: action.value?.id !== state.price?.id ? action.value : undefined,
                priceTemporary: action.value?.id !== state.priceTemporary?.id ? action.value : undefined
            }
        case FILTER_TYPE_AUTHOR:
            if (action.isTemporary) {
                return {
                    ...state,
                    authorTemporary: action.value?.id !== state.authorTemporary?.id ? action.value : undefined
                }
            }
            return {
                ...state,
                author: action.value?.id !== state.author?.id ? action.value : undefined,
                authorTemporary: action.value?.id !== state.authorTemporary?.id ? action.value : undefined
            }
        case FILTER_TYPE_PUBLISHER:
            if (action.isTemporary) {
                return {
                    ...state,
                    publisherTemporary: action.value?.id !== state.publisherTemporary?.id ? action.value : undefined
                }
            }
            return {
                ...state,
                publisher: action.value?.id !== state.publisher.id ? action.value : undefined,
                publisherTemporary: action.value?.id !== state.publisherTemporary?.id ? action.value : undefined
            }
        case FILTER_TYPE_RATING:
            if (action.isTemporary) {
                return {
                    ...state,
                    ratingTemporary: action.value?.id !== state.ratingTemporary?.id ? action.value : undefined
                }
            }
            return {
                ...state,
                rating: action.value?.id !== state.rating.id ? action.value : undefined,
                ratingTemporary: action.value?.id !== state.ratingTemporary?.id ? action.value : undefined
            }
        case FILTER_TYPE_COLLECTION:
            if (action.isTemporary) {
                return {
                    ...state,
                    collectionTemporary: action.value?.id !== state.collectionTemporary?.id ? action.value : undefined
                }
            }
            return {
                ...state,
                collection: action.value?.id !== state.collection.id ? action.value : undefined,
                collectionTemporary: action.value?.id !== state.collectionTemporary?.id ? action.value : undefined
            }
        case RESET_FILTERS:
            return initialState;
        case RESET_FILTERS_TEMP:
            return {
                ...state,
                categoryTemporary: undefined,
                priceTemporary: undefined,
                authorTemporary: undefined,
                publisherTemporary: undefined,
                ratingTemporary: undefined,
                collectionTemporary: undefined
            };
        case APPLY_FILTERS:
            return {
                ...state,
                category: state.categoryTemporary,
                price: state.priceTemporary,
                author: state.authorTemporary,
                publisher: state.publisherTemporary,
                rating: state.ratingTemporary,
                collection: state.collectionTemporary
            };
        default:
            return state;
    }
}