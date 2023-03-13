import {
  GET_DESIGNATIONID_SUCCESS,
  GET_EMPLOYEETYPE_SUCCESS,
  GET_STATE_SUCCESS,
  POST_EMPLOYEE_SUCCESS,
  GET_EMPLOYEE_LIST_SUCCESS,
  DELETE_EMPLOYEE_ID_SUCCESS,
  EDIT_EMPLOYEE_ID_SUCCESS,
  UPDATE_EMPLOYEE_ID_SUCCESS,
  GET_EMPLOYEE_TYPES_ID_SUCCESS,
  GET_COMPANYNAME_BY_EMPLOYEETYPES_ID_SUCCESS,
  GET_PARTYNAME_BY_DIVISIONTYPES_ID_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  designation: [],
  employeeType: [],
  State: [],
  employeeList: [],
  postMessage: { Status: false },
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  EmployeeTypes:[],
  CompanyNames:[],
  PartyTypes:[]
};

const M_EmployeesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    // DesignationID Dropdown api
    case GET_DESIGNATIONID_SUCCESS:
      return {
        ...state,
        designation: action.payload,
      };

    // EmployeeType Dropdown api
    case GET_EMPLOYEETYPE_SUCCESS:
      return {
        ...state,
        employeeType: action.payload,
      };

    // State Dropdown api
    case GET_STATE_SUCCESS:
      return {
        ...state,
        State: action.payload,
      };

    case POST_EMPLOYEE_SUCCESS:
      return {
        ...state,
        postMessage: action.payload,
      };

    // get api
    case GET_EMPLOYEE_LIST_SUCCESS:
      return {
        ...state,
        employeeList: action.payload,
      }


    case DELETE_EMPLOYEE_ID_SUCCESS:
      return {
        ...state,
        deleteMessage: action.payload,
      };

    case EDIT_EMPLOYEE_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    // update api
    case UPDATE_EMPLOYEE_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      };

    // Company Name API dependent on Employee Types api
    case GET_COMPANYNAME_BY_EMPLOYEETYPES_ID_SUCCESS:
      return {
        ...state,
        CompanyNames: action.payload,
      };

    default:
      return state;
  }
};
export default M_EmployeesReducer;
