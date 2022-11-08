import { COMMON_400_ERROR, COMMON_500_ERROR } from "./actionType";


export const hasError500 = (Msg) => ({
  type: COMMON_500_ERROR,
  payload: Msg,
});
export const hasError400 = (Msg) => ({
  type: COMMON_400_ERROR,
  payload: Msg,
});

