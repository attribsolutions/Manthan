import {
  SAVE_POS_ROLEACCESS_SUCCESS,
  SAVE_POS_ROLEACCESS,
  GET_POS_ROLEACCESS,
  GET_POS_ROLEACCESS_SUCCESS,
  POS_ROLEACCESS_ERROR,

} from "./actionTypes";


export const getPosRoleAccesslist = () => ({
  type: GET_POS_ROLEACCESS,
});

export const getPosRoleAccesslistSuccess = (pages) => ({
  type: GET_POS_ROLEACCESS_SUCCESS,
  payload: pages,
});

export const savePosRoleAccess = (config = {}) => ({
  type: SAVE_POS_ROLEACCESS,
  config,
});

export const savePosRoleAccess_Success = (resp) => ({
  type: SAVE_POS_ROLEACCESS_SUCCESS,
  payload: resp,
});

export const PosRoleAccessApiErrorAction = () => ({
  type: POS_ROLEACCESS_ERROR,
})
