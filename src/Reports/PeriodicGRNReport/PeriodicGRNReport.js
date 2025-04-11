import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import C_Report from "../../components/Common/C_Report";
import { stockReport_1_GoButton_API_Success } from "../../store/Report/StockReport/action";
import { commonPageField, commonPageFieldSuccess, getpdfReportdata, getpdfReportdataSuccess, GetVenderSupplierCustomer, goButtonPartyItemAddPage } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import * as report from '../ReportIndex'
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";

import { Periodic_GRN_Report, Periodic_GRN_Report_Success } from "../../store/Report/PeriodicGRNRedux/action";
import { GenralMasterSubType, Periodic_Grn_Report_Api } from "../../helpers/backend_helper";
import Select from "react-select";
import { allLabelWithBlank } from "../../components/Common/CommonErrorMsg/HarderCodeData";

const PeriodicGRNReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();


    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');


    const [SupplierSelect, setSupplierSelect] = useState(allLabelWithBlank);
    const [GRNTypeSelect, setGRNTypeSelect] = useState(allLabelWithBlank);
    const [ItemSelect, setItemSelect] = useState(allLabelWithBlank);
    const [GRNTypeOptions, setGRNTypeOptions] = useState([]);







    const reducers = useSelector(
        (state) => ({
            BtnLoading: state.PdfReportReducers.BtnLoading,
            PrediocGrnData: state.PeriodicGrnReportReducer.PrediocGrnData,
            pdfdata: state.PdfReportReducers.pdfdata,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField,
            ItemList: state.PartyItemsReducer.partyItem,
            supplierListOnPartyType: state.CommonAPI_Reducer.vendorSupplierCustomer,

        })
    );
    const { userAccess, BtnLoading, PrediocGrnData, pageField, pdfdata, supplierListOnPartyType, ItemList } = reducers

    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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
        dispatch(commonPageField(pageId.PERIODIC_GRN_REPORT_));
        const jsonBody = JSON.stringify({ ..._cfunc.loginJsonBody(), "PartyID": _cfunc.loginSelectedPartyID() });
        dispatch(goButtonPartyItemAddPage({ jsonBody }));
        dispatch(
            GetVenderSupplierCustomer({
                subPageMode: url.ORDER_LIST_2,
                PartyID: _cfunc.loginSelectedPartyID(),
                RouteID: "",
            }));
        return () => {
            dispatch(commonPageFieldSuccess(null));
        }
    }, [])

    useEffect(async () => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 198,
        });

        const resp = await GenralMasterSubType(jsonBody);
        if (resp.StatusCode === 200) {

            const GRNTypeOptions = resp.Data.map((index) => ({
                value: index.id,
                label: index.Name,
            }));

            GRNTypeOptions.unshift(allLabelWithBlank);

            setGRNTypeOptions(GRNTypeOptions);
        }

    }, [])


    useEffect(() => {

        try {
            if ((PrediocGrnData.Status === true) && (PrediocGrnData.StatusCode === 200)) {
                if (PrediocGrnData.BtnMode === "excel") {
                    ExcelReportComponent({
                        pageField,
                        excelTableData: PrediocGrnData.Data,
                        excelFileName: "Periodic GRN Report"
                    })
                    dispatch(Periodic_GRN_Report_Success({ status: false }));
                } else if (PrediocGrnData.BtnMode === "print") {
                    let config = { rowData: { Data: [] } }
                    config.rowData["ReportType"] = report.PeriodicGRN;
                    config.rowData["Status"] = PrediocGrnData.Status
                    config.rowData["StatusCode"] = PrediocGrnData.StatusCode
                    config.rowData["Data"] = PrediocGrnData.Data
                    config.rowData["Data"]["FromDate"] = fromdate
                    config.rowData["Data"]["ToDate"] = todate

                    dispatch(getpdfReportdataSuccess(config.rowData))
                    dispatch(Periodic_GRN_Report_Success({ status: false }));
                }
            }
            else if ((PrediocGrnData.Status === true) && (PrediocGrnData.StatusCode === 204)) {
                customAlert({
                    Type: 3,
                    Message: PrediocGrnData.Message,
                })
                dispatch(Periodic_GRN_Report_Success({ status: false }));
                return
            }
        }
        catch (e) { }

    }, [PrediocGrnData]);

    useEffect(() => {
        debugger
        try {
            if (PrediocGrnData.BtnMode === "print") {
                if ((pdfdata.Status === true) && (pdfdata.StatusCode === 204)) {
                    customAlert({
                        Type: 3,
                        Message: alertMessages.recordNotAvailable,
                    })
                    return
                }
            }
            dispatch(stockReport_1_GoButton_API_Success([]));
        }
        catch (e) { }

    }, [pdfdata]);

    const Supplier_Options = supplierListOnPartyType.map(i => ({
        value: i.id,
        label: i.Name
    }));
    Supplier_Options.unshift(allLabelWithBlank);




    const Item_Options = ItemList.map(i => ({
        value: i.Item,
        label: i.ItemName
    }));
    Item_Options.unshift(allLabelWithBlank);



    function excel_And_GoBtnHandler(e, btnMode) {

        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            PartyID: _cfunc.loginSelectedPartyID(),
            SupplierID: SupplierSelect.value,
            ItemID: ItemSelect.value,
            GRNTypeID: GRNTypeSelect.value,

        });
        let config = { jsonBody, BtnMode: btnMode }
        dispatch(Periodic_GRN_Report(config))
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

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={2} className="">
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

                        <Col sm={2} className="">
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
                        <Col sm={2} className="">
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>Item</Label>
                                <Col sm="8">
                                    <Select
                                        name="Item"
                                        value={ItemSelect}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        options={Item_Options}
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        onChange={(e) => { setItemSelect(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>  <Col sm={2} className="">
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>Supplier</Label>
                                <Col sm="7">
                                    <Select
                                        name="Supplier"
                                        value={SupplierSelect}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        options={Supplier_Options}
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        onChange={(e) => { setSupplierSelect(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>  <Col sm={2} className="">
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "80px" }}>GRN Type</Label>
                                <Col sm="7">
                                    <Select
                                        name="GRNType"
                                        value={GRNTypeSelect}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        options={GRNTypeOptions}
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        onChange={(e) => { setGRNTypeSelect(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col sm={2} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                className="btn btn-success m-3 mr"
                                loading={PrediocGrnData.BtnMode === "print"}
                                onClick={(e) => excel_And_GoBtnHandler(e, "print")}
                            >
                                Print
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={PrediocGrnData.BtnMode === "excel"}
                                className="btn btn-primary m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler(e, "excel")}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>



            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default PeriodicGRNReport;