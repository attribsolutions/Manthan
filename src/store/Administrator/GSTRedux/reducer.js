import { DELETE_GST_FOR_MASTER_PAGE_SUCCESS } from "./actionType"

  const INIT_STATE = {
    deleteMsg: { Status: false },
  }
  
  const GSTReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
     
      case DELETE_GST_FOR_MASTER_PAGE_SUCCESS:
        return {
          ...state,
          deleteMsg: action.payload,
        }
        
      default:
        return state
    }
  
  }
  
  export default GSTReducer