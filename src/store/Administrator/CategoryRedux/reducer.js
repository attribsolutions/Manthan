import {
  SAVE_CATEGORY_MASTER_SUCCESS,
  UPDATE_CATEGORY_ID_SUCCESS,
  DELETE_CATEGORY_ID_SUCCESS,
  EDIT_CATEGORY_ID_SUCCESS,
  GET_CATEGORY_LIST_SUCCESS,
  SAVE_CATEGORY_MASTER,
  UPDATE_CATEGORY_ID,
  GET_CATEGORY_LIST,
  CATEGORY_API_ERROR_ACTION
} from "./actionTypes";

const INIT_STATE = {
  postMsg: { Status: false },
  CategoryAPI: [],
  CategoryListData: [],
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
}

const CategoryReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_CATEGORY_MASTER:
      return {
        ...state,
        saveBtnloading: true

      }

    case SAVE_CATEGORY_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false
      }

    // get api
    case GET_CATEGORY_LIST:
      return {
        ...state,
        listBtnLoading: true,
      }

    case GET_CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        CategoryListData: action.payload,
        listBtnLoading: false,
      }

    case DELETE_CATEGORY_ID_SUCCESS:
      return {
        ...state,
        deleteMessage: action.payload,
      };

    case EDIT_CATEGORY_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    // update api

    case UPDATE_CATEGORY_ID:
      return {
        ...state,
        saveBtnloading: true

      };

    case UPDATE_CATEGORY_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false

      };

    case CATEGORY_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
      };

    default:
      return state
  }
}

export default CategoryReducer