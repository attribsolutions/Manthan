import { GET_GROUP_LIST_SUCCESS } from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  groupList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
}

const GroupReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    // case POST_METHOD_HANDLER_FOR_CATEGORY_API_SUCCESS:
    //   return {
    //     ...state,
    //     postMsg: action.payload,
    //   }

    // get api
    case GET_GROUP_LIST_SUCCESS:
      return {
        ...state,
       groupList: action.payload,
      }

    // case DELETE_CATEGORY_ID_SUCCESS:
    //   return {
    //     ...state,
    //     deleteMsg: action.payload,
    //   };

    // case EDIT_CATEGORY_ID_SUCCESS:
    //   return {
    //     ...state,
    //     editData: action.payload,
    //   };

    // // update api
    // case UPDATE_CATEGORY_ID_SUCCESS:
    //   return {
    //     ...state,
    //     updateMsg: action.payload,
    //   };

    default:
      return state
  }
}

export default GroupReducer