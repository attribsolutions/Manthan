import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../../../CustomValidateForm";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../../../routes/index"
import { MetaTags } from "react-meta-tags";
import C_Report from "../../../../components/Common/C_Report";
import { stockReport_1_GoButton_API_Success } from "../../../../store/Report/StockReport/action";
import { commonPageField, commonPageFieldSuccess, getpdfReportdata, getpdfReportdataSuccess, GetVenderSupplierCustomer } from "../../../../store/actions";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import * as report from '../../../../Reports/ReportIndex'
import { ExcelReportComponent } from "../../../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { alertMessages } from "../../../../components/Common/CommonErrorMsg/alertMsg";

import { Periodic_GRN_Report, Periodic_GRN_Report_Success } from "../../../../store/Report/PeriodicGRNRedux/action";
import { ItemSaleGoButton_API, ItemSaleGoButton_API_Success } from "../../../../store/Report/ItemSaleReport/action";
import { allLabelWithZero } from "../../../../components/Common/CommonErrorMsg/HarderCodeData";
import { ItemSaleReport_GoBtn_API } from "../../../../helpers/backend_helper";



const PosSummarySale = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = !_cfunc.loginUserIsFranchisesRole();
    const IsFranchises = _cfunc.loginUserIsFranchisesRole()
    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');

    const [PartyDropdown, setPartyDropdown] = useState(allLabelWithZero);



    const reducers = useSelector(
        (state) => ({
            BtnLoading: state.PdfReportReducers.BtnLoading,
            PrediocGrnData: state.PeriodicGrnReportReducer.PrediocGrnData,
            pdfdata: state.PdfReportReducers.pdfdata,
            userAccess: state.Login.RoleAccessUpdateData,
            ItemSaleReportGobtn: state.ItemSaleReportReducer.ItemSaleReportGobtn,
            partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
            Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
            goBtnLoading: state.ItemSaleReportReducer.goBtnLoading,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );
   

    const { userAccess, BtnLoading, PrediocGrnData, pageField, pdfdata, ItemSaleReportGobtn, partyDropdownLoading, Party , goBtnLoading } = reducers

    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const [localLoading, setLocalLoading] = useState(false);


    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.POS_SALE_SUMMARY_REPORT));
        if (_cfunc.CommonPartyDropValue().value > 0) {
            setPartyDropdown(_cfunc.CommonPartyDropValue());
        }
        return () => {
            dispatch(commonPageFieldSuccess(null));
        }
    }, [])

    useEffect(() => {

        try {
            if ((ItemSaleReportGobtn.Status === true) && (ItemSaleReportGobtn.StatusCode === 200)) {

                const Details = _cfunc.loginUserDetails()
                debugger
                if (ItemSaleReportGobtn.BtnMode === "excel") {
                    ExcelReportComponent({
                        pageField,
                        excelTableData: ItemSaleReportGobtn.Data,
                        excelFileName: "Periodic GRN Report"
                    })
                    dispatch(ItemSaleGoButton_API_Success([]));
                } else if (ItemSaleReportGobtn.BtnMode === "print") {
                    let config = { rowData: { Data: [] } }
                    config.rowData["ReportType"] = report.POSSaleSummary;
                    config.rowData["Status"] = ItemSaleReportGobtn.Status
                    config.rowData["StatusCode"] = ItemSaleReportGobtn.StatusCode
                    config.rowData["Data"] = ItemSaleReportGobtn.Data
                    config.rowData["Data"]["GSTIN"] = isSCMParty ? PartyDropdown.GSTIN : Details.GSTIN
                    config.rowData["Data"]["SupplierName"] = isSCMParty ? PartyDropdown.label : Details.PartyName
                    config.rowData["Data"]["Date"] = `From  ${_cfunc.date_dmy_func(fromdate)}  To  ${_cfunc.date_dmy_func(todate)}`




                    dispatch(getpdfReportdataSuccess(config.rowData))
                    dispatch(ItemSaleGoButton_API_Success([]));
                }
            }
            else if ((ItemSaleReportGobtn.Status === true) && (ItemSaleReportGobtn.StatusCode === 204)) {
                customAlert({
                    Type: 3,
                    Message: ItemSaleReportGobtn.Message,
                })
                dispatch(ItemSaleGoButton_API_Success([]));
                return
            }
        }
        catch (e) { }

    }, [ItemSaleReportGobtn]);

    const Party_Option = useMemo(() => {
        let options = [];

        options = Party.map((i) => ({
            value: i.id,
            label: i.Name,
            GSTIN: i.GSTIN,
        }));
        options.unshift(allLabelWithZero);
        return options;
    }, [Party]);







async function excel_And_GoBtnHandler(e, btnMode) {
    setLocalLoading(true); // Start spinner
    try {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            PartyType: 0,
            Party: !isSCMParty ? _cfunc.loginPartyID() : PartyDropdown.value,
            Employee: _cfunc.loginEmployeeID(),
            CompanyID: _cfunc.loginCompanyID(),
            ItemID: "0"
        });

        const response = await ItemSaleReport_GoBtn_API({ jsonBody });

        if (response.Status === true) {
            response["BtnMode"] = btnMode;
            dispatch(ItemSaleGoButton_API_Success(response));
        } else {
            customAlert({
                Type: 4,
                Message: response.Message || "Unexpected response from server.",
            }); setLocalLoading(false);
        }
    } catch (error) {
        customAlert({
            Type: 4,
            Message: "An error occurred while fetching the report. Please try again.",
        }); setLocalLoading(false);
        console.error("API Error:", error);
    } finally {
        setLocalLoading(false); // Stop spinner
    }
}



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

    function PartyDrodownOnChange(e) {
        setPartyDropdown(e);
    }


    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2  " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name='fromdate'
                                        value={fromdate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={!IsFranchises ? 3 : 7} className="">
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>To Date</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        nane='todate'
                                        value={todate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {!IsFranchises && < Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Party</Label>
                                <Col sm="8">
                                    <C_Select
                                        name="Party"
                                        value={PartyDropdown}
                                        isSearchable={true}
                                        isDisabled={_cfunc.loginUserIsFranchisesRole()}

                                        isLoading={partyDropdownLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Party_Option}
                                        onChange={PartyDrodownOnChange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>}


                        <Col sm={2} className=" d-flex justify-content-end" >
                        <C_Button
    type="button"
    spinnerColor="white"
    className="btn btn-success m-3 mr"
    loading={localLoading} // ← using useState instead of Redux
    onClick={(e) => excel_And_GoBtnHandler(e, "print")}
>
    Print
</C_Button>

                                {/* <C_Button
                                    type="button"
                                    spinnerColor="white"
                                    loading={PrediocGrnData.BtnMode === "excel"}
                                    className="btn btn-primary m-3 mr"
                                    onClick={(e) => excel_And_GoBtnHandler(e, "excel")}
                                >
                                    Excel
                                </C_Button> */}
                        </Col>
                    </Row>
                </div>



            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default PosSummarySale;