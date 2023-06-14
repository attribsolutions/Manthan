import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess
} from "../../../store/actions";
import {
  deleteGroupTypeID,
  deleteGroupTypeIDSuccess,
  editGroupTypeID,
  getGroupTypeslist,
  saveGroupTypeMasterSuccess,
  updateGroupTypeIDSuccess
} from "../../../store/Administrator/GroupTypeRedux/action";
import GroupTypeMaster from "./GroupTypeMaster";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { Listloader } from "../../../components/Common/CommonButton";

const GroupTypeList = (props) => {
  const dispatch = useDispatch();

  const reducers = useSelector(
    (state) => ({
      listLoading: state.GroupTypeReducer.listLoading,
      tableList: state.GroupTypeReducer.GroupType,
      editData: state.GroupTypeReducer.editData,
      updateMsg: state.GroupTypeReducer.updateMessage,
      deleteMsg: state.GroupTypeReducer.deleteMessage,
      postMsg: state.GroupTypeReducer.PostData,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getGroupTypeslist,
    editId: editGroupTypeID,
    deleteId: deleteGroupTypeID,
    postSucc: saveGroupTypeMasterSuccess,
    updateSucc: updateGroupTypeIDSuccess,
    deleteSucc: deleteGroupTypeIDSuccess
  }
  useEffect(() => {
    const page_Id = pageId.GROUPTYPE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getGroupTypeslist())
  }, []);

  const { pageField, userAccess = [] } = reducers

  return (
    <React.Fragment>
      {
        reducers.listLoading ?
          <Listloader />
          :
          (pageField) ?
            <CommonListPage
              action={action}
              reducers={reducers}
              MasterModal={GroupTypeMaster}
              masterPath={url.GROUPTYPE}
              ButtonMsgLable={"Group Type"}
              deleteName={"Name"}
            />
            : <>  <Listloader /></>
      }
    </React.Fragment>
  )
}

export default GroupTypeList;
