import {
    EDIT_BOM_LIST_ID_SUCCESS,
    GET_BOM_LIST_PAGE_SUCCESS,
    GET_ITEM_UNITS_DROPDOWN_API_SUCCESS,
    POST_BOM_SUCCESS
} from "./actionTypes"

const INIT_STATE = {
    PostData: { Status: false },
    GetItemUnits: [],
    BOMList: [],
    editData: { Status: false,},
}

const BOMReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_BOM_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
            }

        // GetItemUnits API
        case GET_ITEM_UNITS_DROPDOWN_API_SUCCESS:
            return {
                ...state,
                GetItemUnits: action.payload,
            };

        // BOM List Page 
        case GET_BOM_LIST_PAGE_SUCCESS:
            return {
                ...state,
                BOMList: action.payload,
            }
        //edit list page
        case EDIT_BOM_LIST_ID_SUCCESS:
            return {
                ...state,
                editData: action.payload,
            }
        default:
            return state
    }
}

export default BOMReducer