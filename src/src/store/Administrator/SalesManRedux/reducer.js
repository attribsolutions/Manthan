import {
  DELETE_SALESMAN_ID_SUCCESS,
  EDIT_SALESMAN_ID_SUCCESS,
  GET_SALESMAN_LIST_SUCCESS,
  SAVE_SALES_MAN_MASTER_SUCCESS,
  UPDATE_SALESMAN_ID_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  PostData: { Status: false },
  SalesManList: [],
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false }
}

const SalesManReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_SALES_MAN_MASTER_SUCCESS:
      return {
        ...state,
        PostData: action.payload,
      }

    case GET_SALESMAN_LIST_SUCCESS:
      return {
        ...state,
        SalesManList: action.payload,
      }

    case DELETE_SALESMAN_ID_SUCCESS:
      return {
        ...state,
        deleteMessage: action.payload,
      };

    case EDIT_SALESMAN_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    case UPDATE_SALESMAN_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      };

    default:
      return state
  }
}

export default SalesManReducer  