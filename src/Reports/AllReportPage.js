import React from "react";
import { useDispatch } from "react-redux";
import { Button, Input } from "reactstrap";
import { makeBtnCss } from "../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import PurchaseListPage from "../components/Common/ComponentRelatedCommonFile/purchase";
import { Invoice_1_Edit_API_Singel_Get } from "../helpers/backend_helper";
import * as report from '../Reports/ReportIndex'
import { getpdfReportdata } from "../store/Utilites/PdfReport/actions";

const Report = () => {
const downBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
    const dispatch = useDispatch();


    function downBtnFunc() {
        var ReportType = report.invoiceA5;
        dispatch(getpdfReportdata(Invoice_1_Edit_API_Singel_Get, ReportType,1))
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
                
            </div>
        </React.Fragment >
    )
}

export default Report