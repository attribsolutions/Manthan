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
import GSTMaster from "./GSTMaster";
import { deleteGSTListId, deleteGSTListId_Success, getGSTList, goButtonForGST_Master_Success } from "../../../store/Administrator/GSTRedux/action";
import { PageLoadingSpinner,} from "../../../components/Common/CommonButton";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import GSTView from "./GSTView";
import { Col, FormGroup, Label } from "reactstrap";
import { C_DatePicker } from "../../../CustomValidateForm";
import { Go_Button } from "../../../components/Common/CommonButton";

const GSTList = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const hasPagePath = history.location.pathname

  const [pageMode, setpageMode] = useState(mode.defaultsave)
  const [userAccState, setUserAccState] = useState('');
  const [rowData, setRowData] = useState({})

  const [hederFilters, setHederFilters] = useState({ fromdate: _cfunc.currentDate_ymd, todate: _cfunc.currentDate_ymd })
  const { fromdate, todate, } = hederFilters;

  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.GSTReducer.listBtnLoading,
      GoBtnlistloading: state.GSTReducer.GoBtnlistloading,
      tableList: state.GSTReducer.GSTList,
      GSTGoButton: state.GSTReducer.GSTGoButton,
      deleteMsg: state.GSTReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const { userAccess, pageField, GSTGoButton, deleteMsg, GoBtnlistloading } = reducers;

  const action = {
    getList: getGSTList,
    deleteId: deleteGSTListId,
    deleteSucc: deleteGSTListId_Success
  }
  const page_Id = pageId.GST_LIST

  // Featch Modules List data  First Rendering
  useEffect(() => {
    setpageMode(hasPagePath)
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    goButtonHandler()
    return () => {
      dispatch(_act.getGSTListSuccess([]));
    }

  }, []);

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
      dispatch(deleteGSTListId_Success([]))
      goButtonHandler()
    }
  }, [deleteMsg]);

  useEffect(() => {

    if (GSTGoButton.Status === true && GSTGoButton.StatusCode === 200) {
      dispatch(goButtonForGST_Master_Success({ ...GSTGoButton, Status: false }))
      history.push({
        pathname: GSTGoButton.pathname,
        page_Mode: GSTGoButton.pageMode,
        editValue: GSTGoButton.rowData
      })
    }
  }, [GSTGoButton]);

  function viewApprovalBtnFunc(config) {

    const jsonBody = JSON.stringify({
      "EffectiveDate": config.rowData.EffectiveDate,
      "CommonID": config.rowData.CommonID,

    })
    dispatch(_act.postViewGst({ jsonBody, btnId: `btn-viewApproval-${config.rowData.id}` }));
    setRowData(config.rowData)
  }

  function editBodyfunc(index) {

    const { rowData, btnId } = index
    let { EffectiveDate } = rowData;
    _cfunc.btnIsDissablefunc({ btnId, state: true })

    try {
      const jsonBody = JSON.stringify({
        EffectiveDate: EffectiveDate
      })
      let config = { jsonBody, pathname: url.GST, btnmode: mode.edit, rowData: rowData }
      // sessionStorage.setItem("margin_Master", config)
      dispatch(_act.goButtonForGST_Master(config));
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
          dispatch(deleteGSTListId(config))
        }
        catch (error) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
      }
    }
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
    dispatch(getGSTList({ jsonBody }));
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
              loading={GoBtnlistloading}
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
            MasterModal={GSTMaster}
            masterPath={url.GST}
            newBtnPath={url.GST}
            HeaderContent={HeaderContent}
            ButtonMsgLable={"GST"}
            deleteName={"EffectiveDate"}
            pageMode={pageMode}
            editBodyfunc={editBodyfunc}
            viewApprovalBtnFunc={viewApprovalBtnFunc}
            deleteBodyfunc={deleteBodyfunc}
          />

        }
      </div>
      <GSTView tableRowData={rowData} />

    </React.Fragment>
  )
}

export default GSTList;