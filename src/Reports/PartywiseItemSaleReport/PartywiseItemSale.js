import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import {  commonPageField, commonPageFieldSuccess, Get_Items_Drop_Down,  } from "../../store/actions";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import C_Report from "../../components/Common/C_Report";
import { getCommonPartyDrodownOptionAction } from "../../store/Utilites/PartyDrodown/action";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";
import { PartyWiseItemSaleReport_GoButton_API, PartyWiseItemSaleReport_GoButton_API_Success } from "../../store/Report/PartywiseItemSaleRedux/action";


const PartyWiseItemSaleReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const [fromDate, setFromDate] = useState(currentDate_ymd)
    const [toDate, setToDate] = useState(currentDate_ymd)
   
    const [Item, setItem] = useState("");
   

    const [userPageAccessState, setUserAccState] = useState('');
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

   
    const {
        userAccess,
        GoBtnLoading,
        ItemDropDown,
        commonPartyDropSelect,
        ItemDropDownloading,
      
    } = useSelector((state) => ({
        GoButtonData: state.PartyWiseItemSaleReportReducer.ItemConsumption,
        GoBtnLoading: state.PartyWiseItemSaleReportReducer.listBtnLoading,
        ItemDropDownloading: state.StockEntryReducer.ItemDropDownloading,
        ItemDropDown: state.StockEntryReducer.ItemDropDown,
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

        if (Item === "") {
            customAlert({
                Type: 4,
                Message: alertMessages.selectItemName,
            })
            return
        }

        try {
            const jsonBody = JSON.stringify({
                FromDate: fromDate,
                ToDate: toDate,
                Party: _cfunc.loginSelectedPartyID(),
                ItemID: Item.value,
            })
            const config = { jsonBody, goBtnMode };
            dispatch(PartyWiseItemSaleReport_GoButton_API(config))

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


                        <Col sm={5} className=" d-flex justify-content-end" >
                     
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={GoBtnLoading === "Print"}
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