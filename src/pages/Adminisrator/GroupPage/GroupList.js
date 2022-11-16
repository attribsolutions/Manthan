import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
} from "../../../store/actions";
import { GROUP } from "../../../routes/route_url";
import GroupMaster from "./GroupMaster";
import { deleteGrouplistSuccess, delete_GroupList_ID, editGroupID, getGroupList, postGroupSuccess, updategroupIDSuccess } from "../../../store/Administrator/GroupRedux/action";

const GroupList = (props) => {
  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.GroupReducer.groupList,
      editData: state.GroupReducer.editData,
      updateMsg: state.GroupReducer.updateMsg,
      deleteMsg: state.GroupReducer.deleteMsg,
      postMsg: state.GroupReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList:getGroupList,
    editId: editGroupID,
    deleteId: delete_GroupList_ID,
    postSucc: postGroupSuccess,
    updateSucc: updategroupIDSuccess,
    deleteSucc: deleteGrouplistSuccess

  }
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(51))
    dispatch(getGroupList());
    
    

  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={GroupMaster}
            masterPath={GROUP}
            ButtonMsgLable={"Group"}
            deleteName={"Name"}
          
          />
          : null
      }

    </React.Fragment>
  )
}

export default GroupList;
