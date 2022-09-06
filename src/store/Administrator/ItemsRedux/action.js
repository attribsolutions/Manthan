import { DELETE_ITEM_ID, DELETE_ITEM_ID_SUCCESS,
     EDIT_ITEM_ID, EDIT_ITEM_ID_SUCCESS, 
     GET_BASEUNIT_FOR_DROPDOWN, 
     GET_BASEUNIT_FOR_DROPDOWN_SUCCESS, 
     GET_CATEGORYTYPE_FOR_DROPDOWN, 
     GET_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS, 
     GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN, 
     GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS, 
     GET_IMAGETYPE_FOR_DROPDOWN, 
     GET_IMAGETYPE_FOR_DROPDOWN_SUCCESS, 
     GET_ITEM_GROUP_FOR_DROPDOWN, 
     GET_ITEM_GROUP_FOR_DROPDOWN_SUCCESS, 
     GET_ITEM_LIST_API, GET_ITEM_LIST_API_SUCCESS, 
     GET_MRPTYPE_FOR_DROPDOWN, 
     GET_MRPTYPE_FOR_DROPDOWN_SUCCESS, 
     GET_SUB_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN, 
     GET_SUB_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS, 
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
  export const editItemId =(id,pageMode)=>({
    type:EDIT_ITEM_ID,
    id,pageMode
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
  
  // get BaseUnit for dropdown api
  export const getBaseUnit_ForDropDown = () => ({
    type: GET_BASEUNIT_FOR_DROPDOWN,
  });
  
  export const getBaseUnit_ForDropDownSuccess = (data) => ({
    type: GET_BASEUNIT_FOR_DROPDOWN_SUCCESS,
    payload:data,
  });
  
  // get CategoryTypes for dropdown api
export const get_CategoryTypes_ForDropDown = () => ({
  type: GET_CATEGORYTYPE_FOR_DROPDOWN,
});

export const get_CategoryTypes_ForDropDown_Success = (data) => ({
  type: GET_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS,
  payload:data,
});

// Category  API dependent on CategoryType api
  export const get_Category_By_CategoryType_ForDropDown = (id,key) => ({
    type: GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN,
    id,key
  });
  
  export const get_Category_By_CategoryType_ForDropDown_Success = (data) => ({
    type: GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS,
    payload:data,
  });

  //Sub Category API dependent on Category api 
   export const get_Sub_Category_By_CategoryType_ForDropDown = (id,key) => ({
    type: GET_SUB_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN,
    id,key
  });
  
  export const get_Sub_Category_By_CategoryType_ForDropDown_Success = (data) => ({
    type: GET_SUB_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS,
    payload:data,
  });

    // get Image Type for dropdown api
    export const get_ImageType_ForDropDown = () => ({
      type: GET_IMAGETYPE_FOR_DROPDOWN,
    });
    
    export const get_ImageType_ForDropDown_Success = (data) => ({
      type: GET_IMAGETYPE_FOR_DROPDOWN_SUCCESS,
      payload:data,
    });

     // get MRPTypes for dropdown api
     export const get_MRPTypes_ForDropDown = () => ({
      type: GET_MRPTYPE_FOR_DROPDOWN,
    });
    
    export const get_MRPTypes_ForDropDown_Success = (data) => ({
      type: GET_MRPTYPE_FOR_DROPDOWN_SUCCESS,
      payload:data,
    });