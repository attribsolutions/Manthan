import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { Return_Report_Action, Return_Report_Action_Success } from "../../store/Report/ReturnReportRedux/action";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import GlobalCustomTable from "../../GlobalCustomTable";
import { changeCommonPartyDropDetailsAction } from "../../store/Utilites/PartyDrodown/action";
import { allLabelWithBlank } from "../../components/Common/CommonErrorMsg/HarderCodeData";
import { BillBooking_Report_Action, BillBooking_Report_Action_Success } from "../../store/Report/BillBookingRedux/action";

const BillBookingReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');
    const [distributorDropdown, setDistributorDropdown] = useState([allLabelWithBlank]);
    const [tableData, setTableData] = useState([]);
    const [btnMode, setBtnMode] = useState(0);

    const {
        goButtonData,
        pageField,
        userAccess,
        Distributor,
    } = useSelector((state) => ({
        goButtonData: state.BillBookingReportReducer.returnReportData,
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
        Distributor: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    })
    );

    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.BILL_BOOKING_REPORT))
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        dispatch(changeCommonPartyDropDetailsAction({ isShow: false }))//change party drop-down show false

        return () => {
            setTableData([]);
        }
    }, []);

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
        if (tableData.length === 0) {
            setBtnMode(0)
        }
    }, [tableData]);


    // const [tableColumns] = DynamicColumnHook({ pageField, })


    const Columns = [
        {
            text: "Date",
            dataField: "GRNDate",

        },
        {
            text: "BillNumber",
            dataField: "BillNumber",

        },
        {
            text: "Particulars",
            dataField: "AchAmountWithGST",
            formatter: (cell, row) => {
                debugger
                return (<>
                    <table style={{ width: "100%" }}>
                        <tbody>
                            <tr>
                                <td>Purchases</td>
                            </tr>
                            <tr>
                                <td>CGST</td>
                            </tr>
                            <tr>
                                <td>SGST</td>
                            </tr>
                            <tr>
                                <td>{row.SupplierName}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
                );
            },


        },
        {
            text: "Debit",
            dataField: "Debit",
            align: "right",
            formatter: (cell, row) => {
                debugger
                return (<>
                    <table style={{ width: "100%" }}>
                        <tbody>
                            <tr>
                                <td>{row.Debit}</td>
                            </tr>
                            <tr>
                                <td>{row.CGST}</td>
                            </tr>
                            <tr>
                                <td>{row.SGST}</td>
                            </tr>
                            <tr>
                                <td>{"0"}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
                );
            },

        },
        {
            text: "Credit",
            dataField: "Credit",
            align: "right",
            formatter: (cell, row) => {
                debugger
                return (<>
                    <table style={{ width: "100%" }}>
                        <tbody>
                            <tr>
                                <td>{"0"}</td>
                            </tr>
                            <tr>
                                <td>{"0 "}</td>
                            </tr>
                            <tr>
                                <td>{" 0"}</td>
                            </tr>
                            <tr>
                                <td>{row.Credit}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
                );
            },

        },



    ];

    useEffect(() => {

        try {
            if ((goButtonData.Status === true) && (goButtonData.StatusCode === 200)) {
                setBtnMode(0);

                if (btnMode === 2) {
                    ExcelReportComponent({      // Download CSV
                        pageField,
                        excelTableData: goButtonData.Data,
                        excelFileName: "Bill Booking Report"
                    })
                    dispatch(BillBooking_Report_Action_Success([]));

                }
                else {
                    const UpdatedTableData = goButtonData.Data.map((item, index) => {
                        return {
                            ...item, id: index + 1,
                        };
                    });
                    setTableData(UpdatedTableData);
                    dispatch(BillBooking_Report_Action_Success([]));
                }
            }
            else if ((goButtonData.Status === true)) {
                setTableData([]);
            }
            setBtnMode(0);
        }
        catch (e) { }

    }, [goButtonData]);

    function excel_And_GoBtnHandler(e, Btnmode) {
        setBtnMode(Btnmode);
        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Party": _cfunc.loginPartyID(),
        });
        let config = { jsonBody }
        dispatch(BillBooking_Report_Action(config));
    }

    function fromdateOnchange(e, date) {

        let newObj = { ...headerFilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
        setTableData([]);
    }

    function todateOnchange(e, date) {

        let newObj = { ...headerFilters }
        newObj.todate = date
        setHeaderFilters(newObj);
        setTableData([]);
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
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={fromdate}
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
                                        value={todate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col sm={6} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 1 && true}
                                className="btn btn-success m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler(e, 1)}
                            >
                                Show
                            </C_Button>
                            {/* <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 2 && true}
                                className="btn btn-primary m-3 mr "
                                onClick={(e) => excel_And_GoBtnHandler(e, 2)}
                            >
                                Excel
                            </C_Button> */}
                        </Col>
                    </Row>
                </div>
                <div className="mb-1">
                    <GlobalCustomTable
                        keyField={"id"}
                        data={tableData}
                        columns={Columns}
                        id="table_Arrow"
                        noDataIndication={
                            <div className="text-danger text-center ">
                                Items Not available
                            </div>
                        }
                        onDataSizeChange={({ dataCount, }) => {
                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                        }}
                    />
                </div>


            </div>

        </React.Fragment >
    )
}

export default BillBookingReport;