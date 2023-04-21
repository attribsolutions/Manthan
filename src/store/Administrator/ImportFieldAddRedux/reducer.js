import {
  DELETE_IMPORT_FIELD_ADD_SUCCESS,
  EDIT_IMPORT_FIELD_ADD_SUCCESS,
  POST_IMPORT_FIELD_ADD_SUCCESS,
  SAVE_IMPORT_FIELD_ADD_SUCCESS,
   UPDATE_IMPORT_FIELD_ADD_SUCCESS,
} from "./actionType";

const INIT_STATE = {
  getList:[],
  postMsg: { Status: false },
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
}

const ImportFieldAdd_Reducer = (state = INIT_STATE, action) => {


  switch (action.type) {


    // post
    case SAVE_IMPORT_FIELD_ADD_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    // get 
    case POST_IMPORT_FIELD_ADD_SUCCESS:
      return {
        ...state,
       getList: action.payload,
      }
    //  del
    case DELETE_IMPORT_FIELD_ADD_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      };
    // edit
    case EDIT_IMPORT_FIELD_ADD_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    // update api
    case UPDATE_IMPORT_FIELD_ADD_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      };

    default:
      return state
  }
}

export default ImportFieldAdd_Reducer