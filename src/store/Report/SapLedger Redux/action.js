import {
  GO_BUTTON_API_SAP_LEDGER,
  GO_BUTTON_API_SAP_LEDGER_SUCCESS,
  PRODUCTMARGIN_GO_BTN_ACTION,
  PRODUCTMARGIN_GO_BTN_SUCCESS,
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

export const ProductMargin_Go_Btn_Action = (config={}) => ({ // save Action
  type: PRODUCTMARGIN_GO_BTN_ACTION,
  config
});

export const ProductMargin_Go_Btn_Success = (pages) => ({ // Save  success
  type: PRODUCTMARGIN_GO_BTN_SUCCESS,
  payload: pages,
});

export const LedgerApiErrorAction = () => ({
  type: GO_BUTTON_API_SAP_LEDGER_ERROR,
})

