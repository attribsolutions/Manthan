import React, { useEffect } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { date_ymd_func, loginSelectedPartyID } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { globalTableSearchProps } from '../../../components/Common/SearchBox/MySearch';
import { salesReturnListAPI, salesReturnListAPISuccess } from '../../../store/Sales/SalesReturnRedux/action';
import SimpleBar from "simplebar-react"
import { challanList_ForListPage, challanList_ForListPageSuccess } from '../../../store/actions';


export default function ChallanListForDashboard() {

    const dispatch = useDispatch();
    const currentDate_ymd = date_ymd_func();

    const { tableList, commonPartyDropSelect } = useSelector((state) => ({
        tableList: state.ChallanReducer.ChallanList,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            const jsonBody = JSON.stringify({
                FromDate: currentDate_ymd,
                ToDate: currentDate_ymd,
                Party: loginSelectedPartyID(),
                Customer: "",
            });
            dispatch(challanList_ForListPage(jsonBody));
        }
        return () => {
            dispatch(challanList_ForListPageSuccess([]))
        }

    }, [commonPartyDropSelect]);







    const pagesListColumns = [
        {
            text: "ID",
            dataField: "id",
        },
        {
            text: "Challan Date",
            dataField: "ChallanDate",
        },
        {
            text: "Challan Number",
            dataField: "FullChallanNumber",
        },
        {
            text: "Customer",
            dataField: "Customer",
        },
        {
            text: "GrandTotal",
            dataField: "GrandTotal",
        },

    ];

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

