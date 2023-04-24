import { Input } from "reactstrap"

const onSelectAll = (event, allarray, a, c, v) => {
    debugger
    // const arr = allarray
    if (event) {
        allarray.forEach(ele => {
            ele.selectCheck = event
        })
        // setArray(arr)
    } else {
        return [];
    }
}

const selectRow = (row, event) => {
    const arr = []
    row.selectCheck = event
    // setArray(arr)
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
        debugger
        return <div className="">
            <Input type="checkbox" checked={head.checked} />
        </div>
    }

})