import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  delete_MRPList,
  delete_MRPListSuccess,
  editMRPList,
  getMRPListPage,
  postMRPMasterDataSuccess,
  updateMRPListSuccess
} from "../../../store/Administrator/MRPMasterRedux/action";
import MRPMaster from "./MRPMaster"
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";

const MRPList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.MRPMasterReducer.MRPList,
      editData: state.MRPMasterReducer.editData,
      updateMsg: state.MRPMasterReducer.updateMessage,
      deleteMsg: state.MRPMasterReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.MRPMasterReducer.PostData,
      pageField: state.CommonPageFieldReducer.pageField
    })
    );

    const action = {
      getList: getMRPListPage,
      editId: editMRPList,
      deleteId: delete_MRPList,
      postSucc: postMRPMasterDataSuccess,
      updateSucc: updateMRPListSuccess,
      deleteSucc: delete_MRPListSuccess
    }
  

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldSuccess([]))
    dispatch(commonPageField(96))
    dispatch(getMRPListPage());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField.length > 0) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={MRPMaster}
            masterPath={"/MRPMaster"}
            ButtonMsgLable={"MRP"}
            deleteName={"EffectiveDate"}
          />
          : null
      }

    </React.Fragment>
  )
}
  

export default MRPList;
