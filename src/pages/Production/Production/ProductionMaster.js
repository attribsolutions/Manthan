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
import { useHistory } from "react-router-dom";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { Change_Button, SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, btnIsDissablefunc, currentDate_ymd, loginCompanyID, loginUserID, metaTagLabel } from "../../../components/Common/CommonFunction";
import {
    comAddPageFieldFunc,
    formValid, initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import {
    edit_ProductionIdSuccess,
    getUnitIDForProdunction,
    getUnitIDForProdunctionSuccess,
    Save_Production,
    Save_ProductionSuccess,
} from "../../../store/Production/ProductionRedux/actions";
import { getMaterialIssueListPage, getMaterialIssueListPageSuccess } from "../../../store/Production/Matrial_Issue/action";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { CInput, C_DatePicker, decimalRegx, onlyNumberRegx } from "../../../CustomValidateForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as _cfunc from "../../../components/Common/CommonFunction";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import Select, { components } from "react-select";

const ProductionMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const Calculationformula = _cfunc.loginSystemSetting().ProductionSaveValidation
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [UnitNamefromPageMod_2, setUnitNamefromPageMod_2] = useState('');

    const fileds = {
        id: "",
        ProductionDate: currentDate_ymd,
        NumberOfLot: "",
        EstimatedQuantity: "",
        ActualQuantity: "",
        PrintedBatchCode: "",
        BestBefore: currentDate_ymd,
        Remark: "",
        ItemName: "",
        UnitName: "",

    }
    const [state, setState] = useState(initialFiledFunc(fileds))
    const [batchDate, setBatchDate] = useState("")

    const [originalValues, setOriginalValues] = useState({ orignalNumberOfLot: 0, orignalEstimatedQty: 0 });
    const [allFieldsEnabled, setAllFieldsEnabled] = useState(false);

    const {
        postMsg,
        userAccess,
        updateMsg,
        pageField,
        itemsDrop,
        UnitDropdown
    } = useSelector((state) => ({
        supplierAddress: state.CommonAPI_Reducer.supplierAddress,
        postMsg: state.ProductionReducer.postMsg,
        updateMsg: state.ProductionReducer.updateMsg,
        UnitDropdown: state.ProductionReducer.unit,
        itemsDrop: state.MaterialIssueReducer.materialIssueList,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        dispatch(getUnitIDForProdunctionSuccess([]))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.PRODUCTION_LIST));
        const jsonBody = JSON.stringify({
            FromDate: "2022-11-01", //fromdate hard code value is compulsory
            ToDate: currentDate_ymd,
        });
        dispatch(getMaterialIssueListPage(jsonBody));
        return () => {
            dispatch(getMaterialIssueListPageSuccess([]))
        }
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        if ((hasShowloction || hasShowModal)) {
            setAllFieldsEnabled(true)
            let hasEditVal = null
            let insidePageMode = null;
            if (hasShowloction) {
                setPageMode(location.pageMode)
                insidePageMode = location.pageMode;
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                insidePageMode = props.pageMode;
                setPageMode(props.pageMode)
            }

            if (hasEditVal) {

                const { Item, ItemName, UnitName, Unit, id,
                    EstimatedQuantity = 0,
                    BestBefore = currentDate_ymd,
                    Remark = "", PrintedBatchCode = '',
                    NumberOfLot = 0, ActualQuantity = '',
                    ProductionDate = currentDate_ymd } = hasEditVal;

                setUnitNamefromPageMod_2(UnitName);
                setBatchDate(ProductionDate);
                setOriginalValues({ orignalNumberOfLot: NumberOfLot, orignalEstimatedQty: EstimatedQuantity })

                setState(ele => {
                    const i = { ...ele };

                    i.values.ItemName = {
                        label: ItemName,
                        value: Item,
                        ItemID: Item
                    }
                    i.values.UnitName = {
                        label: UnitName,
                        value: Unit
                    }
                    i.values.id = id;

                    i.values.ProductionDate = ProductionDate;
                    i.values.EstimatedQuantity = EstimatedQuantity;//EstimatedQuantity===LoQuantity
                    i.values.NumberOfLot = NumberOfLot;      //NumberOfLot===NumberOfLot
                    i.values.ActualQuantity = ActualQuantity;
                    i.values.BestBefore = BestBefore;
                    i.values.PrintedBatchCode = PrintedBatchCode;
                    i.values.Remark = Remark;


                    i.hasValid.id.valid = true
                    i.hasValid.ProductionDate.valid = true
                    i.hasValid.ItemName.valid = true
                    i.hasValid.EstimatedQuantity.valid = true
                    i.hasValid.NumberOfLot.valid = true
                    i.hasValid.PrintedBatchCode.valid = true
                    i.hasValid.ActualQuantity.valid = true



                    return i
                })

                if (insidePageMode === mode.modeSTPsave) {
                    const jsonBody = JSON.stringify({
                        Item: Item
                    });
                    dispatch(getUnitIDForProdunction(jsonBody));
                }
                else if (insidePageMode === mode.edit || insidePageMode === mode.view) {
                    dispatch(edit_ProductionIdSuccess({ Status: false }))
                }
            }
        }
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
    }, [userAccess]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField]);

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {

            dispatch(Save_ProductionSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values  
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
                    history.push({ pathname: url.PRODUCTION_LIST })
                }
            }
        } else if (postMsg.Status === true) {
            dispatch(Save_ProductionSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg]);

    const ItemDropdown_Options = itemsDrop.map((index) => ({
        id: index.id,
        value: index.id,
        label: index.ItemName,
        ItemID: index.Item,
        EstimatedQuantity: index.LotQuantity,
        NumberOfLot: index.NumberOfLot,
        Unit: { value: index.Unit, label: index.UnitName },
        ProductionDate: index.ProductionDate
    }));

    function changeButtonHandler() {
        setAllFieldsEnabled(false)
    }

    function ItemNameOnChangeHandler(hasSelect, evn) {

        setAllFieldsEnabled(true)
        setOriginalValues({ orignalNumberOfLot: hasSelect.NumberOfLot, orignalEstimatedQty: hasSelect.EstimatedQuantity })

        const jsonBody = JSON.stringify({
            Item: hasSelect.value
        });
        dispatch(getUnitIDForProdunction(jsonBody));
        setBatchDate(hasSelect.ProductionDate);

        setState((i) => {
            let a = { ...i };
            a.values.id = hasSelect.id
            a.values.ItemName = { label: hasSelect.label, value: hasSelect.value, ItemID: hasSelect.ItemID };
            a.values.UnitName = hasSelect.Unit;
            a.values.NumberOfLot = hasSelect.NumberOfLot;
            a.values.EstimatedQuantity = hasSelect.EstimatedQuantity;
            a.hasValid.NumberOfLot.valid = true;
            a.hasValid.ItemName.valid = true;
            a.hasValid.EstimatedQuantity.valid = true;
            a.hasValid.UnitName.valid = false;
            return a;
        });
    }

    const customOption = (props) => {

        const { innerProps, label, data } = props;

        return (
            <components.Option {...props}>
                <div {...innerProps}>
                    <div >Name: {data.label}</div>
                    <div>Number Of Lot: {data.NumberOfLot}</div>
                    <div>Estimated Qty: {data.EstimatedQuantity}</div>
                    <div>Production Date: {_cfunc.date_dmy_func(data.ProductionDate)}</div>
                </div>
            </components.Option>
        );
    };

    function NumberOfLotOnChange(event) {

        let input = event.trim(); // Remove leading and trailing whitespace
        let remainingQuantity = 0
        if (input === "" || isNaN(input)) {
            input = 0;
        }

        if (parseFloat(input) > originalValues.orignalNumberOfLot) {
            input = originalValues.orignalNumberOfLot;
        }
        remainingQuantity = ((parseFloat(originalValues.orignalEstimatedQty) / originalValues.orignalNumberOfLot) * parseFloat(input)).toFixed(2)

        if (remainingQuantity === "" || isNaN(remainingQuantity)) {
            remainingQuantity = 0;
        }
        setState((i) => {
            let a = { ...i };
            a.values.NumberOfLot = input;
            a.hasValid.NumberOfLot.valid = true;
            a.values.EstimatedQuantity = remainingQuantity;
            a.hasValid.EstimatedQuantity.valid = true;
            return a;
        });
    }

    let isActionPermitted = false; // Flag variable to track permission

    const SaveHandler = async (event) => {
        debugger
        event.preventDefault();
        const btnId = event.target.id;
        let jsonBody
        try {

            if (!isActionPermitted && formValid(state, setState)) { // Check if action is not already permitted
                btnIsDissablefunc({ btnId, state: true });
                jsonBody = JSON.stringify({
                    ProductionMaterialIssue: [
                        {
                            MaterialIssue: values.id
                        }
                    ],
                    ProductionDate: currentDate_ymd,
                    EstimatedQuantity: values.EstimatedQuantity,
                    NumberOfLot: values.NumberOfLot,
                    ActualQuantity: parseFloat(values.ActualQuantity).toFixed(3),
                    BatchDate: batchDate,
                    StoreLocation: "1234",
                    PrintedBatchCode: values.PrintedBatchCode,
                    BestBefore: values.BestBefore,
                    Remark: values.Remark,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    Company: loginCompanyID(),
                    Division: _cfunc.loginSelectedPartyID(),
                    Unit: values.UnitName.value,
                    Item: values.ItemName.ItemID,
                });



                console.log("Calculationformula", Calculationformula)
                let parts = Calculationformula.split(" , ");
                let Calculation = parts[0];
                let percentage = parts[1];
                // const percentageDecrease = parseFloat((1 - actualQuantity / originalEstimatedQty) * 100).toFixed(2);

                const percentageDecrease = eval(Calculation)
                let message;
                let isPermission
                if (parseFloat(percentageDecrease) > Number(percentage)) {
                    message = `Actual Quantity is ${percentage}% Lower than Estimated Quantity.`;
                    isPermission = await customAlert({
                        Type: 8,
                        Message: message,
                    });
                } else if (parseFloat(percentageDecrease) < -(Number(percentage))) {
                    message = `Actual Quantity Exceeds Estimated Quantity by ${percentage}%`;
                    isPermission = await customAlert({
                        Type: 8,
                        Message: message,
                    });
                }

                if (isPermission) {
                    isActionPermitted = true;
                    dispatch(Save_Production({ jsonBody, btnId }));
                }
                else if (message === undefined) {
                    dispatch(Save_Production({ jsonBody, btnId }));
                }
            }

        } catch (e) {
            btnIsDissablefunc({ btnId, state: false });
        }
    };


    if (!(userPageAccessState === "")) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content"  >
                    <form noValidate>
                        <div className="px-2 mb-1 c_card_filter header text-black"  >
                            <Row>
                                <Col sm={5}>
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.ProductionDate}</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name="ProductionDate"
                                                value={values.ProductionDate}
                                                disabled={true}
                                            />

                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={5}>
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-md-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.ItemName}</Label>
                                        <Col md="7">
                                            <Select
                                                isDisabled={(allFieldsEnabled)}
                                                name="Name"
                                                value={values.ItemName}
                                                options={ItemDropdown_Options}
                                                components={{ Option: customOption }}
                                                onChange={(hasSelect, evn) => {
                                                    ItemNameOnChangeHandler(hasSelect, evn)
                                                }}
                                            />
                                            {isError.ItemName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                            )}
                                        </Col>
                                        <Col sm="1" className="mx-6 mt-1">
                                            {((allFieldsEnabled)) &&
                                                <Change_Button
                                                    type="button"
                                                    onClick={changeButtonHandler}
                                                />}
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={5}>
                                    <FormGroup className=" row  " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.NumberOfLot} </Label>
                                        <Col md="7">
                                            < CInput
                                                name="NumberOfLot"
                                                type="text"
                                                className="text-end"
                                                disabled={allFieldsEnabled}
                                                cpattern={onlyNumberRegx}
                                                placeholder="Enter Estimated Quantity"
                                                value={values.NumberOfLot}
                                                autoComplete="off"
                                                onChange={(e) => { NumberOfLotOnChange(e.target.value) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={5}>
                                    <FormGroup className=" row  " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.EstimatedQuantity} </Label>
                                        <Col md="7">
                                            < CInput
                                                disabled={true}
                                                name="EstimatedQuantity"
                                                type="text"
                                                className="text-end"
                                                placeholder="Enter Estimated Quantity"
                                                value={values.EstimatedQuantity}
                                                autoComplete="off"
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                        </Col>
                                        <div className="col col-1">
                                            <Label style={{ marginTop: '7px', width: "72px", marginLeft: '-23px' }}>
                                                {UnitNamefromPageMod_2}
                                            </Label>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={5}>
                                    <FormGroup className="row  " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.ActualQuantity}</Label>
                                        <Col md="7">
                                            <Input
                                                type="text"
                                                name="ActualQuantity"
                                                value={values.ActualQuantity}
                                                className="text-end"
                                                placeholder="Enter Actual Quantity"
                                                autoComplete="off"
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.ActualQuantity?.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ActualQuantity}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={5}>
                                    <FormGroup className=" row" >
                                        <Label className="col-md-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.UnitName}</Label>
                                        <Col md="7">
                                            <Select
                                                name="UnitName"
                                                value={values.UnitName}
                                                options={UnitDropdown}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />
                                            {isError.UnitName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.UnitName}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={5}>
                                    <FormGroup className=" row" >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.BestBefore}</Label>
                                        <Col md="7">
                                            <C_DatePicker
                                                options={{
                                                    minDate: "today",
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                                name="BestBefore"
                                                value={values.BestBefore}
                                                disabled={pageMode === mode.view ? true : false}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={5}>
                                    <FormGroup className=" row  " >
                                        <Label className="col-md-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.PrintedBatchCode}</Label>
                                        <Col md="7">
                                            <Input
                                                type="text"
                                                name="PrintedBatchCode"
                                                value={values.PrintedBatchCode}
                                                disabled={pageMode === mode.view ? true : false}

                                                placeholder="Enter Printed BatchCode"
                                                autoComplete="off"
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.PrintedBatchCode.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.PrintedBatchCode}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={5}>
                                    <FormGroup className=" row " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "168px" }}>{fieldLabel.Remark}</Label>
                                        <Col md="7">
                                            <Input
                                                type="text"
                                                name="Remark"
                                                value={values.Remark}
                                                disabled={pageMode === mode.view ? true : false}
                                                placeholder="Enter Remark"
                                                autoComplete="off"
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Remark.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Remark}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>

                        <SaveButtonDraggable>
                            <SaveButton pageMode={pageMode}
                                userAcc={userPageAccessState}
                                onClick={SaveHandler}
                                module={"ProductionMaster"}
                            />
                        </SaveButtonDraggable>

                    </form>
                </div >
            </React.Fragment >
        )
    } else {
        return null
    }
}
export default ProductionMaster;