import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons"
import { DELETE_INWARD_LIST_PAGE_SUCCESS, GET_INWARD_LIST_PAGE_SUCCESS, INWARD_LIST_FILTERS, POST_INWARD_SUCCESS } from "./actionType"

const INIT_STATE = {
    postMsg: { Status: false },
    InwardList: [],
    deleteMsg: { Status: false },
    InwardlistFilter: { fromdate: currentDate, todate: currentDate, SupplierSelect: { value: '', label: "All" } },
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
        default:
            return state
    }
}

export default InwardReducer