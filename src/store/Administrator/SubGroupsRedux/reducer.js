import { DELETE_SUBGROUP_LIST_ID_SUCCESS, 
    EDIT_SUBGROUPMASTER_ID_SUCCESS, 
    GET_SUBGROUP_LIST_SUCCESS, 
    POST_SUBGROUPLIST_SUCCESS,
    UPDATE_SUBGROUPMASTER_ID_SUCCESS} from "./actionType";
  
  const INIT_STATE = {
    postMsg: { Status: false },
    SubgroupList: [],
    deleteMsg: { Status: false },
    editData: { Status: false },
    updateMsg: { Status: false },
  }
  
  const SubGroupReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      // post
      case POST_SUBGROUPLIST_SUCCESS:
        return {
          ...state,
          postMsg: action.payload,
        }
  
      // get 
      case GET_SUBGROUP_LIST_SUCCESS:
        return {
          ...state,
          SubgroupList: action.payload,
        }
      //  del
      case DELETE_SUBGROUP_LIST_ID_SUCCESS:
        return {
          ...state,
          deleteMsg: action.payload,
        };
        // edit
      case EDIT_SUBGROUPMASTER_ID_SUCCESS :
        return {
          ...state,
          editData: action.payload,
        };
  
      // update api
      case UPDATE_SUBGROUPMASTER_ID_SUCCESS:
        return {
          ...state,
          updateMsg: action.payload,
        };
  
      default:
        return state
    }
  }
  
  export default SubGroupReducer