
import { Col, Input, Row } from "reactstrap"
import { useState } from "react";
import { useEffect } from "react";


export const onSelectAll = ({ event, allarray, nonSelectable }) => {  // event only call After all selection 
  allarray.forEach((ele,) => {
    ele.forceSelectDissabled = nonSelectable.includes(ele.id)
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
  onSelectAll: (event) => onSelectAll({ event: event, allarray: tableList, nonSelectable }),
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
      {/*  marginBottom: 0  added because in common  them css margin have change affected here so to fix extra margin */}
      <label style={{ paddingLeft: "7px", marginBottom: 0 }}>{headLabel ? headLabel : "SelectAll"}</label>



    </div>
  },
  selectionRenderer: ({ mode, checked, ...rest }) => {

    if (tableList.length > 0) {
      let isAllcheck = tableList.filter(i => (i.hasAllSelect))
      let ischeck = tableList.filter(i => (i.selectCheck))


      let unCheckIds = tableList
        .filter(i => !i.selectCheck) // Filter items where selectCheck is false
        .map(i => i.id); // Extract the id of the filtered items

      if (unCheckIds.includes(rest.rowKey) || rest.disabled) {
        checked = false
      } else if (isAllcheck.length > 0 && ischeck.length > 0) {
        checked = true
      }


      // if (isAllcheck.length > 0 && ischeck.length > 0) {
      //   checked = rest.disabled ? false : true
      // }
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
  "Invoice Deleted": "red_label",
  "Open": "blue_lable",
  "Send To Supplier": "indigo_label",
  "Approved": "green_label",
  "Order send To SAP": "indigo_label",
  "Reject": "red_label",
  "Partially Completed": "darkOrange_label",
  "Completed": "green_label",
  "Close": "red_label",
};


const listColomnformatter = (cell, row, pagefield) => {
  if (pagefield.ControlID === "Status") {
    const labels = [];
    debugger
    //  Show "Order Confirm" ONLY if InvoiceCreated !== true
    if (row.IsConfirm === true && row.InvoiceCreated !== true) {
      labels.push(
        <div className={`label ${LABEL_COLORS["Order Confirm"]}`} style={{ marginBottom: "5px" }}>
          Order Confirm
        </div>
      );
    }

    // Show main status (Invoice Deleted / Invoice Created / Others)
    // Avoid duplicate "Order Confirm" label
    if (LABEL_COLORS[row.Status] && !(row.Status === "Order Confirm" && row.IsConfirm === true)) {
      labels.push(
        <div className={`label ${LABEL_COLORS[row.Status]}`} style={{ marginBottom: "5px" }}>
          {row.Status}
          {row.Status === "Invoice Created" && (
            <span className="badge bg-info ms-2" style={{ fontSize: "11px", cursor: "pointer" }} title={`Invoice Count`}>
              {row.InvoiceCount > 1 ? `${row.InvoiceCount} ` : ""}

            </span>
          )}
        </div>
      );
    }


    //  Show SAP Status if applicable
    if (row.SAPStatus === "Order send To SAP") {
      labels.push(
        <div className={`label ${LABEL_COLORS["Order send To SAP"]}`}>
          Order send To SAP
        </div>
      );
    }

    return <>{labels}</>;
  }

  //  Rest of columns unchanged (like it was)
  if (LABEL_COLORS[cell]) {
    return (
      <span className={`label ${LABEL_COLORS[cell]}`}>
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
  ExtraSelectColumn,
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
      if (k === 0 && ExtraSelectColumn) {
        const isCol = ExtraSelectColumn();
        if (isCol) {
          columns.push(isCol);
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





export const GroupSubgroupDisplay = ({ group, subgroup }) => {
  return (
    <Row className="align-items-center">
      <Col sm={6} className="mt-n2 mb-n1 d-flex justify-content-between">
        {/* Group Span */}
        <span className="group-span d-flex align-items-center">
          <span className="group-text">Group</span> ({group})
          <span className="group-arrow"></span>
        </span>
        {/* SubGroup Span */}
        <span className="subgroup-span d-flex align-items-center">
          <span className="subgroup-text">Sub Group</span> ({subgroup})
          <span className="subgroup-arrow"></span>
        </span>
      </Col>
    </Row>
  );
};



export const ModifyTableData_func = (data) => {
  const result = [];
  const subGroups = {}; // Store a concatenated string of ItemNames for each subgroup
  let previousSubGroup = undefined;

  data.forEach(item => {
    // Check if the current item's subgroup is different from the previous one
    if (item.SubGroupName !== previousSubGroup) {
      // Initialize the concatenated string for the subgroup
      if (!subGroups[item.SubGroupName]) {
        subGroups[item.SubGroupName] = "";
      }
      // Push a subgroup row into the result array
      result.push({
        id: `${item.id}-${item.SubGroupName}`,
        SubGroupRow: true,
        SubGroupName: item.SubGroupName,
        Group_Subgroup: `${item.GroupName}-${item.SubGroupName}`,
      });
      previousSubGroup = item.SubGroupName;
    }

    // Modify the ItemName to include subgroup and group names
    item.ItemName = `${item.ItemName}-${item.SubGroupName} ${item.GroupName}`;
    result.push(item);

    // Concatenate the ItemName to the appropriate subgroup string
    subGroups[item.SubGroupName] += `${item.ItemName}, `;
  });

  // Update the result array where SubGroupRow is true with the concatenated ItemNames
  result.forEach(row => {
    if (row.SubGroupRow) {
      row.ItemName = subGroups[row.SubGroupName].slice(0, -2); // Remove the trailing ", "
    }
  });
  return result;
}

