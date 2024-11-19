import React, { useEffect, useState } from "react"
import { Row, Col, Modal, Button } from "reactstrap"
import MetaTags from 'react-meta-tags'
// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
    PaginationProvider, PaginationListStandalone,
} from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
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
import { useHistory } from "react-router-dom";
import RoleAccessCopyFunctionality from "./RoleAccessCopyFunctionality";
import CommonPurchaseList, { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import { breadcrumbReturnFunc, btnIsDissablefunc, loginCompanyID, loginRoleID, loginUserID } from "../../../components/Common/CommonFunction";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import RoleAccessAdd from "./RoleAccessAdd"
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";


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
            customAlert({
                Type: 1,
                Message: postMsgCopy.Message,
            })
        }
        else if (postMsgCopy.Status === true) {
            dispatch(saveCopyRoleAccessActionSuccess({ Status: false }))
            customAlert({
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

        const ispermission = await customAlert({
            Type: 7,
            Message: `${alertMessages.deleteOrNot} Role : "${rowData.RoleName}"`,
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
