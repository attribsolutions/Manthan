import { CENTRAL_SERVICE_ITEM_API_ERROR_ACTION, DELETE_CENTRAL_SERVICE_ITEM_LIST_ID, DELETE_CENTRAL_SERVICE_ITEM_LIST_ID_SUCCESS, EDIT_CENTRAL_SERVICE_ITEM_ID, EDIT_CENTRAL_SERVICE_ITEM_ID_SUCCESS, GET_CENTRAL_SERVICE_ITEM_LIST, GET_CENTRAL_SERVICE_ITEM_LIST_SUCCESS, SAVE_CENTRAL_SERVICE_ITEM, SAVE_CENTRAL_SERVICE_ITEM_SUCCESS, UPDATE_CENTRAL_SERVICE_ITEM_ID, UPDATE_CENTRAL_SERVICE_ITEM_ID_SUCCESS } from "./actionType";

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

const CentralServiceItemReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    // post
    case SAVE_CENTRAL_SERVICE_ITEM:
      return {
        ...state,
        saveBtnloading: true,
      }

    case SAVE_CENTRAL_SERVICE_ITEM_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,
      }


    // get 
    case GET_CENTRAL_SERVICE_ITEM_LIST:
      return {
        ...state,
        goBtnLoading: true,
      }

    case GET_CENTRAL_SERVICE_ITEM_LIST_SUCCESS:
      return {
        ...state,
        groupList: action.payload,
        goBtnLoading: false,
      }


    //  del
    case DELETE_CENTRAL_SERVICE_ITEM_LIST_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };


    case DELETE_CENTRAL_SERVICE_ITEM_LIST_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMsg: action.payload,
      };


    // edit
    case EDIT_CENTRAL_SERVICE_ITEM_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case EDIT_CENTRAL_SERVICE_ITEM_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    // update api
    case UPDATE_CENTRAL_SERVICE_ITEM_ID:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_CENTRAL_SERVICE_ITEM_ID_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
        saveBtnloading: false,

      };

    case CENTRAL_SERVICE_ITEM_API_ERROR_ACTION:
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

export default CentralServiceItemReducer;