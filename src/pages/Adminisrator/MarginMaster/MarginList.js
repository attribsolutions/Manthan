import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BreadcrumbShowCountlabel,
  commonPageFieldList,
  commonPageFieldListSuccess
} from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { useHistory } from "react-router-dom";
import { url, mode, pageId } from "../../../routes/index"
import * as _cfunc from "../../../components/Common/CommonFunction";
import MarginMaster from "./MarginMaster";
import { delete_MarginList_ID, delete_MarginList_ID_Success, getMarginList, goButtonForMarginSuccess } from "../../../store/Administrator/MarginMasterRedux/action";
import * as _act from "../../../store/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { mobileApp_ProductUpdate_Api } from "../../../helpers/backend_helper";
import { showToastAlert } from "../../../helpers/axios_Config";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { Col, FormGroup, Label } from "reactstrap";
import { C_DatePicker } from "../../../CustomValidateForm";
import { Go_Button } from "../../../components/Common/CommonButton";
import MarginView from "./MarginView";

const MarginList = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const hasPagePath = history.location.pathname

  const [pageMode, setpageMode] = useState(mode.defaultsave)
  const [userAccState, setUserAccState] = useState('');
  const [hederFilters, setHederFilters] = useState({ fromdate: _cfunc.currentDate_ymd, todate: _cfunc.currentDate_ymd })
  const { fromdate, todate, } = hederFilters;

  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.MarginMasterReducer.listBtnLoading,
      loading: state.MarginMasterReducer.loading,
      GoBtnlistloading: state.MarginMasterReducer.loading,
      tableList: state.MarginMasterReducer.MarginList,
      MarginGoButton: state.MarginMasterReducer.MarginGoButton,
      deleteMsg: state.MarginMasterReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const { userAccess, pageField, MarginGoButton, deleteMsg, GoBtnlistloading, listBtnLoading, loading } = reducers;

  const action = {
    getList: getMarginList,
    deleteId: delete_MarginList_ID,
    deleteSucc: delete_MarginList_ID_Success
  }
  const page_Id = pageId.MARGIN_lIST

  // Featch Modules List data  First Rendering
  useEffect(() => {
    setpageMode(hasPagePath)
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    // dispatch(BreadcrumbShowCountlabel(`${"Margin Count"} :0`))
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
    let userAcc = userAccess.find((inx) => {
      return (inx.id === page_Id)
    })
    if (!(userAcc === undefined)) {
      setUserAccState(userAcc)
    }
  }, [userAccess])

  useEffect(() => {

    if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
      dispatch(delete_MarginList_ID_Success([]))
      goButtonHandler()
    }
  }, [deleteMsg]);

  useEffect(() => {

    if (MarginGoButton.Status === true && MarginGoButton.StatusCode === 200) {
      dispatch(goButtonForMarginSuccess({ ...MarginGoButton, Status: false }))
      history.push({
        pathname: MarginGoButton.pathname,
        page_Mode: MarginGoButton.pageMode,
        editValue: MarginGoButton.rowData
      })
    }
  }, [MarginGoButton]);

  function editBodyfunc(index) {

    const { rowData, btnId } = index
    let { PriceList_id, Party_id, EffectiveDate } = rowData;
    _cfunc.btnIsDissablefunc({ btnId, state: true })

    try {
      const jsonBody = JSON.stringify({
        PriceList: PriceList_id,
        Party: Party_id === null ? 0 : Party_id,
        EffectiveDate: EffectiveDate
      })
      let config = { jsonBody, pathname: url.MARGIN, btnmode: mode.edit, rowData: rowData }
      dispatch(_act.goButtonForMargin(config));
    } catch (error) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
  }

  async function deleteBodyfunc(index) {

    const { rowData, btnId } = index
    if (rowData.CommonID) {
      const rep = await customAlert({
        Type: 8,
        Message: `${alertMessages.deleteOrNot} ${"EffectiveDate"}: "${rowData.EffectiveDate}"`,
      })
      if (rep) {
        _cfunc.btnIsDissablefunc({ btnId, state: true })
        let config = { btnId, deleteId: rowData.CommonID }
        try {
          dispatch(delete_MarginList_ID(config))
        }
        catch (error) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
      }
    }
  }

  function viewApprovalBtnFunc(config) {

    const jsonBody = JSON.stringify({
      "EffectiveDate": config.rowData.EffectiveDate,
      "CommonID": config.rowData.CommonID,

    })
    dispatch(_act.postViewGst({ jsonBody, btnId: `btn-viewApproval-${config.rowData.id}`, subPageMode: url.MARGIN_lIST }));

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

    dispatch(getMarginList({ jsonBody }));
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
              loading={loading}
              onClick={goButtonHandler}
            />
          </Col>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(GoBtnlistloading || !pageField)} />
      <div className="page-content">
        {
          (pageField) &&
          <CommonPurchaseList
            action={action}
            reducers={reducers}
            showBreadcrumb={false}
            MasterModal={MarginMaster}
            mobaileDeleteApiFinc={mobaileDeleteApiFinc}
            masterPath={url.MARGIN}
            newBtnPath={url.MARGIN}
            HeaderContent={HeaderContent}
            ButtonMsgLable={"Margin"}
            deleteName={"EffectiveDate"}
            pageMode={pageMode}
            editBodyfunc={editBodyfunc}
            deleteBodyfunc={deleteBodyfunc}
            viewApprovalBtnFunc={viewApprovalBtnFunc}
          />

        }
      </div>
      <MarginView />
    </React.Fragment>
  )
}

export default MarginList;