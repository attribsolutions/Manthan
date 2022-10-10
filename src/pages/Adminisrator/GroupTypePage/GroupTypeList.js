import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { GROUPTYPE } from "../../../routes/route_url";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import {
  deleteGroupType_ID,
  deleteGroupType_IDSuccess,
  editGroupTypeId,
  getGroupTypeslist,
  PostGroupTypeSubmitSuccess,
  updateGroupTypeIDSuccess
} from "../../../store/Administrator/GroupTypeRedux/action";
import GroupTypeMaster from "./GroupTypeMaster";

const GroupTypeList = (props) => {
  const dispatch = useDispatch();


  const reducers = useSelector(
    (state) => ({
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
    editId: editGroupTypeId,
    deleteId: deleteGroupType_ID,
    postSucc: PostGroupTypeSubmitSuccess,
    updateSucc: updateGroupTypeIDSuccess,
    deleteSucc: deleteGroupType_IDSuccess

  }
  useEffect(() => {

    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(107))
    dispatch(getGroupTypeslist())

  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={GroupTypeMaster}
            masterPath={GROUPTYPE}

          />
          : null
      }

    </React.Fragment>
  )
}

export default GroupTypeList;
