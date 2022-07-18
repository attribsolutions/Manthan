import {
  PAGE_MASTER_ACCESS_FOR_ROLE_ACCESS_lIST,
  PAGE_MASTER_ACCESS_FOR_ROLE_ACCESS_lIST_SUCCESS
} from "./actionType";



export const PageMasterForRoleAccessLit = (id) => ({
  type: PAGE_MASTER_ACCESS_FOR_ROLE_ACCESS_lIST,
  id,
});

export const PageMasterForRoleAccessLit_Success = (data) => ({
  type: PAGE_MASTER_ACCESS_FOR_ROLE_ACCESS_lIST_SUCCESS,
  payload:data,
});

