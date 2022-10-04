import { GET_GROUP_TYPES_LIST_SUCCESS } from "./actionType"

  const INIT_STATE = {
    PostEmployeeType:[]
  
  }
  
  const GroupTypeReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      // get api
      case GET_GROUP_TYPES_LIST_SUCCESS:
        return {
          ...state,
          EmployeeTypeList: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default GroupTypeReducer