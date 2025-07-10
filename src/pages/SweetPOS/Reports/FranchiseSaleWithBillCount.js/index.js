import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../../../components/Common/CommonButton";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../../store/actions";
import DynamicColumnHook from "../../../../components/Common/TableCommonFunc";
import { C_DatePicker } from "../../../../CustomValidateForm";
import { ExcelReportComponent } from "../../../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import GlobalCustomTable from "../../../../GlobalCustomTable";
import { Franchise_Sale_With_Bill_Count_API } from "../../../../helpers/backend_helper";
import { downloadExcel } from "./ExcelDownload";

const FranchiseSaleWithBillCount = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [fromDate, setFromDate] = useState(currentDate_ymd)
    const [toDate, setToDate] = useState(currentDate_ymd)
    const [clientWiseBill, setClientWiseBill] = useState(false)
    debugger

    const [userPageAccessState, setUserAccState] = useState('');
    const [btnMode, setBtnMode] = useState("");
    const [apiResponse, setApiResponse] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [GoBtnLoading, setGoBtnLoading] = useState(false);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const {
        userAccess,
        pageField
    } = useSelector((state) => ({
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    useEffect(() => {
        if (apiResponse.length > 0) {
            const newList = apiResponse.map((i) => {
                i["recordsAmountTotal"] = i.GrandTotal;  // Breadcrumb Count total
                return i
            })
            setTableData(newList)
        }
    }, [apiResponse])

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.FRANCHAISE_SALE_WITH_BILL_COUNT));
        dispatch(BreadcrumbShowCountlabel(`Count:${0} currency_symbol ${0.00}`));
        return () => {
            dispatch(commonPageFieldSuccess(null));
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

    // const [tableColumns] = DynamicColumnHook({ pageField })


    useEffect(() => {
        if (btnMode === "downloadExcel") {
            if (tableData.length > 0) {
                if (!clientWiseBill) {
                    ExcelReportComponent({      // Download CSV
                        pageField,
                        excelTableData: tableData,
                        excelFileName: "Franchise Sale With Bill Count Report"
                    })
                    setTableData([]);
                    setApiResponse([]);
                } else {
                    downloadExcel(tableData, "Franchise_Sale_With_Bill_Count_Report")
                    setTableData([]);
                    setApiResponse([]);
                }
            }
        }
    }, [tableData, pageField]);

    async function goButtonHandler(goBtnMode) {
        setBtnMode(goBtnMode)
        try {
            const jsonBody = JSON.stringify({
                "FromDate": fromDate,
                "ToDate": toDate,
                "EmployeeID": _cfunc.loginEmployeeID(),
            })
            setGoBtnLoading(true)
            let resp = await Franchise_Sale_With_Bill_Count_API({ jsonBody });

            if (resp.StatusCode === 200) {

                resp.Data = resp.Data.map(entry => {
                    const totalBills = entry.BillDetails.reduce((sum, bill) => sum + bill.Bills, 0);
                    const totalGrand = entry.BillDetails.reduce(
                        (sum, bill) => sum + parseFloat(bill.GrandTotal),
                        0
                    );
                    return {
                        ...entry,
                        Bills: totalBills,
                        GrandTotal: totalGrand.toFixed(2)
                    };
                });
                debugger
                setApiResponse(resp.Data);
            }
            setGoBtnLoading(false)

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function fromdateOnchange(e, date) {
        setFromDate(date)
        setTableData([]);
        setApiResponse([]);
    }

    function todateOnchange(e, date) {
        setToDate(date);
        setTableData([]);
        setApiResponse([]);
    }

    const columns = [
        {
            dataField: "Name",
            text: "Franchise",
        },
        {
            dataField: "Bills",
            text: "Bill Count",
        },
        {
            dataField: "GrandTotal",
            text: "Bill Amount",
        },

        {
            dataField: "BillDetails",
            text: "Client Details",
            formatExtraData: clientWiseBill,
            hidden: !clientWiseBill,
            formatter: (cell, row) => {
                return (
                    <GlobalCustomTable
                        keyField="ClientID"
                        data={cell}
                        columns={[
                            { dataField: "ClientID", text: "Client ID" },
                            { dataField: "Bills", text: "Bills" },
                            { dataField: "GrandTotal", text: "Total" },
                            {
                                dataField: "LastBillTime",
                                text: "Last Bill Time",
                                formatter: (time) => _cfunc.DateTime(time)
                            }
                        ]}
                        isPaginationTotalStandalone={false}
                        bordered
                        condensed
                        wrapperClasses="table-sm"
                    />
                );
            }
        }
    ];

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
                                        value={fromDate}
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
                                        value={toDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col sm={3}>
                            <FormGroup className="">
                                <Row className="mt-2">
                                    <Label
                                        className="col-sm-4 col-form-label">
                                        Client Wise Bill
                                    </Label>
                                    <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                        <div className="form-check form-switch form-switch-md ">
                                            <Input
                                                type="checkbox"
                                                className="form-check-input"
                                                defaultChecked={clientWiseBill}

                                                onChange={(e) => {
                                                    debugger
                                                    setClientWiseBill(e.target.checked)
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>


                        <Col sm={3} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={((GoBtnLoading) && (btnMode === "showOnTable")) && true}
                                className="btn btn-success m-3 mr"

                                onClick={() => goButtonHandler("showOnTable")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={((GoBtnLoading) && (btnMode === "downloadExcel")) && true}
                                className="btn btn-primary m-3 mr"
                                onClick={() => goButtonHandler("downloadExcel")}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>

                <GlobalCustomTable
                    keyField="id"
                    data={tableData}
                    columns={columns}
                    bordered
                />


            </div>
        </React.Fragment >
    )
}

export default FranchiseSaleWithBillCount;