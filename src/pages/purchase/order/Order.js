import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
    Table,
} from "reactstrap";
import Breadcrumbs3 from "../../../components/Common/Breadcrumb3"
import Breadcrumb from "../../../components/Common/Breadcrumb"
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";


import React, { useEffect, useState } from "react";
import { Tbody, Thead } from "react-super-responsive-table";
import { MetaTags } from "react-meta-tags";

import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import { getOrderItems_ForOrderPage, getOrderItems_ForOrderPageSuccess } from "../../../store/Purchase/orderRedux/actions";
import { useHistory } from "react-router-dom";
import { BreadcrumbFilterSize, BreadcrumbSearchProps } from "../../../store/actions";
import { test } from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { mySearchProps } from "../../Adminisrator/SearchBox/SearchBoxSecond";


function Order() {
    const { SearchBar } = Search;
    const props = { tableData: [], func: function a() { } }
    const dispatch = useDispatch();
    const history = useHistory()
    const [userPageAccessState, setUserPageAccessState] = useState('');

    useEffect(() => {
        // document.getElementById("txtName").focus();
        dispatch(getOrderItems_ForOrderPage());
        dispatch(getPartyListAPI())
    }, [])

    const { items,
        postMsg,
        CustomSearchInput,
        customerNameList,
        userAccess,
        pageField
    } = useSelector((state) => ({
        items: state.OrderPageReducer.OrderItems,
        APIResponse: state.OrderPageReducer.submitOrderSuccess,
        CustomSearchInput: state.CustomSearchReducer.CustomSearchInput,
        // **customerNameList ==> this is  party list data geting from party list API
        customerNameList: state.PartyMasterReducer.partyList,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageFieldList
    }));

    useEffect(() => {

        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [userAccess])


    const { Party, PriceList } = useSelector((state) => ({
        PriceList: state.ItemMastersReducer.PriceList,
        Party: state.ItemMastersReducer.Party,
    }));


    const Party_DropdownOptions = Party.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const PriceList_DropdownOptions = PriceList.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const ondeleteHandeler = (ele) => {

        var fil = props.tableData.filter((i) => {
            return !(i.id === ele.id);
        });
        props.func(fil);

    };
    const partyOnchange = (e, row) => {
        row["PartyName"] = e.label
        row["Party"] = e.value;
        row["ispty"] = true
    }

    const priceListOnchange = (e, row, editorProps, value, column, rowIndex, columnIndex) => {

        row["PriceListName"] = e.label
        row["PriceList"] = e.value;
        row["ispty"] = true
        row.onUpdate = true

    }

    const effectiveDateOnchange = (e, row) => {

        row["EffectiveDate"] = e
        row["ispty"] = true
    }

    const margin_onChange = (e, row, v) => {

        row["Margin"] = e.target.value
        row["ispty"] = true

    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "Name",
            sort: true,
            formatter: (value, row) => (
                <div style={{ backgroundColor: "#FFFAFA" }}>
                    <span className={`${row.ispty ? "text-info" : null}`}>
                        {value}
                    </span>
                </div>
            ),
            editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
                <>
                    <Select
                        defaultValue={{
                            label: row.PriceListName,
                            value: row.PriceList
                        }}
                        isSearchable={false}
                        className="react-dropdown"
                        // onChange={(v, e) => onChangeSelect({ e, v, state, setState })}
                        classNamePrefix="dropdown"
                        options={PriceList_DropdownOptions}
                        name="Division"
                        styles={{
                            control: base => ({
                                ...base,
                                // border: isError.Address.length > 0 ? '1px solid red' : '',

                            })
                        }}
                        onChange={(e) => priceListOnchange(e, row, editorProps, value, column, rowIndex, columnIndex)}
                    />
                </>


            )
        },
        {
            text: "MRP",
            dataField: "MRPValue",
            sort: true,
            formatter: (value, row) => (
                <div style={{ backgroundColor: "#FFFAFA" }}>
                    <span className={`${row.ispty ? "text-info" : null}`}>
                        {value}
                    </span>
                </div>
            ),

            editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
                <>
                    <Select
                        defaultValue={{
                            label: row.PartyName,
                            value: row.Party
                        }}
                        isSearchable={false}
                        className="react-dropdown"
                        // onChange={(v, e) => onChangeSelect({ e, v, state, setState })}
                        classNamePrefix="dropdown"
                        options={Party_DropdownOptions}
                        name="Party"
                        styles={{
                            control: base => ({
                                ...base,
                                // border: isError.Address.length > 0 ? '1px solid red' : '',

                            })
                        }}
                        onChange={(e) => partyOnchange(e, row)}
                    />
                </>
            )
        },


        {
            text: "Rate",
            dataField: "Rate",
            sort: true,
            formatter: (value, row) => (
                <div style={{ backgroundColor: "#FFFAFA" }}>
                    <span className={`${row.ispty ? "text-info" : null}`}>
                        {value}
                    </span>
                </div>
            ),
            editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (

                <>

                    <Flatpickr

                        defaultValue={value}
                        className="form-control d-block p-2 bg-white text-dark"
                        placeholder="YYYY-MM-DD"
                        autoComplete="0,''"
                        options={{
                            altInput: true,
                            altFormat: "F j, Y",
                            dateFormat: "Y-m-d",
                            minDate: new Date().fp_incr("n"),
                            maxDate: new Date().fp_incr('') // 14 days from now"0,''"
                        }}
                        // onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                        onChange={(y, e) => effectiveDateOnchange(e, row)}
                    />
                </>


            )
        },

        {
            text: "GST %",
            dataField: "GSTValue",
            sort: true,
            formatter: (value, row) => (
                // <div style={{ backgroundColor: "#FFFAFA" }}>
                <span >
                    {value}
                </span>
                // </div>
            ),
            editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (

                <Input type="text" defaultValue={value} onChange={(e) => margin_onChange(e, row, editorProps)} />
            ),
            // style: (row, rowIndex) => {
            //     const backgroundColor = rowIndex > 1 ? '#00BFFF' : '#00FFFF';
            //     return { backgroundColor }
            // }
        },
        {
            text: "Quntity",
            dataField: "Margin",
            sort: true,
            formatter: (value, row) => (
                // <div style={{ backgroundColor: "#FFFAFA" }}>
                <span >
                    <Input type="text" defaultValue={value} onChange={(e) => margin_onChange(e, row,)} />
                </span>
                // </div>
            ),
            // editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (

            //     <Input type="text" defaultValue={value} onChange={(e) => margin_onChange(e, row, editorProps)} />
            // ),
            // style: (row, rowIndex) => {
            //     const backgroundColor = rowIndex > 1 ? '#00BFFF' : '#00FFFF';
            //     return { backgroundColor }
            // }
        },
        {
            text: "UOM",
            dataField: "Margin",
            sort: true,
            formatter: (value, row, key) => {
                // debugger
                return (
                    <Select
                        classNamePrefix="select2-selection"
                        id={"ddlUnit"}
                        defaultValue={{ value: row.UOM, label: row.UOMLabel }}
                        // value={{value:row.UOM,label:row.UOMLabel}}
                        options={
                            [
                                { value: 1, label: "NO" },
                                { value: 2, label: "Box" },
                                { value: 3, label: "Kg" }
                            ]
                        }
                        onChange={(e) => {
                            // debugger;
                            row["UOM"] = e.value;
                            row["UOMLabel"] = e.label
                        }}
                    >
                    </Select>
                )
            },

            editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (

                <Input type="text" defaultValue={value} onChange={(e) => margin_onChange(e, row, editorProps)} />
            ),
            // style: (row, rowIndex) => {
            //     const backgroundColor = rowIndex > 1 ? '#00BFFF' : '#00FFFF';
            //     return { backgroundColor }
            // }
        },


    ];

    const selectRow = {
        // mode: 'checkbox',
        // clickToSelect: true,
        // style: (row, rowIndex) => {
        //   const backgroundColor = rowIndex > 1 ? '#00BFFF' : '#00FFFF';
        //   return { backgroundColor };
        // }
    };

    const defaultSorted = [
        {
            dataField: "PriceList", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pageOptions = {
        sizePerPage: 10,
        // totalSize: props.tableData.length,
        custom: true,
    };

    function customMatchFunc({
        searchText,
        value,
        column,
        row
    }) {
        debugger
        if (typeof value !== 'undefined') {
            return value.startsWith(searchText);
        }
        return false;
    }



    return (
        <React.Fragment>
            <MetaTags>
                <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
            </MetaTags>
            <div className="page-content">
                <Breadcrumb
                    title={"Count :"}
                    breadcrumbItem={userPageAccessState.PageHeading}
                    IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                    breadcrumbCount={`Product Count: ${"searchCount"}`}
                    // SearchProps={searchProps}
                    // IsSearchVissible={true}
                    RedirctPath={"/#"}
                    isExcelButtonVisible={true}
                    ExcelData={items}
                />

                <Row className="mb-1 border border-black text-black mt-2 " style={{ backgroundColor: "#dddddd" }} >

                    <Col md="2" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2">Order Date</Label>
                            <Col md="7">
                                <Flatpickr
                                    className="form-control d-block"
                                    // value={orderDate}
                                    placeholder="dd Mm,yyyy"
                                    options={{
                                        altInput: true,
                                        altFormat: "F j, Y",
                                        dateFormat: "Y-m-d"
                                    }}
                                    onChange={(y, e) => {
                                        // setOrderDate(e);
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col md="4">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-sm-4 p-2">Customer Name</Label>
                            <Col md="8">
                                <Select
                                    // Value={customerName_dropdownSelect}
                                    classNamePrefix="select2-Customer"
                                    id={"inp-customerName"}
                                // options={CustomerDropdownOptions}
                                // onchange={(e) => { setCustomerName_dropdownSelect(e) }}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col md="3">

                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-sm-4 p-2 ml-n4 ">Descreption</Label>
                            <Col md="8">
                                <Input
                                    placeholder="Enter Description"
                                    id='inp-description'
                                />
                            </Col>
                        </FormGroup>
                    </Col >



                    <Col md="1"></Col>

                    <Col md="2" className="mt-n1 ">
                        <Label htmlFor="validationCustom01"> </Label>
                        <div className=" bg-soft-info text-center text-black  external-event  col-form-label rounded-2 align-right">
                            {/* Order Amount : &nbsp;&nbsp; {totalAmountCount.toFixed(2)}&nbsp; */}
                        </div>
                        {/* <h5 className=" text-left text-danger  align-left">
                        Order Amount:&nbsp; {totalAmountCount.toFixed(2)}
                       </h5> */}
                    </Col>

                </Row>
<ABC/>

                <PaginationProvider pagination={paginationFactory(pageOptions)}>
                    {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                            keyField="id"
                            defaultSorted={defaultSorted}
                            data={items}
                            columns={pagesListColumns}
                            search
                        >
                            {(toolkitProps, a,) => (
                                <React.Fragment>

                                    {/* <Breadcrumb
                                                    title={"Count :"}
                                                    breadcrumbItem={userPageAccessState.PageHeading}
                                                    IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                                                    SearchProps={toolkitProps.searchProps}
                                                    breadcrumbCount={`Product Count: ${items.length}`}
                                                    IsSearchVissible={true}
                                                    RedirctPath={"masterPath"}
                                                    isExcelButtonVisible={true}
                                                    ExcelData={items}
                                                /> */}

                                    {/* {test(toolkitProps, paginationProps,  dispatch,"Items")} */}


                                    {/* <ClearSearchButton { ...props.searchProps } /> */}
                                    <Row>

                                        <Col xl="12">
                                            <div className="table table-unRresponsive">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    // responsive
                                                    bordered={false}
                                                    striped={false}
                                                    // cellEdit={cellEditFactory({ mode: 'dbclick', blurToSave: true })}
                                                    search={{ customMatchFunc }}
                                                    classes={"table  table-bordered table-hover"}
                                                    // options = {
                                                    //  { noDataText: (<i className="fa fa-circle-o-notch fa-spin" style={{'fontSize': '24px'}}></i>)
                                                    // }}
                                                    noDataIndication={<div className="text-danger">
                                                        "Please Add One Row In Table"</div>}
                                                    // {...searchProps}

                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />
                                                {/* <MySearch {...toolkitProps.searchProps} /> */}
                                                {mySearchProps(toolkitProps.searchProps)  }
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="align-items-md-center mt-30">
                                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                                            <PaginationListStandalone {...paginationProps} />
                                        </Col>
                                    </Row>
                                </React.Fragment>
                            )}
                        </ToolkitProvider>
                    )}

                </PaginationProvider>
            </div>
            {/* </div> */}

        </React.Fragment>
    )
}
export default Order

// // className={`${row.ispty ? "text-info" : null}`}
// let searchCount = 0

// let searchProps = {
//     onClear: function onClear() { },
//     onSearch: function onSearch() { },
//     searchText: ""
// }

// const test = (toolkitProps, paginationProps,  dispatch,ButtonMsgLable) => {
//     debugger

//     let iscall=0
//     if(paginationProps.dataSize){
//         iscall=paginationProps.dataSize
//     }
//     let search = {
//         onClear: function onClear() { },
//         onSearch: function onSearch() { },
//         searchText: ""
//     }
//     // if()
//     if(!(iscall===searchCount)){
//         dispatch(BreadcrumbSearchProps(toolkitProps.searchProps))
//         dispatch(BreadcrumbFilterSize(iscall))
//         searchCount = paginationProps.dataSize
//     }
//     searchProps = toolkitProps.searchProps
// }
let props2 = function onSearch() { }
const MySearch = (props1) => {
     props2=props1;

    // let input;
    // const handleClick = () => {
    //     props1.onSearch(input.value);
    // };
    // function onChange() {
    //     debugger
    // }

    // return (
    //     <div>
    //         <input
    //             className="form-control"
    //             //   style={ { backgroundColor: 'pink' } }
    //             ref={n => input = n}
    //             type="text"
    //             onChange={onChange}
    //         />
    //         <button className="btn btn-warning" onClick={handleClick}>Click to Search!!</button>
    //     </div>
    // );
};

 const ABC=()=>{

    let input;
    const handleClick = () => {
        props2.onSearch(input.value);
    };
    function onChange() {
        debugger
    }
    return (
        <div>
            <input
                className="form-control"
                //   style={ { backgroundColor: 'pink' } }
                ref={n => input = n}
                type="text"
                onChange={onChange}
            />
            <button className="btn btn-warning" 
            onClick={handleClick}
            >Click to Search!!</button>
        </div>
    );
 }