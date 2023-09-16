import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button, Change_Button, Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess, commonPageField, commonPageFieldSuccess, getBaseUnit_ForDropDown, getGroupList, getItemList, getSubGroupList, getSubGroupListSuccess, get_Group_By_GroupType_ForDropDown, get_Sub_Group_By_Group_ForDropDown, get_Sub_Group_By_Group_ForDropDown_Success } from "../../store/actions";
import { GetRoutesList, GetRoutesListSuccess } from "../../store/Administrator/RoutesRedux/actions";
import { getPartyTypelist, getPartyTypelistSuccess } from "../../store/Administrator/PartyTypeRedux/action";
import { ItemSaleGoButton_API, ItemSaleGoButton_API_Success, Items_On_Group_And_Subgroup_API, Items_On_Group_And_Subgroup_API_Success, SupplierOnPartyType_API, SupplierOnPartyType_API_Success } from "../../store/Report/ItemSaleReport/action";
import "../ItemSaleReport/ItemSaleCSS.scss";
import { useMemo } from "react";
import * as initail from "./hardcodeDetails";
import { ItemSaleContext } from "./ContextDataProvider";
import { ExcelButtonFunc } from "./SortAndExcelDownloadFunc";

const HeaderSection = (props) => {

    const states = ItemSaleContext()

    const dispatch = useDispatch();
    const history = useHistory();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const { goBtnLoading,
        ItemSaleReportGobtn,
        userAccess,
        supplierLoading,
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

                supplierLoading: (state.CommonAPI_Reducer.SSDD_ListLoading
                    || state.ItemSaleReportReducer.supplierListLoading),

                supplier: state.CommonPartyDropdownReducer.commonPartyDropdown,
                // supplierListLoading:state.ItemSaleReportReducer.supplierListLoading ,
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
            })
        );

    const { fromdate, todate, } = states.hederFilters;

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
            states.setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.ITEM_SALE_REPORT));
        dispatch(GetRoutesList());
        dispatch(getPartyTypelist());
        dispatch(GetVenderSupplierCustomer({ subPageMode: url.ITEM_SALE_REPORT, RouteID: 0 }));
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
            states.setInitaialBaseData(ItemSaleReportGobtn);
            dispatch(ItemSaleGoButton_API_Success([]));
            dataManpulationFunction(ItemSaleReportGobtn);

        }
    }, [ItemSaleReportGobtn]);

    const subProductDropdownOptions = useMemo(() => {

        let options = [];
        if (states.productSelect[0].value === 0) {
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
        return options;
    }, [states.productSelect, subProductDropdown, getSubProductbyProduct]);

    const supplierDropdownOptions = useMemo(() => {
        let options = [];
        if (states.channelFromSelect.value === 0) {
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
        options.unshift(initail.INITIAL_ZERO);
        return options;
    }, [states.channelFromSelect, supplier, supplierListOnPartyType]);

    const generateOptions = (sourceArray, labelField = "Name", valueField = "id") =>
        [initail.INITIAL_ZERO, ...sourceArray.map(item => ({ value: item[valueField], label: item[labelField] }))];

    const channelFromDropdownOptions = useMemo(() => generateOptions(PartyTypes), [PartyTypes]);

    const generateOptions1 = (sourceArray, labelField = "Name", valueField = "id") =>
        [...sourceArray.map(item => ({ value: item[valueField], label: item[labelField] }))];

    const channelToDropdownOptions = useMemo(() => generateOptions1(PartyTypes), [PartyTypes]);
    const routeDropdownOptions = useMemo(() => generateOptions1(RoutesList.filter(route => route.IsActive)), [RoutesList]);
    const itemNameDropdownOptions = useMemo(() => generateOptions1(ItemNameList), [ItemNameList]);
    const productDropdownOptions = useMemo(() => generateOptions1(productDropdown), [productDropdown]);
    const customerDropdownOptions = useMemo(() => generateOptions1(customerDropdown), [customerDropdown]);

    function fromdateOnchange(e, date) {
        let newObj = { ...states.hederFilters }
        newObj.fromdate = date
        states.setHederFilters(newObj);
        states.setTableData([]);
        states.setInitaialBaseData([]);
    }

    function todateOnchange(e, date) {
        let newObj = { ...states.hederFilters }
        newObj.todate = date
        states.setHederFilters(newObj);
        states.setTableData([]);
        states.setInitaialBaseData([]);
    }

    function ChannelFromDropdown_Onchange(e) {

        states.setChannelFromSelect(e)
        states.setSupplierSelect(initail.INITIAL_ZERO)
        dispatch(SupplierOnPartyType_API({ employeeID: _cfunc.loginEmployeeID(), channelFromID: e.value }))
    }

    function SupplierOnChange(event) {

        states.setSupplierSelect(event)
        states.setRouteSelect([{ value: 0, label: "All" }])
        states.setCustomerSelect([{ value: 0, label: "All" }])
        states.setTableData([]);
        states.setInitaialBaseData([]);
        dispatch(GetVenderSupplierCustomerSuccess([]))
        dispatch(GetRoutesListSuccess([]))
        if (event.value > 0) {
            dispatch(GetVenderSupplierCustomer({ subPageMode: url.ITEM_SALE_REPORT, PartyID: event.value, RouteID: '' }))
            const jsonBody = JSON.stringify({
                CompanyID: _cfunc.loginCompanyID(),
                PartyID: event.value,
            });
            dispatch(GetRoutesList(jsonBody));
        }
    }

    function ChannelToOnchange(e = []) {

        if (e.length === 0) {
            e = [{ value: 0, label: "All" }]
        } else {
            e = e.filter(i => (i.value > 0))
        }
        states.setChannelToSelect(e)
    }

    function RouteOnChange(e = []) {

        states.setCustomerSelect([{ value: 0, label: "All" }])
        dispatch(GetVenderSupplierCustomerSuccess([]))

        if (e.length === 0) {
            e = [{ value: 0, label: "All" }]
            dispatch(GetVenderSupplierCustomer({ subPageMode: url.ITEM_SALE_REPORT, RouteID: "", PartyID: states.supplierSelect.value }))
        }
        else {

            e = e.filter(i => (i.value > 0));
            if (e.length === 1) {
                dispatch(GetVenderSupplierCustomer({ subPageMode: url.ITEM_SALE_REPORT, RouteID: e[0].value, PartyID: states.supplierSelect.value }))
            } else {
                states.setCustomerSelect(initail.INITIAL_ARRAY)
                dispatch(GetVenderSupplierCustomerSuccess([]))
            }
        }
        states.setRouteSelect(e)
    }

    function CustomerOnChange(e = []) {

        if (e.length === 0) {
            e = [{ value: 0, label: "All" }]
        } else {
            e = e.filter(i => (i.value > 0))
        }
        states.setCustomerSelect(e)
    }

    function ProductOnchange(e = []) {

        dispatch(getSubGroupListSuccess([]));
        dispatch(get_Sub_Group_By_Group_ForDropDown_Success([]));
        dispatch(Items_On_Group_And_Subgroup_API_Success([]));
        states.setSubProductSelect(initail.INITIAL_ARRAY)
        states.setItemNameSelect(initail.INITIAL_ARRAY)

        if (e.length === 0) {
            e = [{ value: 0, label: "All" }]
            dispatch(getGroupList());
            dispatch(getSubGroupList());
            dispatch(Items_On_Group_And_Subgroup_API({ "Group": 0, "SubGroup": 0 }));
        } else {
            e = e.filter(i => (i.value > 0))
            if (e.length === 1) {
                dispatch(get_Sub_Group_By_Group_ForDropDown(e[0].value))
                dispatch(Items_On_Group_And_Subgroup_API({ "Group": e[0].value, "SubGroup": 0 }));

            } else {
                dispatch(get_Sub_Group_By_Group_ForDropDown_Success([]))
                dispatch(Items_On_Group_And_Subgroup_API_Success([]))
                states.setSubProductSelect(initail.INITIAL_ARRAY)
                states.setItemNameSelect(initail.INITIAL_ARRAY)
            }
        }
        states.setProductSelect(e)
    }

    function Sub_ProductOnChange(e = []) {

        dispatch(Items_On_Group_And_Subgroup_API_Success([]));
        states.setItemNameSelect(initail.INITIAL_ARRAY)

        if (e.length === 0) {
            e = [{ value: 0, label: "All" }]
            dispatch(Items_On_Group_And_Subgroup_API({ "Group": 0, "SubGroup": 0 }));
            states.setItemNameSelect(initail.INITIAL_ARRAY)
        } else {
            e = e.filter(i => (i.value > 0))
            if (e.length === 1) {
                dispatch(Items_On_Group_And_Subgroup_API({ "Group": 0, "SubGroup": e[0].value }))

            } else {
                dispatch(Items_On_Group_And_Subgroup_API_Success([]))
                states.setItemNameSelect(initail.INITIAL_ARRAY)
            }
        }

        states.setSubProductSelect(e)
    }

    function ItemOnChange(e = []) {
        if (e.length === 0) {
            e = [{ value: 0, label: "All" }]
        } else {
            e = e.filter(i => (i.value > 0))
        }
        states.setItemNameSelect(e)
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
                event.push(initail.SHOW_ALSO_OPTIONS[0]);
            }
        }

        if (event.some((item) => [2, 4].includes(item.value))) {
            if (event.some((item) => [1, 5, 6, 7].includes(item.value))) {
                event = event.filter((item) => ![1, 5, 6, 7].includes(item.value));
            }
            if (!event.some((item) => item.value === 4)) {
                event.push(initail.SHOW_ALSO_OPTIONS[3]);
            }
        }
        states.setShowAlsoSelect(event);
    }

    function goButtonHandler() {
        try {
            const jsonBody = JSON.stringify({
                "FromDate": fromdate,
                "ToDate": todate,
                "PartyType": states.supplierSelect.value > 0 ? 0 : states.channelFromSelect.value,
                "Party": !(isSCMParty) ? _cfunc.loginPartyID() : states.supplierSelect.value
            });
            dispatch(ItemSaleGoButton_API({ jsonBody, btnId: url.ITEM_SALE_REPORT }))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function change_ButtonHandler(e) {
        dispatch(ItemSaleGoButton_API_Success([]));
        states.setTableData([]);
        states.setInitaialBaseData([]);
        dispatch(BreadcrumbShowCountlabel(`Count:0 ₹ 0`))
    }

    const dataManpulationFunction = async (baseData) => {
        const { selectedColumns = [{}], manupulatedData = [], totalAmount } = await states.sortManipulationFunc(baseData);
        states.setSelectedColumns(selectedColumns);
        states.setTableData(manupulatedData);
        let commaSeparateAmount = _cfunc.amountCommaSeparateFunc(Number(totalAmount).toFixed(2));
        dispatch(BreadcrumbShowCountlabel(`Count:${manupulatedData.length} ₹ ${commaSeparateAmount}`));
        return { selectedColumns, manupulatedData, totalAmount };
    }

    async function ExcelDownload() {
        const { selectedColumns, manupulatedData } = await dataManpulationFunction(states.initaialBaseData);
        ExcelButtonFunc({ selectedColumns, manupulatedData })
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(states.userPageAccessState)}</MetaTags>

            <div className="page-content">
                <div className="item-Sale-card_1 px-2 text-black mt-n1 ">
                    <Row>
                        <Col className="col col-11 mb-n1 mt-1">
                            <Row>
                                <Col sm={3}>
                                    <FormGroup className="mb-n3 row mt-1">
                                        <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                            className="p-1"
                                            id="fromdate"
                                            type="checkbox"
                                            checked={states.fromDateCheckbox}
                                            onClick={(e) => {
                                                states.setFromDateCheckbox(e.target.checked)
                                            }}
                                        />
                                        <Label className="col-sm-3 p-2">FromDate</Label>
                                        <Col sm={6}>
                                            <C_DatePicker
                                                name="FromDate"
                                                value={fromdate}
                                                disabled={(states.tableData.length > 0) && true}
                                                onChange={fromdateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3} className="custom-to-date-col">
                                    <FormGroup className="mb-n3 row mt-1">
                                        <div style={{ marginLeft: "1px", marginTop: "10px", width: "5px", }}></div>
                                        <Label className="col-sm-4 p-2">ToDate</Label>
                                        <Col>
                                            <C_DatePicker
                                                name="ToDate"
                                                value={todate}
                                                disabled={(states.tableData.length > 0) && true}
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
                                            checked={states.channelFromCheckbox}
                                            onChange={(e) => { states.setChannelFromCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-4 p-2">Channel From</Label>
                                        <Col>
                                            <C_Select
                                                value={states.channelFromSelect}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                isDisabled={(states.tableData.length > 0 || !(isSCMParty)) && true}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={channelFromDropdownOptions}
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
                                            checked={states.supplierCheckbox}
                                            onChange={(e) => { states.setSupplierCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-4 p-2">Supplier</Label>
                                        <Col>
                                            <C_Select

                                                value={!(isSCMParty) ? { label: _cfunc.loginPartyName() } : states.supplierSelect}
                                                isSearchable={true}
                                                isLoading={supplierLoading}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                isDisabled={(states.tableData.length > 0 || !(isSCMParty)) && true}
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

                        <Col sm="1" className="mt-2 mb-1 ">
                            {!(states.initaialBaseData.length > 0) ?
                                <Go_Button
                                    loading={goBtnLoading}
                                    onClick={goButtonHandler}
                                /> :
                                <Change_Button onClick={change_ButtonHandler} />}
                        </Col>
                    </Row>
                </div>

                <div className="item-Sale-card_3 px-2 text-black mt-1 mb-1">
                    <Row className="mb-1">
                        <Col className="col col-11">
                            <Row>
                                <Col sm={3}>
                                    <FormGroup className=" row mt-1 mb-n3">
                                        <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                            className="p-1"
                                            type="checkbox"
                                            checked={states.channelToCheckbox}
                                            onChange={(e) => { states.setChannelToCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-3 p-2">Channel to</Label>
                                        <Col sm={6}>
                                            <C_Select
                                                value={states.channelToSelect}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                isMulti={true}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={channelToDropdownOptions}

                                                onChange={(e) => { ChannelToOnchange(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3}>
                                    <FormGroup className=" row mt-1">
                                        <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                            className="p-1"
                                            type="checkbox"
                                            checked={states.routeCheckbox}
                                            onChange={(e) => { states.setRouteCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-4 p-2">Route</Label>
                                        <Col>
                                            <C_Select
                                                classNamePrefix="react-select"
                                                value={states.routeSelect}
                                                options={routeDropdownOptions}
                                                // onChange={(e) => { states.setRouteSelect(e) }}
                                                onChange={(e) => { RouteOnChange(e) }}
                                                isMulti={true}
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
                                            checked={states.customerCheckbox}
                                            onChange={(e) => { states.setCustomerCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-4 p-2">Customer</Label>

                                        <Col>
                                            <C_Select
                                                value={states.customerSelect}
                                                isSearchable={true}
                                                isLoading={customerDropLoading}
                                                isMulti={true}
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
                                        <div style={{ marginLeft: "1px", marginTop: "10px", width: "5px", }}></div>
                                        <Label className="col-sm-4 p-2">Show Also</Label>

                                        <Col>
                                            <C_Select
                                                value={states.showAlsoSelect}
                                                isSearchable={true}
                                                isMulti={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={initail.SHOW_ALSO_OPTIONS}
                                                onChange={showAlsoOnChange}

                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>

                        <Col sm="1" className="mt-1 mb-1 ">
                            {(states.initaialBaseData.length > 0) &&
                                <C_Button
                                    type="button"
                                    className="btn btn-success border-1 font-size-12 text-center"
                                    onClick={() => { dataManpulationFunction(states.initaialBaseData) }} // Example field, you can change it
                                >
                                    <span className="font-weight-bold" style={{ fontWeight: "bold", fontSize: "14px" }}> Sort</span>
                                </C_Button>
                            }
                        </Col>
                    </Row>

                    <Row>
                        <Col className="col col-11">
                            <Row>
                                <Col sm={3}>
                                    <FormGroup className=" row mt-2">
                                        <Input style={{ marginLeft: "5px", marginTop: "10px" }}
                                            className="p-1"
                                            type="checkbox"
                                            checked={states.productCheckbox}
                                            onChange={(e) => { states.setProductCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-3 p-2">Product</Label>
                                        <Col sm={6}>
                                            <C_Select
                                                value={states.productSelect}
                                                isSearchable={true}
                                                isLoading={productLoading}
                                                isMulti={true}
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
                                            checked={states.subProductCheckbox}
                                            onChange={(e) => { states.setSubProductCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-4 p-2">Sub Product</Label>
                                        <Col>
                                            <C_Select
                                                value={states.subProductSelect}
                                                isSearchable={true}
                                                isMulti={true}
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
                                            checked={states.itemNameCheckbox}
                                            onChange={(e) => { states.setItemNameCheckbox(e.target.checked) }}
                                        />
                                        <Label className="col-sm-4 p-2">Items</Label>
                                        <Col>
                                            <C_Select
                                                value={states.itemNameSelect}
                                                isSearchable={true}
                                                isMulti={true}
                                                isLoading={ItemDropdownloading}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={itemNameDropdownOptions}
                                                onChange={(e) => { ItemOnChange(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3}>
                                    <FormGroup className=" row mt-2">
                                        <div style={{ marginLeft: "1px", marginTop: "10px", width: "5px", }}></div>
                                        <Label className="col-sm-4 p-2">Quantity</Label>
                                        <Col>
                                            <C_Select
                                                value={states.unitDropdownSelect}
                                                isSearchable={true}
                                                // isMulti={true}
                                                //  isLoading={partyLoading}       
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={initail.UNIT_DROPDOWN_OPTIONS}
                                                onChange={(e) => { states.setUnitDropdownSelect(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>

                        <Col sm="1" className="mt-1 mb-1 ">
                            {(states.initaialBaseData.length > 0) &&
                                <C_Button
                                    type="button"
                                    className="btn btn-primary border-1 font-size-12 text-center"
                                    onClick={ExcelDownload} // Example field, you can change it
                                >
                                    <span className="font-weight-bold" style={{ fontWeight: "bold", fontSize: "14px" }}> Excel</span>
                                </C_Button>
                            }
                        </Col>
                    </Row>
                </div>
            </div>

        </React.Fragment >
    )
}

export default HeaderSection;
