import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import VehicleMaster from "./VehicleMaster";
import {
  deleteVehicleTypeIDSuccess,
  updateVehicleTypeIDSuccess,
  getMethodForVehicleList,
  editVehicleTypeId,
  delete_VehicleType_ID,
  PostMethod_ForVehicleMasterSuccess,
} from "../../../store/Administrator/VehicleRedux/action";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import { VEHICLE } from "../../../routes/route_url";

const VehicleList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.VehicleReducer.VehicleList,
      editData: state.VehicleReducer.editData,
      updateMsg: state.VehicleReducer.updateMessage,
      deleteMsg: state.VehicleReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.VehicleReducer.PostDataMessage,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getMethodForVehicleList,
    editId: editVehicleTypeId,
    deleteId: delete_VehicleType_ID,
    postSucc: PostMethod_ForVehicleMasterSuccess,
    updateSucc: updateVehicleTypeIDSuccess,
    deleteSucc: deleteVehicleTypeIDSuccess,
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(31))
    dispatch(getMethodForVehicleList());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={VehicleMaster}
            masterPath={VEHICLE}
            ButtonMsgLable={"VehicleNumber"}
            deleteName={"VehicleNumber"}

          />
          : null
      }

    </React.Fragment>
  )
}

export default VehicleList;
