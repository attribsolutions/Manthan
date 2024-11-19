import {
    POST_METHOD_FOR_GENERAL_API_SUCCESS,
    POST_GENERAL_LIST_SUCCESS,
    DELETE_GENERAL_ID_SUCCESS,
    EDIT_GENERAL_ID_SUCCESS,
    UPDATE_GENERAL_ID_SUCCESS,
    GENARAL_MASTER_BY_TYPE_SUCCESS,
    GENERAL_MASTER_SUB_TYPE_SUCCESS,
    POST_METHOD_FOR_GENERAL_API,
    UPDATE_GENERAL_ID,
    POST_GENERAL_LIST,
    DELETE_GENERAL_ID,
    EDIT_GENERAL_ID
} from "./actionType";

const INIT_STATE = {
    saveBtnloading: false,
    listBtnLoading:false,
    loading:false,
    postMsg: { Status: false },
    GeneralList: [],
    Type: [],
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
    GeneralMasterSubType: []
}

const GeneralReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_METHOD_FOR_GENERAL_API:
            return {
                ...state,
                saveBtnloading: true,
            }

        case POST_METHOD_FOR_GENERAL_API_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,
            }

        // get api

        case POST_GENERAL_LIST:
            return {
                ...state,
                loading: true,
            }

        case POST_GENERAL_LIST_SUCCESS:
            return {
                ...state,
                GeneralList: action.payload,
                loading: false,
            }


        case DELETE_GENERAL_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            };

        case DELETE_GENERAL_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                deleteMessage: action.payload,
            };


        case EDIT_GENERAL_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            };

        case EDIT_GENERAL_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                editData: action.payload,
            };

        // update api

        case UPDATE_GENERAL_ID:
            return {
                ...state,
                saveBtnloading: true,
            };

        case UPDATE_GENERAL_ID_SUCCESS:
            return {
                ...state,
                updateMessage: action.payload,
                saveBtnloading: false,

            };

        /// TypeDropdown
        case GENARAL_MASTER_BY_TYPE_SUCCESS:
            return {
                ...state,
                Type: action.payload,
            };

        case GENERAL_MASTER_SUB_TYPE_SUCCESS:
            return {
                ...state,
                GeneralMasterSubType: action.payload,
            };
        default:
            return state
    }
}

export default GeneralReducer