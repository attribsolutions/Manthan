import { GET_COMMON_PARTY_DROPDWON_OPTION_ACTION, GET_COMMON_PARTY_DROPDWON_OPTION_ACTION_SUCCESS, COMMON_PARTY_DROP_SELECT_ACTION, COMMON_PARTY_DROP_SELECT_ACTION_SUCCESS, CHANGE_COMMON_PARTY_DROPDWON_DETAILS_ACTION } from "./actionType"

const INIT_STATE = {
    commonPartyDropdownOption: [],
    partyDropdownLoading: false,
    commonPartyDropSelect: { value: 0, label: "select...", SAPPartyCode: "" },
    forceDisable:false,
    isShow:true
}

const CommonPartyDropdownReducer = (state = INIT_STATE, action) => {

    switch (action.type) {

        case GET_COMMON_PARTY_DROPDWON_OPTION_ACTION:
            return {
                ...state,
                partyDropdownLoading: true
            }
        case GET_COMMON_PARTY_DROPDWON_OPTION_ACTION_SUCCESS:
            return {
                ...state,
                commonPartyDropdownOption: action.payload,
                partyDropdownLoading: false
            }

        case CHANGE_COMMON_PARTY_DROPDWON_DETAILS_ACTION:
            return {
                ...state,
                ...action.payload
            }

        case COMMON_PARTY_DROP_SELECT_ACTION:

            return {
                ...state,
                commonPartyDropSelect: action.payload,
            }

        default:
            return state
    }
}

export default CommonPartyDropdownReducer;