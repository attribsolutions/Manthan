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
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";

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
      pageField: state.CommonPageFieldReducer.pageField
    })
  );

  const action = {
    getList: getMethodForCompanyGroupList,
    editId: editCompanyGroupTypeId,
    deleteId: deleteCompanyGroupTypeIDSuccess,
    postSucc: PostMethod_ForCompanyGroupMasterSuccess,
    updateSucc: updateCompanyGroupTypeIDSuccess,
    deleteSucc: delete_CompanyGroupType_ID
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldSuccess([]))
    dispatch(commonPageField(33))
    dispatch(getMethodForCompanyGroupList());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField.length > 0) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={CompanyGroupMaster}
            masterPath={"/CompanyGroupMaster"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default CompanyGroupList;
