import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, CustomInput, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button, Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess, commonPageField, commonPageFieldSuccess, getBaseUnit_ForDropDown, getGroupList, getItemList, getSubGroupList, get_Group_By_GroupType_ForDropDown, get_Sub_Group_By_Group_ForDropDown, get_Sub_Group_By_Group_ForDropDown_Success } from "../../store/actions";
import { GetRoutesList, GetRoutesListSuccess } from "../../store/Administrator/RoutesRedux/actions";
import { getPartyTypelist } from "../../store/Administrator/PartyTypeRedux/action";
import { ItemSaleGoButton_API, ItemSaleGoButton_API_Success, Items_On_Group_And_Subgroup_API, SupplierOnPartyType_API, SupplierOnPartyType_API_Success } from "../../store/Report/ItemSaleReport/action";
import "../ItemSaleReport/ItemSaleCSS.scss";

const defaultTableColumns = [
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
        text: "	GroupName",
        dataField: "GroupName",
    },
    {
        text: "	SubGroupName",
        dataField: "SubGroupName",
    },
    {
        text: "	ItemName",
        dataField: "ItemName",
    },

    {
        text: "	QtyInKg",
        dataField: "QtyInKg",
    },
    {
        text: "	QtyInNo",
        dataField: "QtyInNo",
    },
    {
        text: "	QtyInBox",
        dataField: "QtyInBox",
    },
    {
        text: "	Rate",
        dataField: "Rate",
    },
    {
        text: "	BasicAmount",
        dataField: "BasicAmount",
    },
    {
        text: "	DiscountAmount",
        dataField: "DiscountAmount",
    },
    {
        text: "	GSTPercentage",
        dataField: "GSTPercentage",
    },
    {
        text: "	GSTAmount",
        dataField: "GSTAmount",
    },
    {
        text: "	Amount",
        dataField: "Amount",
    },
    {
        text: "	GrandTotal",
        dataField: "GrandTotal",
    },
    {
        text: "	RoundOffAmount",
        dataField: "RoundOffAmount",
    },
    {
        text: "	TCSAmount",
        dataField: "TCSAmount",
    },
    {
        text: "	FullGRNNumber",
        dataField: "FullGRNNumber",
    },
];

const ItemSaleReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [userPageAccessState, setUserAccState] = useState('');
    const [hederFilters, setHederFilters] = useState({
        fromdate: currentDate_ymd,
        todate: currentDate_ymd,
    })

    const [channelFromSelect, setChannelFromSelect] = useState({ value: 0, label: "All" });
    const [channelToSelect, setChannelToSelect] = useState({ value: "", label: "All" });
    const [routeSelect, setRouteSelect] = useState({ value: "", label: "All" });
    const [supplierSelect, setSupplierSelect] = useState({ value: "", label: "All" });
    const [customerSelect, setCustomerSelect] = useState({ value: "", label: "All" });
    const [unitDropdown, setUnitDropdown] = useState("");
    const [ItemNameSelect, setItemNameSelect] = useState({ value: "", label: "All" });
    const [productSelect, setProductSelect] = useState({ value: 0, label: "All" });
    const [subProductSelect, setSubProductSelect] = useState({ value: 0, label: "All" });

    const [SubProductOptions, setSubProductOptions] = useState([]);
    const [supplierOptions, setSupplierOptions] = useState([]);

    const [customerCheckbox, setCustomerCheckbox] = useState(false);
    const [routeCheckbox, setRouteCheckbox] = useState(false);
    const [channelToCheckbox, setChannelToCheckbox] = useState(false);
    const [productCheckbox, setProductCheckbox] = useState(false);
    const [subProductCheckbox, setSubProductCheckbox] = useState(false);
    const [itemNameCheckbox, setItemNameCheckbox] = useState(false);
    const [fromDateCheckbox, setFromDateCheckbox] = useState(false);
    const [channelFromCheckbox, setChannelFromCheckbox] = useState(false);
    const [supplierCheckbox, setSupplierCheckbox] = useState(false);

    const [tableData, setTableData] = useState([]);
    const [initaialBaseData, setInitaialBaseData] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState(defaultTableColumns);

    const { goBtnLoading,
        ItemSaleReportGobtn,
        userAccess,
        supplierLoading,
        pageField,
        supplier,
        RoutesList,
        routesDropLoading,
        PartyTypes,
        customerDropdown,
        customerDropLoading,
        BaseUnit,
        ItemDropdownloading,
        ItemNameList,
        productLoading,
        productDropdown,
        subProductLoading,
        subProductDropdown,
        getSubProductbyProduct,
        supplierListLoading,
        supplierListOnPartyType } = useSelector(
            (state) => ({
                goBtnLoading: state.ItemSaleReportReducer.goBtnLoading,
                ItemSaleReportGobtn: state.ItemSaleReportReducer.ItemSaleReportGobtn,

                supplierLoading: state.CommonAPI_Reducer.SSDD_ListLoading,
                supplier: state.CommonPartyDropdownReducer.commonPartyDropdown,

                supplierListLoading: state.ItemSaleReportReducer.supplierListLoading,
                supplierListOnPartyType: state.ItemSaleReportReducer.supplierList,

                RoutesList: state.RoutesReducer.RoutesList,
                routesDropLoading: state.RoutesReducer.goBtnLoading,

                PartyTypes: state.PartyTypeReducer.ListData,

                customerDropdown: state.CommonAPI_Reducer.vendorSupplierCustomer,
                customerDropLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,

                ItemDropdownloading: state.ItemSaleReportReducer.itemListLoading,
                ItemNameList: state.ItemSaleReportReducer.itemList,

                BaseUnit: state.ItemMastersReducer.BaseUnit,

                productLoading: state.GroupReducer.goBtnLoading,
                productDropdown: state.GroupReducer.groupList,

                subProductLoading: state.SubGroupReducer.goBtnLoading,
                subProductDropdown: state.SubGroupReducer.SubgroupList,
                getSubProductbyProduct: state.ItemMastersReducer.SubGroupList,

                userAccess: state.Login.RoleAccessUpdateData,
                pageField: state.CommonPageFieldReducer.pageField
            })
        );
    const { fromdate, todate, } = hederFilters;

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
        dispatch(getGroupList());
        dispatch(getSubGroupList())
        dispatch(getBaseUnit_ForDropDown());
        dispatch(Items_On_Group_And_Subgroup_API({ "Group": 0, "SubGroup": 0 }));
        dispatch(BreadcrumbShowCountlabel(`${"Amount"} :${0}`))
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(ItemSaleGoButton_API_Success([]));
        }
    }, [])

    useEffect(() => {

        if (ItemSaleReportGobtn.length > 0) {
            setInitaialBaseData(ItemSaleReportGobtn);
            sortData(ItemSaleReportGobtn);
            dispatch(ItemSaleGoButton_API_Success([]));
            const totalAmount = ItemSaleReportGobtn.reduce((sum, item) => {
                return sum + parseFloat(item.Amount);
            }, 0);
            dispatch(BreadcrumbShowCountlabel(`${"Amount"} :${(totalAmount).toFixed(2)}`))
        }
    }, [ItemSaleReportGobtn])

    useEffect(() => {

        let SubProduct = []
        if (productSelect.value === 0) {
            SubProduct = subProductDropdown.map((i) => ({
                value: i.id,
                label: i.Name,
            }))
        } else {
            SubProduct = getSubProductbyProduct.map((i) => ({
                value: i.id,
                label: i.Name,
            }))
        }
        SubProduct.unshift({
            value: 0,
            label: "All"
        });
        setSubProductOptions(SubProduct)

    }, [productSelect, subProductDropdown, getSubProductbyProduct])

    useEffect(() => {

        let supplierOption = []
        if (channelFromSelect.value === 0) {
            supplierOption = supplier.map((i) => ({
                value: i.id,
                label: i.Name,
            }))
        } else {
            supplierOption = supplierListOnPartyType.map((i) => ({
                value: i.id,
                label: i.Name,
            }))
        }
        supplierOption.unshift({
            value: '',
            label: "All"
        });
        setSupplierOptions(supplierOption)

    }, [channelFromSelect, supplier, supplierListOnPartyType])

    const customerOptions = customerDropdown.map((i) => ({
        value: i.id,
        label: i.Name,
    }))
    customerOptions.unshift({
        value: "",
        label: "All"
    });

    const ProductOptions = productDropdown.map((i) => ({
        value: i.id,
        label: i.Name,
    }))
    ProductOptions.unshift({
        value: 0,
        label: "All"
    });

    const ItemNameOptions = ItemNameList.map((i) => ({
        value: i.id,
        label: i.Name,
    }))
    ItemNameOptions.unshift({
        value: "",
        label: "All"
    });

    const ChannelDropdown_Options = PartyTypes.map((index) => ({
        value: index.id,
        label: index.Name,
        division: index.IsDivision
    }));
    ChannelDropdown_Options.unshift({
        value: 0,
        label: "All"
    });

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
        dispatch(GetVenderSupplierCustomer({ subPageMode: url.ITEM_SALE_REPORT, RouteID: event.value, PartyID: supplierSelect.value }))
        setRouteSelect(event)
    }

    function ChannelFromDropdown_Onchange(e) {

        setChannelFromSelect(e)
        setSupplierSelect({ value: "", label: "All" })
        dispatch(SupplierOnPartyType_API({ employeeID: _cfunc.loginEmployeeID(), channelFromID: e.value }))
    }

    function SupplierOnChange(event) {

        setSupplierSelect(event)
        setRouteSelect({ value: "", label: "All" })
        setCustomerSelect({ value: "", label: "All" })
        setTableData([]);
        setInitaialBaseData([]);
        dispatch(GetVenderSupplierCustomerSuccess([]))
        dispatch(GetRoutesListSuccess([]))
        if (event.value > 0) {
            dispatch(GetVenderSupplierCustomer({ subPageMode: url.ITEM_SALE_REPORT, PartyID: event.value, RouteID: "" }))
            const jsonBody = JSON.stringify({
                CompanyID: _cfunc.loginCompanyID(),
                PartyID: event.value,
            });
            dispatch(GetRoutesList(jsonBody));
        }
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...hederFilters }
        newObj.fromdate = date
        setHederFilters(newObj);
        setTableData([]);
        setInitaialBaseData([]);
    }

    function todateOnchange(e, date) {
        let newObj = { ...hederFilters }
        newObj.todate = date
        setHederFilters(newObj);
        setTableData([]);
        setInitaialBaseData([]);
    }

    function ProductOnchange(e) {

        setProductSelect(e)
        dispatch(get_Sub_Group_By_Group_ForDropDown(e.value))
        dispatch(Items_On_Group_And_Subgroup_API({ "Group": e.value, "SubGroup": 0 }))
        setSubProductSelect({ value: 0, label: "All" })
        setItemNameSelect({ value: "", label: "All" })
        dispatch(get_Sub_Group_By_Group_ForDropDown_Success([]))
    }

    function Sub_ProductOnChange(e) {
        setSubProductSelect(e)
        dispatch(Items_On_Group_And_Subgroup_API({ "Group": 0, "SubGroup": e.value }))
        setItemNameSelect({ value: "", label: "All" })

    }

    function goButtonHandler() {
        try {
            const jsonBody = JSON.stringify({
                "FromDate": fromdate,
                "ToDate": todate,
                "PartyType": supplierSelect.value > 0 ? "" : channelFromSelect.value,
                "Party": supplierSelect.value
            });
            dispatch(ItemSaleGoButton_API({ jsonBody, btnId: url.ITEM_SALE_REPORT }))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    const sortData = (baseData = []) => {

        // setTableData(filtered);

        const checkboxOptions = [
            {
                fieldName: 'CustomerName',
                checkboxState: customerCheckbox,
                selectValue: customerSelect,
            },
            {
                fieldName: 'RouteName',
                checkboxState: routeCheckbox,
                selectValue: routeSelect,
            },
            {
                fieldName: 'SaleMadeTo',
                checkboxState: channelToCheckbox,
                selectValue: channelToSelect,
            },
            {
                fieldName: 'GroupName',
                checkboxState: productCheckbox,
                selectValue: productSelect,
            },
            {
                fieldName: 'SubGroupName',
                checkboxState: subProductCheckbox,
                selectValue: subProductSelect,
            },
            {
                fieldName: 'ItemName',
                checkboxState: itemNameCheckbox,
                selectValue: ItemNameSelect,
            },
            {
                fieldName: 'InvoiceDate',
                checkboxState: fromDateCheckbox,
                selectValue: { value: "", label: "All" },
            },
            {
                fieldName: 'SaleMadeFrom',
                checkboxState: channelFromCheckbox,
                selectValue: { value: "", label: "All" },
            },
            {
                fieldName: 'SupplierName',
                checkboxState: supplierCheckbox,
                selectValue: { value: "", label: "All" },
            },


            // Add more checkbox options here
        ];

        let manupulatedData = baseData;

        const filterOption = checkboxOptions.filter(option => !(option.selectValue.value === ''));

        if (filterOption.length > 0) {
            manupulatedData = baseData.filter(item => {
                return filterOption.every(option => {
                    var a = item[option.fieldName] === option.selectValue.label;
                    return a;
                });
            });
        }

        // Apply grouping and filtering logic for each checkbox option
        if (checkboxOptions.some(option => option.checkboxState)) {

            const newSelectedColumns = checkboxOptions
                .filter(option => option.checkboxState)
                .map(option => ({ text: option.fieldName, dataField: option.fieldName }));

            // Always include the default "Amount" column
            newSelectedColumns.push({ text: "Amount", dataField: "Amount" });
            setSelectedColumns(newSelectedColumns);

            const groupedData = {};

            manupulatedData.forEach(item => {
                const groupValues = checkboxOptions
                    .filter(option => option.checkboxState && option.fieldName !== 'Amount')
                    .map(option => item[option.fieldName]);

                const groupKey = groupValues.join('-');
                if (!groupedData[groupKey]) {
                    groupedData[groupKey] = {
                        ...item,
                        Amount: 0,
                    };
                }
                groupedData[groupKey].Amount += parseFloat(item.Amount);
                // Format Amount to have only two decimal places
                groupedData[groupKey].Amount = parseFloat(groupedData[groupKey].Amount.toFixed(2));
            });
            manupulatedData = Object.values(groupedData);
        }
        else {
            setSelectedColumns(defaultTableColumns);
        }

        setTableData(manupulatedData);
        const totalAmount = manupulatedData.reduce((sum, item) => {
            return sum + parseFloat(item.Amount);
        }, 0);
        dispatch(BreadcrumbShowCountlabel(`${"Amount"} :${(totalAmount).toFixed(2)}`))
    }

    function CustomerOnChange(e) {
        setCustomerSelect(e)
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
                                            className="p-1"
                                            type="checkbox"
                                            checked={fromDateCheckbox}
                                            onChange={(e) => { setFromDateCheckbox(e.target.checked) }}
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
                                            className="p-1"
                                            type="checkbox"
                                            checked={channelFromCheckbox}
                                            onChange={(e) => { setChannelFromCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-4 p-2">Channel From</Label>
                                        <Col>
                                            <C_Select
                                                value={channelFromSelect}
                                                isSearchable={true}
                                                //  isLoading={partyLoading}       
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={ChannelDropdown_Options}
                                                onChange={(e) => { ChannelFromDropdown_Onchange(e) }}

                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3}>
                                    <FormGroup className="mb-n3 row mt-1">
                                        <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                            className="p-1"
                                            type="checkbox"
                                            checked={supplierCheckbox}
                                            onChange={(e) => { setSupplierCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-4 p-2">Supplier</Label>
                                        <Col>
                                            <C_Select
                                                value={supplierSelect}
                                                isSearchable={true}
                                                isLoading={supplierLoading}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={supplierOptions}
                                                onChange={SupplierOnChange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>

                        <Col sm="1" className="mt-1 mb-1 ">
                            <Go_Button
                                loading={goBtnLoading}
                                onClick={goButtonHandler}
                            />
                        </Col>
                    </Row>
                </div>

                <div className="item-Sale-card_3 px-2 text-black mt-1">
                    <Row className="mb-1">
                        <Col className="col col-11">
                            <Row>
                                <Col sm={3}>
                                    <FormGroup className=" row mt-1 mb-n3">
                                        <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                            className="p-1"
                                            type="checkbox"
                                            checked={channelToCheckbox}
                                            onChange={(e) => { setChannelToCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-3 p-2">Channel to</Label>
                                        <Col sm={6}>
                                            <C_Select
                                                value={channelToSelect}
                                                isSearchable={true}
                                                //  isLoading={partyLoading}       
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={ChannelDropdown_Options}
                                                onChange={(e) => { setChannelToSelect(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3}>
                                    <FormGroup className=" row mt-1">
                                        <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                            className="p-1"
                                            type="checkbox"
                                            checked={routeCheckbox}
                                            onChange={(e) => { setRouteCheckbox(e.target.checked) }}
                                        />
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
                                            className="p-1"
                                            type="checkbox"
                                            checked={customerCheckbox}
                                            onChange={(e) => { setCustomerCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-4 p-2">Customer</Label>

                                        <Col>
                                            <C_Select
                                                value={customerSelect}
                                                isSearchable={true}
                                                isLoading={customerDropLoading}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={customerOptions}
                                                onChange={(e) => { CustomerOnChange(e) }}

                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3}>
                                    <FormGroup className=" row mt-1">
                                        <Label className="col-sm-4 p-2">Select</Label>

                                        <Col>
                                            <C_Select
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
                        </Col>
                        <Col sm="1" className="mt-1 mb-1 ">
                            <C_Button
                                type="button"
                                className="btn btn-outline-primary border-1 font-size-12 text-center"
                                onClick={() => { sortData(initaialBaseData) }} // Example field, you can change it
                            >
                                Sort
                            </C_Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={3}>
                            <FormGroup className=" row mt-2">
                                <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                    className="p-1"
                                    type="checkbox"
                                    checked={productCheckbox}
                                    onChange={(e) => { setProductCheckbox(e.target.checked) }}
                                />
                                <Label className="col-sm-3 p-2">Product</Label>
                                <Col sm={6}>
                                    <C_Select
                                        value={productSelect}
                                        isSearchable={true}
                                        isLoading={productLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={ProductOptions}
                                        onChange={ProductOnchange}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3}>
                            <FormGroup className=" row mt-2">
                                <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                    className="p-1"
                                    type="checkbox"
                                    checked={subProductCheckbox}
                                    onChange={(e) => { setSubProductCheckbox(e.target.checked) }}
                                />
                                <Label className="col-sm-4 p-2">Sub Product</Label>
                                <Col>
                                    <C_Select
                                        value={subProductSelect}
                                        isSearchable={true}
                                        isLoading={subProductLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={SubProductOptions}
                                        onChange={(e) => { Sub_ProductOnChange(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3}>
                            <FormGroup className=" row mt-2">
                                <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                    className="p-1"
                                    type="checkbox"
                                    checked={itemNameCheckbox}
                                    onChange={(e) => { setItemNameCheckbox(e.target.checked) }}
                                />
                                <Label className="col-sm-4 p-2">Items</Label>
                                <Col>
                                    <C_Select
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
                        keyField="id"
                        data={tableData}
                        columns={selectedColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table">
                                            <BootstrapTable
                                                keyField="id"
                                                key={`table-id-${new Date().getTime()}`}
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
