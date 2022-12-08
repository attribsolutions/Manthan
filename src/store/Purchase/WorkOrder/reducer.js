import {
  GET_BOM_LIST_SUCCESS,
  POST_GO_BUTTON_FOR_WORK_ORDER_MASTER_SUCCESS,
  POST_WORK_ORDER_MASTER_SUCCESS
} from "./actionTypes"

const INIT_STATE = {
  BOMList: [],
  GoButton: [],
  postMsg: { Status: false },

}

const WorkOrderReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    // get api
    case GET_BOM_LIST_SUCCESS:
      return {
        ...state,
        BOMList: action.payload,
      }

    // GO Button 
    case POST_GO_BUTTON_FOR_WORK_ORDER_MASTER_SUCCESS:
      return {
        ...state,
        GoButton: action.payload,
      }

    // Post API
    case POST_WORK_ORDER_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }
    default:
      return state
  }
}

export default WorkOrderReducer