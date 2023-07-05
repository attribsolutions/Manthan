import {
  DELETE_ROLE_LIST_ID,
  DELETE_ROLE_LIST_ID_SUCCESS,
  EDIT_ROLE_LIST_ID,
  EDIT_ROLE_LIST_ID_SUCCESS,
  GET_ROLE_LIST_API,
  GET_ROLE_LIST_API_SUCCESS,
  POST_ROLE_MASTER,
  POST_ROLE_MASTER_SUCCESS,
  ROLE_API_ERROR_ACTION,
  UPDATE_ROLE_LIST_ID,
  UPDATE_ROLE_LIST_ID_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  roleList: [],
  postMsg: { Status: false },
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
};

const RoleMaster_Reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // get api

    case GET_ROLE_LIST_API:
      return {
        ...state,
        roleList: action.payload,
        listBtnLoading: true,
      }


    case GET_ROLE_LIST_API_SUCCESS:
      return {
        ...state,
        roleList: action.payload,
        listBtnLoading: false,
      }

    case POST_ROLE_MASTER:
      return {
        ...state,
        saveBtnloading: true,

      };
    case POST_ROLE_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,

      };

    // delete api


    case DELETE_ROLE_LIST_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
        deleteMsg: action.payload,
      };


    case DELETE_ROLE_LIST_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMsg: action.payload,
      };

    // edit api

    case EDIT_ROLE_LIST_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };


    case EDIT_ROLE_LIST_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    // update api
    case UPDATE_ROLE_LIST_ID:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_ROLE_LIST_ID_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
        saveBtnloading: false,
      };

    case ROLE_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
      };


    default:
      return state;
  }
};
export default RoleMaster_Reducer;
