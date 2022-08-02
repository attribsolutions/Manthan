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
import Breadcrumb from "../../../components/Common/Breadcrumb"
import "../../../assets/scss/CustomeTable/datatables.scss"
import { useDispatch, useSelector } from "react-redux";
import {
    deleteModuleID, deleteModuleIDSuccess, editModuleID, fetchModelsList,
    updateModuleIDSuccess
} from "../../../store/actions";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import Modules from "./Modules";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";

const ModulesList = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [modal_center, setmodal_center] = useState(false);

    // get Access redux data
    const { TableListData, editData, deleteAPIResponse, updateAPIResponse } = useSelector((state) => ({
        TableListData: state.Modules.modulesList,
        updateAPIResponse: state.Modules.updateMessage,
        editData: state.Modules.editData,
        deleteAPIResponse: state.Modules.deleteModuleIDSuccess,
    }));

    useEffect(() => {
        const userAcc = CommonGetRoleAccessFunction(history)
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [history])

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(fetchModelsList());
    }, []);

    // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal 
    useEffect(() => {
        if ((updateAPIResponse.Status === true) && (updateAPIResponse.StatusCode === 200)) {
            dispatch(updateModuleIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: updateAPIResponse.Message,
                AfterResponseAction: fetchModelsList,
            }))
            tog_center()
        } else if (updateAPIResponse.Status === true) {
            dispatch(updateModuleIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: updateAPIResponse.Message,
            }));
        }
    }, [updateAPIResponse, dispatch]);

    // This UseEffect => delete Module Success/Unsucces  Show and Hide Control Alert_modal.
    useEffect(() => {
        if ((deleteAPIResponse.Status === true) && (deleteAPIResponse.StatusCode === 200)) {
            dispatch(deleteModuleIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: deleteAPIResponse.Message,
                AfterResponseAction: fetchModelsList,
            }))
        } else if (deleteAPIResponse.Status === true) {
            dispatch(deleteModuleIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3,
                Status: true,
                Message: deleteAPIResponse.Message,
            }));
        }
    }, [deleteAPIResponse])

    // This UseEffect => Edit Modal Show When Edit Data is true
    useEffect(() => {
        if (editData.Status === true) {
            tog_center()
        }
    }, [editData]);

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
    const TableColumns = [
        {
            dataField: 'Name',
            text: 'Name',
            sort: true
        }, {
            dataField: 'DisplayIndex',
            text: 'Display Index',
            sort: true
        }, {
            dataField: 'isActive',
            text: 'IsActive',
            sort: true
        },
        {
            text: "Action",
            dataField: "pdf",
            hidden: (
                !(userPageAccessState.RoleAccess_IsEdit)
                && !(userPageAccessState.RoleAccess_IsView)
                && !(userPageAccessState.RoleAccess_IsDelete)) ? true : false,

            formatter: (cellContent, module) => (
                <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
                    {(userPageAccessState.RoleAccess_IsEdit)
                        ?
                        <buton
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit Module"
                            onClick={() => { EditPageHandler(module.id); }}
                            className="badge badge-soft-success font-size-12"
                        >
                            <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                        </buton>
                        : null
                    }
                    {(userPageAccessState.RoleAccess_IsView)
                        ?
                        <buton
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="View Module"
                            onClick={() => { EditPageHandler(module.id); }}
                            className="badge badge-soft-primary font-size-12"
                        >
                            <i className="bx bxs-show font-size-18 "></i>
                        </buton>
                        : null
                    }
                    {(userPageAccessState.RoleAccess_IsDelete)
                        ?
                        <buton
                            className="badge badge-soft-danger font-size-12"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Module"
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

    const defaultSorted = [{
        dataField: 'Name',
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
    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Modules List| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <div className="container-fluid">
                        <PaginationProvider
                            pagination={paginationFactory(pageOptions)}

                        >
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField='id'
                                    columns={TableColumns}
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
                                                breadcrumbCount={`Module Count: ${TableListData.length}`}
                                                IsSearchVissible={true}
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
                        <Modal
                            isOpen={modal_center}
                            toggle={() => { tog_center() }}
                            size="xl"
                        >
                            {/* <PartyUIDemo state={editData.Data} /> */}
                            <Modules state={editData.Data} />
                        </Modal>
                    </div>
                </div>
            </React.Fragment>
        )
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }

}

export default ModulesList
