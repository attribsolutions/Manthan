import {
  SAVE_COMPANY_GROUP_MASTER_SUCCESS,
  GET_COMPANY_GROUP_LIST_SUCCESS,
  EDIT_COMPANY_GROUP_ID_SUCCESS,
  UPDATE_COMPANY_GROUP_ID_SUCCESS,
  DELETE_COMPANY_GROUP_ID_SUCCESS,
  SAVE_COMPANY_GROUP_MASTER,
  UPDATE_COMPANY_GROUP_ID,
} from "./actionType";

const INIT_STATE = {
  CompanyGroupList: [],
  postMsg: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  deleteMessage: { Status: false },
}
const CompanyGroupReducer = (state = INIT_STATE, action) => {
  switch (action.type) {


    case SAVE_COMPANY_GROUP_MASTER:
      return {
        ...state,
        saveBtnloading: true
      }

    case SAVE_COMPANY_GROUP_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false
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


    case UPDATE_COMPANY_GROUP_ID:
      return {
        ...state,
        saveBtnloading: true

      };

    case UPDATE_COMPANY_GROUP_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false

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