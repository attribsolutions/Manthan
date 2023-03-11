import {
  DELETE_CATEGORY_TYPE_ID_SUCCESS,
  EDIT_CATEGORY_TYPE_ID_SUCCESS,
  GET_CATEGORY_TYPE_LIST_SUCCESS,
  SAVE_CATEGORYTYPE_MASTER_SUCCESS,
  UPDATE_CATEGORY_TYPE_ID_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  PostData: { Status: false },
  categoryTypeListData: [],
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
}

const categoryTypeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_CATEGORYTYPE_MASTER_SUCCESS:
      return {
        ...state,
        PostData: action.payload,
      }

    // get api
    case GET_CATEGORY_TYPE_LIST_SUCCESS:
      return {
        ...state,
        categoryTypeListData: action.payload,
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

    // update api
    case UPDATE_CATEGORY_TYPE_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      };
      
    default:
      return state
  }
}

export default categoryTypeReducer  