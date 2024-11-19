import {
  DELETE_PRODUCTION_ID,
  DELETE_PRODUCTION_SUCCESS,
  EDIT_PRODUCTION_FOR_PRODUCTION_PAGE,
  EDIT_PRODUCTION_FOR_PRODUCTION_PAGE_SUCCESS,
  GET_PRODUCTION_ITEM_MODE_2_SUCCESS,
  GET_PRODUCTION_LIST_PAGE,
  GET_PRODUCTION_LIST_PAGE_SUCCESS,
  GET_UNIT_ID_FOR_PRODUNCTION_SUCCESS,
  POST_PRODUCTION_FROM_PRODUCTION_PAGE,
  POST_PRODUCTION_FROM_PRODUCTION_PAGE_SUCCESS,
  PRODUNCTION_API_ERROR_ACTION,
  UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  postMsg: { Status: false },
  editData: { Status: false, },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  ProductionList: [],
  grnItemList: [],
  produtionMake: { Status: false, },
  unit: [],
  saveBtnloading: false,
  listBtnLoading: false,
  loading: false,
}

const ProductionReducer = (state = INIT_STATE, action) => {
  switch (action.type) {


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

    // Production List Page 

    case GET_PRODUCTION_LIST_PAGE:
      return {
        ...state,
        loading: true,
      }
    case GET_PRODUCTION_LIST_PAGE_SUCCESS:
      return {
        ...state,
        ProductionList: action.payload,
        loading: false,
      }

    // Production Save Page 
    case POST_PRODUCTION_FROM_PRODUCTION_PAGE:
      return {
        ...state,
        saveBtnloading: true,
      }
    case POST_PRODUCTION_FROM_PRODUCTION_PAGE_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,
      }

    // Production Edit Page 

    case EDIT_PRODUCTION_FOR_PRODUCTION_PAGE:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      }
    case EDIT_PRODUCTION_FOR_PRODUCTION_PAGE_SUCCESS:
      return {
        ...state,
        editData: action.payload,
        listBtnLoading: false,
      }

    case UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      }

    // Production Delete Page 
    case DELETE_PRODUCTION_ID:
      return {
        ...state,
        listBtnLoading: true,
      }
    case DELETE_PRODUCTION_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
        listBtnLoading: false,
      }

    case GET_UNIT_ID_FOR_PRODUNCTION_SUCCESS:
      return {
        ...state,
        unit: action.payload,
      }

    case PRODUNCTION_API_ERROR_ACTION:
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

export default ProductionReducer