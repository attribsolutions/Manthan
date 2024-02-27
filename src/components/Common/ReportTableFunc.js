import React from "react";
import { BreadcrumbShowCountlabel } from "../../store/actions";
import { useDispatch } from "react-redux";
import GlobalCustomTable from "../../GlobalCustomTable";
import { TotalAmount_Func } from "../../components/Common/CommonFunction";

const ReportTableFunc = ({ keyField, tableData, columns, totalAmountShow }) => {
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
                
                if (totalAmountShow) {
                    dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} ₹ ${TotalAmount_Func(filteredData)}`));
                }
                else {
                    dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                }
            }}
        />
    );
}

export default ReportTableFunc;
