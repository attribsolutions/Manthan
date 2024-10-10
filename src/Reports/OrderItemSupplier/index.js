import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import ReportTableFunc from "../../components/Common/ReportTableFunc";
import { order_Item_Supplier_goBtn_Action, order_Item_Supplier_goBtn_Success } from "../../store/Report/OrderItemSupplierRedux/action";
import jsPDF from "jspdf";
import "jspdf-autotable";
import cbmLogo from "../../assets/images/cbm_logo.png"

const OrderItemSupplierReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [btnMode, setBtnMode] = useState("");

    const reducers = useSelector(
        (state) => ({
            ItemSupplierReduxData: state.OrderItemSupplier_Reducer.ItemSupplierReportGobtn,
            goBtnLoading: state.OrderItemSupplier_Reducer.goBtnLoading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );
    debugger
    const { userAccess, ItemSupplierReduxData = [], goBtnLoading, pageField } = reducers;
    const { tableData = [], ItemCount = {} } = ItemSupplierReduxData

    useEffect(() => {

        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.ORDER_ITEM_SUPPLIER_REPORT));
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));

        return () => {
            dispatch(commonPageFieldSuccess(null));
        }
    }, []);

    const [tableColumns] = DynamicColumnHook({ pageField })

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

        if (btnMode === "excel") {
            if (ItemSupplierReduxData.length > 0) {
                ExcelReportComponent({                // Download CSV
                    pageField,
                    excelTableData: ItemSupplierReduxData,
                    excelFileName: "Order Item Supplier Report",
                })
                dispatch(order_Item_Supplier_goBtn_Success([]));
            }
        }
        else if (btnMode === "pdf") {
            if (ItemSupplierReduxData.length > 0) {
                pdfDownloadHandler(ItemSupplierReduxData)
                dispatch(order_Item_Supplier_goBtn_Success([]));
            }
        }
    }, [ItemSupplierReduxData]);

    function goAndExcel_Btn_Handler(btnId) {
        setBtnMode(btnId)
        try {

            const jsonBody = JSON.stringify({
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "CompanyID": _cfunc.loginCompanyID(),
                "PartyID": _cfunc.loginPartyID(),
            });

            dispatch(order_Item_Supplier_goBtn_Action({ jsonBody }))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
        dispatch(order_Item_Supplier_goBtn_Success([]))
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
        dispatch(order_Item_Supplier_goBtn_Success([]))
    }

    function pdfDownloadHandler(data) {
        var doc = new jsPDF();

        // Page width for centering elements
        const pageWidth = doc.internal.pageSize.getWidth();

        // Function to add the header (called on every page)
        const addHeader = () => {
            // Add image to the center at the top
            const imgWidth = 30;  // Adjust the width of the image as needed
            const imgHeight = 25; // Adjust the height of the image as needed
            const xCenter = (pageWidth - imgWidth) / 2;  // Center the image horizontally
            doc.addImage(cbmLogo, 'PNG', xCenter, 12, imgWidth, imgHeight);  // Place image at the top and center

            // Set left-aligned text (Company Name and Division)
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');  // Set font to bold for the company name
            doc.text("CHITALE BANDHU MITHAIWALE", 12, 25);

            doc.setFont('helvetica', 'normal');  // Reset back to normal style
            doc.setFontSize(10);
            doc.text(_cfunc.loginPartyName(), 12, 30);

            // Set right-aligned text (Supplier Item Report and Date Range)
            const reportYPosition = 25; // Adjusted Y position to align with company name
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold'); // Set font to bold for the report title
            doc.text("Supplier Item Report", pageWidth - 14, reportYPosition, { align: 'right' });

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');  // Reset back to normal style
            const dateRange = `From ${_cfunc.date_dmy_func(values.FromDate)} To ${_cfunc.date_dmy_func(values.ToDate)}`;
            doc.text(dateRange, pageWidth - 14, reportYPosition + 5, { align: 'right' });
        };

        // Initial vertical spacing after the header for the first page
        let startY = 40; // Adjust this value based on header height

        // Create table headers
        const tableHead = [["Supplier Name", "Item Name", "Qty (No)", "Qty (Kg)", "Qty (Box)"]];

        // Map the data to rows
        const tableBody = data.map(item => [
            item.SupplierName || '',  // Set empty string if SupplierName is empty
            item.SKUName,
            item.QtyInNo,
            item.QtyInKg,
            item.QtyInBox
        ]);

        // Add the header for the first page
        addHeader();

        // Add the table using jsPDF autoTable
        doc.autoTable({
            head: tableHead,
            body: tableBody,
            startY: startY,  // Ensure a gap between the top content and the table
            theme: 'grid', // Grid theme for table layout
            headStyles: {
                fillColor: [255, 255, 255], // White background for header
                textColor: [0, 0, 0],       // Black text color for header
                fontStyle: 'bold',          // Bold font for header
                lineColor: [0, 0, 0],       // Black border for header
                lineWidth: 0.5,             // Set border thickness
                fontSize: 12,
            },
            styles: {
                halign: 'center',           // Center-align table content
                textColor: [0, 0, 0],       // Black color for table data
                lineWidth: 0.1,             // Set border thickness for rows
                lineColor: [0, 0, 0],       // Black border for header
                fontSize: 10,               // Set font size for table data
                font: "Calibri"             // Set the font to Calibri
            },
            columnStyles: {
                0: { minCellWidth: 70, halign: "left" },
                1: { minCellWidth: 50, halign: "left" },
                2: { minCellWidth: 20, halign: "right" },
                3: { minCellWidth: 20, halign: "right" },
                4: { minCellWidth: 20, halign: "right" },
            },
            didDrawPage: (data) => {
                addHeader();  // Add header on each new page
            },
            margin: { top: 40 }, // Set a margin to prevent overlap with the header

            // didParseCell: (data1) => {

            //     // Loop through each row in the table body
            //     data1.table.body.forEach((row) => {

            //         const supplierName = row.cells[0].raw; // Assuming supplier name is in the first cell

            //         if (ItemCount[supplierName]) {
            //             const cell = row.cells[0];
            //             cell.rowSpan = ItemCount[supplierName]; // Set the rowSpan based on the item count
            //         }

            //     });
            // }

        });

        // Open the PDF in a new window
        const pdfUrl = doc.output('bloburl');
        window.open(pdfUrl);
    }


    const pageBorder = (doc) => {
        doc.setDrawColor(0, 0, 0);
        doc.line(570, 16, 30, 16);//horizontal line (Top)
        doc.line(30, 815, 30, 16);//vertical line (left)
        doc.line(570, 815, 570, 16);//vertical line (Right)
        doc.line(570, 815, 30, 815);//horizontal line (Bottom)    
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
                                        value={values.FromDate}
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
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={6} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(goBtnLoading && btnMode === "pdf") && true}
                                className="btn btn-info m-3 mr"
                                onClick={() => goAndExcel_Btn_Handler("pdf")}
                            >
                                PDF
                            </C_Button>

                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(goBtnLoading && btnMode === "show") && true}
                                className="btn btn-success m-3 mr"
                                onClick={() => goAndExcel_Btn_Handler("show")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(goBtnLoading && btnMode === "excel") && true}
                                className="btn btn-primary m-3 mr "
                                onClick={() => goAndExcel_Btn_Handler("excel")}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>

                <div className="mt-1">
                    <ReportTableFunc
                        keyField="id"
                        tableData={ItemSupplierReduxData}
                        columns={tableColumns}
                    // totalAmountShow={true}
                    />
                </div>

            </div>
        </React.Fragment >
    )
}

export default OrderItemSupplierReport;