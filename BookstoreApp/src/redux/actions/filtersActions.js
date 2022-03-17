import { APPLY_FILTERS ,RESET_FILTERS_TEMP} from "../../constants";

export const changeFilter = (type,value, isTemporary=false) => ({
    type,
    value,
    isTemporary
});

export const applyFilter = () => ({
    type: APPLY_FILTERS
});

export const resetFilterTemp = () => ({
    type: RESET_FILTERS_TEMP
});