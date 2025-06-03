import {
  DELETE_SCHEME_LIST_ID,
  DELETE_SCHEME_LIST_ID_SUCCESS,
  EDIT_SCHEMEMASTER_ID,
  EDIT_SCHEMEMASTER_ID_SUCCESS,
  GET_SCHEME_LIST,
  GET_SCHEME_LIST_SUCCESS,
  SCHEME_API_ERROR_ACTION,
  SAVE_SCHEME_MASTER,
  SAVE_SCHEME_MASTER_SUCCESS,
  UPDATE_SCHEMEMASTER_ID,
  UPDATE_SCHEMEMASTER_ID_SUCCESS
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  SchemeList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
  goBtnLoading:false
}

const SchemeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    // post
    case SAVE_SCHEME_MASTER:
      return {
        ...state,
        saveBtnloading: true,
      }

    case SAVE_SCHEME_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,
      }


    // get 
    case GET_SCHEME_LIST:
      return {
        ...state,
        goBtnLoading: true,
      }

    case GET_SCHEME_LIST_SUCCESS:
      return {
        ...state,
        SchemeList: action.payload,
        goBtnLoading: false,
      }

      
    //  del
    case DELETE_SCHEME_LIST_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };


    case DELETE_SCHEME_LIST_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMsg: action.payload,
      };


    // edit
    case EDIT_SCHEMEMASTER_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case EDIT_SCHEMEMASTER_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    // update api
    case UPDATE_SCHEMEMASTER_ID:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_SCHEMEMASTER_ID_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
        saveBtnloading: false,

      };

    case SCHEME_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
        goBtnLoading:false
      };

    default:
      return state
  }
}

export default SchemeReducer