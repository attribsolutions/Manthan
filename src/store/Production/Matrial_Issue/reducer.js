import {
    DELETE_MATERIAL_ISSUE_LIST_PAGE,
    DELETE_MATERIAL_ISSUE_PAGE_SUCCESS, EDIT_MATERIAL_ISSUE_LIST_PAGE, EDIT_MATERIAL_ISSUE_LIST_PAGE_SUCCESS, GET_MATERIAL_ISSUE_LIST_PAGE, GET_MATERIAL_ISSUE_LIST_PAGE_SUCCESS,
    MATERIAL_ISSUE_API_ERROR_ACTION,
    POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER,
    POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER_SUCCESS, POST_MATERIAL_ISSUE, POST_MATERIAL_ISSUE_SUCCESS
} from "./actionType"

const INIT_STATE = {
    GoButton: [],
    postMsg: { Status: false },
    deleteMsg: { Status: false },
    editData: { Status: false },
    materialIssueList: [],
    saveBtnloading: false,
    listBtnLoading: false,
    goBtnloading: false,
    listGoBtnloading: false,
}

const MaterialIssueReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // GO Button 
        case POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER:

            return {
                ...state,
                goBtnloading: true,
            }
        case POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER_SUCCESS:
            return {
                ...state,
                GoButton: action.payload,
                goBtnloading: false,
            }

        // Post Method 
        case POST_MATERIAL_ISSUE:
            return {
                ...state,
                saveBtnloading: true,
            }
        case POST_MATERIAL_ISSUE_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,
            }

        // Material Issue List Page 
        case GET_MATERIAL_ISSUE_LIST_PAGE:
            return {
                ...state,
                listGoBtnloading: true,
            }
        case GET_MATERIAL_ISSUE_LIST_PAGE_SUCCESS:
            return {
                ...state,
                materialIssueList: action.payload,
                listGoBtnloading: false,
            }

        // Material Issue List Page 
        case EDIT_MATERIAL_ISSUE_LIST_PAGE:
            return {
                ...state,
                listBtnLoading: action.config.btnId,

            }
        case EDIT_MATERIAL_ISSUE_LIST_PAGE_SUCCESS:
            return {
                ...state,
                editData: action.payload,
                listBtnLoading: false,
            }

        // Delete list page

        case DELETE_MATERIAL_ISSUE_LIST_PAGE:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }
        case DELETE_MATERIAL_ISSUE_PAGE_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
                listBtnLoading: false,
            }

        case MATERIAL_ISSUE_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
                goBtnloading: false,
                listGoBtnloading: false,
            }
        default:
            return state
    }

}

export default MaterialIssueReducer