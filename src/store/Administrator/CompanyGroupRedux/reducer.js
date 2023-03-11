import {
  SAVE_COMPANY_GROUP_MASTER_SUCCESS,
  GET_COMPANY_GROUP_LIST_SUCCESS,
  EDIT_COMPANY_GROUP_ID_SUCCESS,
  UPDATE_COMPANY_GROUP_ID_SUCCESS,
  DELETE_COMPANY_GROUP_ID_SUCCESS,
} from "./actionType";

const INIT_STATE = {
  CompanyGroupList: [],
  PostDataMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  deleteMessage: { Status: false },
}
const CompanyGroupReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_COMPANY_GROUP_MASTER_SUCCESS:
      return {
        ...state,
        PostDataMessage: action.payload,
      }

    case GET_COMPANY_GROUP_LIST_SUCCESS:
      return {
        ...state,
        CompanyGroupList: action.payload,
      }

    case EDIT_COMPANY_GROUP_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    case UPDATE_COMPANY_GROUP_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      };

    case DELETE_COMPANY_GROUP_ID_SUCCESS:
      return {
        ...state,
        deleteMessage: action.payload,
      };

    default:
      return state
  }
}

export default CompanyGroupReducer