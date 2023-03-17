import React, { useEffect, useState, } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
    editSubGroupIDSuccess,
    getGroupList,
    getSubGroupList,
    getSubGroupListSuccess,
    saveSubGroupList,
    saveSubGroupSuccess,
    updateSubGroupID,
    updateSubgroupIDSuccess
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction,
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, btnIsDissablefunc, loginUserID } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode";

const SubGroupMaster = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        Group: "",
        GroupName: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [EditData, setEditData] = useState({});
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        groupList,
        updateMsg,
        pageField,
        userAccess } = useSelector((state) => ({
            postMsg: state.SubGroupReducer.postMsg,
            updateMsg: state.SubGroupReducer.updateMsg,
            groupList: state.GroupReducer.groupList,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.SUBGROUP
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getGroupList())
        dispatch(getSubGroupList());
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
                setEditData(hasEditVal)

                const { id, Name, Group, GroupName } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.Name = Name;
                values.id = id
                values.Group = Group
                values.GroupName = { label: GroupName, value: Group };

                hasValid.id.valid = true;
                hasValid.Name.valid = true;
                hasValid.GroupName.valid = true;
                hasValid.Group.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editSubGroupIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => { 

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveSubGroupSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values  
            dispatch(Breadcrumb_inputName())

            if (pageMode === "other") {
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
                    RedirectPath: url.SUBGROUP_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(getSubGroupListSuccess({ Status: false }))
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
                pathname: url.SUBGROUP_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateSubgroupIDSuccess({ Status: false }));
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

    const GroupValues = groupList.map((Data) => ({
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
                    Group: values.GroupName.value,
                    CreatedBy: loginUserID(),
                    CreatedOn: "2022-11-19T00:00:00",
                    UpdatedBy: loginUserID(),
                    UpdatedOn: "2022-11-19T00:00:00"
                });

                if (pageMode === mode.edit) {
                    dispatch(updateSubGroupID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveSubGroupList({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                        {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.SUBGROUP} /> */}
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" >
                                <form noValidate>
                                    <Row className="">
                                        <Col md={12} style={{ height: "9cm" }}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    <Row>
                                                        <Col sm="4">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                                                                <Col>
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
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>

                                                        <Row>
                                                            <FormGroup className="mb-3 col col-sm-4 ">
                                                                <Label htmlFor="validationCustom01"> {fieldLabel.GroupName} </Label>
                                                                <Select
                                                                    name="GroupName"
                                                                    value={values.GroupName}
                                                                    isSearchable={true}
                                                                    className="react-dropdown"
                                                                    options={GroupValues}
                                                                    onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                                    classNamePrefix="dropdown"
                                                                />
                                                                {isError.GroupName.length > 0 && (
                                                                    <span className="text-danger f-8"><small>{isError.GroupName}</small></span>
                                                                )}
                                                            </FormGroup>
                                                        </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    <SaveButton pageMode={pageMode}
                                                                        onClick={SaveHandler}
                                                                        userAcc={userPageAccessState}
                                                                        editCreatedBy={editCreatedBy}
                                                                        module={"GroupMaster"}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup >
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
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

export default SubGroupMaster





























