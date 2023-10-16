import {
    PARTY_OUTSTANDING_REPORT_GO_BUTTON_API,
    PARTY_OUTSTANDING_REPORT_GO_BUTTON_API_SUCCESS,
    PARTY_OUTSTANDING_REPORT_API_ERROR_ACTION
} from "./actionType";

const INIT_STATE = {
    partyOutStanding_Gobtn: [],
    listBtnLoading: false,
}

const PartyOutStanding_Reducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case PARTY_OUTSTANDING_REPORT_GO_BUTTON_API:
            return {
                ...state,
                listBtnLoading: action.config.btnId
            }

        case PARTY_OUTSTANDING_REPORT_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                partyOutStanding_Gobtn: action.payload,
                listBtnLoading: false
            }


        case PARTY_OUTSTANDING_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default PartyOutStanding_Reducer  