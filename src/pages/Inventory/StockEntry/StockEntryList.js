import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import * as _cfunc from "../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { C_DatePicker } from "../../../CustomValidateForm";
import StockEntry from "./StockEntry";
import { GetStockEntryList_Action, GetStockEntryView_Action } from "../../../store/Inventory/StockEntryRedux/action";
import StockEntryView from "./StockEntryView";
import * as _act from "../../../store/Inventory/StockEntryRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

const StockEntryList = () => {

    const dispatch = useDispatch();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const [headerFilters, setHeaderFilters] = useState('');

    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.StockEntryReducer.listBtnLoading,
            tableList: state.StockEntryReducer.StockEntryList,
            goBtnLoading: state.StockEntryReducer.listGoBtnloading,
            deleteMsg: state.StockEntryReducer.deleteMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );
    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);
    const { pageField, goBtnLoading } = reducers
    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

    const action = {
        deleteId: (inx) => {
            debugger
            const detail = inx.rowData
            const jsonBody = JSON.stringify({
                PartyID: detail.Party_id,
                StockDate: detail.PriviousStockDate
            });
            return _act.deleteStockEntry({ jsonBody });
        },
        deleteSucc: _act.deleteStockEntry_Success,

    };

    useEffect(() => {
        const page_Id = pageId.STOCK_ENTRY_LIST;
        dispatch(commonPageFieldList(page_Id));
        return () => {
            dispatch(commonPageFieldListSuccess(null));
        }
    }, []);

    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            goButtonHandler();

        } else {
            dispatch(_act.GetStockEntryList_Success([]));
        }
    }, [commonPartyDropSelect]);

    const goButtonHandler = () => {
        if (_cfunc.loginSelectedPartyID() === 0) {
            customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
            return;
        };
        try {
            const jsonBody = JSON.stringify({
                "FromDate": fromdate,
                "ToDate": todate,
                "PartyID": _cfunc.loginSelectedPartyID()
            });
            dispatch(GetStockEntryList_Action({ jsonBody }));
        } catch (error) { }
        return
    };

    function fromdateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.todate = date
        setHeaderFilters(newObj)
    }

    function viewApprovalBtnFunc(config) {

        const jsonBody = JSON.stringify({
            "PartyID": config.rowData.Party_id,
            "StockDate": config.rowData.PriviousStockDate,
        })

        dispatch(GetStockEntryView_Action({ jsonBody, btnId: `btn-viewApproval-${config.rowData.id}` }))
    }

    return (

        <React.Fragment>
            <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
            <div className="page-content">
                <div className="px-3 c_card_filter header text-black mb-1" >
                    <Row >
                        <Col sm="6" className="mt-1 mb-1">
                            <FormGroup className="row mt-2" >
                                <Label className="col-sm-1 p-2"
                                    style={{ width: "115px", marginRight: "0.1cm" }}>FromDate </Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                        }}
                                        name='Date'
                                        value={fromdate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        <Col sm="6" className="mt-1 mb-1" >
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-1 p-2"
                                    style={{ width: "115px", marginRight: "0.1cm" }}>ToDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                        }}
                                        name='Date'
                                        value={todate}
                                        onChange={todateOnchange}
                                    />
                                </Col>

                                <Col md={1}></Col>
                                <Col sm="1" className="mx-6" >
                                    < Go_Button
                                        loading={goBtnLoading}
                                        onClick={(e) => goButtonHandler()}
                                    />

                                </Col>
                            </FormGroup>
                        </Col >
                    </Row>
                </div>

                {
                    (pageField) &&
                    <div className="mt-n1">
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={StockEntry}
                            masterPath={url.STOCK_ENTRY}
                            newBtnPath={url.STOCK_ENTRY}
                            ButtonMsgLable={"StockEntry"}
                            deleteName={"StockDate"}
                            goButnFunc={goButtonHandler}
                            viewApprovalBtnFunc={viewApprovalBtnFunc}

                        />
                    </div>

                }
            </div>
            <StockEntryView />{/** StockEntry View component */}
        </React.Fragment>
    )
}

export default StockEntryList;
