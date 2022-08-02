import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "reactstrap";
import "../../../assets/scss/CustomeTable/datatables.scss"
import {
    getUser, deleteUser, editUserId, updateSuccess
} from "../../../store/Administrator/UserRegistrationRedux/actions";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
//redux
import { useSelector, useDispatch } from "react-redux";
import "../../../assets/scss/CustomeTable/datatables.scss"
import AddUser from "./UserRegistration";
import { deleteSuccess } from "../../../store/Administrator/RoleMasterRedux/action";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { useHistory } from "react-router-dom";
import { MetaTags } from "react-meta-tags";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const UserList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [modal_center, setmodal_center] = useState(false);

    const { TableListData, editData, updateMessage, deleteMessage } = useSelector((state) => ({
        TableListData: state.User_Registration_Reducer.pages,
        editData: state.User_Registration_Reducer.editData,
        updateMessage: state.User_Registration_Reducer.updateMessage,
        deleteMessage: state.User_Registration_Reducer.deleteSuccessRole,
    }));

    useEffect(() => {
        const userAcc = CommonGetRoleAccessFunction(history)
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [history])

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(getUser());
    }, []);

    // This UseEffect => UpadateModal Success/Unsucces Show and Hide Control Alert_modal 
    useEffect(() => {
        if ((updateMessage.Status === true) && (updateMessage.StatusCode === 200)) {
            dispatch(updateSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: updateMessage.Message,
                AfterResponseAction: getUser,
            }))
            tog_center()
        }
        else if (updateMessage.Status === true) {
            dispatch(updateSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: JSON.stringify(updateMessage.Message),
            }));
        }
    }, [updateMessage]);

    useEffect(() => {
        if ((deleteMessage.Status === true) && (deleteMessage.StatusCode === 200)) {
            dispatch(deleteSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1, Status: true,
                Message: deleteMessage.Message,
                AfterResponseAction: getUser,
            }))
        } else if (deleteMessage.Status === true) {
            dispatch(deleteSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 3,
                Status: true,
                Message: JSON.stringify(deleteMessage.Message),
            }));
        }
    }, [deleteMessage])

    useEffect(() => {
        if (editData.Status === true) {
            tog_center()
        }
    }, [editData]);

    const EditPageHandler = (id) => {
        dispatch(editUserId(id));
    }

    function tog_center() {
        setmodal_center(!modal_center)
    }
    //Delete Button Handller
    const deleteHandeler = (id, name) => {
        dispatch(AlertState({
            Type: 5, Status: true,
            Message: `Are you sure you want to delete this User : "${name}"`,
            RedirectPath: false,
            PermissionAction: deleteUser,
            ID: id
        }));
    }

    const pageOptions = {
        sizePerPage: 15,
        totalSize: TableListData.length,
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
            hidden: (
                !(userPageAccessState.RoleAccess_IsEdit)
                && !(userPageAccessState.RoleAccess_IsView)
                && !(userPageAccessState.RoleAccess_IsDelete)) ? true : false,

            formatter: (cellContent, User) => (
                <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
                    {(userPageAccessState.RoleAccess_IsEdit)
                        ?
                        <buton
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit User"
                            onClick={() => { EditPageHandler(User.id); }}
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
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="View User"
                            onClick={() => { EditPageHandler(User.id); }}
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
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete User"
                            onClick={() => { deleteHandeler(User.id, User.Name); }}
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
                        <title>Party List| FoodERP-React FrontEnd</title>
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
                                  
                                        <Breadcrumbs
                                            title={"Count :"}
                                            breadcrumbItem={userPageAccessState.PageHeading}
                                            IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                                            IsSearchVissible={true}
                                            SearchProps={toolkitProps.searchProps}
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
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
}
export default UserList;



