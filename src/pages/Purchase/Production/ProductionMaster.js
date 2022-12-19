import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";


import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import { useHistory } from "react-router-dom";
import {
    editOrderIdSuccess,
    goButton,
    goButtonSuccess,
    updateOrderIdSuccess
} from "../../../store/Purchase/OrderPageRedux/actions";
import { getSupplierAddress } from "../../../store/CommonAPI/SupplierRedux/actions"
import { AlertState, BreadcrumbFilterSize, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { basicAmount, GstAmount, handleKeyDown, Amount } from "../Order/OrderPageCalulation";
import '../../Order/div.css'

import { GRN_lIST, ORDER_lIST } from "../../../routes/route_url";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";

import Breadcrumb from "../../../components/Common/Breadcrumb3";
import { editGRNId, getGRN_itemMode2_Success, postGRN, postGRNSuccess } from "../../../store/Purchase/GRNRedux/actions";
import { mySearchProps } from "../../../components/Common/ComponentRelatedCommonFile/MySearch";
import { createdBy, currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { comAddPageFieldFunc, initialFiledFunc } from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";

let description = ''
let editVal = {}
let initialTableData = []
const GRNAdd = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userAccState, setUserPageAccessState] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data

    const [grnDate, setgrnDate] = useState(currentDate);
    const [invoiceDate, setInvoiceDate] = useState(currentDate);

    const [deliverydate, setdeliverydate] = useState("today")
    const [billAddr, setbillAddr] = useState('')
    const [shippAddr, setshippAddr] = useState('')

    const [supplierSelect, setsupplierSelect] = useState('');
    const [orderAmount, setOrderAmount] = useState(0);
    const [grnDetail, setGrnDetail] = useState({});
    const [grnItemList, setgrnItemList] = useState([]);
    console.log("grnDetail", grnDetail)

    const initialFiled = {
        ProductionDate: "",
        EstimatedQuantity: "",
        NumberOfLot: "",
        ActualQuantity: "",
        BatchDate: "",
        BatchCode: "",
        StoreLocation: "",
        SupplierBatchCode: "",
        BestBefore: "",
        Remark: "",
        Item : "",


    }
    const [state, setState] = useState(initialFiledFunc(initialFiled))

    useEffect(() => {
        // dispatch(getSupplier())
        dispatch(getSupplierAddress())
    }, [])
    const {
        items,
        postMsg,
        userAccess,
        updateMsg,
        supplierAddress,
        pageField
    } = useSelector((state) => ({
        supplierAddress: state.SupplierReducer.supplierAddress,
        items: state.GRNReducer.GRNitem,
        postMsg: state.GRNReducer.postMsg,
        updateMsg: state.GRNReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(77))
        // dispatch(getItemList())
        // dispatch(getBaseUnit_ForDropDown());
    }, []);

    // const values = { ...state.values }
    // const { isError } = state;
    // const { fieldLabel } = state;
    const { fieldLabel } = state;


    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) { locationPath = props.masterPath; };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserPageAccessState(userAcc)
        };
    }, [userAccess])

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")




    useEffect(() => {
        if ((supplierAddress.length > 0) && (!((hasShowloction || hasShowModal)))) {
            setbillAddr(supplierAddress[0]);
            setshippAddr(supplierAddress[0]);
        }
    }, [supplierAddress])
    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postGRNSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: GRN_lIST,
            }))
        } else if (postMsg.Status === true) {
            dispatch(postGRNSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            history.push({
                pathname: ORDER_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateOrderIdSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss])


    useEffect(() => {
        debugger
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })// new change
        }
    }, [pageField])

    function val_onChange(val, row, type) {

        if (type === "qty") {
            row["Quantity"] = val;
        }
        else {
            row["Rate"] = val
        }
        const amount = Amount(row)
        row["Amount"] = amount
        try {
            document.getElementById(`abc${row.id}`).innerText = amount
            // value = amount
        }
        catch { alert("`abc${row.id}`") }

        let sum = 0
        grnItemList.forEach(ind => {
            sum = sum + parseFloat(ind.Amount)
        });
        setOrderAmount(sum.toFixed(2))
        dispatch(BreadcrumbFilterSize(`${"GRN Amount"} :${sum.toFixed(2)}`))
    }

   
    if (!(userAccState === "")) {
        return (
            <React.Fragment>
                <MetaTags>
                    <title>{userAccState.PageHeading}| FoodERP-React FrontEnd</title>
                </MetaTags>
                <div className="page-content" >
                    <Breadcrumb
                        pageHeading={userAccState.PageHeading}
                        showCount={true}
                    />
                    <div className="px-2 mb-1  c_card_header " style={{ marginTop: "-15px" }} >
                        <Row>
                            <Col sm={5}>
                                <FormGroup className=" row mt-2 " >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "170px" }}>{fieldLabel.ProductionDate}</Label>
                                    <Col sm="7">
                                        <Flatpickr
                                            name="ProductionDate"
                                            // value={values.ProductionDate}
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="YYYY-MM-DD"
                                            autoComplete="0,''"
                                            disabled={pageMode === "edit" ? true : false}
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                // defaultDate: pageMode === "edit" ? values.BomDate : "today"
                                            }}
                                            // onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            // onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className=" row  " >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "170px" }}>{fieldLabel.EstimatedQuantity} </Label>
                                    <Col md="7">
                                        < Input
                                            style={{ backgroundColor: "white" }}
                                            type="text" value={grnDetail.SupplierName} disabled={true} />
                                    </Col>
                                </FormGroup>
                                {/* <FormGroup className=" row " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>BatchCode</Label>
                                    <Col sm="7">
                                        <Input type="text"
                                            style={{ backgroundColor: "white" }}

                                            // disabled={true}
                                            value={grnDetail.challanNo}
                                            placeholder="Enter Challan No" />
                                    </Col>
                                </FormGroup> */}
                                {/* <FormGroup className=" row mt-2" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Store location</Label>
                                    <Col md="7">
                                        <Select
                                        />
                                    </Col>
                                </FormGroup> */}
                                <FormGroup className=" row " >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "170px" }}>{fieldLabel.Remark}</Label>
                                    <Col sm="7">
                                        <Input type="text"
                                            style={{ backgroundColor: "white" }}
                                            value={grnDetail.challanNo}
                                            placeholder="Enter Remark No" />
                                    </Col>
                                </FormGroup>
                                <FormGroup className=" row" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "170px" }}>{fieldLabel.BestBefore}</Label>
                                    <Col md="7">
                                        <Flatpickr
                                            name="grndate"
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                defaultDate: "today"
                                            }}
                                            onChange={(e, date) => { setgrnDate(date) }}
                                            onReady={(e, date) => { setgrnDate(date); }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm={5}>
                                <FormGroup className=" row mt-2" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "170px" }}>{fieldLabel.Item}</Label>
                                    <Col md="7">
                                        <Select

                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row  " >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "170px" }}>{fieldLabel.ActualQuantity}</Label>
                                    <Col md="7">
                                        <Input type="text"
                                            // disabled={true}
                                            pattern={/[A-Za-z]{3}/}
                                            value={grnDetail.challanNo}
                                            placeholder="Enter ActualQuantity" />
                                    </Col>
                                </FormGroup>
                                {/* 
                                <FormGroup className=" row mt-2" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>BatchDate</Label>
                                    <Col md="7">
                                        <Flatpickr
                                            name="grndate"
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                defaultDate: "today"
                                            }}
                                            onChange={(e, date) => { setgrnDate(date) }}
                                            onReady={(e, date) => { setgrnDate(date); }}
                                        />
                                    </Col>
                                </FormGroup> */}
                                <FormGroup className="mb-2 row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "170px" }}>{fieldLabel.SupplierBatchCode}</Label>
                                    <Col md="7">
                                        <Input type="text"
                                            // disabled={true}
                                            pattern={/[A-Za-z]{3}/}
                                            value={grnDetail.SupplierBatchCode}
                                            placeholder="Enter Invoice No" />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>
                    </div>
                    {
                        (grnItemList.length > 0) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                            {/* <SaveButton pageMode={pageMode} userAcc={userAccState}
                                module={"GRN"} onClick={saveHandeller}
                            /> */}
                        </div>
                            :
                            <div className="row save1"></div>
                    }
                </div >
            </React.Fragment >
        )
    } else {
        return null
    }
}
export default GRNAdd

