import {
  DELETE_POS_SERVICE_SETTING_LIST_ID,
  DELETE_POS_SERVICE_SETTING_LIST_ID_SUCCESS,
  EDIT_POS_SERVICE_SETTING_ID,
  EDIT_POS_SERVICE_SETTING_ID_SUCCESS,
  SAVE_POS_SERVICE_SETTING,
  SAVE_POS_SERVICE_SETTING_SUCCESS,
  POS_SERVICE_SETTING_API_ERROR_ACTION,
  UPDATE_POS_SERVICE_SETTING_ID,
  UPDATE_POS_SERVICE_SETTING_ID_SUCCESS,
  GET_POS_SERVICE_SETTING_LIST,
  GET_POS_SERVICE_SETTING_LIST_SUCCESS,
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  PosServiceSettingList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
  goBtnLoading: false
}

const PosServiceSettingReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // post
    case SAVE_POS_SERVICE_SETTING:
      return {
        ...state,
        saveBtnloading: true,
      }
    case SAVE_POS_SERVICE_SETTING_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,
      }
    case GET_POS_SERVICE_SETTING_LIST:
      return {
        ...state,
        goBtnLoading: true,
      }

    case GET_POS_SERVICE_SETTING_LIST_SUCCESS:
      return {
        ...state,
        PosServiceSettingList: action.payload,
        goBtnLoading: false,
      };




    //  del
    case DELETE_POS_SERVICE_SETTING_LIST_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };


    case DELETE_POS_SERVICE_SETTING_LIST_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMsg: action.payload,
      };

    // edit
    case EDIT_POS_SERVICE_SETTING_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case EDIT_POS_SERVICE_SETTING_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    // update api
    case UPDATE_POS_SERVICE_SETTING_ID:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_POS_SERVICE_SETTING_ID_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
        saveBtnloading: false,

      };

    case POS_SERVICE_SETTING_API_ERROR_ACTION:
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

export default PosServiceSettingReducer