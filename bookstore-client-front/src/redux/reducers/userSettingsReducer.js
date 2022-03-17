import { SORT_DIRECTION_LATEST, VIEW_MODE_GRID, CHANGE_VIEW_MODE, CHANGE_SHOP_PAGE, CHANGE_SORT_DIRECTION } from "../../constants";

const initialState = {
    sortDirection: SORT_DIRECTION_LATEST,
    viewMode: VIEW_MODE_GRID,
    shopPage: 1
}

const userSettingsReducer = (state=initialState, action)=>{
    switch (action.type){
        case CHANGE_VIEW_MODE:
            return {
                ...state,
                viewMode: action.viewMode
            }
        case CHANGE_SHOP_PAGE:
            return {
                ...state,
                shopPage: action.page
            }
        case CHANGE_SORT_DIRECTION:
            return {
                ...state,
                sortDirection: action.sortDirection
            }
        default: 
            return state;
    }
}

export default userSettingsReducer;