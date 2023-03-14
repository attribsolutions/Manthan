import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/CommonFunction"
import { GET_MATERIAL_ISSUE_LIST_PAGE_SUCCESS, MATERIAL_ISSUE_LIST_FILTERS, POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER_SUCCESS, POST_MATERIAL_ISSUE_SUCCESS } from "./actionType"

const INIT_STATE = {
    GoButton: [],
    postMsg: { Status: false },
    materialIssueList: [],
    materialIssuelistFilters: { fromdate: currentDate, todate: currentDate, }

}

const MaterialIssueReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case MATERIAL_ISSUE_LIST_FILTERS:
            return {
                ...state,
                materialIssuelistFilters: action.payload,
            }

        // GO Button 
        case POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER_SUCCESS:
            return {
                ...state,
                GoButton: action.payload,
            }

        // Post Method 
        case POST_MATERIAL_ISSUE_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }

        // BOM List Page 
        case GET_MATERIAL_ISSUE_LIST_PAGE_SUCCESS:
            return {
                ...state,
                materialIssueList: action.payload,
            }
        default:
            return state
    }
}

export default MaterialIssueReducer