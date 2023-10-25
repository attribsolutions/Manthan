
import {
  POST_METHOD_FOR_GENERAL_API,
  POST_METHOD_FOR_GENERAL_API_SUCCESS,
  DELETE_GENERAL_ID,
  DELETE_GENERAL_ID_SUCCESS,
  EDIT_GENERAL_ID,
  EDIT_GENERAL_ID_SUCCESS,
  POST_GENERAL_LIST,
  POST_GENERAL_LIST_SUCCESS,
  UPDATE_GENERAL_ID,
  UPDATE_GENERAL_ID_SUCCESS,
  GENARAL_MASTER_BY_TYPE,
  GENARAL_MASTER_BY_TYPE_SUCCESS,
  GENERAL_MASTER_SUB_TYPE,
  GENERAL_MASTER_SUB_TYPE_SUCCESS,
} from "./actionType";

export const SaveMethodForGeneral = (config={}) => ({             //Save Action
  type: POST_METHOD_FOR_GENERAL_API,
  config,
});

export const SaveMethodForGeneralSuccess = (data) => ({       //Save Action Success
  type: POST_METHOD_FOR_GENERAL_API_SUCCESS,
  payload: data,
});

export const PostGenerallist = (data) => ({                   //Post Action GeneralList
  type: POST_GENERAL_LIST,
  data
});

export const PostGenerallistSuccess = (data) => ({             //Post Action GeneralList Success
  type: POST_GENERAL_LIST_SUCCESS,
  payload: data,
});

export const editGeneralID = (config = {}) => ({             //Edit action
  type: EDIT_GENERAL_ID,
  config ,
})

export const editGeneralIDSuccess = (editData) => ({            //Edit action Success
  type: EDIT_GENERAL_ID_SUCCESS,
  payload: editData,
})

export const updateGeneralID = (config = {}) => ({                //Update action
  type: UPDATE_GENERAL_ID,
  config,
})

export const updateGeneralIDSuccess = (updateMessage) => ({          //Update action Successs
  type: UPDATE_GENERAL_ID_SUCCESS,
  payload: updateMessage,
})

export const genaral_Master_By_Type_Action = (jsonBody) => ({                                    // Post type Action
  type: GENARAL_MASTER_BY_TYPE,
  jsonBody,
});
export const Genaral_Master_By_Type_ActionSuccess = (data) => ({                              // Post type Action Success
  type: GENARAL_MASTER_BY_TYPE_SUCCESS,
  payload: data,

});

export const GeneralMasterSubType = (data) => ({
  type: GENERAL_MASTER_SUB_TYPE,
  data,
});

export const GeneralMasterSubType_Success = (data) => ({
  type: GENERAL_MASTER_SUB_TYPE_SUCCESS,
  payload: data,
});

export const delete_General_ID = (config = {}) => ({                                  //Delete Action
  type: DELETE_GENERAL_ID,
  config,

});

export const deleteGeneralIDSuccess = (resp) => ({                    //Delete Action Success
  type: DELETE_GENERAL_ID_SUCCESS,
  payload: resp
});