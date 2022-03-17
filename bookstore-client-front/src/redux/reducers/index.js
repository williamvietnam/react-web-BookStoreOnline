import {
    combineReducers
} from 'redux';
import bookReducer from './bookReducer';
import userSettingsReducer from './userSettingsReducer';
import filtersReducer from './filtersReducer';
import authReducer from './authReducer';
import cartReducer from './cartReducer';

const rootReducer = combineReducers({
    books: bookReducer,
    userSettings: userSettingsReducer,
    filters: filtersReducer,
    auth: authReducer,
    cart: cartReducer
})

export default rootReducer;