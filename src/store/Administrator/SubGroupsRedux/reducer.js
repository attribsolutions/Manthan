import {
  DELETE_SUBGROUP_LIST_ID_SUCCESS,
  EDIT_SUBGROUPMASTER_ID_SUCCESS,
  GET_SUBGROUP_LIST_SUCCESS,
  SAVE_SUBGROUPLIST,
  SAVE_SUBGROUPLIST_SUCCESS,
  UPDATE_SUBGROUPMASTER_ID,
  UPDATE_SUBGROUPMASTER_ID_SUCCESS
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  SubgroupList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  saveBtnloading: false,
}

const SubGroupReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_SUBGROUPLIST:
      return {
        ...state,
        saveBtnloading: true,
      }

    case SAVE_SUBGROUPLIST_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,
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
    case EDIT_SUBGROUPMASTER_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    // update api
    case UPDATE_SUBGROUPMASTER_ID:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_SUBGROUPMASTER_ID_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
        saveBtnloading: false,

      };

    default:
      return state
  }
}

export default SubGroupReducer