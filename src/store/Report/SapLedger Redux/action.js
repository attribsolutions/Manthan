import {
  GO_BUTTON_API_SAP_LEDGER,
  GO_BUTTON_API_SAP_LEDGER_SUCCESS,
  GET_EXCELBUTTON_API,
  GET_EXCELBUTTON_API_SUCCESS
} from "./actionType";


export const SapLedger_Go_Button_API = (filters) => ({ // save Action
  type: GO_BUTTON_API_SAP_LEDGER,
  filters,
});

export const SapLedger_Go_Button_API_Success = (resp) => ({ // Save  success
  type: GO_BUTTON_API_SAP_LEDGER_SUCCESS,
  payload: resp,
});

export const getExcel_Button_API = (jsonbody) => ({ // save Action
  type: GET_EXCELBUTTON_API,
  jsonbody,
});

export const getExcel_Button_API_Success = (pages) => ({ // Save  success
  type: GET_EXCELBUTTON_API_SUCCESS,
  payload: pages,
});
