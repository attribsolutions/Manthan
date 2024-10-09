import React from "react";
import { BreadcrumbShowCountlabel } from "../../store/actions";
import { useDispatch } from "react-redux";
import GlobalCustomTable from "../../GlobalCustomTable";
import { TotalAmount_Func } from "../../components/Common/CommonFunction";

const ReportTableFunc = ({ keyField, tableData, columns }) => {
    const dispatch = useDispatch();

    return (
        <GlobalCustomTable
            keyField={keyField}
            data={tableData}
            columns={columns}
            id="table_Arrow"
            noDataIndication={
                <div className="text-danger text-center ">
                    Items Not available
                </div>
            }
            onDataSizeChange={({ dataCount, filteredData = [] }) => {
                dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} currency_symbol ${TotalAmount_Func(filteredData)}`));
            }}
        />
    );
}

export default ReportTableFunc;
