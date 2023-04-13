import TableBody from "./TableBody";
import TableHead from "./TableHead";
import { useSortableTable } from "./useSortableTable";
import { useMemo, useState } from "react";
import Pagination from "./pagination";

const CustomTable2 = (props) => {
  const { columns } = props
  const [tableData, handleSorting] = useSortableTable(props);
  // const [currentPage, setCurrentPage] = useState(1);
  // const currentTableData = useMemo(() => {
  //   const firstPageIndex = (currentPage - 1) * PageSize;
  //   const lastPageIndex = firstPageIndex + PageSize;
  //   return tableData.slice(firstPageIndex, lastPageIndex);
  // }, [currentPage,handleSorting,tableData]);


  return (
    <>
      <table className=" table table-responsive  table-bordered table-hover">
        <TableHead {...{ columns, handleSorting }} />
        <TableBody {...{ columns, tableData }} />
      </table>

      {/* <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={tableData.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      /> */}
    </>
  );
};

export default CustomTable2;


