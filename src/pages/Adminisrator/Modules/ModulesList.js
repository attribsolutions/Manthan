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
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import "../../../assets/scss/CustomeTable/datatables.scss"
import { useDispatch, useSelector } from "react-redux";
import { deleteModuleID, editModuleID, fetchModelsList, updateModuleIDSuccess } from "../../../store/actions";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import Modules from "./Modules";
import { SpinnerON } from "../../../store/Utilites/Spinner/actions";
// import "./styles.css";


const ModulesList = () => {
    const dispatch = useDispatch();
    const [modal_center, setmodal_center] = useState(false);

    // get Access redux data
    const { TableListData, editData, updateMessage } = useSelector((state) => ({
        TableListData: state.Modules.modulesList,
        editData: state.Modules.editData,
        updateMessage: state.Modules.updateMessage,
    }));

    // tag_center -- Control the Edit Modal show and close
    function tog_center() {
        setmodal_center(!modal_center)
        // removeBodyCss()
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(SpinnerON(true))
        dispatch(fetchModelsList());
    }, []);

    // Edit Modal Show and Hide Control whwn Update Success
    useEffect(() => {
        if (updateMessage.Status === true) {
            dispatch(updateModuleIDSuccess({ Status: false }))
            tog_center()
        }
    }, [updateMessage.Status, dispatch]);

    // Edit Modal Show When Edit Data is true
    useEffect(() => {
        if (editData.Status === true) {
            dispatch(editModuleID(0));
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
            Message: `Are you sure you want to delete this item : "${name}"`,
            RedirectPath: false,
            PermissionAction: deleteModuleID,
            ID: id
        }));
    }
 
 const rowClasses = row => (row.IsActive ? "alert-row" : "");

    //Modules list component table columns 
    const columns = [
        {
            dataField: 'Name',
            text: 'Name',
            sort: true
        }, {
            dataField: 'DisplayIndex',
            text: 'Display Index',
            sort: true
        }, {
            dataField: 'IsActive',
            text: 'IsActive',
            sort: true
        },
        {
            text: "Action",
            dataField: "pdf",
            formatter: (cellContent, module) => (
                <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
                    <buton
                        type="button"
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit Modules ID"
                        onClick={() => {
                            EditPageHandler(module.ID);
                        }}
                        className="badge badge-soft-primary font-size-12"
                    >
                        <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                    </buton>
                    <buton
                        className="badge badge-soft-danger font-size-12"
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Modules ID"
                        onClick={() => {
                            deleteHandeler(module.ID, module.Name);
                        }}
                    >
                        <i className="mdi mdi-delete font-size-18" ></i>
                    </buton>
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

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Modules List| FoodERP-React FrontEnd</title>
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
                                        <Breadcrumbs
                                            title={"Count :"}
                                            breadcrumbItem={"Modules List"}
                                            IsButtonVissible={true}
                                            SearchProps={toolkitProps.searchProps}
                                            breadcrumbCount={TableListData.length}
                                            RedirctPath={"/Modules"}
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
                                                        rowClasses={rowClasses}
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
                        <Modules state={editData.Data} />
                    </Modal>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ModulesList
