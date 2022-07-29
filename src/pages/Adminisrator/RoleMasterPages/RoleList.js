import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Col, Modal, Row } from "reactstrap";
import {
  getRole,
  deleteRole,
  editRoleId,
  updateSuccess,
  deleteSuccess,
} from "../../../store/Administrator/RoleMasterRedux/action";

import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import "../../../assets/scss/CustomeTable/datatables.scss";
import RoleMaster from "./RoleMaster";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";

const RoleList = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()
  const userAccessGetingfromHistory = history.location.state;

  const initialUserPageAccess = {
    PageHeading: "",
    PageDescription: "",
    PageDescriptionDetails: "",
    PageAccess_IsDelete: true,
    PageAccess_IsView: true,
    PageAccess_IsEdit: true,
  }
  const [userPageAccess, setUserPageAccess] = useState(initialUserPageAccess);
  const [modal_center, setmodal_center] = useState(false);

  // get Access redux data
  const { TableListData, editData, updateMessage, deleteMessage } = useSelector(
    (state) => ({
      TableListData: state.RoleMaster_Reducer.pages,
      editData: state.RoleMaster_Reducer.editData,
      updateMessage: state.RoleMaster_Reducer.updateMessage,
      deleteMessage: state.RoleMaster_Reducer.deleteMessage,
    })
  );

  useEffect(() => {

    if ((userAccessGetingfromHistory === undefined)) {
      // history.push("/Dashboard")
    }
    else {
      if (!(userAccessGetingfromHistory.fromDashboardAccess)) {
        // history.push("/Dashboard")
      }
      setUserPageAccess(userAccessGetingfromHistory.UserDetails)
    };
  }, [userAccessGetingfromHistory])

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(getRole());
  }, []);

  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {
    if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
      dispatch(updateSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMessage.Message,
          AfterResponseAction: getRole,
        })
      );
      tog_center();
    } else if (updateMessage.Status === true) {
      dispatch(updateSuccess({ Status: false }));
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
    if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
      dispatch(deleteSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMessage.Message,
          AfterResponseAction: getRole,
        })
      );
    } else if (deleteMessage.Status === true) {
      dispatch(deleteSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteMessage.Message),
        })
      );
    }
  }, [deleteMessage]);

  // Edit Modal Show When Edit Data is true
  useEffect(() => {
    if (editData.Status === true) {
      tog_center();
    }
  }, [editData]);

  function tog_center() {
    setmodal_center(!modal_center);
  }

  //select id for delete row
  const deleteHandeler = (id, name) => {
    dispatch(
      AlertState({
        Type: 5,
        Status: true,
        Message: `Are you sure you want to delete this Role : "${name}"`,
        RedirectPath: false,
        PermissionAction: deleteRole,
        ID: id,
      })
    );
  };
  // edit Buutton Handller
  const EditPageHandler = (id) => {
    dispatch(editRoleId(id));
  };


  const defaultSorted = [
    {
      dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
      order: "asc", // desc or asc
    },
  ];

  const pageOptions = {
    sizePerPage: 10,
    totalSize: TableListData.length,
    custom: true,
  };

  const pagesListColumns = [
    {
      text: "Name",
      dataField: "Name",
      sort: true,
    },
    {
      text: "Description",
      dataField: "Description",
      sort: true,
    },
    {
      text: "Active",
      dataField: "isActive",
      sort: true,
    },
    {
      text: "Dashboard",
      dataField: "Dashboard",
      sort: true,
    },
    {
      text: "Action",
      formatter: (cellContent, Role) => (
        <>
          <div
            className="d-flex gap-3"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {userPageAccess.PageAccess_IsEdit ?
              <buton
                type="button"
                title="Edit Role"
                onClick={() => {
                  EditPageHandler(Role.id);
                }}
                className="badge badge-soft-primary font-size-12"
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
              </buton>
              :
              <></>
            }
            {userPageAccess.PageAccess_IsDelete ?
              <buton
                className="badge badge-soft-danger font-size-12"
                data-mdb-toggle="tooltip"
                data-mdb-placement="top"
                title="Delete Role"
                onClick={() => {
                  deleteHandeler(Role.id, Role.Name);
                }}
              >
                <i className="mdi mdi-delete font-size-18"></i>
              </buton>
              :
              <></>
            }

          </div>
        </>
      ),
    },
  ];

  return (
    <React.Fragment>
      <MetaTags>
        <title>Role List| FoodERP-React FrontEnd</title>
      </MetaTags>
      <div className="page-content">
        <PaginationProvider pagination={paginationFactory(pageOptions)}>
          {({ paginationProps, paginationTableProps }) => (
            <ToolkitProvider
              keyField="id"
              defaultSorted={defaultSorted}
              data={TableListData}
              columns={pagesListColumns}
              search
            >
              {(toolkitProps) => (
                <React.Fragment>
                  <Breadcrumbs
                    title={"Count :"}
                    breadcrumbItem={"Role List "}
                    IsButtonVissible={true}
                    SearchProps={toolkitProps.searchProps}
                    breadcrumbCount={`Role Count: ${TableListData.length}`}
                    RedirctPath={"/RoleMaster"}
                  />
                  <Row>
                    <Col xl="12">
                      <div className="table-responsive">
                        <BootstrapTable
                          keyField={"id"}
                          responsive
                          bordered={false}
                          striped={false}
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
        <Modal
          isOpen={modal_center}
          toggle={() => {
            tog_center();
          }}
          size="xl"
        >
          <RoleMaster state={editData.Data} />
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default RoleList;
