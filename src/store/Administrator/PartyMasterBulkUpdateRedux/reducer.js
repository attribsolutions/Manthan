import {
    GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE,
    GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS,
    PARTYBULK_API_ERROR_ACTION,
    POST_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS,
    POST_PARTY_NAME_SUCCESS,
    POST_SELECT_FIELD_SUCCESS,
    UPDATE_PARTY_MASTER_BULK,
    UPDATE_PARTY_MASTER_BULK_SUCCESS
} from "./actionTypes"

const INIT_STATE = {
    goButton: [],
    postMsg: { Status: false },
    updateMessage: { Status: false },
    PartyName: [],
    SelectField: [],
    saveBtnloading: false,
    listLoading: false
}

const PartyMasterBulkUpdateReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }

        case GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE:
            return {
                ...state,
                listLoading: true
            };

        case GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS:
            return {
                ...state,
                goButton: action.payload,
                listLoading: false
            };

        case POST_PARTY_NAME_SUCCESS:
            return {
                ...state,
                PartyName: action.payload,
            };

        case POST_SELECT_FIELD_SUCCESS:
            return {
                ...state,
                SelectField: action.payload,
            };


        case UPDATE_PARTY_MASTER_BULK:
            return {
                ...state,
                saveBtnloading: true,
            };

        case UPDATE_PARTY_MASTER_BULK_SUCCESS:
            return {
                ...state,
                updateMessage: action.payload,
                saveBtnloading: false,

            };

        case PARTYBULK_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listLoading: false,
            };

        default:
            return state
    }
}

export default PartyMasterBulkUpdateReducer