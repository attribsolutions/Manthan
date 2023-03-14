import {SPINNER_ON, SPINNER_STATE,} from "./actionType";

export const SpinnerON = (state) => ({
  type: SPINNER_ON,
  state,
});

export const SpinnerState = (state) => ({
  type: SPINNER_STATE,
  payload: state,
});



