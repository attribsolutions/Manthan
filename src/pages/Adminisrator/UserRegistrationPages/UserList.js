import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "reactstrap";
import "../../../assets/scss/CustomeTable/datatables.scss";
import {
  getUser,
  deleteUser,
  editUserId,
  updateSuccess,
} from "../../../store/Administrator/UserRegistrationRedux/actions";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
//redux
import { useSelector, useDispatch } from "react-redux";
import "../../../assets/scss/CustomeTable/datatables.scss";
import AddUser from "./AddUser";
import { deleteSuccess } from "../../../store/Administrator/RoleMasterRedux/action";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { MetaTags } from "react-meta-tags";

const UserList = () => {
  const dispatch = useDispatch();
  const [modal_center, setmodal_center] = useState(false);

  const { pages, editData, updateMessage, deleteMessage } = useSelector(
    (state) => ({
      pages: state.User_Registration_Reducer.pages,
      editData: state.User_Registration_Reducer.editData,
      updateMessage: state.User_Registration_Reducer.updateMessage,
      deleteMessage: state.User_Registration_Reducer.deleteSuccessRole,
    })
  );

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(getUser());
  }, []);

  // This UseEffect => UpadateModal Success/Unsucces Show and Hide Control Alert_modal
  useEffect(() => {
    if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
      dispatch(updateSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMessage.Message,
          AfterResponseAction: getUser,
        })
      );
      tog_center();
    } else if (updateMessage.Status === true) {
      dispatch(updateSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: updateMessage.Message,
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
          AfterResponseAction: getUser,
        })
      );
    } else if (deleteMessage.Status === true) {
      dispatch(deleteSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: "error Message",
        })
      );
    }
  }, [deleteMessage]);

  useEffect(() => {
    if (editData.Status === true) {
      tog_center();
    }
  }, [editData]);

  const EditPageHandler = (id) => {
    dispatch(editUserId(id));
  };

  function tog_center() {
    setmodal_center(!modal_center);
  }
  //Delete Button Handller
  const deleteHandeler = (id, name) => {
    dispatch(
      AlertState({
        Type: 5,
        Status: true,
        Message: `Are you sure you want to delete this User : "${name}"`,
        RedirectPath: false,
        PermissionAction: deleteUser,
        ID: id,
      })
    );
  };
  
  const defaultSorted = [
    {
      dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
      order: "asc", // desc or asc
    },
  ];


  const pageOptions = {
    sizePerPage: 15,
    totalSize: pages.length,
    custom: true,
  };

  const pagesListColumns = [
    {
      text: "PageID",
      dataField: "ID",
      sort: true,
      hidden: true,
      formatter: (cellContent, user) => <>{user.ID}</>,
    },
    {
      text: "LoginName",
      dataField: "LoginName",
      sort: true,
      formatter: (cellContent, user) => <>{user.LoginName}</>,
    },
    {
      text: "Employee",
      dataField: "Employee",
      sort: true,
      formatter: (cellContent, user) => <>{user.Employee}</>,
    },
    {
      text: "Active",
      dataField: "isActive",
      sort: true,
      formatter: (cellContent, user) => (
        <>{user.isActive ? "true " : " false"}</>
      ),
    },
    
    {
      text: "Actions ",

      formatter: (cellContent, user) => (
        <>
          <div
            class="d-flex gap-3"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <buton
              type="button"
              data-mdb-toggle="tooltip"
              data-mdb-placement="top"
              title="Edit User"
              onClick={() => {
                EditPageHandler(user.id);
              }}
              className="badge badge-soft-primary font-size-12"
            >
              <i class="mdi mdi-pencil font-size-18" id="edittooltip"></i>
            </buton>{" "}
            <buton
              className="badge badge-soft-danger font-size-12"
              data-mdb-toggle="tooltip"
              data-mdb-placement="top"
              title="Delete User"
              onClick={() => {
                deleteHandeler(user.id, user.LoginName);
              }}
            >
              <i class="mdi mdi-delete font-size-18"></i>
            </buton>
          </div>
        </>
      ),
    },
  ];

  return (
    <React.Fragment>
      <MetaTags>
        <title>User List| FoodERP-React FrontEnd</title>
      </MetaTags>
      <div className="page-content">
        <PaginationProvider pagination={paginationFactory(pageOptions)}>
          {({ paginationProps, paginationTableProps }) => (
            <ToolkitProvider
              keyField="id"
              data={pages}
              defaultSorted={defaultSorted}
              columns={pagesListColumns}
            //   bootstrap4
              search
            >
              {(toolkitProps) => (
                <React.Fragment>
                  <Breadcrumbs
                    title={"Count :"}
                    breadcrumbItem={"User Registration List"}
                    IsButtonVissible={true}
                    a={toolkitProps.searchProps}
                    breadcrumbCount={`Users Count: ${pages.length}`}
                    RedirctPath={"/userMaster"}
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
          <AddUser state={editData.Data} />
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default UserList;
