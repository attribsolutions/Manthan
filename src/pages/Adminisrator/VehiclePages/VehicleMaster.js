import React, { useEffect, useState, } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Label,
    Row,
    Input,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/actions";
import {
    saveVehicleMaster,
    getVehicleList,
    getVehicleType_for_dropdown,
    saveVehicleMasterSuccess,
    getVehicleListSuccess,
    editVehicleID_Success,
    updateVehicleID,
    updateVehicleID_Success
} from "../../../store/Administrator/VehicleRedux/action";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, loginCompanyID, loginPartyID, loginUserID, btnIsDissablefunc, loginRoleID, metaTagLabel, } from "../../../components/Common/CommonFunction";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import PartyDropdownMaster from "../../../components/Common/PartyDropdownComp/PartyDropdown";

const VehicleMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const RoleID = loginRoleID()

    const fileds = {
        id: "",
        VehicleNumber: "",
        Description: "",
        VehicleTypeName: "",
        Party: ''
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        VehicleTypes,
        pageField,
        userAccess } = useSelector((state) => ({
            postMsg: state.VehicleReducer.postMsg,
            updateMsg: state.VehicleReducer.updateMsg,
            VehicleList: state.VehicleReducer.VehicleList,
            VehicleTypes: state.VehicleReducer.VehicleTypes,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField,
        }));

    useEffect(() => {
        const page_Id = pageId.VEHICLE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getVehicleType_for_dropdown());
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
            setUserAccState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time
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
                const { id, VehicleNumber, Description, VehicleType, VehicleTypeName, Party, PartyName } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.VehicleNumber.valid = true;
                hasValid.Description.valid = true;
                hasValid.VehicleTypeName.valid = true;
                hasValid.Party.valid = true;

                values.id = id
                values.VehicleNumber = VehicleNumber
                values.Description = Description
                values.VehicleTypeName = { label: VehicleTypeName, value: VehicleType };
                values.Party = { value: Party, label: PartyName }

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.RoleMaster))
                dispatch(editVehicleID_Success({ Status: false }))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, []);

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveVehicleMasterSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values  
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
                    RedirectPath: url.VEHICLE_lIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(getVehicleListSuccess({ Status: false }))
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
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))// Clear form values 
            history.push({
                pathname: url.VEHICLE_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateVehicleID_Success({ Status: false }));
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

    const VehicleType_DropdownOptions = VehicleTypes.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({

                    VehicleNumber: values.VehicleNumber,
                    Description: values.Description,
                    VehicleType: values.VehicleTypeName.value,
                    Party: RoleID === 2 ? values.Party.value : loginPartyID(),
                    Company: loginCompanyID(),
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID()
                });

                if (pageMode === mode.edit) {
                    dispatch(updateVehicleID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveVehicleMaster({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                    <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                        {RoleID === 2 ?
                            <PartyDropdownMaster
                                state={state}
                                setState={setState} />
                            : null}
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>

                                    <Col md={12}>
                                        <Card>
                                            <CardBody className="c_card_body">
                                                <Row>
                                                    <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.VehicleTypeName} </Label>
                                                        <Select
                                                            id="VehicleDropDown "
                                                            name="VehicleTypeName"
                                                            value={values.VehicleTypeName}
                                                            isSearchable={false}
                                                            className="react-dropdown"
                                                            classNamePrefix="dropdown"
                                                            options={VehicleType_DropdownOptions}
                                                            onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                        />
                                                        {isError.VehicleTypeName.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.VehicleTypeName}</small></span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>
                                                    <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.VehicleNumber} </Label>
                                                        <Input
                                                            name="VehicleNumber"
                                                            id="VehicleNumber"
                                                            value={values.VehicleNumber}
                                                            type="text"
                                                            className={isError.VehicleNumber.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter VehicleNumber"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })
                                                                dispatch(Breadcrumb_inputName(event.target.value))
                                                            }}
                                                        />
                                                        {isError.VehicleNumber.length > 0 && (
                                                            <span className="invalid-feedback">{isError.VehicleNumber}</span>
                                                        )}
                                                    </FormGroup>
                                                </Row>

                                                <Row className="mt-2">
                                                    <FormGroup className="mb-2 col col-sm-3 ">
                                                        <Label htmlFor="validationCustom01">{fieldLabel.Description} </Label>
                                                        <Input
                                                            name="Description"
                                                            id="Description"
                                                            value={values.Description}
                                                            type="text"
                                                            className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter Description"
                                                            autoComplete='off'
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })
                                                                dispatch(Breadcrumb_inputName(event.target.value))
                                                            }}
                                                        />
                                                        {isError.Description.length > 0 && (
                                                            <span className="invalid-feedback">{isError.Description}</span>
                                                        )}
                                                    </FormGroup>

                                                    <Col md="1">  </Col>

                                                    {/* {RoleID === 2 ?
                                                        <FormGroup className="mb-2 col col-sm-3 ">
                                                            <PartyDropdownMaster
                                                                fieldLabel={fieldLabel.Party}
                                                                state={values.Party}
                                                                setState={setState}
                                                            />
                                                        </FormGroup>
                                                        : null} */}

                                                </Row>


                                                <FormGroup>
                                                    <Row>
                                                        <Col sm={2} className="mt-3">
                                                            <SaveButton pageMode={pageMode}
                                                                onClick={SaveHandler}
                                                                userAcc={userPageAccessState}
                                                                editCreatedBy={editCreatedBy}
                                                                module={"VehicleMaster"}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </FormGroup >

                                            </CardBody>
                                        </Card>
                                    </Col>

                                </form>
                            </CardBody>
                        </Card>

                    </Container>
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

export default VehicleMaster

