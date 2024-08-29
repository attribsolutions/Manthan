import {
  DELETE_GST_ID_FOR_MASTER_SUCCESS,
  DELETE_GST_LIST_ID_SUCCESS,
  GET_GST_LIST,
  GET_GST_LIST_SUCCESS,
  GO_BUTTON_FOR_GST_MASTER,
  GO_BUTTON_FOR_GST_MASTER_SUCCESS,
  GST_API_ERROR_ACTION,
  POST_VIEW_GST,
  POST_VIEW_GST_SUCCESS,
  SAVE_GST_MASTER,
  SAVE_GST_MASTER_SUCCESS
} from "./actionType"

const INIT_STATE = {
  deleteMsg: { Status: false },
  GSTGoButton: [],
  postMsg: { Status: false },
  GSTList: [],
  deleteMsgForMaster: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
  GoBtnlistloading: false,
  GSTView: []

}

const GSTReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // post api

    case SAVE_GST_MASTER:
      return {
        ...state,
        saveBtnloading: true,
      };

    case SAVE_GST_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,

      };


    case GO_BUTTON_FOR_GST_MASTER:
      return {
        ...state,
        GSTGoButton: [],
        listBtnLoading: true

      };

    // Go Button post api
    case GO_BUTTON_FOR_GST_MASTER_SUCCESS:
      return {
        ...state,
        GSTGoButton: action.payload,
        listBtnLoading: false

      };

    // GET api
    case GET_GST_LIST:
      return {
        ...state,
        GoBtnlistloading: true
      };


    case GET_GST_LIST_SUCCESS:
      return {
        ...state,
        GSTList: action.payload,
        GoBtnlistloading: false

      };

    // DELETE api
    case DELETE_GST_LIST_ID_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      };

    case DELETE_GST_ID_FOR_MASTER_SUCCESS:
      return {
        ...state,
        deleteMsgForMaster: action.payload,
      }

    case POST_VIEW_GST:
      return {
        ...state,
        listBtnLoading: action.config.btnId,

      };

    case POST_VIEW_GST_SUCCESS:
      return {
        ...state,
        GSTView: action.payload,
        listBtnLoading: false,
      }

    case GST_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
      };

    default:
      return state
  }
}

export default GSTReducer