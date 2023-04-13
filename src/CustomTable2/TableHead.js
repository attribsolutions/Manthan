import { useLayoutEffect, useMemo, useState } from "react";

const TableHead = ({ columns, handleSorting }) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");
  // const [heders, setHeders] = useState([]);

  const handleSortingChange = (dataField) => {

    const sortOrder = dataField === sortField && order === "asc" ? "desc" : "asc";
    setSortField(dataField);
    setOrder(sortOrder);
    handleSorting(dataField, sortOrder);
  };


  const heders = useMemo(() => {
    const isArray = []
     columns.forEach(({ text, dataField, sort, hidden = false }) => {

      const cl = sort
        ? sortField === dataField && order === "asc"
          ? "up"
          : sortField === dataField && order === "desc"
            ? "down"
            : "default"
        : "";

      if (!hidden) {
        isArray.push(
          <th
            key={dataField}
            onClick={sort ? () => handleSortingChange(dataField) : null}
            className={cl}
          >
            {text}
          </th>
        );
      }
    })
    return isArray
    // setHeders(isArray)
  }, [columns])

debugger
  return (
    <thead>
      <tr>
        {heders}
      </tr>
    </thead>
  );
};

export default TableHead;
