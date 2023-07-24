import {
  GET_EMPLOYEE_DROPDWOPN_LIST,
  GET_EMPLOYEE_DROPDWOPN_LIST_SUCCESS,
  GET_PARTY_TABLE_LIST,
  GET_PARTY_TABLE_LIST_SUCCESS,
  MANAGEMENT_PARTIES_API_ERROR_ACTION,
  SAVE_MANAGEMENT_PARTIES,
  SAVE_MANAGEMENT_PARTIES_SUCCESS
} from "./actionType";

export const saveManagementParties = (config = {}) => ({// save Action
  type: SAVE_MANAGEMENT_PARTIES,
  config,
});

export const saveManagementParties_Success = (resp) => ({// Save  success
  type: SAVE_MANAGEMENT_PARTIES_SUCCESS,
  payload: resp,
});

export const getPartyTableList = (jsonBody) => ({   // After EmployeeID Select Party List API
  type: GET_PARTY_TABLE_LIST,
  jsonBody,
});

export const getPartyTableListSuccess = (resp) => ({        // After EmployeeID Select Party List API success
  type: GET_PARTY_TABLE_LIST_SUCCESS,
  payload: resp,
})

//Employee Dropdown API
export const getEmployeedropdownList = (jsonBody) => ({
  type: GET_EMPLOYEE_DROPDWOPN_LIST,
  jsonBody,
});

export const getEmployeedropdownListSuccess = (resp) => ({
  type: GET_EMPLOYEE_DROPDWOPN_LIST_SUCCESS,
  payload: resp,
});

export const ManagementPartiesApiErrorAction = () => ({
  type: MANAGEMENT_PARTIES_API_ERROR_ACTION,
})
