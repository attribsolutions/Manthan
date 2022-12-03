import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import TermsAndCondtionsMaster from "./TermsAndCondtionsMaster";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { postTermAndConditionSuccess, getTermAndCondition, EditTermsAndCondtions, DeleteTermsAndCondtions, DeleteTermsAndCondtions_Success, UpdateTermsAndCondtions_Success } from "../../../store/Administrator/TermsAndCondtionsRedux/actions";
import { TERMS_AND_CONDITION } from "../../../routes/route_url";

const TermsAndCondtionsList = (props) => {


  const dispatch = useDispatch();
  //useSelector is used to access the redux store in function component
  const reducers = useSelector(
    (state) => ({
      tableList: state.TermsAndCondtionsReducer.TermsAndCondtionsList,
      postMsg: state.TermsAndCondtionsReducer.PostData,
      editData: state.TermsAndCondtionsReducer.TermsAndCondtionseditData,
      updateMsg: state.TermsAndCondtionsReducer.TermsAndCondtionsupdateMessage,
      deleteMsg: state.TermsAndCondtionsReducer.TermsAndCondtionsdeleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );


  const action = {
    getList: getTermAndCondition,
    editId: EditTermsAndCondtions,
    deleteId: DeleteTermsAndCondtions,
    postSucc: postTermAndConditionSuccess,
    updateSucc: UpdateTermsAndCondtions_Success,
    deleteSucc: DeleteTermsAndCondtions_Success

  }

  //useEffect : used for fetching data
  useEffect(() => {

    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(43))
    dispatch(getTermAndCondition())

  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={TermsAndCondtionsMaster}
            masterPath={TERMS_AND_CONDITION}
            ButtonMsgLable={"Terms & Conditions"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default TermsAndCondtionsList;
