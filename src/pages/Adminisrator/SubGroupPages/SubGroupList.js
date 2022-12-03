import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
 
} from "../../../store/actions";
import { SUBGROUP } from "../../../routes/route_url";
// import GroupMaster from "./GroupMaster";
import { deleteSubGrouplistSuccess, delete_SubGroupList_ID, editSubGroupID, getSubGroupList, postSubGroupSuccess, updateSubgroupIDSuccess } from "../../../store/Administrator/SubGroupsRedux/action";
import SubGroupMaster from "./SubGroupMaster";

const SubGroupList = (props) => {
  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
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
    getList:getSubGroupList,
    editId: editSubGroupID,
    deleteId: delete_SubGroupList_ID,
    postSucc: postSubGroupSuccess,
    updateSucc: updateSubgroupIDSuccess,
    deleteSucc: deleteSubGrouplistSuccess

  }
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(63))
    dispatch(getSubGroupList());

    
    

  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={SubGroupMaster}
            masterPath={SUBGROUP}
            ButtonMsgLable={"SubGroup"}
            deleteName={"Name"}
          
          />
          : null
      }

    </React.Fragment>
  )
}

export default SubGroupList;
