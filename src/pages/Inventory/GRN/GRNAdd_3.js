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
import { BreadcrumbShowCountlabel, Breadcrumb_inputName, commonPageField, commonPageFieldSuccess, postSelect_Field_for_dropdown } from "../../../store/actions";
import { orderCalculateFunc } from "../../Purchase/Order/OrderPageCalulation";
import { SaveButton } from "../../../components/Common/CommonButton";
import { editGRNIdSuccess, makeGRN_Mode_1ActionSuccess, saveGRNAction, saveGRNSuccess } from "../../../store/Inventory/GRNRedux/actions";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import Select from "react-select";
import { mode, url, pageId } from "../../../routes/index";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { CInput, C_DatePicker, decimalRegx, floatRegx, onlyNumberRegx } from "../../../CustomValidateForm";
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
    const [grnItemTableList, setGrnItemTableList] = useState([]);
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
        genralMaster_type69
    } = useSelector((state) => ({
        // supplierAddress: state.CommonAPI_Reducer.supplierAddress,
        saveBtnloading: state.GRNReducer.saveBtnloading,
        items: state.GRNReducer.GRNitem,
        postMsg: state.GRNReducer.postMsg,
        updateMsg: state.GRNReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        genralMaster_type69: state.PartyMasterBulkUpdateReducer.SelectField,
    }));



    const values = { ...state.values }

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useLayoutEffect(() => {
        let page_Id = pageId.GRN_ADD_3;
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))

        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 69
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
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

    useEffect(() => table_ArrowUseEffect("#table_Arrow"), [grnItemTableList]);

    useEffect(() => {

        if ((items.Status === true)) {

            const grnDetails = { ...items.Data }

            setGrnItemTableList(grnDetails.OrderItem)

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
                setGrnItemTableList(GRNItems)
                dispatch(editGRNIdSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, []);

    const discrepancyOptions = genralMaster_type69.map(index => ({
        value: index.id,
        label: index.Name,
    }));

    const tableColumns = [
        {//------------- ItemName column ----------------------------------
            text: "Item Name",
            dataField: "ItemName",
        },

        {//------------- Quantity  column ----------------------------------
            text: "Quantity",
            dataField: "Quantity",
            align: () => 'right',
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

        {  //-------------MRP column ----------------------------------
            text: "GST",
            dataField: "GSTDropdown",
            align: () => ('right'),
            formatter: (cellContent, row, key) => {
                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Select
                        id={`MRP${key}`}
                        name="MRP"
                        defaultValue={row.DefaultGST}
                        isSearchable={true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={row.GSToption}
                        onChange={(event) => { row.DefaultGST = event }}
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
            align: () => 'right',
            formatter: (cellContent) => <>{_cfunc.amountCommaSeparateFunc(cellContent)}</>,
        },

        {//------------- Batch Code column ----------------------------------
            text: "Batch",
            dataField: "",
            formatter: (cellContent, index1, keys_,) => (
                <>
                    <div className="bottom-div mb-3" style={{ minWidth: "150px" }}>
                        <samp>{index1.BatchCode}</samp>

                    </div>

                    <div className="bottom-div">
                        <samp>{_cfunc.date_dmy_func(index1.BatchDate)}</samp>

                    </div>
                </>
            ),

        },

        {//------------- Batch Date column ----------------------------------
            text: "Discrepancy",
            dataField: "",
            formatExtraData: { discrepancyOptions },
            formatter: (cellContent, index1) => {

                return (
                    <>
                        <div className="div-1 mb-1" style={{ minWidth: "150px" }}>
                            <div>
                                <Select
                                    classNamePrefix="select2-selection"
                                    placeholder="Select..."
                                    defaultValue={index1.defaultDiscrepancy}
                                    options={discrepancyOptions}
                                    onChange={event => index1.defaultDiscrepancy = event}

                                ></Select>
                            </div>
                        </div>
                        <div className="div-1" style={{ minWidth: "150px" }}>
                            <Input
                                type="text"
                                className="input"
                                autoComplete="off"
                                placeholder="Enter Item Related Quary"
                                defaultValue={index1.comment}
                                onChange={event => index1.comment = event.target.value}
                            />
                        </div>
                    </>
                )
            }
        },

    ];

    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const saveHandeller = (event) => {

        event.preventDefault();

        const btnId = event.target.id


        try {
            const itemArr = []
            let sum = 0
            let inValidMsg = []
            grnItemTableList.forEach(i => {
                debugger

                if (!(i.Quantity > 0)) {
                    inValidMsg.push({ [i.ItemName]: "This Item Quantity Is Require..." });
                }
                const calculate = orderCalculateFunc(i)// amount calculation function 

                const arr = {
                    Item: i.Item,
                    Quantity: i.Quantity,// GRN Quantity
                    ActualQuantity: i.invoiceQuantity, //invoice actual quantity 
                    Comment: i.comment,
                    Reason: i.defaultDiscrepancy ? i.defaultDiscrepancy.value : "",//default Discrepancy value
                    MRP: i.defaultMRP.value,
                    MRPValue: i.defaultMRP.label,

                    ReferenceRate: i.Rate,
                    Rate: i.Rate,
                    Unit: i.Unit,
                    BaseUnitQuantity: i.BaseUnitQuantity,
                    GST: i.DefaultGST.value,
                    GSTPercentage: i.DefaultGST.label,
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

            if (inValidMsg.length > 0) {
                customAlert({ Type: 4, Message: inValidMsg, })
                return
            }

            itemArr.forEach(element => {
                sum = sum + Number(element.Amount)
            });

            if (invoiceNo.length === 0) {
                customAlert({
                    Type: 3,
                    Message: "Please Enter Invoice Number",
                })
                return
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

            } else {
                dispatch(saveGRNAction({ jsonBody, btnId }))
            }
        } catch (error) { _cfunc.CommonConsole(error) }
    }

    if (!(userPageAccessState === "")) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content">

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
                                        <Input
                                            type="text"
                                            value={pageMode === mode.view ? EditData.CustomerName : grnDetail.SupplierName}
                                            // disabled={pageMode === mode.view ? true : false} 
                                            disabled={(pageMode === mode.view) && true}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>PO Number</Label>
                                    <Col sm="7">
                                        <Input type="text"
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
                        keyField={"Item_id"}
                        defaultSorted={defaultSorted}
                        data={grnItemTableList}
                        columns={tableColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table" style={{ minHeight: "45vh" }}>
                                            <BootstrapTable
                                                keyField={"Item_id"}
                                                id="table_Arrow"
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Items Not available
                                                    </div>
                                                }
                                                onDataSizeChange={(e) => {
                                                    _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                }}
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
                        (grnItemTableList.length > 0) ?
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

