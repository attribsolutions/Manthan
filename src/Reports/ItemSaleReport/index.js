import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button, Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { GetVenderSupplierCustomer, commonPageField, commonPageFieldSuccess, getBaseUnit_ForDropDown, getItemList } from "../../store/actions";
import { GetRoutesList } from "../../store/Administrator/RoutesRedux/actions";
import "../ItemSaleReport/ItemSaleCSS.scss";
import { getPartyTypelist } from "../../store/Administrator/PartyTypeRedux/action";

const ItemSaleReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [userPageAccessState, setUserAccState] = useState('');
    const [saleMadeFromeSelect, setSaleMadeFromeSelect] = useState({ value: "", label: "All" });
    const [saleMadeToSelect, setSaleMadeToSelect] = useState({ value: "", label: "All" });
    const [routeSelect, setRouteSelect] = useState({ value: "", label: "All" });
    const [supplierSelect, setSupplierSelect] = useState('');
    const [customerSelect, setCustomerSelect] = useState({ value: "", label: "All" });
    const [unitDropdown, setUnitDropdown] = useState("");
    const [ItemNameSelect, setItemNameSelect] = useState({ value: "", label: "All" });

    const [hederFilters, setHederFilters] = useState({ fromdate: currentDate_ymd, todate: currentDate_ymd, venderSelect: { value: '', label: "All" } })

    const { userAccess,
        partyLoading,
        pageField,
        supplier,
        RoutesList,
        routesDropLoading,
        PartyTypes,
        customerDropdown,
        customerDropLoading,
        BaseUnit,
        ItemDropdownloading,
        ItemNameList } = useSelector(
            (state) => ({
                partyLoading: state.CommonAPI_Reducer.SSDD_ListLoading,
                supplier: state.CommonPartyDropdownReducer.commonPartyDropdown,

                RoutesList: state.RoutesReducer.RoutesList,
                routesDropLoading: state.RoutesReducer.goBtnLoading,

                PartyTypes: state.PartyTypeReducer.ListData,

                customerDropdown: state.CommonAPI_Reducer.vendorSupplierCustomer,
                customerDropLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,

                ItemDropdownloading: state.ItemMastersReducer.loading,
                ItemNameList: state.ItemMastersReducer.ItemList,

                BaseUnit: state.ItemMastersReducer.BaseUnit,
                userAccess: state.Login.RoleAccessUpdateData,
                pageField: state.CommonPageFieldReducer.pageField
            })
        );
    const { fromdate, todate, venderSelect } = hederFilters;
    const Data = []

    // const Data = [
    //     {
    //         id: 1502,
    //         InvoiceDate: "2023-07-31",
    //         SaleMadeFrom: "Super Stokiest",
    //         SaleMadeTo: "Retailer",
    //         FullInvoiceNumber: "IN51",
    //         SupplierName: "Rahul Enterprises",
    //         RouteName: "aurangabad",
    //         CustomerName: "COUNTER SALES",
    //         GroupName: "Bakarwadi",
    //         SubGroupName: "Tray",
    //         ItemName: "Bakarwadi 250 g Tray",
    //         QtyInKg: "20.00",
    //         QtyInNo: "80.00",
    //         QtyInBox: "2.00",
    //         Rate: "3476.79",
    //         BasicAmount: "6953.58",
    //         DiscountAmount: "0.00",
    //         GSTPercentage: "12.00",
    //         GSTAmount: "834.42",
    //         Amount: "7788.00",
    //         GrandTotal: "7788.00",
    //         RoundOffAmount: "0.00",
    //         TCSAmount: "0.00",
    //         FullGRNNumber: null
    //     },
    //     {
    //         id: 1598,
    //         InvoiceDate: "2023-08-01",
    //         SaleMadeFrom: "Super Stokiest",
    //         SaleMadeTo: "Retailer",
    //         FullInvoiceNumber: "IN5",
    //         SupplierName: "Shri Parasnath Agencies",
    //         RouteName: null,
    //         CustomerName: "Jaishankar Dairy",
    //         GroupName: "Bakarwadi",
    //         SubGroupName: "Tray",
    //         ItemName: "Bakarwadi 250 g Tray",
    //         QtyInKg: "10.00",
    //         QtyInNo: "40.00",
    //         QtyInBox: "1.00",
    //         Rate: "3476.79",
    //         BasicAmount: "3375.52",
    //         DiscountAmount: "101.27",
    //         GSTPercentage: "12.00",
    //         GSTAmount: "405.06",
    //         Amount: "3780.58",
    //         GrandTotal: "3781.00",
    //         RoundOffAmount: "0.58",
    //         TCSAmount: "0.00",
    //         FullGRNNumber: null
    //     },
    //     {
    //         id: 1625,
    //         InvoiceDate: "2023-08-01",
    //         SaleMadeFrom: "Super Stokiest",
    //         SaleMadeTo: "Retailer",
    //         FullInvoiceNumber: "IN3",
    //         SupplierName: "New Shantisagar Agencies",
    //         RouteName: null,
    //         CustomerName: "Avenue Supermarts Ltd",
    //         GroupName: "Bakarwadi",
    //         SubGroupName: "Tray",
    //         ItemName: "Bakarwadi 250 g Tray",
    //         QtyInKg: "50.00",
    //         QtyInNo: "200.00",
    //         QtyInBox: "5.00",
    //         Rate: "84.27",
    //         BasicAmount: "16854.00",
    //         DiscountAmount: "0.00",
    //         GSTPercentage: "12.00",
    //         GSTAmount: "2022.48",
    //         Amount: "18876.48",
    //         GrandTotal: "33291.32",
    //         RoundOffAmount: "0.32",
    //         TCSAmount: "0.00",
    //         FullGRNNumber: null
    //     },
    //     {
    //         id: 1625,
    //         InvoiceDate: "2023-08-01",
    //         SaleMadeFrom: "Super Stokiest",
    //         SaleMadeTo: "Retailer",
    //         FullInvoiceNumber: "IN3",
    //         SupplierName: "New Shantisagar Agencies",
    //         RouteName: null,
    //         CustomerName: "Avenue Supermarts Ltd",
    //         GroupName: "Bakarwadi",
    //         SubGroupName: "Tray",
    //         ItemName: "Bakarwadi 500 g Tray",
    //         QtyInKg: "40.00",
    //         QtyInNo: "80.00",
    //         QtyInBox: "4.00",
    //         Rate: "160.88",
    //         BasicAmount: "12870.40",
    //         DiscountAmount: "0.00",
    //         GSTPercentage: "12.00",
    //         GSTAmount: "1544.44",
    //         Amount: "14414.84",
    //         GrandTotal: "33291.32",
    //         RoundOffAmount: "0.32",
    //         TCSAmount: "0.00",
    //         FullGRNNumber: null
    //     },
    //     {
    //         id: 1657,
    //         InvoiceDate: "2023-08-02",
    //         SaleMadeFrom: "Super Stokiest",
    //         SaleMadeTo: "Retailer",
    //         FullInvoiceNumber: "IN8",
    //         SupplierName: "Shri Parasnath Agencies",
    //         RouteName: null,
    //         CustomerName: "COUNTER SALE",
    //         GroupName: "Bakarwadi",
    //         SubGroupName: "Tray",
    //         ItemName: "Bakarwadi 500 g Tray",
    //         QtyInKg: "10.00",
    //         QtyInNo: "20.00",
    //         QtyInBox: "1.00",
    //         Rate: "3318.57",
    //         BasicAmount: "3221.91",
    //         DiscountAmount: "96.66",
    //         GSTPercentage: "12.00",
    //         GSTAmount: "386.62",
    //         Amount: "3608.53",
    //         GrandTotal: "3609.00",
    //         RoundOffAmount: "0.53",
    //         TCSAmount: "0.00",
    //         FullGRNNumber: null
    //     }]


    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.ITEM_SALE_REPORT));
        dispatch(GetRoutesList());
        dispatch(getPartyTypelist());
        dispatch(GetVenderSupplierCustomer({ subPageMode: url.ITEM_SALE_REPORT, RouteID: "" }));
        dispatch(getBaseUnit_ForDropDown());
        dispatch(getItemList());
        return () => {
            dispatch(commonPageFieldSuccess(null));
        }
    }, [])

    const tableColumns = [
        {
            text: "InvoiceDate",
            dataField: "InvoiceDate",
        },
        {
            text: "SaleMadeFrom",
            dataField: "SaleMadeFrom",
        },
        {
            text: "SaleMadeTo",
            dataField: "SaleMadeTo",
        },
        {
            text: "	FullInvoiceNumber",
            dataField: "FullInvoiceNumber",
        },
        {
            text: "SupplierName",
            dataField: "SupplierName",
        },
        {
            text: "RouteName",
            dataField: "RouteName",
        },
        {
            text: "CustomerName",
            dataField: "CustomerName",
        },
        {
            text: "	SubGroupName",
            dataField: "SubGroupName",
        },
        {
            text: "	ItemName",
            dataField: "ItemName",
        },

    ];

    const supplierDropdownOptions = supplier.map((data) => ({
        value: data.id,
        label: data.Name,
    }))

    const customerOptions = customerDropdown.map((i) => ({
        value: i.id,
        label: i.Name,
    }))

    const ItemNameOptions = ItemNameList.map((i) => ({
        value: i.id,
        label: i.Name,
    }))

    const PartyTypeDropdown_Options = PartyTypes.map((index) => ({
        value: index.id,
        label: index.Name,
        division: index.IsDivision
    }));

    const checkboxOption = [{
        value: 1,
        label: "Invoice Number",
    },
    {
        value: 2,
        label: "Show Discounted Items",
    },
    {
        value: 3,
        label: "GRNID",
    },
    {
        value: 4,
        label: "DiscountInRS",
    },
    {
        value: 5,
        label: "InvoiceGrandTotal",
    },
    {
        value: 6,
        label: "RoundOffAmount",
    },
    {
        value: 7,
        label: "TCSAmount",
    }
    ]

    const RoutesListOptions = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
        IsActive: index.IsActive
    }));

    const RouteOptions = RoutesListOptions.filter((index) => {
        return index.IsActive === true
    });

    RouteOptions.unshift({
        value: "",
        label: "All"
    });

    const Unit_DropdownOptions = BaseUnit.filter(index => index.Name === "No" || index.Name === "Kg" || index.Name === "Box")
        .map(data => ({
            value: data.id,
            label: data.Name
        }));


    function RouteOnChange(event) {
        // setsupplierSelect('')
        dispatch(GetVenderSupplierCustomer({ subPageMode: url.ITEM_SALE_REPORT, RouteID: event.value, PartyID: supplierSelect.value }))
        setRouteSelect(event)
    }

    function SupplierOnChange(event) {

        setSupplierSelect(event)
        const jsonBody = JSON.stringify({
            CompanyID: _cfunc.loginCompanyID(),
            PartyID: event.value,
        });
        dispatch(GetRoutesList(jsonBody));
        dispatch(GetVenderSupplierCustomer({ subPageMode: url.ITEM_SALE_REPORT, PartyID: event.value, RouteID: "" }))
        setRouteSelect({ value: "", label: "All" })
        setCustomerSelect({ value: "", label: "All" })
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...hederFilters }
        newObj.fromdate = date
        setHederFilters(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...hederFilters }
        newObj.todate = date
        setHederFilters(newObj)
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>


            <div className="page-content">
                <div className="item-Sale-card_1 px-2 text-black mt-n1">
                    <Row>
                        <Col className="col col-11">
                            <Row>
                                <Col sm={3}>
                                    <FormGroup className="mb-n3 row mt-1">
                                        <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                            className="p-1" type="checkbox"
                                        />
                                        <Label className="col-sm-3 p-2">FromDate</Label>
                                        <Col sm={6}>
                                            <C_DatePicker
                                                name="FromDate"
                                                value={fromdate}
                                                onChange={fromdateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3}>
                                    <FormGroup className="mb-n3 row mt-1">

                                        <Label className="col-sm-4 p-2">ToDate</Label>
                                        <Col>
                                            <C_DatePicker
                                                name="ToDate"
                                                value={todate}
                                                onChange={todateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3}>
                                    <FormGroup className="mb-n3 row mt-1">
                                        <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                            className="p-1" type="checkbox"
                                        />
                                        <Label className="col-sm-4 p-2">Channel From</Label>
                                        <Col>
                                            <C_Select
                                                name="PartyName"
                                                value={saleMadeFromeSelect}
                                                isSearchable={true}
                                                //  isLoading={partyLoading}       

                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={PartyTypeDropdown_Options}
                                                onChange={(e) => { setSaleMadeFromeSelect(e) }}

                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3}>
                                    <FormGroup className="mb-n3 row mt-1">
                                        <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                            className="p-1" type="checkbox"
                                        />
                                        <Label className="col-sm-4 p-2">Supplier</Label>
                                        <Col>
                                            <C_Select
                                                name="PartyName"
                                                value={supplierSelect}

                                                isSearchable={true}
                                                //  isLoading={partyLoading}       

                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={supplierDropdownOptions}
                                                onChange={SupplierOnChange}

                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>

                        </Col>

                        <Col sm="1" className="mt-1 mb-1 ">
                            <Go_Button
                            // loading={reducers.goBtnloading} 
                            // id={gobtnId} 
                            // onClick={goButtonHandler} 
                            />
                        </Col>
                    </Row>
                </div>


                <div className="item-Sale-card_3 px-2 text-black mt-1">
                    <Row className="mb-1">
                        <Col sm={3}>
                            <FormGroup className=" row mt-1 mb-n3">
                                <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                    className="p-1" type="checkbox"
                                />
                                <Label className="col-sm-3 p-2">Channel to</Label>
                                <Col sm={6}>
                                    <C_Select
                                        name="PartyName"
                                        value={saleMadeToSelect}

                                        isSearchable={true}
                                        //  isLoading={partyLoading}       

                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={PartyTypeDropdown_Options}
                                        onChange={(e) => { setSaleMadeToSelect(e) }}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3}>
                            <FormGroup className=" row mt-1">
                                <Label className="col-sm-4 p-2">Route</Label>
                                <Col>
                                    <C_Select
                                        classNamePrefix="react-select"
                                        value={routeSelect}
                                        options={RouteOptions}
                                        // onChange={(e) => { setRouteSelect(e) }}
                                        onChange={(e) => { RouteOnChange(e) }}
                                        isLoading={routesDropLoading}
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3}>
                            <FormGroup className=" row mt-1">
                                <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                    className="p-1" type="checkbox"
                                />
                                <Label className="col-sm-4 p-2">Customer</Label>

                                <Col>
                                    <C_Select
                                        name="PartyName"
                                        value={customerSelect}
                                        isSearchable={true}
                                        isLoading={customerDropLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={customerOptions}
                                        onChange={(e) => {
                                            setCustomerSelect(e)
                                        }}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3}>
                            <FormGroup className=" row mt-1">
                                <Label className="col-sm-4 p-2">Select</Label>

                                <Col>
                                    <C_Select
                                        name="PartyName"
                                        // value={values.PartyName}         
                                        isSearchable={true}
                                        //  isLoading={partyLoading}       

                                        isMulti={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={checkboxOption}
                                    // onChange={partySlectHandler}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                    </Row>
                    <Row>
                        <Col sm={3}>
                            <FormGroup className=" row mt-2">
                                <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                    className="p-1" type="checkbox"
                                />
                                <Label className="col-sm-3 p-2">Product</Label>
                                <Col sm={6}>
                                    <C_Select
                                        name="PartyName"
                                        // value={values.PartyName}         

                                        isSearchable={true}
                                        //  isLoading={partyLoading}       

                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                    // options={Party_Option}
                                    // onChange={partySlectHandler}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3}>
                            <FormGroup className=" row mt-2">
                                <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                    className="p-1" type="checkbox"
                                />
                                <Label className="col-sm-4 p-2">Sub Product</Label>
                                <Col>
                                    <C_Select
                                        name="PartyName"
                                        // value={values.PartyName}         

                                        isSearchable={true}
                                        //  isLoading={partyLoading}       

                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                    // options={Party_Option}
                                    // onChange={partySlectHandler}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3}>
                            <FormGroup className=" row mt-2">
                                <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                    className="p-1" type="checkbox"
                                />
                                <Label className="col-sm-4 p-2">Items</Label>
                                <Col>
                                    <C_Select
                                        name="PartyName"
                                        value={ItemNameSelect}
                                        isSearchable={true}
                                         isLoading={ItemDropdownloading}       
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={ItemNameOptions}
                                        onChange={(e) => { setItemNameSelect(e) }}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3}>
                            <FormGroup className=" row mt-2">
                                <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                    className="p-1" type="checkbox"
                                />
                                <Label className="col-sm-4 p-2">Quantity</Label>
                                <Col>
                                    <C_Select
                                        name="PartyName"
                                        value={unitDropdown}

                                        isSearchable={true}
                                        //  isLoading={partyLoading}       

                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Unit_DropdownOptions}
                                        onChange={(e) => { setUnitDropdown(e) }}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                </div>

                <div className="mt-1">
                    <ToolkitProvider
                        keyField="PartyID"
                        // data={tableData.btnId !== "excel_btnId" ? DeletedInvoiceExportSerializerDetails : [{}]}
                        // columns={tableData.btnId !== "excel_btnId" ? tableColumns : [{}]}
                        data={Data}
                        columns={tableColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table">
                                            <BootstrapTable
                                                keyField="PartyID"
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Record Not available
                                                    </div>
                                                }
                                                onDataSizeChange={({ dataSize }) => {
                                                    // dispatch(BreadcrumbShowCountlabel(`Count:${dataSize > 0 && dataSize - 1}`));
                                                }}
                                                {...toolkitProps.baseProps}
                                            />
                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>
                                    </Col>
                                </Row>

                            </React.Fragment>
                        )}
                    </ToolkitProvider>
                </div>
            </div>

        </React.Fragment >
    )
}

export default ItemSaleReport;