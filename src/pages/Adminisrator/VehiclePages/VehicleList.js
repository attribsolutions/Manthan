import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import VehicleMaster from "./VehicleMaster";
import {
  deleteVehicleID_Success,
  updateVehicleID_Success,
  getVehicleList,
  editVehicleID,
  deleteVehicleID,
  saveVehicleMasterSuccess,
  getVehicleListSuccess
} from "../../../store/Administrator/VehicleRedux/action";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
// import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

const VehicleList = () => {

  const dispatch = useDispatch();

  const reducers = useSelector(
    (state) => ({
      goBtnLoading: state.VehicleReducer.goBtnLoading,
      listBtnLoading: state.VehicleReducer.listBtnLoading,
      tableList: state.VehicleReducer.VehicleList,
      postMsg: state.VehicleReducer.postMsg,
      editData: state.VehicleReducer.editData,
      updateMsg: state.VehicleReducer.updateMsg,
      deleteMsg: state.VehicleReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList,
    })
  );
  const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);
  
  const { pageField, goBtnLoading } = reducers;

    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            partySelectButtonHandler();
        } else {
            partySelectOnChangeHandler();
        }
    }, [commonPartyDropSelect]);

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
    return () => {
      dispatch(getVehicleListSuccess([]));
      dispatch(commonPageFieldListSuccess(null))
    }
  }, []);

  const partySelectButtonHandler = () => {
    try {
      if (commonPartyDropSelect.value === 0) {
        customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
        return;
      };
      const jsonBody = {
        ..._cfunc.loginJsonBody(),
        PartyID: commonPartyDropSelect.value
      };

      dispatch(getVehicleList(jsonBody));
    } catch (error) { }
    return
  };

  const partySelectOnChangeHandler = () => {
    dispatch(getVehicleListSuccess([]));
  }

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
      <div className="page-content">

        {/* <PartyDropdown_Common 
          goBtnLoading={goBtnLoading}
          goButtonHandler={goButtonHandler}
          changeButtonHandler={partyOnChngeButtonHandler}
        /> */}

        {
          (pageField) &&
          <div className="mt-n1">
            <CommonPurchaseList
              action={action}
              reducers={reducers}
              showBreadcrumb={false}
              MasterModal={VehicleMaster}
              masterPath={url.VEHICLE}
              newBtnPath={url.VEHICLE}
              ButtonMsgLable={"Vehicle"}
              deleteName={"VehicleNumber"}
              goButnFunc={partySelectButtonHandler}
            />
          </div>

        }
      </div>
    </React.Fragment>
  )
}

export default VehicleList;
