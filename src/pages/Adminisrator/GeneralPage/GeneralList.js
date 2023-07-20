import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import GeneralMaster from "./GeneralMaster";
import {
    deleteGeneralIDSuccess,
    delete_General_ID,
    editGeneralID,
    PostGenerallist,
    SaveMethodForGeneralSuccess,
    updateGeneralIDSuccess,
    PostGenerallistSuccess
} from "../../../store/Administrator/GeneralRedux/action";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { loginCompanyID } from "../../../components/Common/CommonFunction";
import { PageLoadingSpinner, Listloader } from "../../../components/Common/CommonButton";


const GeneralList = (props) => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.GeneralReducer.listBtnLoading,
            GoBtnlistloading: state.GeneralReducer.loading,
            tableList: state.GeneralReducer.GeneralList,
            editData: state.GeneralReducer.editData,
            updateMsg: state.GeneralReducer.updateMessage,
            deleteMsg: state.GeneralReducer.deleteMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            postMsg: state.GeneralReducer.postMsg,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        getList: PostGenerallist,
        editId: editGeneralID,
        deleteId: delete_General_ID,
        postSucc: SaveMethodForGeneralSuccess,
        updateSucc: updateGeneralIDSuccess,
        deleteSucc: deleteGeneralIDSuccess
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.GENERAL_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(PostGenerallist(getlistBody()));
        return () => {
            dispatch(PostGenerallistSuccess([]));
          }
    }, []);

    const { pageField, GoBtnlistloading } = reducers

    function getlistBody() {
        return JSON.stringify({
            TypeID: 2,
            Company: loginCompanyID(),
        });
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(GoBtnlistloading || !pageField)} />
            {
                (pageField) &&
                <CommonListPage
                    action={action}
                    reducers={reducers}
                    MasterModal={GeneralMaster}
                    masterPath={url.GENERAL}
                    getListbodyFunc={getlistBody}
                    ButtonMsgLable={"General"}
                    deleteName={"Name"}
                />

            }

        </React.Fragment>
    )
}

export default GeneralList;
