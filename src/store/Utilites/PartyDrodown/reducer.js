import { COMMON_PARTY_DROPDOWN, COMMON_PARTY_DROPDOWN_SUCCESS } from "./actionType"

const INIT_STATE = {
    commonPartyDropdown: [],
    partyDropdownLoading: false
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

        default:
            return state
    }
}

export default CommonPartyDropdownReducer;