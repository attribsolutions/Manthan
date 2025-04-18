import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, GetVenderSupplierCustomer } from "../../store/actions";

import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import GlobalCustomTable from "../../GlobalCustomTable";
import { allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";

import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import { getCommonPartyDrodownOptionAction } from "../../store/Utilites/PartyDrodown/action";
import { ItemSaleGoButton_API, ItemSaleGoButton_API_Success } from "../../store/Report/ItemSaleReport/action";

const DailyDispatchReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isFrenchieses = _cfunc.loginUserIsFranchisesRole();


    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');
    const [tableData, setTableData] = useState([]);
    const [SupplierDropdown, setSupplierDropdown] = useState(allLabelWithZero);

    const [Mode, setMode] = useState("");



    const {

        pageField,
        userAccess,
        listBtnLoading,
        partyDropdownLoadings,
        supplierListOnPartyType,
        ItemSaleReportGobtn,
        goBtnLoading
    } = useSelector((state) => ({

        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
        Distributor: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        userAccess: state.Login.RoleAccessUpdateData,
        ItemSaleReportGobtn: state.ItemSaleReportReducer.ItemSaleReportGobtn,
        goBtnLoading: state.ItemSaleReportReducer.goBtnLoading,



        supplierListOnPartyType: state.CommonAPI_Reducer.vendorSupplierCustomer,
        pageField: state.CommonPageFieldReducer.pageField
    })
    );

    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.DAILY_DISPATCH_REPORT));
        dispatch(getCommonPartyDrodownOptionAction())

        dispatch(BreadcrumbShowCountlabel(`Count:${0} currency_symbol ${0.00}`));
        dispatch(
            GetVenderSupplierCustomer({
                subPageMode: url.ITEM_SALE_REPORT,
                PartyID: _cfunc.loginSelectedPartyID(),
                RouteID: "",
            }));

        return () => {
            dispatch(ItemSaleGoButton_API_Success([]));
            setTableData([]);

        }
    }, []);

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



    // const [tableColumns] = DynamicColumnHook({ pageField, })



    function addTotalField(obj) {

        const total = Object.keys(obj)
            .filter((key) => typeof obj[key] === "number") // Only include numeric fields
            .reduce((sum, key) => sum + obj[key], 0); // Calculate the sum of numeric values

        return { ...obj, Total: total }; // Add the total field
    }



    // Step 2: Pivot the data and aggregate dynamically based on qtyType
    const supplierNames = [...new Set(ItemSaleReportGobtn.map((item) => item.Cust_ShortName))];

    useEffect(() => {

        const skuNames = [...new Set(ItemSaleReportGobtn.map((item) => item.ItemName))];

        const tableData = skuNames.map((sku) => {
            const row = { SKUName: sku };

            supplierNames.forEach((Cust_ShortName) => {
                const totalQty = ItemSaleReportGobtn
                    .filter((item) => {

                        return item.ItemName === sku && item.Cust_ShortName === Cust_ShortName
                    })
                    .reduce((sum, item) => {

                        const qty = _cfunc.getFixedNumber(item.BaseItemUnitQuantity, 3);
                        return sum + (isNaN(qty) ? 0 : qty);
                    }, 0);

                row[Cust_ShortName] = totalQty > 0 ? _cfunc.getFixedNumber(totalQty, 3) : 0;
            });

            return addTotalField(row);
        });


        setTableData(tableData)

    }, [ItemSaleReportGobtn])




    const tableColumns = [
        { dataField: "SKUName", text: "SKU Name", sort: true },
        {
            dataField: 'Total',
            text: 'Total',
            sort: true, // Optional: Enable sorting
            formatter: (cell) => <strong>{cell}</strong>, // Render the text in bold
        },
        ...supplierNames.map((Cust_ShortName) => ({
            dataField: Cust_ShortName,
            text: Cust_ShortName,
            align: () => "right",
            sort: true,
        })), {

            dataField: 'Unit',
            text: 'Unit',
            sort: true, // Optional: Enable sorting
            formatter: () => <strong>{`Kg`}</strong>, // Render the text in bold   
        }
    ];

    useEffect(() => {

        try {
            if (Mode) {
                if (Mode === "Show") {
                    setTableData(tableData);

                } else if (Mode === "Excel") {
                    ExcelReportComponent({      // Download CSV
                        pageField,
                        excelTableData: tableData,
                        excelFileName: "Daily dispatch report",
                    })
                }
            }

        }
        catch (e) { }

    }, [tableData]);

    const supplierDropdownOptions = useMemo(() => {
        let options = [];

        options = supplierListOnPartyType.map((i) => ({
            value: i.id,
            label: i.Name,
        }));
        options.unshift(allLabelWithZero);
        return options;
    }, [supplierListOnPartyType]);




    function excel_And_GoBtnHandler(e, mode) {

        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            PartyType: SupplierDropdown.value,
            Party: _cfunc.loginSelectedPartyID(),
            Employee: _cfunc.loginEmployeeID(),
            CompanyID: _cfunc.loginCompanyID(),
            ItemID: "0"

        })

        setMode(mode)
        // let config = { jsonBody, Mode: mode }
        dispatch(ItemSaleGoButton_API({ jsonBody, btnId: url.ITEM_SALE_REPORT }));

    }



    function fromdateOnchange(e, date) {

        let newObj = { ...headerFilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
        setTableData([]);
    }

    function todateOnchange(e, date) {

        let newObj = { ...headerFilters }
        newObj.todate = date
        setHeaderFilters(newObj);
        setTableData([]);
    }
    function SupplierDrodownOnChange(e) {
        setSupplierDropdown(e);
        setTableData([]);
    }




    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2  " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={fromdate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={todate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {< Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Supplier</Label>
                                <Col sm="8">
                                    <C_Select
                                        name="Party"
                                        value={SupplierDropdown}
                                        isSearchable={true}
                                        isLoading={partyDropdownLoadings}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={supplierDropdownOptions}
                                        onChange={SupplierDrodownOnChange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>}


                        <Col sm={isFrenchieses ? 6 : 3} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={goBtnLoading && Mode === "Show"}
                                className="btn btn-success m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler(e, "Show")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={goBtnLoading && Mode === "Excel"}
                                className="btn btn-primary m-3 mr "
                                onClick={(e) => excel_And_GoBtnHandler(e, "Excel")}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>
                <div className="mb-1 ">
                    <GlobalCustomTable
                        keyField={"id"}
                        data={tableData}
                        columns={tableColumns}
                        id="table_Arrow"
                        noDataIndication={
                            <div className="text-danger text-center ">
                                Items Not available
                            </div>
                        }
                        onDataSizeChange={({ dataCount, filteredData = [] }) => {
                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} currency_symbol ${_cfunc.TotalAmount_Func(filteredData)}`));
                        }}
                    />
                </div>


            </div>

        </React.Fragment >
    )
}

export default DailyDispatchReport;