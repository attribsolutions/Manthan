import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { MetaTags } from "react-meta-tags";
import { Input, Label } from "reactstrap";

import demoData from "./demo1.json"

const DemoTable = () => {
    const { SearchBar, ClearSearchButton } = Search;
    // const data = [
    //     {
    //         "id": 1,
    //         "user": "Test1",
    //         "Item": "abc",
    //         "plates": [
    //             {
    //                 "id": 101,
    //                 "plate": "AA-11",
    //             },
    //             {
    //                 "id": 102,
    //                 "plate": "AB-12",
    //             }
    //         ]
    //     },
    //     {
    //         "id": 2,
    //         "user": "Test2",
    //         "Item": "pqr",
    //         "plates": [
    //             {
    //                 "id": 101,
    //                 "plate": "AA-21",
    //             },
    //             {
    //                 "id": 102,
    //                 "plate": "AB-22",
    //             }
    //         ]
    //     },
    // ]
    const columns = [
        // {
        //     dataField: "id",
        //     text: "party",
        //     // hidden: true
        //     formatter: (e, i) => {
        //         return <div className="_heder" >
        //             <div className="div-1">
        //                 <div>
        //                     <Label>{"Krupa Traders"}</Label>
        //                 </div>
        //             </div>
        //             {/* <div className="div-2">
        //                     <div>  <SearchBar {...toolkitProps.searchProps} /></div>
        //                 </div> */}
        //             <div className="div-2">
        //                 <div>
        //                     <Label >Invoice No</Label>
        //                 </div>
        //                 <div> <Input type="text" /></div>
        //             </div>

        //             <div className="div-2">
        //                 <div>
        //                     <Label >Amount</Label>
        //                 </div>
        //                 <div>
        //                     <Input id={`partytAmt${i.id}-${i.Party}`}
        //                         type="text" placeholder="Calculate Invoice Value" disabled={true} />
        //                 </div>
        //             </div>
        //         </div >
        //     },
        //     attrs: (cell, row, rowIndex, colIndex) => (
        //         row.header === true ? { "colSpan": "3" } : {}
        //     ),
        //     style: (cell, row, rowIndex, colIndex) => {
        //         debugger
        //         if (!row.header === true) {
        //             return { display: "none",hidden:true } //make sure other things are not displayed
        //         } else return {}
        //     },
        // },
        {
            dataField: "ItemName",
            text: "ItemName",
            sort: true,
            formatter: (cell, i) => {
                if (!i.header === true) {
                    return cell
                }
                else {
                    return (
                        <div >
                            <div className="_heder" style={{ display: "flex" }}  >
                                <div className="div-1">
                                    <div>
                                        <Label>{i.PartyName}</Label>
                                    </div>
                                </div>
                                {/* <div className="div-2">
                            <div>  <SearchBar {...toolkitProps.searchProps} /></div>
                        </div> */}
                                <div className="div-2">
                                    <div>
                                        <Label >Invoice No</Label>
                                    </div>
                                    <div> <Input type="text" /></div>
                                </div>

                                <div className="div-2">
                                    <div>
                                        <Label >Amount</Label>
                                    </div>
                                    <div>
                                        <Input id={`partytAmt${i.id}-${i.Party}`}
                                            type="text" placeholder="Calculate Invoice Value" disabled={true} />
                                    </div>
                                </div>
                            </div >
                        </div>
                    )
                }
            },
            attrs: (cell, row, rowIndex, colIndex) => (
                row.header === true ? { "colSpan": "4" } : {}
            ),
            // style: (cell, row, rowIndex, colIndex) => {
            //     debugger
            //     if (!row.header === true) {
            //         return { display: "none", } //make sure other things are not displayed
            //     } else return {}
            // },
            // style: (cell, row, rowIndex, colIndex) => {
            //     return (row.header === true) &&{ display: "none" } //make sure other things are not displayed
            // },

        },
        {
            dataField: "Quantity",
            text: "Quantity",
            style: (cell, row, rowIndex, colIndex) => {
                return (row.header === true) && { display: "none" } //make sure other things are not displayed
            },
        },
        {//***************StockDetails********************************************************************* */
            text: "Stock Details",
            dataField: "",
            style: (cell, row, rowIndex, colIndex) => {
                return (row.header === true) && { display: "none" } //make sure other things are not displayed
            },
            formatter: (cellContent, index1) => (
                <div>
                    {/* <div key={`plus-circle-icon${index1.id}-${index1.Party}`}>
                        {
                            (index1.StockTotal > 0) ?
                                <>
                                    <samp key={`plus-circle${index1.id}-${index1.Party}`} id={`plus-circle${index1.id}-${index1.Party}`}
                                        style={{
                                            display: showAllStockState ? "none" : "block"
                                        }}
                                    >
                                        <i className=" mdi mdi-plus-circle-outline text-primary font-size-16"
                                            style={{ position: "absolute", }}
                                            onClick={(e) => { showStockOnclick(index1, true) }}>
                                        </i>
                                        <samp style={{ fontWeight: "bold", textShadow: 1, marginLeft: "20px" }}>
                                            {`Total Stock:${index1.StockTotal}`}</samp>
                                    </samp>
                                </>
                                : <samp style={{ fontWeight: "bold", textShadow: 1, }}>{'Total Stock:0'}</samp>
                        }

                        <samp key={`minus-circle${index1.id}-${index1.Party}`} id={`minus-circle${index1.id}-${index1.Party}`}
                            style={{ display: showAllStockState ? "block" : "none" }}
                        >
                            <i className="mdi mdi-minus-circle-outline text-primary font-size-16"
                                style={{ position: "absolute", }}
                                onClick={(e) => { showStockOnclick(index1, false) }}
                            ></i>
                        </samp>

                    </div > */}

                    <div id={`view${index1.id}-${index1.Party}`}
                        style={{
                            backgroundColor: "#b9be511a",
                            // display: showAllStockState ? "bolck" : "none"
                        }}

                    >
                        <table className="table table-bordered table-responsive mb-1" >

                            <thead  >
                                <tr style={{ zIndex: -3 }}>
                                    <th >Batch Code </th>
                                    <th  >Supplier BatchCode</th>
                                    <th  >Batch Date</th>
                                    <th >
                                        <div>
                                            <samp >Stock Quantity</samp>
                                        </div>
                                        <samp >{`(${index1.StockTotal} ${index1.StockUnit})`} </samp></th>
                                    <th className="" >
                                        <div>
                                            <samp >Quantity</samp>
                                        </div>
                                        <samp id={`stocktotal${index1.id}-${index1.Party}`}>{`Total:${index1.InpStockQtyTotal} ${index1.StockUnit}`} </samp>
                                    </th>
                                    <th  >Rate</th>
                                    <th  >MRP</th>
                                </tr>
                            </thead>
                            <tbody  >
                                {index1.StockDetails.map((index2) => {
                                    return (
                                        < tr key={`${index1.id}-${index1.Party}`} >
                                            <td>
                                                <div style={{ width: "120px" }}>
                                                    {index2.SystemBatchCode}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "120px" }}>
                                                    {index2.BatchCode}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "90px" }}>
                                                    {/* {convertDatefunc(index2.BatchDate)} */}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "120px", textAlign: "right" }}>
                                                    {`${index2.BaseUnitQuantity} ${index1.StockUnit}`}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "150px" }}>
                                                    <Input type="text"
                                                        // disabled={pageMode === 'edit' ? true : false}
                                                        style={{ textAlign: "right" }}
                                                        key={`batchQty${index1.id}-${index2.id}-${index1.Party}`}
                                                        id={`batchQty${index1.id}-${index2.id}-${index1.Party}`}
                                                        defaultValue={index2.Qty}
                                                    // onChange={(event) => StockQtyOnChange(event, index1, index2)}
                                                    ></Input>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "50px" }}>
                                                    {index1.Rate}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "50px" }}>
                                                    {index1.MRPValue}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div >
            ),

        },
    ]

    function onColumnMatch({
        searchText,
        value,
        column,
        row,
        d
    }) {

        // debugger
        let hasReturn = false

        let cell = typeof value !== 'undefined' && typeof row.header === "undefined"
        let hed = typeof row.header !== "undefined"

        if (hed) {
            return true
            let s = searchText.startsWith("-");
            let a = row.PartyName.toLowerCase()
            let d = a.includes(searchText)
            hasReturn = d && d

        }
        if (cell) {
            let a = row.PartyName.toLowerCase()
            let c = a.includes(searchText)
            if (c) hasReturn = true
            else {
                value = value.toLowerCase()
                let d = value.includes(searchText);
                hasReturn = d && d
            }
        }
        return hasReturn;

        // debugger
        // let aa = row.ItemName;
        // if (aa === undefined || null) aa = ''

        // aa = aa.toLowerCase()
        // let az = aa.includes(searchText)
        // let l = row.header
        // if (l === true && column.text === "ItemName") {
        //     return true
        // } else if (az && column.text === "ItemName") {
        //     return true
        // }
        // return false
        // implement your custom match logic on every cell value
    }
    return (
        <React.Fragment>
            <MetaTags> <title>{"demoPage"}| FoodERP-React FrontEnd</title></MetaTags>
            <div className="page-content">
                <ToolkitProvider
                    keyField="id"
                    data={demoData}
                    columns={columns}
                    search={{
                        onColumnMatch,
                        afterSearch: (newResult,c,v,b) => {
                            debugger
                            console.log("newResult", newResult)}
                    }}
                // search={{ searchFormatted: true }}
                >
                    {(props) => (
                        <React.Fragment>
                            <SearchBar
                                {...props.searchProps}
                                // style={styles.search}
                                placeholder="Type Search criteria to filter data"
                            />
                            < BootstrapTable
                                keyField={"id"}
                                responsive
                                striped={false}
                                noDataIndication={
                                    <div className="text-danger text-center ">
                                        Items Not available
                                    </div>
                                }

                                {...props.baseProps}
                            />
                        </React.Fragment>

                    )
                    }
                </ToolkitProvider>
            </div>
        </React.Fragment>
    )
}

export default DemoTable;