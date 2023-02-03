
import {
    POST_GO_BUTTON_FOR_DEMAND,
    POST_GO_BUTTON_FOR_DEMAND_SUCCESS,
    POST_DEMAND,
    POST_DEMAND_SUCCESS,
    POST_DIVISION,
    POST_DIVISION_SUCCESS,
    DEMAND_LIST_FILTERS,
    POST_DEMAND_LIST_PAGE,
    POST_DEMAND_LIST_PAGE_SUCCESS,
    UPDATE_DEMAND_ID_FROM_DEMAND_PAGE,
    UPDATE_DEMAND_ID_FROM_DEMAND_PAGE_SUCCESS,
    EDIT_DEMAND_FOR_DEMAND_PAGE_SUCCESS,
    EDIT_DEMAND_FOR_DEMAND_PAGE,
    DELETE_DEMAND_FOR_DEMAND_PAGE,
    DELETE_DEMAND_FOR_DEMAND_PAGE_SUCCESS,
} from "./actionType";

// Go Button Post API
export const postGoButtonForDemand = (data) => ({
    type: POST_GO_BUTTON_FOR_DEMAND,
    data,
});

export const postGoButtonForDemandSuccess = (data) => ({
    type: POST_GO_BUTTON_FOR_DEMAND_SUCCESS,
    payload: data,
});

// post api
export const postDemand = (data) => ({
    type: POST_DEMAND,
    data,
});

export const postDemandSuccess = (data) => ({
    type: POST_DEMAND_SUCCESS,
    payload: data,
});

//List Filters Demand
export const IBOrderListfilters = filter => ({
    type: DEMAND_LIST_FILTERS,
    payload: filter,
})


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
    type: POST_DEMAND_LIST_PAGE,
    filters,
});

export const postIBOrderListPageSuccess = (data) => ({
    type: POST_DEMAND_LIST_PAGE_SUCCESS,
    payload: data,
});

//EDIT
export const editDemandId = (jsonBody, pageMode) => ({
    type: EDIT_DEMAND_FOR_DEMAND_PAGE,
    jsonBody, pageMode
});
export const editDemandIdSuccess = (data) => ({
    type: EDIT_DEMAND_FOR_DEMAND_PAGE_SUCCESS,
    payload: data,
});

//DELETE

export const deleteDemandId = (id) => ({
    type: DELETE_DEMAND_FOR_DEMAND_PAGE,
    id,
  });
  export const deleteDemandIdSuccess = (data) => ({
    type: DELETE_DEMAND_FOR_DEMAND_PAGE_SUCCESS,
    payload: data,
  });
  

//UPDATE
export const updateDemandId = (data, id) => ({
    type: UPDATE_DEMAND_ID_FROM_DEMAND_PAGE,
    data, id,
  });
  export const updateDemandIdSuccess = (data) => ({
    type: UPDATE_DEMAND_ID_FROM_DEMAND_PAGE_SUCCESS,
    payload: data,
  });