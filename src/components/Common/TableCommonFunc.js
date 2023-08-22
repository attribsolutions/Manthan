import { Input } from "reactstrap"
import { useState } from "react";
import { useEffect } from "react";
import { concatDateAndTime } from "./CommonFunction";

const onSelectAll = (event, allarray,) => {

  allarray.forEach(ele => {
    ele.selectCheck = event
  })
}

const selectRow = (row, event) => {

  row.selectCheck = event
}
export const selectAllCheck = (selected, nonSelectable, position, headLabel) => ({

  mode: "checkbox",
  bgColor: "#9dadf09e",
  onSelectAll: onSelectAll,
  onSelect: selectRow,
  selected: selected,
  selectColumnPosition: position ? position : "right",
  nonSelectable: nonSelectable,
  attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "Select" }),
  

  selectionHeaderRenderer: (head) => {

    return <div className="">
      <Input type="checkbox" checked={head.checked} />
      <label style={{ paddingLeft: "7px" }}>{headLabel ? headLabel : "SelectAll"}</label>
    </div>
  },
  selectionRenderer: ({ mode, ...rest }) => {
    if (rest.disabled) {
      return <Input
        type="checkbox"
        disabled
        style={{
          opacity: 0.5,
          cursor: 'not-allowed',
          backgroundColor: "#ababab82",
        }}
      />;
    }
    return <Input type="checkbox"  {...rest} />

  }

})

const DynamicColumnHook = ({
  reducers = "",
  pageField = "",
  lastColumn,
  secondLastColumn,
  thirdLastColumn,
  makeBtnColumn,
  userAccState,
}) => {
  const { listBtnLoading } = reducers;
  const [tableColumns, setTableColumns] = useState([{}]);
  const [defaultSorted, setDefaultSorted] = useState([]);
  const [pageOptions, setPageOptions] = useState({
    custom: true,
    sizePerPage: 15,
  });
  const { PageFieldMaster = [] } = { ...pageField };

  useEffect(() => {
    if (userAccState === "") {
      return;
    }

    let sortLabel = "";
    let sortType = "asc";
    let columns = [];

    // Sort PageFieldMaster by ListPageSeq

    if (PageFieldMaster.length === 0) {
      columns.push({ text: "Page Field Is Blank...", dataField: "id" });
    }
    PageFieldMaster.sort((a, b) => a.ListPageSeq - b.ListPageSeq);
    
    PageFieldMaster.forEach((i, k) => {
      if (i.ShowInListPage) {
        const column = {
          text: i.FieldLabel,
          dataField: i.ControlID,
          hidden: false,
          sort: true,
          // key: `column-${k}`,
          // classes: "table-cursor-pointer",
          align: i.Alignment || null,
          attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': i.FieldLabel, "sticky-col": (colIndex === 0) ? "true" : "false" }),

          formatter: (cell, row) => {
            if (i.ControlID === "transactionDate") {
              return (
                <>
                  {row.transactionDateLabel}
                </>
              )
            }
            if (cell === "Invoice Created") {
              return (
                <span
                  className="label label-"
                  style={{
                    backgroundColor: "#b6efdcf7",
                    color: "#0e0d0d",
                    fontSize: "12px",
                    padding: "2px 4px 2px 4px",
                    borderRadius: "5px",
                  }}
                >
                  {cell}
                </span>
              );
            }
            if (cell === "Order Confirm") {
              return (
                <span
                  className="label label"
                  style={{
                    backgroundColor: "#f7dfb6",
                    color: "#0e0d0d",
                    fontSize: "12px",
                    padding: "2px 4px 2px 4px",
                    borderRadius: "5px",
                  }}
                >
                  {cell}
                </span>
              );
            }
            if (cell === "Open") {
              return (
                <span
                  className="label label"
                  style={{
                    backgroundColor: "#c3bfc7a6",
                    color: "#0e0d0d",
                    fontSize: "12px",
                    padding: "2px 4px 2px 4px",
                    borderRadius: "5px",
                  }}
                >
                  {cell}
                </span>
              );
            }
            if (cell === "Send To Supplier") {
              return (
                <span
                  className="label label-"
                  style={{
                    backgroundColor: "#b6efdcf7",
                    color: "#0e0d0d",
                    fontSize: "12px",
                    padding: "2px 4px 2px 4px",
                    borderRadius: "5px",
                  }}
                >
                  {cell}
                </span>
              );
            }
            if (cell === "Approved") {
              return (
                <span
                  className="label label"
                  style={{
                    backgroundColor: "#f7dfb6",
                    color: "#0e0d0d",
                    fontSize: "12px",
                    padding: "2px 4px 2px 4px",
                    borderRadius: "5px",
                  }}
                >
                  {cell}
                </span>
              );
            }
            return <>
              {typeof cell === "boolean" ? String(cell) : cell}</>;
          },
        };

        columns.push(column);

        if (i.DefaultSort === 1) {
          sortLabel = i.ControlID;
          sortType = "asc";
        } else if (i.DefaultSort === 2) {
          sortLabel = i.ControlID;
          sortType = "desc";
        }
      }

      if (PageFieldMaster.length - 1 === k && makeBtnColumn) {
        const isCol = makeBtnColumn();
        if (isCol) {
          columns.push(isCol);
        }
      }
      if (PageFieldMaster.length - 1 === k && thirdLastColumn) {
        const isCol = thirdLastColumn();
        if (isCol) {
          columns.push(isCol);
        }
      }
      if (PageFieldMaster.length - 1 === k && secondLastColumn) {
        const isCol = secondLastColumn();
        if (isCol) {
          columns.push(isCol);
        }
      }
      if (PageFieldMaster.length - 1 === k && lastColumn) {
        const islastCol = lastColumn();
        if (islastCol) {
          columns.push(lastColumn());
        }
      }
    });

    setTableColumns(columns);

    setDefaultSorted([
      {
        dataField: sortLabel,
        order: sortType,
      },
    ]);

    setPageOptions({
      custom: true,
      sizePerPage: 15,
    });
  }, [pageField, userAccState, listBtnLoading]);

  return [tableColumns, defaultSorted, pageOptions];
};

export default DynamicColumnHook