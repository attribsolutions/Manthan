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
import { PageLoadingSpinner, Listloader } from "../../../components/Common/CommonButton";
import { mobileApp_ProductDelete_Api, mobileApp_ProductUpdate_Api } from "../../../helpers/backend_helper";
import { showToastAlert } from "../../../helpers/axios_Config";

const MarginList = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const hasPagePath = history.location.pathname

  const [pageMode, setpageMode] = useState(mode.defaultsave)
  const [userAccState, setUserAccState] = useState('');

  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.MarginMasterReducer.listBtnLoading,
      GoBtnlistloading: state.MarginMasterReducer.loading,
      tableList: state.MarginMasterReducer.MarginList,
      MarginGoButton: state.MarginMasterReducer.MarginGoButton,
      deleteMsg: state.MarginMasterReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const { userAccess, pageField, MarginGoButton, deleteMsg, GoBtnlistloading } = reducers;

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
    dispatch(getMarginList())

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
      dispatch(getMarginList())
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
      // sessionStorage.setItem("margin_Master", config)
      dispatch(_act.goButtonForMargin(config));
    } catch (error) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
  }

  async function deleteBodyfunc(index) {

    const { rowData, btnId } = index
    if (rowData.CommonID) {
      const rep = await customAlert({
        Type: 8,
        Message: `Are you sure you want to delete this ${"EffectiveDate"}: "${rowData.EffectiveDate}"`,
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
              ButtonMsgLable={"Margin"}
              deleteName={"EffectiveDate"}
              pageMode={pageMode}
              editBodyfunc={editBodyfunc}
              deleteBodyfunc={deleteBodyfunc}
            />

          }
        </div>
    </React.Fragment>
  )
}

export default MarginList;