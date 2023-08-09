import {
  GO_BUTTON_IMPORT_FIELD_MAP_ADD,
  GO_BUTTON_IMPORT_FIELD_MAP_ADD_SUCCESS,
  IMPORT_FIELD_MAP_API_ERROR_ACTION,
  SAVE_IMPORT_FIELD_MAP,
  SAVE_IMPORT_FIELD_MAP_SUCCESS,
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  addGoButton: [],
  goBtnLoading: false,
  saveBtnLoading: false
}

const ImportExportFieldMap_Reducer = (state = INIT_STATE, action) => {


  switch (action.type) {

    case GO_BUTTON_IMPORT_FIELD_MAP_ADD:
      return {
        ...state,
        goBtnLoading: true,
      }

    case GO_BUTTON_IMPORT_FIELD_MAP_ADD_SUCCESS:
      return {
        ...state,
        goBtnLoading: false,
        addGoButton: action.payload,
      }

    case SAVE_IMPORT_FIELD_MAP:
      return {
        ...state,
        saveBtnLoading: true
      }

    case SAVE_IMPORT_FIELD_MAP_SUCCESS:
      return {
        ...state,
        saveBtnLoading: false,
        postMsg: action.payload,
      }
    case IMPORT_FIELD_MAP_API_ERROR_ACTION:
      return {
        ...state,
        goBtnLoading: false,
        saveBtnLoading: false
      }



    default:
      return state
  }
}

export default ImportExportFieldMap_Reducer