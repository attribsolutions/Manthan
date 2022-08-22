import {ALERT_SHOW, ALERT_STATE,} from "./actionType";

export const AlertShow = (state) => ({
  type: ALERT_SHOW,
  state,
});

export const AlertState = (state) => ({
  type: ALERT_STATE,
  payload: state,
});
