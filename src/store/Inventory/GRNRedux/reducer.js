import {
  DELETE_GRN_FOR_GRN_PAGE_SUCCESS,
  EDIT_GRN_FOR_GRN_PAGE_SUCCESS,
  MAKE_GRN_MODE_1_ACTION_SUCCESS,
  GET_GRN_LIST_PAGE_SUCCESS,
  SAVE_GRN_FROM_GRN_PAGE_SUCCESS,
  UPDATE_GRN_ID_FROM_GRN_PAGE_SUCCESS,
  GET_GRN_LIST_PAGE,
} from "./actionType"


const INIT_STATE = {
  loading: false,
  postMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  GRNList: [],
  grnItemList: [],
  GRNitem: { Status: false, Data: [], },

}

const GRNReducer = (state = INIT_STATE, action) => {
  switch (action.type) {


    case MAKE_GRN_MODE_1_ACTION_SUCCESS:
      return {
        ...state,
        GRNitem: action.payload,
      }
    case "GET_GRN_ITEM_MODE_3":
      return {
        ...state,
        grnItemList: action.payload,
      }



    case GET_GRN_LIST_PAGE:
      return {
        ...state,
        loading: true,
      }
    // GRN List Page 

    case GET_GRN_LIST_PAGE_SUCCESS:
      return {
        ...state,
        GRNList: action.payload,
        loading: false

      }

    case SAVE_GRN_FROM_GRN_PAGE_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }


    case EDIT_GRN_FOR_GRN_PAGE_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }

    case UPDATE_GRN_ID_FROM_GRN_PAGE_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      }

    case DELETE_GRN_FOR_GRN_PAGE_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }


    default:
      return state
  }

}

export default GRNReducer