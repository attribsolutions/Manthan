import React, { useEffect } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { date_ymd_func, loginPartyID } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { mySearchProps } from '../../../components/Common/SearchBox/MySearch';
import { salesReturnListAPI, salesReturnListAPISuccess } from '../../../store/Sales/SalesReturnRedux/action';
import SimpleBar from "simplebar-react"


export default function SalesReturnListForDashboard() {

    const dispatch = useDispatch();
    const currentDate_ymd = date_ymd_func();

    const { tableList, commonPartyDropSelect } = useSelector((state) => ({
        tableList: state.SalesReturnReducer.salesReturnList,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            const jsonBody = JSON.stringify({
                FromDate: currentDate_ymd,
                ToDate: currentDate_ymd,
                CustomerID: "",
                PartyID: commonPartyDropSelect.value,
            });
            dispatch(salesReturnListAPI(jsonBody));
        }
        return () => {
            dispatch(salesReturnListAPISuccess([]))
        }

    }, [commonPartyDropSelect]);

    const pagesListColumns = [
        {
            text: "ID",
            dataField: "id",
        },
        {
            text: "Return Date",
            dataField: "dashboardReturnDate",
        },
        {
            text: "FullReturnNumber",
            dataField: "FullReturnNumber",
        },
        {
            text: "Customer",
            dataField: "Customer",
        },
        {
            text: "Comment",
            dataField: "Comment",
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
                        {mySearchProps(toolkitProps.searchProps)}

                    </SimpleBar >


                </React.Fragment>
            )
            }
        </ToolkitProvider>
    )
}

