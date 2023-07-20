import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TermsAndConditionsMaster from "./TermsAndConditionsMaster";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess
} from "../../../store/actions";
import {
  saveTermAndConditionSuccess,
  getTermAndCondition,
  EditTermsAndCondtions,
  DeleteTermsAndCondtions,
  DeleteTermsAndCondtions_Success,
  UpdateTermsAndCondtions_Success
} from "../../../store/Administrator/TermsAndConditionsRedux/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import { Listloader, PageLoadingSpinner } from "../../../components/Common/CommonButton";

const TermsAndConditionsList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.TermsAndConditionsReducer.listBtnLoading,
      tableList: state.TermsAndConditionsReducer.tableList,
      postMsg: state.TermsAndConditionsReducer.PostData,
      editData: state.TermsAndConditionsReducer.editData,
      updateMsg: state.TermsAndConditionsReducer.updateMessage,
      deleteMsg: state.TermsAndConditionsReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getTermAndCondition,
    editId: EditTermsAndCondtions,
    deleteId: DeleteTermsAndCondtions,
    postSucc: saveTermAndConditionSuccess,
    updateSucc: UpdateTermsAndCondtions_Success,
    deleteSucc: DeleteTermsAndCondtions_Success
  }

  //useEffect : used for fetching data
  useEffect(() => {
    const page_Id = pageId.TERMS_AND_CONDITION_LIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getTermAndCondition())
  }, []);

  const { pageField,} = reducers

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(reducers.loading || !pageField)} />
      {
        (pageField) &&
        <CommonListPage
          action={action}
          reducers={reducers}
          MasterModal={TermsAndConditionsMaster}
          masterPath={url.TERMS_AND_CONDITION}
          ButtonMsgLable={"Terms & Conditions"}
          deleteName={"Name"}
        />
      }
    </React.Fragment>
  )
}
export default TermsAndConditionsList;
