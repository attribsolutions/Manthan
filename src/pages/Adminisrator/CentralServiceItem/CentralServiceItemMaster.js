import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
    editGroupIDSuccess,
    getBaseUnit_ForDropDown,
    saveGroupMaster,
    saveGroupMaster_Success,
    updateGroupID,
    updateGroupIDSuccess
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeCheckbox,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    CommonConsole,
    loginUserID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import { mode, url, pageId } from "../../../routes/index";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { saveMsgUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";
import { editCentralServiceItemSuccess, saveCentralServiceItem, saveCentralServiceItem_Success, updateCentralServiceItemID, updateCentralServiceItemIDSuccess } from "../../../store/Administrator/CentralServiceItemRedux/action";

const CentralServiceItem = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        GSTPercentage: "",
        HSNCode: "",
        Rate: "",
        isActive: false,
        Type: "",
        Unit: "",
        Company: ""

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        BaseUnit,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            BaseUnit: state.ItemMastersReducer.BaseUnit,
            saveBtnloading: state.CentralServiceItemReducer.saveBtnloading,
            postMsg: state.CentralServiceItemReducer.postMsg,
            updateMsg: state.CentralServiceItemReducer.updateMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    const { values } = state
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        const page_Id = pageId.CENTRAL_SERVICE_ITEM
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getBaseUnit_ForDropDown());


    }, []);

    // userAccess useEffect
    useEffect(() => userAccessUseEffect({
        props,
        userAccess,
        dispatch,
        setUserAccState,
    }), [userAccess]);




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

                const { id, Name, GSTPercentage, HSNCode, Rate, isActive, Type, Unit, UnitName } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.Name = Name;
                values.id = id;
                values.Rate = Rate
                values.isActive = isActive
                values.Type = Type
                values.Unit = { label: UnitName, value: Unit };
                values.GSTPercentage = GSTPercentage
                values.HSNCode = HSNCode



                hasValid.Name.valid = true;
                hasValid.Rate.valid = true;
                hasValid.isActive.valid = true;
                hasValid.Type.valid = true;
                hasValid.Unit.valid = true;
                hasValid.GSTPercentage.valid = true;
                hasValid.HSNCode.valid = true;



                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editCentralServiceItemSuccess({ Status: false }))
        }
    }, [])


    useEffect(() => saveMsgUseEffect({
        postMsg, pageMode,
        history, dispatch,
        postSuccss: saveCentralServiceItem_Success,
        resetFunc: { fileds, state, setState },
        listPath: url.CENTRAL_SERVICE_ITEM_lIST
    }), [postMsg])


    const BaseUnit_DropdownOptions = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));
    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))// Clear form values
            history.push({
                pathname: url.CENTRAL_SERVICE_ITEM_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateCentralServiceItemIDSuccess({ Status: false }));
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


    const SaveHandler = async (event) => {
        try {
            if (formValid(state, setState)) {

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    GSTPercentage: values.GSTPercentage,
                    HSNCode: values.HSNCode,
                    Rate: values.Rate,
                    isActive: values.isActive,
                    // Type: values.Type,
                    Company: 1,
                    Unit: values.Unit.value,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                });

                if (pageMode === mode.edit) {
                    dispatch(updateCentralServiceItemID({ jsonBody, updateId: values.id }));
                }
                else {
                    dispatch(saveCentralServiceItem({ jsonBody }));
                }

            }
        } catch (e) { CommonConsole(e) }
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

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black " >
                                <form noValidate>

                                    <Card>
                                        <CardBody className="c_card_body">
                                            <Row>

                                                <Col sm={6}>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-8 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                                                            <Input
                                                                name="Name"
                                                                id="txtName"
                                                                value={values.Name}
                                                                type="text"
                                                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter ItemName"
                                                                autoComplete='off'
                                                                autoFocus={true}
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(Breadcrumb_inputName(event.target.value))
                                                                }}
                                                            />
                                                            {isError.Name.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Name}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>
                                                    <Row>


                                                        <FormGroup className="mb-2 col col-sm-8 ">
                                                            <Label htmlFor="validationCustom01"> {fieldLabel.GSTPercentage} </Label>
                                                            <Col sm={12} >

                                                                <Input
                                                                    name="GSTPercentage"
                                                                    id="txtSequence"
                                                                    value={values.GSTPercentage}
                                                                    type="text"
                                                                    className={isError.GSTPercentage.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                    placeholder="Please Enter GST"
                                                                    autoComplete='off'
                                                                    onChange={(event) => {
                                                                        onChangeText({ event, state, setState })
                                                                    }}
                                                                />

                                                                {isError.GSTPercentage.length > 0 && (
                                                                    <span className="text-danger f-8"><small>{isError.GSTPercentage}</small></span>
                                                                )}
                                                            </Col>
                                                        </FormGroup>


                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-8 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Rate} </Label>
                                                            <Input
                                                                name="Rate"
                                                                id="txtName"
                                                                value={values.Rate}
                                                                type="text"
                                                                className={isError.Rate.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Rate"
                                                                autoComplete='off'
                                                                autoFocus={true}
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(Breadcrumb_inputName(event.target.value))
                                                                }}
                                                            />
                                                            {isError.Rate.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Rate}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>


                                                    <Row >
                                                        <Label
                                                            className="col-sm-2 col-form-label">
                                                            {fieldLabel.isActive}
                                                        </Label>
                                                        <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                            <div className="form-check form-switch form-switch-md mb-3">
                                                                <Input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    checked={values.isActive}

                                                                    name="isActive"
                                                                    onChange={(event) => onChangeCheckbox({ event, state, setState })}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                </Col>
                                                <Col sm={6}>


                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-8 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.HSNCode} </Label>
                                                            <Input
                                                                name="HSNCode"
                                                                id="txtSequence"
                                                                value={values.HSNCode}
                                                                type="text"
                                                                className={isError.HSNCode.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter HSNCode"
                                                                autoComplete='off'
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                }}
                                                            />
                                                            {isError.HSNCode.length > 0 && (
                                                                <span className="invalid-feedback">{isError.HSNCode}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>



                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-8 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Unit} </Label>
                                                            <Select
                                                                name="Unit"
                                                                isSearchable={true}
                                                                className="react-dropdown"
                                                                classNamePrefix="dropdown"
                                                                value={values.Unit}
                                                                options={BaseUnit_DropdownOptions}
                                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                                styles={{
                                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                                }}
                                                            />
                                                            {isError.Unit.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Unit}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>
                                                </Col>

                                            </Row>

                                            <FormGroup className="mt-1">
                                                <Row>
                                                    <Col sm={2}>
                                                        <SaveButton
                                                            loading={saveBtnloading}
                                                            pageMode={pageMode}
                                                            onClick={SaveHandler}
                                                            userAcc={userPageAccessState}
                                                            editCreatedBy={editCreatedBy}
                                                            module={"GroupMaster"}
                                                        />
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        </CardBody>
                                    </Card>
                                </form>
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default CentralServiceItem;

