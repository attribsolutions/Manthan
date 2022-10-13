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
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import {
    deleteGSTListPage,
    deleteGSTListPageSuccess,
    getGSTListPage
} from "../../../store/Administrator/GSTRedux/action";

const GSTList = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [userPageAccessState, setUserPageAccessState] = useState('');
    console.log("userPageAccessState", userPageAccessState)

    // get Access redux data
    const {
        tableList,
        deleteMsg,
        userAccess, } = useSelector(
            (state) => ({
                tableList: state.GSTReducer.GSTList,
                deleteMsg: state.GSTReducer.deleteMsgForListPage,
                userAccess: state.Login.RoleAccessUpdateData,
                pageField: state.CommonPageFieldReducer.pageFieldList
            })
        );

    useEffect(() => {
        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [userAccess])

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(getGSTListPage());
    }, []);

    useEffect(() => {
        debugger
        if ((deleteMsg.Status === true) && (deleteMsg.StatusCode === 200)) {
            dispatch(deleteGSTListPageSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 1,
                    Status: true,
                    Message: deleteMsg.Message,
                    // AfterResponseAction: getGSTListPage,
                })
            );
        } else if (deleteMsg.Status === true) {
            dispatch(deleteGSTListPageSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(deleteMsg.Message),
                })
            );
        }
    }, [deleteMsg]);

    //select id for delete row
    const deleteHandeler = (CommonID) => {
        debugger
        dispatch(
            AlertState({
                Type: 5,
                Status: true,
                Message: `Are you sure you want to delete this MRP List `,
                RedirectPath: false,
                PermissionAction: deleteGSTListPage,
                ID: CommonID,
            })
        );
    };

    const EditPageHandler = (rowData) => {
        let RelatedPageID = userPageAccessState.RelatedPageID

        const found = userAccess.find((element) => {
            return element.id === RelatedPageID
        })

        if (!(found === undefined)) {
            history.push({
                pathname: `/${found.ActualPagePath}`,
                editValue: rowData,
                pageMode:'edit'
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
            text: "GST Percentage",
            dataField: "GSTPercentage",
            sort: true,
        },
        {
            text: "HSNCode",
            dataField: "HSNCode",
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
                    {((userPageAccessState.RoleAccess_IsEdit) && (Role.CommonID > 0)) ?
                        <Button
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit MRP List"
                            onClick={() => { EditPageHandler(Role); }}
                            className="badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
                        >
                            <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                        </Button>
                        :
                        null}

                    {(!(userPageAccessState.RoleAccess_IsEdit) && (Role.CommonID > 0) && (userPageAccessState.RoleAccess_IsView)) ?
                        <Button
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="View MRP List"
                            onClick={() => { EditPageHandler(Role); }}
                            className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"

                        >
                            <i className="bx bxs-show font-size-18 "></i>
                        </Button> : null}

                    {((userPageAccessState.RoleAccess_IsDelete) && (Role.CommonID > 0))
                        ?
                        <Button
                            className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete MRP List"
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
                                    data={tableList}
                                    search
                                >
                                    {toolkitProps => (
                                        <React.Fragment>
                                            <Breadcrumb
                                                title={"Count :"}
                                                breadcrumbItem={userPageAccessState.PageHeading}
                                                IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                                                SearchProps={toolkitProps.searchProps}
                                                breadcrumbCount={`GST Count: ${tableList.length}`}
                                                IsSearchVissible={true}
                                                isExcelButtonVisible={true}
                                                ExcelData={tableList}
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

export default GSTList;


