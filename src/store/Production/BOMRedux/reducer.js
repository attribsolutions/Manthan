import {
    BOM_API_ERROR_ACTION,
    DELETE_BOM_LIST_PAGE,
    DELETE_BOM_LIST_PAGE_SUCCESS,
    EDIT_BOM_LIST_ID,
    EDIT_BOM_LIST_ID_SUCCESS,
    GET_BOM_LIST_PAGE,
    GET_BOM_LIST_PAGE_SUCCESS,
    GET_ITEM_UNITS_DROPDOWN_API_SUCCESS,
    SAVE_BOM_MASTER,
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
    listBtnLoading: false,
    loading: false,
    saveBtnloading: false,
}

const BOMReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case SAVE_BOM_MASTER:
            return {
                ...state,
                saveBtnloading: true,
            }

        case SAVE_BOM_MASTER_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
                saveBtnloading: false,
            }

        // BOM List Page 
        case GET_BOM_LIST_PAGE:
            return {
                ...state,
                loading: true,
                BOMList: [],
            }
        case GET_BOM_LIST_PAGE_SUCCESS:
            return {
                ...state,
                BOMList: action.payload,
                loading: false,
            }

        //edit list page
        case EDIT_BOM_LIST_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }

        case EDIT_BOM_LIST_ID_SUCCESS:
            return {
                ...state,
                editData: action.payload,
                listBtnLoading: false,
            }

        case UPDATE_BOM_LIST_SUCCESS:
            return {
                ...state,
                updateMsg: action.payload,
            }

        case DELETE_BOM_LIST_PAGE:
            return {
                ...state,
                listBtnLoading: true,
            }
        case DELETE_BOM_LIST_PAGE_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
                listBtnLoading: false,
            }

        // GetItemUnits API
        case GET_ITEM_UNITS_DROPDOWN_API_SUCCESS:
            return {
                ...state,
                GetItemUnits: action.payload,
            };

        case BOM_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
                loading: false,
            }

        default:
            return state
    }
}

export default BOMReducer