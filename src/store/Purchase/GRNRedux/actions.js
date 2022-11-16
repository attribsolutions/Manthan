import {
 
  GET_GRN_LIST_PAGE,
  GET_GRN_LIST_PAGE_SUCCESS
} from './actionType'




// export const goButton = (data,hasEditVal) => ({
//   type: GO_BUTTON_FOR_GRN_PAGE,
//   data,hasEditVal,
// });

// export const goButtonSuccess = list => ({
//   type: GO_BUTTON_FOR_GRN_PAGE_SUCCESS,
//   payload: list,
// })

//get listpage api
export const getGRNListPage = () => ({
  type: GET_GRN_LIST_PAGE,

});

export const getGRNListPageSuccess = (data) => ({
  type: GET_GRN_LIST_PAGE_SUCCESS,
  payload: data,
});


// export const postGRN = (data) => ({
//   type: POST_GRN_FROM_GRN_PAGE,
//   data
// });
// export const postGRNSuccess = (msg) => ({
//   type: POST_GRN_FROM_GRN_PAGE_SUCCESS,
//   payload: msg
// });


// export const editGRNId = (id,pageMode) => ({
//   type: EDIT_GRN_FOR_GRN_PAGE,
//   id,pageMode
// });
// export const editGRNIdSuccess = (data) => ({
//   type: EDIT_GRN_FOR_GRN_PAGE_SUCCESS,
//   payload: data,
// });

// export const updateGRNId = (data, id) => ({
//   type: UPDATE_GRN_ID_FROM_GRN_PAGE,
//   data, id,
// });
// export const updateGRNIdSuccess = (data) => ({
//   type: UPDATE_GRN_ID_FROM_GRN_PAGE_SUCCESS,
//   payload: data,
// });


// export const deleteGRNId = (id) => ({
//   type: DELETE_GRN_FOR_GRN_PAGE,
//   id,
// });
// export const deleteGRNIdSuccess = (data) => ({
//   type: DELETE_GRN_FOR_GRN_PAGE_SUCCESS,
//   payload: data,
// });


// export const getDivisionGRNs = () => ({
//   type: GET_DIVISIONGRN_LIST,
// });

// export const getDivisionGRNsSuccess = GRNs => ({
//   type: GET_DIVISIONGRN_LIST_SUCCESS,
//   payload: GRNs,
// })


