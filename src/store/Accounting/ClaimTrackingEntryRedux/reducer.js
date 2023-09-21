import {
    CLAIM_TRACKING_ENTRY_API_ERROR_ACTION,
    DELETE_CLAIM_TRACKING_ENTRY_ID,
    DELETE_CLAIM_TRACKING_ENTRY_ID_SUCCESS,
    EDIT_CLAIM_TRACKING_ENTRY_ID,
    EDIT_CLAIM_TRACKING_ENTRY_ID_SUCCESS,
    GET_CLAIM_TRACKING_ENTRY_LIST,
    GET_CLAIM_TRACKING_ENTRY_LIST_SUCCESS,
    SAVE_CLAIM_TRACKING_ENTRY,
    SAVE_CLAIM_TRACKING_ENTRY_SUCCESS,
    UPDATE_CLAIM_TRACKING_ENTRY_ID,
    UPDATE_CLAIM_TRACKING_ENTRY_ID_SUCCESS
} from "./actionType";

const INIT_STATE = {

    claimTrackingEntryList: [],
    postMsg: { Status: false },
    editMsg: { Status: false },
    updateMessage: { Status: false },
    deleteMessage: { Status: false },

    saveBtnloading: false,
    loading: false,
    listBtnLoading: false,

}

const ClaimTrackingEntry_Reducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GET_CLAIM_TRACKING_ENTRY_LIST:
            return {
                ...state,
                loading: true,
            }

        case GET_CLAIM_TRACKING_ENTRY_LIST_SUCCESS:
            return {
                ...state,
                claimTrackingEntryList: action.payload,
                loading: false,
            }

        case SAVE_CLAIM_TRACKING_ENTRY:
            return {
                ...state,
                saveBtnloading: true
            }

        case SAVE_CLAIM_TRACKING_ENTRY_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false
            }

        case EDIT_CLAIM_TRACKING_ENTRY_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            };

        case EDIT_CLAIM_TRACKING_ENTRY_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                editData: action.payload,
            };

        case UPDATE_CLAIM_TRACKING_ENTRY_ID:
            return {
                ...state,
                saveBtnloading: true
            };

        case UPDATE_CLAIM_TRACKING_ENTRY_ID_SUCCESS:
            return {
                ...state,
                updateMessage: action.payload,
                saveBtnloading: false
            };

        case DELETE_CLAIM_TRACKING_ENTRY_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            };

        case DELETE_CLAIM_TRACKING_ENTRY_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                deleteMessage: action.payload,
            };

        case CLAIM_TRACKING_ENTRY_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                loading: false,
            };

        default:
            return state
    }

}

export default ClaimTrackingEntry_Reducer