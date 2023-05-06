import { GET_DASHBOARD_DETAILS_SUCCESS } from "./actionType"

const INIT_STATE = {
    getDashboard: [],
}

const DashboardReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GET_DASHBOARD_DETAILS_SUCCESS:
            return {
                ...state,
                getDashboard: action.payload,
            }

        default:
            return state
    }
}

export default DashboardReducer