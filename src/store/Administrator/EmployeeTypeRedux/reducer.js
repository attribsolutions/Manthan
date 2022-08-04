import { POST_EMPLOYEETYPE_SUBMIT_SUCCESS } from "./actionTypes"

const INIT_STATE = {
    EmployeeType: [],
  }
  
  const EmployeeTypeReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case POST_EMPLOYEETYPE_SUBMIT_SUCCESS:
        return {
          ...state,
          EmployeeType: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default EmployeeTypeReducer