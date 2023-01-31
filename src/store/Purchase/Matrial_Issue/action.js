import {
  DELETE_MATERIAL_ISSUE_LIST_PAGE,
    DELETE_MATERIAL_ISSUE_PAGE_SUCCESS,
    EDIT_MATERIAL_ISSUE_LIST_PAGE,
    EDIT_MATERIAL_ISSUE_LIST_PAGE_SUCCESS,
    GET_MATERIAL_ISSUE_LIST_PAGE,
    GET_MATERIAL_ISSUE_LIST_PAGE_SUCCESS,
    MATERIAL_ISSUE_LIST_FILTERS,
    POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER,
    POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER_SUCCESS,
    POST_MATERIAL_ISSUE,
    POST_MATERIAL_ISSUE_SUCCESS
} from "./actionType";

export const MaterialIssuelistfilters = filter => ({
  type:MATERIAL_ISSUE_LIST_FILTERS,
  payload: filter,
})

// Go Button Post API
export const goButtonForMaterialIssue_Master_Action = (data) => ({
    type: POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER,
    data,
});

export const goButtonForMaterialIssue_Master_ActionSuccess = (data) => ({
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

  // listpage api
  export const editMaterialIssueId = (id,pageMode) => ({
    type: EDIT_MATERIAL_ISSUE_LIST_PAGE,
    id,pageMode

  });
  export const editMaterialIssueIdSuccess = (data) => ({
    type: EDIT_MATERIAL_ISSUE_LIST_PAGE_SUCCESS,
    payload: data,
  });

  export const deleteMaterialIssueId = (id) => ({
    type: DELETE_MATERIAL_ISSUE_LIST_PAGE,
    id,
  });
  export const deleteMaterialIssueIdSuccess = (data) => ({
    type: DELETE_MATERIAL_ISSUE_PAGE_SUCCESS,
    payload: data,
  });