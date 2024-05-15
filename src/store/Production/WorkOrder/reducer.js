import {
  DELETE_WORK_ORDER_LIST_PAGE,
  DELETE_WORK_ORDER_LIST_PAGE_SUCCESS,
  EDIT_WORK_ORDER_LIST_ID,
  EDIT_WORK_ORDER_LIST_ID_SUCCESS,
  GET_BOM_LIST,
  GET_BOM_LIST_SUCCESS,
  GET_WORK_ORDER_LIST_PAGE,
  GET_WORK_ORDER_LIST_PAGE_SUCCESS,
  POST_GO_BUTTON_FOR_WORK_ORDER_MASTER,
  POST_GO_BUTTON_FOR_WORK_ORDER_MASTER_SUCCESS,
  POST_WORK_ORDER_MASTER,
  POST_WORK_ORDER_MASTER_SUCCESS,
  UPDATE_WORK_ORDER_LIST,
  UPDATE_WORK_ORDER_LIST_SUCCESS,
  WORK_ORDER_API_ERROR_ACTION,
} from "./actionTypes"

const INIT_STATE = {
  BOMList: [],
  GoButton: [],
  postMsg: { Status: false },
  WorkOrderList: [],
  editData: { Status: false, },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  listBtnLoading: false,
  loading: false,
  saveBtnloading: false,
}

const WorkOrderReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    // get api
    case GET_BOM_LIST:
      return {
        ...state,
        loading: true,
        BOMList: []
      }
    case GET_BOM_LIST_SUCCESS:
      return {
        ...state,
        BOMList: action.payload,
        loading: false,
      }

    // GO Button 

    case POST_GO_BUTTON_FOR_WORK_ORDER_MASTER:
      return {
        ...state,
        loading: true,
      }
    case POST_GO_BUTTON_FOR_WORK_ORDER_MASTER_SUCCESS:
      return {
        ...state,
        GoButton: action.payload,
        loading: false,
      }

    // Post API

    case POST_WORK_ORDER_MASTER:
      return {
        ...state,
        saveBtnloading: true,
      }

    case POST_WORK_ORDER_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,
      }

    // Work Order List Page 
    case GET_WORK_ORDER_LIST_PAGE:
      return {
        ...state,
        loading: true,
      }
    case GET_WORK_ORDER_LIST_PAGE_SUCCESS:
      return {
        ...state,
        WorkOrderList: action.payload,
        loading: false,
      }

    //edit list page

    case EDIT_WORK_ORDER_LIST_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      }
    case EDIT_WORK_ORDER_LIST_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
        listBtnLoading: false,
      }

    // Update Work Order
    case UPDATE_WORK_ORDER_LIST:
      return {
        ...state,
        saveBtnloading: true,
      }
    case UPDATE_WORK_ORDER_LIST_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
        saveBtnloading: false,
      }

    // delete Work Order
    case DELETE_WORK_ORDER_LIST_PAGE:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      }
    case DELETE_WORK_ORDER_LIST_PAGE_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
        listBtnLoading: false,
      }

    case WORK_ORDER_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
        loading: false,
      }
    default:
      return state
  }
}

export default WorkOrderReducer