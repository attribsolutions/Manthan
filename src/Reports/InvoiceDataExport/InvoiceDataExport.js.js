import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import * as XLSX from 'xlsx';
import { GetVenderSupplierCustomer } from "../../store/actions";
import C_Report from "../../components/Common/C_Report";
import { postInvoiceDataExport_API, postInvoiceDataExport_API_Success } from "../../store/Report/InvoiceDataExportRedux/action";

const InvoiceDataExport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();



    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [subPageMode] = useState(history.location.pathname);
    const [userPageAccessState, setUserAccState] = useState('');



    const reducers = useSelector(
        (state) => ({
            pdfdata: state.PdfReportReducers.pdfdata,
            tableData: state.InvoiceDataExportReducer.InvoiceDataExportGobtn,
            goBtnLoading: state.PdfReportReducers.goBtnLoading,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, tableData = [] } = reducers;
    const { InvoiceExportSerializerDetails = [] } = tableData;

    debugger
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
        dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))

    }, [])




    useEffect(() => {
        if (InvoiceExportSerializerDetails.length > 1) {

            const worksheet = XLSX.utils.json_to_sheet(InvoiceExportSerializerDetails);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "ProductMargin1");
            XLSX.writeFile(workbook, "Product Margin Report.xlsx");
            dispatch(postInvoiceDataExport_API_Success([]));
        }
    }, [tableData]);


    function excelhandler() {
        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Party": _cfunc.loginPartyID(),
        });
        let config = { jsonBody }
        dispatch(postInvoiceDataExport_API(config))
    }




    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={5} className="">
                            <FormGroup className="mb- row mt-3 mb-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={values.FromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm={5} className="">
                            <FormGroup className="mb- row mt-3 mb-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm={2} className="mt-3 ">
                            <Go_Button onClick={(e) => { excelhandler() }} loading={reducers.goBtnLoading} />
                        </Col>
                    </div>
                </div>
            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default InvoiceDataExport;