
import { Card, CardBody, Modal, ModalBody, Spinner } from 'reactstrap'; // or 'react-bootstrap' depending on your setup
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalCustomTable from '../../GlobalCustomTable';
import { BatchTraceabilityReport_API, Invoice_Singel_Get_for_Report_Api } from '../../helpers/backend_helper';
import { getpdfReportdata, getpdfReportdataSuccess, GRNPrint } from '../../store/actions';
import * as report from '../../Reports/ReportIndex'
import { useSelector, useDispatch } from "react-redux";
import C_Report from '../../components/Common/C_Report';
import { useEffect, useState } from 'react';
import GRN_ADD_1 from '../../pages/Inventory/GRN/GRN_ADD_1';
import { mode, url } from '../../routes';

import { transformGRNtoInvoiceFormat } from '../../pages/Inventory/GRN/GRNDataModifyFunc';


const BatchTrace = ({ updateBatchData, Data }) => {


    const [modal_open, setmodal_open] = useState(false);

    const { Loading, ButtonLoading, editData, PrintData, listBtnLoading } = useSelector(
        (state) => ({

            Loading: state.PdfReportReducers.ReportBtnLoading,
            ButtonLoading: state.PdfReportReducers.goBtnLoading,
            editData: state.GRNReducer.editData,
            PrintData: state.GRNReducer.PrintData,
            listBtnLoading: state.GRNReducer.listBtnLoading

        })
    );



    const dispatch = useDispatch();
    const handleGRNClick = (row) => {

        row["ReportType"] = report.invoice;
        row["editId"] = row.grnID;
        row["btnId"] = row.grnID;
        dispatch(GRNPrint(row))


    }

    useEffect(() => {
        if (PrintData.Status === true && PrintData.StatusCode === 200) {
            
            const Data = transformGRNtoInvoiceFormat(PrintData);
            Data["ReportType"] = report.invoice;
            dispatch(getpdfReportdataSuccess(Data))
        }
    }, [PrintData]);


    const handleInvoiceClick = (row) => {
        row["ReportType"] = report.invoice;
        row["editId"] = row.InvoiceID;
        row["btnId"] = row.InvoiceID;
        dispatch(getpdfReportdata(Invoice_Singel_Get_for_Report_Api, row))
    }

    const tables = [
        {
            title: 'Work Order Details',
            data: Data.WorkOrderDetails,
            columns: [
                { dataField: 'BatchCardNo', text: 'Batch Card No' },
                { dataField: 'WorkOrderDate', text: 'Date' },
                { dataField: 'LoginName', text: 'Login' },
                { dataField: 'Quantity', text: 'Quantity' },
                { dataField: 'NumberOfLot', text: 'No. of Lots' },
                { dataField: 'Status', text: 'Status' }
            ]
        },
        {
            title: 'Work Order Items',
            data: Data.WorkOrderItems,
            columns: [
                { dataField: 'ItemName', text: 'Item Name' },
                { dataField: 'BOMQuantity', text: 'BOM Qty' },
                { dataField: 'UnitName', text: 'Unit' }
            ]
        },
        {
            title: 'Material Issues',
            data: Data.MaterialIssues,
            columns: [
                { dataField: 'ItemName', text: 'Item Name' },
                { dataField: 'Quantity', text: 'Quantity' },
                { dataField: 'UnitName', text: 'Unit' },
                { dataField: 'BatchCode', text: 'Batch Code' },
                {
                    dataField: 'GRNNo',
                    text: 'GRN No',
                    formatExtraData: listBtnLoading,
                    formatter: (cell, row) => {
                        return (
                            (row.grnID === listBtnLoading) ? (
                                <div className="dot-pulse">  &nbsp;
                                    <div className="bounce1" style={{ background: "Blue" }}></div>
                                    <div className="bounce2" style={{ background: "Blue" }}></div>
                                    <div className="bounce3" style={{ background: "Blue" }}></div>
                                </div>
                            ) : (
                                <span
                                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => handleGRNClick(row)}
                                >
                                    {cell}
                                </span>
                            )
                        );



                    }
                },
            ]
        },
        {
            title: 'Production Details',
            data: Data.ProductionDetails,
            columns: [
                { dataField: 'BatchCardNo', text: 'Batch Card No' },
                { dataField: 'ItemName', text: 'Item Name' },
                { dataField: 'LotQty', text: 'Lot Qty' },
                { dataField: 'PrintedBatchCode', text: 'Printed Batch Code' },
                { dataField: 'BestBefore', text: 'Best Before' }
            ]
        },
        {
            title: 'Customer Dispatch Details',
            data: Data.CustomerDispatchDetails,
            columns: [
                // { dataField: 'InvoiceID', text: 'Invoice ID' },
                {
                    dataField: 'FullInvoiceNumber',
                    text: 'Invoice No',
                    formatExtraData: Loading,
                    formatter: (cell, row, i, Loading) => {

                        return (
                            (row.InvoiceID === Loading) ? (
                                <div className="dot-pulse">  &nbsp;
                                    <div className="bounce1" style={{ background: "Blue" }}></div>
                                    <div className="bounce2" style={{ background: "Blue" }}></div>
                                    <div className="bounce3" style={{ background: "Blue" }}></div>
                                </div>
                            ) : (
                                <span
                                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => handleInvoiceClick(row)}
                                >
                                    {cell}
                                </span>
                            )
                        );
                    }
                },
                { dataField: 'InvoiceDate', text: 'Date' },
                { dataField: 'CustomerName', text: 'Customer' },
                { dataField: 'Quantity', text: 'Quantity' },
                { dataField: 'BatchCode', text: 'Batch Code' }
            ]
        }
    ];

    function tog_center() {

        setmodal_open(false);
    }

    const handleBackClick = () => {
        updateBatchData(false)
    }
    const handlePrintClick = () => {
        const newConfig = {
            ReportType: report.Batch_Traceability_Report,
            ItemName: Data?.ItemName,
            jsonBody: { WorkOrderID: Data?.WorkOrderID }
        };

        dispatch(getpdfReportdata(BatchTraceabilityReport_API, newConfig));
    }


    return (

        <Card className="mb-3 mt-xl-3 c_card_body">
            <CardBody>
                {/* Tables */}
                {tables.map((table, index) => (
                    <div key={index} className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">{table.title}</h5>
                            {index === 0 && <div
                                className="d-flex justify-content-center align-items-center me-3"
                                style={{ width: "200px", height: "33px", fontWeight: "500", fontSize: "25px", }}
                            >
                                {/* Replace this with actual field you want from table.data */}
                                {Data?.ItemName}
                            </div>}
                            {index === 0 && (

                                <div className="d-flex align-items-center">
                                    {/* Centered Item Name */}

                                    {/* Buttons */}
                                    <button
                                        className="btn btn-secondary me-2"
                                        onClick={handleBackClick}
                                    >
                                        Back
                                    </button>

                                    <button
                                        className="btn btn-primary d-flex justify-content-center align-items-center"
                                        onClick={handlePrintClick}
                                        disabled={ButtonLoading}
                                        style={{ width: "92px", height: "33px" }}
                                    >
                                        {ButtonLoading ? <Spinner size="sm" /> : 'Print'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <GlobalCustomTable
                            keyField={table.columns[0].dataField}
                            data={table.data}
                            columns={table.columns}
                            bordered
                            striped
                            hover
                            isPaginationTotalStandalone={false}
                            condensed
                        />
                    </div>
                ))}

            </CardBody>

            <Modal
                isOpen={modal_open}
                toggle={tog_center}
                centered
                size="xl" // You can also omit this if using custom width below
                style={{
                    maxWidth: '95vw',
                    width: '95vw',
                }}
                contentClassName="border-0 rounded-0" // Optional: remove border/radius
            >
                <ModalBody className="py-lg-3">
                    <GRN_ADD_1
                        editValue={editData.Data}
                        masterPath={url.GRN_ADD_1}
                        pageMode={mode.edit}
                    />
                </ModalBody>

            </Modal>
            <C_Report />
        </Card>







    );

};

export default BatchTrace;
