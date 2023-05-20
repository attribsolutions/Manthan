import {

  DELETE_PRODUCTION_ID,
  DELETE_PRODUCTION_SUCCESS,
  EDIT_PRODUCTION_FOR_PRODUCTION_PAGE,
  EDIT_PRODUCTION_FOR_PRODUCTION_PAGE_SUCCESS,
  GET_PRODUCTION_ITEM_MODE_2,
  GET_PRODUCTION_ITEM_MODE_2_SUCCESS,
  GET_PRODUCTION_LIST_PAGE,
  GET_PRODUCTION_LIST_PAGE_SUCCESS,
  GET_UNIT_ID_FOR_PRODUNCTION,
  GET_UNIT_ID_FOR_PRODUNCTION_SUCCESS,
  POST_PRODUCTION_FROM_PRODUCTION_PAGE,
  POST_PRODUCTION_FROM_PRODUCTION_PAGE_SUCCESS,
  UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE,
  UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE_SUCCESS
} from './actionType'


export const getProduction_Mode2 = (data, pageMode, path) => ({       //getProduction Mode2
  type: GET_PRODUCTION_ITEM_MODE_2,
  data, pageMode, path,
});

export const getProduction_Mode2_Success = (data) => ({                //getProduction Mode2 Success
  type: GET_PRODUCTION_ITEM_MODE_2_SUCCESS,
  payload: data,
});


export const Save_Production = (config = {}) => ({                         //Save production Action
  type: POST_PRODUCTION_FROM_PRODUCTION_PAGE,
  config
});

export const Save_ProductionSuccess = (msg) => ({                        //Save production Action Success
  type: POST_PRODUCTION_FROM_PRODUCTION_PAGE_SUCCESS,
  payload: msg
});

export const getProductionListPage = (filters) => ({                     //Get Production List 
  type: GET_PRODUCTION_LIST_PAGE,
  filters,
});

export const getProductionistPageSuccess = (data) => ({                  //Get Production List  Success
  type: GET_PRODUCTION_LIST_PAGE_SUCCESS,
  payload: data,
});


export const edit_ProductionId = (config = {}) => ({                        //edit action
  type: EDIT_PRODUCTION_FOR_PRODUCTION_PAGE,
  config,
});

export const edit_ProductionIdSuccess = (data) => ({                       //edit action Success
  type: EDIT_PRODUCTION_FOR_PRODUCTION_PAGE_SUCCESS,
  payload: data,
});

export const update_ProductionId = (config = {}) => ({                     // production Update Action
  type: UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE,
  config,
});

export const update_ProductionIdSuccess = (data) => ({                      // production Update Action Success
  type: UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE_SUCCESS,
  payload: data,
});

export const delete_ProductionId = (config = {}) => ({                      //Delete production 
  type: DELETE_PRODUCTION_ID,
  config,
});
export const delete_ProductionIdSuccess = (data) => ({                    //Delete production success
  type: DELETE_PRODUCTION_SUCCESS,
  payload: data,
});

export const getUnitIDForProdunction = (data) => ({                        //Get unite for production
  type: GET_UNIT_ID_FOR_PRODUNCTION,
  data,
});
export const getUnitIDForProdunctionSuccess = (unitID) => ({               //Get unite for production Success
  type: GET_UNIT_ID_FOR_PRODUNCTION_SUCCESS,
  payload: unitID,
});


