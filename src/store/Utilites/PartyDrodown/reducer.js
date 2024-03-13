import { GET_COMMON_PARTY_DROPDWON_OPTION_ACTION, GET_COMMON_PARTY_DROPDWON_OPTION_ACTION_SUCCESS, COMMON_PARTY_DROP_SELECT_ACTION, CHANGE_COMMON_PARTY_DROPDWON_DETAILS_ACTION, SIDE_BAR_PAGE_FILTERS_INFO_ACTION, SIDE_BAR_PAGE_FILTERS_INFO_ACTION_SUCCESS } from "./actionType"

const INIT_STATE = {
    commonPartyDropdownOption: [],
    partyDropdownLoading: false,
    commonPartyDropSelect: { value: 0, label: "select...", SAPPartyCode: "" },
    forceDisable: false,
    isShow: true,
    isShowOnlySAPParty: false,
    sideBarPageFilters: []
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

        case SIDE_BAR_PAGE_FILTERS_INFO_ACTION:

            return {
                ...state,
                sideBarPageFilters: action.payload,
            }

        case SIDE_BAR_PAGE_FILTERS_INFO_ACTION_SUCCESS:

            return {
                ...state,
                sideBarPageFilters: action.payload,
            }
        default:
            return state
    }
}

export default CommonPartyDropdownReducer;