import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import { AlertState } from "../../../store/actions";
import "../../../assets/scss/CustomTable2/datatables.scss";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import {
  delete_MRPList,
  delete_MRPListSuccess,
  getMRPListPage,
} from "../../../store/Administrator/MRPMasterRedux/action";
import { countlabelFunc } from "../../../components/Common/CommonMasterListPage"
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import * as url from "../../../routes/route_url"
import { breadcrumbReturnFunc, metaTagLabel } from "../../../components/Common/CommonFunction";

const MRPList = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()
  const [userAccState, setUserAccState] = useState('');


  // get Access redux data
  const {
    tableList,
    deleteMsg,
    userAccess, } = useSelector(
      (state) => ({
        tableList: state.MRPMasterReducer.MRPList,
        deleteMsg: state.MRPMasterReducer.deleteMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        postMsg: state.MRPMasterReducer.postMsg,
        pageField: state.CommonPageFieldReducer.pageFieldList
      })
    );

  useEffect(() => {
    const locationPath = history.location.pathname
    let userAcc = userAccess.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })
    if (!(userAcc === undefined)) {
      setUserAccState(userAcc);
      breadcrumbReturnFunc({ dispatch, userAcc, newBtnPath: url.MRP });
    }
  }, [userAccess])

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(getMRPListPage());
  }, []);

  useEffect(() => {
    if ((deleteMsg.Status === true) && (deleteMsg.StatusCode === 200)) {
      dispatch(delete_MRPListSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMsg.Message,
          AfterResponseAction: getMRPListPage,
        })
      );
    } else if (deleteMsg.Status === true) {
      dispatch(delete_MRPListSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteMsg.Message),
        })
      );
    }
  }, [deleteMsg.Status]);

  //select id for delete row
  const deleteHandeler = (CommonID) => {
    dispatch(
      AlertState({
        Type: 5,
        Status: true,
        Message: `Are you sure you want to delete this MRP List `,
        RedirectPath: false,
        PermissionAction: delete_MRPList,
        ID: CommonID,
      })
    );
  };

  const EditPageHandler = (rowData) => {
    let RelatedPageID = userAccState.RelatedPageID

    const found = userAccess.find((element) => {
      return element.id === RelatedPageID
    })

    if (!(found === undefined)) {
      history.push({
        pathname: `/${found.ActualPagePath}`,
        editValue: rowData,
        pageMode: 'edit'
      })
    }
  }

  const pageOptions = {
    sizePerPage: 10,
    totalSize: tableList.length,
    custom: true,
  };

  const pagesListColumns = [
    {
      text: "EffectiveDate",
      dataField: "EffectiveDate",
      sort: true,
    },
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
        !(userAccState.RoleAccess_IsEdit)
        && !(userAccState.RoleAccess_IsView)
        && !(userAccState.RoleAccess_IsDelete)) ? true : false,

      formatter: (cellContent, Role) => (
        <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
          {((userAccState.RoleAccess_IsEdit) && (Role.CommonID > 0)) ?
            <Button
              type="button"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit Effective Date"
              onClick={() => { EditPageHandler(Role); }}
              className="badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
            </Button>
            :
            null}

          {(!(userAccState.RoleAccess_IsEdit) && (Role.CommonID > 0) && (userAccState.RoleAccess_IsView)) ?
            <Button
              type="button"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="View Effective Date"
              onClick={() => { EditPageHandler(Role); }}
              className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"

            >
              <i className="bx bxs-show font-size-18 "></i>
            </Button> : null}

          {((userAccState.RoleAccess_IsDelete) && (Role.CommonID > 0))
            ?
            <Button
              className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Effective Date"
              onClick={() => { deleteHandeler(Role.CommonID) }}
            >
              <i className="mdi mdi-delete font-size-18"></i>
            </Button>
            : null
          }
        </div>
      ),
    },
  ];

  if (!(userAccState === '')) {
    return (
      <React.Fragment>
        <div className="page-content">
        <MetaTags>{metaTagLabel(userAccess)}</MetaTags>
  
          <PaginationProvider
            pagination={paginationFactory(pageOptions)}
          >
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField='id'
                columns={pagesListColumns}
                data={tableList}
                search
              >
                {toolkitProps => (
                  <React.Fragment>
                    <div className="table-responsive">
                      <BootstrapTable
                        keyField={"id"}
                        responsive
                        bordered={true}
                        striped={false}
                        noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                        classes={"table align-middle table-nowrap table-hover"}
                        headerWrapperClasses={"thead-light"}

                        {...toolkitProps.baseProps}
                        {...paginationTableProps}
                      />
                      {countlabelFunc(toolkitProps, paginationProps, dispatch, "MRP")}
                      {mySearchProps(toolkitProps.searchProps)}
                    </div>

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


