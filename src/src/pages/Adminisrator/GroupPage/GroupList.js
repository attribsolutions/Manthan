import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDriverTypeIDSuccess,
  updateDriverTypeIDSuccess,
  editDriverTypeId,
  delete_DriverType_ID,
  PostMethod_ForDriverMasterSuccess,
} from "../../../store/Administrator/DriverRedux/action";

import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess,
  getGroupList
} from "../../../store/actions";
import { GROUP } from "../../../routes/route_url";
import GroupMaster from "./GroupMaster";

const GroupList = (props) => {
  const dispatch = useDispatch();


  const reducers = useSelector(
    (state) => ({
      tableList: state.GroupReducer.groupList,
      editData: state.DriverReducer.editData,
      updateMsg: state.DriverReducer.updateMessage,
      deleteMsg: state.DriverReducer.deleteMessage,
      postMsg: state.DriverReducer.PostDataMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getGroupList,
    editId: editDriverTypeId,
    deleteId: delete_DriverType_ID,
    postSucc: PostMethod_ForDriverMasterSuccess,
    updateSucc: updateDriverTypeIDSuccess,
    deleteSucc: deleteDriverTypeIDSuccess

  }
  useEffect(() => {

    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(120))
    dispatch(getGroupList())

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

          />
          : null
      }

    </React.Fragment>
  )
}

export default GroupList;
