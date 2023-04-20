import {
  DELETE_IMPORT_FIELD_ID_SUCCESS,
  EDIT_IMPORT_FIELD_ID_SUCCESS,
  GET_IMPORT_FIELD_LIST_SUCCESS,
  GET_CONTROLTYPE_DROPDOWN_SUCCESS,
  GET_VALIDATIONTYPE_DROPDOWN_SUCCESS,
  POST_IMPORT_FIELD_SUCCESS,
  UPDATE_IMPORT_FIELD_ID_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  ImportFieldList: [],
  editData: { Status: false },
  deleteMessage: { Status: false },
  postMsg: { Status: false },
  updateMessage: { Status: false },
  ControlType: [],
  ValidationType: []
}

const ImportFieldReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_IMPORT_FIELD_LIST_SUCCESS:
      return {
        ...state,
        ImportFieldList: action.payload,
      };

    case POST_IMPORT_FIELD_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      };

    case DELETE_IMPORT_FIELD_ID_SUCCESS:
      return {
        ...state,
        deleteCompanyID: action.payload,
      };

    case EDIT_IMPORT_FIELD_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    case UPDATE_IMPORT_FIELD_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      };

    case GET_CONTROLTYPE_DROPDOWN_SUCCESS:
      return {
        ...state,
        ControlType: action.payload,
      };

      case GET_VALIDATIONTYPE_DROPDOWN_SUCCESS:
        return {
          ...state,
          ValidationType: action.payload,
        };

    default:
      return state
  }

}

export default ImportFieldReducer