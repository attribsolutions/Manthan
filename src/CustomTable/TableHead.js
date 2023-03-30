import { useState } from "react";

const TableHead = ({ columns, handleSorting }) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSortingChange = (dataField) => {
    const sortOrder =
    dataField === sortField && order === "asc" ? "desc" : "asc";
    setSortField(dataField);
    setOrder(sortOrder);
    handleSorting(dataField, sortOrder);
  };

  return (
    <thead>
      <tr>
        {columns.map(({ text, dataField, sort }) => {
          const cl = sort
            ? sortField === dataField && order === "asc"
              ? "up"
              : sortField === dataField && order === "desc"
              ? "down"
              : "default"
            : "";
          return (
            <th
              key={dataField}
              onClick={sort ? () => handleSortingChange(dataField) : null}
              className={cl}
            >
              {text}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
