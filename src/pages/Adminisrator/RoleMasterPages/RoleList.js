import React, { useEffect } from "react";
import {
  getRole,
  deleteRole,
  editRoleId,
  updateSuccess,
  deleteSuccess,
  PostSuccess,
} from "../../../store/Administrator/RoleMasterRedux/action";
import { useSelector, useDispatch } from "react-redux";
import RoleMaster from "./RoleMaster";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";

const RoleList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.RoleMaster_Reducer.roleList,
      editData: state.RoleMaster_Reducer.editData,
      updateMsg: state.RoleMaster_Reducer.updateMsg,
      deleteMsg: state.RoleMaster_Reducer.deleteMsg,
      postMsg: state.RoleMaster_Reducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageField
    })
  );

  const action = {
    getList: getRole,
    editId: editRoleId,
    deleteId: deleteRole,
    postSucc: PostSuccess,
    updateSucc: updateSuccess,
    deleteSucc: deleteSuccess
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldSuccess([]))
    dispatch(commonPageField(13))
    dispatch(getRole());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField.length > 0) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={RoleMaster}
            masterPath={"/RoleMaster"}
            ButtonMsgLable={"Role"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default RoleList;
