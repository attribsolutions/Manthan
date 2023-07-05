import { useEffect, useState } from "react";
import { mySearchProps } from "../components/Common/SearchBox/MySearch";

function getDefaultSorting(defaultTableData, columns) {


  const sorted = [...defaultTableData].sort((a, b) => {
    const filterColumn = columns.filter((column) => column.sortbyOrder);

    // Merge all array objects into single object and extract accessor and sortbyOrder keys
    let { dataField = "id", sortbyOrder = "asc" } = Object.assign(
      {},
      ...filterColumn
    );

    if (a[dataField] === null) return 1;
    if (b[dataField] === null) return -1;
    if (a[dataField] === null && b[dataField] === null) return 0;

    const ascending = a[dataField]
      .toString()
      .localeCompare(b[dataField].toString(), "en", {
        numeric: true,
      });

    return sortbyOrder === "asc" ? ascending : -ascending;
  });

  return sorted;
}

export const useSortableTable = ({ data, columns, customSearch }) => {
  const [tableData, setTableData] = useState(getDefaultSorting(data, columns));

  useEffect(() => {
    setTableData(getDefaultSorting(data, columns))
  }, [data])

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      const sorted = [...tableData].sort((a, b) => {
        if (a[sortField] === null) return 1;
        if (b[sortField] === null) return -1;
        if (a[sortField] === null && b[sortField] === null) return 0;
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
        );
      });
      setTableData(sorted);
    }
  };

  const serach = (searchText) => {
    
     let filter =data.filter((row) =>
     columns.some((column) => {
              const columnValue = row[column.dataField];
              const isHidden = column.hidden;

              if (columnValue === null || isHidden || columnValue === undefined) {
                  return false;
              }
              return columnValue.toString().toLowerCase().includes(searchText.toLowerCase());
          })
      );

    setTableData(filter)

  }
  async function customSerachfunc(text) {
    setTableData(await customSearch(text, data, columns))
  }

  mySearchProps({ onSearch: customSearch ? customSerachfunc : serach },)

  return [tableData, handleSorting, serach];
};
