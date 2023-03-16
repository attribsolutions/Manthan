import {
    GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS,
    POST_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS,
    POST_PARTY_DROPDOWN_SUCCESS,
    POST_SELECT_FIELD_SUCCESS
} from "./actionTypes"

const INIT_STATE = {
    goButton: [],
    postMsg: { Status: false },
    Party: [],
    SelectField: []
}

const PartyMasterBulkUpdateReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }

        case GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS:
            return {
                ...state,
                goButton: action.payload,
            };

        case POST_PARTY_DROPDOWN_SUCCESS:
            return {
                ...state,
                Party: action.payload,
            };

        case POST_SELECT_FIELD_SUCCESS:
            return {
                ...state,
                SelectField: action.payload,
            }

        default:
            return state
    }
}

export default PartyMasterBulkUpdateReducer