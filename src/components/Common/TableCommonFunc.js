import { Input } from "reactstrap"
import { useState } from "react";
import { useEffect } from "react";

const onSelectAll = (event, allarray, a, c, v) => {

    allarray.forEach(ele => {
        ele.selectCheck = event
    })
}

const selectRow = (row, event) => {
    row.selectCheck = event
}
export const selectAllCheck = (selected, nonSelectable, position, headLabel) => ({

    mode: "checkbox",
    onSelectAll: onSelectAll,
    onSelect: selectRow,
    selected: selected,
    selectColumnPosition: position ? position : "right",
    nonSelectable: nonSelectable,

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

const DynamicColumnHook = ({ tableList = [], pageField = '', lastColumn, secondLastColumn, makeBtnColumn, userAccState }) => {

    const [tableColumns, setTableColumns] = useState([{
        text: "ID",
        dataField: "id",
    }])

    const [defaultSorted, setDefaultSorted] = useState('')
    const [pageOptions, setPageOptions] = useState({
        custom: true,
        sizePerPage: 15,
        // totalSize: tableList.length
    })

    const { PageFieldMaster = [] } = { ...pageField };

    useEffect(() => {

        if (userAccState === "") {
            return
        };

        let sortLabel = ""
        let sortType = "asc"
        let columns = []
        // ****** columns sort by sequnce
        PageFieldMaster.sort(function (a, b) {
            //sort function is  sort list page coloumn by asending order by listpage sequense
            return a.ListPageSeq - b.ListPageSeq;
        });
        // *******

        if (!(PageFieldMaster.length > 0)) {
            columns.push({ text: "Page Field Is Blank..." });
        }


        PageFieldMaster.forEach((i, k) => {

            if (i.ShowInListPage) {
                columns.push({
                    text: i.FieldLabel,
                    dataField: i.ControlID,
                    sort: true,

                    align: () => {
                        if (i.Alignment) return i.Alignment;
                    },

                    // formatter: (cell, row) => {
                    //     if (cell === "Invoice Created") {
                    //         return (
                    //             <span class="label label-primary" style={{ color: '#2ab57d' }}>{cell}</span>
                    //         )
                    //     }
                    //     if (cell === "Order Confirm") {
                    //         return (
                    //             <span class="label label-primary" style={{ color: '#4ba6ef' }} >{cell}</span>
                    //         )
                    //     }
                    //     return (
                    //         <span>{cell}</span>

                    //     );
                    // }
                })

                if (i.DefaultSort === 1) {
                    sortLabel = i.ControlID
                    sortType = "asc"
                } else if (i.DefaultSort === 2) {
                    sortLabel = i.ControlID;
                    sortType = "desc"
                }
            }

            if ((PageFieldMaster.length - 2 === k) && secondLastColumn) {
                let isCol = secondLastColumn();
                if (isCol) { columns.push(isCol) }
            }

            if ((PageFieldMaster.length - 1 === k) && makeBtnColumn) {
                let isCol = makeBtnColumn();
                if (isCol) { columns.push(isCol) }
            }

            if ((PageFieldMaster.length - 1 === k) && lastColumn) {
                let islastCol = lastColumn()
                if (islastCol) {
                    columns.push(lastColumn())
                }
            }
        })
        if (columns.length > 0) {
            setTableColumns(columns)
        }
        setDefaultSorted([
            {
                dataField: sortLabel, // if dataField is not match to any column you defined, it will be ignored.
                order: sortType, // desc or asc
            },
        ])

        setPageOptions({
            custom: true,
            sizePerPage: 15,
            // totalSize: tableList.length
        })

    }, [pageField, userAccState])

    return [tableColumns, defaultSorted, pageOptions]
}
export default DynamicColumnHook