import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CompanyGroupMaster from "./CompanyGroupMaster";
import {
  deleteCompanyGroupIDSuccess,
  updateCompanyGroupIDSuccess,
  getCompanyGroupList,
  editCompanyGroupID,
  deleteCompanyGroupID,
  saveCompanyGroupMasterSuccess,
} from "../../../store/Administrator/CompanyGroupRedux/action";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { Listloader } from "../../../components/Common/CommonButton";

const CompanyGroupList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.CompanyGroupReducer.listBtnLoading,
      tableList: state.CompanyGroupReducer.CompanyGroupList,
      editData: state.CompanyGroupReducer.editData,
      updateMsg: state.CompanyGroupReducer.updateMessage,
      deleteMsg: state.CompanyGroupReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.CompanyGroupReducer.postMsg,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getCompanyGroupList,
    editId: editCompanyGroupID,
    deleteId: deleteCompanyGroupID,
    postSucc: saveCompanyGroupMasterSuccess,
    updateSucc: updateCompanyGroupIDSuccess,
    deleteSucc: deleteCompanyGroupIDSuccess,
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.COMPANYGROUP_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getCompanyGroupList());
  }, []);

  const { pageField, userAccess } = reducers

  return (
    <React.Fragment>
      {
        reducers.listBtnLoading ?
          <Listloader />
          :
          (pageField) ?
            <CommonListPage
              action={action}
              reducers={reducers}
              MasterModal={CompanyGroupMaster}
              masterPath={url.COMPANYGROUP}
              ButtonMsgLable={"Company Group"}
              deleteName={"Name"}
            />
            : <><Listloader /></>
      }

    </React.Fragment>
  )
}

export default CompanyGroupList;
