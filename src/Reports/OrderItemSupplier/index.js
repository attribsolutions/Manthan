import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getpdfReportdata, getpdfReportdataSuccess } from "../../store/actions";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import ReportTableFunc from "../../components/Common/ReportTableFunc";
import { order_Item_Supplier_goBtn_Action, order_Item_Supplier_goBtn_Success } from "../../store/Report/OrderItemSupplierRedux/action";
import * as report from '../../Reports/ReportIndex'

import { OrderItemSupplier_GoButton_API } from "../../helpers/backend_helper";
import C_Report from "../../components/Common/C_Report";

const OrderItemSupplierReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [btnMode, setBtnMode] = useState("");

    const [isChecked, setIsChecked] = useState(false);

    const [updatetableColumn, setupdatetableColumn] = useState([{}]);

    const [updatedpageField, setupdatedpageField] = useState({});






    const reducers = useSelector(
        (state) => ({
            ItemSupplierReduxData: state.OrderItemSupplier_Reducer.ItemSupplierReportGobtn,
            goBtnLoading: state.OrderItemSupplier_Reducer.goBtnLoading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField,
            PDFReportLoading: state.PdfReportReducers.goBtnLoading
        })
    );

    const { userAccess, ItemSupplierReduxData = [], goBtnLoading, pageField, PDFReportLoading } = reducers;

    useEffect(() => {

        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.ORDER_ITEM_SUPPLIER_REPORT));
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));

        return () => {
            dispatch(commonPageFieldSuccess(null));
        }
    }, []);

    const [tableColumns] = DynamicColumnHook({ pageField })


    useEffect(() => {
        console.log(pageField)

        let updatedcolumn = []
        let updatedpageField = []
        if (isChecked) {
            updatedcolumn = tableColumns.filter(item =>
                item.dataField !== "QtyInNo" &&
                item.dataField !== "QtyInKg" &&
                item.dataField !== "QtyInBox"
            );

            updatedpageField = pageField?.PageFieldMaster.filter(item =>
                item.ControlID !== "QtyInNo" &&
                item.ControlID !== "QtyInKg" &&
                item.ControlID !== "QtyInBox"
            );
        } else {
            updatedcolumn = tableColumns.filter(item => item.dataField !== "QuantityWithUnit");
            updatedpageField = pageField?.PageFieldMaster.filter(item =>
                item.ControlID !== "QuantityWithUnit"

            );
        }
        debugger
        if (pageField) {

            const newPageField = {
                ...pageField,
                PageFieldMaster: updatedpageField || [],
            };
            setupdatetableColumn(updatedcolumn)
            setupdatedpageField(newPageField)
        }



    }, [tableColumns, isChecked])

    const values = { ...state.values }

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

        if (btnMode === "excel") {
            if (ItemSupplierReduxData.length > 0) {
                ExcelReportComponent({                // Download CSV
                    pageField: updatedpageField,
                    excelTableData: ItemSupplierReduxData,
                    excelFileName: "Order Item Supplier Report",
                })
                dispatch(order_Item_Supplier_goBtn_Success([]));
            }
        }
        else if (btnMode === "pdf") {
            if (ItemSupplierReduxData.length > 0) {
                dispatch(getpdfReportdataSuccess([]));
            }
        }
    }, [ItemSupplierReduxData]);

    function goAndExcel_Btn_Handler(btnId) {
        setBtnMode(btnId)
        try {
            const jsonBody = JSON.stringify({
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "CompanyID": _cfunc.loginCompanyID(),
                "PartyID": _cfunc.loginPartyID(),
            });

            if (btnId === "pdf") {
                let config = { "FromDate": values.FromDate, "ToDate": values.ToDate, }
                config["ReportType"] = report.ordeItemSupplier;
                config["jsonBody"] = jsonBody;
                config["isChecked"] = isChecked
                dispatch(getpdfReportdata(OrderItemSupplier_GoButton_API, config))
            } else {
                dispatch(order_Item_Supplier_goBtn_Action({ jsonBody }))
            }


        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
        dispatch(order_Item_Supplier_goBtn_Success([]))
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
        dispatch(order_Item_Supplier_goBtn_Success([]))
    }

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked); // Updates the state based on the checkbox value
    };
    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">


                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2  " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={values.FromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "150px" }}>Quantity with Unit</Label>
                                <Col sm="7">
                                    <Input
                                        type="checkbox"
                                        name="checkbox"
                                        className="mt-2 p-2"
                                        checked={isChecked} // Bind checkbox state to isChecked
                                        onChange={handleCheckboxChange} // Handle change
                                    />
                                </Col>
                            </FormGroup>
                        </Col>




                        <Col sm={3} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={PDFReportLoading}
                                className="btn btn-info m-3 mr"
                                onClick={() => goAndExcel_Btn_Handler("pdf")}
                            >
                                PDF
                            </C_Button>

                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(goBtnLoading && btnMode === "show") && true}
                                className="btn btn-success m-3 mr"
                                onClick={() => goAndExcel_Btn_Handler("show")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(goBtnLoading && btnMode === "excel") && true}
                                className="btn btn-primary m-3 mr "
                                onClick={() => goAndExcel_Btn_Handler("excel")}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>

                <div className="mt-1">
                    <ReportTableFunc
                        keyField="id"
                        tableData={ItemSupplierReduxData}
                        columns={updatetableColumn}
                    />
                </div>
            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default OrderItemSupplierReport;