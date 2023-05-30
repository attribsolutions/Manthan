import {

  GO_BUTTON_API_SAP_LEDGER,
  GO_BUTTON_API_SAP_LEDGER_SUCCESS,
 
} from "./actionType";


export const SapLedger_Go_Button_API = (fromdate,todate,SAPCode) => ({ // save Action
  type: GO_BUTTON_API_SAP_LEDGER,
  fromdate,todate,SAPCode,
});

export const SapLedger_Go_Button_API_Success = (resp) => ({ // Save  success
  type: GO_BUTTON_API_SAP_LEDGER_SUCCESS,
  payload: resp,
});

