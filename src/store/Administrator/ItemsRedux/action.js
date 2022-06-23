import { DELETE_ITEM_ID, DELETE_ITEM_ID_SUCCESS,
     EDIT_ITEM_ID, EDIT_ITEM_ID_SUCCESS, 
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

// get api
export const getItemList = () => ({
    type: GET_ITEM_LIST_API,
});

export const getItemListSuccess = (pages) => ({
    type: GET_ITEM_LIST_API_SUCCESS,
    payload:pages,
});

// post api
export const postItemData = (Data,id) => ({
    type: POST_ITEM_DATA,
    Data,id
  });
  
  export const PostItemDataSuccess = (PostData) => ({
    type: POST_ITEM_DATA_SUCCESS,
    payload: PostData,
  });

  // delete api
  export const deleteItemID = (id) => ({
    type: DELETE_ITEM_ID,
    id ,
    
  } );
  export const deleteItemIdSuccess = (deleteMessage) => ({
    type: DELETE_ITEM_ID_SUCCESS,
    payload:deleteMessage
  });
  
  // edit api
  export const editItemId =(ID)=>({
    type:EDIT_ITEM_ID,
    ID,
  })
  export const editItemSuccess =(editData)=>({
    type:EDIT_ITEM_ID_SUCCESS,
   payload:editData,
  })

  // update api
  export const updateItemID=(updateData,ID)=>({
    type:UPDATE_ITEM_ID,
    updateData,ID,
  })
  export const updateItemSuccess =(updateMessage)=>({
    type:UPDATE_ITEM_ID_SUCCESS,
   payload:updateMessage,
  })

  