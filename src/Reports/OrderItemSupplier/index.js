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
            tableData: state.OrderItemSupplier_Reducer.ItemSupplierReportGobtn,
            goBtnLoading: state.OrderItemSupplier_Reducer.goBtnLoading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );

    const { userAccess, tableData = [], goBtnLoading, pageField } = reducers;

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
            if (tableData.length > 0) {
                ExcelReportComponent({                // Download CSV
                    pageField,
                    excelTableData: tableData,
                    excelFileName: "Order Item Supplier Report",
                })
                dispatch(order_Item_Supplier_goBtn_Success([]));
            }
        }
        else if (btnMode === "pdf") {
            if (tableData.length > 0) {
                pdfDownloadHandler(tableData)
            }
        }
    }, [tableData]);

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

   function pdfDownloadHandler(data)  {
    
        const doc = new jsPDF();

        // Page width for centering elements
        const pageWidth = doc.internal.pageSize.getWidth();

        // Add image to the center at the top
        const imgWidth = 40;  // Adjust the width of the image as needed
        const imgHeight = 35; // Adjust the height of the image as needed
        const xCenter = (pageWidth - imgWidth) / 2;  // Center the image horizontally
        const imgYPosition =5; // Position the image at Y=15

        doc.addImage(cbmLogo, 'PNG', xCenter, imgYPosition, imgWidth, imgHeight);  // Place image at the top and center

        // Set positions for the left-aligned text under the image
        const companyNameY = imgYPosition + imgHeight + 5;  // Y position for the company name
        doc.setFontSize(14);
        doc.text("CHITALE BANDHU MITHAIWALE", 14, companyNameY,{fontStyle: 'bold'});

        doc.setFontSize(10);
        doc.text(_cfunc.loginPartyName(), 14, companyNameY + 5);
        // doc.text("Pune-37", 14, companyNameY + 10);
        // doc.text("Anand 2", 14, companyNameY + 15);

        // Right-aligned text (Supplier Item Report and Date Range)
        const reportYPosition = imgYPosition + imgHeight + 5; // Adjust this space as needed for gap before the report
        doc.setFontSize(14);
        doc.text("Supplier Item Report", pageWidth - 14, reportYPosition, { align: 'right' ,fontStyle: 'bold'});
        doc.setFontSize(10);
        doc.text(`From ${_cfunc.date_dmy_func(values.FromDate)} To ${_cfunc.date_dmy_func(values.ToDate)}`, pageWidth - 14, reportYPosition + 5, { align: 'right' });

        // Initial vertical spacing after the header
        let startY = reportYPosition + 20;  // Adjust this space as needed for gap before the table starts

        // Create table headers
        const tableHead = [["Supplier Name", "Item Name", "Qty (No)", "Qty (Kg)", "Qty (Box)"]];

        // Map the data to rows
        const tableBody = data.map(item => [
            item.SupplierName,
            item.SKUName,
            item.QtyInNo,
            item.QtyInKg,
            item.QtyInBox
        ]);

        // Add the table using jsPDF autoTable with custom styles
        doc.autoTable({
            head: tableHead,
            body: tableBody,
            startY: startY,  // Ensures a gap between the top content and the table
            theme: 'grid', // Grid theme for table layout
            headStyles: {
                fillColor: [255, 255, 255], // White background for header
                textColor: [0, 0, 0],       // Black text color for header
                fontStyle: 'bold',          // Bold font for header
                lineColor: [0, 0, 0],       // Black border for header
                lineWidth: 0.5              // Set border thickness
            },
            styles: {
                halign: 'center',           // Center-align table content
                textColor: [0, 0, 0],       // Black color for table data
                lineColor: [0, 0, 0],       // Black border color for rows
                lineWidth: 0.2              // Set border thickness for rows
            },
        });

        // Open the PDF in a new window
        const pdfUrl = doc.output('bloburl');
        window.open(pdfUrl);
    };

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
                        tableData={tableData}
                        columns={tableColumns}
                    // totalAmountShow={true}
                    />
                </div>

            </div>
        </React.Fragment >
    )
}

export default OrderItemSupplierReport;