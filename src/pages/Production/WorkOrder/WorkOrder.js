import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import {  commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Change_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    loginUserID,
    currentDate_ymd,
    loginCompanyID,
    loginPartyID,
    btnIsDissablefunc,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import {
    editWorkOrderListSuccess,
    getBOMList,
    postGoButtonForWorkOrder_Master,
    postGoButtonForWorkOrder_MasterSuccess,
    SaveWorkOrderMaster,
    SaveWorkOrderMasterSuccess,
    updateWorkOrderList,
} from "../../../store/Production/WorkOrder/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import * as pageId from "../../../routes//allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_DatePicker } from "../../../CustomValidateForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const goBtnID1 = "workOrdergoBtnID1"
const changeBtnID1 = "workOrderchangeBtnID1"
const saveBtnID1 = "workOrdersaveBtnID1"
const updateBtnID1 = "workOrderupdateBtnID1"

const WorkOrder = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [itemselect, setItemselect] = useState("")

    const fileds = {
        id: "",
        WorkOrderDate: '',
        ItemName: [],
        NumberOfLot: "",
        Quantity: "",
        StockQuantity: "0",
        EstimatedOutputQty: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        Items,
        GoButton
    } = useSelector((state) => ({
        postMsg: state.WorkOrderReducer.postMsg,
        updateMsg: state.WorkOrderReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        GetItemUnits: state.BOMReducer.GetItemUnits,
        Items: state.WorkOrderReducer.BOMList,
        GoButton: state.WorkOrderReducer.GoButton
    }));

    const { BOMItems = [], EstimatedOutputQty = '', id = '', Item = '', Unit = '' } = GoButton

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        const page_Id = pageId.WORK_ORDER
        dispatch(postGoButtonForWorkOrder_MasterSuccess([]))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))

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
            breadcrumbReturnFunc({ dispatch, userAcc });

        };
    }, [userAccess])

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
                setEditData(hasEditVal);
                const { id, WorkOrderDate, Item, ItemName, NumberOfLot, Stock
                    , Quantity, EstimatedOutputQty, Bom, Party } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                hasValid.id.valid = true;
                hasValid.WorkOrderDate.valid = true;
                hasValid.EstimatedOutputQty.valid = true;
                hasValid.Quantity.valid = true;
                hasValid.NumberOfLot.valid = true;
                hasValid.ItemName.valid = true;

                values.id = id
                values.WorkOrderDate = WorkOrderDate;
                values.EstimatedOutputQty = EstimatedOutputQty;
                values.Quantity = Quantity;
                values.NumberOfLot = NumberOfLot;
                values.StockQuantity = Stock;
                values.ItemName = { label: ItemName, value: Item };

                const jsonBody = JSON.stringify({
                    Item: Item,
                    Bom: Bom,
                    Quantity: parseFloat(Quantity),
                    Party: Party
                });
                dispatch(postGoButtonForWorkOrder_Master(jsonBody));

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(editWorkOrderListSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
            }
        }
    }, [])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SaveWorkOrderMasterSuccess({ Status: false }))
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
                    history.push({ pathname: url.WORK_ORDER_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(SaveWorkOrderMasterSuccess({ Status: false }))
            dispatch(customAlert({
                Type: 4,
                 Message: JSON.stringify(postMsg.Message),
            })
            )
        }
    }, [postMsg])

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [BOMItems]);

    useEffect(() => {

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            // setState(() => resetFunction(fileds, state))// Clear form values  
            history.push({
                pathname: url.WORK_ORDER_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
             customAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    let filterItems = Items.filter((index) => {
        return index.IsActive === true
    })

    useEffect(() => {
        const jsonBody = JSON.stringify({
            FromDate: "2022-12-01",
            ToDate: currentDate_ymd,
            Company: loginCompanyID(),
            Party: loginPartyID()
        });
        dispatch(getBOMList(jsonBody));
    }, [])

    const ItemDropdown_Options = filterItems.map((index) => ({
        value: index.id,
        label: index.ItemName,
        ItemID: index.Item,
        Unit: index.Unit,
        UnitName: index.UnitName,
        EstimatedOutputQty: index.EstimatedOutputQty,
        StockQty: index.StockQty
    }));

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
        },
        {
            text: "Stock Quantity",
            dataField: "StockQuantity",
        },
        {
            text: "BomQuantity",
            dataField: "BomQuantity",
        },
        {
            text: "Quantity",
            dataField: "Quantity",

            formatter: (cellContent, user) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    id=""
                                    type="text"
                                    // disabled={true}
                                    // defaultValue={cellContent.toPrecision(5)}
                                    defaultValue={parseFloat(cellContent).toFixed(3)}
                                    className="col col-sm text-center"
                                    onChange={(e) => QuantityHandler(e, user)}
                                />
                            </FormGroup>
                        </Col>
                    </div>

                </>
            ),
        },
        {
            text: "UnitName",
            dataField: "UnitName",

        },
    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: GoButton.length,
        custom: true,
    };

    const QuantityHandler = (event, user) => {

        // user["Quantity"] = event.target.value
        let val = event.target.value;
        const result = /^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/.test(val);
        if ((result) && (parseFloat(event.target.value).toFixed(3))) {
            user.Quantity = event.target.value;
        }
        else if (val === "") {
            user.Quantity = event.target.value;
        }
        else {
            event.target.value = user.Quantity
        }

    }

    function ItemOnchange(e) {
        dispatch(postGoButtonForWorkOrder_MasterSuccess([]))
        setItemselect(e)
        setState((i) => {
            i.values.NumberOfLot = "1";
            i.values.Quantity = e.EstimatedOutputQty;
            i.hasValid.NumberOfLot.valid = true;
            i.hasValid.Quantity.valid = true;
            return i
        })
    }

    function NumberOfLotchange(e) {

        dispatch(postGoButtonForWorkOrder_MasterSuccess([]))
        let qty = ''
        if (pageMode === mode.edit) {
            qty = e * EditData.EstimatedOutputQty;
        }
        else {
            qty = e * itemselect.EstimatedOutputQty
        }
        setState((i) => {
            i.values.NumberOfLot = e;
            i.values.Quantity = qty;
            i.hasValid.NumberOfLot.valid = true;
            i.hasValid.Quantity.valid = true;
            return i
        })
    }

    function Quantitychange(e) {
        dispatch(postGoButtonForWorkOrder_MasterSuccess([]))
        state.hasValid.Quantity.valid = true
        let NumberLot = e / itemselect.EstimatedOutputQty
        if (Number.isInteger(NumberLot)) {
            setState((i) => {
                i.values.NumberOfLot = NumberLot;
                i.values.Quantity = e;
                i.hasValid.NumberOfLot.valid = true;
                i.hasValid.Quantity.valid = true;
                return i
            })
        }
        else {
            setState((i) => {
                i.values.NumberOfLot = "1.000";
                i.values.Quantity = e;
                i.hasValid.NumberOfLot.valid = true;
                i.hasValid.Quantity.valid = true;
                return i
            })
        }
    }

    const goButtonHandler = (event) => {

        const jsonBody = JSON.stringify({
            Item: (pageMode === mode.edit ? EditData.Item : values.ItemName.ItemID),
            Bom: (pageMode === mode.edit ? EditData.Bom : values.ItemName.value),
            Quantity: parseFloat(values.Quantity),
            Party: loginPartyID()
        });
        dispatch(postGoButtonForWorkOrder_Master(jsonBody, goBtnID1));
    }

    const SaveHandler = async (event) => {
        
        event.preventDefault();
        const btnId = event.target.id
        try {
             {
                btnIsDissablefunc({ btnId, state: true })
                const WorkOrderItems = BOMItems.map((index) => ({
                    Item: index.Item,
                    Unit: index.Unit,
                    BomQuantity: index.BomQuantity,
                    Quantity: index.Quantity,
                }))
                const jsonBody = JSON.stringify({
                    WorkOrderDate: values.WorkOrderDate,
                    Item: (pageMode === mode.edit ? Item : values.ItemName.ItemID),
                    Bom: (pageMode === mode.edit ? id : values.ItemName.value),
                    Unit: (pageMode === mode.edit ? Unit : values.ItemName.Unit),
                    NumberOfLot: values.NumberOfLot,
                    Quantity: parseFloat(values.Quantity).toFixed(3),
                    Company: loginCompanyID(),
                    Party: loginPartyID(),
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    WorkOrderItems: WorkOrderItems
                });
                if (pageMode === mode.edit) {
                    dispatch(updateWorkOrderList({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    
                    dispatch(SaveWorkOrderMaster({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    
    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginBottom: "200px" }}>
                    <form  noValidate>
                        <div className="px-2 mb-1 c_card_filter text-black" >
                            <Row>
                                <Col sm={11}>
                                    <div className="row">
                                        <div className="col col-6">
                                            <FormGroup className=" row  mt-2" >
                                                <Label className="mt-1"
                                                    style={{ width: "130px" }}>{fieldLabel.WorkOrderDate}</Label>
                                                <div className="col-6">
                                                    <C_DatePicker
                                                        style={{ userselect: "all" }}
                                                        name="WorkOrderDate"
                                                        value={values.WorkOrderDate}
                                                        disabled={(BOMItems.length > 0) || (pageMode === mode.edit) ? true : false}
                                                        onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                        onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                    />
                                                    {isError.WorkOrderDate.length > 0 && (
                                                        <span className="invalid-feedback">{isError.WorkOrderDate}</span>
                                                    )}
                                                </div>
                                            </FormGroup>
                                        </div >
                                        <div className="col col-6" >
                                            <FormGroup className=" row  mt-2" >
                                                <Label className="mt-1"
                                                    style={{ width: "150px" }}>{fieldLabel.ItemName} </Label>
                                                <div className="col col-6 sm-1">
                                                    <Select
                                                        name="ItemName"
                                                        value={values.ItemName}
                                                        isSearchable={true}
                                                        isDisabled={(BOMItems.length > 0) ? true : false}
                                                        className="react-dropdown"
                                                        classNamePrefix="dropdown"
                                                        options={ItemDropdown_Options}
                                                        onChange={(hasSelect, evn) => {
                                                            onChangeSelect({ hasSelect, evn, state, setState });
                                                            ItemOnchange(hasSelect)
                                                            dispatch(Breadcrumb_inputName(hasSelect.label))
                                                        }
                                                        }
                                                    />
                                                    {isError.ItemName.length > 0 && (
                                                        <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                                    )}
                                                </div>
                                            </FormGroup>
                                        </div >
                                    </div>

                                    <div className="row">
                                        <div className="col col-6">
                                            <FormGroup className=" row mt-1" >
                                                <Label className="mt-1"
                                                    style={{ width: "130px" }}>{fieldLabel.StockQuantity}
                                                </Label>
                                                <div className="col-6 ">
                                                    <Input
                                                        value={pageMode === mode.edit ?
                                                            EditData.Stock : itemselect.StockQty
                                                        }
                                                        disabled={true}
                                                        className="text-end"
                                                    // placeholder="Please Enter Stock Quantity"
                                                    />
                                                </div>
                                                <div className="col col-2">
                                                    <Label style={{ marginTop: '5px', width: "72px", marginLeft: '-15px' }}>
                                                        {pageMode === mode.edit ? EditData.UnitName : itemselect.UnitName}</Label>
                                                </div>
                                            </FormGroup>
                                        </div >

                                        <div className="col col-6" >
                                            <FormGroup className=" row mt-1" >
                                                <Label className="mt-1"
                                                    style={{ width: "150px" }}>
                                                    {fieldLabel.EstimatedOutputQty}
                                                </Label>
                                                <div className="col-6">
                                                    <Input
                                                        value={pageMode === mode.edit ?
                                                            EditData.EstimatedOutputQty : itemselect.EstimatedOutputQty ?
                                                                itemselect.EstimatedOutputQty : ""}
                                                        disabled={true}
                                                        className="text-end"
                                                        // placeholder="Please Enter Estimated Output Qty"
                                                        autoComplete='off'
                                                    />
                                                </div>
                                                <div className="col col-1">
                                                    <Label style={{ marginTop: '7px', width: "72px", marginLeft: '-23px' }}>
                                                        {pageMode === mode.edit ? EditData.UnitName : itemselect.UnitName}</Label>
                                                </div>
                                            </FormGroup>


                                        </div >

                                    </div>

                                    <div className="row  ">
                                        <div className="col col-6">
                                            <FormGroup className=" row  mt-1 mb-2 " >
                                                <Label className="mt-1"
                                                    style={{ width: "130px" }}>{fieldLabel.NumberOfLot}</Label>
                                                <div className="col col-6">
                                                    <Input
                                                        name="NumberOfLot"
                                                        value={values.NumberOfLot}
                                                        type="text"
                                                        disabled={(BOMItems.length > 0) ? true : false}
                                                        className={isError.NumberOfLot.length > 0 ? "is-invalid form-control text-end" : "form-control text-end"}
                                                        placeholder="Please Enter Number Of Lot"
                                                        autoComplete='off'
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                            NumberOfLotchange(event.target.value)
                                                        }}
                                                    />
                                                    {isError.NumberOfLot.length > 0 && (
                                                        <span className="invalid-feedback">{isError.NumberOfLot}</span>
                                                    )}
                                                </div>
                                            </FormGroup>
                                        </div >

                                        <div className="col col-6">
                                            <FormGroup className=" row mt-1 mb-2" >
                                                <Label className="mt-1"
                                                    style={{ width: "150px" }}>{fieldLabel.Quantity}</Label>
                                                <div className="col col-6 ">
                                                    <Input
                                                        style={{ textAlign: "right" }}
                                                        name="Quantity"
                                                        value={`${values.Quantity}`}
                                                        disabled={(BOMItems.length > 0) ? true : false}
                                                        type="text"
                                                        className={isError.Quantity.length > 0 ? "is-invalid form-control text-end" : "form-control text-end"}
                                                        placeholder="Please Enter Quantity"
                                                        autoComplete='off'
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                            Quantitychange(event.target.value)
                                                        }}

                                                    />
                                                    {isError.Quantity.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Quantity}</span>
                                                    )}
                                                </div>
                                                <div className="col col-1">
                                                    <Label style={{ marginTop: '7px', width: "72px", marginLeft: '-23px' }}>
                                                        {pageMode === mode.edit ? EditData.UnitName : itemselect.UnitName}</Label>
                                                </div>
                                                {/* <div className="col col-1">
                                            <Button
                                                color="btn btn-outline-success border-2 font-size-12 " style={{ marginTop: '3px' }}
                                                onClick={(e) => goButtonHandler(e)}
                                            >Go</Button>
                                        </div> */}

                                            </FormGroup>
                                        </div >
                                    </div>
                                </Col>

                                <Col sm={1}>
                                    <div className="col col-1 mt-2">
                                        {pageMode === mode.defaultsave ?
                                            (BOMItems.length === 0) ?
                                                < Go_Button id={goBtnID1} onClick={(e) => goButtonHandler()} />
                                                :
                                                <Change_Button id={changeBtnID1}
                                                    onClick={(e) => dispatch(postGoButtonForWorkOrder_MasterSuccess([]))} />
                                            : null
                                        }
                                    </div>
                                </Col>

                            </Row>
                        </div>

                        {BOMItems.length > 0 ?
                            <PaginationProvider pagination={paginationFactory(pageOptions)}>
                                {({ paginationProps, paginationTableProps }) => (
                                    <ToolkitProvider
                                        keyField={"id"}
                                        data={BOMItems}
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
                                                                {...toolkitProps.baseProps}
                                                                {...paginationTableProps}
                                                            />
                                                            {countlabelFunc(toolkitProps, paginationProps, dispatch, "WorkOrder")}
                                                            {globalTableSearchProps(toolkitProps.searchProps, pageField.id)}
                                                            <div>
                                                                <label >EstimatedOutputQty :&nbsp;&nbsp;
                                                                    <span style={{ color: "#000000" }}>
                                                                        {`${EstimatedOutputQty} ${pageMode === mode.edit ? EditData.UnitName : itemselect.UnitName}`}
                                                                    </span>
                                                                </label>
                                                            </div>
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
                            : <></>}

                        {BOMItems.length > 0 ? <FormGroup style={{ marginTop: "-25px" }}>
                            <Row >
                                <Col sm={2} className="mt-n4">
                                    <SaveButton pageMode={pageMode}
                                        onClick={SaveHandler}
                                        userAcc={userPageAccessState}
                                        module={"WorkOrder"}
                                    />
                                </Col>
                            </Row>
                        </FormGroup >
                            : null
                        }

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

export default WorkOrder