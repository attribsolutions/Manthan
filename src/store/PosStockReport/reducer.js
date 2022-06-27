import { GET_POS_STOCK_REPORT_DATA_ACTION_SUCCESS } from "./actionType"

 const INIT_STATE={StockDataApi:[],
 }
const Pos_Stock_Report_Reducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_POS_STOCK_REPORT_DATA_ACTION_SUCCESS:
      return {
        ...state,
       StockDataApi: action.payload,
      }
    default:
      return state
  }
}

export default Pos_Stock_Report_Reducer;