
import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons"
import {

    POST_GO_BUTTON_FOR_IBORDER_SUCCESS,
    POST_IBORDER_SUCCESS,
    POST_DIVISION_SUCCESS,
    IBORDER_LIST_FILTERS,
    POST_IBORDER_LIST_PAGE_SUCCESS,
    UPDATE_IBORDER_ID_FROM_IBORDER_PAGE_SUCCESS,
    EDIT_IBORDER_FOR_IBORDER_PAGE_SUCCESS,
    DELETE_IBORDER_FOR_IBORDER_PAGE_SUCCESS
   
} from "./actionType"

const INIT_STATE = {
    
    GoButton:null,
    Supplier: [],
    editData: { Status: false, Items: [] },
    postMsg: { Status: false },
    updateMsg: { Status: false },
    deleteMsg: { Status: false },

    iborderList: [],
    iborderlistFilter: { fromdate: currentDate, todate: currentDate,SupplierSelect: {value:'', label:"All"} },
}
const IBOrderReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // GO Button 

        case POST_GO_BUTTON_FOR_IBORDER_SUCCESS:
            return {
                ...state,
                GoButton: action.payload,
            }

        // Post Method 

        case POST_IBORDER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }

        //   Division Dropdown
        case POST_DIVISION_SUCCESS:
            return {
                ...state,
                Supplier: action.payload,
            }

        // filter list

        case IBORDER_LIST_FILTERS:
            return {
                ...state,
                iborderlistFilter: action.payload,
            }

        // Listpage
        case POST_IBORDER_LIST_PAGE_SUCCESS:
            return {
                ...state,
                iborderList: action.payload,
            }

        case UPDATE_IBORDER_ID_FROM_IBORDER_PAGE_SUCCESS:
            return {
                ...state,
                updateMsg: action.payload,
            }


        case EDIT_IBORDER_FOR_IBORDER_PAGE_SUCCESS:
            return {
                ...state,
                editData: action.payload,
            }


        case DELETE_IBORDER_FOR_IBORDER_PAGE_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            }

        default:
            return state
    }

}

export default IBOrderReducer