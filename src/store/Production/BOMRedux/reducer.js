import { currentDate_ymd } from "../../../components/Common/CommonFunction"
import {
    BOM_LIST_FILTERS,
    DELETE_BOM_LIST_PAGE_SUCCESS,
    EDIT_BOM_LIST_ID_SUCCESS,
    GET_BOM_LIST_PAGE_SUCCESS,
    GET_ITEM_UNITS_DROPDOWN_API_SUCCESS,
    SAVE_BOM_MASTER_SUCCESS,
    UPDATE_BOM_LIST_SUCCESS
} from "./actionTypes"

const INIT_STATE = {
    PostData: { Status: false },
    GetItemUnits: [],
    BOMList: [],
    editData: { Status: false, },
    updateMsg: { Status: false },
    deleteMsg: { Status: false },
    bomlistFilters: { fromdate: currentDate_ymd, todate: currentDate_ymd, }
}

const BOMReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case BOM_LIST_FILTERS:
            return {
                ...state,
                bomlistFilters: action.payload,
            }

        case SAVE_BOM_MASTER_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
            }

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

        case UPDATE_BOM_LIST_SUCCESS:
            return {
                ...state,
                updateMsg: action.payload,
            }

        case DELETE_BOM_LIST_PAGE_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            }

        // GetItemUnits API
        case GET_ITEM_UNITS_DROPDOWN_API_SUCCESS:
            return {
                ...state,
                GetItemUnits: action.payload,
            };
        default:
            return state
    }
}

export default BOMReducer