import {
  DELETE_GROUP_LIST_ID,
  DELETE_GROUP_LIST_ID_SUCCESS,
  EDIT_GROUPMASTER_ID,
  EDIT_GROUPMASTER_ID_SUCCESS,
  GET_GROUP_LIST,
  GET_GROUP_LIST_SUCCESS,
  GROUP_API_ERROR_ACTION,
  SAVE_GROUP_MASTER,
  SAVE_GROUP_MASTER_SUCCESS,
  UPDATE_GROUPMASTER_ID,
  UPDATE_GROUPMASTER_ID_SUCCESS
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  groupList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
  goBtnLoading:false
}

const GroupReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    // post
    case SAVE_GROUP_MASTER:
      return {
        ...state,
        saveBtnloading: true,
      }

    case SAVE_GROUP_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,
      }


    // get 
    case GET_GROUP_LIST:
      return {
        ...state,
        goBtnLoading: true,
      }

    case GET_GROUP_LIST_SUCCESS:
      return {
        ...state,
        groupList: action.payload,
        goBtnLoading: false,
      }

      
    //  del
    case DELETE_GROUP_LIST_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };


    case DELETE_GROUP_LIST_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMsg: action.payload,
      };


    // edit
    case EDIT_GROUPMASTER_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case EDIT_GROUPMASTER_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    // update api
    case UPDATE_GROUPMASTER_ID:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_GROUPMASTER_ID_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
        saveBtnloading: false,

      };

    case GROUP_API_ERROR_ACTION:
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

export default GroupReducer