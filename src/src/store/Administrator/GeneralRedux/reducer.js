import {
    POST_METHOD_FOR_GENERAL_API_SUCCESS,
    POST_GENERAL_LIST_SUCCESS,
    DELETE_GENERAL_ID_SUCCESS,
    EDIT_GENERAL_ID_SUCCESS,
    UPDATE_GENERAL_ID_SUCCESS,
    POST_TYPE_SUCCESS,
    GENERAL_MASTER_SUB_TYPE_SUCCESS
} from "./actionType";

const INIT_STATE = {
    PostDataMessage: { Status: false },
    GeneralList: [],
    Type: [],
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
    GeneralMasterSubType:[]
}

const GeneralReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_METHOD_FOR_GENERAL_API_SUCCESS:
            return {
                ...state,
                PostDataMessage: action.payload,
            }

        // get api
        case POST_GENERAL_LIST_SUCCESS:
            return {
                ...state,
                GeneralList: action.payload,
            }

        case DELETE_GENERAL_ID_SUCCESS:
            return {
                ...state,
                deleteMessage: action.payload,
            };

        case EDIT_GENERAL_ID_SUCCESS:
            return {
                ...state,
                editData: action.payload,
            };

        // update api
        case UPDATE_GENERAL_ID_SUCCESS:
            return {
                ...state,
                updateMessage: action.payload,
            };

        /// TypeDropdown
        case POST_TYPE_SUCCESS:
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