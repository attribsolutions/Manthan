import { DATA_EXPORT_TO_SAP_ACTION, DATA_EXPORT_TO_SAP_ACTION_SUCCESS, DATA_EXPORT_TO_SAP_ERROR_ACTION, FETCH_UPLOADED_FILE_ACTION, FETCH_UPLOADED_FILE_ACTION_SUCCESS, FETCH_UPLOADED_FILE_ERROR_ACTION } from "./actionType"

const INIT_STATE = {
    ExportToSAPData: [],
    UploaledFileData: [],

}

const ExportToSapReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case DATA_EXPORT_TO_SAP_ACTION:
            return {
                ...state,
                listBtnLoading:true
            }

        case DATA_EXPORT_TO_SAP_ACTION_SUCCESS:
            return {
                ...state,
                ExportToSAPData: action.payload,
                listBtnLoading: false
            }


        case DATA_EXPORT_TO_SAP_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        case FETCH_UPLOADED_FILE_ACTION:
            return {
                ...state,
                listBtnLoading: true
            }

        case FETCH_UPLOADED_FILE_ACTION_SUCCESS:
            return {
                ...state,
                UploaledFileData: action.payload,
                listBtnLoading: false
            }

        case FETCH_UPLOADED_FILE_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default ExportToSapReducer  