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
import { getGroupTypeslist } from "../../../store/Administrator/GroupTypeRedux/action";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    btnIsDissablefunc,
    loginUserID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import { mode, url, pageId } from "../../../routes/index";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import GroupTypeMaster from "../GroupTypePage/GroupTypeMaster";
import AddMaster from "../EmployeePages/Drodown";
import { saveMsgUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";

const CentralServiceItem = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        ItemName: "",
        GST: "",
        HSNCode: "",
        Rate: "",
        IsActive: "",
        Type: "",
        Unit: "",

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [groupTypeMaster_AddAccess, setGroupTypeMaster_AddAccess] = useState(false)

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        GroupTypeAPI,
        updateMsg,
        pageField,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.GroupReducer.saveBtnloading,
            postMsg: state.GroupReducer.postMsg,
            updateMsg: state.GroupReducer.updateMsg,
            GroupTypeAPI: state.GroupTypeReducer.GroupType,
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
        dispatch(getGroupTypeslist())

    }, []);

    // userAccess useEffect
    useEffect(() => userAccessUseEffect({
        props,
        userAccess,
        dispatch,
        setUserAccState,
        otherloginAccss
    }), [userAccess]);

    const otherloginAccss = (index) => {
        if (index.id === pageId.GROUPTYPE) {
            setGroupTypeMaster_AddAccess(true)
        }

    }


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


                const { id, Name, GroupType, GroupTypeName, Sequence } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.Name = Name;
                values.id = id
                values.GroupTypeName = { label: GroupTypeName, value: GroupType };
                values.Sequence = Sequence

                hasValid.Name.valid = true;
                hasValid.GroupTypeName.valid = true;
                hasValid.Sequence.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editGroupIDSuccess({ Status: false }))
        }
    }, [])


    useEffect(() => saveMsgUseEffect({
        postMsg, pageMode,
        history, dispatch,
        postSuccss: saveGroupMaster_Success,
        resetFunc: { fileds, state, setState },
        listPath: url.GROUP_lIST
    }), [postMsg])


    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))// Clear form values
            history.push({
                pathname: url.GROUP_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateGroupIDSuccess({ Status: false }));
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

    const GroupTypesValues = GroupTypeAPI.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    GroupType: values.GroupTypeName.value,
                    Sequence: values.Sequence,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                });

                if (pageMode === mode.edit) {
                    dispatch(updateGroupID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveGroupMaster({ jsonBody, btnId }));
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
                                                            <Label htmlFor="validationCustom01">{fieldLabel.ItemName} </Label>
                                                            <Input
                                                                name="ItemName"
                                                                id="txtName"
                                                                value={values.ItemName}
                                                                type="text"
                                                                className={isError.ItemName.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter ItemName"
                                                                autoComplete='off'
                                                                autoFocus={true}
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(Breadcrumb_inputName(event.target.value))
                                                                }}
                                                            />
                                                            {isError.ItemName.length > 0 && (
                                                                <span className="invalid-feedback">{isError.ItemName}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>
                                                    <Row>


                                                        <FormGroup className="mb-2 col col-sm-8 ">
                                                            <Label htmlFor="validationCustom01"> {fieldLabel.GST} </Label>
                                                            <Col sm={12} >

                                                                <Input
                                                                    name="Type"
                                                                    id="txtSequence"
                                                                    value={values.GST}
                                                                    type="text"
                                                                    className={isError.GST.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                    placeholder="Please Enter Type"
                                                                    autoComplete='off'
                                                                    onChange={(event) => {
                                                                        onChangeText({ event, state, setState })
                                                                    }}
                                                                />

                                                                {isError.GST.length > 0 && (
                                                                    <span className="text-danger f-8"><small>{isError.GST}</small></span>
                                                                )}
                                                            </Col>
                                                        </FormGroup>


                                                    </Row>

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


                                                    <Row >
                                                        <Label
                                                            className="col-sm-2 col-form-label">
                                                            {fieldLabel.IsActive}
                                                        </Label>
                                                        <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                            <div className="form-check form-switch form-switch-md mb-3">
                                                                <Input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    checked={values.IsActive}

                                                                    name="IsActive"
                                                                    onChange={(event) => onChangeCheckbox({ event, state, setState })}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                </Col>
                                                <Col sm={6}>

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
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-8 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Unit} </Label>
                                                            <Input
                                                                name="Unit"
                                                                id="txtSequence"
                                                                value={values.Unit}
                                                                type="text"
                                                                className={isError.Unit.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Unit"
                                                                autoComplete='off'
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                }}
                                                            />
                                                            {isError.Unit.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Unit}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>


                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-8 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Type} </Label>
                                                            <Select
                                                                name="GST"
                                                                value={values.Type}
                                                                isSearchable={true}
                                                                className="react-dropdown"
                                                                classNamePrefix="dropdown"
                                                                // options={GroupTypesValues}
                                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}

                                                            />
                                                            {isError.Type.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Type}</span>
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

