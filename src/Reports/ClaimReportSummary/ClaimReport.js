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
import { deleteClaimSuccess, delete_Claim_ID, postClaimMasterCreate_API, postMasterClaimCreat_API_Success } from "../../store/Report/ClaimSummary/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { deltBtnCss } from "../../components/Common/ListActionsButtons";

const SelectedMonth = () => _cfunc.getCurrentMonthAndYear()
const FirstAndLastDate = () => _cfunc.getFirstAndLastDateOfMonth(SelectedMonth());
const fileds = () => ({
    FromDate: FirstAndLastDate().firstDate,
    ToDate: FirstAndLastDate().lastDate,
    PartyName: "",
    SelectedMonth: SelectedMonth(),
})
const createClaimBtnCss = "badge badge-soft-success font-size-18 btn btn-success waves-effect waves-light w-xxs border border-light"
const ClaimBtnCss = "badge badge-soft-info font-size-18 btn btn-info waves-effect waves-light w-xxs border border-light"
const CWClaimBtnCss = "badge badge-soft-primary font-size-18 btn btn-primary waves-effect waves-light w-xxs border border-light"




const ClaimSummary = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    //function to convert selected month and year to date format initial date


    const [state, setState] = useState(() => initialFiledFunc(fileds()))
    const [subPageMode] = useState(history.location.pathname);
    const [userPageAccessState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            deleteMsg: state.ClaimSummaryReducer.deleteMsg,
            ClaimSummaryGobtn: state.ClaimSummaryReducer.ClaimSummaryGobtn,
            pdfdata: state.PdfReportReducers.pdfdata,
            ReportBtnLoading: (state.PdfReportReducers.ReportBtnLoading) || (state.ClaimSummaryReducer.CreateClaimLoading) || (state.ClaimSummaryReducer.DeleteBtnLoading),
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, supplier, pdfdata, ClaimSummaryGobtn, deleteMsg } = reducers;
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


    useEffect(() => {
        if ((deleteMsg.Status === true) && (deleteMsg.StatusCode === 200)) {
            dispatch(deleteClaimSuccess({ Status: false }))
            customAlert({
                Type: 1,
                Message: deleteMsg.Message,
            })
            return
        }
    }, [deleteMsg])

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

    const deleteHandler = async (row, btnId) => {
        const jsonBody = JSON.stringify({
            "FromDate": row.selectedDate.FromDate,
            "ToDate": row.selectedDate.ToDate,
            "Party": row.id,
        });
        let config = { jsonBody, btnId: btnId }

        const isConfirmed = await customAlert({
            Type: 7,
            Message: "Do you want To Delete Claim ?",
        });

        if (isConfirmed) {
            dispatch(delete_Claim_ID(config))
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
                width: "300px"
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
                                    type="button"
                                    style={{ width: "100px" }}
                                    title="Create Claim"
                                    spinnerColor="white"
                                    className={createClaimBtnCss}
                                    onClick={(e) => { goButtonHandler("createClaim", row, `gobtn-${"createClaim"}-${row.id}-${key}`) }}
                                >
                                    create<i className="fas fa-pencil-alt"></i>

                                </C_Button>
                            </div>

                            <div
                                className="mt-3  mb-3">
                                <C_Button
                                    loading={btnLoading === `gobtn-${report.ClaimSummary}-${row.id}-${key}`}
                                    type="button"
                                    title="Claim Summary"
                                    spinnerColor="white"
                                    className={CWClaimBtnCss}
                                    onClick={(e) => { goButtonHandler(report.ClaimSummary, row, `gobtn-${report.ClaimSummary}-${row.id}-${key}`) }}
                                >
                                    <i className=" fas fa-file-signature"></i>

                                </C_Button>
                            </div>


                            <div
                                className="mt-3 mb-3 ">
                                <C_Button
                                    loading={btnLoading === `gobtn-${report.CustomerWiseReturn}-${row.id}-${key}`}
                                    type="button"
                                    title="Customer Wise Summary"
                                    spinnerColor="white"
                                    className={CWClaimBtnCss}
                                    onClick={(e) => { goButtonHandler(report.CustomerWiseReturn, row, `gobtn-${report.CustomerWiseReturn}-${row.id}-${key}`) }}
                                >
                                    <i className="fas fa-file-contract"></i>


                                </C_Button>
                            </div>
                            <div
                                className="mt-3  mb-3">
                                <C_Button
                                    loading={btnLoading === `gobtn-${report.CompanyWiseBudget}-${row.id}-${key}`}

                                    type="button"
                                    title="Master Claim Summary"
                                    spinnerColor="white"
                                    className={CWClaimBtnCss}
                                    onClick={(e) => { goButtonHandler(report.CompanyWiseBudget, row, `gobtn-${report.CompanyWiseBudget}-${row.id}-${key}`) }}
                                >
                                    <i className="far fa-file-alt"></i>
                                </C_Button>




                            </div>
                            <div
                                className="mt-3  mb-3">
                                <C_Button
                                    loading={btnLoading === `deletebtn-${row.id}-${key}`}
                                    type="button"
                                    title="Delete Claim"
                                    spinnerColor="white"
                                    className={deltBtnCss}
                                    onClick={(e) => { deleteHandler(row, `deletebtn-${row.id}-${key}`) }}
                                >
                                    <i className="mdi mdi-delete font-size-20"></i>
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
                        <Col sm={6}>
                            <FormGroup className="mb- row mt-2" >
                                <Label className="col-sm-1 p-2 ">Month</Label>
                                <Col sm="4">
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
                                                        Record Not available
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