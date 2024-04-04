import { GET_PARTY_EMPLOYEE_DETAILS, GET_PARTY_EMPLOYEE_DETAILS_API_ERROR_ACTION, GET_PARTY_EMPLOYEE_DETAILS_API_SUCCESS } from "./actionType"

const INIT_STATE = {
    PartyEmployeeDetails: [],
    loading: false,
}

const PartyEmployeeDetailsReducer = (state = INIT_STATE, action) => {
    switch (action.type) {


        case GET_PARTY_EMPLOYEE_DETAILS:
            return {
                ...state,
                loading: true,
            }

        case GET_PARTY_EMPLOYEE_DETAILS_API_SUCCESS:
            return {
                ...state,
                PartyEmployeeDetails: action.payload,
                loading: false,
            }

        case GET_PARTY_EMPLOYEE_DETAILS_API_ERROR_ACTION:
            return {
                ...state,
                loading: false,
            };


        default:
            return state
    }
}

export default PartyEmployeeDetailsReducer;