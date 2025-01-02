import { GET_PDF_REPORT_DATA, GET_PDF_REPORT_DATA_ERROR, GET_PDF_REPORT_DATA_SUCCESS } from "./actionType"

const INIT_STATE = {
  pdfdata: { Status: false },
  ReportBtnLoading: false,
  goBtnLoading: false,
  customerWiseBtnloading: false,
  claimSummaryBtnLoading: false,
  printAllBtnLoading:false,
}

const PdfReportReducers = (state = INIT_STATE, action) => {

  switch (action.type) {
    case GET_PDF_REPORT_DATA:
      return {
        ...state,
        printAllBtnLoading:true,
        ReportBtnLoading: action.config.btnId,
        goBtnLoading: true,
        customerWiseBtnloading: true,


      }

    case GET_PDF_REPORT_DATA_SUCCESS:
      return {
        ...state,
        printAllBtnLoading:false,
        ReportBtnLoading: false,
        goBtnLoading: false,
        customerWiseBtnloading: false,
        pdfdata: action.payload,

      }

    case GET_PDF_REPORT_DATA_ERROR:
      return {
        ...state,
        ReportBtnLoading: false,
        goBtnLoading: false,
        printAllBtnLoading:false,

      }
    default:
      return state
  }
}

export default PdfReportReducers;