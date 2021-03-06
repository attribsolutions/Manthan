import {
    DELETE_PARTY_ID, DELETE_PARTY_ID_SUCCESS,
    EDIT_PARTY_ID, EDIT_PARTY_ID_SUCCESS,
    GET_COMPANY_BY_DIVISIONTYPES_ID,
    GET_COMPANY_BY_DIVISIONTYPES_ID_SUCCESS,
    GET_DISTRICT_ON_STATE,
    GET_DISTRICT_ON_STATE_SUCCESS,
    GET_DIVISION_TYPES_ID,
    GET_DIVISION_TYPES_ID_SUCCESS,
    GET_PARTTYPE_BY_DIVISIONTYPES_ID,
    GET_PARTTYPE_BY_DIVISIONTYPES_ID_SUCCESS,
    GET_PARTY_LIST_API, GET_PARTY_LIST_API_SUCCESS,
    POST_PARTY_DATA, POST_PARTY_DATA_SUCCESS,
    UPDATE_PARTY_ID, UPDATE_PARTY_ID_SUCCESS
} from "./actionTypes";

// get api
export const getPartyListAPI = () => ({
    type: GET_PARTY_LIST_API,
});

export const getPartyListAPISuccess = (pages) => ({
    type: GET_PARTY_LIST_API_SUCCESS,
    payload: pages,
});

// post api
export const postPartyData = (Data, id) => ({
    type: POST_PARTY_DATA,
    Data, id
});

export const postPartyDataSuccess = (PartySaveSuccess) => ({
    type: POST_PARTY_DATA_SUCCESS,
    payload: PartySaveSuccess,
});

// delete api
export const deletePartyID = (id) => ({
    type: DELETE_PARTY_ID,
    id,

});
export const deletePartyIDSuccess = (deleteMessage) => ({
    type: DELETE_PARTY_ID_SUCCESS,
    payload: deleteMessage
});

// edit api
export const editPartyID = (id) => ({
    type: EDIT_PARTY_ID,
    id,
})
export const editPartyIDSuccess = (editData) => ({
    type: EDIT_PARTY_ID_SUCCESS,
    payload: editData,
})

// update api
export const updatePartyID = (updateData, id) => ({
    type: UPDATE_PARTY_ID,
    updateData, id,
})
export const updatePartyIDSuccess = (data) => ({
    type: UPDATE_PARTY_ID_SUCCESS,
    payload: data,
})

// GetDistrictOnState API dependent on state api
export const getDistrictOnState = (id) => ({
    type: GET_DISTRICT_ON_STATE,
    id,
   
  });
  export const getDistrictOnStateSuccess = (data) => ({
    type: GET_DISTRICT_ON_STATE_SUCCESS,
    payload:data,
  });

  //DivisionTypes  dropdown api
export const getDivisionTypesID = () => ({
    type: GET_DIVISION_TYPES_ID,
   
  });
  export const getDivisionTypesSuccess = (DivisionTypes) => ({
    type:GET_DIVISION_TYPES_ID_SUCCESS,
    payload:DivisionTypes,
  });

  // GetPartyTypeByDivisionTypeID API dependent on DivisionTypes api
export const GetPartyTypeByDivisionTypeID = (id) => ({
    type: GET_PARTTYPE_BY_DIVISIONTYPES_ID,
    id,
   
  });
  export const GetPartyTypeByDivisionTypeIDSuccess = (data) => ({
    type: GET_PARTTYPE_BY_DIVISIONTYPES_ID_SUCCESS,
    payload:data,
  });

   // GetCompanyByDivisionTypeID API dependent on DivisionTypes api
export const GetCompanyByDivisionTypeID = (id) => ({
    type: GET_COMPANY_BY_DIVISIONTYPES_ID,
    id,
   
  });
  export const GetCompanyByDivisionTypeIDSuccess = (data) => ({
    type: GET_COMPANY_BY_DIVISIONTYPES_ID_SUCCESS,
    payload:data,
  });