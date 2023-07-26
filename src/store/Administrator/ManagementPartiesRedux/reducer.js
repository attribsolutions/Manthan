import {
    GET_EMPLOYEE_DROPDWOPN_LIST,
    GET_EMPLOYEE_DROPDWOPN_LIST_SUCCESS,
    GET_PARTY_TABLE_LIST,
    GET_PARTY_TABLE_LIST_SUCCESS,
    MANAGEMENT_PARTIES_API_ERROR_ACTION,
    SAVE_MANAGEMENT_PARTIES,
    SAVE_MANAGEMENT_PARTIES_SUCCESS
} from "./actionType"

const INIT_STATE = {
    postMsg: { Status: false },
    partyList: [],
    employeeList: [],

    loading: false,
    saveBtnloading: false,
    employeeDropdownLoading: false,
}

const ManagementPartiesReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        // post

        case SAVE_MANAGEMENT_PARTIES:
            return {
                ...state,
                saveBtnloading: true,
            }

        case SAVE_MANAGEMENT_PARTIES_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,
            }

        case GET_PARTY_TABLE_LIST:
            return {
                ...state,
                loading: true,
            }
        // After EmployeeID Select Party List API
        case GET_PARTY_TABLE_LIST_SUCCESS:
            return {
                ...state,
                partyList: action.payload,
                loading: false,

            }

        // Employee Dropdown List API
        case GET_EMPLOYEE_DROPDWOPN_LIST:
            return {
                ...state,
                employeeDropdownLoading: true,
            }

        case GET_EMPLOYEE_DROPDWOPN_LIST_SUCCESS:
            return {
                ...state,
                employeeList: action.payload,
                employeeDropdownLoading: false,
            }

        case MANAGEMENT_PARTIES_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                loading: false,
                employeeDropdownLoading: false,
            };
        default:
            return state
    }
}

export default ManagementPartiesReducer