import {
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
 
} from "./actionType";


export const ChangePassword = (config={}) => ({ // save Action
  type: CHANGE_PASSWORD,
  config,
});

export const ChangePassword_Succes = (resp) => ({ // Save  success
  type: CHANGE_PASSWORD_SUCCESS,
  payload: resp,
});

