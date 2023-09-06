import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button, Change_Button, Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess, commonPageField, commonPageFieldSuccess, getBaseUnit_ForDropDown, getGroupList, getItemList, getSubGroupList, get_Group_By_GroupType_ForDropDown, get_Sub_Group_By_Group_ForDropDown, get_Sub_Group_By_Group_ForDropDown_Success } from "../../store/actions";
import { GetRoutesList, GetRoutesListSuccess } from "../../store/Administrator/RoutesRedux/actions";
import { getPartyTypelist, getPartyTypelistSuccess } from "../../store/Administrator/PartyTypeRedux/action";

import { ItemSaleGoButton_API, ItemSaleGoButton_API_Success, Items_On_Group_And_Subgroup_API, SupplierOnPartyType_API, SupplierOnPartyType_API_Success } from "../../store/Report/ItemSaleReport/action";
import ShowTableComponent from "./showTable";
import "../ItemSaleReport/ItemSaleCSS.scss";
import { useMemo } from "react";
import * as initail from "./hardcodeDetails";
import { date_dmy_func } from "../../components/Common/CommonFunction";

const ItemSaleReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [userPageAccessState, setUserAccState] = useState('');
    const [hederFilters, setHederFilters] = useState({
        fromdate: currentDate_ymd,
        todate: currentDate_ymd,
    })

    const [channelFromSelect, setChannelFromSelect] = useState(initail.initialSlected_zero);
    const [channelToSelect, setChannelToSelect] = useState(initail.initialSlected_blank);
    const [routeSelect, setRouteSelect] = useState(initail.initialSlected_blank);
    const [supplierSelect, setSupplierSelect] = useState(initail.initialSlected_zero);
    const [customerSelect, setCustomerSelect] = useState(initail.initialSlected_blank);
    const [unitDropdownSelect, setUnitDropdownSelect] = useState({ value: '', label: "select" });
    const [ItemNameSelect, setItemNameSelect] = useState(initail.initialSlected_blank);
    const [productSelect, setProductSelect] = useState(initail.initialSlected_zero);
    const [subProductSelect, setSubProductSelect] = useState(initail.initialSlected_zero);




    const [customerCheckbox, setCustomerCheckbox] = useState(false);
    const [routeCheckbox, setRouteCheckbox] = useState(false);
    const [channelToCheckbox, setChannelToCheckbox] = useState(false);
    const [productCheckbox, setProductCheckbox] = useState(true);
    const [subProductCheckbox, setSubProductCheckbox] = useState(false);
    const [itemNameCheckbox, setItemNameCheckbox] = useState(false);
    const [fromDateCheckbox, setFromDateCheckbox] = useState(false);
    const [channelFromCheckbox, setChannelFromCheckbox] = useState(false);
    const [supplierCheckbox, setSupplierCheckbox] = useState(false);
    const [showAlsoSelect, setShowAlsoSelect] = useState([]);


    const [tableData, setTableData] = useState([]);
    const [initaialBaseData, setInitaialBaseData] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState(initail.initialTableColumns);

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
        dispatch(Items_On_Group_And_Subgroup_API({ "Group": 0, "SubGroup": 0 }));
        dispatch(BreadcrumbShowCountlabel(`Count:0 ₹ 0`))
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(getPartyTypelistSuccess([]));
            dispatch(ItemSaleGoButton_API_Success([]));
        }
    }, [])

    useEffect(() => {
        if (ItemSaleReportGobtn.length > 0) {
            setInitaialBaseData(ItemSaleReportGobtn);
            dispatch(ItemSaleGoButton_API_Success([]));
            dataManpulationFunction(ItemSaleReportGobtn);

        }
    }, [ItemSaleReportGobtn]);


    const subProductDropdownOptions = useMemo(() => {
        let options = [];
        if (productSelect.value === 0) {
            options = subProductDropdown.map(i => ({
                value: i.id,
                label: i.Name,
            }));
        } else {
            options = getSubProductbyProduct.map(i => ({
                value: i.id,
                label: i.Name,
            }));
        }
        options.unshift(initail.initialSlected_zero);
        return options;
    }, [productSelect, subProductDropdown, getSubProductbyProduct]);

    const supplierDropdownOptions = useMemo(() => {
        let options = [];
        if (channelFromSelect.value === 0) {
            options = supplier.map(i => ({
                value: i.id,
                label: i.Name,
            }));
        } else {
            options = supplierListOnPartyType.map(i => ({
                value: i.id,
                label: i.Name,
            }));
        }
        options.unshift(initail.initialSlected_zero);
        return options;
    }, [channelFromSelect, supplier, supplierListOnPartyType]);


    const generateOptions = (sourceArray, labelField = "Name", valueField = "id") =>
        [initail.initialSlected_blank, ...sourceArray.map(item => ({ value: item[valueField], label: item[labelField] }))];

    const routeDropdownOptions = useMemo(() => generateOptions(RoutesList.filter(route => route.IsActive)), [RoutesList]);
    const channelDropdownOptions = useMemo(() => generateOptions(PartyTypes), [PartyTypes]);
    const itemNameDropdownOptions = useMemo(() => generateOptions(ItemNameList), [ItemNameList]);
    const productDropdownOptions = useMemo(() => generateOptions(productDropdown), [productDropdown]);
    const customerDropdownOptions = useMemo(() => generateOptions(customerDropdown), [customerDropdown]);




    function RouteOnChange(event) {
        dispatch(GetVenderSupplierCustomer({ subPageMode: url.ITEM_SALE_REPORT, RouteID: event.value, PartyID: supplierSelect.value }))
        setRouteSelect(event)
    }

    function ChannelFromDropdown_Onchange(e) {

        setChannelFromSelect(e)
        setSupplierSelect(initail.initialSlected_zero)
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
        setSubProductSelect(initail.initialSlected_zero)
        setItemNameSelect(initail.initialSlected_blank)
        dispatch(get_Sub_Group_By_Group_ForDropDown_Success([]))
    }

    function Sub_ProductOnChange(e) {
        setSubProductSelect(e)
        dispatch(Items_On_Group_And_Subgroup_API({ "Group": 0, "SubGroup": e.value }))
        setItemNameSelect(initail.initialSlected_blank)

    }

    function goButtonHandler() {
        try {
            const jsonBody = JSON.stringify({
                "FromDate": fromdate,
                "ToDate": todate,
                "PartyType": supplierSelect.value > 0 ? 0 : channelFromSelect.value,
                "Party": supplierSelect.value
            });
            dispatch(ItemSaleGoButton_API({ jsonBody, btnId: url.ITEM_SALE_REPORT }))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function showAlsoOnChange(event) {
        let isLastInvoice =
            event.length > 0
                ? [1, 5, 6, 7].includes(event[event.length - 1].value)
                : false;

        if (isLastInvoice) {
            if (event.some((item) => [2, 4].includes(item.value))) {
                event = event.filter((item) => ![2, 4].includes(item.value));
            }
            if (!event.some((item) => item.value === 1)) {
                event.push(initail.showAlsoOption[0]);
            }
        }

        if (event.some((item) => [2, 4].includes(item.value))) {
            if (event.some((item) => [1, 5, 6, 7].includes(item.value))) {
                event = event.filter((item) => ![1, 5, 6, 7].includes(item.value));
            }
            if (!event.some((item) => item.value === 4)) {
                event.push(initail.showAlsoOption[3]);
            }
        }
        setShowAlsoSelect(event);
    }
    function CustomerOnChange(e) {
        setCustomerSelect(e)
    }

    function change_ButtonHandler(e) {
        dispatch(ItemSaleGoButton_API_Success([]));
        setTableData([]);
        setInitaialBaseData([]);
        dispatch(BreadcrumbShowCountlabel(`Count:0 ₹ 0`))
    }

    const dataManpulationFunction = (baseData = []) => {

        const buttonStateArray = [
            {
                text: 'FromDate',
                dataField: 'InvoiceDate',
                checkboxState: fromDateCheckbox,
                selectValue: { value: "", label: "All" },
                sequence: 1,
                sort: true,
                groupBy: true,
                formatter: (cell) => <>{date_dmy_func(cell)}</>
            },
            {
                text: 'Channel From',
                dataField: 'SaleMadeFrom',
                checkboxState: channelFromCheckbox,
                selectValue: { value: "", label: "All" },
                sort: true,
                groupBy: true,
                sequence: 2
            },
            {
                text: 'Channel To',
                dataField: 'SaleMadeTo',
                checkboxState: channelToCheckbox,
                selectValue: channelToSelect,
                sort: true,
                groupBy: true,
                sequence: 3
            },

            {
                text: 'Supplier',
                dataField: 'SupplierName',
                checkboxState: supplierCheckbox,
                selectValue: { value: "", label: "All" },
                sort: true,
                groupBy: true,
                sequence: 4
            },
            {
                text: 'FullInvoiceNumber',
                dataField: 'FullInvoiceNumber',
                checkboxState: showAlsoSelect.some(item => item.value === 1) ? true : false,
                selectValue: showAlsoSelect,
                sort: true,
                groupBy: true,
                sequence: 5
            },
            {
                text: 'Route',
                dataField: 'RouteName',
                checkboxState: routeCheckbox,
                selectValue: routeSelect,
                sort: true,
                groupBy: true,
                sequence: 6
            },
            {
                text: 'Customer',
                dataField: 'CustomerName',
                checkboxState: customerCheckbox,
                selectValue: customerSelect,
                sort: true,
                groupBy: true,
                sequence: 7
            },
            {
                text: 'Product',
                dataField: 'GroupName',
                checkboxState: productCheckbox,
                selectValue: productSelect,
                sort: true,
                groupBy: true,
                sequence: 8
            },
            {
                text: 'Sub Product',
                dataField: 'SubGroupName',
                checkboxState: subProductCheckbox,
                selectValue: subProductSelect,
                sort: true,
                groupBy: true,
                sequence: 9
            },
            {
                text: 'ItemName',
                dataField: 'ItemName',
                checkboxState: itemNameCheckbox,
                selectValue: ItemNameSelect,
                sort: true,
                groupBy: true,
                sequence: 10
            },

            {
                text: 'QtyInNo',
                dataField: 'QtyInNo',
                checkboxState: unitDropdownSelect.value === 1 ? true : false,
                sort: true,
                isSum: true,
                toFixed: 0,
                sequence: 11
            },
            {
                text: 'QtyInKg',
                dataField: 'QtyInKg',
                checkboxState: unitDropdownSelect.value === 2 ? true : false,
                sort: true,
                isSum: true,
                toFixed: 3,
                sequence: 12
            },
            {
                text: 'QtyInBox',
                dataField: 'QtyInBox',
                checkboxState: unitDropdownSelect.value === 3 ? true : false,
                sort: true,
                isSum: true,
                toFixed: 3,
                sequence: 13
            },
            {
                text: 'InvoiceGrandTotal',
                dataField: 'GrandTotal',
                checkboxState: showAlsoSelect.some(item => item.value === 5),
                sort: true,
                toFixed: 2,
                sequence: 15
            },
            {
                text: 'DiscountInRS',
                dataField: 'DiscountAmount',
                checkboxState: showAlsoSelect.some(item => item.value === 4),
                sort: true,
                isSum: true,
                toFixed: 2,
                sequence: 16
            },
            {
                text: 'RoundOffAmount',
                dataField: 'RoundOffAmount',
                checkboxState: showAlsoSelect.some(item => item.value === 6),
                isSum: true,
                sort: true,
                toFixed: 2,
                sequence: 17,
            },
            {
                text: 'TCSAmount',
                dataField: 'TCSAmount',
                checkboxState: showAlsoSelect.some(item => item.value === 7),
                isSum: true,
                sort: true,
                sequence: 18,
                toFixed: 2
            },
            {
                text: 'GRNID',
                dataField: 'FullGRNNumber',
                checkboxState: showAlsoSelect.some(item => item.value === 3),
                sort: true,
                groupBy: true,
                sequence: 19
            },
            { //this filed not Show intable 
                text: "Show Discounted Items",
                dataField: "ShowDiscountedItems",
                selectValue: showAlsoSelect.find(item => item.value === 2),
            },
            {
                text: "Amount",
                dataField: "Amount",
                checkboxState: true,
                sort: true,
                isSum: true,
                toFixed: 2,
                sequence: 14,
            }

        ];

        //************************************************************************************************** */

        let manupulatedData = [...baseData];

        let tableColumns = [];


        const filterParameter = buttonStateArray.filter(option => (option.selectValue?.value > 0));

        if (filterParameter.length > 0) {
            manupulatedData = baseData.filter(item => {
                return filterParameter.every(option => {
                    if ((option.dataField === 'ShowDiscountedItems') && (option.selectValue?.value > 0)) {
                        return (Number(item.DiscountAmount) > 0) ? true : false
                    }
                    return item[option.dataField] === option.selectValue.label;

                });
            });
        }


        if (buttonStateArray.some(option => option.checkboxState)) {

            //*********************************************************** *******************************/
            tableColumns = buttonStateArray.filter(option => option.checkboxState);

            tableColumns.sort((a, b) => a.sequence - b.sequence);
            setSelectedColumns(tableColumns);
            // **********************************************************************************************
            const groupedData = {};

            manupulatedData.forEach(item => {
                const groupValues = buttonStateArray
                    .filter(option => option.checkboxState && (option.groupBy === true))
                    .map(option => item[option.dataField]);

                const groupKey = groupValues.join('-');
                if (!groupedData[groupKey]) {
                    groupedData[groupKey] = {
                        ...item,
                        Amount: 0,
                        QtyInNo: 0,
                        QtyInKg: 0,
                        QtyInBox: 0,
                        DiscountAmount: 0,
                        RoundOffAmount: 0,
                        TCSAmount: 0
                    };
                }

                buttonStateArray.forEach(field => {
                    if (field.isSum === true) {
                        groupedData[groupKey][field.dataField] += parseFloat(item[field.dataField]);
                        groupedData[groupKey][field.dataField] = parseFloat((groupedData[groupKey][field.dataField]).toFixed(field.toFixed));
                    }
                })

            });
            manupulatedData = Object.values(groupedData);
        }
        else {
            setSelectedColumns(initail.defaultTableColumns);
        }
        let totalAmount = 0
        manupulatedData = manupulatedData.map((item, key) => {
            totalAmount += parseFloat(item.Amount);
            item.id = key + 1
            return item
        });
        setTableData(manupulatedData);
        let commaSeparateAmount = _cfunc.amountCommaSeparateFunc(Number(totalAmount).toFixed(2));

        dispatch(BreadcrumbShowCountlabel(`Count:${manupulatedData.length} ₹ ${commaSeparateAmount}`));
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
                                            id="fromdate"
                                            type="checkbox"
                                            checked={fromDateCheckbox}
                                            onClick={(e) => {
                                                setFromDateCheckbox(e.target.checked)
                                            }}

                                        />
                                        <Label className="col-sm-3 p-2">FromDate</Label>
                                        <Col sm={6}>
                                            <C_DatePicker
                                                name="FromDate"
                                                value={fromdate}
                                                disabled={(tableData.length > 0) && true}
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
                                                disabled={(tableData.length > 0) && true}
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
                                            id="channelFrom"
                                            checked={channelFromCheckbox}
                                            onChange={(e) => { setChannelFromCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-4 p-2">Channel From</Label>
                                        <Col>
                                            <C_Select
                                                value={channelFromSelect}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                isDisabled={(tableData.length > 0) && true}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={channelDropdownOptions}
                                                onChange={ChannelFromDropdown_Onchange}

                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3}>
                                    <FormGroup className="mb-n3 row mt-1">
                                        <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                            className="p-1"
                                            type="checkbox"
                                            id="supplier"
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
                                                isDisabled={(tableData.length > 0) && true}
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
                            {!(initaialBaseData.length > 0) ?
                                <Go_Button
                                    loading={goBtnLoading}
                                    onClick={goButtonHandler}
                                /> :
                                <Change_Button onClick={change_ButtonHandler} />}
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
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={channelDropdownOptions}
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
                                                options={routeDropdownOptions}
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
                                                options={customerDropdownOptions}
                                                onChange={(e) => { CustomerOnChange(e) }}

                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3}>
                                    <FormGroup className=" row mt-1">
                                        <Label className="col-sm-4 p-2">Show Also</Label>

                                        <Col>
                                            <C_Select
                                                value={showAlsoSelect}
                                                isSearchable={true}
                                                isMulti={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={initail.showAlsoOption}
                                                onChange={showAlsoOnChange}

                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm="1" className="mt-1 mb-1 ">
                            {(initaialBaseData.length > 0) &&
                                <C_Button
                                    type="button"
                                    className="btn btn-success border-1 font-size-12 text-center"
                                    onClick={() => { dataManpulationFunction(initaialBaseData) }} // Example field, you can change it
                                >
                                    <span className="font-weight-bold" style={{ fontWeight: "bold", fontSize: "14px" }}> Sort</span>
                                </C_Button>
                            }
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
                                        options={productDropdownOptions}
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
                                        options={subProductDropdownOptions}
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
                                        options={itemNameDropdownOptions}
                                        onChange={(e) => { setItemNameSelect(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3}>
                            <FormGroup className=" row mt-2">
                                <Label className="col-sm-4 p-2">Quantity</Label>
                                <Col>
                                    <C_Select
                                        value={unitDropdownSelect}
                                        isSearchable={true}
                                        //  isLoading={partyLoading}       
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={initail.UnitDropdownOptions}
                                        onChange={(e) => { setUnitDropdownSelect(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                </div>

                <ShowTableComponent
                    data={tableData}
                    columns={selectedColumns} />
            </div>

        </React.Fragment >
    )
}

export default ItemSaleReport;
