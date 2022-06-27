import { GET_POS_STOCK_REPORT_DATA_ACTION, GET_POS_STOCK_REPORT_DATA_ACTION_SUCCESS,} from "./actionType";

export const GetPosStockReportDataAction = (data) => ({
  type: GET_POS_STOCK_REPORT_DATA_ACTION,
  data,
});

export const GetPosStockReportDataActionSuccess = (data) => ({
  type: GET_POS_STOCK_REPORT_DATA_ACTION_SUCCESS,
  payload: data,
});

