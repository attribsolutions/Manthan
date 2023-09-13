import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, btnIsDissablefunc, currentDate_ymd, metaTagLabel } from "../../../components/Common/CommonFunction";
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
    update_ProductionIdSuccess
} from "../../../store/Production/ProductionRedux/actions";
import { getMaterialIssueListPage } from "../../../store/Production/Matrial_Issue/action";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { C_DatePicker } from "../../../CustomValidateForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const ProductionMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [modalCss, setModalCss] = useState(false);
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
        BestBefore: "",
        Remark: "",
        ItemName: "",
        UnitName: ""
    }
    const [state, setState] = useState(initialFiledFunc(fileds))

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
        dispatch(commonPageField(pageId.PRODUCTION_LIST))
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        if ((hasShowloction || hasShowModal)) {
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
                setModalCss(true)
            }

            if (hasEditVal) {

                // }
                // 
                // // let mode2Data = props.location
                // // const MaterialProductionaData = Object.assign({}, mode2Data.MaterialProductionaData)
                // if (mode2Data.pageMode === mode.modeSTPsave) {
                const { Item, ItemName, UnitName, Unit, id,
                    EstimatedQuantity = 0,
                    BestBefore = '',
                    Remark = "", PrintedBatchCode = '',
                    NumberOfLot = 0, ActualQuantity = '',
                    ProductionDate = currentDate_ymd } = hasEditVal;

                setUnitNamefromPageMod_2(UnitName)
                setState(ele => {
                    const i = { ...ele };

                    i.values.ItemName = {
                        label: ItemName,
                        value: Item
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
                    i.hasValid.ActualQuantity.valid = true
                    i.hasValid.ProductionDate.valid = true
                    i.hasValid.ItemName.valid = true
                    i.hasValid.EstimatedQuantity.valid = true
                    i.hasValid.NumberOfLot.valid = true
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

        } else {
            const jsonBody = JSON.stringify({
                FromDate: "2022-11-01", //from datehardrd code value is compulsory
                ToDate: currentDate_ymd,
            });
            dispatch(getMaterialIssueListPage(jsonBody));
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

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(Save_ProductionSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values  
            customAlert({
                Type: 1,
                Status: true,
                Message: postMsg.Message,

            })
        } else if (postMsg.Status === true) {
            dispatch(Save_ProductionSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg]);

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            // setState(() => resetFunction(fileds, state))// Clear form values  
            history.push({
                pathname: url.PRODUCTION_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(update_ProductionIdSuccess({ Status: false }));
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
    }, [pageField]);

    const ItemDropdown_Options = itemsDrop.map((index) => ({
        value: index.id,
        label: index.ItemName,
    }));

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })
                const jsonBody = JSON.stringify({
                    ProductionMaterialIssue: [
                        {
                            MaterialIssue: values.id,
                        }
                    ],
                    ProductionDate: values.ProductionDate,
                    EstimatedQuantity: values.EstimatedQuantity,
                    NumberOfLot: values.NumberOfLot,
                    ActualQuantity: parseFloat(values.ActualQuantity).toFixed(3),
                    BatchDate: "2022-12-17",
                    BatchCode: "aa",
                    StoreLocation: "aa",
                    PrintedBatchCode: values.PrintedBatchCode,
                    BestBefore: values.BestBefore,
                    Remark: values.Remark,
                    CreatedBy: 1,
                    UpdatedBy: 1,
                    Company: 1,
                    Division: 4,
                    GST: 8,
                    Unit: values.UnitName.value,
                    MRP: "",
                    Rate: 55,
                    Item: values.ItemName.value,
                });

                dispatch(Save_Production({ jsonBody, btnId }));
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };


    // const SaveHandler = (event) => {
    //     event.preventDefault();
    //     if (formValid(state, setState)) {

    //         const jsonBody = JSON.stringify({
    //             ProductionMaterialIssue: [
    //                 {
    //                     MaterialIssue: values.id,
    //                 }
    //             ],
    //             ProductionDate: values.ProductionDate,
    //             EstimatedQuantity: values.EstimatedQuantity,
    //             NumberOfLot: values.NumberOfLot,
    //             ActualQuantity: parseFloat(values.ActualQuantity).toFixed(3),
    //             BatchDate: "2022-12-17",
    //             BatchCode: "aa",
    //             StoreLocation: "aa",
    //             PrintedBatchCode: values.PrintedBatchCode,
    //             BestBefore: values.BestBefore,
    //             Remark: values.Remark,
    //             CreatedBy: 1,
    //             UpdatedBy: 1,
    //             Company: 1,
    //             Division: 4,
    //             GST: 8,
    //             Unit: values.UnitName.value,
    //             MRP: "",
    //             Rate: 55,
    //             Item: values.ItemName.value,
    //         });
    //         dispatch(Save_Production(jsonBody));
    //     }
    // };

    if (!(userPageAccessState === "")) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginBottom: "16cm" }} >

                    <form onSubmit={SaveHandler} noValidate>
                        <div className="px-2 mb-1  c_card_header "  >
                            <Row>
                                <Col sm={5}>
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.ProductionDate}</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name="ProductionDate"
                                                value={values.ProductionDate}
                                                disabled={pageMode === mode.modeSTPsave || pageMode === mode.view ? true : false}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />

                                            {isError.ProductionDate.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ProductionDate}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>

                                    <FormGroup className=" row  " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.EstimatedQuantity} </Label>
                                        <Col md="7">
                                            < Input
                                                disabled
                                                name="EstimatedQuantity"
                                                type="text"
                                                className="text-end"
                                                placeholder="Enter EstimatedQuantity"
                                                value={`${values.EstimatedQuantity ? values.EstimatedQuantity : "0"}   Lot(${values.NumberOfLot ? values.NumberOfLot : "1"})`}
                                                autoComplete="off"
                                                style={{ backgroundColor: "white" }}
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

                                    <FormGroup className="row  " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.ActualQuantity}</Label>
                                        <Col md="7">
                                            <Input
                                                type="text"
                                                name="ActualQuantity"
                                                value={values.ActualQuantity}
                                                disabled={pageMode === mode.view ? true : false}

                                                className="text-end"
                                                placeholder="Enter ActualQuantity"
                                                autoComplete="off"
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.ActualQuantity.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ActualQuantity}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>

                                    <FormGroup className=" row" >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.BestBefore}</Label>
                                        <Col md="7">
                                            <C_DatePicker
                                                name="BestBefore"
                                                value={values.BestBefore}
                                                disabled={pageMode === mode.view ? true : false}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
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
                                                isDisabled={true}
                                                name="Name"
                                                value={values.ItemName}
                                                options={ItemDropdown_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }}
                                            />
                                            {isError.id.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.id}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>

                                    <br></br>
                                    <br></br>

                                    <FormGroup className=" row" >
                                        <Label className="col-md-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.UnitName}</Label>
                                        <Col md="7">
                                            <Select
                                                isDisabled={pageMode === mode.view ? true : false}
                                                name="UnitName"
                                                value={values.UnitName}
                                                options={UnitDropdown}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />
                                            {isError.id.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.id}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>

                                    <FormGroup className=" row  " >
                                        <Label className="col-md-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.PrintedBatchCode}</Label>
                                        <Col md="7">
                                            <Input
                                                type="text"
                                                name="PrintedBatchCode"
                                                value={values.PrintedBatchCode}
                                                disabled={pageMode === mode.view ? true : false}

                                                placeholder="Enter PrintedBatchCode"
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

                                <FormGroup className=" row " >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "168px" }}>{fieldLabel.Remark}</Label>
                                    <Col md="3">
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

                            </Row>
                        </div>

                        <div className="px-2 mb-1 mt-n3" style={{ marginRight: '-28px', marginLeft: "-8px" }}>
                            <Row>
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "", marginTop: "20px" }}>
                                        <SaveButton pageMode={pageMode}
                                            userAcc={userPageAccessState}
                                            module={"ProductionMaster"}
                                        />
                                    </Col>
                                </FormGroup >
                            </Row>
                        </div>
                    </form>
                </div >
            </React.Fragment >
        )
    } else {
        return null
    }
}
export default ProductionMaster;