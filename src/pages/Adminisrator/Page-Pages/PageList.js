import React, { useEffect, } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  delete_PageListID_Action,
  delete_PageListID_Success,
  edit_PageListID_Action,
  Get_pageListAction,
  save_PageMaster_Success,
  update_PageListId_Success,
} from "../../../store/Administrator/PageMasterRedux/actions";
import HPageMaster from "./PageMaster";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { PAGE } from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import { CustomSppiner } from "../../../components/Common/CommonButton"

export default function PageList() {

  const dispatch = useDispatch();

  const reducers = useSelector(
    (state) => ({
      loading: state.H_Pages.loading,
      listBtnLoading: state.H_Pages.listBtnLoading,
      tableList: state.H_Pages.HPagesListData,
      editData: state.H_Pages.editData,
      updateMsg: state.H_Pages.updateMessage,
      deleteMsg: state.H_Pages.deleteModuleID,
      postMsg: state.H_Pages.saveMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: Get_pageListAction,
    editId: edit_PageListID_Action,
    deleteId: delete_PageListID_Action,
    postSucc: save_PageMaster_Success,
    updateSucc: update_PageListId_Success,
    deleteSucc: delete_PageListID_Success
  }

  // Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.PAGE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(Get_pageListAction());
  }, []);

  const { pageField, loading } = reducers;

  return (
    <React.Fragment>
      <CustomSppiner isLoading={(loading || !pageField)} />
      {

        (pageField) &&
        <CommonListPage
          action={action}
          reducers={reducers}
          MasterModal={HPageMaster}
          masterPath={PAGE}
          ButtonMsgLable={"Page"}
          deleteName={"Name"}
        />

      }

    </React.Fragment>
  )
}