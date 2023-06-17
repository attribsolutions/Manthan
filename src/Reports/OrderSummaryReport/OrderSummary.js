import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from "reactstrap";
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
import { AlertState, SSDD_List_under_Company } from "../../store/actions";
import PartyDropdown_Common from "../../components/Common/PartyDropdown";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { groupByColumnsWithSumFunc } from "./demoGrouplife";
const OrderSummary = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();


    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        PartyName: { value: "", label: "All" },
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [groupByDate, setGroupByDate] = useState(false);
    const [groupByParty, setGroupByParty] = useState(false);


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
        if ((orderSummaryGobtn.Status === true) && (orderSummaryGobtn.StatusCode === 204)) {
            dispatch(postOrderSummary_API_Success([]))
            customAlert({
                Type: 3,
                Message: orderSummaryGobtn.Message,
            })
            return
        }
    }, [orderSummaryGobtn])

    useEffect(() => {
        if (Data.length > 0) {
            var arr = []
            if (groupByDate) {
                arr.push('OrderDate')
            }
            if (groupByParty) {
                arr.push('CustomerName')
            }

            const groupData = groupByColumnsWithSumFunc(Data, [...arr, ...['Group', 'SubGroup', 'MaterialName']]);
            _cfunc.CommonConsole(JSON.stringify(groupData))
            const worksheet = XLSX.utils.json_to_sheet(groupData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Order Summary Report");
            XLSX.writeFile(workbook, "Order Summary Report.XLSX");
            dispatch(postOrderSummary_API_Success([]));
        }
    }, [Data]);

    const Party_Option = SSDD_List.map(i => ({
        value: i.id,
        label: i.Name
    }));
    Party_Option.unshift({
        value: "",
        label: " All"
    });

    const onselecthandel = (e) => {

        setState((i) => {
            const a = { ...i }
            a.values.PartyName = e;
            a.hasValid.PartyName.valid = true
            return a
        })
    }


    function goButtonHandler() {

        const btnId = `gobtn-${url.ORDER_SUMMARY_REPORT}`
        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "CompanyID": _cfunc.loginCompanyID(),
            "PartyID": isSCMParty ? values.PartyName.value : _cfunc.loginPartyID()

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

                        {isSCMParty &&
                            <Col sm={3} className="">
                                <FormGroup className="mb- row mt-3" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "65px" }}>Party</Label>
                                    <Col sm="7">
                                        <Select
                                            name="DistrictName"
                                            value={values.PartyName}
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
                        }

                        <Col sm="1" className="mt-3 ">
                            <Go_Button onClick={goButtonHandler} loading={reducers.listLoading} />
                        </Col>
                    </div>
                </div>

                <Card className="mt-1">
                    <CardBody className="c_card_body">
                        <Row>
                            <Col sm={4} >
                                <FormGroup className="mb- row mt-3 mb-2" >
                                    <Label className="col-8 p-2" >By Date Group</Label>
                                    <Col sm="4">
                                        <Input type="checkbox"
                                            checked={groupByDate}
                                            onChange={(e) => setGroupByDate(e.target.checked)} />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col sm={4} >
                                <FormGroup className="mb- row mt-3 mb-2" >
                                    <Label className="col-8 p-2" >By Party Name</Label>
                                    <Col sm="4">
                                        <Input type="checkbox"
                                            checked={groupByParty}
                                            onChange={(e) => setGroupByParty(e.target.checked)}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        </React.Fragment >
    )
}

export default OrderSummary;