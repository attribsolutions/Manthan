import {
  GO_BUTTON_IMPORT_FIELD_MAP_ADD_SUCCESS,
  SAVE_IMPORT_FIELD_MAP_SUCCESS,
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  addGoButton:[],
  groupList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
}

const ImportExportFieldMap_Reducer = (state = INIT_STATE, action) => {


  switch (action.type) {

    case GO_BUTTON_IMPORT_FIELD_MAP_ADD_SUCCESS:
      return {
        ...state,
        addGoButton: action.payload,
      }

    // post
    case SAVE_IMPORT_FIELD_MAP_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    // // get 
    // case GET_EXCEL_IMPORT_LIST_SUCCESS:
    //   return {
    //     ...state,
    //     groupList: action.payload,
    //   }
    // //  del
    // case DELETE_EXCEL_IMPORT_LIST_ID_SUCCESS:
    //   return {
    //     ...state,
    //     deleteMsg: action.payload,
    //   };
    // // edit
    // case EDIT_EXCEL_IMPORTMASTER_ID_SUCCESS:
    //   return {
    //     ...state,
    //     editData: action.payload,
    //   };

    // // update api
    // case UPDATE_EXCEL_IMPORTMASTER_ID_SUCCESS:
    //   return {
    //     ...state,
    //     updateMsg: action.payload,
    //   };

    default:
      return state
  }
}

export default ImportExportFieldMap_Reducer