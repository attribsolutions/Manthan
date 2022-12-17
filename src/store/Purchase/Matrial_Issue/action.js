import {
    GET_MATERIAL_ISSUE_LIST_PAGE,
    GET_MATERIAL_ISSUE_LIST_PAGE_SUCCESS,
    POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER,
    POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER_SUCCESS,
    POST_MATERIAL_ISSUE,
    POST_MATERIAL_ISSUE_SUCCESS
} from "./actionType";

// Go Button Post API
export const postGoButtonForMaterialIssue_Master = (data,) => ({
    type: POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER,
    data,
});

export const postGoButtonForMaterialIssue_MasterSuccess = (data) => ({
    type: POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER_SUCCESS,
    payload: data,
});

// post api
export const postMaterialIssue = (data) => ({
    type: POST_MATERIAL_ISSUE,
    data,
  });
  
  export const postMaterialIssueSuccess = (data) => ({
    type: POST_MATERIAL_ISSUE_SUCCESS,
    payload: data,
  });

  //get listpage api
export const getMaterialIssueListPage = (filters) => ({
    type: GET_MATERIAL_ISSUE_LIST_PAGE,
    filters,
  });
  
  export const getMaterialIssueListPageSuccess = (data) => ({
    type:GET_MATERIAL_ISSUE_LIST_PAGE_SUCCESS,
    payload: data,
  });