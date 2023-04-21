import React from "react";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import { useSortableTable } from "./useSortableTable";


 export const NoDataIndication = ({ tableData, props }) => {
  if (tableData.length === 0 && props.noDataIndication) {
    return props.noDataIndication
  }
  return null
}

const CustomTable2 = (props) => {
  const { columns } = props
  const [tableData, handleSorting] = useSortableTable(props);

  return (
    <React.Fragment>
      <table className={props.classes}>
        <TableHead {...{ columns, handleSorting }} />
        <TableBody {...{ columns, tableData }} />
      </table>
      <NoDataIndication {...{ tableData, props }} />
    </React.Fragment>
  );
};

export default CustomTable2;


