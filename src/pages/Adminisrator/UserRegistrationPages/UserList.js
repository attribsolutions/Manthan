import React, { useEffect, useState } from "react";
import {
    Col,
    Modal,
    Row,
} from "reactstrap";
import "../../../assets/scss/CustomeTable/datatables.scss"
import {
    getUser, deleteUser, editUserId, updateSuccess
} from "../../../store/Administrator/UserRegistrationRedux/actions";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import paginationFactory,
{
    PaginationListStandalone,
    PaginationProvider
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//redux
import { useSelector, useDispatch } from "react-redux";

// import { useAlert } from "react-alert";

import AddUser from "./AddUser";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
const UserList = () => {
    // const alert = useAlert();
    const dispatch = useDispatch();
    const [deleteIn, setDeleteIn] = useState('');
    const [modal_center, setmodal_center] = useState(false);

    const { pages, editData, updateMessage } = useSelector((state) => ({
        pages: state.User_Registration_Reducer.pages,
        editData: state.User_Registration_Reducer.editData,
        updateMessage: state.User_Registration_Reducer.updateMessage,
    }));


    function tog_center() {
        setmodal_center(!modal_center)
    }

    useEffect(() => {
        dispatch(getUser());
    }, []);

    useEffect(() => {
        if (updateMessage.Status === true) {
            dispatch(updateSuccess({ Status: false }))
            dispatch(getUser());
            tog_center()
        }
    }, [updateMessage.Status]);
    console.log("updateMessage", updateMessage)

    useEffect(() => {
        if (editData.Status === true) {
            // dispatch(editUserId(0));
            tog_center()
        }
    }, [editData]);

    const EditPageHandler = (id) => {
        dispatch(editUserId(id));
    }

    //Delete Button Handller
    const deleteHandeler = (id, name) => {
        dispatch(AlertState({
            Type: 5, Status: true,
            Message: `Are you sure you want to delete this Company : "${name}"`,
            RedirectPath: false,
            PermissionAction: deleteUser,
            ID: id
        }));
    }

    const pageOptions = {
        sizePerPage: 15,
        totalSize: pages.length,
        custom: true,
    };

    const pagesListColumns = [
        {
            text: "PageID",
            dataField: "ID",
            sort: true,
            hidden: true,
            formatter: (cellContent, user) => <>{user.ID}</>,
        },
        {
            text: "LoginName",
            dataField: "LoginName",
            sort: true,
            formatter: (cellContent, user) => <>{user.LoginName}</>,
        },
        {
            text: "Email",
            dataField: "email",
            sort: true,
            formatter: (cellContent, user) => <>{user.email}</>,
        },
        {
            text: "EmployeeID",
            dataField: "EmployeeID",
            sort: true,
            formatter: (cellContent, user) => <>{user.EmployeeID}</>,
        },
        {
            text: "IsActive",
            dataField: "isActive",
            sort: true,
            formatter: (cellContent, user) =>
                <>
                    {(user.isActive) ? 'true ' : ' false'}
                </>,
        },
        {
            text: "IsSendOTP",
            dataField: "isSendOTP",
            sort: true,
            formatter: (cellContent, user) =>
                <>
                    {(user.isSendOTP) ? "true" : "false"}
                </>
        },
        {
            text: "Actions ",

            formatter: (cellContent, user) => (
                <>
                    <div class="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >

                        <buton
                            type="button"
                            onClick={() => {
                                EditPageHandler(user.ID);
                            }}
                            className="badge badge-soft-primary font-size-12"
                        >
                            <i class="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                        </buton>{" "}

                        <buton
                            className="badge badge-soft-danger font-size-12"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Company"
                            onClick={() => { deleteHandeler(user.ID, user.LoginName); }}
                        >
                            <i class="mdi mdi-delete font-size-18" ></i>
                        </buton>
                    </div>
                </>
            ),
        },
    ];

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
                            bootstrap4
                            search
                        >

                            {toolkitProps => (
                                <React.Fragment>
                                    <Breadcrumbs
                                        title={"Count :"}
                                        breadcrumbItem={"User Registration List"}
                                        IsButtonVissible={true}
                                        a={toolkitProps.searchProps}
                                        breadcrumbCount={pages.length}
                                        RedirctPath={"/usersMaster"}
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
                    <AddUser state={editData.Data} />
                </Modal>
            </div>
        </React.Fragment>
    );
};

export default UserList;



