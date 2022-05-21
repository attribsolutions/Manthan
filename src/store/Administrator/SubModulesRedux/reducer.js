import {
  POST_SUB_MODULE_SUCCESS_ID,
  UPDATE_MODULE_SUCCESS,
  GET_SUB_MODULES_SUCCESS,
  GET_SUB_MODULES_EDIT_DATA_USING_ID_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  ListData: [],
  saveMessage: [],
  editData: [],
  updateMessage: [],
};
const SubModule = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_SUB_MODULES_SUCCESS:
      return {
        ...state,
        ListData: action.payload,
      };
  
    case POST_SUB_MODULE_SUCCESS_ID:
      return {
        ...state,
        saveMessage: action.payload,
      };
 
    case GET_SUB_MODULES_EDIT_DATA_USING_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    case UPDATE_MODULE_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      };

    default:
      return state;
  }
};

export default SubModule;