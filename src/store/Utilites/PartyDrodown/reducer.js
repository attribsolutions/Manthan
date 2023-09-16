import { COMMON_PARTY_DROPDOWN, COMMON_PARTY_DROPDOWN_SUCCESS, COMMON_PARTY_DROP_SELECT_ACTION, COMMON_PARTY_DROP_SELECT_ACTION_SUCCESS } from "./actionType"

const INIT_STATE = {
    commonPartyDropdown: [],
    partyDropdownLoading: false,
    commonPartyDropSelect: { value: 0, label: "select...", SAPPartyCode: "" }
}

const CommonPartyDropdownReducer = (state = INIT_STATE, action) => {

    switch (action.type) {

        case COMMON_PARTY_DROPDOWN:
            return {
                ...state,
                partyDropdownLoading: true
            }
        case COMMON_PARTY_DROPDOWN_SUCCESS:
            return {
                ...state,
                commonPartyDropdown: action.payload,
                partyDropdownLoading: false
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