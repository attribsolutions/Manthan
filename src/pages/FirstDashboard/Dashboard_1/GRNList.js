import React, { useEffect } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { currentDate, loginPartyID } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as url from "../../../routes/route_url";
import { order_Type } from '../../../components/Common/C-Varialbes';
import { getOrderListPage } from '../../../store/Purchase/OrderPageRedux/actions';
import { mySearchProps } from '../../../components/Common/SearchBox/MySearch';

export default function InvoiceForGRN() {

    const dispatch = useDispatch();
    const history = useHistory();

    const { tableList, } = useSelector((state) => ({
        tableList: state.OrderReducer.orderList,
    }));

    useEffect(() => {
        debugger
        let subPageMode = url.GRN_STP_1
        const gobtnId = `gobtn-${subPageMode}`
        const filtersBody = JSON.stringify({
            FromDate: currentDate,
            ToDate: currentDate,
            Supplier: "",
            Customer: loginPartyID(),
            OrderType: order_Type.PurchaseOrder,
            IBType: ""
        });
        dispatch(getOrderListPage({ subPageMode, filtersBody, btnId: gobtnId }));
    }, [])


    const pagesListColumns = [
        {
            text: "OrderDate",
            dataField: "OrderDate",
        },
        {
            text: "FullOrderNumber",
            dataField: "FullOrderNumber",
        },
        {
            text: "Supplier",
            dataField: "Supplier",
        },
        {
            text: "OrderAmount",
            dataField: "OrderAmount",
        },
        {
            text: "Inward",
            dataField: "Inward",
        },

    ];

    return (

        <ToolkitProvider

            keyField="Invoice"
            data={tableList}
            columns={pagesListColumns}

            search
        >
            {toolkitProps => (
                <React.Fragment>
                    <div className="table table-responsive">
                        <BootstrapTable
                            keyField={"Invoice"}
                            bordered={true}
                            striped={false}
                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                            classes={"table align-middle table-nowrap table-hover"}
                            headerWrapperClasses={"thead-light"}

                            {...toolkitProps.baseProps}

                        />

                        {mySearchProps(toolkitProps.searchProps)}
                    </div>

                </React.Fragment>
            )
            }
        </ToolkitProvider>
    )
}

