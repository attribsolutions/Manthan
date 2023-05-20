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
import PartyDropdownList from "../../../components/Common/PartyDropdownComp/PartyDropdownList";

const DriverList = () => {

  const dispatch = useDispatch();
  const RoleID = _cfunc.loginRoleID()

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

  const { pageField, userAccess = [] } = reducers

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
    goButtonHandler(true)
  }, []);

  const goButtonHandler = () => {

    const jsonBody = JSON.stringify({
      CompanyID: _cfunc.loginCompanyID(),
      PartyID: party.value,
    });
    dispatch(getDriverList(jsonBody));
  }

  return (
    // <React.Fragment>
    //   <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
    //   {
    //     (pageField) ?
    //       <CommonListPage
    //         action={action}
    //         reducers={reducers}
    //         MasterModal={DriverMaster}
    //         masterPath={url.DRIVER}
    //         ButtonMsgLable={"Driver"}
    //         deleteName={"Name"}
    //       />
    //       : null
    //   }
    // </React.Fragment>

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
