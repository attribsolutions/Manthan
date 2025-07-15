import React, { useEffect, useState, } from "react";
import {
    Card,
    Col,
    FormGroup,
    Input,
    Label,
    Modal,
    Row,
    Table
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageFieldSuccess, GetVenderSupplierCustomer, GoButton_For_Order_Add } from "../../../store/actions";
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
import { C_Button, Change_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import { saveBOMMasterSuccess } from "../../../store/Production/BOMRedux/action";
import {
    editMaterialIssueIdSuccess,
    goButtonForMaterialIssue_Master_Action,
    goButtonForMaterialIssue_Master_ActionSuccess,
    saveMaterialIssue, SaveMaterialIssueSuccess
} from "../../../store/Production/Matrial_Issue/action";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import { mode, pageId, url } from "../../../routes/index";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { CInput, C_DatePicker, decimalRegx, decimalRegx_3dit, onlyNumberRegx } from "../../../CustomValidateForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { Qty_Distribution_Func, updateWorkOrderQuantity_By_Lot } from "./DistributionFunc";
import Select, { components } from "react-select";
import { Bulk_BOM_for_WorkOrder, getWorkOrderListPage, Save_Bulk_BOM_for_WorkOrderSuccess } from "../../../store/Production/WorkOrder/action";
import { selectAllCheck } from "../../../components/Common/TableCommonFunc";
import { order_Type } from "../../../components/Common/C-Varialbes";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { AddItemInTableFunc } from "../../Inventory/StockAdjustment/StockAdjust_Func";

const MaterialIssueMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isEditable = _cfunc.loginSystemSetting().isEditable

    const fileds = {
        MaterialIssueDate: currentDate_ymd,
        ItemName: "",
        NumberOfLot: 0,
        LotQuantity: 0,
        TotalQty: 0,
        TotalNumberOfLot: 0,
        Suppiler: "",
        ProductionQty: "",
        StockQty: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [TableArr, setTableArr] = useState([]);

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [Itemselect, setItemselect] = useState([])
    const [Itemselectonchange, setItemselectonchange] = useState("");
    const [goButtonList, setGoButtonList] = useState([]);
    const [originalQty, setOriginalQty] = useState([]);

    const [StockBtnloading, setStockBtnloading] = useState(false);




    const [modal_view, setModal_view] = useState(false);

    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [noOfLotForDistribution, setNoOfLotForDistribution] = useState(0);

    const [changeButtonEnable, setChangeButtonEnable] = useState(false);

    const {
        postMsg,
        pageField,
        userAccess,
        Items,
        GoButton = [],
        saveBtnloading,
        OrderBtnloading,
        supplier,
        commonPartyDropSelect,
        goBtnloading,
        goBtnOrderdata,
        Bulk_Data
    } = useSelector((state) => ({
        saveBtnloading: state.MaterialIssueReducer.saveBtnloading,
        postMsg: state.MaterialIssueReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Items: state.WorkOrderReducer.WorkOrderList,
        GoButton: state.MaterialIssueReducer.GoButton,
        goBtnloading: state.MaterialIssueReducer.goBtnloading,
        supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect,
        OrderBtnloading: state.OrderReducer.goBtnLoading,
        goBtnOrderdata: state.OrderReducer.goBtnOrderAdd,
        Bulk_Data: state.WorkOrderReducer.Bulk_Bom_for_WorkOrder,



    }));

    useEffect(() => {
        const page_Id = pageId.MATERIAL_ISSUE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        const jsonBody = JSON.stringify({
            FromDate: "",
            ToDate: "",
            Party: _cfunc.loginSelectedPartyID()
        });
        dispatch(getWorkOrderListPage({ jsonBody }));
        dispatch(GetVenderSupplierCustomer({ subPageMode: url.IB_ORDER, PartyID: _cfunc.loginSelectedPartyID() }));

        return () => {
            dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))

        }
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
                if (ListData) {
                    const { id, Item, ItemName, Unit, Quantity, NumberOfLot, Bom, RemaningQty, RemainingLot , ProductionQty, StockQty } = ListData;

                    setState((i) => {
                        i.values.MaterialIssueDate = currentDate_ymd
                        i.values.ItemName = { value: id, label: ItemName, Item: Item, NoLot: NumberOfLot, lotQty: Quantity };
                        i.values.NumberOfLot = RemainingLot;
                        i.values.LotQuantity = RemaningQty;
                        i.values.TotalNumberOfLot = NumberOfLot  ;
                        i.values.TotalQty = Quantity ;
                        i.values.ProductionQty = ProductionQty;
                        i.values.StockQty = StockQty;

                        i.hasValid.ItemName.valid = true;
                        i.hasValid.MaterialIssueDate.valid = true;
                        i.hasValid.NumberOfLot.valid = true;
                        i.hasValid.LotQuantity.valid = true;
                        i.hasValid.TotalNumberOfLot.valid = true;
                        i.hasValid.TotalQty.valid = true;
                        i.hasValid.ProductionQty.valid = true;
                        i.hasValid.StockQty.valid = true;
                        return i
                    })
                    setItemselect({ Item: Item, Unit: Unit, id: id, Bom: Bom, Quantity: Quantity })
                    setNoOfLotForDistribution(NumberOfLot)
                    setOriginalQty(RemaningQty)
                }

                const Qty_Distribution_data = Qty_Distribution_Func(Data);
                setGoButtonList(Qty_Distribution_data)
                dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
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
                    i.hasValid.ProductionQty.valid = true;
                    i.hasValid.StockQty.valid = true;
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

        const Item_Id = goButtonList.filter((index => index.selectCheck === true)).map((index => index.Item))
        if (Item_Id.length > 0 && goBtnOrderdata) {
            debugger
            setModal_view(true);
            goBtnOrderdata["Item_Id"] = Item_Id
            goBtnOrderdata["SupplierName"] = values.Suppiler.label
            goBtnOrderdata["Supplier"] = values.Suppiler.value
            goBtnOrderdata["OrderFromMaterialIssue"] = true
            goBtnOrderdata["OrderDate"] = currentDate_ymd


            history.push({
                pathname: url.IB_ORDER,
                editValue: goBtnOrderdata,
                pageMode: mode.edit
            })
        }
    }, [goBtnOrderdata])

    useEffect(() => {

        if (Bulk_Data.Status === true && Bulk_Data.StatusCode === 200) {
            dispatch(Save_Bulk_BOM_for_WorkOrderSuccess({ Status: false }));
            history.push({
                pathname: url.BULK_WORK_ORDER,
                state: Bulk_Data.Data
            })

        }
    }, [Bulk_Data]);



    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField]);

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [goButtonList]);

    const ItemDropdown_Options = Items.map((index) => ({
        id: index.id,
        value: index.id,
        label: index.ItemName,
        ItemName: index.ItemName,
        Quantity: index.RemaningQty,
        Item: index.Item,
        Bom: index.Bom,
        Unit: index.Unit,
        NumberOfLot: index.RemainingLot,
        WorkDate: index.WorkDate,
        TotalNumberOfLot: index.NumberOfLot,
        TotalQty: index.Quantity,
        ProductionQty: index.ProductionQty,
        StockQty: index.StockQty,

    }));
    function modalToggleFunc() {
        setModal_view(false);

    }

    const workorderQytChange = (inx_1) => {
        let remainingQuantity = inx_1.Quantity;
        inx_1.BatchesData.forEach(inx_2 => {
            const quantity = _cfunc.getFixedNumber(inx_2.ObatchwiseQuantity, 3);
            const distributedQuantity = Math.min(remainingQuantity, quantity);
            remainingQuantity -= distributedQuantity;
            const batchQtyElement = document.getElementById(`stock${inx_1.id}-${inx_2.id}`);
            batchQtyElement.value = (Number(distributedQuantity)).toFixed(3); // Display with three decimal places
        });
    }

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
                debugger
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
            text: "Stock Quantity",
            dataField: "StockQuantity",
        },
        {
            text: "Original Work Order Qty",
            dataField: "OriginalWorkOrderQty",
        },
        {
            text: "Work Order Qty",
            dataField: "Quantity",
            formatter: (cellContent, row,) => {

                return (
                    <>
                        <div style={{ width: "150px" }}>
                            <Input
                                type="text"
                                key={`stock${row.id}`}
                                id={`stock${row.id}`}
                                style={{ textAlign: "right" }}
                                disabled={!JSON.parse(isEditable)}
                                cpattern={decimalRegx}
                                defaultValue={(_cfunc.getFixedNumber(row.Quantity, 3)).toFixed(3)}
                                autoComplete='off'

                                onChange={(e) => {
                                    let Qty = e.target.value;
                                    debugger
                                    // Check for valid decimal input or empty string
                                    if (decimalRegx_3dit.test(Qty) || Qty === "") {
                                        let inputQty = Number(Qty) || 0;

                                        if (inputQty > row.TotalStock) {
                                            e.target.value = row.TotalStock;
                                            row["Quantity"] = row.TotalStock;
                                        } else {
                                            row["Quantity"] = inputQty;
                                        }
                                    } else {
                                        // Invalid input: reset to TotalStock
                                        e.target.value = row.TotalStock;
                                        row["Quantity"] = row.TotalStock;
                                    }

                                    workorderQytChange(row);
                                }}
                            />
                        </div>
                    </>
                )
            }


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
                                                        {(Number(index.ObatchwiseQuantity)).toFixed(3)}
                                                    </Label>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ width: "150px" }}>
                                                    <Input
                                                        type="text"
                                                        key={`stock${user.id}-${index.id}`}
                                                        disabled={pageMode === mode.view ? true : false}
                                                        id={`stock${user.id}-${index.id}`}
                                                        style={{ textAlign: "right" }}
                                                        cpattern={decimalRegx}
                                                        defaultValue={(Number(index.Qty)).toFixed(3)}
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

    function ItemOnchange(hasSelect, evn) {
        onChangeSelect({ hasSelect, evn, state, setState });
        dispatch(Breadcrumb_inputName(hasSelect.label))
        dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
        setState((i) => {
            i.values.ItemName = hasSelect
            i.values.NumberOfLot = hasSelect.NumberOfLot;
            i.values.LotQuantity = hasSelect.Quantity;
            i.values.ProductionQty = hasSelect.ProductionQty;
            i.values.StockQty = hasSelect.StockQty;
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
                const body = { jsonBody, pageMode, goButtonCallByMode: true, }
                dispatch(goButtonForMaterialIssue_Master_Action(body));
            }
    }

    function ItemOnchange(e) {

        dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
        setItemselectonchange(e)
        setItemselect({ Item: e.Item, Unit: e.Unit, id: e.id, Bom: e.Bom, Quantity: e.Quantity })
        setNoOfLotForDistribution(e.NumberOfLot)
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
            i.values.ProductionQty = e.ProductionQty;
            i.values.StockQty = e.StockQty;
            i.values.TotalNumberOfLot = e.NumberOfLot  ;
            i.values.TotalQty = e.Quantity ;
            i.hasValid.NumberOfLot.valid = true;
            i.hasValid.LotQuantity.valid = true;
            i.hasValid.TotalNumberOfLot.valid = true;
            i.hasValid.TotalQty.valid = true;
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
            input = "";
        }

        if (parseFloat(input) > defaultNoOfLot) {
            input = defaultNoOfLot;
        }
        remainingQuantity = ((parseFloat(values.ItemName.lotQty) / defaultNoOfLot) * _cfunc.getFixedNumber(input, 3)).toFixed(2)

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

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const tableQuantityOnchangeHandler = (event, index1, index2) => {

        let QuantityTotal = 0
        let input = event.target.value.trim(); // Remove leading and trailing whitespace
        let ObatchwiseQuantity = parseFloat(index2.ObatchwiseQuantity);

        if (input === "" || isNaN(input)) {
            index2.Qty = 0;
        } else {
            if (parseFloat(input) > ObatchwiseQuantity) {
                event.target.value = ObatchwiseQuantity;
            }
            index2.Qty = event.target.value;  // Assign the input value directly to Qty
        }

        index1.BatchesData.forEach(index2 => {
            if (Number(index2.Qty) > 0) {
                QuantityTotal += Number(index2.Qty);
            }
        });
        index1.Quantity = _cfunc.roundToDecimalPlaces(QuantityTotal, 3); //max 3 decimal
        try {
            document.getElementById(`stock${index1.id}`).value = index1.Quantity
        } catch (e) { console.log('inner-Stock-Caculation', e) };


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
                    WorkOrderQuantity: parseFloat(index.Quantity).toFixed(3),
                    BatchCode: ele.BatchCode,
                    BatchDate: ele.BatchDate,
                    SystemBatchDate: ele.SystemBatchDate,
                    SystemBatchCode: ele.SystemBatchCode,
                    IssueQuantity: parseFloat(ele.Qty).toFixed(3),
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
    function rowSelected() {
        return goButtonList.map((index) => { return (index.selectCheck) && index.id })
    }


    const PurchaseOrderhandler = (event) => {
        const Item_Id = goButtonList.filter((index => index.selectCheck)).map((index => index.id))
        if (Item_Id.length > 0) {
            setModal_view(true);
        }
    };

    const makeOrdrrHandler = () => {

        const PO_Body = {
            Party: values.Suppiler.value,
            Customer: commonPartyDropSelect.value,
            RateParty: commonPartyDropSelect.value,
            EffectiveDate: currentDate_ymd,
            OrderID: 0,
            Demand: 0,
            OrderType: order_Type.PurchaseOrder,
        }
        const jsonBody = JSON.stringify({ ...PO_Body, });
        let config = { subPageMode: url.ORDER_1, jsonBody }
        dispatch(GoButton_For_Order_Add(config))

    }

    const BulkWorkOrder_Handler = async () => {
        debugger

        let validMsg = []
        let checkRows = goButtonList.filter(i => (i.selectCheck))
        let BomNotExist = checkRows.filter(i => (i.Bom_id === null))

        BomNotExist.forEach(i => {
            validMsg.push(`Item ${i.ItemName}: "BOM Not Exist"`);
        });


        if (!checkRows.length > 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectOneOrder,
            });
            return
        }

        if (BomNotExist.length > 0) {
            customAlert({
                Type: 10,
                Message: JSON.stringify(validMsg),
            });
            return
        }


        let ID_String = checkRows.map(row => row.Bom_id).join(',')
        let Quantity_String = checkRows.map(row => row.OriginalWorkOrderQty).join(',')
        let Item_String = checkRows.map(row => row.Item).join(',')



        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            BOM_ID: ID_String,
            Quantity: Quantity_String,
            Item: Item_String,
            Party: _cfunc.loginPartyID(),
        });

        dispatch(Bulk_BOM_for_WorkOrder({ jsonBody }))
    }


    const StockAdjustment_Handler = async () => {
        setStockBtnloading(true)
        let checkRows = goButtonList
            .filter(i => i.selectCheck)
            .map(i => ({
                value: i.Item,
                label: i.ItemName
            }));

        let StockDetails = [];

        for (const item of checkRows) {
            const { TableArr: updatedTableArr } = await AddItemInTableFunc({
                itemNameSelect: item,
                TableArr, // pass the original or current array if needed
            });

            StockDetails.push(...updatedTableArr); // flatten into one array
        }
        setStockBtnloading(false)
        if (StockDetails?.length > 0) {
            history.push({
                pathname: url.STOCK_ADJUSTMENT,
                StockDetails,
            })
        } else {
            customAlert({
                Type: 4,
                Message: alertMessages.StockNotAvaliable,
            });
        }



    }


    const customOption = (props) => {

        const { innerProps, label, data } = props;

        return (
            <components.Option {...props}>
                <div {...innerProps}>
                    <div >Name:{data.ItemName}</div>
                    <div>Total Number Of Lot:{data.NumberOfLot  }</div>
                    <div>Number Of Lot:{data.NumberOfLot}</div>
                    <div>Total Qty:{data.Quantity }</div>
                    <div>Quantity:{data.Quantity}</div>
                    <div>WorkDate:{_cfunc.date_dmy_func(data.WorkDate)}</div>
                    <div>ProductionQty:{data.ProductionQty}</div>
                    <div>StockQty:{data.StockQty}</div>

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
                        <Col className="px-2 mb-1 c_card_filter header text-black " sm={12}>
                            <Row className="mx-0 ">

                                {/* === Row 1: 5 columns with horizontal labels === */}
                                <Col sm="2">
                                    <FormGroup className="row mt-2">
                                        <Label className="col-sm-5 col-form-label">{fieldLabel.MaterialIssueDate}</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name="MaterialIssueDate"
                                                value={values.MaterialIssueDate}
                                                onChange={(y, v, e) => onChangeDate({ e, v, state, setState })}
                                            />
                                            {isError.MaterialIssueDate.length > 0 && (
                                                <span className="invalid-feedback">{isError.MaterialIssueDate}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="2">
                                    <FormGroup className="row mt-2">
                                        <Label className="col-sm-5 col-form-label">{fieldLabel.LotQuantity}</Label>
                                        <Col sm="7">
                                            <CInput
                                                style={{ textAlign: "right" }}
                                                name="LotQuantity"
                                                value={values.LotQuantity}
                                                cpattern={decimalRegx}
                                                disabled={true}
                                                className={isError.LotQuantity.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Lot Quantity"
                                                autoComplete='off'
                                                onChange={Quantitychange}
                                            />
                                            <small>{Itemselect.UnitName}</small>
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="2">
                                    <FormGroup className="row mt-2">
                                        <Label className="col-sm-5 col-form-label">{fieldLabel.NumberOfLot}</Label>
                                        <Col sm="7">
                                            <CInput
                                                style={{ textAlign: "right" }}
                                                name="NumberOfLot"
                                                cpattern={decimalRegx}
                                                value={values.NumberOfLot}
                                                disabled={(goButtonList.length > 0)}
                                                className={isError.NumberOfLot.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="No. of Lots"
                                                autoComplete='off'
                                                onChange={(e) => NumberOfLotchange(e.target.value)}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="3">
                                    <FormGroup className="row mt-2">
                                        <Label className="col-sm-5 col-form-label">{fieldLabel.ProductionQty}</Label>
                                        <Col sm="7">
                                            <CInput
                                                style={{ textAlign: "right" }}
                                                name="ProductionQty"
                                                value={values.ProductionQty}
                                                type="text"
                                                placeholder="Production Qty"
                                                autoComplete='off'
                                                onChange={(e) => NumberOfLotchange(e.target.value)}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="2">
                                    <FormGroup className="row mt-2">
                                        <Label className="col-sm-5 col-form-label">{fieldLabel.StockQty}</Label>
                                        <Col sm="7">
                                            <CInput
                                                style={{ textAlign: "right" }}
                                                name="StockQty"
                                                value={values.StockQty}
                                                type="text"
                                                placeholder="Stock Qty"
                                                autoComplete='off'
                                                onChange={(e) => NumberOfLotchange(e.target.value)}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                {/* Go / Change Button */}
                                <Col sm="1" className="mt-2 ms-">
                                <div className="ms-5">
                                    {!(pageMode === "view") && (goButtonList.length > 0) ? (
                                        <Change_Button onClick={() => {
                                            setChangeButtonEnable(true);
                                            dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]));
                                            setGoButtonList([]);
                                        }} />
                                    ) : (
                                        !(goButtonList.length > 0) && (
                                            <Go_Button loading={goBtnloading} onClick={goButtonHandler} />
                                        )
                                    )}
                                    </div>
                                </Col>
                            </Row>

                            {/* === Row 2: Total Lot, Total Qty, Item Name === */}
                            <Row className="mx-0 ">
                                <Col sm="2 ">
                                    <FormGroup className="row mt-2 mb-2">
                                        <Label className="col-sm-5 col-form-label">{fieldLabel.TotalNumberOfLot}</Label>
                                        <Col sm="7">
                                            <Label className="form-control-plaintext">{values.TotalNumberOfLot}</Label>
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="2">
                                    <FormGroup className="row mt-2 mb-2">
                                        <Label className="col-sm-5 col-form-label">{fieldLabel.TotalQty}</Label>
                                        <Col sm="7">
                                            <Label className="form-control-plaintext">{values.TotalQty}</Label>
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="5">
                                    <FormGroup className="row mt-2 mb-2">
                                        <Label className="col-sm-2 col-form-label">{fieldLabel.ItemName}</Label>
                                        <Col sm="10">
                                            <Select
                                                name="ItemName"
                                                value={values.ItemName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ItemDropdown_Options}
                                                components={{ Option: customOption }}
                                                isDisabled={(goButtonList.length > 0)}
                                                onChange={ItemOnchange}
                                                styles={{ menu: provided => ({ ...provided, zIndex: 2 }) }}
                                            />
                                            {isError.ItemName.length > 0 && (
                                                <span className="text-danger f-8">
                                                    <small>{isError.ItemName}</small>
                                                </span>
                                            )}
                                        </Col>
                                    </FormGroup>
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
                                            <div >
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    id="table_Arrow"
                                                    responsive
                                                    selectRow={

                                                        selectAllCheck({
                                                            rowSelected: rowSelected(),
                                                            bgColor: '',
                                                            position: "left",
                                                            tableList: goButtonList
                                                        })
                                                    }
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

                        {goButtonList.length > 0 && <SaveButtonDraggable >
                            <SaveButton pageMode={pageMode}
                                loading={saveBtnloading}
                                onClick={SaveHandler}
                                userAcc={userPageAccessState}
                                module={"Material Issue"}
                                editCreatedBy={editCreatedBy}
                            />

                            <SaveButton pageMode={pageMode}
                                // loading={saveBtnloading}
                                onClick={PurchaseOrderhandler}
                                userAcc={userPageAccessState}
                                // module={"Material Issue"}
                                Button_Name={"Make Demand"}
                                editCreatedBy={editCreatedBy}
                            />
                            <SaveButton pageMode={pageMode}
                                // loading={saveBtnloading}
                                onClick={BulkWorkOrder_Handler}
                                userAcc={userPageAccessState}
                                // module={"Material Issue"}
                                Button_Name={"Make Work Order"}

                                editCreatedBy={editCreatedBy}
                            />

                            <SaveButton pageMode={pageMode}
                                loading={StockBtnloading}
                                loadingLable={"Stock Adjust..."}
                                onClick={StockAdjustment_Handler}
                                userAcc={userPageAccessState}
                                // module={"Material Issue"}
                                Button_Name={"Make Stock Adjust"}

                                editCreatedBy={editCreatedBy}
                            />
                        </SaveButtonDraggable>}

                    </form>



                    <Modal
                        isOpen={modal_view}
                        toggle={modalToggleFunc}
                        centered={true}
                    >
                        <div className="modal-header" style={{ position: "relative" }}>
                            <h4 className="modal-title mt-0 align-middle">Make Order For Selected Item</h4>
                            <button
                                type="button"
                                onClick={modalToggleFunc}
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Row className="mt-1">
                                <Col sm={12}>
                                    <FormGroup className="row mt-2 ">
                                        <Label className="mt-2" style={{ width: "100px" }}> Suppiler </Label>
                                        <Col sm={8}>
                                            <Select
                                                name="Suppiler"
                                                defaultValue={values.Suppiler}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={supplierOptions}

                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }}


                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                            />

                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            <div className="modal-footer justify-content-start modal-footer p-4 mt-4">
                                <button
                                    type="button"
                                    className="btn btn-secondary pr-3 pl-3"
                                    onClick={modalToggleFunc}


                                >
                                    Cancel
                                </button>
                                <Go_Button
                                    loading={OrderBtnloading}
                                    type="submit"
                                    className="btn btn-primary pr-3 pl-3"
                                    onClick={makeOrdrrHandler}
                                />

                            </div>


                        </div>
                    </Modal>






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
