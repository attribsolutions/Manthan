import {
  EXCEL_UPLOAD_SAVE_SUCCESS,
  GO_BUTTON_IMPORT_MASTER_MAP_SUCCESS,
  SAVE_IMPORT_MASTER_MAP_SUCCESS,
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  addGoButton: [],
  groupList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  excelPostMsg: { Status: false }
}

const ImportMasterMap_Reducer = (state = INIT_STATE, action) => {


  switch (action.type) {

    case GO_BUTTON_IMPORT_MASTER_MAP_SUCCESS:
      return {
        ...state,
        addGoButton: action.payload,
      }

    // post
    case SAVE_IMPORT_MASTER_MAP_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    case EXCEL_UPLOAD_SAVE_SUCCESS:
      return {
        ...state,
        excelPostMsg: action.payload,
      }


    default:
      return state
  }
}

export default ImportMasterMap_Reducer