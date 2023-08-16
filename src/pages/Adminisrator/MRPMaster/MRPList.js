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
import { deleteMRPList_Id, deleteMRPList_Id_Success, getMRPList, GoButtonForMRP_MasterSuccess } from "../../../store/Administrator/MRPMasterRedux/action";
import MRPMaster from "./MRPMaster";
import { Listloader } from "../../../components/Common/CommonButton";

const MRPList = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const hasPagePath = history.location.pathname

  const [pageMode, setpageMode] = useState(mode.defaultsave)

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

  const {pageField, MRPGoButton, deleteMsg } = reducers;

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
    dispatch(BreadcrumbShowCountlabel(`${"MRP Count"} :0`))
    dispatch(getMRPList())

  }, []);

  useEffect(() => {

    if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
      dispatch(deleteMRPList_Id_Success([]))
      dispatch(getMRPList())
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

    const { rowData} = index
    let { Division_id, Party_id, EffectiveDate } = rowData;
    try {
      const jsonBody = JSON.stringify({
        Division: Division_id === null ? 0 : Division_id,
        Party: Party_id === null ? 0 : Party_id,
        EffectiveDate: EffectiveDate
      })
      let config = { jsonBody, pathname: url.MRP, btnmode: mode.edit, rowData: rowData }
      dispatch(_act.GoButtonForMRP_Master(config));
    } catch (error) {}
  }

  async function deleteBodyfunc(index) {

    const { rowData, btnId } = index
    if (rowData.CommonID) {
      const rep = await customAlert({
        Type: 8,
        Message: `Are you sure you want to delete this ${"EffectiveDate"}: "${rowData.EffectiveDate}"`,
      })
      if (rep) {
        let config = { btnId, deleteId: rowData.CommonID }
        try {
          dispatch(deleteMRPList_Id(config))
        }
        catch (error) {}
      }
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">

        <div className="mt-n1">
          {
            reducers.listBtnLoading ?
              <Listloader />
              :
              (pageField) ?
                <CommonPurchaseList
                  action={action}
                  reducers={reducers}
                  showBreadcrumb={false}
                  MasterModal={MRPMaster}
                  masterPath={url.MRP}
                  newBtnPath={url.MRP}
                  ButtonMsgLable={"MRP"}
                  deleteName={"EffectiveDate"}
                  pageMode={pageMode}
                  editBodyfunc={editBodyfunc}
                  deleteBodyfunc={deleteBodyfunc}
                />
                : <Listloader />
          }
        </div>

      </div>
    </React.Fragment>
  )
}

export default MRPList;