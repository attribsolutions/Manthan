import {
    POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER,
    POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER_SUCCESS
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