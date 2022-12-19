import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
  DELETE_PRODUCTION_FOR_PRODUCTION_PAGE_SUCCESS,
  DELETE_PRODUCTION_SUCCESS,
  EDIT_PRODUCTION_FOR_PRODUCTION_PAGE_SUCCESS,
  GET_PRODUCTION_ITEM_MODE_2_SUCCESS,
  GET_PRODUCTION_LIST_PAGE_SUCCESS,
  POST_PRODUCTION_FROM_PRODUCTION_PAGE_SUCCESS,
  SET_PRODUCTION_LIST_FILTERS,
  UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE_SUCCESS,
} from "./actionType"


// const date = currentDate();

const INIT_STATE = {
  postMsg: { Status: false },
  editData: { Status: false, Items: [] },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  GRNList: [],
  grnItemList: [],
  GRNitem: { Status: false, Data: [], },
  grnlistFilter: { fromdate: currentDate, todate: currentDate, supplierSelect: '' }
}

const ProductionReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SET_PRODUCTION_LIST_FILTERS:
      return {
        ...state,
        grnlistFilter: action.payload,
      }

      case POST_PRODUCTION_FROM_PRODUCTION_PAGE_SUCCESS:
        return {
          ...state,
          postMsg: action.payload,
        }

    case GET_PRODUCTION_ITEM_MODE_2_SUCCESS:
      return {
        ...state,
        GRNitem: action.payload,
      }
    case "GET_PRODUCTION_ITEM_MODE_3":
      return {
        ...state,
        grnItemList: action.payload,
      }
    // GRN List Page 
    case GET_PRODUCTION_LIST_PAGE_SUCCESS:
      return {
        ...state,
        GRNList: action.payload,
      }
    case POST_PRODUCTION_FROM_PRODUCTION_PAGE_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }
    case EDIT_PRODUCTION_FOR_PRODUCTION_PAGE_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }
    case UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      }
    case DELETE_PRODUCTION_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }
    default:
      return state
  }
}

export default ProductionReducer