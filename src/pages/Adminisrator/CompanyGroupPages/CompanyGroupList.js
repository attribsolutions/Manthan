import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CompanyGroupMaster from "./CompanyGroupMaster";
import {
  deleteCompanyGroupTypeIDSuccess,
  updateCompanyGroupTypeIDSuccess,
  getMethodForCompanyGroupList,
  editCompanyGroupTypeId,
  delete_CompanyGroupType_ID,
  PostMethod_ForCompanyGroupMasterSuccess,
} from "../../../store/Administrator/CompanyGroupRedux/action";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { COMPANYGROUP } from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"


const CompanyGroupList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.CompanyGroupReducer.CompanyGroupList,
      editData: state.CompanyGroupReducer.editData,
      updateMsg: state.CompanyGroupReducer.updateMessage,
      deleteMsg: state.CompanyGroupReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.CompanyGroupReducer.PostDataMessage,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getMethodForCompanyGroupList,
    editId: editCompanyGroupTypeId,
    deleteId: delete_CompanyGroupType_ID,
    postSucc: PostMethod_ForCompanyGroupMasterSuccess,
    updateSucc: updateCompanyGroupTypeIDSuccess,
    deleteSucc: deleteCompanyGroupTypeIDSuccess,
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.COMPANYGROUP_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getMethodForCompanyGroupList());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={CompanyGroupMaster}
            masterPath={COMPANYGROUP}
            ButtonMsgLable={"CompanyGroup"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default CompanyGroupList;
