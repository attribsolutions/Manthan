import {
    GO_BUTTON_PARTY_DETAILS_LIST,
    GO_BUTTON_PARTY_DETAILS_LIST_SUCCESS,
    PARTY_DETAILS_API_ERROR_ACTION,
    SAVE_PARTY_DETAILS,
    SAVE_PARTY_DETAILS_SUCCESS
} from "./actionType"

const INIT_STATE = {
    postMsg: { Status: false },
    goBtnList: [],

    loading: false,
    saveBtnloading: false,
}

const PartyDetailsReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case SAVE_PARTY_DETAILS:
            return {
                ...state,
                saveBtnloading: true,
            }

        case SAVE_PARTY_DETAILS_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,
            }

        case GO_BUTTON_PARTY_DETAILS_LIST:
            return {
                ...state,
                loading: true,
            }

        case GO_BUTTON_PARTY_DETAILS_LIST_SUCCESS:
            return {
                ...state,
                goBtnList: action.payload,
                loading: false,
            }

        case PARTY_DETAILS_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                loading: false,
            };

        default:
            return state
    }
}

export default PartyDetailsReducer