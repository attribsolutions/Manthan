import {
  CATEGORY_TYPE_API_ERROR_ACTION,
  DELETE_CATEGORY_TYPE_ID_SUCCESS,
  EDIT_CATEGORY_TYPE_ID_SUCCESS,
  GET_CATEGORY_TYPE_LIST,
  GET_CATEGORY_TYPE_LIST_SUCCESS,
  SAVE_CATEGORYTYPE_MASTER,
  SAVE_CATEGORYTYPE_MASTER_SUCCESS,
  UPDATE_CATEGORY_TYPE_ID,
  UPDATE_CATEGORY_TYPE_ID_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  PostData: { Status: false },
  categoryTypeListData: [],
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
}

const categoryTypeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_CATEGORYTYPE_MASTER:
      return {
        ...state,
        saveBtnloading: true
      }

    case SAVE_CATEGORYTYPE_MASTER_SUCCESS:
      return {
        ...state,
        PostData: action.payload,
        saveBtnloading: false

      }

    // get api
    case GET_CATEGORY_TYPE_LIST:
      return {
        ...state,
        listBtnLoading: true,
      }

    case GET_CATEGORY_TYPE_LIST_SUCCESS:
      return {
        ...state,
        categoryTypeListData: action.payload,
        listBtnLoading: false,
      }

    case DELETE_CATEGORY_TYPE_ID_SUCCESS:
      return {
        ...state,
        deleteMessage: action.payload,
      };

    case EDIT_CATEGORY_TYPE_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };


    case UPDATE_CATEGORY_TYPE_ID:
      return {
        ...state,
        saveBtnloading: true

      };
    // update api
    case UPDATE_CATEGORY_TYPE_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false

      };

    case CATEGORY_TYPE_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
      };

    default:
      return state
  }
}

export default categoryTypeReducer  