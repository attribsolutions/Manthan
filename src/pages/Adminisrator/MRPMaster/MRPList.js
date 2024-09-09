import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  commonPageFieldList,
  commonPageFieldListSuccess
} from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { useHistory } from "react-router-dom";
import { url, mode, pageId } from "../../../routes/index"
import * as _cfunc from "../../../components/Common/CommonFunction";
import * as _act from "../../../store/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { deleteMRPList_Id, deleteMRPList_Id_Success, getMRPList, GoButtonForMRP_MasterSuccess } from "../../../store/Administrator/MRPMasterRedux/action";
import MRPMaster from "./MRPMaster";
import { mobileApp_ProductUpdate_Api } from "../../../helpers/backend_helper";
import { showToastAlert } from "../../../helpers/axios_Config";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import MRPView from "./MRPview";
import { Col, FormGroup, Label } from "reactstrap";
import { C_DatePicker } from "../../../CustomValidateForm";
import { Go_Button } from "../../../components/Common/CommonButton";

const MRPList = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const hasPagePath = history.location.pathname

  const [pageMode, setpageMode] = useState(mode.defaultsave)
  const [hederFilters, setHederFilters] = useState({ fromdate: _cfunc.currentDate_ymd, todate: _cfunc.currentDate_ymd })
  const { fromdate, todate, } = hederFilters;

  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.MRPMasterReducer.listBtnLoading,
      tableList: state.MRPMasterReducer.MRPList,
      MRPGoButton: state.MRPMasterReducer.MRPGoButton,
      deleteMsg: state.MRPMasterReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const { pageField, MRPGoButton, deleteMsg, listBtnLoading } = reducers;

  const action = {
    getList: getMRPList,
    deleteId: deleteMRPList_Id,
    deleteSucc: deleteMRPList_Id_Success
  }
  const page_Id = pageId.MRP_lIST

  // Featch Modules List data  First Rendering
  useEffect(() => {
    setpageMode(hasPagePath)
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    goButtonHandler()

  }, []);

  const mobaileDeleteApiFinc = async (deleteMsg) => {

    //***************mobail app api*********************** */
    const jsonBody = JSON.stringify({
      products: deleteMsg.DeleteID
    })
    const mobilApiResp = await mobileApp_ProductUpdate_Api({ jsonBody })
    if (mobilApiResp.StatusCode === 200) { showToastAlert(mobilApiResp.Message, "success") }
    //************************************** */
    return // *note  return required 
  }

  useEffect(() => {

    if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
      dispatch(deleteMRPList_Id_Success([]))
      goButtonHandler()
    }
  }, [deleteMsg]);

  useEffect(() => {

    if (MRPGoButton.Status === true && MRPGoButton.StatusCode === 200) {
      dispatch(GoButtonForMRP_MasterSuccess({ ...MRPGoButton, Status: false }))
      history.push({
        pathname: MRPGoButton.pathname,
        page_Mode: MRPGoButton.pageMode,
        editValue: MRPGoButton.rowData
      })
    }
  }, [MRPGoButton]);

  function editBodyfunc(index) {

    const { rowData } = index
    let { Division_id, Party_id, EffectiveDate } = rowData;
    try {
      const jsonBody = JSON.stringify({
        Division: Division_id === null ? 0 : Division_id,
        Party: Party_id === null ? 0 : Party_id,
        EffectiveDate: EffectiveDate,
        CompanyID: _cfunc.loginCompanyID()
      })
      let config = { jsonBody, pathname: url.MRP, btnmode: mode.edit, rowData: rowData }
      dispatch(_act.GoButtonForMRP_Master(config));
    } catch (error) { }
  }

  async function deleteBodyfunc(index) {

    const { rowData, btnId } = index
    if (rowData.CommonID) {
      const rep = await customAlert({
        Type: 8,
        Message: `${alertMessages.deleteOrNot} ${"EffectiveDate"}: "${rowData.EffectiveDate}"`,
      })
      if (rep) {
        let config = { btnId, deleteId: rowData.CommonID }
        try {
          dispatch(deleteMRPList_Id(config))
        }
        catch (error) { }
      }
    }
  }

  function viewApprovalBtnFunc(config) {
    
    const jsonBody = JSON.stringify({
      "EffectiveDate": config.rowData.EffectiveDate,
      "CommonID": config.rowData.CommonID,

    })
    dispatch(_act.postViewMrp({ jsonBody, btnId: `btn-viewApproval-${config.rowData.id}` }));

  }

  function fromdateOnchange(e, date) {
    let newObj = { ...hederFilters }
    newObj.fromdate = date
    setHederFilters(newObj)
  }

  function todateOnchange(e, date) {
    let newObj = { ...hederFilters }
    newObj.todate = date
    setHederFilters(newObj)
  }

  const goButtonHandler = () => {
    const jsonBody = JSON.stringify({
      FromDate: fromdate,
      ToDate: todate,
    });

    dispatch(getMRPList({ jsonBody }));
  };

  const HeaderContent = () => {

    return (
      <div className="px-2   c_card_filter text-black" >
        <div className="row" >
          <Col sm="3" className="">
            <FormGroup className="mb-2 row mt-3 " >
              <Label className="col-sm-5 p-2"
                style={{ width: "83px" }}>FromDate</Label>
              <Col sm="7">
                <C_DatePicker
                  name='FromDate'
                  value={fromdate}
                  onChange={fromdateOnchange}
                />
              </Col>
            </FormGroup>
          </Col>

          <Col sm="3" className="">
            <FormGroup className="mb-2 row mt-3 " >
              <Label className="col-sm-5 p-2"
                style={{ width: "65px" }}>ToDate</Label>
              <Col sm="7">
                <C_DatePicker

                  options={{
                    minDate: (_cfunc.disablePriviousTodate({ fromDate: fromdate })),
                    maxDate: "today",
                    altInput: true,
                    altFormat: "d-m-Y",
                    dateFormat: "Y-m-d",
                  }}
                  value={_cfunc.ToDate({ FromDate: fromdate, Todate: todate })}
                  name="ToDate"
                  onChange={todateOnchange}
                />
              </Col>
            </FormGroup>
          </Col>

          <Col sm="5" ></Col>

          <Col sm="1" className="mt-3 mb-2 ">
            <Go_Button
              loading={listBtnLoading}
              onClick={goButtonHandler}
            />
          </Col>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className="page-content">

        <div className="mt-n1">
          {
            (pageField) ?
              <CommonPurchaseList
                action={action}
                reducers={reducers}
                showBreadcrumb={false}
                MasterModal={MRPMaster}
                masterPath={url.MRP}
                newBtnPath={url.MRP}
                mobaileDeleteApiFinc={mobaileDeleteApiFinc}
                ButtonMsgLable={"MRP"}
                deleteName={"EffectiveDate"}
                pageMode={pageMode}
                HeaderContent={HeaderContent}
                viewApprovalBtnFunc={viewApprovalBtnFunc}
                editBodyfunc={editBodyfunc}
                deleteBodyfunc={deleteBodyfunc}
              />
              : null
          }
        </div>
        <MRPView />
      </div>
    </React.Fragment>
  )
}

export default MRPList;