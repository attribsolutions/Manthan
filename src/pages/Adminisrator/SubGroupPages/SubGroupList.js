import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
} from "../../../store/actions";
import {
  deleteSubGrouplistSuccess,
  delete_SubGroupList_ID,
  editSubGroupID,
  getSubGroupList,
  saveSubGroupSuccess,
  updateSubgroupIDSuccess
} from "../../../store/Administrator/SubGroupsRedux/action";
import SubGroupMaster from "./SubGroupMaster";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import { Listloader } from "../../../components/Common/CommonButton";

const SubGroupList = () => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.SubGroupReducer.listBtnLoading,
      loading: state.SubGroupReducer.loading,
      tableList: state.SubGroupReducer.SubgroupList,
      editData: state.SubGroupReducer.editData,
      updateMsg: state.SubGroupReducer.updateMsg,
      deleteMsg: state.SubGroupReducer.deleteMsg,
      postMsg: state.SubGroupReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getSubGroupList,
    editId: editSubGroupID,
    deleteId: delete_SubGroupList_ID,
    postSucc: saveSubGroupSuccess,
    updateSucc: updateSubgroupIDSuccess,
    deleteSucc: deleteSubGrouplistSuccess
  }
  useEffect(() => {
    const page_Id = pageId.SUBGROUP_LIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getSubGroupList());
  }, []);

  const { pageField, userAccess = [] } = reducers

  return (
    <React.Fragment>
      <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
      {
        reducers.loading ?
          <Listloader />
          :
          (pageField) ?
            <CommonListPage
              action={action}
              reducers={reducers}
              MasterModal={SubGroupMaster}
              masterPath={url.SUBGROUP}
              ButtonMsgLable={"SubGroup"}
              deleteName={"Name"}
            />
            : <><Listloader /></>
      }
    </React.Fragment>
  )
}

export default SubGroupList;
