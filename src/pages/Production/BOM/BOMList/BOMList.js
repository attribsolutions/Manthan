import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbRadioButtonView,
    commonPageFieldList,
    commonPageFieldListSuccess,
    getItemList
} from "../../../../store/actions";
import CommonPurchaseList from "../../../../components/Common/CommonPurchaseList"
import { BIllOf_MATERIALS_LIST } from "../../../../routes/route_url";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import {
    deleteBOMId,
    deleteBOMIdSuccess,
    editBOMList,
    getBOMListPage,
    updateBOMListSuccess,
    getBOMListPageSuccess
} from "../../../../store/Production/BOMRedux/action";
import BOMMaster from "../BOMMaster/BOMIndex";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import { C_DatePicker, C_Select } from "../../../../CustomValidateForm";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { allLabelWithBlank } from "../../../../components/Common/CommonErrorMsg/HarderCodeData";
import { Go_Button, PageLoadingSpinner } from "../../../../components/Common/CommonButton";


const BOMList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(BIllOf_MATERIALS_LIST)
    const [userAccState, setUserAccState] = useState('');
    const [hederFilters, setHederFilters] = useState({ fromdate: currentDate_ymd, todate: currentDate_ymd, venderSelect: allLabelWithBlank })
    const [Item, setItem] = useState(allLabelWithBlank);

    debugger
    const reducers = useSelector(
        (state) => ({
            goBtnLoading: state.BOMReducer.loading,
            listBtnLoading: state.BOMReducer.listBtnLoading,
            tableList: state.BOMReducer.BOMList,
            deleteMsg: state.BOMReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.BOMReducer.editData,
            bomlistFilters: state.BOMReducer.bomlistFilters,
            Items: state.ItemMastersReducer.ItemList,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { userAccess, pageField, goBtnLoading, listBtnLoading, Items } = reducers;
    const { fromdate, todate } = hederFilters;


    const action = {
        getList: getBOMListPage,
        editId: editBOMList,
        deleteId: deleteBOMId,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteBOMIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.BIllOf_MATERIALS_LIST
        setpageMode(hasPagePath)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(BreadcrumbRadioButtonView(true));
        dispatch(commonPageFieldList(page_Id))
        goButtonHandler(true)
        dispatch(getItemList())
        return () => {
            dispatch(getBOMListPageSuccess([]))
        }
    }, []);


    useEffect(() => {
        const pageId = 70
        let userAcc = userAccess.find((inx) => {
            return (inx.id === pageId)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    const goButtonHandler = () => {

        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            Party: _cfunc.loginPartyID(),
            ItemID: Item.value
        });
        dispatch(getBOMListPage(jsonBody));
    }

    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.Name,
    }));



    function copyBodyfunc(config) {
        try {
            dispatch(editBOMList(config));

        } catch (error) { }
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={goBtnLoading || !pageField} />
            <div className="page-content">
                <div className="px-2   c_card_filter text-black"  >
                    <div className="row">
                        <Col sm="4">
                            <FormGroup className="mb-3 row mt-3 ">
                                <Label className="mt-2" style={{ width: "115px" }}> Item Name </Label>
                                <Col sm={7}>
                                    <C_Select
                                        name="ItemName"
                                        value={Item}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown" 
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={ItemDropdown_Options}
                                        onChange={(e) => { setItem(e) }
                                        }
                                    />

                                </Col>
                            </FormGroup>
                        </Col>



                        <Col sm="7" ></Col>
                        <Col sm="1" className="mt-3 ">
                            <Go_Button loading={goBtnLoading} onClick={goButtonHandler} />
                        </Col>
                    </div>
                </div>
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            copyBodyfunc={copyBodyfunc}
                            MasterModal={BOMMaster}
                            masterPath={url.BIllOf_MATERIALS}
                            newBtnPath={url.BIllOf_MATERIALS}
                            ButtonMsgLable={"BOM"}
                            deleteName={"ItemName"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default BOMList;