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
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import * as _cfunc from "../../../components/Common/CommonFunction";


const VehicleList = () => {

  const dispatch = useDispatch();
  const userAdminRole = _cfunc.loginUserAdminRole();


  const [party, setParty] = useState({ value: _cfunc.loginPartyID(), label: "Select..." });

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
  const { pageField, } = reducers

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

    if (!userAdminRole) { goButtonHandler() }
  }, []);

  const goButtonHandler = () => {

    const jsonBody = JSON.stringify({
      CompanyID: _cfunc.loginCompanyID(),
      PartyID: party.value,
    });
    dispatch(getVehicleList(jsonBody));
  }
  const partyOnChngeHandler = (e) => {
    setParty(e)
  }

  return (

    <React.Fragment>
      <div className="page-content">

        {userAdminRole &&
          <PartyDropdown_Common
            partySelect={party}
            setPartyFunc={partyOnChngeHandler}
            goButtonHandler={goButtonHandler}
          />
        }


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
