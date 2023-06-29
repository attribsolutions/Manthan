import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useHistory } from "react-router-dom";
import { BreadcrumbShowCountlabel, Breadcrumb_inputName, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { orderCalculateFunc } from "../../Purchase/Order/OrderPageCalulation";
import { SaveButton } from "../../../components/Common/CommonButton";
import { editGRNIdSuccess, makeGRN_Mode_1ActionSuccess, saveGRNAction, saveGRNSuccess } from "../../../store/Inventory/GRNRedux/actions";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import Select from "react-select";
import { mode, url, pageId } from "../../../routes/index";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { CInput, C_DatePicker, decimalRegx, floatRegx } from "../../../CustomValidateForm";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import { pageFieldUseEffect, saveMsgUseEffect, table_ArrowUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";
import { useLayoutEffect } from "react";


const GRNAdd3 = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const [grnDate, setgrnDate] = useState(currentDate_ymd);
    const [grnDetail, setGrnDetail] = useState({});
    const [grnItemList, setgrnItemList] = useState([]);
    const [openPOdata, setopenPOdata] = useState([]);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [EditData, setEditData] = useState({});


    const fileds = {
        GRNDate: currentDate_ymd,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const {
        items,
        postMsg,
        userAccess,
        pageField,
        saveBtnloading,
    } = useSelector((state) => ({
        // supplierAddress: state.CommonAPI_Reducer.supplierAddress,
        saveBtnloading: state.GRNReducer.saveBtnloading,
        items: state.GRNReducer.GRNitem,
        postMsg: state.GRNReducer.postMsg,
        updateMsg: state.GRNReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));



    const values = { ...state.values }

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useLayoutEffect(() => {
        let page_Id = pageId.GRN_ADD_3;
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, [])

    useEffect(() => userAccessUseEffect({ // userAccess common useEffect 
        props,
        userAccess,
        dispatch,
        setUserAccState,
    }), [userAccess]);

    useEffect(() => saveMsgUseEffect({// saveMsgUseEffect common useEffect 
        postMsg, pageMode,
        history, dispatch,
        postSuccss: saveGRNSuccess,
        listPath: url.GRN_LIST_3
    }), [postMsg])

    useEffect(() => pageFieldUseEffect({// useEffect common pagefield for master
        state,
        setState,
        pageField
    }), [pageField])

    useEffect(() => table_ArrowUseEffect("#table_Arrow"), [grnItemList]);

    useEffect(() => {

        if ((items.Status === true)) {

            //Unused code  **start** $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

            const grnDetails = { ...items.Data }
            let tableArr = []
            let initial = ''
            let roundedTotalAmount = 0
            let tQty = 0
            let id = 1
            grnDetails.OrderItem.forEach((i, k) => {

                i.BatchDate_conv = _cfunc.date_dmy_func(i.BatchDate)

                if (k === 0) {
                    i.id = id
                    tableArr.push(i)
                    initial = i.Item
                    roundedTotalAmount = Number(i.Amount)
                    tQty = Number(i.Quantity)
                }
                else if ((initial === i.Item) && (k === grnDetails.OrderItem.length - 1)) {
                    ++id;
                    i.id = id
                    roundedTotalAmount = roundedTotalAmount + Number(i.Amount)
                    tQty = tQty + Number(i.Quantity)
                    initial = i.Item
                    tableArr.push(i)
                    tableArr.push({ id, ItemName: "Total", Amount: roundedTotalAmount.toFixed(3), Quantity: tQty.toFixed(3) })
                }
                else if ((k === grnDetails.OrderItem.length - 1)) {
                    ++id;
                    tableArr.push({ id, ItemName: "Total", Amount: roundedTotalAmount.toFixed(3), Quantity: tQty.toFixed(3) })
                    ++id;
                    i.id = id
                    roundedTotalAmount = Number(i.Amount)
                    tQty = Number(i.Quantity)
                    tableArr.push(i)
                    tableArr.push({ id, ItemName: "Total", Amount: roundedTotalAmount.toFixed(3), Quantity: tQty.toFixed(3) })
                }
                else if (initial === i.Item) {
                    // i.ItemName=''
                    ++id;
                    i.id = id
                    tableArr.push(i)
                    roundedTotalAmount = roundedTotalAmount + Number(i.Amount)
                    tQty = tQty + Number(i.Quantity)
                    initial = i.Item
                } else {
                    ++id;
                    tableArr.push({ id, ItemName: "Total", Amount: roundedTotalAmount.toFixed(3), Quantity: tQty.toFixed(3) })
                    ++id;
                    tableArr.push(i)
                    roundedTotalAmount = Number(i.Amount)
                    tQty = Number(i.Quantity)
                    initial = i.Item
                }

            })
            // grnDetails.OrderItem = tableArr

            //Unused code **End** $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

            setgrnItemList(grnDetails.OrderItem)

            setInvoiceNo(grnDetails.InvoiceNumber)
            setGrnDetail(grnDetails)
            const myArr = grnDetails.challanNo.split(",");
            myArr.map(i => ({ Name: i, hascheck: false }))
            setopenPOdata(grnDetails.GRNReferences)

            dispatch(makeGRN_Mode_1ActionSuccess({ Status: false }))

            dispatch(BreadcrumbShowCountlabel(`${"GRN Amount"} :${grnDetails.OrderAmount}`))
        }

    }, [items])

    useEffect(() => {
        if ((hasShowloction || hasShowModal)) {
            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
            }

            if (hasEditVal) {

                setEditData(hasEditVal);

                const { GRNItems = [], GRNReferences = [], InvoiceNumber } = hasEditVal;

                let ChallanNo1 = ''

                GRNReferences.forEach(ele => {
                    ChallanNo1 = ChallanNo1.concat(`${ele.ChallanNo},`)
                });
                ChallanNo1 = ChallanNo1.replace(/,*$/, '');

                setInvoiceNo(InvoiceNumber)
                setGrnDetail(ChallanNo1);
                setgrnItemList(GRNItems)
                dispatch(editGRNIdSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, [])


    const tableColumns = [
        {//------------- ItemName column ----------------------------------
            text: "Item Name",
            dataField: "ItemName",
        },

        {//------------- Quntity  column ----------------------------------
            text: "Invoice-Qty",
            dataField: "Quantity",
            align: () => ('right')
        },

        {  //------------- Unit column ----------------------------------
            text: "Unit",
            dataField: "UnitName",
        },

        {  //------------- QtyInBox column ----------------------------------
            text: "QtyInBox",
            dataField: "QtyInBox",
            align: 'right'
        },

        {  //-------------MRP column ----------------------------------
            text: "MRP",
            dataField: "MRPDetails",
            align: () => ('right'),
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Select
                        id={`MRP${key}`}
                        name="MRP"
                        defaultValue={row.defaultMRP}
                        isSearchable={true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={row.MRPOps}
                        onChange={(event) => { row.defaultMRP = event }}
                    />
                </span>)
            },
            headerStyle: () => {
                return { width: '160px' };
            }
        },

        {  //-------------Rate column ----------------------------------
            text: "Rate",
            dataField: "Rate",
            align: () => ('right')
        },

        {//------------- ItemName column ----------------------------------
            text: "Amount",
            dataField: "Amount",
            align: () => ('right')
        },

        {//------------- Batch Code column ----------------------------------
            text: "BatchCode",
            dataField: "BatchCode",
        },

        {//------------- Batch Date column ----------------------------------
            text: "Batch Date",
            dataField: "BatchDate_conv",
        },
    ];

    const rowStyle2 = (row, rowIndex) => {
        const style = {};
        if (row.ItemName === "Total") {
            style.backgroundColor = '#E6ECF4';
            style.fontWeight = 'bold';
            style.hover = 'red';
        }
        return style;
    };

    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const saveHandeller = (event) => {

        event.preventDefault();

        const btnId = event.target.id
        _cfunc.btnIsDissablefunc({ btnId, state: true })

        function returnFunc() {
            _cfunc.btnIsDissablefunc({ btnId, state: false })
        }
        try {
            const itemArr = []
            let sum = 0
            grnItemList.forEach(i => {

                const calculate = orderCalculateFunc(i)// amount calculation function 
                // if (i.ItemName === "Total") { return }
                const arr = {
                    Item: i.Item,
                    Quantity: i.Quantity,
                    MRP: i.defaultMRP.value,
                    // MRPValue: i.defaultMRP.label,
                    ReferenceRate: i.Rate,
                    Rate: i.Rate,
                    Unit: i.Unit,
                    BaseUnitQuantity: i.BaseUnitQuantity,
                    GST: i.GST,
                    // GSTPercentage: i.GSTPercentage,
                    BasicAmount: calculate.basicAmount,
                    GSTAmount: calculate.roundedGstAmount,
                    Amount: calculate.roundedTotalAmount,

                    CGST: calculate.CGST_Amount,
                    SGST: calculate.SGST_Amount,
                    IGST: 0,
                    CGSTPercentage: (i.GSTPercentage / 2),
                    SGSTPercentage: (i.GSTPercentage / 2),
                    IGSTPercentage: 0,
                    BatchDate: i.BatchDate,
                    BatchCode: i.BatchCode,
                    DiscountType: "0",
                    Discount: "0.00",
                    DiscountAmount: "0.00",
                    TaxType: "GST",
                }

                if ((i.Quantity > 0)) {
                    itemArr.push(arr)
                }
            })

            itemArr.forEach(element => {
                sum = sum + Number(element.Amount)
            });

            if (invoiceNo.length === 0) {
                customAlert({
                    Type: 3,
                    Message: "Please Enter Invoice Number",
                })
                return returnFunc()
            }
            const jsonBody = JSON.stringify({
                GRNDate: grnDate,
                Customer: grnDetail.Customer,
                GRNNumber: 1,
                GrandTotal: sum.toFixed(2),
                Party: grnDetail.Supplier,
                InvoiceNumber: invoiceNo,
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: 1,
                GRNItems: itemArr,
                GRNReferences: openPOdata,
            });

            if (pageMode === mode.edit) {
                returnFunc()
            } else {
                dispatch(saveGRNAction({ jsonBody, btnId }))
            }
        } catch (error) { returnFunc() }
    }

    if (!(userPageAccessState === "")) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    <div className="px-2 mb-1  c_card_header " >
                        <Row>
                            <Col sm={5}>

                                <FormGroup className=" row mt-2 " >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "130px" }}>GRN Date</Label>
                                    <Col sm="7">
                                        <C_DatePicker
                                            name="GRNDate"
                                            value={values.GRNDate}
                                            disabled={(pageMode === mode.view) ? true : false}
                                            onChange={(e, date) => { setgrnDate(date) }}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Supplier Name</Label>
                                    <Col md="7">
                                        < Input
                                            style={{ backgroundColor: "white" }}
                                            type="text"
                                            value={pageMode === mode.view ? EditData.CustomerName : grnDetail.SupplierName}
                                            disabled={pageMode === mode.view ? true : false} />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>PO Number</Label>
                                    <Col sm="7">
                                        <Input type="text"
                                            style={{ backgroundColor: "white" }}
                                            disabled={true}
                                            value={pageMode === mode.view ? grnDetail : grnDetail.challanNo}
                                            placeholder="Enter Challan No" />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm={5}>
                                <FormGroup className=" row mt-2" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Invoice Date</Label>
                                    <Col md="7">
                                        <C_DatePicker
                                            disabled={true}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="mb-2 row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Invoice No</Label>
                                    <Col md="7">
                                        <Input
                                            type="text"
                                            style={{ backgroundColor: "white" }}
                                            disabled={true}
                                            value={invoiceNo}
                                            placeholder="Enter Invoice No"
                                            onChange={(e) => setInvoiceNo(e.target.value)}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Close PO</Label>
                                    <Col md="7" >

                                        <Input
                                            type="checkbox"
                                            checked={true}
                                            style={{ paddingTop: "7px" }}
                                            placeholder="Enter Invoice No"
                                            disabled={true}
                                        // onChange={(e) => openPOdata[0].Inward = true}
                                        />

                                    </Col>
                                </FormGroup>

                            </Col>
                        </Row>
                    </div>
                    <ToolkitProvider
                        keyField="id"
                        id="table_Arrow"
                        defaultSorted={defaultSorted}
                        data={grnItemList}
                        columns={tableColumns}>
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table">
                                            <BootstrapTable
                                                responsive
                                                bordered={false}
                                                striped={false}
                                                rowStyle={rowStyle2}
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Items Not available
                                                    </div>
                                                }
                                                {...toolkitProps.baseProps}
                                            />
                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>

                                    </Col>
                                </Row>
                            </React.Fragment>
                        )}
                    </ToolkitProvider>

                    {
                        (grnItemList.length > 0) ?
                            <div className="row save1" style={{ paddingBottom: 'center', marginTop: "-30px" }}>
                                <SaveButton pageMode={pageMode}
                                    loading={saveBtnloading}
                                    editCreatedBy={editCreatedBy}
                                    userAcc={userPageAccessState}
                                    module={"GRN"} onClick={saveHandeller}
                                />
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
export default GRNAdd3

