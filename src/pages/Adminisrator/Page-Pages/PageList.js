import React, { useEffect, } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteHpagesUsingID,
  deleteModuleIDSuccess,
  editHPagesID,
  GetHpageListData,
  saveHPagesSuccess,
  updateHPagesSuccess,
} from "../../../store/Administrator/HPagesRedux/actions";
import HPageMaster from "./PageMaster";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { PAGE } from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import { MetaTags } from "react-meta-tags";
export default function PageList() {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
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
    getList: GetHpageListData,
    editId: editHPagesID,
    deleteId: deleteHpagesUsingID,
    postSucc: saveHPagesSuccess,
    updateSucc: updateHPagesSuccess,
    deleteSucc: deleteModuleIDSuccess
  }

  // Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.PAGE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(GetHpageListData());
  }, []);

  const { pageField ,userAccess=[]} = reducers;

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={HPageMaster}
            masterPath={PAGE}
            ButtonMsgLable={"Page"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}