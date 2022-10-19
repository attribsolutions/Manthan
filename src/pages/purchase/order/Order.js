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
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import "flatpickr/dist/themes/material_blue.css"

import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import { useHistory } from "react-router-dom";
import { getSupplier, goButton, postOrder, postOrderSuccess } from "../../../store/Purchase/OrderPageRedux/actions";
import { mySearchProps } from "../../../components/Common/CmponentRelatedCommonFile/SearchBox/MySearch";
import { AlertState } from "../../../store/actions";

let description = ''

function Order() {
    const { SearchBar } = Search;
    const props = { tableData: [], func: function a() { } }
    const dispatch = useDispatch();
    const history = useHistory()
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [effectiveDate, setEffectiveDate] = useState('');
    const [customerSelect, setCustomerSelect] = useState('');

    useEffect(() => {
        // document.getElementById("txtName").focus();
        // dispatch(getOrderItems_ForOrderPage());
        // dispatch(getPartyListAPI())
        dispatch(getSupplier())
    }, [])

    const {
        items,
        postMsg,
        supplier,
        CustomSearchInput,
        customerNameList,
        userAccess,
        pageField
    } = useSelector((state) => ({
        items: state.OrderPageReducer.orderItem,
        supplier: state.OrderPageReducer.supplier,
        postMsg: state.OrderPageReducer.postMsg,
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

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postOrderSuccess({ Status: false }))

            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: '/orderList',
            }))

        } else if (postMsg.Status === true) {
            dispatch(postOrderSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "error Message",
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])



    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));



    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "Name",
            sort: true,
        },
        {
            text: "Rate",
            dataField: "Rate",
            sort: true,
            formatter: (value, row) => (
                <span >
                    <Input type="text" defaultValue={value} />
                </span>
            ),

            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        {
            text: "GST %",
            dataField: "GST",
            sort: true,
            formatter: (value, row) => (

                <span >
                    {value}
                </span>

            ),
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "left" };
            }

        },
        {
            text: "Quntity",
            dataField: "Margin",
            sort: true,
            formatter: (value, row) => (

                <span >
                    <Input type="text" defaultValue={value} />
                </span>

            ),
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }


        },
        {
            text: "UOM",
            dataField: "Margin",
            sort: true,
            formatter: (value, row, key) => {
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
            headerStyle: (colum, colIndex) => {
                return { width: '150px', textAlign: 'center' };
            }

        },

    ];

    const defaultSorted = [
        {
            dataField: "PriceList", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pageOptions = {
        // sizePerPage: 0,
        totalSize: 0,
        custom: true,
    };

    const EffectiveDateHandler = (e, date) => {
        setEffectiveDate(date)
    }

    const GoButton_Handler = () => {
        debugger
        var a = description
        let division = 0
        try {
            division = JSON.parse(localStorage.getItem("roleId")).Party_id
        } catch (e) {
            alert(e)
        }

        let party = customerSelect.value
        const jsonBody = JSON.stringify({
            Division: division,
            Party: party,
            EffectiveDate: effectiveDate
        }
        );

        dispatch(goButton(jsonBody))
    };
    const saveHandeller = () => {
        let division = 0
        try {
            division = JSON.parse(localStorage.getItem("roleId")).Party_id
        } catch (e) {
            alert(e)
        }
        let party = customerSelect.value

        const itemArr = items.map(i => ({
            Item: i.id,
            Quantity: i.Quantity,
            MRP: i.MRP,
            Rate: i.Rate,
            Unit: 1,
            BaseUnitQuantity: 1,
            GST: 119,
            Margin: 675,
            BasicAmount: 450,
            GSTAmount: 1,
            CGST: 1,
            SGST: 1,
            IGST: 1,
            CGSTPercentage: 0,
            SGSTPercentage: 0,
            IGSTPercentage: 0,
            Amount: 1000,

        }))

        const jsonBody = JSON.stringify({
            OrderDate: effectiveDate,
            Customer: division,
            Supplier: party,
            OrderAmount: "1000",
            Description: description,
            CreatedBy: 1,
            UpdatedBy: 1,

            OrderItem: itemArr
        });
        dispatch(postOrder(jsonBody))
        debugger
      

    }


    return (
        <React.Fragment>
            <MetaTags>
                <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
            </MetaTags>
            <div className="page-content">
                {/* <Breadcrumb
                    title={"Count :"}
                    breadcrumbItem={userPageAccessState.PageHeading ? userPageAccessState.PageHeading : "Order"}
                    IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                    breadcrumbCount={`Product Count: ${"searchCount"}`}
                    // SearchProps={searchProps}
                    // IsSearchVissible={true}
                    RedirctPath={"/#"}
                    isExcelButtonVisible={true}
                    ExcelData={items}
                /> */}

                <Row><div className="col ">
                    <label className="font-size-18 form-label text-black " style={{ paddingLeft: "13px" }} >
                        {"Order"}</label>
                </div>
                    <div className=" col col-2 mt-n1 ">
                        <div className=" bg-soft-info text-center text-black  external-event  col-form-label rounded-2 align-right">
                            Order Amount : &nbsp;&nbsp; {"12410"}&nbsp;
                        </div>
                    </div>
                </Row>
                <Row className="mb-1 border border-black text-black mt-2 " style={{ backgroundColor: "#dddddd" }} >

                    <Col md="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2">Order Date</Label>
                            <Col md="7">
                                <Flatpickr
                                    id="EffectiveDateid"
                                    name="effectiveDate"
                                    // value={effectiveDate}
                                    // isDisabled={editMode === "edit" ? true : false}
                                    className="form-control d-block p-2 bg-white text-dark"
                                    placeholder="Select..."
                                    options={{
                                        altInput: true,
                                        altFormat: "F j, Y",
                                        dateFormat: "Y-m-d"
                                    }}
                                    onChange={EffectiveDateHandler}
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

                                    options={supplierOptions}
                                    onChange={(e) => { setCustomerSelect(e) }}
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
                                    onChange={e => description = e.target.value}
                                />
                            </Col>
                        </FormGroup>
                    </Col >
                    <Col md="1" className="mt-3 ">
                        <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                            onClick={GoButton_Handler}
                        >Go</Button>
                    </Col>

                    <Button type="button" color="btn btn-outline-primary border-2 font-size-12 "
                            onClick={saveHandeller}
                        >save</Button>
                </Row>


                <PaginationProvider pagination={paginationFactory(pageOptions)}>
                    {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                            keyField="id"
                            defaultSorted={defaultSorted}
                            data={items}
                            columns={pagesListColumns}
                            search
                        >
                            {(toolkitProps,) => (
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

                                    <Row>

                                        <Col xl="12">
                                            <div className="table table-unRresponsive">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    responsive
                                                    bordered={false}
                                                    striped={false}
                                                    classes={"table  table-bordered table-hover"}
                                                    noDataIndication={
                                                        <div className="text-danger">
                                                            "Please Add One Row In Table"
                                                        </div>
                                                    }
                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />

                                                {mySearchProps(toolkitProps.searchProps)}
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

