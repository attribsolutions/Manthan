import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../../components/Common/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess
} from "../../../../store/actions";
import * as pageId from "../../../../routes/allPageID"
import * as url from "../../../../routes/route_url";
import ImportFieldAdd from "./ImportFieldAdd";
import {
  delete_ImportFiledAdd,
  delete_ImportFiledAdd_Success,
  edit_ImportFiledAdd,
  post_ImportFiledAdd,
  save_ImportFiledAdd_Success,
  update_ImportFiledAdd_Success
} from "../../../../store/Administrator/ImportFieldAddRedux/action";
import { loginCompanyID } from "../../../../components/Common/CommonFunction";
import { Listloader, PageLoadingSpinner } from "../../../../components/Common/CommonButton";

const ImportFieldAddList = () => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      loading: state.ImportFieldAdd_Reducer.loading,
      listBtnLoading: state.ImportFieldAdd_Reducer.listBtnLoading,
      tableList: state.ImportFieldAdd_Reducer.getList,
      editData: state.ImportFieldAdd_Reducer.editData,
      updateMsg: state.ImportFieldAdd_Reducer.updateMsg,
      deleteMsg: state.ImportFieldAdd_Reducer.deleteMsg,
      postMsg: state.ImportFieldAdd_Reducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: post_ImportFiledAdd,
    editId: edit_ImportFiledAdd,
    deleteId: delete_ImportFiledAdd,
    postSucc: save_ImportFiledAdd_Success,
    updateSucc: update_ImportFiledAdd_Success,
    deleteSucc: delete_ImportFiledAdd_Success
  }

  useEffect(() => {
    const page_Id = pageId.IMPORT_FIELD_ADD_LIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(post_ImportFiledAdd(getlistBody()));
  }, []);

  function getlistBody() {
    return JSON.stringify({
      CompanyID: loginCompanyID(),
    });
  }


  const { pageField } = reducers
  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(reducers.loading || !pageField)} />
      {
        (pageField) &&
        <CommonListPage
          action={action}
          reducers={reducers}
          MasterModal={ImportFieldAdd}
          getListbodyFunc={getlistBody}
          masterPath={url.IMPORT_FIELD_ADD}
          ButtonMsgLable={"ImportField"}
          deleteName={"FieldName"}
        />
      }
    </React.Fragment>
  )
}

export default ImportFieldAddList;
