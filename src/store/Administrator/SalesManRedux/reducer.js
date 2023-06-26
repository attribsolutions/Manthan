import {
  DELETE_SALESMAN_ID_SUCCESS,
  EDIT_SALESMAN_ID_SUCCESS,
  GET_SALESMAN_LIST,
  GET_SALESMAN_LIST_SUCCESS,
  SALESMAN_API_ERROR_ACTION,
  SAVE_SALES_MAN_MASTER,
  SAVE_SALES_MAN_MASTER_SUCCESS,
  UPDATE_SALESMAN_ID,
  UPDATE_SALESMAN_ID_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  PostData: { Status: false },
  SalesManList: [],
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
}

const SalesManReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_SALES_MAN_MASTER:
      return {
        ...state,
        saveBtnloading: true,
      }

    case SAVE_SALES_MAN_MASTER_SUCCESS:
      return {
        ...state,
        PostData: action.payload,
        saveBtnloading: false,
      }

    case GET_SALESMAN_LIST:
      return {
        ...state,
        listBtnLoading: true
      }

    case GET_SALESMAN_LIST_SUCCESS:
      return {
        ...state,
        SalesManList: action.payload,
        listBtnLoading: false

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

    case UPDATE_SALESMAN_ID:
      return {
        ...state,
        saveBtnloading: true,
      };

    case UPDATE_SALESMAN_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false,
      };

    case SALESMAN_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
      };

    default:
      return state
  }
}

export default SalesManReducer  