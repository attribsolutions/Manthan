import {
  DELETE_EMPLOYEE_TYPE_ID_SUCCESS,
  EDIT_EMPLOYEE_TYPE_ID_SUCCESS,
  GET_EMPLOYEE_TYPE_LIST_SUCCESS,
  POST_EMPLOYEETYPE_SUBMIT,
  POST_EMPLOYEETYPE_SUBMIT_SUCCESS,
  UPDATE_EMPLOYEE_TYPE_ID,
  UPDATE_EMPLOYEE_TYPE_ID_SUCCESS
} from "./actionTypes"

const INIT_STATE = {
  PostEmployeeType: { Status: false },
  EmployeeTypeList: [],
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  saveBtnloading: false,
}

const EmployeeTypeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {


    case POST_EMPLOYEETYPE_SUBMIT:
      return {
        ...state,
        saveBtnloading: true,

      }
    case POST_EMPLOYEETYPE_SUBMIT_SUCCESS:
      return {
        ...state,
        PostEmployeeType: action.payload,
        saveBtnloading: false,

      }

    // get api
    case GET_EMPLOYEE_TYPE_LIST_SUCCESS:
      return {
        ...state,
        EmployeeTypeList: action.payload,
      }

    case DELETE_EMPLOYEE_TYPE_ID_SUCCESS:
      return {
        ...state,
        deleteMessage: action.payload,
      };

    case EDIT_EMPLOYEE_TYPE_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    // update api

    case UPDATE_EMPLOYEE_TYPE_ID:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_EMPLOYEE_TYPE_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false,

      };


    default:
      return state
  }
}

export default EmployeeTypeReducer