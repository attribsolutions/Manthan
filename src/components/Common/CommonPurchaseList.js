import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Spinner } from "reactstrap";
import { useDispatch } from "react-redux";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import {
  BreadcrumbRadioButtonView,
  BreadcrumbShowCountlabel,
  CommonBreadcrumbDetails,
  getpdfReportdata,
} from "../../store/actions";
import { TotalAmount_Func, breadcrumbReturnFunc, loginEmployeeID, loginUserDetails, metaTagLabel } from "./CommonFunction";
import C_Report from "./C_Report";
import * as mode from "../../routes/PageMode";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { E_Invoice_ActionsButtonFunc, E_WayBill_ActionsButtonFunc, hideBtnCss, listPageActionsButtonFunc, makeBtnCss, printBtnCss } from "./ListActionsButtons";
import DynamicColumnHook, { selectAllCheck } from "./TableCommonFunc";
import { url } from "../../routes";
import { C_Button } from "./CommonButton";
import GlobalCustomTable from "../../GlobalCustomTable";
import ExtraTableWrapper from "../../GlobalCustomTable/TableWrapper";
import SaveButtonDraggable from "./saveButtonDraggable";
import * as report from '../../Reports/ReportIndex'
import { Invoice_Singel_Get_for_Report_Api } from "../../helpers/backend_helper";



export async function isAlertFunc(type, Msg) {
  await customAlert({
    Type: type,
    Message: Msg.Message,
    isFunc: true,
  });
}

