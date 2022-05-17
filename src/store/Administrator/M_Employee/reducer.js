import {
    GET_DESIGNATIONID_SUCCESS,
    GET_EMPLOYEETYPE_SUCCESS,
    GET_STATE_SUCCESS,
    GET_REGION_SUCCESS,
    POST_EMPLOYEE,
    POST_EMPLOYEE_SUCCESS,
    GET_COMPANY_SUCCESS,
    GET_EMPLOYEE_LIST_SUCCESS,
    DELETE_EMPLOYEE_ID,
    DELETE_EMPLOYEE_ID_SUCCESS,
    EDIT_EMPLOYEE_ID,
    EDIT_EMPLOYEE_ID_SUCCESS,
    UPDATE_EMPLOYEE_ID_SUCCESS
  } from "./actionTypes";
  
  const INIT_STATE = {
    DesignationID:[],
    EmployeeType:[],
    State:[],
    Region:[],
    PostPage:[],
    PostMessage:[],
    Company:[],
    pages:[],
    deleteID: [],
    deleteSuccess: [],
    editId: [],
    editData: { Status: 'false' },
    updateMessage:  { Status: 'false' },
  };
  
  const M_EmployeesReducer  = (state = INIT_STATE, action) => {
    switch (action.type) {

        /// DesignationID Dropdown api
        case GET_DESIGNATIONID_SUCCESS:
          return {
            ...state,
            DesignationID: action.payload,
          };

            /// EmployeeType Dropdown api
        case GET_EMPLOYEETYPE_SUCCESS:
            return {
              ...state,
              EmployeeType: action.payload,
            };

             /// State Dropdown api
        case GET_STATE_SUCCESS:
            return {
              ...state,
              State: action.payload,
            };

            /// Region Dropdown api
        case GET_REGION_SUCCESS:
            return {
              ...state,
              Region: action.payload,
            };

             /// Company Dropdown api
        case GET_COMPANY_SUCCESS:
            return {
              ...state,
              Company: action.payload,
            };

             //// post api
      case POST_EMPLOYEE:
        return {
          ...state,
          PostPage: action.Data,
        };
      case POST_EMPLOYEE_SUCCESS:
        return {
          ...state,
          PostMessage: action.payload,
        };

           //// get api
           case GET_EMPLOYEE_LIST_SUCCESS:
            return {
              ...state,
              pages: action.payload,
            }

              //// delete api
      case DELETE_EMPLOYEE_ID:
        return {
          ...state,
          deleteID: action.id,
        };
      case DELETE_EMPLOYEE_ID_SUCCESS:
        return {
          ...state,
          deleteSuccess: action.payload,
        };
  
        //// edit api
      case EDIT_EMPLOYEE_ID:
        return {
          ...state,
          editId: action.payload
        };
      case EDIT_EMPLOYEE_ID_SUCCESS:
        return {
          ...state,
          editData: action.payload,
        };
  
    //// update api
      case UPDATE_EMPLOYEE_ID_SUCCESS:
        return {
          ...state,
          updateMessage: action.payload,
        };
        default:
            return state;
        }
      };
      export default M_EmployeesReducer;
      