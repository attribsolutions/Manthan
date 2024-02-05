import { Input } from "reactstrap"
import { useState } from "react";
import { useEffect } from "react";


export const onSelectAll = ({ event, allarray, }) => {  // event only call After all selection 
  allarray.forEach((ele,) => {
    ele.selectCheck = event
    ele["hasAllSelect"] = event
  })

}

export const selectRow = (row, event) => {
  row.selectCheck = event
}

export const selectAllCheck = ({
  rowSelected = '',
  nonSelectable = '',
  position,
  headLabel,
  bgColor = "#9dadf09e",
  disabledWithMsg = '',
  tableList = [],
  pageloading = false

}) => ({


  mode: "checkbox",
  bgColor: bgColor,
  onSelectAll: (event) => onSelectAll({ event: event, allarray: tableList }),
  onSelect: selectRow,
  selected: rowSelected,
  selectColumnPosition: position ? position : "right",
  nonSelectable: pageloading ? tableList.map(row => row.id) : nonSelectable,
  attrs: () => ({ 'data-label': "Select" }),

  selectionHeaderRenderer: (head) => {

    if (tableList.length > 0) {
      let isAllcheck = tableList.filter(i => (i.hasAllSelect))
      let ischeck = tableList.filter(i => (i.selectCheck))
      if (isAllcheck.length > 0 && ischeck.length > 0 && isAllcheck.length === ischeck.length) {
        head.checked = true
      }
    }

    return <div className="">
      <Input type="checkbox" checked={head.checked} />
      <label style={{ paddingLeft: "7px" }}>{headLabel ? headLabel : "SelectAll"}</label>
    </div>
  },
  selectionRenderer: ({ mode, checked, ...rest }) => {

    if (tableList.length > 0) {
      let isAllcheck = tableList.filter(i => (i.hasAllSelect))
      let ischeck = tableList.filter(i => (i.selectCheck))
      if (isAllcheck.length > 0 && ischeck.length > 0 && isAllcheck.length === ischeck.length) {
        checked = rest.disabled ? false : true
      }
    }
    if (rest.disabled) {

      return <>
        <Input
          type="checkbox"
          {...rest}
          disabled
          checked={checked}
          style={!checked ? {
            opacity: 0.5,
            backgroundColor: "#ababab82",
          } : {}}
        />
        &nbsp;&nbsp; <samp className="text-danger">{disabledWithMsg}</samp>
      </>;
    }
    return <Input id="CheckBox_id" type="checkbox" checked={checked}  {...rest} />

  }

})

const LABEL_COLORS = {
  "Invoice Created": "green_label",
  "Order Confirm": "yellow_label",
  "Open": "blue_lable",
  "Send To Supplier": "indigo_label",
  "Approved": "green_label",
  "Order send To SAP": "indigo_label",
  "Reject": "red_label"
};


const listColomnformatter = (cell, row, pagefield) => {

  if (LABEL_COLORS[cell]) {
    return (
      <span className={`label  ${LABEL_COLORS[cell]}`} >
        {cell}
      </span>
    );
  }

  if (pagefield.ControlID === "transactionDate") {
    return <>{row.transactionDateLabel}</>;
  }

  if (cell === "Party" && row.Mode) {
    const statusMap = { 1: "(Sale Return)", 2: "(Purchase Return)", 3: "(Send To Supplier)" };
    return (
      <>
        <div>{`${row.Party}`}</div>
        <div>{statusMap[row.Mode] || ""}</div>
      </>
    );
  }

  return <>{typeof cell === "boolean" ? String(cell) : cell}</>;
};

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
          align: i.Alignment || null,
          attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': i.FieldLabel, "sticky-col": (colIndex === 0) ? "true" : "false" }),
          formatter: (cell, row) => listColomnformatter(cell, row, i)
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