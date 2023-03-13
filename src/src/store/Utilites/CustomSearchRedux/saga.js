import { put, takeEvery } from "redux-saga/effects";
import { CustomSearchInput } from "./actions";
import { CUSTOM_SEARCH_INPUT_SUCCESS } from "./actionType";

function* Custom_SearchInput({ input }) {
  yield put(CustomSearchInput(input));
}

function* CustomSearch_Saga() {
  yield takeEvery(CUSTOM_SEARCH_INPUT_SUCCESS,Custom_SearchInput);
}
export default CustomSearch_Saga;
