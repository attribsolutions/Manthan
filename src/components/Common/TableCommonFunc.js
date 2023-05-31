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

export const selectAllCheck = (selected) => ({

    mode: "checkbox",
    onSelectAll: onSelectAll,
    onSelect: selectRow,
    selected: selected,
    selectColumnPosition: "right",

    selectionHeaderRenderer: (head) => {

        return <div className="">
            <Input type="checkbox" checked={head.checked} />
            <label style={{ paddingLeft: "7px" }}>SelectAll</label>
        </div>
    },
    selectionRenderer: (head) => {

        return <div className="">
            <Input type="checkbox" checked={head.checked} />
        </div>
    }

})

const DynamicColumnHook = ({ pageField = '', lastColumn, secondLastColumn, userAccState }) => {

    const [tableColumns, setTableColumns] = useState([{
        text: "ID",
        dataField: "id",
    }])

    const [defaultSorted, setDefaultSorted] = useState('')
    const [pageOptions, setPageOptions] = useState('')
    const { PageFieldMaster = [] } = { ...pageField };

    useEffect(() => {
        
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
                    }
                })

                if (i.DefaultSort === 1) {
                    sortLabel = i.ControlID
                    sortType = "asc"
                } else if (i.DefaultSort === 2) {
                    sortLabel = i.ControlID;
                    sortType = "desc"
                }
            }

            if ((PageFieldMaster.length - 1 === k) && secondLastColumn) {
                let isCol = secondLastColumn();
                if (isCol) { columns.push(isCol) }
            }
            if ((PageFieldMaster.length - 1 === k) && lastColumn) {
                columns.push(lastColumn())
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
            sizePerPage: 15,
            custom: true,
        })
    }, [pageField, userAccState])
    
    return [tableColumns, defaultSorted, pageOptions]
}
export default DynamicColumnHook