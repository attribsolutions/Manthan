import {
    DELETE_GST_FOR_MASTER_PAGE,
    DELETE_GST_FOR_MASTER_PAGE_SUCCESS
} from "./actionType";

export const deleteGSTForMasterPage = (id) => ({
    type: DELETE_GST_FOR_MASTER_PAGE,
    id,
});

export const deleteGSTForMasterPageSuccess = (data) => ({
    type: DELETE_GST_FOR_MASTER_PAGE_SUCCESS,
    payload: data,
});
