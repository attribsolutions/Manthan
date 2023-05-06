import React, { useEffect, useState } from "react"
import { Row, Col, Modal, Button } from "reactstrap"
import MetaTags from 'react-meta-tags'
// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
    PaginationProvider, PaginationListStandalone,
} from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import "../../../assets/scss/CustomTable2/datatables.scss";
import { useDispatch, useSelector } from "react-redux";
import {
    commonPageFieldList,
    commonPageFieldListSuccess,
    DeleteRoleAcess,
    DeleteRoleAcessSuccess,
    EditRoleAcessAction,
    getRoleAccessListPage,
    getRoleAccessListPageSuccess,
    saveCopyRoleAccessActionSuccess,
    updateRoleAcessAction,
} from "../../../store/actions";
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import RoleAccessCopyFunctionality from "./RoleAccessCopyFunctionality";
import CommonPurchaseList, { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import { breadcrumbReturnFunc, btnIsDissablefunc, loginCompanyID, loginRoleID, loginUserID } from "../../../components/Common/CommonFunction";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import RoleAccessAdd from "./RoleAccessAdd"

const RoleAccessListPage1 = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [userAccState, setUserAccState] = useState('');
    const [modal_center, setmodal_center] = useState(false);
    const [copy_user_RowData, setCopy_user_RowData] = useState({});


    const { TableListData, userAccess, PostMessage_ForCopyRoleAccess, deleteMsg } = useSelector((state) => ({
        TableListData: state.RoleAccessReducer.RoleAccessListPage,
        userAccess: state.Login.RoleAccessUpdateData,
        PostMessage_ForCopyRoleAccess: state.RoleAccessReducer.PostMessage_ForCopyRoleAccess,
        deleteMsg: state.RoleAccessReducer.deleteMsg,
    }));


    useEffect(() => {
        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc, newBtnPath: url.ROLEACCESS });
        }
    }, [userAccess])


    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(getRoleAccessListPage(getListbodyFunc()));
    }, []);

    function getListbodyFunc() {
        return JSON.stringify({
            UserID: loginUserID(),
            RoleID: loginRoleID(),
            CompanyID: loginCompanyID()
        })
    }

    const EditPageHandler = (rowData) => {

        if (rowData.Division_id === null) {
            rowData.Division_id = 0
        }
        history.push({
            // pathname: `/${found.ActualPagePath}`,
            state: rowData,
        })

    }

    useEffect(() => {
        if ((PostMessage_ForCopyRoleAccess.Status === true) && (PostMessage_ForCopyRoleAccess.StatusCode === 200)) {
            dispatch(saveCopyRoleAccessActionSuccess({ Status: false }))
            dispatch(getRoleAccessListPage(getListbodyFunc()));
            tog_center()
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: PostMessage_ForCopyRoleAccess.Message,
            }))
        }
        else if (PostMessage_ForCopyRoleAccess.Status === true) {
            dispatch(saveCopyRoleAccessActionSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostMessage_ForCopyRoleAccess.Message),
            }));
        }
    }, [PostMessage_ForCopyRoleAccess])

    useEffect(() => {

        if ((deleteMsg.Status === true) && (deleteMsg.StatusCode === 200)) {
            dispatch(DeleteRoleAcessSuccess({ Status: false }));
            dispatch(getRoleAccessListPage(getListbodyFunc()));
            CustomAlert({
                Type: 1,
                Message: JSON.stringify(deleteMsg.Message),
            })
        }
    }, [deleteMsg]);

    //select id for copy row
    const CopyHandeler = (event) => {
        setCopy_user_RowData(event)
        tog_center()
    };



    //select id for delete row
    const deleteHandeler = async (id, name) => {

        const ispermission = await CustomAlert({
            Type: 7,
            Message: `Are you sure you want to delete this Role : "${id.RoleName}"`,
        })
        if (ispermission) {
            let role = id.Role_id
            let division = id.Division_id === null ? 0 : id.Division_id
            let company = id.Company_id
            dispatch(DeleteRoleAcess(role, division, company))
        }

    };

    // Modules list component table columns 
    const columns = [
        {
            dataField: 'RoleName',
            text: 'Role Name',
            sort: true
        }, {
            dataField: 'DivisionName',
            text: 'Division Name',
            sort: true
        },
        {
            dataField: 'CompanyName',
            text: 'Company Name',
            sort: true
        },
        {
            text: "Action",
            hidden: (
                !(userAccState.RoleAccess_IsEdit)
                && !(userAccState.RoleAccess_IsView)
                && !(userAccState.RoleAccess_IsDelete)) ? true : false,

            formatter: (cellContent, RoleAccess) => (

                <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >

                    <Button
                        className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Copy RoleAccess"
                        onClick={() => { CopyHandeler(RoleAccess); }}
                    >
                        copy
                    </Button>


                    {((userAccState.RoleAccess_IsEdit)) ?
                        <Button
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit RoleAccess"
                            onClick={() => { EditPageHandler(RoleAccess); }}
                            className="badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
                        >
                            <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                        </Button> : null}

                    {(!(userAccState.RoleAccess_IsEdit) && (userAccState.RoleAccess_IsView)) ?
                        <Button
                            type="button"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="View RoleAccess"
                            onClick={() => { EditPageHandler(RoleAccess); }}
                            className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"

                        >
                            <i className="bx bxs-show font-size-18 "></i>
                        </Button> : null}

                    {(userAccState.RoleAccess_IsDelete)
                        ?
                        <Button
                            className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete RoleAccess"
                            onClick={() => { deleteHandeler(RoleAccess); }}
                        >
                            <i className="mdi mdi-delete font-size-18"></i>
                        </Button>
                        : null
                    }

                </div>
            ),
        },
    ];

    const defaultSorted = [{
        dataField: 'RoleName',
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

    if (!(userAccState === '')) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
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
                                        <div className="table-responsive">
                                            <BootstrapTable
                                                keyField={"id"}
                                                responsive
                                                bordered={true}
                                                striped={false}
                                                classes={"table align-middle table-nowrap table-hover"}
                                                noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                                                headerWrapperClasses={"thead-light"}
                                                {...toolkitProps.baseProps}
                                                {...paginationTableProps}
                                            />
                                            {countlabelFunc(toolkitProps, paginationProps, dispatch, "RoleAccess")}
                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>

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
                        <RoleAccessCopyFunctionality state={copy_user_RowData} />

                    </Modal>
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




const RoleAccessListPage = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [modal_center, setmodal_center] = useState(false);
    const [copy_user_RowData, setCopy_user_RowData] = useState({});

    const reducers = useSelector(
        (state) => ({
            tableList: state.RoleAccessReducer.RoleAccessListPage,
            userAccess: state.Login.RoleAccessUpdateData,
            postMsg: state.RoleAccessReducer.postMsg,
            postMsgCopy: state.RoleAccessReducer.postMsgCopy,
            deleteMsg: state.RoleAccessReducer.deleteMsg,
            editData: state.RoleAccessReducer.editData,
            updateMsg: state.RoleAccessReducer.updateMsg,
            pageField: state.CommonPageFieldReducer.pageFieldList

        })
    );

    const { postMsgCopy } = reducers;

    const action = {
        getList: getRoleAccessListPage,
        editId: EditRoleAcessAction,
        deleteId: DeleteRoleAcess,
        postSucc: getRoleAccessListPageSuccess,
        updateSucc: updateRoleAcessAction,
        deleteSucc: DeleteRoleAcessSuccess
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.ROLEACCESS_lIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(getRoleAccessListPage());
    }, []);

    useEffect(() => {
        if ((postMsgCopy.Status === true) && (postMsgCopy.StatusCode === 200)) {
            dispatch(saveCopyRoleAccessActionSuccess({ Status: false }))
            dispatch(getRoleAccessListPage());
            tog_center()
            CustomAlert({
                Type: 1,
                Message: postMsgCopy.Message,
            })
        }
        else if (postMsgCopy.Status === true) {
            dispatch(saveCopyRoleAccessActionSuccess({ Status: false }))
            CustomAlert({
                Type: 1,
                Message: JSON.stringify(postMsgCopy.Message),
            })
        }
    }, [postMsgCopy])

    function editBodyfunc(config) {
        const { rowData } = config;

        if (rowData.Division_id === null) {
            rowData.Division_id = 0
        }
        history.push({
            pathname: url.ROLEACCESS,
            state: config,
        })
    }

    async function deleteBodyfunc(config) {

        const { rowData, btnId } = config;

        const ispermission = await CustomAlert({
            Type: 7,
            Message: `Are you sure you want to delete this Role : "${rowData.RoleName}"`,
        })
        if (ispermission) {
            btnIsDissablefunc({ btnId, state: true })
            let role = rowData.Role_id
            let division = rowData.Division_id === null ? 0 : rowData.Division_id
            let company = rowData.Company_id
            dispatch(DeleteRoleAcess({ role, division, company, btnId }))
        }
    }

    function copyBodyfunc(config) {
        const { rowData, btnId } = config;
        setCopy_user_RowData(rowData)
        tog_center()
        btnIsDissablefunc({ btnId, state: false })
    }

    function goButnFunc() {
        dispatch(getRoleAccessListPage());
    }
    // tag_center -- Control the Edit Modal show and close
    function tog_center() {
        setmodal_center(!modal_center)
    }

    const { pageField, userAccess = [] } = reducers

    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: "-4px" }}>
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            newBtnPath={url.ROLEACCESS}
                            MasterModal={RoleAccessAdd}
                            editBodyfunc={editBodyfunc}
                            copyBodyfunc={copyBodyfunc}
                            goButnFunc={goButnFunc}
                            deleteBodyfunc={deleteBodyfunc}
                            masterPath={url.ROLEACCESS}
                            ButtonMsgLable={"RoleAccess"}
                            deleteName={"Name"}
                        />
                        : null
                }
            </div>
            <Modal
                isOpen={modal_center}
                toggle={() => { tog_center() }}
                size="xl"
            >
                <RoleAccessCopyFunctionality state={copy_user_RowData} />

            </Modal>
        </React.Fragment>
    )
}

export default RoleAccessListPage
