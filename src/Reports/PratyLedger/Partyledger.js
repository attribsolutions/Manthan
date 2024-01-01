import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc, } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { pageId, url, } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess, commonPageField, commonPageFieldSuccess, getpdfReportdata, getpdfReportdataSuccess } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import * as report from '../ReportIndex'
import { PartyLedgerReport_API } from "../../helpers/backend_helper";
import C_Report from "../../components/Common/C_Report";
import PartyDropdown_Common from "../../components/Common/PartyDropdown";
import * as ExcelJS from 'exceljs';
const XLSX = require('xlsx');

const PartyLedger = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Customer: '',
        Party: '',
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [subPageMode] = useState(history.location.pathname);
    const [userPageAccessState, setUserAccState] = useState('');
    const [tableData, setTableData] = useState([]);
    const [btnMode, setBtnMode] = useState(false);

    const reducers = useSelector(
        (state) => ({
            pdfdata: state.PdfReportReducers.pdfdata,
            goBtnLoading: state.PdfReportReducers.goBtnLoading,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            customerDropdownLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
            // partyDropdownLoading: state.CommonPageFieldReducer.pageFieldList,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );
    const { userAccess, supplier, pdfdata, customerDropdownLoading, partyDropdownLoading, goBtnLoading } = reducers;

    const values = { ...state.values }

    // userAccess useEffect
    useEffect(() => {
        let locationPath = history.location.pathname;
        const userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.PARTY_LEDGER));
        dispatch(GetVenderSupplierCustomer({ subPageMode, "PartyID": _cfunc.loginSelectedPartyID() }));
        return () => {
            dispatch(GetVenderSupplierCustomerSuccess([]));
            dispatch(commonPageFieldSuccess(null));
        };
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
        try {
            if (tableData.length > 0) {
                excelDownloadFunc(tableData)
            }
        } catch (e) { }
    }, [tableData]);

    const customerDropdownOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }))
    const partyDropdounOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }))

    const customerOnChangehandler = (e) => {
        setState((i) => {
            const a = { ...i }
            a.values.Customer = e;
            a.hasValid.Customer.valid = true
            return a
        })
    }

    const partyOnChangehandler = (e) => {
        setState((i) => {
            const a = { ...i }
            a.values.Party = e;
            a.hasValid.Party.valid = true
            return a
        })
    }

    function excelDownloadFunc1(jsonData) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([]);
        const worksheet = ''
        const dataRows = [
            ["Form Date", jsonData[0].FormDate],
            ["To Date", jsonData[0].ToDate],

            ["Distributor Name", jsonData[0].Distributor, '', "Customer Name", jsonData[0].CustomerName],
            ["Distributor GSTIN", jsonData[0].DistributorGSTIN, '', "Customer GSTIN", jsonData[0].CustomerGSTIN],
            ["Distributor PAN", jsonData[0].DistributorPAN],
            // ["Customer Name", jsonData[0].CustomerName],
            // ["Customer GSTIN", jsonData[0].CustomerGSTIN],
            ['', '', '', "Opening Balance", jsonData[0].Open],
            ['', '', '', "Closing Balance", jsonData[0].Close]
        ];

        const RowsFunc = (data) => {

            const { InvoiceItems = [] } = jsonData[0]
            InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);


            let TotalRecieptAmount = 0
            let TotalInAmount = 0


            const tableHeader = ["Date", "Document No", "Particular", "DR-Amount", "CR-Amount", "Balance"];

            InvoiceItems.forEach((element, key) => {


                TotalInAmount = Number(TotalInAmount) + Number(element.Amount);
                TotalRecieptAmount = Number(TotalRecieptAmount) + Number(element.RecieptAmount);

                const tableItemRow = [
                    _cfunc.date_dmy_func(element.Date),
                    element.DocumentNO,
                    element.Particular,
                    _cfunc.roundToDecimalPlaces(element.Amount, 2, true),
                    _cfunc.roundToDecimalPlaces(element.RecieptAmount, 2, true),
                    _cfunc.roundToDecimalPlaces(element.Balance, 2, true)
                ];


                if (key === 0) {
                    worksheet.addRow([]);
                    worksheet.addRow([]);
                    worksheet.addRow(tableHeader);
                    worksheet.addRow(["", "", "Opening Balance", "", "", _cfunc.roundToDecimalPlaces(data.Open, 2, true)]);
                }
                worksheet.addRow(tableItemRow);

                if (key === InvoiceItems.length - 1) {
                    worksheet.addRow(["", "", "Monthly Total", _cfunc.roundToDecimalPlaces(TotalInAmount, 2, true), _cfunc.roundToDecimalPlaces(TotalRecieptAmount, 2, true), ""]);
                    worksheet.addRow(['', '', "Closing Balance", '', '', _cfunc.roundToDecimalPlaces(data.Close, 2, true)]);
                    worksheet.addRow(["", "", "Tax Free Sale", _cfunc.roundToDecimalPlaces(data.TaxFreeSale, 2, true), '', '']);
                    worksheet.addRow(["", "", "Taxable sale 5.00 %", _cfunc.roundToDecimalPlaces(data.TaxableSale5, 2, true), '', '']);
                    worksheet.addRow(["", '', "Tax 5.00 %", _cfunc.roundToDecimalPlaces(data.GSTAmount5, 2, true), '', '']);
                    worksheet.addRow(['', '', "Taxable sale 12.00 %", _cfunc.roundToDecimalPlaces(data.TaxableSale12, 2, true), '', '']);
                    worksheet.addRow(['', '', "Tax 12.00 %", _cfunc.roundToDecimalPlaces(data.GSTAmount12, 2, true), '', '']);
                    worksheet.addRow(['', " ", "Taxable sale 18.00 %", _cfunc.roundToDecimalPlaces(data.TaxableSale18, 2, true), '', '']);
                    worksheet.addRow(["", " ", "Tax 18.00 %", _cfunc.roundToDecimalPlaces(data.GSTAmount18, 2, true), '', '']);
                    worksheet.addRow(["", " ", "Total Taxable Scale", _cfunc.roundToDecimalPlaces(data.TotalTaxableSale, 2, true), '', '']);
                    worksheet.addRow(["", " ", "Total Credit Note", '', _cfunc.roundToDecimalPlaces(data.TotalCreditNote, 2, true), '']);
                    worksheet.addRow(["", " ", "Total Debit Note", _cfunc.roundToDecimalPlaces(data.TotalDebitNote, 2, true), '', '']);
                    worksheet.addRow(["", " ", "Total TCS", _cfunc.roundToDecimalPlaces(data.TotalTCS, 2, true), '', '']);
                }
            });

            worksheet.addRow(["", "", ""]);

        }

        RowsFunc(jsonData[0])

        XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: -1 });
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
        XLSX.writeFile(wb, "Party Ledger Report.xlsx");

    }


    function excelDownloadFunc(jsonData) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        const FillRowStyle = (bgColor, startCol, endCol) => {
            const lastRowIndex = worksheet.lastRow.number;
            for (let colIndex = startCol; colIndex <= endCol; colIndex++) {
                const cell = worksheet.getCell(`${String.fromCharCode(64 + colIndex)}${lastRowIndex}`);
                cell.font = { bold: true, size: 11, };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: bgColor }
                };
            }
        }

        const dataRows = [
            [`Form Date : ${jsonData[0].FormDate}`, `To Date : ${jsonData[0].ToDate}`],

            [`Distributor Name : ${jsonData[0].Distributor}`, `Customer Name : ${jsonData[0].CustomerName}`],
            [`Distributor GSTIN : ${jsonData[0].DistributorGSTIN}`, `Customer GSTIN : ${jsonData[0].CustomerGSTIN}`],
            [`Distributor PAN : ${jsonData[0].DistributorPAN}`, ''],

            ['', '', '', "Opening Balance", jsonData[0].Open],
            ['', '', '', "Closing Balance", jsonData[0].Close]
        ];

        const RowsFunc = (data) => {
            const { InvoiceItems = [] } = jsonData[0];
            InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);

            let TotalRecieptAmount = 0;
            let TotalInAmount = 0;

            // Define the fixed width for each column in the table header
            const columnWidths = [25, 30, 30, 25, 30, 30];
            const tableHeader = ["Date", "Document No", "Particular", "DR-Amount", "CR-Amount", "Balance"];

            // Set column widths for the table header
            worksheet.columns.forEach((column, index) => {
                column.width = columnWidths[index];
            })

            InvoiceItems.forEach((element, key) => {
                TotalInAmount = Number(TotalInAmount) + Number(element.Amount);
                TotalRecieptAmount = Number(TotalRecieptAmount) + Number(element.RecieptAmount);

                const tableItemRow = [
                    _cfunc.date_dmy_func(element.Date),
                    element.DocumentNO,
                    element.Particular,
                    _cfunc.roundToDecimalPlaces(element.Amount, 2, true),
                    _cfunc.roundToDecimalPlaces(element.RecieptAmount, 2, true),
                    _cfunc.roundToDecimalPlaces(element.Balance, 2, true)
                ];

                if (key === 0) {
                    worksheet.addRow([]);
                    worksheet.addRow([]);
                    worksheet.addRow(tableHeader);

                    FillRowStyle('b3cccc', 1, 6)

                    worksheet.addRow(["", "", "Opening Balance", "", "", _cfunc.roundToDecimalPlaces(data.Open, 2, true)]);
                }
                worksheet.addRow(tableItemRow);

                if (key === InvoiceItems.length - 1) {
                    worksheet.addRow(["", "", "Monthly Total", _cfunc.roundToDecimalPlaces(TotalInAmount, 2, true), _cfunc.roundToDecimalPlaces(TotalRecieptAmount, 2, true), ""]);
                    worksheet.addRow(['', '', "Closing Balance", '', '', _cfunc.roundToDecimalPlaces(data.Close, 2, true)]);
                    worksheet.addRow(["", "", "Tax Free Sale", _cfunc.roundToDecimalPlaces(data.TaxFreeSale, 2, true), '', '']);
                    worksheet.addRow(["", "", "Taxable sale 5.00 %", _cfunc.roundToDecimalPlaces(data.TaxableSale5, 2, true), '', '']);
                    worksheet.addRow(["", '', "Tax 5.00 %", _cfunc.roundToDecimalPlaces(data.GSTAmount5, 2, true), '', '']);
                    worksheet.addRow(['', '', "Taxable sale 12.00 %", _cfunc.roundToDecimalPlaces(data.TaxableSale12, 2, true), '', '']);
                    worksheet.addRow(['', '', "Tax 12.00 %", _cfunc.roundToDecimalPlaces(data.GSTAmount12, 2, true), '', '']);
                    worksheet.addRow(['', " ", "Taxable sale 18.00 %", _cfunc.roundToDecimalPlaces(data.TaxableSale18, 2, true), '', '']);
                    worksheet.addRow(["", " ", "Tax 18.00 %", _cfunc.roundToDecimalPlaces(data.GSTAmount18, 2, true), '', '']);
                    worksheet.addRow(["", " ", "Total Taxable Scale", _cfunc.roundToDecimalPlaces(data.TotalTaxableSale, 2, true), '', '']);
                    worksheet.addRow(["", " ", "Total Credit Note", '', _cfunc.roundToDecimalPlaces(data.TotalCreditNote, 2, true), '']);
                    worksheet.addRow(["", " ", "Total Debit Note", _cfunc.roundToDecimalPlaces(data.TotalDebitNote, 2, true), '', '']);
                    worksheet.addRow(["", " ", "Total TCS", _cfunc.roundToDecimalPlaces(data.TotalTCS, 2, true), '', '']);
                }
            });

            worksheet.addRow(["", "", ""]);
        };

        dataRows.forEach((rowData) => {
            const blankRow = Array(6).fill("");
            worksheet.addRow(blankRow);
            const lastRowIndex = worksheet.lastRow.number;

            worksheet.mergeCells(`A${lastRowIndex}:C${lastRowIndex}`);
            const mergedLeftCellRange = `A${lastRowIndex}:C${lastRowIndex}`;
            const mergedLeftCellA = worksheet.getCell(mergedLeftCellRange);
            mergedLeftCellA.value = rowData[0];
            mergedLeftCellA.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
            mergedLeftCellA.font = { bold: true, size: 11, };
            mergedLeftCellA.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'b3cccc', }
            };

            worksheet.mergeCells(`D${lastRowIndex}:F${lastRowIndex}`);
            const mergedRightCellRange = `D${lastRowIndex}:F${lastRowIndex}`;
            const mergedRightCellA = worksheet.getCell(mergedRightCellRange);
            mergedRightCellA.value = rowData[1];
            mergedRightCellA.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
            mergedRightCellA.font = { bold: true, size: 11, };
            mergedRightCellA.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'b3cccc', }
            };

        });

        RowsFunc(jsonData[0]);

        function applyBordersToWorksheet(worksheet) {
            const lastRow = worksheet.lastRow.number;
            const lastColumn = worksheet.columns.length;

            // Set borders for each cell in the worksheet
            for (let rowIndex = 1; rowIndex <= lastRow; rowIndex++) {
                for (let colIndex = 1; colIndex <= lastColumn; colIndex++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(64 + colIndex)}${rowIndex}`);

                    // Set borders for each cell
                    cell.border = {
                        top: { style: 'dotted', color: { argb: '000000' } },
                        left: { style: 'dotted', color: { argb: '000000' } },
                        bottom: { style: 'dotted', color: { argb: '000000' } },
                        right: { style: 'dotted', color: { argb: '000000' } }
                    };
                }
            }
        }

        // Call the function after populating the worksheet
        applyBordersToWorksheet(worksheet);

        // Save the workbook as an Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = subPageMode == url.PARTY_LEDGER ? "Party Ledger Report.xlsx" : "Self  Ledger Report.xlsx";
            a.click();

            URL.revokeObjectURL(url);
        });
    }

    async function goButtonHandler(e, mode) {

        if (_cfunc.loginSelectedPartyID() === 0) {
            customAlert({ Type: 3, Message: "Please Select Party" });
            return;
        };

        const isPartyLeger = subPageMode == url.PARTY_LEDGER;
        const isSelfLeger = subPageMode == url.SELF_LEDGER;

        if ((isPartyLeger && values.Customer === "") || (isSelfLeger && values.Party === "")) {
            customAlert({
                Type: 3,
                Message: isPartyLeger ? "Please Select Customer" : "Please Select Party",
            });
            return;
        }

        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Customer": isPartyLeger ? values.Customer.value : _cfunc.loginSelectedPartyID(),
            "Party": isPartyLeger ? _cfunc.loginSelectedPartyID() : values.Party.value,
        });

        if (mode === "excel") {
            setBtnMode(true)
            const resp = await PartyLedgerReport_API({ jsonBody });
            setTableData(resp.Data)
        }
        else {
            let config = { ReportType: report.PartyLedger, jsonBody };
            dispatch(getpdfReportdata(PartyLedgerReport_API, config));
        }
        setBtnMode(false)
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

    function partySelectButtonHandler() {
        dispatch(GetVenderSupplierCustomer({ subPageMode, "PartyID": _cfunc.loginSelectedPartyID() }));
    }

    function partyOnChngeButtonHandler() {
        dispatch(getpdfReportdataSuccess({ Status: false }));
        dispatch(GetVenderSupplierCustomerSuccess([]));
        setState((i) => {
            let a = { ...i }
            a.values.Customer = ''
            a.values.Party = ''
            return a
        })
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <PartyDropdown_Common
                    goButtonHandler={partySelectButtonHandler}
                    changeButtonHandler={partyOnChngeButtonHandler} />

                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={3} className="">
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

                        <Col sm={3} className="">
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

                        {subPageMode === url.PARTY_LEDGER ? (
                            <Col sm={3} className="">
                                <FormGroup className="mb- row mt-3" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "80px" }}>Customer</Label>
                                    <Col sm="7">
                                        <C_Select
                                            name="Customer"
                                            value={values.Customer}
                                            isSearchable={true}
                                            isLoading={customerDropdownLoading}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={customerDropdownOptions}
                                            onChange={customerOnChangehandler}

                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        ) : (
                            <Col sm={3} className="">
                                <FormGroup className="mb- row mt-3" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "80px" }}>Party</Label>
                                    <Col sm="7">
                                        <C_Select
                                            name="Party"
                                            value={values.Party}
                                            isSearchable={true}
                                            isLoading={partyDropdownLoading}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={partyDropdounOptions}
                                            onChange={partyOnChangehandler}

                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        )}

                        <Col sm="1" className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode}
                                className="btn btn-primary"
                                onClick={(e) => { goButtonHandler(e, "excel") }}
                            >
                                Excel
                            </C_Button>
                        </Col>

                        <Col sm="1" className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="primary"
                                loading={goBtnLoading}
                                className="btn btn-outline-primary border-1 font-size-12 text-center"
                                onClick={(e) => { goButtonHandler(e, "print") }}
                            >
                                Print</C_Button>
                        </Col>
                    </div>
                </div>
            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default PartyLedger;