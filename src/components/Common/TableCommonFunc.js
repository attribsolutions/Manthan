// import { Input } from "reactstrap"

// const onSelectAll = (event, allarray, a, c, v) => {
//     debugger
//     const arr = allarray
//     if (event) {
//         allarray.forEach(ele => {
//             return ele.Check = event
//         })
//         setArray(arr)
//     } else {
//         return [];
//     }
// }

// const selectRow = (row, event) => {
//     const arr = []
//     partyList.forEach(ele => {
//         if (ele.id === row.id) {
//             ele.Check = event
//         }
//         arr.push(ele)
//     })
//     setArray(arr)
// }

// export const selectAllCheck = {
  
//     mode: "checkbox",
//     onSelectAll: onSelectAll,
//     onSelect: selectRow,
//     selected: partyList.map((index) => { return (index.Check) && index.id }),
//     selectColumnPosition: "right",

//     selectionHeaderRenderer: (head) => {
//         return <div className="">
//             <Input type="checkbox" checked={head.checked} />
//             <label style={{paddingLeft:"7px"}}>SelectAll</label>
//         </div>
//     },
//     selectionRenderer: (head) => {
//         debugger
//         return <div className="">
//              <Input type="checkbox" checked={head.checked} />
//         </div>
//     }
   
// }