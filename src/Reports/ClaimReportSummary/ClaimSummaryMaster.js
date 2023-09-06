import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess, getpdfReportdata, getpdfReportdataSuccess } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import * as report from '../ReportIndex'
import { ClaimSummary_API, MasterClaimSummary_API } from "../../helpers/backend_helper";
import C_Report from "../../components/Common/C_Report";
import { claimList_API, claimList_API_Success, deleteClaimSuccess, delete_Claim_ID, postClaimMasterCreate_API, postMasterClaimCreat_API_Success } from "../../store/Report/ClaimSummary/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";

const CWClaimBtnCss = "badge badge-soft-primary font-size-18 btn btn-primary waves-effect waves-light w-xxs border border-light"
const createClaimBtnCss = "badge badge-soft-success font-size-18 btn btn-success waves-effect waves-light w-xxs border border-light"
const deltBtnCss = "badge badge-soft-danger font-size-18 btn btn-danger waves-effect waves-light w-xxs border border-light"


const SelectedMonth = () => _cfunc.getCurrentMonthAndYear()
const FirstAndLastDate = () => _cfunc.getFirstAndLastDateOfMonth(SelectedMonth());
const fileds = () => ({
    FromDate: FirstAndLastDate().firstDate,
    ToDate: FirstAndLastDate().lastDate,
    PartyName: "",
    HeaderFromDate: _cfunc.date_ymd_func(),
    HeaderToDate: _cfunc.date_ymd_func(),
    SelectedMonth: SelectedMonth(),
})



const ClaimSummaryMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    //function to convert selected month and year to date format initial date

    const [state, setState] = useState(() => initialFiledFunc(fileds()))
    const [subPageMode] = useState(history.location.pathname);
    const [userPageAccessState, setUserAccState] = useState('');
    const [jsonBody, setjsonBody] = useState({});




    const reducers = useSelector(
        (state) => ({
            deleteMsg: state.ClaimSummaryReducer.deleteMsg,
            ClaimListData: state.ClaimSummaryReducer.ClaimListData,
            ClaimSummaryGobtn: state.ClaimSummaryReducer.ClaimSummaryGobtn,
            pdfdata: state.PdfReportReducers.pdfdata,
            ReportBtnLoading: (state.PdfReportReducers.ReportBtnLoading) || (state.ClaimSummaryReducer.CreateClaimLoading) || (state.ClaimSummaryReducer.DeleteBtnLoading),
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, supplier, pdfdata, ClaimSummaryGobtn, deleteMsg, ClaimListData } = reducers;
    // const filteredData = ClaimListData.filter(Party => Party.id === null);
    ClaimListData.sort((a, b) => b.returncnt - a.returncnt);

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
        // const page_Id = pageId.CLAIM_SUMMARY_MASTER//changes
        // dispatch(commonPageFieldSuccess(null));
        // dispatch(commonPageField(page_Id))
        MonthAndYearOnchange(values.SelectedMonth, "InitialDate")
        return () => {
            dispatch(claimList_API_Success([]))
        }
    }, [])


    useEffect(() => {
        if ((pdfdata.Status === true) && (pdfdata.StatusCode === 204)) {
            dispatch(getpdfReportdataSuccess({ Status: false }))
            customAlert({
                Type: 3,
                Message: pdfdata.Message,
            })
            return
        }
    }, [pdfdata])

    useEffect(() => {
        if ((ClaimSummaryGobtn.Status === true) && (ClaimSummaryGobtn.StatusCode === 200)) {
            dispatch(claimList_API(jsonBody))
            dispatch(postMasterClaimCreat_API_Success([]))
            customAlert({
                Type: 1,
                Message: ClaimSummaryGobtn.Message,

            })
            history.push({ pathname: url.CLAIM_SUMMARY_lIST })
            return
        }
    }, [ClaimSummaryGobtn])


    useEffect(() => {
        if ((deleteMsg.Status === true) && (deleteMsg.StatusCode === 200)) {
            dispatch(deleteClaimSuccess({ Status: false }))
            dispatch(claimList_API(jsonBody))
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
            "Party": row.PartyID,
            "Mode": (reportType === report.ClaimSummary) ? 1 : 2,
            "LoginParty": (reportType === "createClaim") ? _cfunc.loginSelectedPartyID() : undefined,
        });
        let config = { ReportType: reportType, jsonBody, btnId: btnId, ToDate: row.selectedDate.ToDate, FromDate: row.selectedDate.FromDate, ClaimID: row.id, PartyName: row.PartyName }

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
            "Party": row.PartyID,
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

    function MonthAndYearOnchange(e, InitialDate) {
        dispatch(claimList_API_Success([]))

        let selectedMonth = ""
        if (InitialDate) {
            selectedMonth = e
        } else {
            selectedMonth = e.target.value
        }
        //function to convert selected month and year to date format first and last date of month

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
        const jsonBody = JSON.stringify({
            "FromDate": firstDate,
            "ToDate": lastDate,
            "Party": _cfunc.loginSelectedPartyID()
        });


        let config = { jsonBody }
        setjsonBody(config)
        dispatch(claimList_API(config))
    }

    const getFormattedDate = (date, format) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return format.replace('yyyy', year).replace('MM', month);
    };

    const currentMonth = getFormattedDate(new Date(), "yyyy-MM");

    const pagesListColumns = [

        {
            text: "Party",
            dataField: "PartyName",
        },
        {
            text: "Return Count",
            dataField: "returncnt",
            formatter: (cellContent, index) => (
                <>
                    <div >{`${Number(index.returncnt) === 0 ? "0" : index.returncnt}`}</div>
                </>
            )

        },

        {
            text: "Action",
            dataField: "",
            style: {
                width: "300px"
            },
            formatExtraData: { btnLoading: reducers.ReportBtnLoading, selectedDate: values },
            formatter: (value, row, key, { btnLoading, selectedDate }) => {
                row["selectedDate"] = selectedDate
                // Condition For Claim Generation 
                // 1) row Id is (Not Null) then Claim is all Ready Created Will not Show in Master page Table
                // 2) Logged-in-User Can Not Creat Claim or delete claim 
                // 3) If Return Count Is greater than 0 then only claim create  
                return (
                    <>

                        <div className=" d-flex justify-content-start  gap-2" >
                            <div
                                className="mt-3  mb-3">
                                <C_Button
                                    loading={btnLoading === `gobtn-${"createClaim"}-${row.id}-${key}`}
                                    type="button"
                                    style={{ width: "100px", cursor: ((Number(row.id) === 0) && (Number(row.returncnt) > 0)) ? "pointer" : "not-allowed" }}
                                    title="Create Claim"
                                    spinnerColor="white"
                                    className={((Number(row.returncnt) === 0) || (row.forceCreateHide)) ? deltBtnCss : createClaimBtnCss}
                                    onClick={(e) => {
                                        if ((Number(row.returncnt) > 0) && (!row.forceCreateHide)) {
                                            goButtonHandler("createClaim", row, `gobtn-${"createClaim"}-${row.id}-${key}`)
                                        }
                                    }}
                                >
                                    {(Number(row.id) > 0) ? "Created" : "Create"}
                                    {((Number(row.returncnt) > 0) && (!row.forceCreateHide)) && <i className="fas fa-pencil-alt font-size-13"></i>}
                                    {((Number(row.returncnt) === 0) || (row.forceCreateHide)) && <i className="  fas fa-ban font-size-13"></i>}


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
                                <Label style={{ width: "83px" }} className="col-sm-1 p-2 ">Month</Label>
                                <Col sm="4">
                                    <Input className="form-control"
                                        type="month"
                                        defaultValue={values.SelectedMonth}
                                        id="example-month-input"
                                        onChange={MonthAndYearOnchange}
                                        max={currentMonth}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </div>
                </div>

                <div className="mt-2">
                    <ToolkitProvider
                        keyField={"Item_id"}
                        data={ClaimListData}
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

export default ClaimSummaryMaster;