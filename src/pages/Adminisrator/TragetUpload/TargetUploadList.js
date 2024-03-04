import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
    commonPageFieldList,
    commonPageFieldListSuccess,
} from "../../../store/actions";
import {
    editGroupID,
    updateGroupIDSuccess
} from "../../../store/Administrator/GroupRedux/action";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import TargetUpload from "./TargetUploadMaster";
import { deleteTargetUploadSuccess, delete_TargetUpload_ID, getTargetUploadList, getTargetUploadListSuccess, saveTargetUploadMaster_Success } from "../../../store/Administrator/TargetUploadRedux/action";

const TargetUploadList = () => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.GroupReducer.listBtnLoading,
            goBtnLoading: state.GroupReducer.goBtnLoading,
            tableList: state.TargetUploadReducer.targetList,
            editData: state.TargetUploadReducer.editData,
            updateMsg: state.TargetUploadReducer.updateMsg,
            deleteMsg: state.TargetUploadReducer.deleteMsg,
            postMsg: state.TargetUploadReducer.postMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        getList: getTargetUploadList,
        editId: editGroupID,
        deleteId: delete_TargetUpload_ID,
        postSucc: saveTargetUploadMaster_Success,
        updateSucc: updateGroupIDSuccess,
        deleteSucc: deleteTargetUploadSuccess
    }

    useEffect(() => {
        const page_Id = pageId.TARGET_UPLOAD_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(getTargetUploadList());
        return () => {
            dispatch(getTargetUploadListSuccess([]));
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);

    const { pageField, goBtnLoading } = reducers
    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
            {
                (pageField) &&
                <CommonListPage
                    action={action}
                    reducers={reducers}
                    MasterModal={TargetUpload}
                    masterPath={url.TARGET_UPLOAD}
                    ButtonMsgLable={"Target Upload"}
                    deleteName={"id"}
                />
            }
        </React.Fragment>
    )
}

export default TargetUploadList;
