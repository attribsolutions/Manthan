import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "reactstrap";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch } from "react-redux";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import {
  BreadcrumbShowCountlabel,
  CommonBreadcrumbDetails,
} from "../../store/actions";
import { breadcrumbReturnFunc, metaTagLabel } from "./CommonFunction";
import { defaultSearch, mySearchProps } from "./SearchBox/MySearch";
import C_Report from "./C_Report";
import * as mode from "../../routes/PageMode";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { listPageActionsButtonFunc, makeBtnCss } from "./ListActionsButtons";
import DynamicColumnHook from "./TableCommonFunc";

let sortType = "asc";
let searchCount = 0;
let downList = [];
let listObj = {};

let searchProps = {
  onClear: function onClear() { },
  onSearch: function onSearch() { },
  searchText: "",
};

export const countlabelFunc = (
  toolkitProps,
  paginationProps,
  dispatch,
  ButtonMsgLable
) => {
  let iscall = 0;
  if (paginationProps.dataSize) {
    iscall = paginationProps.dataSize;
  }

  if (!(iscall === searchCount)) {
    dispatch(BreadcrumbShowCountlabel(`${ButtonMsgLable} Count:${iscall}`));
    searchCount = paginationProps.dataSize;
  }
  searchProps = toolkitProps.searchProps;
};

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
  } = props.reducers;

  const { getList, editId, deleteId, postSucc, updateSucc, deleteSucc } =
    props.action;

  const {

    editBodyfunc,
    deleteBodyfunc,
    copyBodyfunc,
    MasterModal,
    masterPath,
    ButtonMsgLable,
    deleteName,
    goButnFunc = () => { },
    makeBtnFunc = () => { },
    makeBtnShow,
    updateBtnFunc,
    makeBtnName,
    downBtnFunc = () => { },
    pageMode,
    newBtnPath,
    forceNewBtnView,
    HeaderContent = () => {
      return null;
    },
    oderAprovalBtnFunc,

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

  const secondLastColumn = () => {// ======================== for GRNMode2 Page Action Button ================================
    if (
      makeBtnShow &&
      pageMode === mode.modeSTPsave
    ) {
      return {
        text: "Action",
        dataField: "hasSelect",
        sort: true,
        formatter: (cellContent, rowData, key) => {
          rowData["hasSelect"] = false;

          return (
            <div>
              <Button
                type="button"
                className={makeBtnCss}
                data-mdb-toggle="tooltip"
                data-mdb-placement="top"
                title={makeBtnName}
                onClick={() => {
                  makeBtnHandler(rowData);
                }}
              >
                <span
                  style={{ marginLeft: "6px", marginRight: "6px" }}
                  className=" fas fa-file-invoice"
                ></span>
              </Button>
            </div>
          );
          // }
        },
      }
    }
  }

  const lastColumn = () => {  // ======================== for List Page Action Button ================================

    if (!(pageMode === mode.modeSTPsave)) {

      return listPageActionsButtonFunc({
        dispatchHook: dispatch,
        subPageMode: history.location.pathname,
        ButtonMsgLable: ButtonMsgLable,
        deleteName: deleteName,
        userAccState: userAccState,
        editActionFun: editId,
        deleteActionFun: deleteId,
        downBtnFunc: downBtnFunc,
        updateBtnFunc: updateBtnFunc,
        makeBtnShow: makeBtnShow,
        makeBtnName: makeBtnName,
        editBodyfunc: editBodyfunc,
        deleteBodyfunc: deleteBodyfunc,
        copyBodyfunc: copyBodyfunc,
        makeBtnFunc: makeBtnFunc,
        pageMode: pageMode,
        oderAprovalBtnFunc: oderAprovalBtnFunc
      })
    }
  }
  const [tableColumns, defaultSorted, pageOptions] = DynamicColumnHook({
    pageField,
    lastColumn,
    secondLastColumn,
    userAccState: userAccState
  })


  if (!(userAccState === "")) {

    return (
      <React.Fragment>
        <MetaTags> {metaTagLabel(userAccState)}</MetaTags>
        <HeaderContent />
        <div className="table-responsive mt-1" >
          <PaginationProvider pagination={paginationFactory(pageOptions)}>
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                data={tableList}
                columns={tableColumns}
                search={defaultSearch(pageField.id)}
              >
                {(toolkitProps, a) => (
                  <React.Fragment>
                    <Row>
                      <Col xl="12">
                        <div className="">
                          <BootstrapTable
                            keyField={"id"}
                            responsive
                            bordered={false}
                            defaultSorted={defaultSorted}
                            striped={true}
                            classes={"table  table-bordered table-hover"}
                            noDataIndication={
                              <div className="text-danger text-center ">
                                {" "}
                                No record(s) Not Found.
                              </div>
                            }
                            {...toolkitProps.baseProps}
                            {...paginationTableProps}
                          />
                        </div>
                      </Col>

                      {countlabelFunc(
                        toolkitProps,
                        paginationProps,
                        dispatch,
                        ButtonMsgLable
                      )}
                      {mySearchProps(toolkitProps.searchProps, pageField.id)}
                    </Row>
                    <Row className="align-items-md-center mt-30">
                      <Col className="pagination pagination-rounded justify-content-end mb-2">
                        <PaginationListStandalone {...paginationProps} />
                      </Col>
                    </Row>
                  </React.Fragment>
                )}
              </ToolkitProvider>
            )}
          </PaginationProvider>

          {/* {
                        (`/${userAccState.ActualPagePath}` === url.GRN_STP_1) ?
                            (tableList.length == 0) ? null :
                                <div className=" " style={{ paddingBottom: 'center' }}>
                                    <button
                                        style={{ marginTop: "-10px" }}
                                        id='form_submmit'
                                        type="submit"
                                        data-mdb-toggle="tooltip" data-mdb-placement="top"
                                        className="btn btn-primary w-md  "
                                        onClick={onSaveBtnClick}
                                    >
                                        <i class="fas fa-edit me-2"></i>{makeBtnName}
                                    </button>
                                </div>
                            :
                            null
                    } */}
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