const CommonPurchaseList = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();

  const [userAccState, setUserAccState] = useState("");
  const [modal_edit, setmodal_edit] = useState(false);


  const {
    editData = { Data: "" },
    updateMsg = { Status: false },
    deleteMsg = { Status: false },
    userAccess = [],
    postMsg = { Status: false },
    pageField = { id: "" },
    tableList = [],
    listBtnLoading = false,
  } = props.reducers;

  const { getList, editId, deleteId, postSucc, updateSucc, deleteSucc, viewId } =
    props.action;

  const {

    MasterModal,
    masterPath,
    goButnFunc = () => { },
    makeBtnFunc = () => { },
    hideBtnFunc = () => { },
    makeBtnShow,
    makeBtnName,
    pageMode,
    newBtnPath,
    forceNewBtnView,
    HeaderContent = () => {
      return null;
    },
    selectCheckParams = { isShow: false },
    totalAmountShow = false,
    mobaileDeleteApiFinc
  } = props;

  const { PageFieldMaster = [] } = { ...pageField };

  useEffect(async () => {

    const locationPath = history.location.pathname;
    let userAcc = userAccess.find((inx) => {
      const AuthenticatedLinkPath = (locationPath.startsWith(`/${inx.ActualPagePath}`)) && locationPath.includes("AuthLink")
      if (AuthenticatedLinkPath) {
        return true
      } else {
        return `/${inx.ActualPagePath}` === locationPath;
      }
    });
    if (!(userAcc === undefined)) {
      setUserAccState(userAcc);
      breadcrumbReturnFunc({
        dispatch,
        userAcc,
        newBtnPath,
        forceNewBtnView,
        pageField: pageField
      });
    }
  }, [userAccess]);

  useEffect(() => {
    let downList = [];
    let defaultDownList2 = [];
    let listObj = {};
    let listObj2 = {};

    tableList.forEach((index1) => {
      PageFieldMaster.forEach((index2) => {
        if (index2.ShowInDownload) {
          listObj2[index2.ControlID] = index2.ShownloadDefaultSelect;
          listObj[index2.ControlID] = index1[index2.ControlID];
        }
      });

      downList.push(listObj);
      defaultDownList2.push(listObj2);
      listObj = {};
    });
    dispatch(
      CommonBreadcrumbDetails({
        downBtnData: downList,
        defaultDownBtnData: listObj2,
        CountLabel: pageField?.CountLabel,
        pageHeading: pageField?.PageHeading,
        // newBtnView: userAccState?.RoleAccess_IsSave,
        excelBtnView: userAccState?.RoleAccess_Exceldownload,
        pageMode: pageMode
      })
    );

    const hasRole = (role) => userAccState[role];
    if (hasRole("RoleAccess_DeletedNonDeletedRecords")) {
      dispatch(BreadcrumbRadioButtonView(true));
    }
  }, [tableList, pageField, userAccState]);

  useEffect(() => {

    if ((pageField?.CountLabel === true)) {
      if (totalAmountShow === true) {
        dispatch(BreadcrumbShowCountlabel(`Count:${tableList.length} currency_symbol ${TotalAmount_Func(tableList)}`));
      }
      else if (pageField?.CountLabel === true) {
        dispatch(BreadcrumbShowCountlabel(`Count:${tableList.length}`));
      }
    }
  }, [tableList, pageField])


  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {

    if (typeof userAccState === 'object') {
      if (updateMsg.Status === true && updateMsg.StatusCode === 200) {

        breadcrumbReturnFunc({
          dispatch,
          userAcc: userAccState,
          newBtnPath: masterPath,
        });
        dispatch(updateSucc({ Status: false }));
        goButnFunc();
        isAlertFunc(1, updateMsg);
        tog_center();
      } else if (updateMsg.Status === true) {
        dispatch(updateSucc({ Status: false }));
        isAlertFunc(3, updateMsg);
      }
    }
  }, [updateMsg, userAccState]);

  useEffect(async () => {
    if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {

      //***************mobail app api*********************** */
      if (mobaileDeleteApiFinc) {
        await mobaileDeleteApiFinc(deleteMsg)
      }
      //************************************** */

      dispatch(deleteSucc({ Status: false }));
      goButnFunc();
      isAlertFunc(1, deleteMsg);
    } else if (deleteMsg.Status === true) {
      dispatch(deleteSucc({ Status: false }));
      isAlertFunc(3, deleteMsg);
    }
  }, [deleteMsg]);

  useEffect(() => {
    if (postMsg.Status === true && postMsg.StatusCode === 200) {
      dispatch(postSucc({ Status: false }));
      tog_center();
      dispatch(getList());
      isAlertFunc(1, postMsg);
    } else if (postMsg.Status === true) {
      dispatch(postSucc({ Status: false }));
      isAlertFunc(4, postMsg);
    }
  }, [postMsg]);

  // Edit Modal Show When Edit Data is true
  useEffect(() => {

    if ((editData.Status === true)) {
      if (pageField.IsEditPopuporComponent) {
        history.push({
          pathname: masterPath,
          [mode.editValue]: editData.Data,
          pageMode: editData.pageMode,
        });
      } else {
        setmodal_edit(true);
      }
    }
  }, [editData]);

  function makeBtnHandler(rowData) {

    rowData["hasSelect"] = true;
    let arr = [];
    arr.push(rowData);
    makeBtnFunc(arr);
  }



  function hideBtnHandler(rowData) {
    rowData["isHideValue"] = "0";
    let arr = [];
    arr.push(rowData);
    hideBtnFunc(arr);
  }

  function printBtnHandler(rowData, btnId) {
    let config = {}
    config["btnId"] = btnId
    config["editId"] = rowData.id
    config["ReportType"] = report.invoice;
    dispatch(getpdfReportdata(Invoice_Singel_Get_for_Report_Api, config))
  }



  function tog_center() {

    if (modal_edit) {
      breadcrumbReturnFunc({
        dispatch,
        userAcc: userAccState,
        newBtnPath: masterPath,
      });
    }
    setmodal_edit(false);
  }

  const makeBtnColumn = () => {// ======================== for makeBtnColumn Page Action Button ================================
    const hasRole = (role) => userAccState[role];


    if (
      makeBtnShow &&
      pageMode === mode.modeSTPsave
    ) {
      return {
        text: "Action",
        dataField: "",
        sort: true,
        attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': 'Action', "sticky-col": (colIndex === 0) ? "true" : "false" }),
        formatter: (cellContent, rowData) => {
          // if (condition) {



          if (rowData.IsRecordDeleted === true) {   ///hide button in GRN list 3 STP page last action column for Make Button
            return (
              <div>
                <div>
                  <Button
                    type="button"
                    className={hideBtnCss}
                    data-mdb-toggle="tooltip"
                    data-mdb-placement="top"
                    title={"UnHide"}

                    onClick={() => {
                      !listBtnLoading && hideBtnHandler(rowData);
                    }}
                  >
                    {(listBtnLoading === `btn-makeBtn-${rowData.id}`) ?
                      <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                      : <span

                        className="fas fa-eye font-size-16"
                      ></span>
                    }
                  </Button>


                  < Button
                    type="button"
                    id={`btn-print-${rowData.id}`}
                    className={printBtnCss}
                    style={{ marginLeft: "9px" }}
                    title="Print Invoice"

                    onClick={() => {
                      const btnId = `btn-print-${rowData.id}`
                      !listBtnLoading && printBtnHandler(rowData, btnId)
                    }}
                  >
                    {(listBtnLoading === `btn-print-${rowData.id}`) ?
                      <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                      : <span

                        className="bx bx-printer font-size-16"
                      ></span>
                    }
                  </Button>
                </div>
              </div>
            );
          } else {
            return (
              <div>
                {hasRole("RoleAccess_MakeGRN") && <Button
                  type="button"
                  className={makeBtnCss}
                  data-mdb-toggle="tooltip"
                  data-mdb-placement="top"
                  title={makeBtnName}
                  disabled={rowData.forceMakeBtnHide}
                  onClick={() => {
                    !listBtnLoading && makeBtnHandler(rowData);
                  }}
                >
                  {(listBtnLoading === `btn-makeBtn-${rowData.id}`) ?
                    <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                    : <span

                      className=" fas fa-file-invoice font-size-16"
                    ></span>
                  }
                </Button>}
                {hasRole("RoleAccess_IsPrint") && < Button
                  type="button"
                  id={`btn-print-${rowData.id}`}
                  className={printBtnCss}
                  style={{ marginLeft: "9px" }}
                  title="Print GRN"
                  onClick={() => {
                    const btnId = `btn-print-${rowData.id}`
                    !listBtnLoading && printBtnHandler(rowData, btnId)
                  }}
                >
                  {(listBtnLoading === `btn-print-${rowData.id}`) ?
                    <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                    : <span

                      className="bx bx-printer font-size-16"
                    ></span>
                  }
                </Button>}
              </div>
            );
          }


        },
      }
    }
  }
  const lastColumn = () => {  // ======================== for List Page Action Button ================================
    if (!(pageMode === mode.modeSTPsave)) {

      return listPageActionsButtonFunc({
        ...props, dispatch, history, userAccState,
        editActionFun: editId,
        deleteActionFun: deleteId,
      })
    }
  }

  const secondLastColumn = () => {  // ======================== for List Page Action Button ================================
    const hasRole = (role) => userAccState[role];

    const isUploadAccess = hasRole("RoleAccess_E-WayBillUpload");
    const isCancelAccess = hasRole("RoleAccess_E-WayBillcancel");
    const isPrintAccess = hasRole("RoleAccess_E-WayBillPrint");


    if (isUploadAccess || isCancelAccess || isPrintAccess) {// INVOICE_LIST_1 E_WayBill buttons

      return E_WayBill_ActionsButtonFunc({ ...props, dispatch, userAccState, })
    }

  }

  const thirdLastColumn = () => {  // ======================== for List Page Action Button ================================
    const hasRole = (role) => userAccState[role];

    const isUploadAccess = hasRole("RoleAccess_E-InvoiceUpload");
    const isCancelAccess = hasRole("RoleAccess_E-Invoicecancel");
    const isPrintAccess = hasRole("RoleAccess_E-InvoicePrint");

    if (isUploadAccess || isCancelAccess || isPrintAccess) {// INVOICE_LIST_1 E_Invoice buttons
      return E_Invoice_ActionsButtonFunc({ ...props, dispatch, userAccState, })
    }
  }


  const ExtraSelectColumn = () => {  // ======================== for List Page Action Button ================================
    debugger
    if ((selectCheckParams.isExtraSelectShow)) {

      return {
        dataField: 'ExtraSelect',
        formatExtraData: tableList,
        text: (
          <div>
            <Input
              type="checkbox"

              onChange={(e) => selectCheckParams.headerselecthandler({ event: e, tableList: tableList })}
            />
            &nbsp;&nbsp; {selectCheckParams.ExtraSelectLabel}
          </div>
        ),
        formatter: (cell, row, rowindex, formatExtraData) => {
          return (
            <Input
              type="checkbox"
              defaultChecked={row.ExtraSelect}
              disabled={row.forceExtraSelectDissabled}
              style={row.forceExtraSelectDissabled ? {
                opacity: 0.5,
                backgroundColor: "#ababab82",
              } : {}}
              onChange={(e) => {
                selectCheckParams.selecthandler({ event: e, rowData: row, tableList: formatExtraData })
              }}
            />
          );
        },
        headerStyle: { width: '100px' },
      }
    }

  }



  const [tableColumns, defaultSorted] = DynamicColumnHook({
    pageField,
    reducers: props.reducers,
    secondLastColumn,
    thirdLastColumn,
    lastColumn,
    makeBtnColumn,
    ExtraSelectColumn,
    userAccState: userAccState
  })

  function rowSelected() {
    return tableList.map((index) => { return (index.selectCheck) })
  }

  const nonSelectedRow = () => {
    var noSelectedIds = [];
    if (masterPath === url.SALES_RETURN) {
      noSelectedIds = tableList
        .filter(row => (row.Status === "Send To Supplier") || (row.Status === "Open"))
        .map(row => row.id);
    } else {

      noSelectedIds = tableList
        .filter(row => row.forceSelectDissabled)
        .map(row => row.id);
    }
    return noSelectedIds;
  };
  const { updatedRowBlinkId } = history.location
  if (!(userAccState === "")) {

    return (
      <React.Fragment>
        <MetaTags> {metaTagLabel(userAccState)}</MetaTags>
        <HeaderContent />
        <div >
          <ExtraTableWrapper
            data={tableList}
          >
            {(tableProps) => (
              <GlobalCustomTable
                keyField={"id"}
                data={tableProps}
                columns={tableColumns}
                selectRow={selectCheckParams.isShow || userAccState.RoleAccess_SelectAll ?
                  selectAllCheck({
                    rowSelected: rowSelected(),
                    nonSelectable: nonSelectedRow(),
                    position: "left",
                    headLabel: selectCheckParams.selectHeaderLabel,
                    tableList: tableList,
                    pageloading: selectCheckParams.pageloading
                  })
                  : undefined}
                defaultSorted={defaultSorted}
                updatedRowBlinkId={updatedRowBlinkId}
                onDataSizeChange={({ dataCount, filteredData = [] }) => {
                  if (totalAmountShow === true) {
                    dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} currency_symbol ${TotalAmount_Func(filteredData)}`));
                  }
                  else {
                    dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                  }
                }}
                paginationEnabled={true}
                noDataIndication={
                  <div className="text-danger text-center ">
                    No record(s) Not Found.
                  </div>
                }
              />)}
          </ExtraTableWrapper>
          {//  check box handler buttons

            ((tableList.length > 0)) && (userAccState.RoleAccess_SelectAll) &&

            <SaveButtonDraggable>
              <div>
                <C_Button
                  forceDisabled={listBtnLoading}
                  loading={selectCheckParams.selectSaveBtnLoading}

                  // style={{ marginTop: "-10px", padding: "3px", paddingInline: "5px" }}
                  type="button"
                  spinnerColor="white"
                  className="btn btn-primary"
                  onClick={() => { selectCheckParams.selectSaveBtnHandler(tableList) }}
                >
                  {selectCheckParams.selectSaveBtnLabel}
                </C_Button>
              </div>

              {(selectCheckParams.isExtraSelectShow) && <div>


                <C_Button
                  forceDisabled={listBtnLoading}
                  loading={selectCheckParams.ExtraBtnLoading}

                  // style={{ marginTop: "-10px", padding: "3px", paddingInline: "5px" }}
                  type="button"
                  spinnerColor="white"
                  className="btn btn-primary"
                  onClick={() => { selectCheckParams.ExtraSelectBtnHandler(tableList) }}
                >
                  {selectCheckParams.ExtraSelectLabel}
                </C_Button>



              </div>}

            </SaveButtonDraggable>
          }

          <Modal
            isOpen={modal_edit}
            toggle={() => {
              tog_center();
            }}
            size="xl"
          >
            <MasterModal
              editValue={editData.Data}
              masterPath={masterPath}
              pageMode={editData.pageMode}
            />
          </Modal>
        </div>

        <C_Report />
      </React.Fragment>
    );
  } else {
    return <React.Fragment></React.Fragment>;
  }
};

export default CommonPurchaseList;




/*********************************************************************************************************************** */

let searchCount = 0
let searchProps = {
  onClear: function onClear() { },
  onSearch: function onSearch() { },
  searchText: ""
}

export const countlabelFunc = (toolkitProps, paginationProps, dispatch, ButtonMsgLable) => {

  let iscall = 0
  if (paginationProps.dataSize) {
    iscall = paginationProps.dataSize
  }

  if (!(iscall === searchCount)) {
    dispatch(BreadcrumbShowCountlabel(`${ButtonMsgLable} Count:${iscall}`))
    searchCount = paginationProps.dataSize
  }
  searchProps = toolkitProps.searchProps
}
