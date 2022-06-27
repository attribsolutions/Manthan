import {GET_FRANCHISE_SALE_DATA, GET_FRANCHISE_SALE_DATA_SUCCESS, GET_FRANCHISE_SALE_TOP_5_DATA_SUCCESS, GET_POS_SALE_DATA_SUCCESS,} from "./actionType";

export const GetFranchiseSellData = (data) => ({
  type: GET_FRANCHISE_SALE_DATA,
  data,
});

export const GetFranchiseSellDataSuccess = (data) => ({
  type: GET_FRANCHISE_SALE_DATA_SUCCESS,
  payload: data,
});



export const GetPOSSellDataSuccess = (data) => ({
  type: GET_POS_SALE_DATA_SUCCESS,
  payload: data,
});

export const GetFranchiseSell_Top_5_Success = (data) => ({
  type: GET_FRANCHISE_SALE_TOP_5_DATA_SUCCESS,
  payload: data,
});
