import {
  DELETE_GST_ID_FOR_MASTER_SUCCESS,
  DELETE_GST_LIST_ID_SUCCESS,
  GET_GST_LIST_SUCCESS,
  GO_BUTTON_FOR_GST_MASTER,
  GO_BUTTON_FOR_GST_MASTER_SUCCESS,
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
      };

    // Go Button post api
    case GO_BUTTON_FOR_GST_MASTER_SUCCESS:
      return {
        ...state,
        GSTGoButton: action.payload,
      };

    // GET api
    case GET_GST_LIST_SUCCESS:
      return {
        ...state,
        GSTList: action.payload,
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

    default:
      return state
  }
}

export default GSTReducer