import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc, onChangeSelect } from "../../components/Common/validationFunction";
import { Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import { postOrderSummary_API, postOrderSummary_API_Success } from "../../store/Report/OrderSummaryRedux/action";
import * as XLSX from 'xlsx';
import { SSDD_List_under_Company } from "../../store/actions";

const OrderSummary = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        PartyName: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [Party, setParty] = useState('');


    const reducers = useSelector(
        (state) => ({
            listLoading: state.OrderSummaryReducer.listLoading,
            orderSummaryGobtn: state.OrderSummaryReducer.orderSummaryGobtn,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, orderSummaryGobtn, SSDD_List } = reducers;
    const { Data = [] } = orderSummaryGobtn;
    const values = { ...state.values }

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
        dispatch(SSDD_List_under_Company());
    }, [])


    useEffect(() => {

        if (Data.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(Data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Order Summary Report");
            XLSX.writeFile(workbook, "Order Summary Report.xlsx");
            dispatch(postOrderSummary_API_Success([]));
        }
    }, [Data]);

    const Party_Option = SSDD_List.map(i => ({
        value: i.id,
        label: i.Name

    }));

    const onselecthandel = (e) => {
        setParty(e.value)
    }


    function goButtonHandler() {
        debugger
        const btnId = `gobtn-${url.ORDER_SUMMARY_REPORT}`
        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "CompanyID": _cfunc.loginCompanyID(),
            "PartyID": Party

        });
        dispatch(postOrderSummary_API({ jsonBody, btnId }));
    }

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={4} className="">
                            <FormGroup className="mb- row mt-3 mb-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={values.FromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={4} className="">
                            <FormGroup className="mb- row mt-3 mb-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>Party</Label>
                                <Col sm="7">
                                    <Select
                                        name="DistrictName"
                                        value={values.Party}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Party_Option}
                                        onChange={(e) => { onselecthandel(e) }}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm="1" className="mt-3 ">
                            <Go_Button onClick={goButtonHandler} loading={reducers.listLoading} />
                        </Col>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default OrderSummary;