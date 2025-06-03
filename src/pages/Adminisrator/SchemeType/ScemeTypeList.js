import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess
} from "../../../store/actions";

import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import SchemeType from "./SchemeType";
import { currentDate_ymd, disablePriviousTodate, loginPartyID, ToDate } from "../../../components/Common/CommonFunction";
import { Col, FormGroup, Label } from "reactstrap";
import { C_DatePicker } from "../../../CustomValidateForm";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { getSchemeTypelist, getSchemeTypelistSuccess, saveSchemeTypeSuccess,deleteSchemeTypelist, deleteSchemeTypeID, deleteSchemeTypeIDSuccess, editSchemeTypeIDSuccess, updateSchemeTypeIDSuccess, editSchemeTypeID } from "../../../store/Administrator/SchemeRedux/action";

const SchemeTypeList = () => {
  const dispatch = useDispatch();



  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.SchemeTypeReducer.listBtnLoading,
      goBtnLoading: state.SchemeTypeReducer.goBtnLoading,
      tableList: state.SchemeTypeReducer.SchemeTypeList,
      editData: state.SchemeTypeReducer.editData,
      updateMsg: state.SchemeTypeReducer.updateMessage,
      deleteMsg: state.SchemeTypeReducer.deleteMessage,
      postMsg: state.SchemeTypeReducer.PostData,
      goBtnloading: state.SchemeTypeReducer.goBtnloading,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getSchemeTypelist,
    editId: editSchemeTypeID,
    deleteId: deleteSchemeTypeID,
    postSucc: saveSchemeTypeSuccess,
    updateSucc: updateSchemeTypeIDSuccess,
    deleteSucc: deleteSchemeTypeIDSuccess
  }

  useEffect(() => {
    const page_Id = pageId.SCHEME_TYPE_LIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getSchemeTypelist())
   
      


    return () => {

      dispatch(commonPageFieldListSuccess(null))
    }

  }, []);


  const { pageField, } = reducers

  return (
    <React.Fragment>

      {
        (pageField) &&
        <CommonListPage
          action={action}
          reducers={reducers}
          newBtnPath={url.SCHEME_TYPE}
          MasterModal={SchemeType}
          masterPath={url.SCHEME_TYPE}
          totalAmountShow={true}
          ButtonMsgLable={"SchemeType"}
          deleteName={"SchemeTypeName"}
        />

      }
    </React.Fragment>
  )
}

export default SchemeTypeList;
