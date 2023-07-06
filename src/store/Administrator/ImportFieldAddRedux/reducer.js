import {
  DELETE_IMPORT_FIELD_ADD,
  DELETE_IMPORT_FIELD_ADD_SUCCESS,
  EDIT_IMPORT_FIELD_ADD,
  EDIT_IMPORT_FIELD_ADD_SUCCESS,
  IMPORT_EXCEL_TYPE_SUCCESS,
  POST_IMPORT_FIELD_ADD,
  POST_IMPORT_FIELD_ADD_SUCCESS,
  SAVE_IMPORT_FIELD_ADD,
  SAVE_IMPORT_FIELD_ADD_SUCCESS,
  UPDATE_IMPORT_FIELD_ADD,
  UPDATE_IMPORT_FIELD_ADD_SUCCESS,
  IMPORT_FIELD_ADD_API_ERROR_ACTION
} from "./actionType";

const INIT_STATE = {
  getList: [],
  postMsg: { Status: false },
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  importExcelType: [],
  saveBtnloading: false,
  listBtnLoading: false,
  loading:false
}

const ImportFieldAdd_Reducer = (state = INIT_STATE, action) => {


  switch (action.type) {

    // post
    case SAVE_IMPORT_FIELD_ADD:
      return {
        ...state,
        saveBtnloading: true
      }

    case SAVE_IMPORT_FIELD_ADD_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false
      }

    // get 

    case POST_IMPORT_FIELD_ADD:
      return {
        ...state,
        loading: true,
      }

    case POST_IMPORT_FIELD_ADD_SUCCESS:
      return {
        ...state,
        getList: action.payload,
        loading: false,
      }

    //  del
    case DELETE_IMPORT_FIELD_ADD:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case DELETE_IMPORT_FIELD_ADD_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
        listBtnLoading: false,
      };

    // edit
    case EDIT_IMPORT_FIELD_ADD:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case EDIT_IMPORT_FIELD_ADD_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    // update api

    case UPDATE_IMPORT_FIELD_ADD:
      return {
        ...state,
        saveBtnloading: true

      };

    case UPDATE_IMPORT_FIELD_ADD_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
        saveBtnloading: false

      };

    case IMPORT_EXCEL_TYPE_SUCCESS:
      return {
        ...state,
        importExcelType: action.payload,
      };

      case IMPORT_FIELD_ADD_API_ERROR_ACTION:
        return {
          ...state,
          saveBtnloading: false,
          listBtnLoading: false,
          loading:false
        };

    default:
      return state
  }
}

export default ImportFieldAdd_Reducer