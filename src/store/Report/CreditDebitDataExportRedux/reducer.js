import { POST_CREDIT_DEBIT_DATA_EXPORT_API, POST_CREDIT_DEBIT_DATA_EXPORT_API_ERROR_ACTION, POST_CREDIT_DEBIT_DATA_EXPORT_API_SUCCESS } from "./actionType";

const INIT_STATE = {
    CreditDebit_DataExportGobtn: [],

    GoBtnLoading: false,
    ExcelBtnLoading: false
}

const CreditDebitDataExportReducer = (state = INIT_STATE, action) => {

    switch (action.type) {

        case POST_CREDIT_DEBIT_DATA_EXPORT_API:
            return {
                ...state,
                GoBtnLoading: action.config.btnId,
                ExcelBtnLoading: action.config.btnId
            }

        case POST_CREDIT_DEBIT_DATA_EXPORT_API_SUCCESS:
            return {
                ...state,
                CreditDebit_DataExportGobtn: action.payload,
                GoBtnLoading: false,
                ExcelBtnLoading: false
            }

        case POST_CREDIT_DEBIT_DATA_EXPORT_API_ERROR_ACTION:
            return {
                ...state,
                GoBtnLoading: false,
                ExcelBtnLoading: false
            };


        default:
            return state
    }
}

export default CreditDebitDataExportReducer  