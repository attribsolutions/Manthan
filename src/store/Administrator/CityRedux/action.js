import {
    SAVE_CITY_MASTER,
    SAVE_CITY_MASTER_SUCCESS,
  } from "./actionType";

  export const saveCityMaster = (config = {}) => ({// save Action
    type: SAVE_CITY_MASTER,
    config,
  });
  
  export const saveCityMaster_Success = (resp) => ({// Save  success
    type: SAVE_CITY_MASTER_SUCCESS,
    payload: resp,
  });
  
 
  