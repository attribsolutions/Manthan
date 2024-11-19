import { DELETE_SUB_CLUSTER_ID, DELETE_SUB_CLUSTER_ID_SUCCESS, EDIT_SUB_CLUSTER_ID, EDIT_SUB_CLUSTER_ID_SUCCESS, GET_SUB_CLUSTER_LIST, GET_SUB_CLUSTER_LIST_SUCCESS, SAVE_SUB_CLUSTER_MASTER, SAVE_SUB_CLUSTER_MASTER_SUCCESS, SUB_CLUSTER_API_ERROR_ACTION, UPDATE_SUB_CLUSTER_ID, UPDATE_SUB_CLUSTER_ID_SUCCESS } from "./actionType"

const INIT_STATE = {
    postMsg: { Status: false },
    subClusterListData: [],
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
    saveBtnloading: false,
    listBtnLoading: false,
    goBtnLoading: false
}

const SubClusterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case SAVE_SUB_CLUSTER_MASTER:
            return {
                ...state,
                saveBtnloading: true

            }

        case SAVE_SUB_CLUSTER_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false
            }

        // get api
        case GET_SUB_CLUSTER_LIST:
            return {
                ...state,
                goBtnLoading: true,
            }

        case GET_SUB_CLUSTER_LIST_SUCCESS:
            return {
                ...state,
                subClusterListData: action.payload,
                goBtnLoading: false,
            }

        case DELETE_SUB_CLUSTER_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            };


        case DELETE_SUB_CLUSTER_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                deleteMessage: action.payload,
            };

        case EDIT_SUB_CLUSTER_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            };


        case EDIT_SUB_CLUSTER_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                editData: action.payload,
            };

        // update api

        case UPDATE_SUB_CLUSTER_ID:
            return {
                ...state,
                saveBtnloading: true

            };

        case UPDATE_SUB_CLUSTER_ID_SUCCESS:
            return {
                ...state,
                updateMessage: action.payload,
                saveBtnloading: false

            };

        case SUB_CLUSTER_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
                goBtnLoading: false
            };

        default:
            return state
    }
}

export default SubClusterReducer