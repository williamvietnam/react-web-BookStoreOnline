import { CHANGE_VIEW_MODE, CHANGE_SHOP_PAGE, CHANGE_SORT_DIRECTION } from "../../constants";

export const changeViewMode = (viewMode)=>({
    type: CHANGE_VIEW_MODE,
    viewMode
});

export const changeShopPage = (page)=>({
    type: CHANGE_SHOP_PAGE,
    page
})

export const changeSortDirection = (sortDirection)=>({
    type: CHANGE_SORT_DIRECTION,
    sortDirection
});