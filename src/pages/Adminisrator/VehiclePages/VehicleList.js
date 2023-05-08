import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import VehicleMaster from "./VehicleMaster";
import {
  deleteVehicleID_Success,
  updateVehicleID_Success,
  getVehicleList,
  editVehicleID,
  deleteVehicleID,
  saveVehicleMasterSuccess
} from "../../../store/Administrator/VehicleRedux/action";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import { loginCompanyID, loginPartyID, loginRoleID } from "../../../components/Common/CommonFunction";
import PartyDropdownList from "../../../components/Common/PartyDropdownComp/PartyDropdownList";

const VehicleList = () => {

  const dispatch = useDispatch();
  const RoleID = loginRoleID()

  const [party, setParty] = useState({ value: loginPartyID(), label: "Select..." });

  const reducers = useSelector(
    (state) => ({
      tableList: state.VehicleReducer.VehicleList,
      postMsg: state.VehicleReducer.postMsg,
      editData: state.VehicleReducer.editData,
      updateMsg: state.VehicleReducer.updateMsg,
      deleteMsg: state.VehicleReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList,
    })
  );
  const { pageField, userAccess = [] } = reducers

  const action = {
    getList: getVehicleList,
    editId: editVehicleID,
    deleteId: deleteVehicleID,
    postSucc: saveVehicleMasterSuccess,
    updateSucc: updateVehicleID_Success,
    deleteSucc: deleteVehicleID_Success,
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.VEHICLE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getPartyListAPI())
    goButtonHandler(true)
  }, []);

  const goButtonHandler = () => {

    const jsonBody = JSON.stringify({
      CompanyID: loginCompanyID(),
      PartyID: party.value,
    });
    dispatch(getVehicleList(jsonBody));
  }

  return (

    <React.Fragment>
      <div className="page-content">

        {RoleID === 2 ?
          <PartyDropdownList
            state={party}
            setState={setParty}
            action={goButtonHandler}
          />
          : null}
        {
          (pageField) ?
            <CommonPurchaseList
              action={action}
              reducers={reducers}
              showBreadcrumb={false}
              MasterModal={VehicleMaster}
              masterPath={url.VEHICLE}
              newBtnPath={url.VEHICLE}
              ButtonMsgLable={"Vehicle"}
              deleteName={"VehicleNumber"}
              goButnFunc={goButtonHandler}
            />
            : null
        }
      </div>
    </React.Fragment>
  )
}

export default VehicleList;
