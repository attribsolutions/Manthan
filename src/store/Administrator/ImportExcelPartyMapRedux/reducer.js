import {
  INVOICE_EXCEL_UPLOAD_SAVE_SUCCESS,
  GO_BUTTON_IMPORT_EXCEL_PARTY_MAP_SUCCESS,
  SAVE_IMPORT_EXCEL_PARTY_MAP_SUCCESS,
  PARTY_EXCEL_UPLOAD_SAVE_SUCCESS,
  RETAILER_EXCEL_UPLOAD_SAVE_SUCCESS,
  SAVE_IMPORT_EXCEL_PARTY_MAP,
  GO_BUTTON_IMPORT_EXCEL_PARTY_MAP,
  RETAILER_EXCEL_UPLOAD_API_ERROR_ACTION,
} from "./actionType";

const INIT_STATE = {
  saveBtnloading: false,
  listLoading: false,
  postMsg: { Status: false },
  addGoButton: [],
  groupList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  invoiceExcelUploadMsg: { Status: false },
  partyExcelUploadMsg: { Status: false }

}

const ImportExcelPartyMap_Reducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GO_BUTTON_IMPORT_EXCEL_PARTY_MAP:
      return {
        ...state,
        listLoading: true,
      }

    case GO_BUTTON_IMPORT_EXCEL_PARTY_MAP_SUCCESS:
      return {
        ...state,
        addGoButton: action.payload,
        listLoading: false,
      }

    case SAVE_IMPORT_EXCEL_PARTY_MAP:
      return {
        ...state,
        saveBtnloading: true,
      }

    case SAVE_IMPORT_EXCEL_PARTY_MAP_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,
      }

    case INVOICE_EXCEL_UPLOAD_SAVE_SUCCESS:
      return {
        ...state,
        invoiceExcelUploadMsg: action.payload,
      }

    case RETAILER_EXCEL_UPLOAD_SAVE_SUCCESS:
      return {
        ...state,
        partyExcelUploadMsg: action.payload,
      }

    case RETAILER_EXCEL_UPLOAD_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listLoading: false,
      };
    default:
      return state
  }
}

export default ImportExcelPartyMap_Reducer