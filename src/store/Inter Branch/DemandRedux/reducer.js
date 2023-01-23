
import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons"
import {
    POST_GO_BUTTON_FOR_DEMAND_SUCCESS,
    POST_DEMAND_SUCCESS,
    POST_DIVISION_SUCCESS,
    DEMAND_LIST_FILTERS,
    POST_DEMAND_LIST_PAGE_SUCCESS,
    UPDATE_DEMAND_ID_FROM_DEMAND_PAGE_SUCCESS,
    EDIT_DEMAND_FOR_DEMAND_PAGE_SUCCESS,
    DELETE_DEMAND_FOR_DEMAND_PAGE_SUCCESS
} from "./actionType"

const INIT_STATE = {
    
    GoButton:null,
    InterBranches: [],
    editData: { Status: false, Items: [] },
    postMsg: { Status: false },
    updateMsg: { Status: false },
    deleteMsg: { Status: false },
    demandList: [],
    demandlistFilter: { fromdate: currentDate, todate: currentDate,divisionSelect: {value:'', label:""} },
}
const DemandReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // GO Button 
        case POST_GO_BUTTON_FOR_DEMAND_SUCCESS:
            return {
                ...state,
                GoButton: action.payload,
            }

        // Post Method 
        case POST_DEMAND_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }

        //   Division Dropdown
        case POST_DIVISION_SUCCESS:
            return {
                ...state,
                InterBranches: action.payload,
            }

        // filter list
        case DEMAND_LIST_FILTERS:
            return {
                ...state,
                demandlistFilter: action.payload,
            }

        // Listpage
        case POST_DEMAND_LIST_PAGE_SUCCESS:
            return {
                ...state,
                demandList: action.payload,
            }

        case UPDATE_DEMAND_ID_FROM_DEMAND_PAGE_SUCCESS:
            return {
                ...state,
                updateMsg: action.payload,
            }

        case EDIT_DEMAND_FOR_DEMAND_PAGE_SUCCESS:
            return {
                ...state,
                editData: action.payload,
            }

        case DELETE_DEMAND_FOR_DEMAND_PAGE_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            }

        default:
            return state
    }

}

export default DemandReducer