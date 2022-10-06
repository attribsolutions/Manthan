import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
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
      pageField: state.CommonPageFieldReducer.pageField
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

    dispatch(commonPageFieldSuccess([]))
    dispatch(commonPageField(107))
    dispatch(getGroupTypeslist())

  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField.length > 0) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={GroupTypeMaster}
            masterPath={"/GroupTypeMaster"}

          />
          : null
      }

    </React.Fragment>
  )
}

export default GroupTypeList;
