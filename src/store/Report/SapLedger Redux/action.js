import {
  GO_BUTTON_API_SAP_LEDGER,
  GO_BUTTON_API_SAP_LEDGER_SUCCESS,
  GET_EXCELBUTTON_API,
  GET_EXCELBUTTON_API_SUCCESS,
  GO_BUTTON_API_SAP_LEDGER_ERROR
} from "./actionType";


export const SapLedger_Go_Button_API = (filters) => ({ // save Action
  type: GO_BUTTON_API_SAP_LEDGER,
  filters,
});

export const SapLedger_Go_Button_API_Success = (resp) => ({ // Save  success
  type: GO_BUTTON_API_SAP_LEDGER_SUCCESS,
  payload: resp,
});

export const getExcel_Button_API = (IsSCM_ID, PartyID) => ({ // save Action
  type: GET_EXCELBUTTON_API,
  IsSCM_ID, PartyID
});

export const getExcel_Button_API_Success = (pages) => ({ // Save  success
  type: GET_EXCELBUTTON_API_SUCCESS,
  payload: pages,
});

export const LedgerApiErrorAction = () => ({
  type: GO_BUTTON_API_SAP_LEDGER_ERROR,
})

