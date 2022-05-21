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
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { SpinnerON } from "../../../store/Utilites/Spinner/actions";
import {
    deleteSubModuleUsingID,
    GetSubModuleEditDataUsingID,
    GetSubModuleEditDataUsingIDSuccess,
    getSubModules, updateSubModuleSuccess
} from "../../../store/Administrator/SubModules/actions";
import SubModules from './SubModules'

const SubModulesList = () => {

    const dispatch = useDispatch();
    const [modal_center, setmodal_center] = useState(false);

    // get Access redux data
    const { TableListData, editData, updateMessage } = useSelector((state) => ({
        TableListData: state.SubModules.ListData,
        editData: state.SubModules.editData,
        updateMessage: state.SubModules.updateMessage,
    }));

    // tag_center -- Control the Edit Modal show and close
    function tog_center() {
        dispatch(GetSubModuleEditDataUsingIDSuccess({ Status: "false" }))
        setmodal_center(!modal_center)
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(SpinnerON(true))
        dispatch(getSubModules());
    }, [dispatch]);

    // Edit Modal Show When Edit Data is true
    useEffect(() => {
        if (editData.Status === true) {
            setmodal_center(!modal_center)
        };
        if (updateMessage.Status === true) {
            dispatch(updateSubModuleSuccess({ Status: false }))
            setmodal_center(!modal_center)
        }
    }, [editData,updateMessage]);

    // Edit button Handller
    const EditPageHandler = (id) => {
        dispatch(GetSubModuleEditDataUsingID(id));
    }

    //Delete Button Handller
    const deleteHandeler = (id, name) => {
        dispatch(AlertState({
            Type: 5, Status: true,
            Message: `Are you sure you want to delete this item : "${name}"`,
            RedirectPath: false,
            PermissionAction: deleteSubModuleUsingID,
            ID: id
        }));
    }

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
        },
        {
            dataField: 'ModuleName',
            text: 'ModuleName',
            sort: true
        },
        {
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
                    <title> Sub Modules List| FoodERP-React FrontEnd</title>
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
                                            breadcrumbItem={"Sub Modules List"}
                                            IsButtonVissible={true}
                                            SearchProps={toolkitProps.searchProps}
                                            breadcrumbCount={TableListData.length}
                                            RedirctPath={"/subModules"}
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
                        }</PaginationProvider>
                    <Modal
                        isOpen={modal_center}
                        toggle={() => { tog_center() }}
                        size="xl"
                    >
                        <SubModules EditState={editData.Data} />
                    </Modal>
                </div>
            </div>
        </React.Fragment>
    )
}
export default SubModulesList
