
import {

    POST_GO_BUTTON_FOR_IBORDER,
    POST_GO_BUTTON_FOR_IBORDER_SUCCESS,
    POST_IBORDER,
    POST_IBORDER_SUCCESS,
    POST_DIVISION,
    POST_DIVISION_SUCCESS,
    IBORDER_LIST_FILTERS,
    POST_IBORDER_LIST_PAGE,
    POST_IBORDER_LIST_PAGE_SUCCESS,
    UPDATE_IBORDER_ID_FROM_IBORDER_PAGE,
    UPDATE_IBORDER_ID_FROM_IBORDER_PAGE_SUCCESS,
    EDIT_IBORDER_FOR_IBORDER_PAGE_SUCCESS,
    EDIT_IBORDER_FOR_IBORDER_PAGE,
    DELETE_IBORDER_FOR_IBORDER_PAGE,
    DELETE_IBORDER_FOR_IBORDER_PAGE_SUCCESS,
} from "./actionType";

// Go Button Post API
export const postGoButtonForIBOrder = (data) => ({
    type: POST_GO_BUTTON_FOR_IBORDER,
    data,
});

export const postGoButtonForIBOrderSuccess = (data) => ({
    type: POST_GO_BUTTON_FOR_IBORDER_SUCCESS,


// post api

export const postIBOrder = (data) => ({
    type: POST_IBORDER,
    data,
});

export const postIBOrderSuccess = (data) => ({
    type: POST_IBORDER_SUCCESS,
    payload: data,
});

//List Filters IBOrder
export const iborderlistfilter = filter => ({
    type: IBORDER_LIST_FILTERS,



/// Division  dropdown
export const postDivision = (data) => ({
    type: POST_DIVISION,
    data,

});
export const postDivisionSuccess = (data) => ({
    type: POST_DIVISION_SUCCESS,
    payload: data,

});

///List page
export const postIBOrderListPage = (filters) => ({
    type: POST_IBORDER_LIST_PAGE,
});

export const postIBOrderListPageSuccess = (data) => ({

    type: POST_IBORDER_LIST_PAGE_SUCCESS,
    payload: data,
});

//EDIT

export const editIBOrderId = (jsonBody, pageMode) => ({
    type: EDIT_IBORDER_FOR_IBORDER_PAGE,
    jsonBody, pageMode
});
export const editIBOrderIdSuccess = (data) => ({
    type: EDIT_IBORDER_FOR_IBORDER_PAGE_SUCCESS,
    payload: data,
});

//DELETE


export const deleteIBOrderId = (id) => ({
    type: DELETE_IBORDER_FOR_IBORDER_PAGE,
    id,
  });
  export const deleteIBOrderIdSuccess = (data) => ({
    type: DELETE_IBORDER_FOR_IBORDER_PAGE_SUCCESS,
    payload: data,
  });
  

//UPDATE

export const updateIBOrderId = (data, id) => ({
    type: UPDATE_IBORDER_ID_FROM_IBORDER_PAGE,
    data, id,
  });
  export const updateIBOrderIdSuccess = (data) => ({
    type: UPDATE_IBORDER_ID_FROM_IBORDER_PAGE_SUCCESS,
    payload: data,
  });