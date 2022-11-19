import {

  DELETE_GRN_FOR_GRN_PAGE,
  DELETE_GRN_FOR_GRN_PAGE_SUCCESS,
  EDIT_GRN_FOR_GRN_PAGE,
  EDIT_GRN_FOR_GRN_PAGE_SUCCESS,
  GET_GRN_ITEM_MODE_2,
  GET_GRN_ITEM_MODE_2_SUCCESS,
  GET_GRN_ITEM_MODE_3_SUCCESS,
  GET_GRN_LIST_PAGE,
  GET_GRN_LIST_PAGE_SUCCESS,
  POST_GRN_FROM_GRN_PAGE,
  POST_GRN_FROM_GRN_PAGE_SUCCESS,
  UPDATE_GRN_ID_FROM_GRN_PAGE,
  UPDATE_GRN_ID_FROM_GRN_PAGE_SUCCESS
} from './actionType'




export const getGRN_itemMode2 = (data, pageMode,path) => ({
  type: GET_GRN_ITEM_MODE_2,
  data, pageMode,path
});

export const getGRN_itemMode2_Success = list => ({
  type: GET_GRN_ITEM_MODE_2_SUCCESS,
  payload: list,
})
export const getGRN_itemMode3_Success = list => ({
  type: GET_GRN_ITEM_MODE_3_SUCCESS,
  payload: list,
})

//get listpage api
export const getGRNListPage = () => ({
  type: GET_GRN_LIST_PAGE,

});

export const getGRNListPageSuccess = (data) => ({
  type: GET_GRN_LIST_PAGE_SUCCESS,
  payload: data,
});


export const postGRN = (data) => ({
  type: POST_GRN_FROM_GRN_PAGE,
  data
});
export const postGRNSuccess = (msg) => ({
  type: POST_GRN_FROM_GRN_PAGE_SUCCESS,
  payload: msg
});


export const editGRNId = (id, pageMode) => ({
  type: EDIT_GRN_FOR_GRN_PAGE,
  id, pageMode
});
export const editGRNIdSuccess = (data) => ({
  type: EDIT_GRN_FOR_GRN_PAGE_SUCCESS,
  payload: data,
});

export const updateGRNId = (data, id) => ({
  type: UPDATE_GRN_ID_FROM_GRN_PAGE,
  data, id,
});
export const updateGRNIdSuccess = (data) => ({
  type: UPDATE_GRN_ID_FROM_GRN_PAGE_SUCCESS,
  payload: data,
});


export const deleteGRNId = (id) => ({
  type: DELETE_GRN_FOR_GRN_PAGE,
  id,
});
export const deleteGRNIdSuccess = (data) => ({
  type: DELETE_GRN_FOR_GRN_PAGE_SUCCESS,
  payload: data,
});



