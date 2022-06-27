import { GET_FRANCHISE_NAME_LIST_ACTION_ACTION_SUCCESS, GET_FRANCHISE_ITEMGROUP_ACTION_SUCCESS, GET_FRANCHISE_TABLEDATA_ACTION_SUCCESS, GET_FRANCHISE_ITEMS_ACTION_SUCCESS,} from "./actionType";

export const GetFranchise_NameListAction_Success = (data) => ({
  type: GET_FRANCHISE_NAME_LIST_ACTION_ACTION_SUCCESS,
  payload: data,
});

export const GetFranchise_ItemGroup_ActionSuccess = (data) => ({
  type: GET_FRANCHISE_ITEMGROUP_ACTION_SUCCESS,
  payload: data,
});

export const GetFranchise_Items_ActionSuccess = (data) => ({
  type: GET_FRANCHISE_ITEMS_ACTION_SUCCESS,
  payload: data,
});

export const GetFranchise_TableData_ActionSuccess = (data) => ({
  type: GET_FRANCHISE_TABLEDATA_ACTION_SUCCESS,
  payload: data,
});
