import {
  DELETE_SYSTEM_SETTING_LIST_ID,
  DELETE_SYSTEM_SETTING_LIST_ID_SUCCESS,
  EDIT_SYSTEM_SETTING_ID,
  EDIT_SYSTEM_SETTING_ID_SUCCESS,
  SAVE_SYSTEM_SETTING,
  SAVE_SYSTEM_SETTING_SUCCESS,
  SYSTEM_SETTING_API_ERROR_ACTION,
  UPDATE_SYSTEM_SETTING_ID,
  UPDATE_SYSTEM_SETTING_ID_SUCCESS,
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  groupList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
  goBtnLoading: false
}

const SystemSettingReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // post
    case SAVE_SYSTEM_SETTING:
      return {
        ...state,
        saveBtnloading: true,
      }
    case SAVE_SYSTEM_SETTING_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,
      }

    //  del
    case DELETE_SYSTEM_SETTING_LIST_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };


    case DELETE_SYSTEM_SETTING_LIST_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMsg: action.payload,
      };

    // edit
    case EDIT_SYSTEM_SETTING_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case EDIT_SYSTEM_SETTING_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    // update api
    case UPDATE_SYSTEM_SETTING_ID:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_SYSTEM_SETTING_ID_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
        saveBtnloading: false,

      };

    case SYSTEM_SETTING_API_ERROR_ACTION:
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

export default SystemSettingReducer