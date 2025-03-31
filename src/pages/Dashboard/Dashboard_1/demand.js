import React, { useEffect, useState } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { date_ymd_func, loginSelectedPartyID, loginUserDetails } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { globalTableSearchProps } from '../../../components/Common/SearchBox/MySearch';
import { salesReturnListAPI, salesReturnListAPISuccess } from '../../../store/Sales/SalesReturnRedux/action';
import SimpleBar from "simplebar-react"
import { getOrderListPage, getOrderListPageSuccess, getpdfReportdata, makeGRN_Mode_1Action } from '../../../store/actions';
import { mode, url } from '../../../routes';
import { printBtnCss } from '../../../components/Common/ListActionsButtons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Spinner } from 'reactstrap';
import * as report from '../../../Reports/ReportIndex'
import { IB_Order_Get_Api } from '../../../helpers/backend_helper';


export default function DemandListForDashboard() {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = date_ymd_func();

    const [userAccState, setUserAccState] = useState('');

    const { tableList, commonPartyDropSelect, userAccess, listBtnLoading, GRNitem } = useSelector((state) => ({
        tableList: state.OrderReducer.orderList,
        GRNitem: state.GRNReducer.GRNitem,
        userAccess: state.Login.RoleAccessUpdateData,
        listBtnLoading: state.GRNReducer.listBtnLoading || state.PdfReportReducers.ReportBtnLoading,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            let subPageMode = url.IB_ORDER_SO_LIST
            const filtersBody = JSON.stringify({
                "FromDate": currentDate_ymd,
                "ToDate": currentDate_ymd,
                "Supplier": loginSelectedPartyID(),//Suppiler swipe
                "Customer": "",//customer swipe
                "OrderType": 1,
                "CustomerType": "",
                "IBType": "IBSO",
                "DashBoardMode": 0,
                "Country": loginUserDetails()?.Country_id

            });
            dispatch(getOrderListPage({ subPageMode, filtersBody }));
        }
        return () => {
            dispatch(getOrderListPageSuccess([]))
        }

    }, [commonPartyDropSelect]);

    useEffect(() => {

        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === `/GRN_ADD_3`)
        })

        if (!(userAcc === undefined)) {
            setUserAccState(userAcc);
        }
    }, [userAccess]);

    useEffect(() => {
        if (GRNitem.Status === true && GRNitem.StatusCode === 200) {
            history.push({
                pathname: GRNitem.path,
                page_Mode: GRNitem.page_Mode,
            })
        }
    }, [GRNitem])

    function printBtnHandler(rowData, btnId) {

        let config = {}
        config["btnId"] = btnId
        config["editId"] = rowData.id
        config["ReportType"] = report.order1;;
        dispatch(getpdfReportdata(IB_Order_Get_Api, config))
    }


    const makeBtnFunc = (list = [], btnId) => {
        debugger
        let subPageMode = url.IB_ORDER_SO_LIST

        var isGRNSelect = ''
        var challanNo = ''
        const grnRef = []

        // list.forEach(ele => {

        grnRef.push({
            Invoice: null,
            Order: list.id,
            ChallanNo: list.FullOrderNumber,
            Inward: false,
            Challan: list.POType === "Challan" ? list.id : '',
            POType: list.POType,
            OrderDate: list.OrderDate,
            CustomerID: list.CustomerID,
            CustomerName: list.Customer,

        });
        isGRNSelect = isGRNSelect.concat(`${list.id},`)
        challanNo = challanNo.concat(`${list.FullOrderNumber},`)

        // });

        if (isGRNSelect) {
            let path = ""
            isGRNSelect = isGRNSelect.replace(/,*$/, '');//****** withoutLastComma  function */
            challanNo = challanNo.replace(/,*$/, '');           //****** withoutLastComma  function */

            // define isMode for MakeBtn API
            if (subPageMode === url.IB_ORDER_SO_LIST) {
                path = url.IB_INVOICE
            }

            const jsonBody = JSON.stringify({
                OrderIDs: isGRNSelect,
                DemandDate: subPageMode === url.IB_ORDER_SO_LIST ? list.OrderDate : undefined,
                Party: subPageMode === url.IB_ORDER_SO_LIST ? loginSelectedPartyID() : undefined

            })

            dispatch(makeGRN_Mode_1Action({ jsonBody, subPageMode, pageMode: mode.defaultsave, path: path, grnRef, challanNo, btnId }))

        } else {
            alert("Please Select Order1")
        }


    }
    const hasRole = (role) => userAccState[role];
    const pagesListColumns = [
        {
            text: "IB Order Date",
            dataField: "transactionDateLabel",
            sort: true
        },
        {
            text: "IB Order Number",
            dataField: "FullOrderNumber",
        },
        {
            text: "Division",
            dataField: "Customer",
        },
        {
            text: "Grand Total",
            dataField: "OrderAmount",
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
                        title="Make Invoice"
                        disabled={rowData.InvoiceCreated}
                        onClick={() => {
                            const btnId = `btn-makeBtn-${rowData.id}`
                            !listBtnLoading && makeBtnFunc(rowData, btnId)
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
        dataField: 'transactionDateLabel',
        order: 'desc'
    }];


    return (
        <ToolkitProvider
            keyField="id"
            data={tableList}
            columns={pagesListColumns}
            search
        >
            {toolkitProps => (
                <React.Fragment>
                    <SimpleBar className="" style={{ maxHeight: "352px" }}>
                        <BootstrapTable
                            keyField={"id"}
                            bordered={true}
                            striped={false}
                            defaultSorted={defaultSorted}
                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                            classes={"table align-middle table-nowrap table-hover"}
                            headerWrapperClasses={"thead-light"}
                            {...toolkitProps.baseProps}
                        />
                        {globalTableSearchProps(toolkitProps.searchProps)}

                    </SimpleBar >


                </React.Fragment>
            )
            }
        </ToolkitProvider>
    )
}

