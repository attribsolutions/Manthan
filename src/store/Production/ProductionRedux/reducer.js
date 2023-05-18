import { currentDate_ymd } from "../../../components/Common/CommonFunction";
import {
  DELETE_PRODUCTION_SUCCESS,
  EDIT_PRODUCTION_FOR_PRODUCTION_PAGE_SUCCESS,
  GET_PRODUCTION_ITEM_MODE_2_SUCCESS,
  GET_PRODUCTION_LIST_PAGE_SUCCESS,
  GET_UNIT_ID_FOR_PRODUNCTION_SUCCESS,
  POST_PRODUCTION_FROM_PRODUCTION_PAGE_SUCCESS,
  SET_PRODUCTION_LIST_FILTERS,
  UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE_SUCCESS,
} from "./actionType"


// const date = currentDate_ymd();

const INIT_STATE = {
  postMsg: { Status: false },
  editData: { Status: false, },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  ProductionList: [],
  grnItemList: [],
  produtionMake: { Status: false,  },
  productionFilter: { fromdate: currentDate_ymd, todate: currentDate_ymd },
  unit:[]
}

const ProductionReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SET_PRODUCTION_LIST_FILTERS:
      return {
        ...state,
        productionFilter: action.payload,
      }

    case GET_PRODUCTION_ITEM_MODE_2_SUCCESS:
      return {
        ...state,
        produtionMake: action.payload,
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
        ProductionList : action.payload,
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
      case GET_UNIT_ID_FOR_PRODUNCTION_SUCCESS:
      return {
        ...state,
        unit: action.payload,
      }
    default:
      return state
  }
}

export default ProductionReducer