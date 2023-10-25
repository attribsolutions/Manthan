import {
  CLUSTER_API_ERROR_ACTION,
  DELETE_CLUSTER_ID,
  DELETE_CLUSTER_ID_SUCCESS,
  EDIT_CLUSTER_ID,
  EDIT_CLUSTER_ID_SUCCESS,
  GET_CLUSTER_LIST,
  GET_CLUSTER_LIST_SUCCESS,
  SAVE_CLUSTER_MASTER,
  SAVE_CLUSTER_MASTER_SUCCESS,
  UPDATE_CLUSTER_ID,
  UPDATE_CLUSTER_ID_SUCCESS
} from "./actionType"


const INIT_STATE = {
  postMsg: { Status: false },
  ClusterListData: [],
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
  goBtnLoading: false
}

const ClusterReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_CLUSTER_MASTER:
      return {
        ...state,
        saveBtnloading: true

      }

    case SAVE_CLUSTER_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false
      }

    // get api
    case GET_CLUSTER_LIST:
      return {
        ...state,
        goBtnLoading: true,
      }

    case GET_CLUSTER_LIST_SUCCESS:
      return {
        ...state,
        ClusterListData: action.payload,
        goBtnLoading: false,
      }

    case DELETE_CLUSTER_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };


    case DELETE_CLUSTER_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMessage: action.payload,
      };

    case EDIT_CLUSTER_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };


    case EDIT_CLUSTER_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    // update api

    case UPDATE_CLUSTER_ID:
      return {
        ...state,
        saveBtnloading: true

      };

    case UPDATE_CLUSTER_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false

      };

    case CLUSTER_API_ERROR_ACTION:
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

export default ClusterReducer