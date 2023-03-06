import { GET_PDF_REPORT_DATA_SUCCESS } from "./actionType"
debugger

const INIT_STATE = {
  pdfdata: {Status:false},
}
debugger

const PdfReportReducers = (state = INIT_STATE, action) => {
  debugger
  switch (action.type) {


    case GET_PDF_REPORT_DATA_SUCCESS:
      return {
        ...state,
        pdfdata: action.payload,
      }

    default:
      return state
  }
}

export default PdfReportReducers;