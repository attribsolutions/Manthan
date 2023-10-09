import { GET_DASHBOARD_DETAILS_SUCCESS, GET_DASHBOARD_ORDER_DATA_DETAILS, GET_DASHBOARD_ORDER_DATA_DETAILS_SUCCESS } from "./actionType"

const INIT_STATE = {
    getDashboard: [],
    orderData: [],
    Loading: false


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
                orderData: [],
                Loading: true
            }

        // Order List Page 
        case GET_DASHBOARD_ORDER_DATA_DETAILS_SUCCESS:
            return {
                ...state,
                orderData: action.payload,
                Loading: false

            }

        default:
            return state
    }
}

export default DashboardReducer