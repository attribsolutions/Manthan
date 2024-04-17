import {
  DELETE_RATE_ID_FOR_MASTER_SUCCESS,
  DELETE_RATE_LIST_ID,
  DELETE_RATE_LIST_ID_SUCCESS,
  GET_RATE_LIST,
  GET_RATE_LIST_SUCCESS,
  GO_BUTTON_FOR_RATE_MASTER,
  GO_BUTTON_FOR_RATE_MASTER_SUCCESS,
  RATE_API_ERROR_ACTION,
  SAVE_RATE_MASTER,
  SAVE_RATE_MASTER_SUCCESS
} from "./actionType"

const INIT_STATE = {
  RateMasterGoButton: [],
  postMsg: { Status: false },
  saveBtnloading: false,
  GoBtnlistloading: false,
  deleteMsgForMaster: { Status: false },
  RateListData: [],
  deleteMsg: { Status: false },
  listBtnLoading:false

}

const RateMasterReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // post api

    case SAVE_RATE_MASTER:
      return {
        ...state,
        saveBtnloading: true,
      };

    case SAVE_RATE_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,

      };

    case GO_BUTTON_FOR_RATE_MASTER:
      return {
        ...state,
        RateMasterGoButton: [],
        listBtnLoading: true

      };

    // Go Button post api
    case GO_BUTTON_FOR_RATE_MASTER_SUCCESS:
      return {
        ...state,
        RateMasterGoButton: action.payload,
        listBtnLoading: false

      };

    // Delete api for
    case DELETE_RATE_ID_FOR_MASTER_SUCCESS:
      return {
        ...state,
        deleteMsgForMaster: action.payload,
      }

    // GET api
    case GET_RATE_LIST:
      return {
        ...state,
        GoBtnlistloading: true
      };


    case GET_RATE_LIST_SUCCESS:
      return {
        ...state,
        RateListData: action.payload,
        GoBtnlistloading: false

      };

    // DELETE api For List Page
    case DELETE_RATE_LIST_ID:
      return {
        ...state,
        // deleteMsg: action.payload,
        listBtnLoading: true,
      };

    case DELETE_RATE_LIST_ID_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
        listBtnLoading: false,
      }

    case RATE_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
      };

    default:
      return state
  }
}

export default RateMasterReducer