import {
  GET_CITY_LIST,
  GET_CITY_LIST_SUCCESS,
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


export const getCityList = () => ({// save Action
  type: GET_CITY_LIST,
});

export const getCitylistSuccess = (resp) => ({// Save  success
  type: GET_CITY_LIST_SUCCESS,
  payload: resp,
});



