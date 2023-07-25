import {
  INVOICE_EXCEL_UPLOAD_SAVE_SUCCESS,
  GO_BUTTON_IMPORT_EXCEL_PARTY_MAP_SUCCESS,
  SAVE_IMPORT_EXCEL_PARTY_MAP_SUCCESS,
  RETAILER_EXCEL_UPLOAD_SAVE_SUCCESS,
  SAVE_IMPORT_EXCEL_PARTY_MAP,
  GO_BUTTON_IMPORT_EXCEL_PARTY_MAP,
  RETAILER_EXCEL_UPLOAD_API_ERROR_ACTION,
  RETAILER_EXCEL_UPLOAD_SAVE,
} from "./actionType";

const INIT_STATE = {
  saveBtnLoading: false,
  listBtnLoading: false,
  postMsg: { Status: false },
  partyUploadSaveLoading: false,
  addGoButton: [],
  invoiceExcelUploadMsg: { Status: false },
  partyExcelUploadMsg: { Status: false },

}

const ImportExcelPartyMap_Reducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GO_BUTTON_IMPORT_EXCEL_PARTY_MAP:
      return {
        ...state,
        listBtnLoading: true,
      }

    case GO_BUTTON_IMPORT_EXCEL_PARTY_MAP_SUCCESS:
      return {
        ...state,
        addGoButton: action.payload,
        listBtnLoading: false,
      }

    case SAVE_IMPORT_EXCEL_PARTY_MAP:
      return {
        ...state,
        saveBtnLoading: true,
      }

    case SAVE_IMPORT_EXCEL_PARTY_MAP_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnLoading: false,
      }

    case INVOICE_EXCEL_UPLOAD_SAVE_SUCCESS:
      return {
        ...state,
        invoiceExcelUploadMsg: action.payload,
      }

    case RETAILER_EXCEL_UPLOAD_SAVE:
      return {
        ...state,
        partyUploadSaveLoading: true,
      }

    case RETAILER_EXCEL_UPLOAD_SAVE_SUCCESS:
      return {
        ...state,
        partyUploadSaveLoading: false,
        partyExcelUploadMsg: action.payload,
      }

    case RETAILER_EXCEL_UPLOAD_API_ERROR_ACTION:
      return {
        ...state,
        partyUploadSaveLoading: false,
        saveBtnLoading: false,
        listBtnLoading: false,
      };
    default:
      return state
  }
}

export default ImportExcelPartyMap_Reducer