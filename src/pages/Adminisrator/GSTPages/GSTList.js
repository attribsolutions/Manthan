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
import * as _act from "../../../store/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import GSTMaster from "./GSTMaster";
import { deleteGSTListId, deleteGSTListId_Success, getGSTList, goButtonForGST_Master_Success } from "../../../store/Administrator/GSTRedux/action";
import { Listloader } from "../../../components/Common/CommonButton";

const GSTList = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const hasPagePath = history.location.pathname

  const [pageMode, setpageMode] = useState(mode.defaultsave)
  const [userAccState, setUserAccState] = useState('');

  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.GSTReducer.listBtnLoading,
      tableList: state.GSTReducer.GSTList,
      GSTGoButton: state.GSTReducer.GSTGoButton,
      deleteMsg: state.GSTReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const { userAccess, pageField, GSTGoButton, deleteMsg } = reducers;

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
    dispatch(BreadcrumbShowCountlabel(`${"GST Count"} :0`))
    dispatch(getGSTList())

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
      dispatch(getGSTList())
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

  function editBodyfunc(index) {

    const { rowData, btnId } = index
    let { preEffectiveDate } = rowData;
    _cfunc.btnIsDissablefunc({ btnId, state: true })

    try {
      const jsonBody = JSON.stringify({
        EffectiveDate: preEffectiveDate
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
        Message: `Are you sure you want to delete this ${"EffectiveDate"}: "${rowData.EffectiveDate}"`,
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

  return (
    <React.Fragment>
      <div className="page-content">

        {/* <div className="mt-n1"> */}
        {
          reducers.listBtnLoading ?
            <Listloader />
            :
            (pageField) ?
              <CommonPurchaseList
                action={action}
                reducers={reducers}
                showBreadcrumb={false}
                MasterModal={GSTMaster}
                masterPath={url.GST}
                newBtnPath={url.GST}
                ButtonMsgLable={"GST"}
                deleteName={"EffectiveDate"}
                pageMode={pageMode}
                editBodyfunc={editBodyfunc}
                deleteBodyfunc={deleteBodyfunc}
              />
              : <> <Listloader /></>
        }
        {/* </div> */}

      </div>
    </React.Fragment>
  )
}

export default GSTList;