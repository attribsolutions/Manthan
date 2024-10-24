import React, { useEffect, useState } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from '../../../components/Common/SearchBox/MySearch';
import { IsSweetAndSnacksCompany, date_ymd_func, loginPartyID, loginUserDetails } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { order_Type } from '../../../components/Common/C-Varialbes';
import { getOrderListPage, getOrderListPageSuccess } from '../../../store/Purchase/OrderPageRedux/actions';
import { Button, Spinner } from 'reactstrap';
import { makeGRN_Mode_1Action } from '../../../store/Inventory/GRNRedux/actions';
import { mode, url } from "../../../routes/index";
import SimpleBar from "simplebar-react"
import { printBtnCss } from '../../../components/Common/ListActionsButtons';
import * as report from '../../../Reports/ReportIndex'
import { IB_Invoice_Singel_Get_for_Report_Api, Invoice_Singel_Get_for_Report_Api } from '../../../helpers/backend_helper';
import { getpdfReportdata, invoiceListGoBtnfilter } from '../../../store/actions';
import C_Report from '../../../components/Common/C_Report';



export default function InvoiceForGRN() {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = date_ymd_func();

    const IsCompanySweetAndSnacks = IsSweetAndSnacksCompany()

    const [userAccState, setUserAccState] = useState('');


    const { tableList, GRNitem, listBtnLoading, commonPartyDropSelect, userAccess } = useSelector((state) => ({
        tableList: IsCompanySweetAndSnacks ? state.InvoiceReducer.Invoicelist : state.OrderReducer.orderList,
        GRNitem: state.GRNReducer.GRNitem,
        listBtnLoading: state.GRNReducer.listBtnLoading || state.PdfReportReducers.ReportBtnLoading,
        userAccess: state.Login.RoleAccessUpdateData,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    let TableListWithNonDeleteRecord = []
    if (IsCompanySweetAndSnacks) {
        TableListWithNonDeleteRecord = tableList
    } else {
        TableListWithNonDeleteRecord = tableList.filter(i => i.IsRecordDeleted === false);
    }

    // Common Party Dropdown useEffect


    useEffect(() => {

        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === `/GRN_ADD_3`)
        })

        if (!(userAcc === undefined)) {
            setUserAccState(userAcc);
        }
    }, [userAccess]);

    const hasRole = (role) => userAccState[role];

    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {

            if (IsCompanySweetAndSnacks) {
                let subPageMode = url.IB_GRN_LIST
                const filtersBody = JSON.stringify({
                    FromDate: currentDate_ymd,
                    ToDate: currentDate_ymd,
                    Customer: "",
                    Party: commonPartyDropSelect.value,
                    IBType: "IBGRN",
                    DashBoardMode: 0

                });
                dispatch(invoiceListGoBtnfilter({ subPageMode, filtersBody }));
            } else {
                let subPageMode = url.GRN_STP_3
                const gobtnId = `gobtn-${subPageMode}`
                const filtersBody = JSON.stringify({
                    FromDate: "",
                    ToDate: "",
                    Supplier: "",
                    Customer: commonPartyDropSelect.value,
                    OrderType: order_Type.InvoiceToGRN,
                    IBType: "",
                    Country: loginUserDetails()?.Country_id
                });
                dispatch(getOrderListPage({ subPageMode, filtersBody, btnId: gobtnId }));
            }
        }
        return () => {
            dispatch(getOrderListPageSuccess([]))
        }

    }, [commonPartyDropSelect]);

    useEffect(() => {
        if (GRNitem.Status === true && GRNitem.StatusCode === 200) {
            history.push({
                pathname: GRNitem.path,
                page_Mode: GRNitem.page_Mode,
            })
        }
    }, [GRNitem])

    function makeBtnHandler(rowData, btnId) {

        const list = [rowData]
        var isGRNSelect = ''
        const grnRef = []
        if (list.length > 0) {
            list.forEach(ele => {
                grnRef.push({
                    Invoice: ele.id,
                    Order: null,
                    Invoice_NO: ele.FullInvoiceNumber,
                    Inward: true,
                    Challan: ele.POType === "Challan" ? ele.id : '',
                    GRN_From: IsCompanySweetAndSnacks ? url.IB_GRN_LIST : ""
                });
                isGRNSelect = isGRNSelect.concat(`${ele.id},`)
            });

            if (isGRNSelect) {
                let path = url.GRN_ADD_3
                if (IsCompanySweetAndSnacks) {
                    path = url.GRN_ADD_1
                } else {
                    path = url.GRN_ADD_3
                }
                isGRNSelect = isGRNSelect.replace(/,*$/, '');//****** withoutLastComma  function */

                const jsonBody = JSON.stringify({
                    OrderIDs: isGRNSelect,
                    Mode: IsCompanySweetAndSnacks ? 4 : 3
                })

                dispatch(makeGRN_Mode_1Action({ jsonBody, pageMode: mode.modeSTPsave, path: path, grnRef, btnId, InvoiceDate: rowData.dashboardOrderDate }))

            } else {
                alert("Please Select Order1")
            }
        }
    }

    function printBtnHandler(rowData, btnId) {
        let config = {}
        config["btnId"] = btnId
        config["editId"] = rowData.id
        config["ReportType"] = report.invoice;

        if (IsCompanySweetAndSnacks) {
            dispatch(getpdfReportdata(IB_Invoice_Singel_Get_for_Report_Api, config))
        } else {
            dispatch(getpdfReportdata(Invoice_Singel_Get_for_Report_Api, config))
        }
    }



    const pagesListColumns = [
        {
            text: "Invoice Date",
            dataField: IsCompanySweetAndSnacks ? "transactionDateLabel" : "dashboardOrderDate",
            sort: IsCompanySweetAndSnacks ? true : false
        },
        {
            text: "Invoice No",
            dataField: IsCompanySweetAndSnacks ? "FullInvoiceNumber" : "FullOrderNumber",
        },
        {
            text: "Supplier",
            dataField: IsCompanySweetAndSnacks ? "Party" : "Supplier",
        },
        {
            text: "Invoice Amount",
            dataField: IsCompanySweetAndSnacks ? "GrandTotal" : "OrderAmount",
            align: "right"
        },
        {
            text: "Action",
            hidden: !hasRole("RoleAccess_IsSave"),
            dataField: "",
            formatExtraData: { listBtnLoading: listBtnLoading, },
            formatter: (cellContent, rowData, key, formatExtra) => {

                let { listBtnLoading } = formatExtra;
                return (<>
                    < Button
                        type="button"
                        id={`btn-makeBtn-${rowData.id}`}
                        className="badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light "
                        title="Make GRN"
                        onClick={() => {
                            const btnId = `btn-makeBtn-${rowData.id}`
                            !listBtnLoading && makeBtnHandler(rowData, btnId)
                        }}
                    >
                        {(listBtnLoading === `btn-makeBtn-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <span
                                className=" fas fa-file-invoice font-size-17"
                            ></span>
                        }
                    </Button>

                    < Button
                        type="button"
                        id={`btn-print-${rowData.id}`}
                        className={printBtnCss}
                        style={{ marginLeft: "9px" }}
                        title="Print Invoice"
                        onClick={() => {
                            const btnId = `btn-print-${rowData.id}`
                            !listBtnLoading && printBtnHandler(rowData, btnId)
                        }}
                    >
                        {(listBtnLoading === `btn-print-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <span

                                className="bx bx-printer font-size-16"
                            ></span>
                        }
                    </Button>
                </>)
            }
        },
    ];
    const defaultSorted = [{
        dataField: IsCompanySweetAndSnacks ? "transactionDateLabel" : "dashboardOrderDate",
        order: 'desc'
    }];

    return (
        <ToolkitProvider
            keyField="Invoice"
            data={TableListWithNonDeleteRecord}
            columns={pagesListColumns}
            search
        >
            {toolkitProps => (
                <React.Fragment>
                    {/* <div className="table-container"> */}
                    <SimpleBar className="" style={{ maxHeight: "352px" }}>

                        <BootstrapTable
                            keyField={"Invoice"}
                            bordered={true}
                            striped={false}
                            defaultSorted={defaultSorted}
                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                            classes={"table align-middle table-nowrap table-hover"}
                            headerWrapperClasses={"thead-light"}

                            {...toolkitProps.baseProps}

                        />
                        {globalTableSearchProps(toolkitProps.searchProps)}
                        {/* </div> */}
                    </SimpleBar >
                    <C_Report />
                </React.Fragment>
            )}

        </ToolkitProvider>
    )
}

