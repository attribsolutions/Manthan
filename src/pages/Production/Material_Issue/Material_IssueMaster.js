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
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    resetFunction,
} from "../../../components/Common/validationFunction";
import { Change_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import { saveBOMMasterSuccess } from "../../../store/Production/BOMRedux/action";
import {
    editMaterialIssueIdSuccess,
    goButtonForMaterialIssue_Master_Action,
    goButtonForMaterialIssue_Master_ActionSuccess,
    saveMaterialIssue, SaveMaterialIssueSuccess
} from "../../../store/Production/Matrial_Issue/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import { mode, pageId, url } from "../../../routes/index";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { CInput, C_DatePicker, decimalRegx, onlyNumberRegx } from "../../../CustomValidateForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { Qty_Distribution_Func, updateWorkOrderQuantity_By_Lot } from "./DistributionFunc";
import Select, { components } from "react-select";

const MaterialIssueMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        MaterialIssueDate: currentDate_ymd,
        ItemName: "",
        NumberOfLot: 0,
        LotQuantity: 0,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [Itemselect, setItemselect] = useState([])
    const [Itemselectonchange, setItemselectonchange] = useState("");
    const [goButtonList, setGoButtonList] = useState([]);
    const [originalQty, setOriginalQty] = useState([]);

    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [noOfLotForDistribution, setNoOfLotForDistribution] = useState(0);

    const [changeButtonEnable, setChangeButtonEnable] = useState(false);

    const {
        postMsg,
        pageField,
        userAccess,
        Items,
        GoButton = [],
        saveBtnloading
    } = useSelector((state) => ({
        saveBtnloading: state.MaterialIssueReducer.saveBtnloading,
        postMsg: state.MaterialIssueReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Items: state.WorkOrderReducer.WorkOrderList,
        GoButton: state.MaterialIssueReducer.GoButton
    }));

    const { Data = [] } = GoButton

    useEffect(() => {
        const page_Id = pageId.MATERIAL_ISSUE
        dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    const location = { ...history.location }

    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

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

        if ((GoButton.Status === true) && (GoButton.StatusCode === 200)) {

            setPageMode(GoButton.pageMode)
            const { ListData, Data } = GoButton

            if (GoButton.goButtonCallByMode) {
                const { id, Item, ItemName, Unit, Quantity, NumberOfLot, Bom, RemaningQty } = ListData;

                setState((i) => {
                    i.values.MaterialIssueDate = currentDate_ymd
                    i.values.ItemName = { value: id, label: ItemName, Item: Item, NoLot: NumberOfLot, lotQty: Quantity };
                    i.values.NumberOfLot = NumberOfLot;
                    i.values.LotQuantity = Quantity;
                    i.hasValid.ItemName.valid = true;
                    i.hasValid.MaterialIssueDate.valid = true;
                    i.hasValid.NumberOfLot.valid = true;
                    i.hasValid.LotQuantity.valid = true;
                    return i
                })
                setItemselect({ Item: Item, Unit: Unit, id: id, Bom: Bom, Quantity: Quantity })
                setNoOfLotForDistribution(NumberOfLot)
                const Qty_Distribution_data = Qty_Distribution_Func(Data);
                setOriginalQty(RemaningQty)

                setGoButtonList(Qty_Distribution_data)
            }
            else {
                if (changeButtonEnable) {

                    const updatedWorkOrderData = updateWorkOrderQuantity_By_Lot(Data, values.NumberOfLot, noOfLotForDistribution, originalQty);
                    setGoButtonList(updatedWorkOrderData)
                }
            }
        }
    }, [GoButton])

    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            let insidePageMode = null
            if (hasShowloction) {
                insidePageMode = location.pageMode;
                setPageMode(location.pageMode)
                hasEditVal = location[mode.editValue]
            }
            else if (hasShowModal) {
                hasEditVal = props[mode.editValue]
                insidePageMode = props.pageMode;
                setPageMode(props.pageMode)
            }

            if (hasEditVal) {

                setItemselect(hasEditVal)
                const { id, Item, ItemName, LotQuantity, NumberOfLot, MaterialIssueItems = [] } = hasEditVal
                setState((i) => {
                    i.values.MaterialIssueDate = currentDate_ymd
                    i.values.ItemName = { value: id, label: ItemName, Item: Item, NoLot: NumberOfLot, lotQty: LotQuantity };
                    i.values.NumberOfLot = NumberOfLot;
                    i.values.LotQuantity = LotQuantity;
                    i.hasValid.ItemName.valid = true;
                    i.hasValid.MaterialIssueDate.valid = true;
                    i.hasValid.NumberOfLot.valid = true;
                    i.hasValid.LotQuantity.valid = true;
                    return i
                })
                // ++++++++++++++++++++++++++**Dynamic go Button API Call method+++++++++++++++++

                if (insidePageMode === mode.view) {

                    dispatch(goButtonForMaterialIssue_Master_ActionSuccess(MaterialIssueItems))
                    const newArray = MaterialIssueItems.map((i) => ({
                        ...i,
                        Quantity: i.WorkOrderQuantity,
                        OriginalWorkOrderQty: i.WorkOrderQuantity
                    }))
                    setGoButtonList(newArray)
                }
                seteditCreatedBy(hasEditVal.CreatedBy)
                dispatch(editMaterialIssueIdSuccess({ Status: false }))
            }
        }
    }, [])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SaveMaterialIssueSuccess({ Status: false }))
            dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
            dispatch(saveBOMMasterSuccess({ Status: false }));
            setState(() => resetFunction(fileds, state))// Clear form values  
            setGoButtonList([])
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
                    history.push({ pathname: url.MATERIAL_ISSUE_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {

            dispatch(SaveMaterialIssueSuccess({ Status: false }))
            dispatch(saveBOMMasterSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField]);

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [goButtonList]);

    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.ItemName,
        ItemName: index.ItemName,
        Quantity: index.RemaningQty,
        Item: index.Item,
        BomID: index.Bom,
        Unit: index.Unit,
        NumberOfLot: index.RemainingLot,
        WorkDate: index.WorkDate
    }));

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            formatter: (cellContent, user) => {
                return (
                    <>
                        <div><samp id={`ItemName${user.id}`}>{cellContent}</samp></div>
                        <div><samp id={`ItemNameMsg${user.id}`} style={{ color: "red" }}></samp></div>
                    </>

                )
            },
            style: (cellContent, user,) => {

                let Stock = user.BatchesData.map((index) => {
                    return index.ObatchwiseQuantity
                })
                var TotalStock = 0;
                Stock.forEach(x => {
                    TotalStock += parseFloat(x);
                });
                var OrderQty = parseFloat(user.Quantity)
                if (OrderQty > TotalStock) {
                    return {
                        color: "red",

                    };
                }
            },
        },
        {
            text: "Original Work Order Qty",
            dataField: "OriginalWorkOrderQty",
        },
        {
            text: "Work Order Qty",
            dataField: "Quantity",
        },
        {
            text: "Unit",
            dataField: "UnitName",
        },
        {
            text: "Batch Code",
            dataField: "BatchesData",

            formatter: (cellContent, user) => {
                return (
                    <>
                        <Table className="table table-bordered table-responsive mb-1">
                            <Thead>
                                <tr>
                                    <th>Batch Code </th>
                                    <th>Supplier BatchCode</th>
                                    <th>Batch Date</th>
                                    <th>Stock Quantity</th>
                                    <th>Quantity</th>
                                </tr>
                            </Thead>
                            <Tbody>
                                {cellContent.map((index) => {

                                    return (
                                        < tr >
                                            <td>
                                                <div style={{ width: "170px" }}>
                                                    <Label>
                                                        {index.SystemBatchCode}
                                                    </Label>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "150px" }}>
                                                    <Label>
                                                        {index.BatchCode}
                                                    </Label>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "100px" }}>
                                                    <Label>
                                                        {_cfunc.date_dmy_func(index.BatchDate)}
                                                    </Label>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "120px", textAlign: "right" }}>
                                                    <Label
                                                    >
                                                        {index.ObatchwiseQuantity}
                                                    </Label>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "150px" }}>
                                                    <CInput
                                                        type="text"
                                                        key={`stock${user.id}-${index.id}`}
                                                        disabled={pageMode === mode.view ? true : false}
                                                        id={`stock${user.id}-${index.id}`}
                                                        style={{ textAlign: "right" }}
                                                        cpattern={decimalRegx}
                                                        defaultValue={index.Qty}
                                                        autoComplete='off'
                                                        onChange={(event) => tableQuantityOnchangeHandler(event, user, index)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </>
                )
            }
        },

    ]

    const pageOptions = {
        sizePerPage: 10,
        totalSize: Data.length,
        custom: true,
    };

    function ItemOnchange(hasSelect, evn) {
        onChangeSelect({ hasSelect, evn, state, setState });
        dispatch(Breadcrumb_inputName(hasSelect.label))
        dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
        setState((i) => {
            i.values.ItemName = hasSelect
            i.values.NumberOfLot = hasSelect.NumberOfLot;
            i.values.LotQuantity = hasSelect.Quantity;
            i.hasValid.NumberOfLot.valid = true;
            i.hasValid.LotQuantity.valid = true;
            i.hasValid.MaterialIssueDate.valid = true;
            return i
        })
    }

    function goButtonHandler(event) {

        event.preventDefault();
        if (parseFloat(state.values.LotQuantity) === 0) {
            customAlert({
                Type: 3,
                Message: "Quantity Can Not be 0"
            })
        } else
            if (formValid(state, setState)) {
                const jsonBody = JSON.stringify({
                    WorkOrder: values.ItemName.value,
                    Item: values.ItemName.Item,
                    Company: _cfunc.loginCompanyID(),
                    Party: _cfunc.loginPartyID(),
                    Quantity: parseInt(values.LotQuantity),
                    NoOfLots: Number(values.NumberOfLot),

                });
                const body = { jsonBody, pageMode }
                dispatch(goButtonForMaterialIssue_Master_Action(body));
            }
    }

    function ItemOnchange(e) {
        dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
        setItemselectonchange(e)
        setState((i) => {
            i.values.ItemName = {
                value: e.value,
                label: e.label,
                Item: e.Item,
                NoLot: e.NumberOfLot,
                lotQty: e.Quantity
            };
            i.values.NumberOfLot = e.NumberOfLot;
            i.values.LotQuantity = e.Quantity;
            i.hasValid.NumberOfLot.valid = true;
            i.hasValid.LotQuantity.valid = true;
            i.hasValid.ItemName.valid = true;
            return i
        })
    }

    function Quantitychange(event) {

        dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
        let value1 = Math.max('', Math.min(Itemselectonchange.value > 0 ?
            Itemselectonchange.Quantity :
            Itemselect.Quantity, Number(event.target.value)));
        event.target.value = value1
        if (event.target.value === "NaN") {
            value1 = 0
        }
        setState((i) => {
            i.values.LotQuantity = value1
            // i.hasValid.NumberOfLot.valid = true;
            i.hasValid.LotQuantity.valid = true;
            return i
        })
    }

    function NumberOfLotchange(event) {

        let input = event.trim(); // Remove leading and trailing whitespace
        let defaultNoOfLot = parseFloat(noOfLotForDistribution);
        let remainingQuantity = 0

        if (input === "" || isNaN(input)) {
            input = 0;
        }

        if (parseFloat(input) > defaultNoOfLot) {
            input = defaultNoOfLot;
        }
        remainingQuantity = ((parseFloat(values.ItemName.lotQty) / defaultNoOfLot) * parseFloat(input)).toFixed(2)

        if (remainingQuantity === "" || isNaN(remainingQuantity)) {
            remainingQuantity = 0;
        }
        setState((i) => {
            let a = { ...i };
            a.values.NumberOfLot = input;
            a.hasValid.NumberOfLot.valid = true;
            a.values.LotQuantity = remainingQuantity;
            a.hasValid.LotQuantity.valid = true;
            return a;
        });
    }

    const tableQuantityOnchangeHandler = (event, index1, index2) => {

        let input = event.target.value.trim(); // Remove leading and trailing whitespace
        let ObatchwiseQuantity = parseFloat(index2.ObatchwiseQuantity);

        if (input === "" || isNaN(input)) {
            index2.Qty = 0;
        } else {
            if (parseFloat(input) > ObatchwiseQuantity) {
                event.target.value = ObatchwiseQuantity;
            }
            index2.Qty = input; // Assign the input value directly to Qty
        }
    };

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id
        const validMsg = []
        const materialIssueItems = []
        let ox = await goButtonList.map((index) => {

            var TotalStock = 0;
            index.BatchesData.map(i => {
                TotalStock += Number(i.ObatchwiseQuantity);
            });

            var OrderQty = Number(index.Quantity)
            if (OrderQty > TotalStock) {
                {
                    validMsg.push(`${index.ItemName}:Item is Out Of Stock`);
                };
            }
            let a = index["invalid"]
            if (a) {
                validMsg.push(`${index.ItemName}:${index["invalidMsg"]}`);
            };

            function batch(ele) {
                materialIssueItems.push({
                    Item: index.Item,
                    Unit: index.Unit,
                    WorkOrderQuantity: index.Quantity,
                    BatchCode: ele.BatchCode,
                    BatchDate: ele.BatchDate,
                    SystemBatchDate: ele.SystemBatchDate,
                    SystemBatchCode: ele.SystemBatchCode,
                    IssueQuantity: ele.Qty,
                    BatchID: ele.id,
                    LiveBatchID: ele.LiveBatchID
                })
            }
            index.BatchesData.map((ele) => {

                if (Number(ele.Qty) > 0) {
                    batch(ele)
                }
            })
        })
        try {
            if (formValid(state, setState)) {

                if (validMsg.length > 0) {
                    customAlert({
                        Type: 4,
                        Status: true,
                        Message: JSON.stringify(validMsg),
                        RedirectPath: false,
                        AfterResponseAction: false
                    })
                    return
                }
                _cfunc.btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    MaterialIssueDate: values.MaterialIssueDate,
                    NumberOfLot: Number(values.NumberOfLot),
                    LotQuantity: values.LotQuantity,
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                    Company: _cfunc.loginCompanyID(),
                    Party: _cfunc.loginPartyID(),
                    Item: Itemselect.Item,
                    Unit: Itemselect.Unit,
                    MaterialIssueItems: materialIssueItems,
                    MaterialIssueWorkOrder: [
                        {
                            WorkOrder: Itemselect.id,
                            Bom: Itemselect.Bom
                        }
                    ]
                }
                );
                dispatch(saveMaterialIssue({ jsonBody }));

            }
        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    const customOption = (props) => {

        const { innerProps, label, data } = props;

        return (
            <components.Option {...props}>
                <div {...innerProps}>
                    <div >Name:{data.ItemName}</div>
                    <div>No Of Lot:{data.NumberOfLot}</div>
                    <div>Quantity:{data.Quantity}</div>
                    <div>WorkDate:{_cfunc.date_dmy_func(data.WorkDate)}</div>
                </div>
            </components.Option>
        );
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >
                    <form >
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
                            <Row>
                                <Col className=" mt-1 row" sm={11} >
                                    <Col sm="6">
                                        <FormGroup className="row mt-2  ">
                                            <Label className="mt-1" style={{ width: "150px" }}>{fieldLabel.MaterialIssueDate} </Label>
                                            <Col sm="7">
                                                <C_DatePicker
                                                    name="MaterialIssueDate"
                                                    value={values.MaterialIssueDate}
                                                    onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                />
                                                {isError.MaterialIssueDate.length > 0 && (
                                                    <span className="invalid-feedback">{isError.MaterialIssueDate}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="row mt-2 ">
                                            <Label className="mt-2" style={{ width: "100px" }}> {fieldLabel.ItemName} </Label>
                                            <Col sm={7}>
                                                <Select
                                                    name="ItemName"
                                                    value={values.ItemName}
                                                    // isDisabled={Data.length > 0 ? true : false}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={ItemDropdown_Options}
                                                    components={{ Option: customOption }}
                                                    isDisabled={(goButtonList.length > 0) ? true : false}
                                                    onChange={ItemOnchange}
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                />
                                                {isError.ItemName.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                    <Col sm="6">
                                        <FormGroup className="mb-2 mt-2 row  " style={{ marginTop: "" }}>
                                            <Label className="mt-1" style={{ width: "150px" }}> {fieldLabel.NumberOfLot} </Label>
                                            <Col sm={7}>
                                                <CInput
                                                    style={{ textAlign: "right" }}
                                                    name="NumberOfLot"
                                                    cpattern={onlyNumberRegx}
                                                    value={values.NumberOfLot}
                                                    disabled={(goButtonList.length > 0) ? true : false}
                                                    type="text"
                                                    className={isError.NumberOfLot.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter Number Of Lots"
                                                    autoComplete='off'
                                                    onChange={(e) => NumberOfLotchange(e.target.value)}
                                                />

                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="mb-1 mt-2  row" >
                                            <Label className="mt-2" style={{ width: "100px" }}> {fieldLabel.LotQuantity} </Label>
                                            <Col sm={7}>
                                                <CInput
                                                    style={{ textAlign: "right" }}
                                                    name="LotQuantity"
                                                    value={values.LotQuantity}
                                                    // disabled={(goButtonList.length > 0) ? true : false}
                                                    type="text"
                                                    cpattern={decimalRegx}
                                                    disabled={true}
                                                    className={isError.LotQuantity.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter LotQuantity"
                                                    autoComplete='off'
                                                    onChange={Quantitychange}

                                                />
                                            </Col>
                                            <div className="col col-1">
                                                <Label style={{ marginTop: '7px', width: "72px", marginLeft: '-23px' }}>
                                                    {Itemselect.UnitName}
                                                </Label>
                                            </div>
                                        </FormGroup>
                                    </Col>

                                </Col>
                                <Col sm={1} className="mt-2">
                                    {!(pageMode === "view") && (goButtonList.length > 0) ? (
                                        <Change_Button onClick={(e) => {
                                            setChangeButtonEnable(true);
                                            dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]));
                                            setGoButtonList([]);
                                        }} />
                                    ) : (
                                        (!(goButtonList.length > 0)) ? (
                                            <Go_Button onClick={(e) => goButtonHandler(e)} />
                                        ) : null
                                    )}
                                </Col>


                                <Col>
                                </Col>
                            </Row>
                        </Col>

                        <ToolkitProvider
                            keyField={"id"}
                            data={goButtonList}
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
                                                // {...paginationTableProps}
                                                />
                                                {countlabelFunc(toolkitProps, dispatch, "Material Issue")}
                                            </div>
                                        </Col>
                                    </Row>
                                </React.Fragment>
                            )}
                        </ToolkitProvider>

                        <SaveButtonDraggable >
                            <SaveButton pageMode={pageMode}
                                loading={saveBtnloading}
                                onClick={SaveHandler}
                                userAcc={userPageAccessState}
                                module={"Material Issue"}
                                editCreatedBy={editCreatedBy}
                            />
                        </SaveButtonDraggable>

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

export default MaterialIssueMaster
