import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import PhonePaySetting from "./PhonePaySetting";
import { loginCompanyID, loginPartyID } from "../../../components/Common/CommonFunction";
import { getpartysetting_API } from "../../../store/Administrator/PartySetting/action";

import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { delete_PhonePaySetting_ID, deletePhonePaySettingSuccess, editPhonePaySettingID, savePhonePaySettingMaster_Success, updatePhonePaySettingIDSuccess } from "../../../store/Utilites/PhonePaySettingRedux/action";


 const PhonePaySettingList = () => {

    const dispatch = useDispatch();

    const [updateData, setUpdateData] = useState([]);
    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.PhonePaySettingReducer.listBtnLoading,
            tableList: state.PartySettingReducer.PartySettingdata,
            editData: state.PhonePaySettingReducer.editData,
            updateMsg: state.PhonePaySettingReducer.updateMsg,
            deleteMsg: state.PhonePaySettingReducer.deleteMsg,
            postMsg: state.PhonePaySettingReducer.postMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        // getList: getpartysetting_API,
        getList: () => getpartysetting_API(loginPartyID(), loginCompanyID()),
        editId: editPhonePaySettingID,
        deleteId: delete_PhonePaySetting_ID,
        postSucc: savePhonePaySettingMaster_Success,
        updateSucc: updatePhonePaySettingIDSuccess,
        deleteSucc: deletePhonePaySettingSuccess
    }

    useEffect(() => {
        const page_Id = pageId.PHONE_PAY_SETTING_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))

        return () => {
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);



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
                    MasterModal={PhonePaySetting}
                    masterPath={url.PHONE_PAY_SETTING}
                    ButtonMsgLable={"Pos Service Settings"}
                    deleteName={"id"}
                />

            }
        </React.Fragment>
    )
    
 }

 export default PhonePaySettingList;

