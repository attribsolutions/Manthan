import {
  DELETE_MATERIAL_ISSUE_LIST_PAGE,
  DELETE_MATERIAL_ISSUE_PAGE_SUCCESS,
  EDIT_MATERIAL_ISSUE_LIST_PAGE,
  EDIT_MATERIAL_ISSUE_LIST_PAGE_SUCCESS,
  GET_MATERIAL_ISSUE_LIST_PAGE,
  GET_MATERIAL_ISSUE_LIST_PAGE_SUCCESS,
  POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER,
  POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER_SUCCESS,
  POST_MATERIAL_ISSUE,
  POST_MATERIAL_ISSUE_SUCCESS
} from "./actionType";



export const goButtonForMaterialIssue_Master_Action = (data) => ({               //GO Button Action
  type: POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER,
  data,
});

export const goButtonForMaterialIssue_Master_ActionSuccess = (data) => ({       //GO Button Action Success
  type: POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER_SUCCESS,
  payload: data,
});

export const saveMaterialIssue = (config={}) => ({                                   //Save Action
  type: POST_MATERIAL_ISSUE,
  config,
});

export const SaveMaterialIssueSuccess = (data) => ({                           //Save Action Success
  type: POST_MATERIAL_ISSUE_SUCCESS,
  payload: data,
});

export const getMaterialIssueListPage = (filters) => ({                        // Material Issue List Page Action
  type: GET_MATERIAL_ISSUE_LIST_PAGE,
  filters,
});

export const getMaterialIssueListPageSuccess = (data) => ({                    // Material Issue List Page Action Sucess
  type: GET_MATERIAL_ISSUE_LIST_PAGE_SUCCESS,
  payload: data,
});

export const editMaterialIssueId = (config = {}) => ({                        //Edit Material issue Action
  type: EDIT_MATERIAL_ISSUE_LIST_PAGE,
  config

});
export const editMaterialIssueIdSuccess = (data) => ({                         //Edit Material issue Action Success
  type: EDIT_MATERIAL_ISSUE_LIST_PAGE_SUCCESS,
  payload: data,
});

export const deleteMaterialIssueId = (config = {}) => ({                                 //Delete Material issue Action
  type: DELETE_MATERIAL_ISSUE_LIST_PAGE,
  config,
});
export const deleteMaterialIssueIdSuccess = (data) => ({                        //Delete Material issue Action Success
  type: DELETE_MATERIAL_ISSUE_PAGE_SUCCESS,
  payload: data,
});