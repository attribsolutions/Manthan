import { GET_PARTY_SETTING_API, GET_PARTY_SETTING_API_ERROR_ACTION, GET_PARTY_SETTING_API_SUCCESS, SAVE_PARTY_SETTING_MASTER, SAVE_PARTY_SETTING_MASTER_SUCCESS } from "./actionType"

const INIT_STATE = {
    PartySettingdata: []

}

const PartySettingReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case SAVE_PARTY_SETTING_MASTER:
            return {
                ...state,
                saveBtnloading: true,

            }

        case SAVE_PARTY_SETTING_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,
            }

        case GET_PARTY_SETTING_API:
            return {
                ...state,
            }

        case GET_PARTY_SETTING_API_SUCCESS:
            return {
                ...state,
                PartySettingdata: action.payload,
            }

        case GET_PARTY_SETTING_API_ERROR_ACTION:
            return {
                ...state,
            };


        default:
            return state
    }
}

export default PartySettingReducer;