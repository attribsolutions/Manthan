import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import PosServiceSetting from "./PosServiceSetting";
import { loginCompanyID, loginPartyID } from "../../../components/Common/CommonFunction";
import { getpartysetting_API } from "../../../store/Administrator/PartySetting/action";
import { delete_PosServiceSetting_ID, deletePosServiceSettingSuccess, editPosServiceSettingID, getPosServiceSetting, getPosServiceSettingID, savePosServiceSettingMaster_Success, updatePosServiceSettingIDSuccess } from "../../../store/Utilites/PosServiesSettingRedux/action";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";


const PosServiceSettingList = () => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.PosServiceSettingReducer.listBtnLoading,
            tableList: state.PosServiceSettingReducer.PosServiceSettingList,
            editData: state.PosServiceSettingReducer.editData,
            updateMsg: state.PosServiceSettingReducer.updateMsg,
            deleteMsg: state.PosServiceSettingReducer.deleteMsg,
            postMsg: state.PosServiceSettingReducer.postMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })

    );
    const { goBtnLoading, pageField } = reducers;

    const action = {
        getList: getPosServiceSetting,
        editId: editPosServiceSettingID,
        deleteId: delete_PosServiceSetting_ID,
        postSucc: savePosServiceSettingMaster_Success,
        updateSucc: updatePosServiceSettingIDSuccess,
        deleteSucc: deletePosServiceSettingSuccess
    }

    useEffect(() => {
        const page_Id = pageId.POS_SERVICE_SETTING_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(getPosServiceSetting())
        // dispatch(editPosServiceSettingID())
        return () => {
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
            {
                (pageField) &&
                <CommonListPage
                    action={action}
                    reducers={reducers}
                    MasterModal={PosServiceSetting}
                    masterPath={url.POS_SERVICE_SETTING}
                    ButtonMsgLable={"Pos Service Settings"}
                    deleteName={"id"}
                />

            }
        </React.Fragment>
    )

}

export default PosServiceSettingList;

