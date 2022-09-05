import React, { useEffect, useRef, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Modal, Row } from "reactstrap";
import {
  deleteHpagesUsingID,
  deleteModuleIDSuccess,
  editHPagesID,
  GetHpageListData,
  updateHPagesSuccess,
} from "../../../store/Administrator/HPagesRedux/actions";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import HPageMaster from "./PageMaster";
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { listPageCommonButtonFunction } from "../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons";

export default function PageList() {

  const dispatch = useDispatch();
  const history = useHistory()

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);

  // var HPageListData = [];
  const { HPageListData, editData, updateMessage, deleteModuleID,RoleAccessModifiedinSingleArray } =
    useSelector((state) => ({
      HPageListData: state.H_Pages.HPagesListData,
      editData: state.H_Pages.editData,
      updateMessage: state.H_Pages.updateMessage,
      deleteModuleID: state.H_Pages.deleteModuleID,
      RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
      
    }));

    useEffect(() => {
      const locationPath = history.location.pathname
      let userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
        return (`/${inx.ActualPagePath}` === locationPath)
      })
      if (!(userAcc === undefined)) {
        setUserPageAccessState(userAcc)
      }
    }, [RoleAccessModifiedinSingleArray])

  useEffect(() => {
    dispatch(dispatch(GetHpageListData()));
  }, []);

  function tog_center() {
    setmodal_center(!modal_center);
  }

  useEffect(() => {
    if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
      dispatch(updateHPagesSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMessage.Message,
          AfterResponseAction: GetHpageListData,
        })
      );
      tog_center();
    } else if (updateMessage.Status === true) {
      dispatch(updateHPagesSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMessage.Message),

        })
      );
    }
  }, [updateMessage]);

  useEffect(() => {
    if (deleteModuleID.Status === true && deleteModuleID.StatusCode === 200) {
      dispatch(deleteModuleIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteModuleID.Message,
          AfterResponseAction: GetHpageListData,
        })
      );
    } else if (deleteModuleID.Status === true) {
      dispatch(deleteModuleIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteModuleID.Message),
        })
      );
    }
  }, [deleteModuleID.Status]);

  useEffect(() => {
    if (editData.Status === true) {
      tog_center();
    }
  }, [editData]);


  const pageOptions = {
    sizePerPage: 15,
    totalSize: HPageListData.length, // replace later with size(users),
    custom: true,
  };

  const defaultSorted = [
    {
      dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
      order: "asc", // desc or asc
    },
  ];

  let myInlineStyle = {
    marginTop: "-10px",
  };

  const HPageListColoumns = [
    {
      text: "Name",
      dataField: "Name",
      sort: true,
    },
    {
      text: "Page Heading",
      dataField: "PageHeading",
      sort: true,
    },
    {
      text: "Module Name",
      dataField: "ModuleName",
      sort: true,
    },
    {
      text: "Display Index",
      dataField: "DisplayIndex",
      sort: true,
    },
    {
      text: "Icon",
      dataField: "Icon",
      sort: true,
    },
    {
      text: "Page Path",
      dataField: "ActualPagePath",
      sort: true,
    },
    {
      text: "Active",
      dataField: "isActive",
      sort: true,
    },
      // For Edit, Delete ,and View Button Common Code function
      listPageCommonButtonFunction({
        dispatchHook: dispatch,
        ButtonMsgLable: "Page ",
        deleteName:"Name",
        userPageAccessState: userPageAccessState,
        editActionFun: editHPagesID,
        deleteActionFun: deleteHpagesUsingID
    })
  
  ];

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Page List| FoodERP-React FrontEnd</title>
          </MetaTags>
          <PaginationProvider pagination={paginationFactory(pageOptions)}>
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                data={HPageListData}
                columns={HPageListColoumns}
                search
              >
                {(toolkitProps) => (
                  <React.Fragment>
                    <Breadcrumbs
                      title={"Count :"}
                      breadcrumbItem={"Page List"}
                      IsButtonVissible={true}
                      SearchProps={toolkitProps.searchProps}
                      IsSearchVissible={true}
                      breadcrumbCount={`Page Count: ${HPageListData.length}`}
                      // RedirctPath={ `/${btoa("PageMaster")}`}
                      RedirctPath={`/PageMaster`}
                      isExcelButtonVisible={true}
                      ExcelData={HPageListData}
                    />
                    <Row>
                      <Col xl="12">
                        <div className="table-responsive">
                          <BootstrapTable
                            keyField={"id"}
                            responsive
                            bordered={false}
                            striped={false}
                            defaultSorted={defaultSorted}
                            // selectRow={selectRow}
                            classes={"table  table-bordered"}
                            {...toolkitProps.baseProps}
                            {...paginationTableProps}
                          />
                        </div>
                      </Col>
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
        </div>

        <Modal
          isOpen={modal_center}
          toggle={() => {
            tog_center();
          }}
          size="xl"
        >
          <HPageMaster state={editData.Data} relatatedPage={"/PageMaster"} pageMode={editData.pageMode}/>

        </Modal>

      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
}


