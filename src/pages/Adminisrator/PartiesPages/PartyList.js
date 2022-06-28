import React, { useEffect, useState } from 'react'
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Col, Modal, Row } from "reactstrap";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import { AlertState } from '../../../store/Utilites/CostumeAlert/actions';

import "../../../assets/scss/CustomeTable/datatables.scss"
import {
    deletePartyID,
    deletePartyIDSuccess,
    editPartyID,
    getPartyListAPI,
    updatePartyIDSuccess
}  from '../../../store/Administrator/PartyRedux/action';

const PartyList = () => {
    const dispatch = useDispatch();
    const [modal_center, setmodal_center] = useState(false);

    // get Access redux data
    const { TableListData, editData, updateMessage, deleteMessage } = useSelector((state) => ({
        TableListData: state.PartyMasterReducer.pages,
        editData: state.PartyMasterReducer.editData,
        updateMessage: state.PartyMasterReducer.updateMessage,
        deleteMessage: state.PartyMasterReducer.deleteMessage,
    }));

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(getPartyListAPI());
    }, []);

    // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal 
    useEffect(() => {
        if ((updateMessage.Status === true) && (updateMessage.StatusCode === 200)) {
            dispatch(updatePartyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: updateMessage.Message,
                AfterResponseAction: getPartyListAPI,
            }))
            tog_center()
        }
        else if (deleteMessage.Status === true) {
            dispatch(deletePartyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: deleteMessage.Message,
            }));
        }
    }, [updateMessage.Status, dispatch]);

    useEffect(() => {
        if ((deleteMessage.Status === true) && (deleteMessage.StatusCode === 200)) {
            dispatch(deletePartyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: deleteMessage.Message,
                AfterResponseAction: getPartyListAPI,
            }))
        } else if (deleteMessage.Status === true) {
            dispatch(deletePartyIDSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3,
                Status: true,
                Message: "error Message",
            }));
        }
    }, [deleteMessage.Status])

    // Edit Modal Show When Edit Data is true
    useEffect(() => {
        if (editData.Status === true) {
            tog_center()
        }
    }, [editData]);

    function tog_center() {
        setmodal_center(!modal_center)
    }

    //select id for delete row
    const deleteHandeler = (id, name) => {
        dispatch(AlertState({
            Type: 5, Status: true,
            Message: `Are you sure you want to delete this Party : "${name}"`,
            RedirectPath: false,
            PermissionAction: deletePartyID,
            ID: id
        }));
    }
    // edit Buutton Handller 
    const EditPageHandler = (id) => {
        dispatch(editPartyID(id));
    }

    const pageOptions = {
        sizePerPage: 10,
        totalSize: TableListData.length,
        custom: true,
    };

    const pagesListColumns = [
        {
            text: "Name",
            dataField: "Name",
            sort: true,
        },
        {
            text: "PartyType",
            dataField: "PartyType",
            sort: true,
        },
        {
            text: "DivisionType",
            dataField: "DivisionType",
            sort: true,
        },
        {
            text: "CompanyName",
            dataField: "CompanyName",
            sort: true,
        },
        {
            text: "Action",
            formatter: (cellContent, Role) => (
                <>
                    <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
                        <buton
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit Party "
                            onClick={() => {
                                EditPageHandler(Role.ID);
                            }}
                            className="badge badge-soft-primary font-size-12"
                        >
                            <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                        </buton>
                        <buton
                            className="badge badge-soft-danger font-size-12"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Party"
                            onClick={() => {
                                deleteHandeler(Role.ID, Role.Name);
                            }}
                        >
                            <i className="mdi mdi-delete font-size-18" ></i>
                        </buton>
                    </div>
                </>
            ),
        },
    ]

    return (
        <React.Fragment>
            <div className="page-content">
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
                                    <Breadcrumbs
                                        title={"Count :"}
                                        breadcrumbItem={"Party List"}
                                        IsButtonVissible={true}
                                        SearchProps={toolkitProps.searchProps}
                                        breadcrumbCount={TableListData.length}
                                        RedirctPath={"/RolesMaster"}
                                    />
                                    <Row>
                                        <Col xl="12">
                                            <div className="table-responsive">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    responsive
                                                    bordered={false}
                                                    striped={false}
                                                    classes={
                                                        "table  table-bordered"
                                                    }
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
                <Modal
                    isOpen={modal_center}
                    toggle={() => { tog_center() }}
                    size="xl"
                >
                    {/* <AddRole state={editData.Data} /> */}
                </Modal>
            </div>
        </React.Fragment>
    );
};


export default PartyList;