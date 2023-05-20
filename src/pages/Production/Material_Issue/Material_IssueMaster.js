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
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Change_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    saveBOMMasterSuccess,
    updateBOMListSuccess
} from "../../../store/Production/BOMRedux/action";
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
import { C_DatePicker } from "../../../CustomValidateForm";

const MaterialIssueMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        MaterialIssueDate: currentDate_ymd,
        ItemName: "",
        NumberOfLot: "",
        LotQuantity: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [Itemselect, setItemselect] = useState([])
    const [Itemselectonchange, setItemselectonchange] = useState("");
    const [goButtonList, setGoButtonList] = useState([]);

    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        Items,
        GoButton = []
    } = useSelector((state) => ({
        postMsg: state.MaterialIssueReducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
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

            const { ListData, Data } = GoButton
            const { id, Item, ItemName, Unit, Quantity, NumberOfLot, Bom, } = ListData
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
            setItemselect({ Item: Item, Unit: Unit, id: id, Bom: Bom })
            setGoButtonList(Data)
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
                setModalCss(true)
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
                    setGoButtonList(MaterialIssueItems)
                }
                dispatch(editMaterialIssueIdSuccess({ Status: false }))
            }
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SaveMaterialIssueSuccess({ Status: false }))
            dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
            dispatch(saveBOMMasterSuccess({ Status: false }))
            if (pageMode === mode.dropdownAdd) {
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
                    RedirectPath: url.MATERIAL_ISSUE_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {

            dispatch(SaveMaterialIssueSuccess({ Status: false }))
            dispatch(saveBOMMasterSuccess({ Status: false }))
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

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            // setState(() => resetFunction(fileds, state))// Clear form values 
            history.push({
                pathname: url.MATERIAL_ISSUE_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateBOMListSuccess({ Status: false }));
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
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField]);

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [goButtonList]);

    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.ItemName,
        Quantity: index.Quantity,
        Item: index.Item,
        BomID: index.Bom,
        Unit: index.Unit,
        NumberOfLot: index.NumberOfLot
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
                    return index.BaseUnitQuantity
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

            formatter: (cellContent, user) => (
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
                                            <div style={{ width: "150px" }}>
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
                                                // onKeyDown={(e) => handleKeyDown(e, GoButton)}
                                                >
                                                    {index.BaseUnitQuantity}
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
                                                    defaultValue={index.Qty}
                                                    autoComplete='off'
                                                    onChange={(event) => handleChange(event, user, index)}
                                                ></Input>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </>
            ),
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
        if (state.values.LotQuantity === "0") {
            alert("Quantity Can Not be 0")
        } else
            if (formValid(state, setState)) {
                const jsonBody = JSON.stringify({
                    WorkOrder: values.ItemName.value,
                    Item: values.ItemName.Item,
                    Company: _cfunc.loginCompanyID(),
                    Party: _cfunc.loginPartyID(),
                    Quantity: parseInt(values.LotQuantity)
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
        // onChangeText({ event, state, setState });
        setState((i) => {
            i.values.LotQuantity = value1
            // i.hasValid.NumberOfLot.valid = true;
            i.hasValid.LotQuantity.valid = true;
            return i
        })
    }

    function NumberOfLotchange(event) {
        dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
        let value1 = Math.max('', Math.min(Itemselect.NumberOfLot, Number(event.target.value)));
        event.target.value = value1
        if ((event.target.value === "NaN")) {
            value1 = 0
        }
        // onChangeText({ event, state, setState });
        setState((i) => {
            i.values.NumberOfLot = value1
            i.hasValid.NumberOfLot.valid = true;
            // i.hasValid.LotQuantity.valid = true;
            return i
        })
    }

    const handleChange = (event, index1, index2) => {

        let input = event.target.value
        let result = /^\d*(\.\d{0,3})?$/.test(input);
        let val1 = 0;
        if (result) {
            let v1 = Number(index2.BaseUnitQuantity);
            let v2 = Number(input)
            if (v1 >= v2) { val1 = input }
            else { val1 = v1 };

        } else if (((index2.Qty >= 0) && (!(input === '')))) {
            val1 = index2.Qty
        } else {
            val1 = 0
        }

        event.target.value = val1;

        let Qtysum = 0
        index1.BatchesData.forEach((i) => {
            if (!(i.id === index2.id)) {
                Qtysum = Number(Qtysum) + Number(i.Qty)
            }
        });

        Qtysum = Number(Qtysum) + Number(val1);
        index2.Qty = val1;
        let diffrence = Math.abs(index1.Quantity - Qtysum);

        if ((Qtysum === index1.Quantity)) {
            try {
                document.getElementById(`ItemName${index1.id}`).style.color = ""
                document.getElementById(`ItemNameMsg${index1.id}`).innerText = ''
                index1["invalid"] = false
                index1["invalidMsg"] = ''

            } catch (e) { }
        } else {
            try {
                const msg = (Qtysum > index1.Quantity) ? (`Excess Quantity ${diffrence} ${index1.UnitName}`)
                    : (`Short Quantity ${diffrence} ${index1.UnitName}`)
                index1["invalid"] = true;
                index1["invalidMsg"] = msg;

                document.getElementById(`ItemNameMsg${index1.id}`).innerText = msg;
            } catch (e) { }
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
                TotalStock += Number(i.BaseUnitQuantity);
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
                    IssueQuantity: parseInt(ele.Qty),
                    BatchID: ele.id,
                    LiveBatchID: ele.LiveBatchID
                })
            }
            index.BatchesData.map((ele) => {
                // 
                if (Number(ele.Qty) > 0) {
                    batch(ele)
                }
            })
        })
        try {
            if (formValid(state, setState)) {
                if (validMsg.length > 0) {
                    dispatch(AlertState({
                        Type: 4,
                        Status: true,
                        Message: JSON.stringify(validMsg),
                        RedirectPath: false,
                        AfterResponseAction: false
                    }));
                    return
                }
                _cfunc.btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    MaterialIssueDate: values.MaterialIssueDate,
                    NumberOfLot: values.NumberOfLot,
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
                if (pageMode === mode.edit) {
                }
                else {
                    dispatch(saveMaterialIssue(jsonBody));
                }
            }
        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
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
                                                    isDisabled={Data.length > 0 ? true : false}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={ItemDropdown_Options}
                                                    onChange={ItemOnchange}
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
                                                <Input
                                                    style={{ textAlign: "right" }}
                                                    name="NumberOfLot"
                                                    value={values.NumberOfLot}
                                                    disabled={(Data.length > 0) ? true : false}
                                                    type="text"
                                                    className={isError.NumberOfLot.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter Number Of Lots"
                                                    autoComplete='off'
                                                    onChange={NumberOfLotchange}
                                                />

                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="mb-1 mt-2  row" >
                                            <Label className="mt-2" style={{ width: "100px" }}> {fieldLabel.LotQuantity} </Label>
                                            <Col sm={7}>
                                                <Input
                                                    style={{ textAlign: "right" }}
                                                    name="LotQuantity"
                                                    value={values.LotQuantity}
                                                    disabled={(Data.length > 0) ? true : false}
                                                    type="text"
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
                                    {pageMode === mode.defaultsave ?
                                        (Data.length === 0) ?
                                            < Go_Button onClick={(e) => goButtonHandler()} />
                                            :
                                            <Change_Button onClick={(e) => dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))} />
                                        : null
                                    }
                                </Col>

                                <Col>
                                </Col>
                            </Row>
                        </Col>

                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({ paginationProps, paginationTableProps }) => (
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
                                                            {...paginationTableProps}
                                                        />
                                                        {countlabelFunc(toolkitProps, paginationProps, dispatch, "Material Issue")}
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
                        {goButtonList.length > 0 ? <FormGroup>
                            <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                <SaveButton pageMode={pageMode}
                                    onClick={SaveHandler}
                                    userAcc={userPageAccessState}
                                    module={"Material Issue"}
                                />
                            </Col>
                        </FormGroup > : null}

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
