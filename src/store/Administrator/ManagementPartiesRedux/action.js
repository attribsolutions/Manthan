import {
    GET_PARTY_TABLE_LIST,
    GET_PARTY_TABLE_LIST_SUCCESS,
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

export const getPartyTableList = (EmployeeID) => ({   // After EmployeeID Select Party List API
    type: GET_PARTY_TABLE_LIST,  
    EmployeeID,
  });
  
  export const getPartyTableListSuccess = (resp) => ({        // After EmployeeID Select Party List API success
    type: GET_PARTY_TABLE_LIST_SUCCESS,
    payload: resp,
  })