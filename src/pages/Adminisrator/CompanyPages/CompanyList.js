import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import {
    Button,
    Col,
    Modal,
    Row,
} from "reactstrap";
import { deleteCompany_ID, editCompanyID, fetchCompanyList, updateCompanyIDSuccess, deleteCompanyIDSuccess, editCompanyIDSuccess } from "../../../store/Administrator/CompanyRedux/actions";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//redux
import { useSelector, useDispatch } from "react-redux";
import CompanyModule from "./CompanyModule";
import "../../../assets/scss/CustomeTable/datatables.scss"
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";

const CompanyList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [modal_center, setmodal_center] = useState(false);

    // get Access redux data
    const { TableListData, editData, updateMessage, deleteCompanyID, } = useSelector((state) => ({
        TableListData: state.Company.companyList,
        editData: state.Company.editData,
        updateMessage: state.Company.updateMessage,
        deleteCompanyID: state.Company.deleteCompanyID,
    }));

    useEffect(() => {
        const userAcc = CommonGetRoleAccessFunction(history)
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [history])

    // tag_center -- Control the Edit Modal show and close
    function tog_center() {
        setmodal_center(!modal_center)
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(fetchCompanyList());
    }, []);

    // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal 
    useEffect(() => {
        if ((updateMessage.Status === true) && (updateMessage.StatusCode === 200)) {
            dispatch(updateCompanyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: updateMessage.Message,
                AfterResponseAction: fetchCompanyList,
            }))
            tog_center()
        }
        else if (updateMessage.Status === true) {
            dispatch(updateCompanyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: JSON.stringify(updateMessage.Message),
            }));
        }
    }, [updateMessage.Status, dispatch]);

    useEffect(() => {
        if ((deleteCompanyID.Status === true) && (deleteCompanyID.StatusCode === 200)) {
            dispatch(deleteCompanyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: deleteCompanyID.Message,
                AfterResponseAction: fetchCompanyList,
            }))
        } else if (deleteCompanyID.Status === true) {
            dispatch(deleteCompanyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3,
                Status: true,
                Message: JSON.stringify(deleteCompanyID.Message),
            }));
        }
    }, [deleteCompanyID.Status])

    // Edit Modal Show When Edit Data is true
    useEffect(() => {
        if (editData.Status === true) {
            tog_center()
        }
    }, [editData]);

    // Edit button Handller
    const EditPageHandler = (id) => {
        dispatch(editCompanyID(id));
    }

    //Delete Button Handller
    const deleteHandeler = (id, name) => {
        dispatch(AlertState({
            Type: 5, Status: true,
            Message: `Are you sure you want to delete this Company : "${name}"`,
            RedirectPath: false,
            PermissionAction: deleteCompany_ID,
            ID: id
        }));
    }

    const pageOptions = {
        sizePerPage: 10,
        totalSize: TableListData.length, // replace later with size(users),
        custom: true,
    };
    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pagesListColumns = [
        {
            text: "Name",
            dataField: "Name",
            sort: true,
        },
        {
            text: "Address",
            dataField: "Address",
            sort: true,
        },
        {
            text: "GSTIN",
            dataField: "GSTIN",
            sort: true,
        },
        {
            text: "Phone No",
            dataField: "PhoneNo",
            sort: true,
        },
        {
            text: "Company Abbreviation",
            dataField: "CompanyAbbreviation",
            sort: true,
        },
        {
            text: "Email",
            dataField: "EmailID",
            sort: true,
        },
        {
            text: "Action",
            hidden: (
                !(userPageAccessState.RoleAccess_IsEdit)
                && !(userPageAccessState.RoleAccess_IsView)
                && !(userPageAccessState.RoleAccess_IsDelete)) ? true : false,

            formatter: (cellContent, module) => (
                <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >

                    {(userPageAccessState.RoleAccess_IsEdit) || (userPageAccessState.RoleAccess_IsView) ?
                    <Button
                    type="button"
                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit Company"
                    onClick={() => { EditPageHandler(module.id); }}
                    className="badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
                >
                    <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                </Button>: null }

                 {!(userPageAccessState.RoleAccess_IsEdit) && (userPageAccessState.RoleAccess_IsView) ?
                    <Button
                    type="button"
                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="View Company"
                    onClick={() => { EditPageHandler(module.id); }}
                    className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
                >
                    <i className="bx bxs-show font-size-18 "></i>
                </Button>: null } 
                    {/* {(userPageAccessState.RoleAccess_IsEdit)
                        ?
                        <buton
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit Company"
                            onClick={() => { EditPageHandler(module.id); }}
                            className="badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
                        >
                            <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                        </buton>
                        : null
                    }
                    {(userPageAccessState.RoleAccess_IsView)
                        ?
                        <buton
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="View Company"
                            onClick={() => { EditPageHandler(module.id); }}
                            className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
                        >
                            <i className="bx bxs-show font-size-18 "></i>
                        </buton>
                        : null
                    } */}
                    {(userPageAccessState.RoleAccess_IsDelete)
                        ?
                        <buton
                            className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Company"
                            onClick={() => { deleteHandeler(module.id, module.Name); }}
                        >
                            <i className="mdi mdi-delete font-size-18"></i>
                        </buton>
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
                        <title>Company List| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                    >
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                data={TableListData}
                                columns={pagesListColumns}
                                search
                            >
                                {toolkitProps => (
                                    <React.Fragment>
                                        {/* <Breadcrumbs
                                            title={"Count :"}
                                            breadcrumbItem={userPageAccessState.PageHeading}
                                            IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                                            SearchProps={toolkitProps.searchProps}
                                            breadcrumbCount={`Company Count: ${TableListData.length}`}
                                            RedirctPath={"/CompanyMaster"}
                                        /> */}
                                          <Breadcrumbs
                                            title={"Count :"}
                                            breadcrumbItem={userPageAccessState.PageHeading}
                                            IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                                            SearchProps={toolkitProps.searchProps}
                                            IsSearchVissible={true}
                                            defaultSorted={defaultSorted}
                                            breadcrumbCount={`User Count: ${TableListData.length}`}
                                            RedirctPath={"/UserMaster"}
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
                                                        classes={"table  table-bordered"}
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
                                )}
                            </ToolkitProvider>
                        )}
                    </PaginationProvider>
                </div >
                <Modal
                    isOpen={modal_center}
                    toggle={() => { tog_center() }}
                    size="xl"
                >
                    <CompanyModule state={editData.Data} />
                </Modal>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }

}

export default CompanyList;




