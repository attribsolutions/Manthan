import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Row } from "reactstrap";
import C_Report from "../components/Common/C_Report";
import { get_Group_List_Api, Invoice_1_Edit_API_Singel_Get, LoadingSheet_API, MultipleInvoice_API } from "../helpers/backend_helper";
import * as report from '../Reports/ReportIndex'
import { getpdfReportdata, } from "../store/Utilites/PdfReport/actions";

const Report = () => {
    const { pdfdata } = useSelector((state) => ({
        pdfdata: state.PdfReportReducers.pdfdata
    }))
    const downBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
    const dispatch = useDispatch();

    function downBtnFunc() {

        const jsonBody = JSON.stringify({
            InvoiceIDs: [70, 71]
        });
        var ReportType = report.invoiceA5;
        // dispatch(postpdfMultipleReportdata(MultipleInvoice_API,jsonBody,ReportType))
        dispatch(getpdfReportdata(get_Group_List_Api, ReportType))

    }

    function downlodeinvoiceReport() {
        const jsonBody = JSON.stringify({
            InvoiceIDs: [70, 71]
        });

        var ReportType = report.invoice;
        dispatch(getpdfReportdata(MultipleInvoice_API, jsonBody, ReportType))

    }
    function downlodePartyWiseinvoice() {
        var ReportType = report.VanLoadingSheetSKU;
        dispatch(getpdfReportdata(LoadingSheet_API, ReportType, 1))


    }
    function downlodeinvoice() {
        const jsonBody = JSON.stringify({
            InvoiceIDs: [70, 71]
        });
        var ReportType = report;
        dispatch(getpdfReportdata(get_Group_List_Api, jsonBody, ReportType))

    }

    return (
        <React.Fragment>
            <div className="page-content" >
                <Row>
                    <div>
                        <Button
                            style={{ marginLeft: "100px" }}
                            type="button"
                            className={downBtnCss}
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Download`}
                            onClick={() => { downBtnFunc() }}
                        >
                            <i className="bx bx-printer font-size-18"></i>
                        </Button>
                        <span style={{ marginLeft: "10px" }}> invoiceA5</span>


                        <Button
                            style={{ marginLeft: "100px" }}
                            type="button"
                            className={downBtnCss}
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Download`}
                            onClick={() => { downlodeinvoiceReport() }}
                        >
                            <i className="bx bx-printer font-size-18"></i>
                        </Button>
                        <span style={{ marginLeft: "10px" }}> invoice</span>



                        <Button
                            style={{ marginLeft: "100px" }}
                            type="button"
                            className={downBtnCss}
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Download`}
                            onClick={() => { downlodePartyWiseinvoice() }}
                        >
                            <i className="bx bx-printer font-size-18"></i>
                        </Button>
                        <span style={{ marginLeft: "10px" }}> Loadingsheetpartywise</span>







                        <Button
                            style={{ marginLeft: "100px" }}
                            type="button"
                            className={downBtnCss}
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Download`}
                            onClick={() => { downlodeinvoice() }}
                        >
                            <i className="bx bx-printer font-size-18"></i>
                        </Button>
                        <span style={{ marginLeft: "10px" }}>Van Loading Sheet SKU Wise Summary</span>



                    </div>

                </Row>

                <C_Report />


            </div>
        </React.Fragment >
    )
}

export default Report