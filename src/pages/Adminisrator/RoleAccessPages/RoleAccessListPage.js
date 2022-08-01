import React, { useEffect, useState } from "react"
import { Row, Col, Modal } from "reactstrap"
import MetaTags from 'react-meta-tags'

// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
    PaginationProvider, PaginationListStandalone,
} from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

//Import Breadcrumb
import Breadcrumb4 from "../../../components/Common/Breadcrumb4"
import "../../../assets/scss/CustomeTable/datatables.scss"
import { useDispatch, useSelector } from "react-redux";
import {
    deleteModuleID, deleteModuleIDSuccess, editModuleID, fetchModelsList,
    // GetRoleAccessListPage,
    updateModuleIDSuccess
} from "../../../store/actions";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import PartyUIDemo from "../PartyPages/PartyUIDemo";
import { useHistory } from "react-router-dom";

const RoleAccessListPage = () => {

    const dispatch = useDispatch();
    const history = useHistory()

    const { TableListData, } = useSelector((state) => ({
        TableListData: state.RoleAccessReducer.RoleAccessListPageData,

    }));
    
    const userPageAccess = history.location.state
    useEffect(() => {

        if ((userPageAccess === undefined)) {

            // history.push("/Dashboard")
        }
        else {
            if (!(userPageAccess.fromDashboardAccess)) {
                //   history.push("/Dashboard")

            }
            // setPageHeading( userPageAccess.label)
        };
    }, [userPageAccess])

    const [modal_center, setmodal_center] = useState(false);

    // get Access redux data

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        // dispatch(GetRoleAccessListPage());
    }, []);

    // Edit button Handller
    const EditPageHandler = (id) => {
        dispatch(editModuleID(id));
    }

    //Delete Button Handller
    const deleteHandeler = (id, name) => {
        dispatch(AlertState({
            Type: 5, Status: true,
            Message: `Are you sure you want to delete this Module : "${name}"`,
            RedirectPath: false,
            PermissionAction: deleteModuleID,
            ID: id
        }));
    }

    //Modules list component table columns 
    const columns = [
        {
            dataField: 'Role',
            text: 'Role',
            sort: true
        }, {
            dataField: 'Division',
            text: 'Division',
            sort: true
        },
        {
            text: "Action",
            dataField: "pdf",
            formatter: (cellContent, module) => (
                <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
                    <buton
                        type="button"
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit Module"
                        onClick={() => {
                            EditPageHandler(module.id);
                        }}
                        className="badge badge-soft-primary font-size-12"
                    >
                        <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                    </buton>
                    <buton
                        className="badge badge-soft-info font-size-12"
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Module"
                    // onClick={() => {
                    //     deleteHandeler(module.id, module.Name);
                    // }}
                    >
                        <i className="bx bxs-show font-size-20 "></i>
                    </buton>
                </div>
            ),
        },
    ];

    const defaultSorted = [{
        dataField: 'Role',
        order: 'asc'
    }];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: TableListData.length, // replace later with size(customers),
        custom: true,
    }

    // tag_center -- Control the Edit Modal show and close
    function tog_center() {
        setmodal_center(!modal_center)
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>RoleAccess List Page| FoodERP-React FrontEnd</title>
                </MetaTags>
                <div className="container-fluid">
                    <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField='id'
                        columns={columns}
                        data={TableListData}
                    >
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField='id'
                                columns={columns}
                                data={TableListData}
                                search
                            >
                                {toolkitProps => (
                                    <React.Fragment>
                                        <Breadcrumb4
                                            title={"Count :"}
                                            breadcrumbItem={"RoleAccess List Page"}
                                            IsButtonVissible={true}
                                            SearchProps={toolkitProps.searchProps}
                                            breadcrumbCount={`RoleAccess Count: ${TableListData.length}`}
                                        // RedirctPath={"/moduleMaster"}
                                        />
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive">
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        responsive
                                                        bordered={true}
                                                        striped={false}
                                                        defaultSorted={defaultSorted}
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
    )
}

export default RoleAccessListPage
