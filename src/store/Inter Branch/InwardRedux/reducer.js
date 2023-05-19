import { currentDate_ymd } from "../../../components/Common/CommonFunction"
import { DELETE_INWARD_LIST_PAGE_SUCCESS, GET_INWARD_LIST_PAGE_SUCCESS, INWARD_LIST_FILTERS, MAKE_INWARD_SUCCESS, POST_INWARD_SUCCESS } from "./actionType"

const INIT_STATE = {
    postMsg: { Status: false },
    InwardList: [],
    deleteMsg: { Status: false },
    InwardlistFilter: { fromdate: currentDate_ymd, todate: currentDate_ymd, SupplierSelect: { value: '', label: "All" } },
    makeInward:[]
}

const InwardReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_INWARD_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }
        case GET_INWARD_LIST_PAGE_SUCCESS:
            return {
                ...state,
                InwardList: action.payload,
            }
        case INWARD_LIST_FILTERS:
            return {
                ...state,
                InwardlistFilter: action.payload,
            }
        case DELETE_INWARD_LIST_PAGE_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            }
            case MAKE_INWARD_SUCCESS:
                return {
                    ...state,
                    makeInward: action.payload,
                }
        default:
            return state
    }
}

export default InwardReducer