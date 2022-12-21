import React, { useEffect, useMemo, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb3"
import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr"
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { WORK_ORDER_LIST } from "../../../routes/route_url";
import { createdBy, currentDate, saveDissable, userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { editWorkOrderListSuccess, getBOMList, postGoButtonForWorkOrder_Master, postGoButtonForWorkOrder_MasterSuccess, postWorkOrderMaster, postWorkOrderMasterSuccess, updateWorkOrderList, updateWorkOrderListSuccess } from "../../../store/Purchase/WorkOrder/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import '../../Order/div.css'
const WorkOrder = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const formRef = useRef(null);
    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [itemselect, setItemselect] = useState("")

    const fileds = {
        id: "",
        WorkOrderDate: '',
        ItemName: [],
        NumberOfLot: "",
        Quantity: "",
        StockQuantity: "",
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

    useEffect(() => {
        dispatch(postGoButtonForWorkOrder_MasterSuccess([]))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(72))

    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

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
            setUserPageAccessState(userAcc)
        };
    }, [userAccess])

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
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
                debugger
                setEditData(hasEditVal);
                const { id, WorkOrderDate, Item, ItemName, NumberOfLot, EstimatedOutputQty, Quantity } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.id.valid = true;
                hasValid.WorkOrderDate.valid = true;
                hasValid.ItemName.valid = true;
                hasValid.EstimatedOutputQty.valid = true;
                hasValid.NumberOfLot.valid = true;
                hasValid.Quantity.valid = true;

                values.id = id
                values.WorkOrderDate = WorkOrderDate;
                values.EstimatedOutputQty = EstimatedOutputQty;
                values.NumberOfLot = NumberOfLot;
                values.Quantity = Quantity;
                values.ItemName = { label: ItemName, value: Item };

                const jsonBody = JSON.stringify({
                    Item: hasEditVal.Item,
                    Bom: hasEditVal.Bom,
                    Quantity: parseInt(hasEditVal.Quantity)
                });
                dispatch(postGoButtonForWorkOrder_Master(jsonBody));
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(editWorkOrderListSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
            }
        }
    }, [])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postWorkOrderMasterSuccess({ Status: false }))
            // setState(() => initialFiledFunc(fileds)) //+++++++++ Clear form values 
            // saveDissable(false);//+++++++++save Button Is enable function
            if (pageMode === "dropdownAdd") {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: WORK_ORDER_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            // saveDissable(false);//+++++++++save Button Is enable function
            dispatch(postWorkOrderMasterSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            // saveDissable(false);//+++++++++Update Button Is enable function
            // setState(() => initialFiledFunc(fileds)) //+++++++++ Clear form values
            history.push({
                pathname: WORK_ORDER_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            // saveDissable(false);//+++++++++Update Button Is enable function
            // dispatch(updateWorkOrderListSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })// new change
        }
    }, [pageField])

    let filterItems = Items.filter((index) => {
        debugger
        return index.IsActive === true
    })

    const ItemDropdown_Options = filterItems.map((index) => ({
        value: index.id,
        label: index.ItemName,
        ItemID: index.Item,
        Unit: index.Unit,
        UnitName: index.UnitName,
        EstimatedOutputQty: index.EstimatedOutputQty,
        StockQty: index.StockQty
    }));


    useEffect(() => {

        const jsonBody = JSON.stringify({
            FromDate: "2022-12-01",
            ToDate: currentDate,
            Company: userCompany(),
        });
        dispatch(getBOMList(jsonBody));
    }, [])

    function ItemOnchange(e) {
        debugger
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
        debugger
        dispatch(postGoButtonForWorkOrder_MasterSuccess([]))
        let qty = ''
        if (pageMode === "edit") {
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
                i.values.NumberOfLot = "1.000000";
                i.values.Quantity = e;
                i.hasValid.NumberOfLot.valid = true;
                i.hasValid.Quantity.valid = true;
                return i
            })
        }
    }

    const goButtonHandler = (event) => {
        debugger

        event.preventDefault();
        if (formValid(state, setState)) {

            const jsonBody = JSON.stringify({
                Item: (pageMode === "edit" ? EditData.Item : values.ItemName.ItemID),
                Bom: (pageMode === "edit" ? EditData.Bom : values.ItemName.value),
                Quantity: parseInt(values.Quantity)
            });
            dispatch(postGoButtonForWorkOrder_Master(jsonBody));
        }
    }

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const formSubmitHandler = (event) => {

        const WorkOrderItems = BOMItems.map((index) => ({
            Item: index.Item,
            Unit: index.Unit,
            BomQuantity: index.BomQuantity,
            Quantity: index.Quantity,
        }))

        event.preventDefault();
        if (formValid(state, setState)) {

            const jsonBody = JSON.stringify({
                WorkOrderDate: values.WorkOrderDate,
                Item: (pageMode === "edit" ? Item : values.ItemName.ItemID),
                Bom: (pageMode === "edit" ? id : values.ItemName.value),
                Unit: (pageMode === "edit" ? Unit : values.ItemName.Unit),
                NumberOfLot: values.NumberOfLot,
                Quantity: values.Quantity,
                Company: userCompany(),
                Party: userParty(),
                CreatedBy: createdBy(),
                UpdatedBy: createdBy(),
                WorkOrderItems: WorkOrderItems
            });

            // saveDissable(true);//+++++++++save Button Is dissable function

            if (pageMode === 'edit') {

                dispatch(updateWorkOrderList(jsonBody, EditData.id));
                console.log("update jsonBody", jsonBody)
            }
            else {
                dispatch(postWorkOrderMaster(jsonBody));
                console.log("post jsonBody", jsonBody)
            }

        }
    };

    const QuantityHandler = (e, user) => {
        user["CurrentMRP"] = e.target.value
    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            sort: true,
        },
        {
            text: "Stock Quantity",
            dataField: "StockQuantity",
            sort: true,
        },
        {
            text: "BomQuantity",
            dataField: "BomQuantity",
            sort: true,
        },
        {
            text: "Quantity",
            dataField: "Quantity",
            sort: true,
            formatter: (cellContent, user) => (
                <>
                    <div style={{ justifyContent: 'center' }} >

                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    id=""
                                    type="text"
                                    disabled={true}
                                    defaultValue={cellContent.toPrecision(10)}
                                    className="col col-sm text-center"
                                    onChange={(e) => QuantityHandler(e, user)}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                    {console.log("user", cellContent)}
                    {console.log(cellContent.toPrecision(5))}
                </>
            ),
        },
        {

            text: "UnitName",
            dataField: "UnitName",
            sort: true,
        },

    ]

    const pageOptions = {
        sizePerPage: 10,
        totalSize: GoButton.length,
        custom: true,
    };

    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>

                <MetaTags>
                    <title>GroupTypeMaster | FoodERP-React FrontEnd</title>
                </MetaTags>
                <div className="page-content" style={{ marginTop: "-0.4cm" }}>

                    <Breadcrumb pageHeading={userPageAccessState.PageHeading} />

                    <form onSubmit={formSubmitHandler} noValidate>
                        <div className="px-2 mb-1 mt-n3 c_card_filter text-black" >

                            <div className="row">
                                <div className="col col-6">
                                    <FormGroup className=" row  mt-3" >
                                        <Label className="   p-2"
                                            style={{ width: "115px" }}>{fieldLabel.WorkOrderDate}</Label>
                                        <div className="col-6">
                                            <Flatpickr
                                                style={{ userselect: "all" }}
                                                name="WorkOrderDate"
                                                value={values.WorkOrderDate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="0,''"
                                                disabled={pageMode === "edit" ? true : false}
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                    defaultDate: pageMode === "edit" ? values.WorkOrderDate : "today"
                                                }}
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
                                    <FormGroup className=" row mt-3 " >
                                        <Label className=" p-2"
                                            style={{ width: "130px" }}>{fieldLabel.ItemName} </Label>
                                        <div className="col col-6 sm-1">
                                            <Select
                                                name="ItemName"
                                                value={values.ItemName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ItemDropdown_Options}
                                                // isDisabled={pageMode === "edit" ? true : false}
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

                            <div className="row  ">
                                <div className="col col-6">
                                    <FormGroup className="mb-2 row  " >
                                        <Label className=" p-2"
                                            style={{ width: "115px" }}>{fieldLabel.StockQuantity}:</Label>
                                        <Label className=" p-2" style={{ color: "#000000", width: "130px" }}
                                        >&nbsp;&nbsp;
                                            {pageMode === "edit" ? EditData.Stock : itemselect.StockQty}
                                            &nbsp;&nbsp; &nbsp;</Label>
                                    </FormGroup>
                                </div >
                                <div className="col col-6">
                                    <FormGroup className="mb-2 row " >
                                        <Label className=" p-2"
                                            style={{ width: "130px" }}>{fieldLabel.EstimatedOutputQty} :</Label>

                                        <Label
                                            className="p-2 "
                                            style={{ color: "#000000", width: "130px" }}>&nbsp;&nbsp;
                                            {pageMode === "edit" ? EditData.EstimatedOutputQty : itemselect.EstimatedOutputQty}
                                            &nbsp;&nbsp;(1 lot)
                                        </Label>

                                    </FormGroup>
                                </div >

                            </div>

                            <div className="row  ">
                                <div className="col col-6">
                                    <FormGroup className="mb-2 row  " >
                                        <Label className=" p-2"
                                            style={{ width: "115px" }}>{fieldLabel.NumberOfLot}</Label>
                                        <div className="col col-6">
                                            <Input
                                                name="NumberOfLot"
                                                value={values.NumberOfLot}
                                                // defaultValue={itemselect.EstimatedOutputQty}
                                                // disabled={pageMode === "edit" ? true : false}
                                                type="text"
                                                className={isError.NumberOfLot.length > 0 ? "is-invalid form-control" : "form-control"}
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
                                    <FormGroup className="mb-2 row " >
                                        <Label className=" p-2"
                                            style={{ width: "130px" }}>{fieldLabel.Quantity}</Label>
                                        <div className="col col-6">
                                            <Input
                                                name="Quantity"
                                                value={values.Quantity}
                                                // defaultValue={itemselect.EstimatedOutputQty}
                                                type="text"
                                                className={isError.Quantity.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Quantity"
                                                autoComplete='off'
                                                // disabled={pageMode === "edit" ? true : false}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                    Quantitychange(event.target.value)
                                                }}
                                            />
                                            {isError.Quantity.length > 0 && (
                                                <span className="invalid-feedback">{isError.Quantity}</span>
                                            )}
                                        </div>
                                        <div className="col col-2">
                                            <Label style={{ marginTop: '5px' }}>
                                                {pageMode === "edit" ? EditData.UnitName : itemselect.UnitName}</Label>
                                        </div>
                                        <div className="col col-1">
                                            <Button
                                                color="btn btn-outline-success border-2 font-size-12 " style={{ marginTop: '3px' }}
                                                onClick={(e) => goButtonHandler(e)}
                                            >Go</Button>
                                        </div>

                                    </FormGroup>


                                </div >

                            </div>

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
                                                                responsive
                                                                bordered={false}
                                                                striped={false}
                                                                // defaultSorted={defaultSorted}
                                                                classes={"table  table-bordered"}
                                                                // noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                                                                {...toolkitProps.baseProps}
                                                                {...paginationTableProps}
                                                            />
                                                            <div>
                                                                <label >EstimatedOutputQty :&nbsp;&nbsp; <span style={{ color: "#000000" }}>{EstimatedOutputQty}</span></label>
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



                        {BOMItems.length > 0 ? <FormGroup className="mt-3">
                            <Row >
                                <Col sm={2} >
                                    <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
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