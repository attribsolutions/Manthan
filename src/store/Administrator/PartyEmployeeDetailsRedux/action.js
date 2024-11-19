import { GET_PARTY_EMPLOYEE_DETAILS, GET_PARTY_EMPLOYEE_DETAILS_API_ERROR_ACTION, GET_PARTY_EMPLOYEE_DETAILS_API_SUCCESS } from "./actionType";


export const getPartyEmployeeDetails = (config = {}) => ({ // save Action
    type: GET_PARTY_EMPLOYEE_DETAILS,
    config
});

export const getPartyEmployeeDetails_API_Success = (resp) => ({ // Save  success
    type: GET_PARTY_EMPLOYEE_DETAILS_API_SUCCESS,
    payload: resp,
});

export const getPartyEmployeeDetailsApiErrorAction = () => ({
    type: GET_PARTY_EMPLOYEE_DETAILS_API_ERROR_ACTION,
})
