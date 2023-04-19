import React, { useMemo, useState } from "react";
import { NoDataIndication } from "../Table";
import TableBody from "../TableBody";
import TableHead from "../TableHead";
import { useSortableTable } from "../useSortableTable";
import PaginationBody from "./PaginationBody";

const PaginationTable = (props) => {
    const { data, pagination = '', columns } = props;
    const [tableData, handleSorting] = useSortableTable(props);
    const { PageSize = 5 } = pagination

    const [currentPage, setCurrentPage] = useState(1);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return tableData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, tableData]);



    return (
        <React.Fragment>

            <table className={props.classes}>
                <TableHead {...{ columns, handleSorting }} />
                <TableBody {...{ columns, tableData: currentTableData }} />
            </table>
            <NoDataIndication {...{ tableData, props }} />

            <PaginationBody
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={data.length}
                pageSize={PageSize}
                onPageChange={page => setCurrentPage(page)}
            />
        </React.Fragment >


    )
}
export default PaginationTable

