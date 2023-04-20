import {
  DELETE_EXCEL_IMPORT_LIST_ID_SUCCESS,
  EDIT_EXCEL_IMPORTMASTER_ID_SUCCESS,
  GET_EXCEL_IMPORT_LIST_SUCCESS,
  GO_BUTTON_EXCEL_IMPORT_ADD_SUCCESS,
  SAVE_EXCEL_IMPORT_MASTER_SUCCESS,
  UPDATE_EXCEL_IMPORTMASTER_ID_SUCCESS
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  addGoButton:[],
  groupList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
}

const ImportMasterReducer = (state = INIT_STATE, action) => {


  switch (action.type) {

    case GO_BUTTON_EXCEL_IMPORT_ADD_SUCCESS:
      return {
        ...state,
        addGoButton: action.payload,
      }

    // post
    case SAVE_EXCEL_IMPORT_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    // get 
    case GET_EXCEL_IMPORT_LIST_SUCCESS:
      return {
        ...state,
        groupList: action.payload,
      }
    //  del
    case DELETE_EXCEL_IMPORT_LIST_ID_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      };
    // edit
    case EDIT_EXCEL_IMPORTMASTER_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    // update api
    case UPDATE_EXCEL_IMPORTMASTER_ID_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      };

    default:
      return state
  }
}

export default ImportMasterReducer