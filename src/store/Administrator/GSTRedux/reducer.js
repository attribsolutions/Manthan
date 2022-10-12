import {
  DELETE_GST_FOR_MASTER_PAGE_SUCCESS,
  DELETE_GST_LIST_PAGE_SUCCESS,
  GET_GST_LIST_PAGE_SUCCESS,
  POST_GO_BUTTON_FOR_GST_MASTER_SUCCESS,
  POST_GST_MASTER_DATA_SUCCESS
} from "./actionType"

const INIT_STATE = {
  deleteMsg: { Status: false },
  GSTGoButton: [],
  postMsg: { Status: false },
  GSTList: [],
  deleteMsgForListPage: { Status: false },
}

const GSTReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // post api
    case POST_GST_MASTER_DATA_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      };

    // Go Button post api
    case POST_GO_BUTTON_FOR_GST_MASTER_SUCCESS:
      return {
        ...state,
        GSTGoButton: action.payload,
      };

    // GET api
    case GET_GST_LIST_PAGE_SUCCESS:
      return {
        ...state,
        GSTList: action.payload,
      };

    // DELETE api
    case DELETE_GST_LIST_PAGE_SUCCESS:
      return {
        ...state,
        deleteMsgForListPage: action.payload,
      };


    case DELETE_GST_FOR_MASTER_PAGE_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }

    default:
      return state
  }

}

export default GSTReducer