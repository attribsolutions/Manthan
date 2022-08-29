import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "reactstrap";
import "../../../assets/scss/CustomeTable/datatables.scss"
import {
    getUser, deleteUser, editUserId, updateSuccess
} from "../../../store/Administrator/UserRegistrationRedux/actions";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
//redux
import { useSelector, useDispatch } from "react-redux";
import "../../../assets/scss/CustomeTable/datatables.scss"
import AddUser from "./UserRegistration";
import { deleteSuccess } from "../../../store/Administrator/RoleMasterRedux/action";
import { AlertState } from "../../../store/Utilites/CustomAlertRedux/actions";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { useHistory } from "react-router-dom";
import { MetaTags } from "react-meta-tags";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { listPageCommonButtonFunction } from "../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons";

const UserList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [modal_center, setmodal_center] = useState(false);

    const { pages, editData, updateMessage, deleteMessage, RoleAccessModifiedinSingleArray } = useSelector((state) => ({
        pages: state.User_Registration_Reducer.pages,
        editData: state.User_Registration_Reducer.editData,
        updateMessage: state.User_Registration_Reducer.updateMessage,
        deleteMessage: state.User_Registration_Reducer.deleteSuccessRole,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
    }));

    useEffect(() => {
        
        const locationPath = history.location.pathname
        let userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [RoleAccessModifiedinSingleArray])

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


    function tog_center() {
        setmodal_center(!modal_center)
    }


    const pageOptions = {
        sizePerPage: 15,
        totalSize: pages.length,
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
            text: "Employee Name",
            dataField: "EmployeeName",
            sort: true,
            formatter: (cellContent, user) => <>{user.EmployeeName}</>,
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
        // For Edit, Delete ,and View Button Common Code function
        listPageCommonButtonFunction({
            dispatchHook: dispatch,
            ButtonMsgLable: "User",
            deleteName:"LoginName",
            userPageAccessState: userPageAccessState,
            editActionFun: editUserId,
            deleteActionFun: deleteUser,
        })


    ];

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>User List| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                    >
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                data={pages}
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
                                            breadcrumbCount={`Users Count: ${pages.length}`}
                                        // RedirctPath={"/UserMaster"}
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
                        <AddUser state={editData.Data} relatatedPage={"/UserMaster"} />
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



