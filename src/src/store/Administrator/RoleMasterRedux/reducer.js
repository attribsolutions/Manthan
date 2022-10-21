import {
  DELETE_ROLE_LIST_ID_SUCCESS,
  EDIT_ROLE_LIST_ID_SUCCESS,
  GET_ROLE_LIST_API_SUCCESS,
  POST_ROLE_MASTER_SUCCESS,
  UPDATE_ROLE_LIST_ID_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  roleList: [],
  postMsg: { Status: false },
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
};

const RoleMaster_Reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // get api
    case GET_ROLE_LIST_API_SUCCESS:
      return {
        ...state,
        roleList: action.payload,
      }

    case POST_ROLE_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      };

    // // delete api
    case DELETE_ROLE_LIST_ID_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      };

    // edit api
    case EDIT_ROLE_LIST_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    // update api
    case UPDATE_ROLE_LIST_ID_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      };

    default:
      return state;
  }
};
export default RoleMaster_Reducer;
