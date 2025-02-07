import { DATA_EXPORT_TO_SAP_ACTION, DATA_EXPORT_TO_SAP_ACTION_SUCCESS, DATA_EXPORT_TO_SAP_ERROR_ACTION, FETCH_UPLOADED_FILE_ACTION, FETCH_UPLOADED_FILE_ACTION_SUCCESS, FETCH_UPLOADED_FILE_ERROR_ACTION } from "./actionType";

export const DataExportTo_SAP_Action = (config) => ({
    type: DATA_EXPORT_TO_SAP_ACTION,
    config
});

export const DataExportTo_SAP_Action_Success = resp => ({
    type: DATA_EXPORT_TO_SAP_ACTION_SUCCESS,
    payload: resp,
})

export const DataExportTo_SAP_Action_ErrorAction = resp => ({
    type: DATA_EXPORT_TO_SAP_ERROR_ACTION,
    payload: resp,
})




export const Fetch_UploadFile_Action = (config) => ({
    type: FETCH_UPLOADED_FILE_ACTION,
    config
});

export const Fetch_UploadFile_Action_Success = resp => ({
    type: FETCH_UPLOADED_FILE_ACTION_SUCCESS,
    payload: resp,
})

export const Fetch_UploadFile_Action_ErrorAction = resp => ({
    type: FETCH_UPLOADED_FILE_ERROR_ACTION,
    payload: resp,
})
