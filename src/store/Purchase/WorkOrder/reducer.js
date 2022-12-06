import { GET_BOM_LIST_SUCCESS } from "./actionTypes"
  
  const INIT_STATE = {
    BOMList: [],
  
  }
  
  const WorkOrderReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      // get api
      case GET_BOM_LIST_SUCCESS:
        return {
          ...state,
          BOMList: action.payload,
        }
       
      default:
        return state
    }
  }
  
  export default WorkOrderReducer