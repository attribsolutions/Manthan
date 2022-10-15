
import { GET_GROUP_LIST, GET_GROUP_LIST_SUCCESS } from "./actionType";
  


/// get Group list 
export const getGroupList = () => ({
  type: GET_GROUP_LIST,
});

export const getGroupListSuccess = (pages) => ({
  type: GET_GROUP_LIST_SUCCESS,
  payload: pages,
});

  
  