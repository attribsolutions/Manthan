import {
  INVOICE_EXCEL_UPLOAD_SAVE_SUCCESS,
  GO_BUTTON_IMPORT_EXCEL_PARTY_MAP_SUCCESS,
  SAVE_IMPORT_EXCEL_PARTY_MAP_SUCCESS,
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  addGoButton: [],
  groupList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  invoiceExcelUploadMsg: { Status: false }
}

const ImportExcelPartyMap_Reducer = (state = INIT_STATE, action) => {


  switch (action.type) {

    case GO_BUTTON_IMPORT_EXCEL_PARTY_MAP_SUCCESS:
      return {
        ...state,
        addGoButton: action.payload,
      }

    case SAVE_IMPORT_EXCEL_PARTY_MAP_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    case INVOICE_EXCEL_UPLOAD_SAVE_SUCCESS:
      return {
        ...state,
        invoiceExcelUploadMsg: action.payload,
      }


    default:
      return state
  }
}

export default ImportExcelPartyMap_Reducer