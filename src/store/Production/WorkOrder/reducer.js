import {
  BULK_BOM_FOR_WORKORDER,
  BULK_BOM_FOR_WORKORDER_SUCCESS,
  DELETE_WORK_ORDER_LIST_PAGE,
  DELETE_WORK_ORDER_LIST_PAGE_SUCCESS,
  EDIT_WORK_ORDER_LIST_ID,
  EDIT_WORK_ORDER_LIST_ID_SUCCESS,
  GET_WORK_ORDER_LIST_PAGE,
  GET_WORK_ORDER_LIST_PAGE_SUCCESS,
  POST_GO_BUTTON_FOR_WORK_ORDER_MASTER,
  POST_GO_BUTTON_FOR_WORK_ORDER_MASTER_SUCCESS,
  POST_WORK_ORDER_MASTER,
  POST_WORK_ORDER_MASTER_SUCCESS,
  SAVE_BULK_BOM_FOR_WORKORDER,
  SAVE_BULK_BOM_FOR_WORKORDER_SUCCESS,
  UPDATE_WORK_ORDER_LIST,
  UPDATE_WORK_ORDER_LIST_SUCCESS,
  WORK_ORDER_API_ERROR_ACTION,
} from "./actionTypes"

const INIT_STATE = {
  BOMList: [],
  GoButton: [],
  postMsg: { Status: false },
  Bulk_Bom_for_WorkOrder: { Status: false },
  Save_Bulk_Bom_for_WorkOrder: { Status: false },
  WorkOrderList: [],
  editData: { Status: false, },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  listBtnLoading: false,
  loading: false,
  BulkBtnloading: false,
  saveBtnloading: false,
}

const WorkOrderReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

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



    case BULK_BOM_FOR_WORKORDER:
      return {
        ...state,
        BulkBtnloading: true,
      }

    case BULK_BOM_FOR_WORKORDER_SUCCESS:
      return {
        ...state,
        Bulk_Bom_for_WorkOrder: action.payload,
        BulkBtnloading: false,
      }

    case SAVE_BULK_BOM_FOR_WORKORDER:
      return {
        ...state,
        saveBtnloading: true,
      }

    case SAVE_BULK_BOM_FOR_WORKORDER_SUCCESS:
      return {
        ...state,
        Save_Bulk_Bom_for_WorkOrder: action.payload,
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
        listBtnLoading: true,
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