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
} from "../../../store/Administrator/DriverRedux/action";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import * as _cfunc from "../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";

const DriverList = () => {

  const dispatch = useDispatch();
  const userAdminRole = _cfunc.loginUserAdminRole();


  const [party, setParty] = useState({ value: _cfunc.loginPartyID(), label: "Select..." });

  const reducers = useSelector(
    (state) => ({
      tableList: state.DriverReducer.DriverList,
      editData: state.DriverReducer.editData,
      updateMsg: state.DriverReducer.updateMessage,
      deleteMsg: state.DriverReducer.deleteMessage,
      postMsg: state.DriverReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const { pageField, } = reducers

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
    if (!userAdminRole) { goButtonHandler() }
  }, []);

  const goButtonHandler = () => {

    const jsonBody = JSON.stringify({
      CompanyID: _cfunc.loginCompanyID(),
      PartyID: party.value,
    });
    dispatch(getDriverList(jsonBody));
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
              MasterModal={DriverMaster}
              masterPath={url.DRIVER}
              newBtnPath={url.DRIVER}
              ButtonMsgLable={"Driver"}
              deleteName={"Name"}
              goButnFunc={goButtonHandler}
            />
            : null
        }
      </div>
    </React.Fragment>
  )
}

export default DriverList;
