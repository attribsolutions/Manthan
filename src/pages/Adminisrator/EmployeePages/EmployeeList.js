import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Modal, Col, Row, Button } from "reactstrap";
// import { useAlert } from "react-alert";
import "../../../assets/scss/CustomeTable/datatables.scss";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { SpinnerON } from "../../../store/Utilites/Spinner/actions";
import {
  getEmployeelist,
  editEmployeeeId,
  deleteEmployeeIDSuccess,
  updateEmployeeIDSuccess,
  delete_Employee_ID,
} from "../../../store/Administrator/M_EmployeeRedux/action";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import AddEmployee from "./EmployeeMaster";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";

const Employee_List = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);


  // get Access redux data
  const { TableListData, editData, updateMessage, deleteMessage } = useSelector(
    (state) => ({
      TableListData: state.M_EmployeesReducer.employeeList,
      editData: state.M_EmployeesReducer.editData,
      updateMessage: state.M_EmployeesReducer.updateMessage,
      deleteMessage: state.M_EmployeesReducer.deleteMessage,
    })
  );
  console.log("editData", editData);

  useEffect(() => {
    const userAcc = CommonGetRoleAccessFunction(history)
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }
  }, [history])

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(getEmployeelist());
  }, []);

  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {
    if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
      dispatch(updateEmployeeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMessage.Message,
          AfterResponseAction: getEmployeelist,
        })
      );
      tog_center();
    } else if (updateMessage.Status === true) {
      dispatch(updateEmployeeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMessage.Message),
        })
      );
    }
  }, [updateMessage.Status, dispatch]);

  useEffect(() => {
    if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
      dispatch(deleteEmployeeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMessage.Message,
          AfterResponseAction: getEmployeelist,
        })
      );
    } else if (deleteMessage.Status === true) {
      dispatch(deleteEmployeeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteMessage.Message),
        })
      );
    }
  }, [deleteMessage.Status]);

  //Delete Button Handller
  const deleteHandeler = (id, name) => {
    dispatch(
      AlertState({
        Type: 5,
        Status: true,
        Message: `Are you sure you want to delete this Employee : "${name}"`,
        RedirectPath: false,
        PermissionAction: delete_Employee_ID,
        ID: id,
      })
    );
  };

  // Edit Modal Show When Edit Data is true
  useEffect(() => {
    if (editData.Status === true) {
      tog_center();
    }
  }, [editData]);

  // tag_center -- Control the Edit Modal show and close
  function tog_center() {
    setmodal_center(!modal_center);
  }

  // Edit Button Handler
  const EditPageHandler = (id) => {
    dispatch(editEmployeeeId(id));
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

  // Employee List component table columns
  const pagesListColumns = [
    {
      text: "PageID",
      dataField: "ID",
      sort: true,
      hidden: true,
    },

    {
      text: "Employee Name",
      dataField: "Name",
      sort: true,
    },

    {
      text: "Address",
      dataField: "Address",
      sort: true,
    },

    {
      text: "Mobile",
      dataField: "Mobile",
      sort: true,
    },
    {
      text: "Email",
      dataField: "email",
      sort: true,
    },

    {
      text: "Action",
      hidden: (
        !(userPageAccessState.RoleAccess_IsEdit)
        && !(userPageAccessState.RoleAccess_IsView)
        && !(userPageAccessState.RoleAccess_IsDelete)) ? true : false,

      formatter: (cellContent, TableListData) => (
        <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
          {(userPageAccessState.RoleAccess_IsEdit) && (userPageAccessState.RoleAccess_IsView) || (userPageAccessState.RoleAccess_IsEdit) ?
            <Button
              type="button"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit Employee"
              onClick={() => { EditPageHandler(TableListData.id); }}
              className="badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
            </Button> : null}

          {(!(userPageAccessState.RoleAccess_IsEdit) && (userPageAccessState.RoleAccess_IsView)) ?
            <Button
              type="button"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="View Employee"
              onClick={() => { EditPageHandler(TableListData.id); }}
              className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"

            >
              <i className="bx bxs-show font-size-18 "></i>
            </Button> : null}

          {(userPageAccessState.RoleAccess_IsDelete)
            ?
            <buton
              className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Employee"
              onClick={() => { deleteHandeler(TableListData.id, TableListData.Name); }}
            >
              <i className="mdi mdi-delete font-size-18"></i>
            </buton>
            : null
          }

        </div>
      ),
    },
  ];
  //tag_center -- Control the Edit Modal show and close
  function tog_center() {
    setmodal_center(!modal_center)
  }
  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>Employee List| FoodERP-React FrontEnd</title>
        </MetaTags>
        <div className="page-content">
          <PaginationProvider pagination={paginationFactory(pageOptions)}>
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                data={TableListData}
                columns={pagesListColumns}
                search
              >
                {(toolkitProps) => (
                  <React.Fragment>
                    <Breadcrumbs
                      title={"Count :"}
                      breadcrumbItem={userPageAccessState.PageHeading}
                      IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                      SearchProps={toolkitProps.searchProps}
                      breadcrumbCount={`Employee Count: ${TableListData.length}`}
                      IsSearchVissible={true}
                    // RedirctPath={"/employeeMaster"}
                    />
                    <Row>
                      <Col xl="12">
                        <div className="table-responsive">
                          <BootstrapTable
                            keyField={"id"}
                            responsive
                            bordered={false}
                            defaultSorted={defaultSorted}
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
            <AddEmployee state={editData.Data} />
          </Modal>
        </div>
      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }

}
export default Employee_List;
