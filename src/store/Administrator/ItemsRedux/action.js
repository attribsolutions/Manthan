
import * as actionType from "./actionType";

// get api
export const getItemList = () => ({
  type: actionType.GET_ITEM_LIST_API,
});


export const getItemListSuccess = (data) => ({
  type: actionType.GET_ITEM_LIST_API_SUCCESS,
  payload: data,
});

export const saveItemMasterAction = (config = {}) => ({ // save item master 
  type: actionType.SAVE_ITEM_MASTER,
  config,
});

export const SaveItemMasterActionSuccess = (resp) => ({// save item master   Success
  type: actionType.SAVE_ITEM_MASTER_SUCCESS,
  payload: resp,
});


export const deleteItemID = (config = {}) => ({ // delete api
  type: actionType.DELETE_ITEM_ID,
  config,

});
export const deleteItemIdSuccess = (resp) => ({// delete api Success
  type: actionType.DELETE_ITEM_ID_SUCCESS,
  payload: resp
});

export const editItemId = (config = {}) => ({// edit api 
  type: actionType.EDIT_ITEM_ID,
  config,
})

export const editItemSuccess = (editData) => ({// edit api Success
  type: actionType.EDIT_ITEM_ID_SUCCESS,
  payload: editData,
})


export const updateItemMasterAction = (config = {}) => ({// update api 
  type: actionType.UPDATE_ITEM_ID,
  config,
})
export const updateItemMasterActionSuccess = (updateMessage) => ({// update api Success
  type: actionType.UPDATE_ITEM_ID_SUCCESS,
  payload: updateMessage,
})


// get ItemGroups  for dropdown api
export const getItemGroup_ForDropDown = () => ({
  type: actionType.GET_ITEM_GROUP_FOR_DROPDOWN,
});

export const getItemGroup_ForDropDownSuccess = (data) => ({
  type: actionType.GET_ITEM_GROUP_FOR_DROPDOWN_SUCCESS,
  payload: data,
});


// getItemTag api
export const getItemTagName = () => ({
  type: actionType.GET_ITEMTAG_API,
});

export const getItemtagSuccess = (data) => ({
  type: actionType.GET_ITEMTAG_API_SUCCESS,
  payload: data,
});

// get brand Tag api
export const getBrandTagName = () => ({
  type: actionType.GET_BRANDTAG_API,
});

export const getBrandtagSuccess = (data) => ({
  type: actionType.GET_BRANDTAG_API_SUCCESS,
  payload: data,
});

// get BaseUnit for dropdown api
export const getBaseUnit_ForDropDown = () => ({
  type: actionType.GET_BASEUNIT_FOR_DROPDOWN,
});

export const getBaseUnit_ForDropDownSuccess = (data) => ({
  type: actionType.GET_BASEUNIT_FOR_DROPDOWN_SUCCESS,
  payload: data,
});

// get CategoryTypes for dropdown api
export const get_CategoryTypes_ForDropDown = () => ({
  type: actionType.GET_CATEGORYTYPE_FOR_DROPDOWN,
});

export const get_CategoryTypes_ForDropDown_Success = (data) => ({
  type: actionType.GET_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS,
  payload: data,
});


// get Image Type for dropdown api
export const get_ImageType_ForDropDown = (id) => ({
  type: actionType.GET_IMAGETYPE_FOR_DROPDOWN,
  id
});

export const get_ImageType_ForDropDown_Success = (data) => ({
  type: actionType.GET_IMAGETYPE_FOR_DROPDOWN_SUCCESS,
  payload: data,
});

// get MRPTypes for dropdown api
export const get_MRPTypes_ForDropDown = () => ({
  type: actionType.GET_MRPTYPE_FOR_DROPDOWN,
});

export const get_MRPTypes_ForDropDown_Success = (data) => ({
  type: actionType.GET_MRPTYPE_FOR_DROPDOWN_SUCCESS,
  payload: data,
});

// get Division for dropdown api
export const get_Division_ForDropDown = (id) => ({
  type: actionType.GET_DIVISION_FOR_DROPDOWN,
  id
});

export const get_Division_ForDropDown_Success = (data) => ({
  type: actionType.GET_DIVISION_FOR_DROPDOWN_SUCCESS,
  payload: data,
});

// get Party for dropdown api
export const get_Party_ForDropDown = (id) => ({
  type: actionType.GET_PARTY_FOR_DROPDOWN,
  id
});

export const get_Party_ForDropDown_Success = (data) => ({
  type: actionType.GET_PARTY_FOR_DROPDOWN_SUCCESS,
  payload: data,
});

// Group API dependent on GroupType api
export const get_Group_By_GroupType_ForDropDown = (id) => ({
  type: actionType.GET_GROUP_BY_GROUPTYPE_FOR_DROPDOWN,
  id
});

export const get_Group_By_GroupType_ForDropDown_Success = (data) => ({
  type: actionType.GET_GROUP_BY_GROUPTYPE_FOR_DROPDOWN_SUCCESS,
  payload: data,
});

//Sub-Group API dependent on Group api 
export const get_Sub_Group_By_Group_ForDropDown = (id) => ({
  type: actionType.GET_SUB_GROUP_BY_GROUP_FOR_DROPDOWN,
  id
});

export const get_Sub_Group_By_Group_ForDropDown_Success = (data) => ({
  type: actionType.GET_SUB_GROUP_BY_GROUP_FOR_DROPDOWN_SUCCESS,
  payload: data,
});

// Category  API dependent on CategoryType api
export const get_Category_By_CategoryType_ForDropDownAPI = (id) => ({
  type: actionType.GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_API,
  id
});

export const get_Category_By_CategoryType_ForDropDownAPI_Success = (data) => ({
  type: actionType.GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_API_SUCCESS,
  payload: data,
});


export const Item_Image_Upload = (config = {}) => ({// save Action
  type: actionType.ITEM_IMAGE_UPLOAD,
  config,
});

export const Item_Image_Upload_Success = (resp) => ({// Save  success
  type: actionType.ITEM_IMAGE_UPLOAD_SUCCESS,
  payload: resp,
});




export const ItemsApiErrorAction = () => ({
  type: actionType.ITEMS_API_ERROR_ACTION,
})

