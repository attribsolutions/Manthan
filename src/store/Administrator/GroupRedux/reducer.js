import { DELETE_GROUP_LIST_ID_SUCCESS, 
  EDIT_GROUPMASTER_ID_SUCCESS, 
  GET_GROUP_LIST_SUCCESS, 
  POST_GROUPLIST_SUCCESS,
  UPDATE_GROUPMASTER_ID_SUCCESS} from "./actionType";

const INIT_STATE = {
  postMessage: { Status: false },
  groupList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
}

const GroupReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // post
    case POST_GROUPLIST_SUCCESS:
      return {
        ...state,
        postMessage: action.payload,
      }

    // get 
    case GET_GROUP_LIST_SUCCESS:
      return {
        ...state,
       groupList: action.payload,
      }
    //  del
    case DELETE_GROUP_LIST_ID_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      };
      // edit
    case EDIT_GROUPMASTER_ID_SUCCESS :
      return {
        ...state,
        editData: action.payload,
      };

    // update api
    case UPDATE_GROUPMASTER_ID_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      };

    default:
      return state
  }
}

export default GroupReducer