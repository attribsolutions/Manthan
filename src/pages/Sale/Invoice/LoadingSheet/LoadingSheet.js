import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr"
import { Breadcrumb_inputName, commonPageFieldSuccess, getItemList } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,

} from "../../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import { Go_Button, SaveButton } from "../../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import {
    editBOMListSuccess,
    postBOM,
    postBOMSuccess,
    updateBOMList,
    updateBOMListSuccess
} from "../../../../store/Production/BOMRedux/action";
import { breadcrumbReturn, loginUserID, loginCompanyID, loginPartyID, currentDate } from "../../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import * as mode from "../../../../routes/PageMode";
import { GetRoutesList } from "../../../../store/Administrator/RoutesRedux/actions";
import { invoiceListGoBtnfilter } from "../../../../store/Sales/Invoice/action";
import { getVehicleList } from "../../../../store/Administrator/VehicleRedux/action";

const LoadingSheet = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [ItemTabDetails, setItemTabDetails] = useState([])
    const [orderlistFilter, setorderlistFilter] = useState({ todate: currentDate, fromdate: currentDate, });

    const fileds = {
        id: "",
        LoadingDate: "",
        FromDate: "",
        ToDate: "",
        RouteName: "",
        VehicleNumber: "",
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        VehicleNumber,
        RoutesList,
        GoButton
    } = useSelector((state) => ({
        postMsg: state.BOMReducer.PostData,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        VehicleNumber: state.VehicleReducer.VehicleList,
        RoutesList: state.RoutesReducer.RoutesList,
        GoButton: state.InvoiceReducer.Invoicelist
    }));
    const { fromdate, todate } = orderlistFilter;
    useEffect(() => {
        const page_Id = pageId.LOADING_SHEET
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(GetRoutesList());
        dispatch(getVehicleList())
        dispatch(invoiceListGoBtnfilter())

    }, []);

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
            setUserPageAccessState(userAcc)
            breadcrumbReturn({ dispatch, userAcc });
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
                let ItemUnits = hasEditVal.ParentUnitDetails.map((data) => ({
                    value: data.Unit,
                    label: data.UnitName
                }))
                // setItemUnitOptions(ItemUnits)
                setEditData(hasEditVal);
                const { id, BomDate, Item, ItemName, Unit, UnitName, EstimatedOutputQty, Comment, IsActive, IsVDCItem } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                hasValid.id.valid = true;
                hasValid.BomDate.valid = true;
                hasValid.ItemName.valid = true;
                hasValid.UnitName.valid = true;
                hasValid.EstimatedOutputQty.valid = true;
                hasValid.Comment.valid = true;
                hasValid.IsActive.valid = true;
                hasValid.IsVDCItem.valid = true;

                values.id = id
                values.BomDate = BomDate;
                values.EstimatedOutputQty = EstimatedOutputQty;
                values.Comment = Comment;
                values.IsActive = IsActive;
                values.ItemName = { label: ItemName, value: Item };
                values.UnitName = { label: UnitName, value: Unit };
                values.IsVDCItem = IsVDCItem;
                setItemTabDetails(hasEditVal.BOMItems)
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(editBOMListSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
            }
        }
    }, [])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postBOMSuccess({ Status: false }))
            // setState(() => resetFunction(fileds, state))// Clear form values  
            // saveDissable(false);//save Button Is enable function
            dispatch(Breadcrumb_inputName(''))

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
                    RedirectPath: url.BIllOf_MATERIALS_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(postBOMSuccess({ Status: false }))
            // saveDissable(false);//save Button Is enable function
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
            // saveDissable(false);//Update Button Is enable function
            // setState(() => resetFunction(fileds, state))// Clear form values  
            history.push({
                pathname: url.BIllOf_MATERIALS_LIST,
            })
        } else if ((updateMsg.Status === true) && (updateMsg.StatusCode === 100) && !(modalCss)) {
            dispatch(updateBOMListSuccess({ Status: false }));
            dispatch(AlertState({
                Type: 6, Status: true,
                Message: JSON.stringify(updateMsg.Message),
                PermissionFunction: PermissionFunction,

            }));
        }
        else if (updateMsg.Status === true && !modalCss) {
            // saveDissable(false);//Update Button Is enable function
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
    }, [pageField])

    const RoutesListOptions = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
        IsActive: index.IsActive
    }));

    const RouteName_Options = RoutesListOptions.filter((index) => {
        return index.IsActive === true
    });

    const VehicleNumber_Options = VehicleNumber.map((index) => ({
        value: index.id,
        label: index.VehicleNumber,
    }));

    function PermissionFunction() {
        let event = { preventDefault: () => { } }
        SaveHandler({ event, mode: true })
    }

    function goButtonHandler() {
        debugger
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Customer: "",
            Party: loginPartyID(),
            IBType: ""
        });

        dispatch(invoiceListGoBtnfilter(url.LOADING_SHEET, jsonBody));
    }

    const SaveHandler = (event) => {
        event.preventDefault();
        const BOMItems = ItemTabDetails.map((index) => ({
            Item: index.Item,
            Quantity: index.Quantity,
            Unit: index.Unit
        }))
        if (formValid(state, setState)) {

            let BOMrefID = 0
            if ((pageMode === mode.edit)) {
                BOMrefID = EditData.id
            };

            const jsonBody = JSON.stringify({
                // BomDate: values.BomDate,
                // EstimatedOutputQty: values.EstimatedOutputQty,
                // Comment: values.Comment,
                // IsActive: values.IsActive,
                // Item: values.ItemName.value,
                // Unit: values.UnitName.value,
                // CreatedBy: loginUserID(),
                // Company: loginCompanyID(),
                // BOMItems: BOMItems,
                // IsVDCItem: values.IsVDCItem,
                // ReferenceBom: BOMrefID
            });


            // saveDissable(true);//save Button Is dissable function

            // if (pageMode === mode.edit) {
            //     dispatch(updateBOMList(jsonBody, `${EditData.id}/${EditData.Company}`));
            // }
            // else {
            //     dispatch(postBOM(jsonBody));
            // }
        }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form onSubmit={(event) => SaveHandler(event)} noValidate>
                        <div className="px-2 c_card_filter header text-black" >
                            <div className=" row  ">
                                <Col sm="6">
                                    <FormGroup className="mb-2 row mt-2  ">
                                        <Label className="mt-2" style={{ width: "115px" }}>{fieldLabel.LoadingDate} </Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name="LoadingDate"
                                                value={values.LoadingDate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="0,''"
                                                disabled={pageMode === mode.edit ? true : false}
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                    defaultDate: (pageMode === mode.edit) ? values.LoadingDate : "today"
                                                }}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />
                                            {isError.LoadingDate.length > 0 && (
                                                <span className="invalid-feedback">{isError.LoadingDate}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <div className=" row  ">
                                    <Col sm="6">
                                        <FormGroup className="mb-2 row mt-2  ">
                                            <Label className="mt-2" style={{ width: "115px" }}>{fieldLabel.FromDate} </Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    name="FromDate"
                                                    value={fromdate}
                                                    className="form-control d-block p-2 bg-white text-dark"
                                                    placeholder="YYYY-MM-DD"
                                                    autoComplete="0,''"
                                                    disabled={pageMode === mode.edit ? true : false}
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                        defaultDate: (pageMode === mode.edit) ? values.FromDate : "today"
                                                    }}
                                                    onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                    onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                />
                                                {isError.FromDate.length > 0 && (
                                                    <span className="invalid-feedback">{isError.FromDate}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="mb-2 row mt-2  ">
                                            <Label className="mt-2" style={{ width: "115px" }}>{fieldLabel.ToDate} </Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    name="ToDate"
                                                    value={todate}
                                                    className="form-control d-block p-2 bg-white text-dark"
                                                    placeholder="YYYY-MM-DD"
                                                    autoComplete="0,''"
                                                    disabled={pageMode === mode.edit ? true : false}
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                        defaultDate: (pageMode === mode.edit) ? values.ToDate : "today"
                                                    }}
                                                    onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                    onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                />
                                                {isError.ToDate.length > 0 && (
                                                    <span className="invalid-feedback">{isError.ToDate}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </div>

                                <div className=" row  ">
                                    <Col sm="6">
                                        <FormGroup className="mb-2 row mt-2 ">
                                            <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.RouteName} </Label>
                                            <Col sm={7}>
                                                <Select
                                                    name="RouteName"
                                                    value={values.RouteName}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={RouteName_Options}
                                                    onChange={(hasSelect, evn) => {
                                                        onChangeSelect({ hasSelect, evn, state, setState });
                                                    }
                                                    }
                                                />
                                                {/* {isError.RouteName.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.RouteName}</small></span>
                                                )} */}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="mb-2 row mt-2 ">
                                            <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.VehicleNumber} </Label>
                                            <Col sm={7}>
                                                <Select
                                                    name="VehicleNumber"
                                                    value={values.VehicleNumber}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={VehicleNumber_Options}
                                                    onChange={(hasSelect, evn) => {
                                                        onChangeSelect({ hasSelect, evn, state, setState });
                                                    }
                                                    }
                                                />
                                                {/* {isError.VehicleNumber.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.VehicleNumber}</small></span>
                                                )} */}
                                            </Col>
                                        </FormGroup>

                                    </Col>
                                    <Col sm={1}>
                                        < Go_Button onClick={(e) => goButtonHandler()} />
                                    </Col>
                                </div>

                            </div>
                        </div>


                        {<FormGroup>
                            <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                <SaveButton pageMode={pageMode}
                                    //   onClick={onsave}
                                    userAcc={userPageAccessState}
                                    module={"LoadingSheet"}
                                />
                            </Col>
                        </FormGroup >}
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

export default LoadingSheet
