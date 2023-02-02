import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons"
import { CHALLAN_LIST_FILTERS, GET_CHALLAN_LIST_PAGE_SUCCESS, INWARD_BUTTON_ID_SUCCESS } from "./actionType"

const INIT_STATE = {
    ChallanList: [],
    ChallanlistFilter: { fromdate: currentDate, todate: currentDate, CustomerSelect: { value: "", label: " All" } },
    InwardData: []
}

const ChallanReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case CHALLAN_LIST_FILTERS:
            return {
                ...state,
                ChallanlistFilter: action.payload,
            }

        case GET_CHALLAN_LIST_PAGE_SUCCESS:
            return {
                ...state,
                ChallanList: action.payload,
            }
        // edit api
        case INWARD_BUTTON_ID_SUCCESS:
            return {
                ...state,
                InwardData: action.payload,
            };

        default:
            return state
    }
}

export default ChallanReducer