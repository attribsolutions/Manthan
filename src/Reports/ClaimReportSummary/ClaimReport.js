import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { GetVenderSupplierCustomer, getpdfReportdata } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import * as report from '../ReportIndex'
import { ClaimSummary_API, MasterClaimSummary_API } from "../../helpers/backend_helper";
import C_Report from "../../components/Common/C_Report";
import { postClaimMasterCreate_API, postMasterClaimCreat_API_Success } from "../../store/Report/ClaimSummary/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";

const SelectedMonth = () => _cfunc.getCurrentMonthAndYear()
const FirstAndLastDate = () => _cfunc.getFirstAndLastDateOfMonth(SelectedMonth());
const fileds = () => ({
    FromDate: FirstAndLastDate().firstDate,
    ToDate: FirstAndLastDate().lastDate,
    PartyName: "",
    SelectedMonth: SelectedMonth(),
})

const ClaimSummary = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    //function to convert selected month and year to date format initial date


    const [state, setState] = useState(() => initialFiledFunc(fileds()))
    const [subPageMode] = useState(history.location.pathname);
    const [userPageAccessState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            ClaimSummaryGobtn: state.ClaimSummaryReducer.ClaimSummaryGobtn,
            pdfdata: state.PdfReportReducers.pdfdata,
            ReportBtnLoading: (state.PdfReportReducers.ReportBtnLoading) || (state.ClaimSummaryReducer.CreateClaimLoading),
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, supplier, pdfdata, ClaimSummaryGobtn } = reducers;
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
        if ((pdfdata.Status === true) && (pdfdata.StatusCode === 204)) {
            customAlert({
                Type: 3,
                Message: pdfdata.Message,
            })
            return
        }
    }, [pdfdata])

    useEffect(() => {
        if ((ClaimSummaryGobtn.Status === true) && (ClaimSummaryGobtn.StatusCode === 200)) {
            dispatch(postMasterClaimCreat_API_Success([]))
            customAlert({
                Type: 1,
                Message: ClaimSummaryGobtn.Message,
            })
            return
        }
    }, [ClaimSummaryGobtn])

    function goButtonHandler(reportType, row, btnId) {
        
        const jsonBody = JSON.stringify({
            "FromDate": row.selectedDate.FromDate,
            "ToDate": row.selectedDate.ToDate,
            "Party": row.id,
            "Mode": (reportType === report.ClaimSummary) ? 1 : 2
        });
        let config = { ReportType: reportType, jsonBody, btnId: btnId, ToDate: row.selectedDate.ToDate, FromDate: row.selectedDate.FromDate }

        if (reportType === report.CompanyWiseBudget) {
            dispatch(getpdfReportdata(MasterClaimSummary_API, config))
        }
        if (reportType === "createClaim") {
            dispatch(postClaimMasterCreate_API(config))
        }

        if ((reportType === report.CustomerWiseReturn) || (reportType === report.ClaimSummary)) {
            dispatch(getpdfReportdata(ClaimSummary_API, config))
        }
    }


    function MonthAndYearOnchange(e) {
        //function to convert selected month and year to date format first and last date of month
        let selectedMonth = e.target.value
        const { firstDate, lastDate } = _cfunc.getFirstAndLastDateOfMonth(selectedMonth);
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = firstDate;
            a.hasValid.FromDate.valid = true
            a.values.ToDate = lastDate;
            a.hasValid.ToDate.valid = true
            a.values.SelectedMonth = selectedMonth;
            a.hasValid.SelectedMonth.valid = true
            return a
        })
    }

    const pagesListColumns = [
        {
            text: "Party",
            dataField: "Name",
        },

        {
            text: "Action",
            dataField: "",
            style: {
                width: "600px"
            },
            formatExtraData: { btnLoading: reducers.ReportBtnLoading, selectedDate: values },
            formatter: (value, row, key, { btnLoading, selectedDate }) => {
                //selected date push to row to pass json accurate selectdate value format
                row["selectedDate"] = selectedDate
                return (
                    <>
                        <div className=" d-flex justify-content-start  gap-2" >
                            <div
                                className="mt-3  mb-3">
                                <C_Button
                                    loading={btnLoading === `gobtn-${"createClaim"}-${row.id}-${key}`}
                                    forceDisabled={btnLoading}
                                    type="button"
                                    spinnerColor="white"
                                    className="btn btn-success w-md  "
                                    onClick={(e) => { goButtonHandler("createClaim", row, `gobtn-${"createClaim"}-${row.id}-${key}`) }}
                                >
                                    Create
                                </C_Button>
                            </div>

                            <div
                                className="mt-3  mb-3">
                                <C_Button
                                    loading={btnLoading === `gobtn-${report.ClaimSummary}-${row.id}-${key}`}
                                    type="button"
                                    forceDisabled={btnLoading}
                                    spinnerColor="white"
                                    className="btn btn-primary w-md  "
                                    onClick={(e) => { goButtonHandler(report.ClaimSummary, row, `gobtn-${report.ClaimSummary}-${row.id}-${key}`) }}
                                >
                                    Claim Summary
                                </C_Button>
                            </div>


                            <div
                                className="mt-3 mb-3 ">
                                <C_Button
                                    loading={btnLoading === `gobtn-${report.CustomerWiseReturn}-${row.id}-${key}`}
                                    type="button"
                                    forceDisabled={btnLoading}
                                    spinnerColor="white"
                                    className="btn btn-primary w-md  "
                                    onClick={(e) => { goButtonHandler(report.CustomerWiseReturn, row, `gobtn-${report.CustomerWiseReturn}-${row.id}-${key}`) }}
                                >
                                    Customer wise return
                                </C_Button>
                            </div>
                            <div
                                className="mt-3  mb-3">
                                <C_Button
                                    loading={btnLoading === `gobtn-${report.CompanyWiseBudget}-${row.id}-${key}`}
                                    forceDisabled={btnLoading}
                                    type="button"
                                    spinnerColor="white"
                                    className="btn btn-primary w-md  "
                                    onClick={(e) => { goButtonHandler(report.CompanyWiseBudget, row, `gobtn-${report.CompanyWiseBudget}-${row.id}-${key}`) }}
                                >
                                    Master Claim
                                </C_Button>
                            </div>
                        </div>
                    </>
                )
            },
        },


    ];
    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3" >
                                <Label className="col-sm-2 p-2 ">Month</Label>
                                <Col sm="7">
                                    <Input className="form-control"
                                        type="month"
                                        defaultValue={values.SelectedMonth}
                                        id="example-month-input"
                                        onChange={MonthAndYearOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </div>
                </div>

                <div className="mt-2">
                    <ToolkitProvider
                        keyField={"Item_id"}
                        data={supplier}
                        columns={pagesListColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table "  >
                                            <BootstrapTable
                                                keyField={"Item_id"}
                                                id="table_Arrow"
                                                classes={"table  table-bordered table-hover "}
                                                noDataIndication={
                                                    <div className="text-danger text-center table-cursor-pointer">
                                                        Items Not available
                                                    </div>
                                                }
                                                onDataSizeChange={(e) => {
                                                    _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                }}
                                                {...toolkitProps.baseProps}
                                            />
                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>
                                    </Col>
                                </Row>

                            </React.Fragment>
                        )}
                    </ToolkitProvider>
                </div>
            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default ClaimSummary;