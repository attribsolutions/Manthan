import { Input } from "reactstrap"

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