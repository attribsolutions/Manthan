import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess, Get_Items_Drop_Down, getpdfReportdata, } from "../../store/actions";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import C_Report from "../../components/Common/C_Report";
import { getCommonPartyDrodownOptionAction } from "../../store/Utilites/PartyDrodown/action";
import { PartyWiseItemSaleReport_GoButton_API_Success } from "../../store/Report/PartywiseItemSaleRedux/action";
import { ItemSaleReport_GoBtn_API } from "../../helpers/backend_helper";
import * as report from '../../Reports/ReportIndex'
import { allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";

const PartyWiseItemSaleReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const [fromDate, setFromDate] = useState("2025-04-01")
    const [toDate, setToDate] = useState(currentDate_ymd)

    const [Item, setItem] = useState([allLabelWithZero]);


    const [userPageAccessState, setUserAccState] = useState('');
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)


    const {
        userAccess,
        ItemDropDown,
        commonPartyDropSelect,
        ItemDropDownloading,
        printBtnLoading

    } = useSelector((state) => ({
        GoButtonData: state.PartyWiseItemSaleReportReducer.ItemConsumption,
        ItemDropDownloading: state.StockEntryReducer.ItemDropDownloading,
        ItemDropDown: state.StockEntryReducer.ItemDropDown,
        printBtnLoading: state.PdfReportReducers.printAllBtnLoading,
        commonPartyDropSelect: state.CommonPartyDropdownReducer,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField

    }));


    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.PARTY_WISE_ITEM_SALE_REPORT));
        dispatch(getCommonPartyDrodownOptionAction())

        return () => {
            dispatch(commonPageFieldSuccess(null));

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
        if (commonPartyDropSelect.value > 0) {

        } else {
            partySelectOnChangeHandler();
        }
    }, [commonPartyDropSelect]);

    function partySelectOnChangeHandler() {
        PartyWiseItemSaleReport_GoButton_API_Success([]);

    }
    const ItemList_Options = ItemDropDown.map((index) => ({
        value: index.Item,
        label: index.ItemName,
    }));

    ItemList_Options.unshift(allLabelWithZero)


    useEffect(() => {
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
    }, []);


    function goButtonHandler(goBtnMode) {
        debugger
        try {
            const jsonBody = JSON.stringify({
                FromDate: fromDate,
                ToDate: toDate,
                PartyType: _cfunc.loginPartyTypeID(),
                Party: _cfunc.loginSelectedPartyID(),
                Employee: _cfunc.loginEmployeeID(),
                ItemID: (Item[0].value === 0) ? ItemList_Options
                    .filter(inx => inx.value !== 0)
                    .map(inx => inx.value)
                    .join(',') : Item.map(inx => inx.value).join(','),
                CompanyID: _cfunc.loginCompanyID()

            });
            const config = {
                jsonBody,
                goBtnMode,
                ReportType: report.Period_Wise_Item_Sale
            };
            dispatch(getpdfReportdata(ItemSaleReport_GoBtn_API, config))
        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function fromdateOnchange(e, date) {
        setFromDate(date)
        dispatch(PartyWiseItemSaleReport_GoButton_API_Success([]));
    }

    function todateOnchange(e, date) {
        setToDate(date);
        dispatch(PartyWiseItemSaleReport_GoButton_API_Success([]));
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
                                        value={fromDate}
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
                                        value={toDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={4} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Item</Label>
                                <Col sm="8">
                                    <C_Select
                                        id="ItemName "
                                        name="ItemName"
                                        value={Item}
                                        isSearchable={true}
                                        isMulti={true}
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


                        <Col sm={4} className=" d-flex justify-content-end" >

                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={printBtnLoading}
                                className="btn btn-primary m-3 mr"
                                onClick={() => goButtonHandler("Print")}
                            >
                                Print
                            </C_Button>
                        </Col>
                    </Row>
                </div>
            </div>
            <C_Report />
        </React.Fragment >

    )
}

export default PartyWiseItemSaleReport;