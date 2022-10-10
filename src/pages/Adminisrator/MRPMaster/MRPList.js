import React, { useEffect, useState } from "react";

import Breadcrumb from "../../../components/Common/Breadcrumb"
import { Button, Col, Modal, Row } from "reactstrap";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import { AlertState } from "../../../store/actions";
import "../../../assets/scss/CustomeTable/datatables.scss";
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import {
  delete_MRPList,
  delete_MRPListSuccess,
  editMRPList,
  getMRPListPage,
  postMRPMasterDataSuccess,
  updateMRPListSuccess
} from "../../../store/Administrator/MRPMasterRedux/action";
import MRPMaster from "./MRPMaster"
const MRPList = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);

  // get Access redux data
  const { TableListData, editData, updateMessage, deleteMessage, RoleAccessModifiedinSingleArray, PostAPIResponse } = useSelector(
    (state) => ({
      TableListData: state.MRPMasterReducer.MRPList,
      editData: state.MRPMasterReducer.editData,
      updateMessage: state.MRPMasterReducer.updateMessage,
      deleteMessage: state.MRPMasterReducer.deleteMsg,
      RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
      PostAPIResponse: state.MRPMasterReducer.PostData,
    })
  );

  useEffect(() => {
    const locationPath = history.location.pathname
    let userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }
  }, [RoleAccessModifiedinSingleArray])

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(getMRPListPage());
  }, []);

  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {

    if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
      dispatch(updateMRPListSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMessage.Message,
          AfterResponseAction: getMRPListPage,
        })
      );
      tog_center();
    } else if (updateMessage.Status === true) {
      dispatch(updateMRPListSuccess({ Status: false }));
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
      dispatch(delete_MRPListSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMessage.Message,
          AfterResponseAction: getMRPListPage,
        })
      );
    } else if (deleteMessage.Status === true) {
      dispatch(delete_MRPListSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteMessage.Message),
        })
      );
    }
  }, [deleteMessage]);

  useEffect(() => {

    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
      dispatch(postMRPMasterDataSuccess({ Status: false }))
      tog_center();
      dispatch(getMRPListPage());
      dispatch(AlertState({
        Type: 1,
        Status: true,
        Message: PostAPIResponse.Message,
      }))
    }

    else if ((PostAPIResponse.Status === true)) {
      dispatch(postMRPMasterDataSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(PostAPIResponse.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [PostAPIResponse.Status])

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
        Message: `Are you sure you want to delete this MRP List : "${name}"`,
        RedirectPath: false,
        PermissionAction: delete_MRPList,
        ID: id,
      })
    );
  };

  // edit Buutton Handller
  const EditPageHandler = (id) => {
    dispatch(editMRPList(id));
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
      text: "EffectiveDate",
      dataField: "EffectiveDate",
      sort: true,
    },

    // {
    //     text: "CompanyName",
    //     dataField: "CompanyName",
    //     sort: true,
    //   },

    {
      text: "DivisionName",
      dataField: "DivisionName",
      sort: true,
    },

    {
      text: "PartyName",
      dataField: "PartyName",
      sort: true,
    },



    {
      text: "Action",
      hidden: (
        !(userPageAccessState.RoleAccess_IsEdit)
        && !(userPageAccessState.RoleAccess_IsView)
        && !(userPageAccessState.RoleAccess_IsDelete)) ? true : false,

      formatter: (cellContent, Role) => (
        <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
          {((userPageAccessState.RoleAccess_IsEdit)) ?
            <Button
              type="button"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit MRP List"
              onClick={() => { EditPageHandler(Role.id); }}
              className="badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
            </Button> : null}

          {(!(userPageAccessState.RoleAccess_IsEdit) && (userPageAccessState.RoleAccess_IsView)) ?
            <Button
              type="button"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="View MRP List"
              onClick={() => { EditPageHandler(Role.id); }}
              className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"

            >
              <i className="bx bxs-show font-size-18 "></i>
            </Button> : null}

          {(userPageAccessState.RoleAccess_IsDelete)
            ?
            <Button
              className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete MRP List"
              onClick={() => { deleteHandeler(Role.id, Role.Name); }}
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
            <title>MRP List| FoodERP-React FrontEnd</title>
          </MetaTags>
          <div className="container-fluid">
            <PaginationProvider
              pagination={paginationFactory(pageOptions)}
            >
              {({ paginationProps, paginationTableProps }) => (
                <ToolkitProvider
                  keyField='id'
                  columns={pagesListColumns}
                  data={TableListData}
                  search
                >
                  {toolkitProps => (
                    <React.Fragment>
                      <Breadcrumb
                        title={"Count :"}
                        breadcrumbItem={userPageAccessState.PageHeading}
                        IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                        SearchProps={toolkitProps.searchProps}
                        breadcrumbCount={`MRP Count: ${TableListData.length}`}
                        IsSearchVissible={true}
                        isExcelButtonVisible={true}
                        ExcelData={TableListData}
                        RedirctPath={"/MRPMaster"}
                      />


                      <Row>
                        <Col xl="12">
                          <div className="table-responsive">
                            <BootstrapTable
                              keyField={"id"}
                              responsive
                              bordered={true}
                              striped={false}
                              // cellEdit={cellEditFactory({ mode: 'dbclick' ,blurToSave: true})}
                              // defaultSorted={commonDefaultSorted("Name")}
                              classes={"table align-middle table-nowrap table-hover"}
                              headerWrapperClasses={"thead-light"}
                              {...toolkitProps.baseProps}
                              {...paginationTableProps}
                            />

                          </div>
                        </Col>
                      </Row>

                      <Row className="align-items-md-center mt-30">
                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                          <PaginationListStandalone
                            {...paginationProps}
                          />
                        </Col>
                      </Row>
                    </React.Fragment>
                  )
                  }
                </ToolkitProvider>
              )
              }

            </PaginationProvider>
            <Modal
              isOpen={modal_center}
              toggle={() => { tog_center() }}
              size="xl"
            >
              {/* <PartyUIDemo state={editData.Data} /> */}
              <MRPMaster editValue={editData.Data} masterPath={"/MRPMaster"} pageMode={editData.pageMode} />
            </Modal>

          </div>
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

export default MRPList;


