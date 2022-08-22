import { DELETE_ITEM_ID, DELETE_ITEM_ID_SUCCESS,
     EDIT_ITEM_ID, EDIT_ITEM_ID_SUCCESS, 
     GET_BASEUNIT_FOR_DROPDOWN, 
     GET_BASEUNIT_FOR_DROPDOWN_SUCCESS, 
     GET_ITEM_GROUP_FOR_DROPDOWN, 
     GET_ITEM_GROUP_FOR_DROPDOWN_SUCCESS, 
     GET_ITEM_LIST_API, GET_ITEM_LIST_API_SUCCESS, 
     POST_ITEM_DATA, POST_ITEM_DATA_SUCCESS, 
     UPDATE_ITEM_ID, UPDATE_ITEM_ID_SUCCESS } from "./actionType";

     
// get ItemGroups  for dropdown api
export const getItemGroup_ForDropDown = () => ({
  type: GET_ITEM_GROUP_FOR_DROPDOWN,
});

export const getItemGroup_ForDropDownSuccess = (data) => ({
  type: GET_ITEM_GROUP_FOR_DROPDOWN_SUCCESS,
  payload:data,
});

// get BaseUnit for dropdown api
export const getBaseUnit_ForDropDown = () => ({
  type: GET_BASEUNIT_FOR_DROPDOWN,
});

export const getBaseUnit_ForDropDownSuccess = (data) => ({
  type: GET_BASEUNIT_FOR_DROPDOWN_SUCCESS,
  payload:data,
});

// get api
export const getItemList = () => ({
    type: GET_ITEM_LIST_API,
});

export const getItemListSuccess = (data) => ({
    type: GET_ITEM_LIST_API_SUCCESS,
    payload:data,
});

// post api
export const postItemData = (data) => ({
    type: POST_ITEM_DATA,
    data,
  });
  
  export const PostItemDataSuccess = (data) => ({
    type: POST_ITEM_DATA_SUCCESS,
    payload: data,
  });

  // delete api
  export const deleteItemID = (id) => ({
    type: DELETE_ITEM_ID,
    id ,
    
  } );
  export const deleteItemIdSuccess = (data) => ({
    type: DELETE_ITEM_ID_SUCCESS,
    payload:data
  });
  
  // edit api
  export const editItemId =(ID)=>({
    type:EDIT_ITEM_ID,
    ID,
  })
  export const editItemSuccess =(data)=>({
    type:EDIT_ITEM_ID_SUCCESS,
   payload:data,
  })

  // update api
  export const updateItemID=(updateData,ID)=>({
    type:UPDATE_ITEM_ID,
    updateData,ID,
  })
  export const updateItemSuccess =(data)=>({
    type:UPDATE_ITEM_ID_SUCCESS,
   payload:data,
  })

  