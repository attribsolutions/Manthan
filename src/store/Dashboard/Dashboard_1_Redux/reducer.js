import { GET_DASHBOARD_DETAILS_SUCCESS, GET_DASHBOARD_GRN_DATA_DETAILS, GET_DASHBOARD_GRN_DATA_DETAILS_SUCCESS, GET_DASHBOARD_INVOICE_DATA_DETAILS, GET_DASHBOARD_INVOICE_DATA_DETAILS_SUCCESS, GET_DASHBOARD_ORDER_DATA_DETAILS, GET_DASHBOARD_ORDER_DATA_DETAILS_SUCCESS } from "./actionType"

const INIT_STATE = {
    getDashboard: [],
    orderData: [],
    invoiceData: [],
    grnData: [],
    orderDataLoading: false,
    grnDataLoading: false,
    invoiceDataLoading: false,

}

const DashboardReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GET_DASHBOARD_DETAILS_SUCCESS:
            return {
                ...state,
                getDashboard: action.payload,
            }

        case GET_DASHBOARD_ORDER_DATA_DETAILS:
            return {
                ...state,
                orderDataLoading: true
            }

        // Order List Page 
        case GET_DASHBOARD_ORDER_DATA_DETAILS_SUCCESS:
            return {
                ...state,
                orderData: action.payload,
                orderDataLoading: false

            }


        case GET_DASHBOARD_INVOICE_DATA_DETAILS:
            return {
                ...state,
                invoiceDataLoading: true
            }

        // Order List Page 
        case GET_DASHBOARD_INVOICE_DATA_DETAILS_SUCCESS:
            return {
                ...state,
                invoiceData: action.payload,
                invoiceDataLoading: false
            }

        case GET_DASHBOARD_GRN_DATA_DETAILS:
            return {
                ...state,
                grnDataLoading: true
            }

        // Order List Page 
        case GET_DASHBOARD_GRN_DATA_DETAILS_SUCCESS:
            return {
                ...state,
                grnData: action.payload,
                grnDataLoading: false

            }

        default:
            return state
    }
}

export default DashboardReducer