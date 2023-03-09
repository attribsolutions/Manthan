import { GET_PDF_MULTIPLEINVOICE_DATA_SUCCESS, GET_PDF_REPORT_DATA_SUCCESS } from "./actionType"

const INIT_STATE = {
  pdfdata: {Status:false}

}

const PdfReportReducers = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_PDF_REPORT_DATA_SUCCESS:
      return {
        ...state,
        pdfdata: action.payload,
      }
      case GET_PDF_MULTIPLEINVOICE_DATA_SUCCESS:
      return {
        ...state,
        pdfdata: action.payload,
      }

    default:
      return state
  }
}

export default PdfReportReducers;