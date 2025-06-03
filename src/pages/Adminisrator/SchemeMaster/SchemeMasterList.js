import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
} from "../../../store/actions";
import SchemeMaster from "./SchemeMaster";
import {
  deleteSchemelistSuccess,
  delete_SchemeList_ID,
  editSchemeID,
  getSchemeList,
  saveSchemeMaster_Success,
  updateSchemeIDSuccess
} from "../../../store/Administrator/SchemeMasterRedux/action";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import CommonListPage from "../../../components/Common/CommonMasterListPage";

const SchemeMasterList = () => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.SchemeReducer.listBtnLoading,
      goBtnLoading: state.SchemeReducer.goBtnLoading,
      tableList: state.SchemeReducer.SchemeList,
      editData: state.SchemeReducer.editData,
      updateMsg: state.SchemeReducer.updateMsg,
      deleteMsg: state.SchemeReducer.deleteMsg,
      postMsg: state.SchemeReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getSchemeList,
    editId: editSchemeID,
    deleteId: delete_SchemeList_ID,
    postSucc: saveSchemeMaster_Success,
    updateSucc: updateSchemeIDSuccess,
    deleteSucc: deleteSchemelistSuccess
  }

  useEffect(() => {
    const page_Id = pageId.SCHEME_MASTER_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))

    // dispatch(getSchemeList())

  }, []);

  const { pageField, goBtnLoading } = reducers
  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
      {
        (pageField) &&
        <CommonListPage
          action={action}
          reducers={reducers}
          showBreadcrumb={false}
          MasterModal={SchemeMaster}
          masterPath={url.SCHEME_MASTER}
          newBtnPath={url.SCHEME_MASTER}
          ButtonMsgLable={"Scheme"}
          deleteName={"Name"}
        />

      }
    </React.Fragment>
  )
}

export default SchemeMasterList;
