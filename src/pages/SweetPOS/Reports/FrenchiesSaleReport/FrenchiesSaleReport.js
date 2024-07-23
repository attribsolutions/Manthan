import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../../../CustomValidateForm";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../../store/actions";
import DynamicColumnHook from "../../../../components/Common/TableCommonFunc";
import { Return_Report_Action, Return_Report_Action_Success } from "../../../../store/Report/ReturnReportRedux/action";
import { ExcelReportComponent } from "../../../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import GlobalCustomTable from "../../../../GlobalCustomTable";
import { changeCommonPartyDropDetailsAction, getCommonPartyDrodownOptionAction } from "../../../../store/Utilites/PartyDrodown/action";
import { allLabelWithBlank, allLabelWithZero } from "../../../../components/Common/CommonErrorMsg/HarderCodeData";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../../../components/Common/SearchBox/MySearch";
import { Get_Items_Drop_Down } from "../../../../store/Inventory/StockEntryRedux/action";
import { Frenchies_Item_sale_Report_Action, Frenchies_Item_sale_Report_Action_Success } from "../../../../store/SweetPOSStore/Report/FrenchiesSaleRedux/action";

const FrenchiesSaleReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');
    const [PartyDropdown, setPartyDropdown] = useState([allLabelWithZero]);
    const [tableData, setTableData] = useState([]);
    const [btnMode, setBtnMode] = useState(0);

    const [Item, setItem] = useState(allLabelWithZero);


    const {
        goButtonData,
        pageField,
        userAccess,
        Party,
        ItemDropDown,
        partyDropdownLoading,
        ItemDropDownloading,
        listBtnLoading,
    } = useSelector((state) => ({
        goButtonData: state.FrenchiesItemSaleReportReducer.FrenchiesesItemSaleData,
        listBtnLoading: state.FrenchiesItemSaleReportReducer.listBtnLoading,
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
        ItemDropDown: state.StockEntryReducer.ItemDropDown,
        Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        ItemDropDownloading: state.StockEntryReducer.ItemDropDownloading,
        commonPartyDropdownOption: state.CommonPartyDropdownReducer,
    })
    );

    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.FRENCHIESE_SALE_REPORT))
        dispatch(BreadcrumbShowCountlabel(`Count:${0} ₹ ${0.00}`));
        dispatch(changeCommonPartyDropDetailsAction({ isShow: false }))//change party drop-down show false
        dispatch(getCommonPartyDrodownOptionAction())
        dispatch(Get_Items_Drop_Down({
            jsonBody: JSON.stringify({
                UserID: _cfunc.loginUserID(),
                RoleID: _cfunc.loginRoleID(),
                CompanyID: _cfunc.loginCompanyID(),
                IsSCMCompany: _cfunc.loginIsSCMCompany(),
                CompanyGroup: _cfunc.loginCompanyGroup(),
                PartyID: _cfunc.loginSelectedPartyID(),
            })
        }));
        if (_cfunc.CommonPartyDropValue().value > 0) {
            setPartyDropdown(_cfunc.CommonPartyDropValue());
        }
        return () => {
            dispatch(Frenchies_Item_sale_Report_Action_Success([]));
            setTableData([]);
            dispatch(changeCommonPartyDropDetailsAction({ isShow: true }))//change party drop-down restore show state
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

    useEffect(() => {
        if (tableData.length === 0) {
            setBtnMode(0)
        }
    }, [tableData]);

    const Party_Option = Party.map(i => ({
        value: i.id,
        label: i.Name,
        PartyType: i.PartyType
    })).filter(index => index.PartyType === "Franchises");;

    Party_Option.unshift(allLabelWithZero);

    const ItemList_Options = ItemDropDown.map((index) => ({
        value: index.Item,
        label: index.ItemName,
    }));
    ItemList_Options.unshift(allLabelWithZero);
    const [tableColumns] = DynamicColumnHook({ pageField, })

    useEffect(() => {

        try {
            if ((goButtonData.Status === true) && (goButtonData.StatusCode === 200)) {
                setBtnMode(0);
                if (btnMode === 2) {
                    ExcelReportComponent({      // Download CSV
                        pageField,
                        excelTableData: goButtonData.Data,
                        excelFileName: "Frenchies Item Sale Report"
                    })
                    dispatch(Frenchies_Item_sale_Report_Action_Success([]));
                    setPartyDropdown([allLabelWithBlank])
                }
                else {
                    const UpdatedTableData = goButtonData.Data.map((item, index) => {
                        return {
                            ...item, id: index + 1,
                        };
                    });
                    setTableData(UpdatedTableData);
                    dispatch(Frenchies_Item_sale_Report_Action_Success([]));
                }
            }
            else if ((goButtonData.Status === true)) {
                setTableData([]);
            }
            setBtnMode(0);
        }
        catch (e) { }

    }, [goButtonData]);

    function excel_And_GoBtnHandler(e, Btnmode) {
        setBtnMode(Btnmode);
        debugger
        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Item": Item.value,
            "Party": PartyDropdown.value
        });

        dispatch(Frenchies_Item_sale_Report_Action({ jsonBody }));
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

    function PartyDrodownOnChange(e) {
        setPartyDropdown(e);
        setTableData([]);
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={2} className="">
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

                        <Col sm={2} className="">
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


                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Item</Label>
                                <Col sm="8">
                                    <C_Select
                                        id="ItemName "
                                        name="ItemName"
                                        value={Item}
                                        isSearchable={true}
                                        isLoading={ItemDropDownloading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={ItemList_Options}
                                        onChange={(e) => { setItem(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>



                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Party</Label>
                                <Col sm="8">
                                    <C_Select
                                        name="Party"
                                        value={PartyDropdown}
                                        isSearchable={true}
                                        isLoading={partyDropdownLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Party_Option}
                                        onChange={PartyDrodownOnChange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={isSCMParty ? 2 : 6} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 1 && listBtnLoading}
                                className="btn btn-success m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler(e, 1)}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 2 && listBtnLoading}
                                className="btn btn-primary m-3 mr "
                                onClick={(e) => excel_And_GoBtnHandler(e, 2)}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>
                <div className="mb-1 table-responsive table">
                    <GlobalCustomTable
                        keyField={"id"}
                        data={tableData}
                        columns={tableColumns}
                        id="table_Arrow"
                        noDataIndication={
                            <div className="text-danger text-center ">
                                Record's Not available
                            </div>
                        }
                        onDataSizeChange={({ dataCount, filteredData = [] }) => {
                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} ₹ ${_cfunc.TotalAmount_Func(filteredData)}`));
                        }}
                    />
                </div>


            </div>

        </React.Fragment >
    )
}

export default FrenchiesSaleReport;