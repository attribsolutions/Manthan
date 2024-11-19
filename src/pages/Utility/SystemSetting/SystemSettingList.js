import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess,
} from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import SystemSetting from "./SystemSetting";
import { loginCompanyID, loginPartyID } from "../../../components/Common/CommonFunction";
import { getpartysetting_API } from "../../../store/Administrator/PartySetting/action";
import { deleteSystemSettingSuccess, delete_SystemSetting_ID, editSystemSettingID, saveSystemSettingMaster_Success, updateSystemSettingIDSuccess } from "../../../store/Utilites/SystemSettingRedux/action";

const SystemSettingList = () => {

    const dispatch = useDispatch();

    const [updateData, setUpdateData] = useState([]);
    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.SystemSettingReducer.listBtnLoading,
            tableList: state.PartySettingReducer.PartySettingdata,
            editData: state.SystemSettingReducer.editData,
            updateMsg: state.SystemSettingReducer.updateMsg,
            deleteMsg: state.SystemSettingReducer.deleteMsg,
            postMsg: state.SystemSettingReducer.postMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        getList: getpartysetting_API,
        editId: editSystemSettingID,
        deleteId: delete_SystemSetting_ID,
        postSucc: saveSystemSettingMaster_Success,
        updateSucc: updateSystemSettingIDSuccess,
        deleteSucc: deleteSystemSettingSuccess
    }

    useEffect(() => {
        const page_Id = pageId.SYSTEM_SETTING_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(getpartysetting_API(loginPartyID(), loginCompanyID()))

        return () => {
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);

    useEffect(() => {
        dispatch(getpartysetting_API(loginPartyID(), loginCompanyID()))
    }, [reducers.deleteMsg, reducers.updateMsg, reducers.postMsg])

    const { pageField, goBtnLoading, tableList } = reducers

    useEffect(() => {

        let UpdatedData = []
        if (typeof tableList.Data === 'object' && Object.values(tableList.Data).length > 0) {
            Object.values(tableList.Data).forEach((element, key) => {
                UpdatedData.push(element);
            })
            setUpdateData(UpdatedData)
            dispatch(BreadcrumbShowCountlabel(`Count:${UpdatedData.length}`));
        }
    }, [tableList])
    reducers.tableList = updateData

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
            {
                (pageField) &&
                <CommonListPage
                    action={action}
                    reducers={reducers}
                    MasterModal={SystemSetting}
                    masterPath={url.SYSTEM_SETTING}
                    ButtonMsgLable={"System Settings"}
                    deleteName={"id"}
                />

            }
        </React.Fragment>
    )
}

export default SystemSettingList;
