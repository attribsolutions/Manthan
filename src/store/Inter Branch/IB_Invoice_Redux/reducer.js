import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons"
import { IB_INVOICE_LIST_FILTERS, GET_IB_INVOICE_LIST_PAGE_SUCCESS, INWARD_BUTTON_ID_SUCCESS } from "./actionType"

const INIT_STATE = {
    IB_Invoice: [],
    IB_InvoiceFilter: { fromdate: currentDate, todate: currentDate, CustomerSelect: { value: "", label: " All" } },
    InwardData: []
}

const ChallanReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case IB_INVOICE_LIST_FILTERS:
            return {
                ...state,
                IB_InvoiceFilter: action.payload,
            }

        case GET_IB_INVOICE_LIST_PAGE_SUCCESS:
            return {
                ...state,
                IB_Invoice: action.payload,
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