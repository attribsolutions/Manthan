import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DriverMaster from "./DriverMaster";
import {
  deleteDriverID_Success,
  updateDriverID_Success,
  getDriverList,
  editDriverID,
  deleteDriverID,
  saveDriverMasterSuccess,
  getDriverListSuccess,
} from "../../../store/Administrator/DriverRedux/action";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import * as _cfunc from "../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const DriverList = () => {

  const dispatch = useDispatch();

  const reducers = useSelector(
    (state) => ({
      tableList: state.DriverReducer.DriverList,
      editData: state.DriverReducer.editData,
      updateMsg: state.DriverReducer.updateMessage,
      deleteMsg: state.DriverReducer.deleteMsg,
      postMsg: state.DriverReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList,
      listBtnLoading: state.DriverReducer.listBtnLoading,
      GoBtnlistloading: state.DriverReducer.loading
    })
  );
  const { pageField, GoBtnlistloading, tableList } = reducers

  const action = {
    getList: getDriverList,
    editId: editDriverID,
    deleteId: deleteDriverID,
    postSucc: saveDriverMasterSuccess,
    updateSucc: updateDriverID_Success,
    deleteSucc: deleteDriverID_Success
  }

  useEffect(() => {
    const page_Id = pageId.DRIVER_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    goButtonHandler()
    return () => {
      dispatch(getDriverListSuccess([]));
    }
  }, []);

  const goButtonHandler = () => {
    try {
      if (_cfunc.loginPartyID() === 0) {
        customAlert({ Type: 3, Message: "Please Select Party" });
        return;
      };
      const jsonBody = JSON.stringify({
        CompanyID: _cfunc.loginCompanyID(),
        PartyID: _cfunc.loginPartyID(),
      });

      dispatch(getDriverList(jsonBody));
    } catch (error) { }
    return
  };

  const partyOnChngeButtonHandler = (e) => {
    dispatch(getDriverListSuccess([]));
  }

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(GoBtnlistloading || !pageField)} />
      <div className="page-content">

        <PartyDropdown_Common
          goButtonHandler={goButtonHandler}
          changeButtonHandler={partyOnChngeButtonHandler}
        />

        {
          (pageField) &&
          <div className="mt-n1">
            <CommonPurchaseList
              action={action}
              reducers={reducers}
              showBreadcrumb={false}
              MasterModal={DriverMaster}
              masterPath={url.DRIVER}
              newBtnPath={url.DRIVER}
              ButtonMsgLable={"Driver"}
              deleteName={"Name"}
              goButnFunc={goButtonHandler}
            />
          </div>

        }
      </div>
    </React.Fragment>
  )
}

export default DriverList;
