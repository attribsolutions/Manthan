import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeDate,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Change_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import { url, mode } from "../../../routes/index"
import { GetVender, } from "../../../store/CommonAPI/SupplierRedux/actions";
import {
    challanItemForDropdown,
    GoButtonForChallanAdd,
    GoButtonForChallanAddSuccess,
    saveChallan_ChallanAdd
} from "../../../store/Inventory/ChallanRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { orderCalculateFunc } from "../../Purchase/Order/OrderPageCalulation";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_DatePicker } from "../../../CustomValidateForm";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";

const Challan = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func()
    const subPageMode = history.location.pathname
    const saveBtnid = `saveBtn${subPageMode}`

    const fileds = {
        ChallanDate: currentDate_ymd,
        Party: "",
        Item: ''
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [showAllStockState, setShowAllStockState] = useState(true);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        GoButton = [],
        vender,
        challanitems
    } = useSelector((state) => ({
        challanitems: state.ChallanReducer.challanitems,
        GoButton: state.ChallanReducer.GoButton,
        vender: state.CommonAPI_Reducer.vender,
        postMsg: state.InvoiceReducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

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

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
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
                setModalCss(true)
            }

            if (hasEditVal) {

                const { Customer, CustomerName, } = hasEditVal
                const { values, hasValid, } = { ...state }
                hasValid.Customer.valid = true;
                values.Customer = { label: CustomerName, value: Customer };
            }
        }
    }, []);

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {

            if (pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.IN })
                }
            }
        }
        else if (postMsg.Status === true) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            history.push({
                pathname: url.MATERIAL_ISSUE_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            customAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID()
        });
        dispatch(challanItemForDropdown(jsonBody))
        dispatch(GetVender())
        dispatch(GoButtonForChallanAddSuccess([]))
    }, [])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField]);

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [GoButton]);

    const venderOptions = vender.map((i) => ({
        value: i.id,
        label: i.Name,
    }));
    const ItemsOption = challanitems.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const pagesListColumns = [

        {//***************ItemName********************************************************************* */
            text: "Item Name",
            dataField: "ItemName",
            headerFormatter: (cell, index1 = [], k) => {
                return (
                    <div className="width-100">Item Name</div>)
            },
            formatter: (cellContent, index1) => {

                return (
                    <>
                        <div><samp id={`ItemName${index1.id}`}>{values.Item.label}</samp></div>
                        {(index1.StockInValid) ? <div><samp id={`StockInvalidMsg${index1.id}`} style={{ color: "red" }}> {index1.StockInvalidMsg}</samp></div>
                            : <></>}
                    </>
                )
            },

        },
        {//***************Quantity********************************************************************* */
            text: "Quantity",
            dataField: "",
            headerFormatter: (cell, index1 = [], k) => {
                return (
                    <div className="width-60">Quantity</div>)
            },
            formatter: (cellContent, user) => (
                <div >
                    <Input type="text"
                        style={{ textAlign: "right" }}
                        placeholder="Enter Quantity"
                        onChange={(event) => orderQtyOnChange(event, user)}
                    ></Input>
                </div>

            )
        },

        {//***************StockDetails********************************************************************* */

            text: "Stock Details",
            dataField: "StockDetails",
            headerFormatter: (cell, index1 = [], k) => {

                return (
                    <div className="d-flex flex-content-start">
                        <div style={{ paddingLeft: "1px", paddingTop: "1px" }}>
                            <samp > Stock Details</samp>
                        </div>

                    </div>
                )
            },

            formatter: (cellContent, index1) => (

                <div>
                    <div key={`plus-circle-icon${index1.id}`}>
                        {
                            (index1.StockTotal > 0) ?
                                <>
                                    <samp key={`plus-circle${index1.id}`} id={`plus-circle${index1.id}`}
                                        style={{
                                            display: showAllStockState ? "none" : "block"
                                        }}
                                    >
                                        <samp style={{ fontWeight: "bold", textShadow: 1, marginLeft: "20px" }}>
                                            {`Total Stock:${index1.StockTotal}`}</samp>
                                    </samp>
                                </>
                                : <samp style={{ fontWeight: "bold", textShadow: 1, }}>{ }</samp>
                        }
                    </div >
                    <Table className="table table-bordered table-responsive mb-1" >
                        <Thead  >
                            <tr className="" style={{ zIndex: -3 }}>
                                <th className="">SystemBatchCode </th>
                                <th className="" >BatchCode</th>
                                <th className="" >Batch Date</th>
                                <th className="">
                                    <div>
                                        <samp >Quantity</samp>
                                    </div>
                                </th>
                                <th className="" >
                                    <div>
                                        <samp >Rate</samp>
                                    </div>
                                </th>
                            </tr>

                        </Thead>
                        <Tbody  >
                            {cellContent.map((index1) => {
                                return (
                                    < tr  >
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                {index1.SystemBatchCode}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                {index1.BatchCode}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "100px" }}>
                                                {_cfunc.date_dmy_func(index1.BatchDate)}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "120px", textAlign: "right" }}>
                                                {`${index1.BaseUnitQuantity} `}
                                            </div>
                                        </td>

                                        <td>
                                            <div style={{ width: "120px", textAlign: "right" }}>
                                                {`${index1.Rate} `}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </Tbody>
                    </Table></div>
            ),
        },
    ];

    const pageOptions = {
        sizePerPage: 10,
        custom: true,
    };


    function ChallanDateOnchange(y, v, e) {
        onChangeDate({ e, v, state, setState })
    };

    function partyOnChange(hasSelect, evn) {
        setState((i) => {
            const v1 = { ...i }
            v1.values.Party = hasSelect
            v1.hasValid.Party.valid = true
            return v1
        })
        dispatch(GoButtonForChallanAddSuccess([]))
    };
    function itemOnChange(hasSelect, evn) {

        setState((i) => {
            const v1 = { ...i }
            v1.values.Item = hasSelect
            v1.hasValid.Item.valid = true
            return v1
        })
        dispatch(GoButtonForChallanAddSuccess([]))
    };

    function stockDistributeFunc(index) {

        const v1 = index.Quantity;
        let orderqty = Number(v1) * Number(index.ConversionUnit);

        index.StockDetails = index.StockDetails.map(i2 => {

            let stockqty = Number(i2.BaseUnitQuantity);

            if ((orderqty > stockqty) && !(orderqty === 0)) {
                orderqty = orderqty - stockqty
                i2.Qty = stockqty.toFixed(3)
            } else if ((orderqty <= stockqty) && (orderqty > 0)) {
                i2.Qty = orderqty.toFixed(3)
                orderqty = 0
            }
            else {
                i2.Qty = 0;
            }
            try {
                document.getElementById(`batchQty${index.id}-${i2.id}`).value = i2.Qty
            } catch (e) { }
            return i2
        });

        const t1 = (v1 * index.ConversionUnit);
        const t2 = index.StockUnit;
        const t3 = index.StockTotal;

        if (t1 > t3) {
            try {
                document.getElementById(`OrderQty${index.id}`).value = t3.toFixed(3)
            } catch (e) { }
        };
        try {
            index.StockInValid = false
            index.StockInvalidMsg = null
            document.getElementById(`StockInvalidMsg${index.id}`).style.display = "none";
        } catch (e) { };
        try {
            document.getElementById(`stocktotal${index.id}`).innerText = `Total:${t1} ${t2}`
        } catch (e) { };

    };

    function orderQtyOnChange(event, index) {

        let input = event.target.value
        let result = /^\d*(\.\d{0,3})?$/.test(input);

        setState((i) => {
            const v1 = { ...i }
            v1.values.Quantity = input
            return v1
        })
        stockDistributeFunc(index)
    };

    function goButtonHandler(event) {

        const validMsg = []
        if (!(values.Item.value)) {
            validMsg.push({ Item: "Please Select Item" })
        };
        if (!(values.Party.value)) {
            validMsg.push({ Party: alertMessages.commonPartySelectionIsRequired })
        };
        if (validMsg.length > 0) {
            customAlert({
                Type: 3,
                Message: validMsg
            })
            return
        } else {
            const jsonBody = JSON.stringify({
                Party: _cfunc.loginPartyID(),
                Item: values.Item.value
            });
            dispatch(GoButtonForChallanAdd(jsonBody));
        }
    };

    const saveHandeller = (e,) => {
        const itemArr = []
        let grand_total = 0;

        const isvalidMsg = [];

        GoButton[0].StockDetails.forEach(i => {
            i["Quantity"] = values.Quantity

            const calculate = orderCalculateFunc(i)// amount calculation function 

            grand_total = grand_total + Number(calculate.roundedTotalAmount)
            const arr = {
                Item: values.Item.value,
                Quantity: values.Quantity,
                Unit: i.UnitName.id,
                BaseUnitQuantity: i.BaseUnitQuantity,
                MRP: i.MRP,
                ReferenceRate: "100.00",
                Rate: i.Rate,
                BasicAmount: calculate.basicAmount,
                TaxType: "GST",
                GST: i.GST,
                GSTPercentage: i.GSTPercentage,
                HSNCode: i.HSNCode,
                GSTAmount: calculate.roundedGstAmount,
                Amount: calculate.roundedTotalAmount,
                DiscountType: "0",
                Discount: "0.00",
                DiscountAmount: "0.00",
                CGST: calculate.CGST_Amount,
                SGST: calculate.SGST_Amount,
                IGST: 0,
                CGSTPercentage: (i.GSTPercentage / 2),
                SGSTPercentage: (i.GSTPercentage / 2),
                IGSTPercentage: 0,
                BatchDate: i.BatchDate,
                BatchCode: i.BatchCode,
                SystemBatchDate: i.SystemBatchDate,
                SystemBatchCode: i.SystemBatchCode,
                BatchID: i.id,
            }
            if ((i.GSTPercentage > 0)) {
                itemArr.push(arr)
            }

        })

        if (isvalidMsg.length > 0) {
            customAlert({
                Type: 3,
                Message: isvalidMsg,
            })
            return
        }
        const jsonBody = JSON.stringify({
            GRN: "",
            ChallanDate: values.ChallanDate,
            Party: _cfunc.loginPartyID(),
            GrandTotal: grand_total,
            Customer: values.Party.value,
            CreatedBy: _cfunc.loginUserID(),
            UpdatedBy: _cfunc.loginUserID(),
            RoundOffAmount: Math.round(grand_total),
            ChallanItems: itemArr,

        });

        dispatch(saveChallan_ChallanAdd(jsonBody))
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    <form noValidate>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
                            <Row>
                                <Col className=" mt-1 row " sm={12} >
                                    <Col sm={3}>
                                        <FormGroup className="row mt-2 mb-3  ">
                                            <Label className="mt-1" style={{ width: "110px" }}>Challan Date </Label>
                                            <Col sm={7}>
                                                <C_DatePicker
                                                    name="ChallanDate"
                                                    value={values.ChallanDate}
                                                    id="myInput11"
                                                    disabled={(GoButton.length > 0 || pageMode === "edit") ? true : false}
                                                    onChange={ChallanDateOnchange}
                                                />
                                                {isError.ChallanDate.length > 0 && (
                                                    <span className="invalid-feedback">{isError.ChallanDate}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm={3}>
                                        <FormGroup className="row mt-2 mb-3 ">
                                            <Label className="mt-2" style={{ width: "80px" }}> Party </Label>
                                            <Col sm={8}>
                                                <Select
                                                    name="Customer"
                                                    value={values.Party}
                                                    isSearchable={true}
                                                    isDisabled={GoButton.length > 0 ? true : false}
                                                    id={'customerselect'}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={venderOptions}
                                                    onChange={partyOnChange}
                                                />
                                                {isError.Party.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.Party}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                    <Col sm={3}>
                                        <FormGroup className="row mt-2 mb-3 ">
                                            <Label className="mt-2" style={{ width: "80px" }}> Item </Label>
                                            <Col sm={8} >
                                                <Select
                                                    name="Item"
                                                    value={values.Item}
                                                    isSearchable={true}
                                                    id={'customerselect'}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={ItemsOption}
                                                    onChange={itemOnChange}

                                                />
                                                {isError.Item.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.Item}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                    <Col sm={2} className="mt-2">
                                        {pageMode === mode.defaultsave ?
                                            (GoButton.length === 0) ?
                                                < Go_Button onClick={(e) => goButtonHandler()} />
                                                :
                                                <Change_Button onClick={(e) => dispatch(GoButtonForChallanAddSuccess([]))} />
                                            : null
                                        }
                                    </Col>
                                </Col>
                            </Row>
                        </Col>
                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField={"id"}
                                    data={GoButton}
                                    columns={pagesListColumns}
                                    search
                                >
                                    {(toolkitProps) => (
                                        <React.Fragment>
                                            <Row>
                                                <Col xl="12">
                                                    <div className="table-responsive">
                                                        <BootstrapTable
                                                            keyField={"id"}
                                                            id="table_Arrow"
                                                            responsive
                                                            bordered={false}
                                                            striped={false}
                                                            classes={"table  table-bordered"}
                                                            noDataIndication={
                                                                <div className="text-danger text-center ">
                                                                    Items Not available
                                                                </div>
                                                            }
                                                            {...toolkitProps.baseProps}
                                                            {...paginationTableProps}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="align-items-md-center mt-30">
                                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                    <PaginationListStandalone {...paginationProps} />
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    )}
                                </ToolkitProvider>
                            )}

                        </PaginationProvider>

                        {GoButton.length > 0 &&
                            <SaveButtonDraggable>
                                <SaveButton pageMode={pageMode}
                                    onClick={saveHandeller}
                                    id={saveBtnid}
                                    userAcc={userPageAccessState}
                                />
                            </SaveButtonDraggable>}
                    </form>
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default Challan;
