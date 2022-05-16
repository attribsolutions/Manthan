import { call, put, takeEvery } from "redux-saga/effects";
import { getDefaultModule, getPageAcess, postAddPage, postSubModule } from "../../../helpers/backend_helper";
import { GET_DEFAULT_MODULE } from "../../../helpers/url_helper";
import { addPageSuccess, getDefaultModuleSuccess, getPageAcessSuccess, postSubModuleSuccess } from "./Actions";
import { ADD_PAGE, GET_PAGE_ACCESS, POST_SUB_MODULE } from "./actionType";

function* moduleId() {
  try {
    const response = yield call(getDefaultModule);
    yield put(getDefaultModuleSuccess(response));
   // console.log(" post module saga : after axios Addapi response ", response); //comment line only
  } catch (error) {
     console.log("postDefaultModuleId saga error :", error);
  }
}
function* SubModule({ id }) {
  try {
  //   console.log("post sub  module saga : saga befor axios pass data", id); //comment line only
    const response = yield call(postSubModule, id);
    yield put(postSubModuleSuccess(response));
    //  console.log(" post sub  module saga : after axios Addapi response ", response); //comment line only
  } catch (error) {
     console.log("postSubModule saga error :", error);
  }
}
function* PageAcess() {
  try {
    //   console.log("PageAcess : saga befor axios pass data"); //comment line only
    const response = yield call(getPageAcess);
    yield put(getPageAcessSuccess(response));
    //  console.log(" PageAcessSuccess : after axios Addapi response ", response); //comment line only
  } catch (error) {
     console.log("PageAcessSuccess :", error);
  }
}

function* Addpage({ Data }) {
  try {
     console.log("Addpage saga : saga befor axios pass data", Data); //comment line only
    const response = yield call(postAddPage, Data);
    yield put(addPageSuccess(response));
    // console.log(" Addpage saga : after axios Addapi response ", response); //comment line only
  } catch (error) {
     console.log("postSubModule saga error :", error);
  }
}

function* PageListSaga() {
  yield takeEvery(GET_DEFAULT_MODULE, moduleId);
  yield takeEvery(POST_SUB_MODULE, SubModule);
  yield takeEvery(ADD_PAGE, Addpage);
  yield takeEvery(GET_PAGE_ACCESS, PageAcess);



}
export default PageListSaga;
