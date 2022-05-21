import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import MetaTags from "react-meta-tags";
import { Button } from "reactstrap";

import {
    Col,
    Modal,
    Row,
} from "reactstrap";

import {
    getRole,
    deleteRole,
    editRoleId,
    updateSuccess,
} from "../../store/Administrator/RoleMasterRedux/action";

import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider, SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import { AlertState } from '../../store/Utilites/CostumeAlert/actions';
import AddRole from './AddRole';
import { SpinnerON } from '../../store/Utilites/Spinner/actions';
import "../../assets/scss/CustomeTable/datatables.scss"

const RoleListPage = () => {
    // const [EditId, setId] = useState('')
    const dispatch = useDispatch();
    const history = useHistory();
    const { SearchBar } = Search;
    const [modal_center, setmodal_center] = useState(false);

    //// get data
    const { pages, editData, updateMessage} = useSelector((state) => ({
        pages: state.RoleMaster_Reducer.pages,
        editData: state.RoleMaster_Reducer.editData,
        updateMessage: state.RoleMaster_Reducer.updateMessage,
    }));

    console.log("editData in RoleList Page",editData)

    function tog_center() {
        setmodal_center(!modal_center)
    }
    
useEffect(()=>{
    dispatch(SpinnerON(true))
    dispatch(getRole());
},[dispatch]);

    //// select id for delete row
    const deleteHandeler = (id, name) => {
        dispatch(AlertState({
            Type: 5, Status: true,
            Message: `Are you sure you want to delete this item : "${name}"`,
            RedirectPath: false,
            PermissionAction: deleteRole,
            ID: id
        }));
    }

    useEffect(() => {
        if (updateMessage.Status === true) {
            dispatch(updateSuccess({ Status: false }))
            tog_center()
            dispatch(getRole());
        }
    }, [updateMessage.Status]);
    console.log("updateMessage",updateMessage)

    // Edit Modal Show When Edit Data is true
    useEffect(() => {
        if (editData.Status === true) {
            tog_center()
        }
    }, [editData]);
    console.log("editData in RoleList Page after useEffect",editData)
    
    //// edit id select
    const EditPageHandler = (id) => {
        console.log("selected ID", id)
        dispatch(editRoleId(id));
    }

    const pageOptions = {
        sizePerPage: 10,
        totalSize: pages.length,
        custom: true,
    };

    const pagesListColumns = [
        {
            text: "PageID",
            dataField: "ID",
            sort: true,
            hidden: true,
            formatter: (cellContent, Role) => <>{Role.ID}</>,
        },

        {
            text: "Name",
            dataField: "Name",
            sort: true,
            formatter: (cellContent, Role) => <>{Role.Name}</>,
        },

        {
            text: "Description",
            dataField: "Description",
            sort: true,
            formatter: (cellContent, Role) => <>{Role.Description}</>,
        },
        {
            text: "IsActive",
            dataField: "isActive",
            sort: true,
            formatter: (cellContent, Role) =>
                <>
                    {(Role.isActive) ? "true" : "false"}
                </>
        },
        {
            text: "Dashboard",
            dataField: "Dashboard",
            sort: true,
            formatter: (cellContent, Role) => <>{Role.Dashboard}</>,
        },
        {
            text: "Actions",

            formatter: (cellContent, Role) => (
                <>
                    <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
                        <buton
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit Modules ID"
                            onClick={() => {
                                EditPageHandler(Role.ID);
                            }}
                            className="badge badge-soft-primary font-size-12"
                        >
                            <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                        </buton>
                        <buton
                            className="badge badge-soft-danger font-size-12"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Modules ID"
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
                            data={pages}
                            columns={pagesListColumns}
                            // bootstrap4
                            search
                        >

                            {toolkitProps => (
                                <React.Fragment>
                                    <Breadcrumbs
                                        title={"Count :"}
                                        breadcrumbItem={"Role List Page"}
                                        IsButtonVissible={true}
                                        a={toolkitProps.searchProps}
                                        breadcrumbCount={pages.length}
                                        RedirctPath={"/AddRole"}
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
                    <AddRole state={editData.Data} />
                </Modal>
            </div>
        </React.Fragment>
    );
};


export default RoleListPage;