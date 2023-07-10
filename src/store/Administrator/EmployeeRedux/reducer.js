import {
  GET_DESIGNATIONID_SUCCESS,
  GET_STATE_SUCCESS,
  SAVE_EMPLOYEE_MASTER_SUCCESS,
  GET_EMPLOYEE_LIST_SUCCESS,
  DELETE_EMPLOYEE_ID_SUCCESS,
  EDIT_EMPLOYEE_ID_SUCCESS,
  UPDATE_EMPLOYEE_ID_SUCCESS,
  GET_COMPANYNAME_BY_EMPLOYEETYPES_ID_SUCCESS,
  GET_CITY_ON_DISTRICT_SUCCESS,
  SAVE_EMPLOYEE_MASTER,
  UPDATE_EMPLOYEE_ID,
  GET_EMPLOYEE_LIST,
  EMPLOYEE_API_ERROR_ACTION,
  DELETE_EMPLOYEE_ID,
  EDIT_EMPLOYEE_ID,
  GET_CITY_ON_DISTRICT
} from "./actionTypes";

const INIT_STATE = {
  loading:false,
  listBtnLoading: false,
  saveBtnloading: false,
  designation: [],
  State: [],
  City: [],
  employeeList: [],
  postMessage: { Status: false },
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  CompanyNames: [],
  PartyTypes: [],
  cityDropDownLoading:false
};

const EmployeesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    // DesignationID Dropdown api
    case GET_DESIGNATIONID_SUCCESS:
      return {
        ...state,
        designation: action.payload,
      };

    // State Dropdown api
    case GET_STATE_SUCCESS:
      return {
        ...state,
        State: action.payload,
      };

    // CITY Dropdown api

    case GET_CITY_ON_DISTRICT:
      return {
        ...state,
        cityDropDownLoading:true
      };

    case GET_CITY_ON_DISTRICT_SUCCESS:
      return {
        ...state,
        City: action.payload,
        cityDropDownLoading:false
      };

    case SAVE_EMPLOYEE_MASTER:
      return {
        ...state,
        saveBtnloading: true,
      };

    case SAVE_EMPLOYEE_MASTER_SUCCESS:
      return {
        ...state,
        postMessage: action.payload,
        saveBtnloading: false,

      };

    // get api
    case GET_EMPLOYEE_LIST:
      return {
        ...state,
        loading: true,
      }

    case GET_EMPLOYEE_LIST_SUCCESS:
      return {
        ...state,
        employeeList: action.payload,
        loading: false,
      }

    case DELETE_EMPLOYEE_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case DELETE_EMPLOYEE_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMessage: action.payload,
      };

    case EDIT_EMPLOYEE_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case EDIT_EMPLOYEE_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    // update api
    case UPDATE_EMPLOYEE_ID:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_EMPLOYEE_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false,

      };

    // Company Name API dependent on Employee Types api
    case GET_COMPANYNAME_BY_EMPLOYEETYPES_ID_SUCCESS:
      return {
        ...state,
        CompanyNames: action.payload,
      };

    case EMPLOYEE_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        cityDropDownLoading:false,
        listBtnLoading: false,
        
      };

    default:
      return state;
  }
};
export default EmployeesReducer;
