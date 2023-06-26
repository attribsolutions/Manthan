import { GET_PDF_REPORT_DATA, GET_PDF_REPORT_DATA_ERROR, GET_PDF_REPORT_DATA_SUCCESS } from "./actionType"

const INIT_STATE = {
  pdfdata: { Status: false },
  listBtnLoading: false,
}

const PdfReportReducers = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PDF_REPORT_DATA:
      return {
        ...state,
        listBtnLoading: action.btnId,
      }

    case GET_PDF_REPORT_DATA_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        pdfdata: action.payload,
      }

    case GET_PDF_REPORT_DATA_ERROR:
      return {
        ...state,
        listBtnLoading: false,
      }
    default:
      return state
  }
}

export default PdfReportReducers;