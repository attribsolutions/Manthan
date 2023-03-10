import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "reactstrap";
import C_Report from "../components/Common/ComponentRelatedCommonFile/C_Report";
import { MultipleInvoice_API } from "../helpers/backend_helper";
import  * as report from '../Reports/ReportIndex'
import {  postpdfMultipleReportdata } from "../store/Utilites/PdfReport/actions";

const Report = () => {
    const { pdfdata } = useSelector((state) => ({
        pdfdata: state.PdfReportReducers.pdfdata
    }))
const downBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
    const dispatch = useDispatch();

    function downBtnFunc() {

        const jsonBody = JSON.stringify({
                InvoiceIDs:[ 70,71]
            
        });

        var ReportType = report.invoiceA5;
        dispatch(postpdfMultipleReportdata(MultipleInvoice_API,jsonBody,ReportType))
    }
    return (
        <React.Fragment>
            <div className="page-content" >
                <Button
                    type="button"
                    className={downBtnCss}
                    data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Download`}
                    onClick={() => {downBtnFunc() }}
                >     
                    <i className="bx bx-printer font-size-18"></i>
                </Button>
            <C_Report />
                

            </div>
        </React.Fragment >
    )
}

export default Report