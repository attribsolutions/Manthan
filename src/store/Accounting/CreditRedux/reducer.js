import { DELETE_CREDIT_LIST_ID_SUCCESS, DELETE_GROUP_LIST_ID_SUCCESS, 
  EDIT_GROUPMASTER_ID_SUCCESS, 
  GET_CREDIT_LIST_SUCCESS, 
  GET_GROUP_LIST_SUCCESS, 
  SAVE_CREDIT_SUCCESS, 
  SAVE_GROUP_MASTER_SUCCESS,
  UPDATE_GROUPMASTER_ID_SUCCESS} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  CreditList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
}

const GroupReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // post
    case SAVE_CREDIT_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    // get 
    case GET_CREDIT_LIST_SUCCESS:
      return {
        ...state,
       CreditList: action.payload,
      }
    //  del
    case DELETE_CREDIT_LIST_ID_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      };
      // edit
    // case EDIT_GROUPMASTER_ID_SUCCESS :
    //   return {
    //     ...state,
    //     editData: action.payload,
    //   };

    // update api
    // case UPDATE_GROUPMASTER_ID_SUCCESS:
    //   return {
    //     ...state,
    //     updateMsg: action.payload,
    //   };

    default:
      return state
  }
}

export default GroupReducer