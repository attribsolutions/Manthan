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
    getGroupListSuccess,
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
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { getGroupTypeslist } from "../../../store/Administrator/GroupTypeRedux/action";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginUserID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";

import { mode, url, pageId } from "../../../routes/index";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import GroupTypeMaster from "../GroupTypePage/GroupTypeMaster";
import AddMaster from "../EmployeePages/Drodown";
import { saveMsgUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";

const GroupMaster = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        GroupTypeName: ""
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
        userAccess } = useSelector((state) => ({
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
        const page_Id = pageId.GROUP
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

                const { id, Name, GroupType, GroupTypeName } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.Name = Name;
                values.id = id
                values.GroupTypeName = { label: GroupTypeName, value: GroupType };

                hasValid.Name.valid = true;
                hasValid.GroupTypeName.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editGroupIDSuccess({ Status: false }))
        }
    }, [])

    // useEffect(async () => {

    //     if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
    //         dispatch(saveGroupMaster_Success({ Status: false }))
    //         setState(() => resetFunction(fileds, state))//Clear form values
    //         dispatch(Breadcrumb_inputName(''))

    //         if (pageMode === "other") {
    //             customAlert({
    //                 Type: 1,
    //                 Message: postMsg.Message,
    //             })
    //         }
    //         else {
    //             const promise = await customAlert({
    //                 Type: 1,
    //                 Message: postMsg.Message,
    //             })
    //             if (promise) {
    //                 history.push({
    //                     pathname: url.GROUP_lIST,
    //                 })
    //             }
    //         }
    //     }
    //     else if (postMsg.Status === true) {
    //         dispatch(getGroupListSuccess({ Status: false }))
    //         customAlert({
    //             Type: 4,
    //             Message: JSON.stringify(postMessage.Message),
    //         })
    //     }
    // }, [postMsg])

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

                                                <Col md="4" >
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01"> {fieldLabel.GroupTypeName} </Label>
                                                        <Col sm={12} >
                                                            <Select
                                                                name="GroupTypeName"
                                                                value={values.GroupTypeName}
                                                                isSearchable={true}
                                                                className="react-dropdown"
                                                                classNamePrefix="dropdown"
                                                                options={GroupTypesValues}
                                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}

                                                            />
                                                            {isError.GroupTypeName.length > 0 && (
                                                                <span className="text-danger f-8"><small>{isError.GroupTypeName}</small></span>
                                                            )}
                                                        </Col>
                                                    </FormGroup>
                                                </Col>

                                                {(groupTypeMaster_AddAccess) &&
                                                    <Col md="1" className=" mt-3">
                                                        <AddMaster
                                                            masterModal={GroupTypeMaster}
                                                            masterPath={url.GROUPTYPE}
                                                        />
                                                    </Col>}
                                            </Row>

                                            <FormGroup className="mt-1">
                                                <Row>
                                                    <Col sm={2}>
                                                        <SaveButton
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

export default GroupMaster

