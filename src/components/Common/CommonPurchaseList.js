import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Spinner } from "reactstrap";
import { useDispatch } from "react-redux";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import {
  BreadcrumbShowCountlabel,
  CommonBreadcrumbDetails,
} from "../../store/actions";
import { breadcrumbReturnFunc, metaTagLabel } from "./CommonFunction";
import C_Report from "./C_Report";
import * as mode from "../../routes/PageMode";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { E_Invoice_ActionsButtonFunc, E_WayBill_ActionsButtonFunc, hideBtnCss, listPageActionsButtonFunc, makeBtnCss } from "./ListActionsButtons";
import DynamicColumnHook, { selectAllCheck } from "./TableCommonFunc";
import { url } from "../../routes";
import { C_Button } from "./CommonButton";
import CustomTable from "../../CustomTable2";
import ExtraTableWrapper from "../../CustomTable2/TableWrapper";


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
  // const [tableList, settableList] = useState([]);
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
    ButtonMsgLable,
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
    selectCheckParams = { isShow: false }
  } = props;

  const { PageFieldMaster = [] } = { ...pageField };

  useEffect(() => {
    const locationPath = history.location.pathname;
    let userAcc = userAccess.find((inx) => {
      return `/${inx.ActualPagePath}` === locationPath;
    });
    if (!(userAcc === undefined)) {
      setUserAccState(userAcc);
      breadcrumbReturnFunc({ dispatch, userAcc, newBtnPath, forceNewBtnView });
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
      })
    );
  }, [tableList]);

  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {
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
  }, [updateMsg]);

  useEffect(() => {
    if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
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

    if (
      makeBtnShow &&
      pageMode === mode.modeSTPsave
    ) {
      return {
        text: "Action",
        dataField: "hasSelect",
        sort: true,
        attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': 'Action', "sticky-col": (colIndex === 0) ? "true" : "false" }),
        formatter: (cellContent, rowData) => {
          rowData["hasSelect"] = false;
          if (rowData.IsRecordDeleted === true) {   ///hide button in GRN list 3 STP page last action column for Make Button
            return (
              <div>
                <div>
                  <Button
                    type="button"
                    className={hideBtnCss}
                    data-mdb-toggle="tooltip"
                    data-mdb-placement="top"
                    disabled={listBtnLoading}
                    title={"UnHide"}
                    onClick={() => {
                      hideBtnHandler(rowData);
                    }}
                  >
                    {(listBtnLoading === `btn-makeBtn-${rowData.id}`) ?
                      <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                      : <span
                        style={{ marginLeft: "4px", marginRight: "4px" }}
                        className=" fas fa-eye"
                      ></span>
                    }
                  </Button>
                </div>
              </div>
            );
          } else {
            return (
              <div>
                <Button
                  type="button"
                  className={makeBtnCss}
                  data-mdb-toggle="tooltip"
                  data-mdb-placement="top"
                  disabled={listBtnLoading}
                  title={makeBtnName}
                  onClick={() => {
                    makeBtnHandler(rowData);
                  }}
                >
                  {(listBtnLoading === `btn-makeBtn-${rowData.id}`) ?
                    <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                    : <span
                      style={{ marginLeft: "6px", marginRight: "6px" }}
                      className=" fas fa-file-invoice"
                    ></span>
                  }
                </Button>
              </div>
            );
          }

          // }
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
    if ((history.location.pathname === url.INVOICE_LIST_1)) {// INVOICE_LIST_1 E_Invoice buttons
      return E_Invoice_ActionsButtonFunc({ ...props, dispatch, userAccState, })
    }
  }

  const thirdLastColumn = () => {  // ======================== for List Page Action Button ================================
    if ((history.location.pathname === url.INVOICE_LIST_1)) {// INVOICE_LIST_1 E_WayBill buttons
      return E_WayBill_ActionsButtonFunc({ ...props, dispatch, userAccState, })
    }
  }

  const [tableColumns, defaultSorted] = DynamicColumnHook({
    pageField,
    reducers: props.reducers,
    secondLastColumn,
    thirdLastColumn,
    lastColumn,
    makeBtnColumn,
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
              <CustomTable
                keyField={"id"}
                data={tableProps}
                columns={tableColumns}
                selectRow={selectCheckParams.isShow ?
                  selectAllCheck(rowSelected(), nonSelectedRow(), "left", selectCheckParams.selectHeaderLabel)
                  : undefined}
                defaultSorted={defaultSorted}
                updatedRowBlinkId={updatedRowBlinkId}
                onDataSizeChange={({ dataCount }) => {
                  dispatch(BreadcrumbShowCountlabel(`${ButtonMsgLable} Count:${dataCount}`));
                }}
                paginationEnabled={true}
                noDataIndication={
                  <div className="text-danger text-center ">
                    No record(s) Not Found.
                  </div>
                }
              />)}
          </ExtraTableWrapper>
          {

            ((tableList.length > 0) && (selectCheckParams.isShow)) ?

              <div className="row save1 " style={{ paddingBottom: 'center' }}>
                <C_Button
                  forceDisabled={listBtnLoading}
                  loading={selectCheckParams.selectSaveBtnLoading}
                  style={{ marginTop: "-10px" }}
                  type="button"
                  spinnerColor="white"
                  className="btn btn-primary w-md  "
                  onClick={() => { selectCheckParams.selectSaveBtnHandler(tableList) }}
                >
                  <i class="fas fa-edit me-2"></i>{selectCheckParams.selectSaveBtnLabel}
                </C_Button>
              </div>
              : null
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










// import React, { useEffect, useState } from "react";
// import { Button, Col, Modal, Row, Spinner } from "reactstrap";
// import paginationFactory, {
//   PaginationListStandalone,
//   PaginationProvider,
// } from "react-bootstrap-table2-paginator";
// import ToolkitProvider from "react-bootstrap-table2-toolkit";
// import BootstrapTable from "react-bootstrap-table-next";
// import { useDispatch } from "react-redux";
// import { MetaTags } from "react-meta-tags";
// import { useHistory } from "react-router-dom";
// import {
//   BreadcrumbShowCountlabel,
//   CommonBreadcrumbDetails,
// } from "../../store/actions";
// import { breadcrumbReturnFunc, metaTagLabel } from "./CommonFunction";
// import { defaultSearch, mySearchProps } from "./SearchBox/MySearch";
// import C_Report from "./C_Report";
// import * as mode from "../../routes/PageMode";
// import { customAlert } from "../../CustomAlert/ConfirmDialog";
// import { E_Invoice_ActionsButtonFunc, E_WayBill_ActionsButtonFunc, listPageActionsButtonFunc, makeBtnCss } from "./ListActionsButtons";
// import DynamicColumnHook, { selectAllCheck } from "./TableCommonFunc";
// import { url } from "../../routes";
// import { C_Button } from "./CommonButton";

// let searchCount = 0;

// let searchProps = {
//   onClear: function onClear() { },
//   onSearch: function onSearch() { },
//   searchText: "",
// };

// export const countlabelFunc = (
//   toolkitProps,
//   paginationProps,
//   dispatch,
//   ButtonMsgLable
// ) => {
//   let iscall = 0;
//   if (paginationProps.dataSize) {
//     iscall = paginationProps.dataSize;
//   }

//   if (!(iscall === searchCount)) {
//     dispatch(BreadcrumbShowCountlabel(`${ButtonMsgLable} Count:${iscall}`));
//     searchCount = paginationProps.dataSize;
//   }
//   searchProps = toolkitProps.searchProps;
// };

// export async function isAlertFunc(type, Msg) {
//   await customAlert({
//     Type: type,
//     Message: Msg.Message,
//     isFunc: true,
//   });
// }

// const CommonPurchaseList = (props) => {

//   const dispatch = useDispatch();
//   const history = useHistory();

//   const [userAccState, setUserAccState] = useState("");
//   const [modal_edit, setmodal_edit] = useState(false);
//   // const [tableList, settableList] = useState([]);
//   const {
//     editData = { Data: "" },
//     updateMsg = { Status: false },
//     deleteMsg = { Status: false },
//     userAccess = [],
//     postMsg = { Status: false },
//     pageField = { id: "" },
//     tableList = [],
//     listBtnLoading = false,
//   } = props.reducers;

//   const { getList, editId, deleteId, postSucc, updateSucc, deleteSucc, viewId } =
//     props.action;

//   const {
//     MasterModal,
//     masterPath,
//     ButtonMsgLable,
//     goButnFunc = () => { },
//     makeBtnFunc = () => { },
//     makeBtnShow,
//     makeBtnName,
//     pageMode,
//     newBtnPath,
//     forceNewBtnView,
//     HeaderContent = () => {
//       return null;
//     },
//     selectCheckParams = { isShow: false }
//   } = props;

//   const { PageFieldMaster = [] } = { ...pageField };

//   useEffect(() => {
//     const locationPath = history.location.pathname;
//     let userAcc = userAccess.find((inx) => {
//       return `/${inx.ActualPagePath}` === locationPath;
//     });
//     if (!(userAcc === undefined)) {
//       setUserAccState(userAcc);
//       breadcrumbReturnFunc({ dispatch, userAcc, newBtnPath, forceNewBtnView });
//     }
//   }, [userAccess]);

//   useEffect(() => {
//     let downList = [];
//     let defaultDownList2 = [];
//     let listObj = {};
//     let listObj2 = {};

//     tableList.forEach((index1) => {
//       PageFieldMaster.forEach((index2) => {
//         if (index2.ShowInDownload) {
//           listObj2[index2.ControlID] = index2.ShownloadDefaultSelect;
//           listObj[index2.ControlID] = index1[index2.ControlID];
//         }
//       });

//       downList.push(listObj);
//       defaultDownList2.push(listObj2);
//       listObj = {};
//     });
//     dispatch(
//       CommonBreadcrumbDetails({
//         downBtnData: downList,
//         defaultDownBtnData: listObj2,
//       })
//     );
//   }, [tableList]);

//   // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
//   useEffect(() => {
//     if (updateMsg.Status === true && updateMsg.StatusCode === 200) {
//       breadcrumbReturnFunc({
//         dispatch,
//         userAcc: userAccState,
//         newBtnPath: masterPath,
//       });
//       dispatch(updateSucc({ Status: false }));
//       goButnFunc();
//       isAlertFunc(1, updateMsg);
//       tog_center();
//     } else if (updateMsg.Status === true) {
//       dispatch(updateSucc({ Status: false }));
//       isAlertFunc(3, updateMsg);
//     }
//   }, [updateMsg]);

//   useEffect(() => {
//     if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
//       dispatch(deleteSucc({ Status: false }));
//       goButnFunc();
//       isAlertFunc(1, deleteMsg);
//     } else if (deleteMsg.Status === true) {
//       dispatch(deleteSucc({ Status: false }));
//       isAlertFunc(3, deleteMsg);
//     }
//   }, [deleteMsg]);

//   useEffect(() => {
//     if (postMsg.Status === true && postMsg.StatusCode === 200) {
//       dispatch(postSucc({ Status: false }));
//       tog_center();
//       dispatch(getList());
//       isAlertFunc(1, postMsg);
//     } else if (postMsg.Status === true) {
//       dispatch(postSucc({ Status: false }));
//       isAlertFunc(4, postMsg);
//     }
//   }, [postMsg]);

//   // Edit Modal Show When Edit Data is true
//   useEffect(() => {

//     if ((editData.Status === true)) {
//       if (pageField.IsEditPopuporComponent) {
//         history.push({
//           pathname: masterPath,
//           [mode.editValue]: editData.Data,
//           pageMode: editData.pageMode,
//         });
//       } else {
//         setmodal_edit(true);
//       }
//     }
//   }, [editData]);

//   function makeBtnHandler(rowData) {

//     rowData["hasSelect"] = true;
//     let arr = [];
//     arr.push(rowData);
//     makeBtnFunc(arr);
//   }

//   function tog_center() {
//     if (modal_edit) {
//       breadcrumbReturnFunc({
//         dispatch,
//         userAcc: userAccState,
//         newBtnPath: masterPath,
//       });
//     }
//     setmodal_edit(false);
//   }

//   const makeBtnColumn = () => {// ======================== for makeBtnColumn Page Action Button ================================

//     if (
//       makeBtnShow &&
//       pageMode === mode.modeSTPsave
//     ) {
//       return {
//         text: "Action",
//         dataField: "hasSelect",
//         sort: true,
//         formatter: (cellContent, rowData, key) => {
//           rowData["hasSelect"] = false;

//           return (
//             <div>
//               <Button
//                 type="button"
//                 className={makeBtnCss}
//                 data-mdb-toggle="tooltip"
//                 data-mdb-placement="top"
//                 disabled={listBtnLoading}
//                 title={makeBtnName}
//                 onClick={() => {
//                   makeBtnHandler(rowData);
//                 }}
//               >
//                 {(listBtnLoading === `btn-makeBtn-${rowData.id}`) ?
//                   <Spinner style={{ height: "16px", width: "16px" }} color="white" />
//                   : <span
//                     style={{ marginLeft: "6px", marginRight: "6px" }}
//                     className=" fas fa-file-invoice"
//                   ></span>
//                 }
//               </Button>
//             </div>
//           );
//           // }
//         },
//       }
//     }
//   }
//   const lastColumn = () => {  // ======================== for List Page Action Button ================================
//     if (!(pageMode === mode.modeSTPsave)) {
//       return listPageActionsButtonFunc({
//         ...props, dispatch, history, userAccState,
//         editActionFun: editId,
//         deleteActionFun: deleteId,
//       })
//     }
//   }

//   const secondLastColumn = () => {  // ======================== for List Page Action Button ================================
//     if ((history.location.pathname === url.INVOICE_LIST_1)) {// INVOICE_LIST_1 E_Invoice buttons
//       return E_Invoice_ActionsButtonFunc({ ...props, dispatch, userAccState, })
//     }
//   }

//   const thirdLastColumn = () => {  // ======================== for List Page Action Button ================================
//     if ((history.location.pathname === url.INVOICE_LIST_1)) {// INVOICE_LIST_1 E_WayBill buttons
//       return E_WayBill_ActionsButtonFunc({ ...props, dispatch, userAccState, })
//     }
//   }

//   const [tableColumns, defaultSorted, pageOptions,] = DynamicColumnHook({
//     pageField,
//     reducers: props.reducers,
//     secondLastColumn,
//     thirdLastColumn,
//     lastColumn,
//     makeBtnColumn,
//     userAccState: userAccState
//   })


//   function rowSelected() {
//     return tableList.map((index) => { return (index.selectCheck) })
//   }

//   const nonSelectedRow = () => {

//     var noSelectedIds = [];

//     if (masterPath === url.SALES_RETURN) {
//       noSelectedIds = tableList
//         .filter(row => (row.Status === "Send To Supplier") || (row.Status === "Open"))
//         .map(row => row.id);
//     } else {
//       noSelectedIds = tableList
//         .filter(row => row.forceSelectDissabled)
//         .map(row => row.id);
//     }
//     return noSelectedIds;
//   };

//   if (!(userAccState === "")) {

//     return (
//       <React.Fragment>
//         <MetaTags> {metaTagLabel(userAccState)}</MetaTags>
//         <HeaderContent />
//         <div >
//           <PaginationProvider pagination={paginationFactory(pageOptions)}>
//             {({ paginationProps, paginationTableProps }) => (
//               <ToolkitProvider
//                 keyField="id"
//                 data={tableList}
//                 columns={tableColumns}
//                 search={defaultSearch(pageField.id)}
//               >
//                 {(toolkitProps, a) => (
//                   <React.Fragment>
//                     <Row>

//                       <Col xl="12">
//                         <div className="table-responsive mt-1" >
//                           <BootstrapTable
//                             keyField={"id"}
//                             // key={`table-key-${pageField.PageHeading}`}
//                             responsive
//                             bootstrap4
//                             bordered={false}
//                             selectRow={selectCheckParams.isShow ?
//                               selectAllCheck(rowSelected(), nonSelectedRow(), "left", selectCheckParams.selectHeaderLabel)
//                               : undefined}
//                             defaultSorted={defaultSorted}
//                             striped={true}
//                             classes={"table  table-bordered table-hover"}
//                             noDataIndication={
//                               <div className="text-danger text-center ">
//                                 No record(s) Not Found.
//                               </div>
//                             }
//                             {...toolkitProps.baseProps}
//                             {...paginationTableProps}
//                           />
//                         </div>
//                       </Col>

//                       {countlabelFunc(
//                         toolkitProps,
//                         paginationProps,
//                         dispatch,
//                         ButtonMsgLable
//                       )}
//                       {mySearchProps(toolkitProps.searchProps, pageField.id)}
//                     </Row>
//                     <Row className="align-items-md-center mt-30">
//                       <Col className="pagination pagination-rounded justify-content-end mb-2">
//                         <PaginationListStandalone {...paginationProps} />
//                       </Col>
//                     </Row>
//                   </React.Fragment>
//                 )}
//               </ToolkitProvider>
//             )}
//           </PaginationProvider>
//           {

//             ((tableList.length > 0) && (selectCheckParams.isShow) && (selectCheckParams.isRoleAccess)) ?

//               <div className="row save1 " style={{ paddingBottom: 'center' }}>
//                 <C_Button
//                   forceDisabled={listBtnLoading}
//                   loading={selectCheckParams.selectSaveBtnLoading}
//                   style={{ marginTop: "-10px" }}
//                   type="button"
//                   spinnerColor="white"
//                   className="btn btn-primary w-md  "
//                   onClick={() => { selectCheckParams.selectSaveBtnHandler(tableList) }}
//                 >
//                   <i class="fas fa-edit me-2"></i>{selectCheckParams.selectSaveBtnLabel}
//                 </C_Button>
//               </div>
//               : null
//           }

//           <Modal
//             isOpen={modal_edit}
//             toggle={() => {
//               tog_center();
//             }}
//             size="xl"
//           >
//             <MasterModal
//               editValue={editData.Data}
//               masterPath={masterPath}
//               pageMode={editData.pageMode}
//             />
//           </Modal>



//         </div>

//         <C_Report />
//       </React.Fragment>
//     );
//   } else {
//     return <React.Fragment></React.Fragment>;
//   }
// };

// export default CommonPurchaseList;