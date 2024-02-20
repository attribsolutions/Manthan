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
    commonPageFieldSuccess
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    SaveMethodForGeneral,
    SaveMethodForGeneralSuccess,
    editGeneralIDSuccess,
    updateGeneralID,
    updateGeneralIDSuccess,
    genaral_Master_By_Type_Action,
    Genaral_Master_By_Type_ActionSuccess
} from "../../../store/Administrator/GeneralRedux/action";
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
import {
    breadcrumbReturnFunc,
    loginUserID,
    loginCompanyID,
    btnIsDissablefunc,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const GeneralMaster = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        TypeName: "",
        Name: "",
        IsActive: true
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState("");
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        Type = [],
        pageField,
        updateMsg,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.GeneralReducer.saveBtnloading,
            postMsg: state.GeneralReducer.postMsg,
            updateMsg: state.GeneralReducer.updateMessage,
            Type: state.GeneralReducer.Type,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.GENERAL
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(Genaral_Master_By_Type_ActionSuccess());
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
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

                const { id, Name, TypeName, TypeID, IsActive } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;
                hasValid.TypeName.valid = true;
                hasValid.IsActive.valid = true;

                values.id = id
                values.Name = Name;
                values.TypeName = { label: TypeName, value: TypeID };
                values.IsActive = IsActive;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editGeneralIDSuccess({ Status: false }))
        }
    }, [])


    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
        });
        dispatch(genaral_Master_By_Type_Action(jsonBody));
    }, []);

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SaveMethodForGeneralSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state)) //Clear form values 
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === "other") {
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
                    history.push({ pathname: url.GENERAL_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(SaveMethodForGeneralSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state)) // Clear form values 
            history.push({
                pathname: url.GENERAL_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateGeneralIDSuccess({ Status: false }));
            dispatch(
                customAlert({
                    Type: 3,
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

    const TypeDropdownOptions = Type.map((i) => ({ label: i.Name, value: i.id }))

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    TypeID: values.TypeName.value,
                    Company: loginCompanyID(),
                    IsActive: values.IsActive,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID()
                });
                if (pageMode === mode.edit) {
                    dispatch(updateGeneralID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(SaveMethodForGeneral({ jsonBody, btnId }));
                }

            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    // var IsEditMode_Css = ''
    // if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >
                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>
                                    
                                    <Card>
                                        <CardBody className="c_card_body">
                                           
                                            <Row>
                                                <Col md="4" >
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01"> {fieldLabel.TypeName} </Label>
                                                        <Col sm={12} >
                                                            <Select
                                                                name="TypeName"
                                                                value={values.TypeName}
                                                                autoFocus={true}
                                                                isSearchable={true}
                                                                isDisabled={(pageMode === "edit") ? true : false}
                                                                className="react-dropdown"
                                                                classNamePrefix="dropdown"
                                                                options={TypeDropdownOptions}
                                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                            />
                                                            {isError.TypeName.length > 0 && (
                                                                <span className="text-danger f-8"><small>{isError.TypeName}</small></span>
                                                            )}
                                                        </Col>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                                                    <Input
                                                        name="Name"
                                                        id="txtName"
                                                        value={values.Name}
                                                        type="text"
                                                        className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter Name"
                                                        autoComplete='off'
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
                                                <FormGroup className="mb-2 col col-sm-5">
                                                    <Row className="justify-content-md-left">
                                                        <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label">{fieldLabel.IsActive}</Label>
                                                        <Col md={2} style={{ marginTop: '9px' }} >
                                                            <div className="form-check form-switch form-switch-md mb-3">
                                                                <Input type="checkbox" className="form-check-input"
                                                                    checked={values.IsActive}
                                                                    name="IsActive"
                                                                    onChange={(e) => {
                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.IsActive = e.target.checked;
                                                                            return a
                                                                        })
                                                                    }}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </FormGroup>
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
                                                            module={"GeneralMaster"}
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
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default GeneralMaster

