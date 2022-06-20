import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import {
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

const CompanyList = () => {

    const dispatch = useDispatch();
    const [modal_center, setmodal_center] = useState(false);

    // get Access redux data
    const { companyList, editData, updateMessage, deleteCompanyID } = useSelector((state) => ({
        companyList: state.Company.companyList,
        editData: state.Company.editData,
        updateMessage: state.Company.updateMessage,
        deleteCompanyID: state.Company.deleteCompanyID,
    }));
    console.log("editData in useselector", editData)

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
        else if (deleteCompanyID.Status === true) {
            dispatch(deleteCompanyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: deleteCompanyID.Message,
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
                Message: "error Message",
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
            Message: `Are you sure you want to delete this item : "${name}"`,
            RedirectPath: false,
            PermissionAction: deleteCompany_ID,
            ID: id
        }));
    }

    const pageOptions = {
        sizePerPage: 15,
        totalSize: companyList.length, // replace later with size(users),
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
            formatter: (cellContent, module) => (

                <div class="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
                    <buton
                        type="button"
                        onClick={() => { EditPageHandler(module.ID); }}
                        className="badge badge-soft-primary font-size-12"
                    >
                        <i class="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                    </buton>

                    <buton
                        className="badge badge-soft-danger font-size-12"
                        onClick={() => { deleteHandeler(module.ID, module.Name); }}
                    >
                        <i class="mdi mdi-delete font-size-18" ></i>
                    </buton>
                </div>
            ),
        },
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Company List| FoodERP-React FrontEnd</title>
                </MetaTags>
                <PaginationProvider
                    // pagination={paginationFactory(pageOptions)}
                >
                    {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                            keyField="id"
                            data={companyList}
                            columns={pagesListColumns}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <Breadcrumbs
                                        title={"Count :"}
                                        breadcrumbItem={"Company List"}
                                        IsButtonVissible={true}
                                        SearchProps={toolkitProps.searchProps}
                                        breadcrumbCount={companyList.length}
                                        RedirctPath={"/companysMaster"}
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
};

export default CompanyList;



