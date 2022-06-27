import {  GET_FRANCHISE_SALE_DATA_SUCCESS, GET_FRANCHISE_SALE_TOP_5_DATA_SUCCESS, GET_POS_SALE_DATA_SUCCESS } from "./actionType"

 const INIT_STATE={DataApi:{DataArray:[], DataArray1:[],CompanyLabels: [],},
  POSDataApi:[],
  Top5ApiData:{labels:[],PrimaryData: [],SecondaryData:[],Secondarylabels:[],},
 }
const FranchiseSale_ChartReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_FRANCHISE_SALE_DATA_SUCCESS:
      return {
        ...state,
        DataApi: action.payload,
      }
      case GET_POS_SALE_DATA_SUCCESS:
        return {
          ...state,
          POSDataApi: action.payload,
        }
      
        case GET_FRANCHISE_SALE_TOP_5_DATA_SUCCESS:
          return {
            ...state,
            Top5ApiData: action.payload,
          }
    default:
      return state
  }
}

export default FranchiseSale_ChartReducer;