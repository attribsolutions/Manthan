import React, { useEffect } from "react";
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
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

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
  const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

  const { pageField, GoBtnlistloading } = reducers

  const action = {
    editId: editDriverID,
    deleteId: deleteDriverID,
    postSucc: saveDriverMasterSuccess,
    updateSucc: updateDriverID_Success,
    deleteSucc: deleteDriverID_Success
  }

  // Common Party select Dropdown useEffect
  useEffect(() => {
    if (commonPartyDropSelect.value > 0) {
      partySelectButtonHandler();
    } else {
      partySelectOnChangeHandler();
    }
  }, [commonPartyDropSelect]);

  useEffect(() => {
    const page_Id = pageId.DRIVER_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    if (!(commonPartyDropSelect.value === 0)) {
      goButtonHandler()
    }
    return () => {
      dispatch(getDriverListSuccess([]));
    }
  }, []);

  function goButtonHandler() {
    try {
      if ((commonPartyDropSelect.value === 0)) {
        customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
        return;
      };
      const jsonBody = {
        ..._cfunc.loginJsonBody(),
        PartyID: commonPartyDropSelect.value
      };
      dispatch(getDriverList(jsonBody));
    }
    catch (error) { }
    return
  };

  function partySelectButtonHandler() {
    goButtonHandler()
  }

  function partySelectOnChangeHandler() {
    dispatch(getDriverListSuccess([]));
  }

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(GoBtnlistloading || !pageField)} />
      <div className="page-content">
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
