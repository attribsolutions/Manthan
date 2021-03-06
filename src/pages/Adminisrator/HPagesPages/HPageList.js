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
import HPageMaster from "./HPageMaster";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";

export default function HPageList() {

  const dispatch = useDispatch();
  const history = useHistory()

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);

  // var HPageListData = [];
  const { HPageListData, editData, updateMessage, deleteModuleID } =
    useSelector((state) => ({
      HPageListData: state.H_Pages.HPagesListData,
      editData: state.H_Pages.editData,
      updateMessage: state.H_Pages.updateMessage,
      deleteModuleID: state.H_Pages.deleteModuleID,
    }));

  useEffect(() => {
    const userAcc = CommonGetRoleAccessFunction(history)
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }
  }, [history])

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

  const EditPageHandler = (id) => {
    dispatch(editHPagesID(id));
  };

  const deleteHandeler = (id, name) => {
    dispatch(
      AlertState({
        Type: 5,
        Status: true,
        Message: `Are you sure you want to delete this Page : "${name}"`,
        RedirectPath: false,
        PermissionAction: deleteHpagesUsingID,
        ID: id,
      })
    );
  };
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
    {
      text: "Action",
      hidden: (
        !(userPageAccessState.RoleAccess_IsEdit)
        && !(userPageAccessState.RoleAccess_IsView)
        && !(userPageAccessState.RoleAccess_IsDelete)) ? true : false,

      formatter: (cellContent, Pages) => (
        <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
          {((userPageAccessState.RoleAccess_IsEdit)) ?
            <Button
              type="button"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit Page"
              onClick={() => { EditPageHandler(Pages.id); }}
              className="badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
            </Button> : null}

          {(!(userPageAccessState.RoleAccess_IsEdit) && (userPageAccessState.RoleAccess_IsView)) ?
            <Button
              type="button"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="View Pages"
              onClick={() => { EditPageHandler(Pages.id); }}
              className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"

            >
              <i className="bx bxs-show font-size-18 "></i>
            </Button> : null}

          {(userPageAccessState.RoleAccess_IsDelete)
            ?
            <Button
              className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Page"
              onClick={() => { deleteHandeler(Pages.id, Pages.Name); }}
            >
              <i className="mdi mdi-delete font-size-18"></i>
            </Button>
            : null
          }

        </div>
      ),
    },
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
          <HPageMaster state={editData.Data} />
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


