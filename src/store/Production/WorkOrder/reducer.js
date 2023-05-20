import {
  DELETE_WORK_ORDER_LIST_PAGE_SUCCESS,
  EDIT_WORK_ORDER_LIST_ID_SUCCESS,
  GET_BOM_LIST_SUCCESS,
  GET_WORK_ORDER_LIST_PAGE_SUCCESS,
  POST_GO_BUTTON_FOR_WORK_ORDER_MASTER_SUCCESS,
  POST_WORK_ORDER_MASTER_SUCCESS,
  UPDATE_WORK_ORDER_LIST_SUCCESS,
 } from "./actionTypes"

const INIT_STATE = {
  BOMList: [],
  GoButton: [],
  postMsg: { Status: false },
  WorkOrderList: [],
  editData: { Status: false, },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
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

    // BOM List Page 
    case GET_WORK_ORDER_LIST_PAGE_SUCCESS:
      return {
        ...state,
        WorkOrderList: action.payload,
      }

    //edit list page
    case EDIT_WORK_ORDER_LIST_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }

    // Update Work Order
    case UPDATE_WORK_ORDER_LIST_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      }

    // delete Work Order
    case DELETE_WORK_ORDER_LIST_PAGE_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }
    default:
      return state
  }
}

export default WorkOrderReducer