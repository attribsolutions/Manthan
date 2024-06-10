import React, { useEffect } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { date_ymd_func, loginSelectedPartyID } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { globalTableSearchProps } from '../../../components/Common/SearchBox/MySearch';
import { salesReturnListAPI, salesReturnListAPISuccess } from '../../../store/Sales/SalesReturnRedux/action';
import SimpleBar from "simplebar-react"
import { getOrderListPage, getOrderListPageSuccess } from '../../../store/actions';
import { url } from '../../../routes';


export default function DemandListForDashboard() {

    const dispatch = useDispatch();
    const currentDate_ymd = date_ymd_func();

    const { tableList, commonPartyDropSelect } = useSelector((state) => ({
        tableList: state.OrderReducer.orderList,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            let subPageMode = url.IB_ORDER_SO_LIST
            const filtersBody = JSON.stringify({
                "FromDate": currentDate_ymd,
                "ToDate": currentDate_ymd,
                "Supplier": "",//Suppiler swipe
                "Customer": loginSelectedPartyID(),//customer swipe
                "OrderType": 1,
                "CustomerType": "",
                "IBType": "IBSO",
                "DashBoardMode": 0

            });
            dispatch(getOrderListPage({ subPageMode, filtersBody }));
        }
        return () => {
            dispatch(getOrderListPageSuccess([]))
        }

    }, [commonPartyDropSelect]);

    const pagesListColumns = [
        {
            text: "Demand Date",
            dataField: "transactionDateLabel",
            sort: true
        },
        {
            text: "Full Demand Number",
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

