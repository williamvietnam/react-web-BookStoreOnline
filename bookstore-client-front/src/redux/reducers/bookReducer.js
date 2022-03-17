import { GETTING_BOOKS, GET_BOOKS_SUCCESSFULLY, GET_BOOKS_FAILED } from "../../constants"

let initialState = {
    books: [],
    totalCount: 0,
    error: undefined,
    loading: false
}

const bookReducer = (state = initialState, action) => {
    switch (action.type) {
        case GETTING_BOOKS:
            return {
                ...state,
                loading: true
            }
        case GET_BOOKS_SUCCESSFULLY:
            console.log(action)
            return {
                ...state,
                loading: false,
                books: action.books.books,
                totalCount: action.books.totalCount
            }
        case GET_BOOKS_FAILED:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        default:
            return state;
    }
}

export default bookReducer;