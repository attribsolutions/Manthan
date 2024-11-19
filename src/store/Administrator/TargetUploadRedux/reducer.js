import {
  DELETE_TARGET_UPLOAD_LIST_ID,
  DELETE_TARGET_UPLOAD_LIST_ID_SUCCESS,
  EDIT_TARGET_UPLOAD_ID,
  EDIT_TARGET_UPLOAD_ID_SUCCESS,
  GET_TARGET_UPLOAD_LIST,
  GET_TARGET_UPLOAD_LIST_SUCCESS,
  SAVE_TARGET_UPLOAD_MASTER,
  SAVE_TARGET_UPLOAD_MASTER_SUCCESS,
  TARGET_UPLOAD_API_ERROR_ACTION,

} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  targetList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
  goBtnLoading: false
}

const TargetUploadReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // post
    case SAVE_TARGET_UPLOAD_MASTER:
      return {
        ...state,
        saveBtnloading: true,
      }

    case SAVE_TARGET_UPLOAD_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,
      }


    // get 
    case GET_TARGET_UPLOAD_LIST:
      return {
        ...state,
        goBtnLoading: true,
      }

    case GET_TARGET_UPLOAD_LIST_SUCCESS:
      return {
        ...state,
        targetList: action.payload,
        goBtnLoading: false,
      }

    case EDIT_TARGET_UPLOAD_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case EDIT_TARGET_UPLOAD_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    //  del
    case DELETE_TARGET_UPLOAD_LIST_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };


    case DELETE_TARGET_UPLOAD_LIST_ID_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
        listBtnLoading: false,
      };

    case TARGET_UPLOAD_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
        goBtnLoading: false
      };

    default:
      return state
  }
}

export default TargetUploadReducer