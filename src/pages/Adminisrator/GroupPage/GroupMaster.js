import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
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
import { AvField, AvForm, } from "availity-reactstrap-validation";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShow, commonPageField, commonPageFieldSuccess, editGroupIDSuccess, getGroupList, postGroupList, PostMethod_GroupList_Success, updateGroupID } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/actions";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    onChangeSelect,
    onChangeText,

} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";


import { SaveButton } from "../../../components/CommonSaveButton";
import { getGroupTypeslist } from "../../../store/Administrator/GroupTypeRedux/action";



const GroupMaster = (props) => {

    const formRef = useRef(null);
    const history = useHistory()
    const dispatch = useDispatch();

    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("");
    const [modalCss, setModalCss] = useState(false);

    const [GroupTypes_dropdown_Select, setGroupTypes_dropdown_Select] = useState("");
    const [userPageAccessState, setUserPageAccessState] = useState(123);


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMessage,
        GroupTypeAPI,
        pageField,
        userAccess } = useSelector((state) => ({
            postMessage:state.GroupReducer.postMessage,
            GroupTypeAPI: state.GroupTypeReducer.GroupType,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));


    {/** Dyanamic Page access state and OnChange function */ }
    {/*start */ }
    const [state, setState] = useState({
        values: {
            id:"",
            Name: "",
            GroupTypeName: ""
        },
        fieldLabel: {
            Name: '',
            GroupTypeName: '',
        },

        isError: {
            Name: "",
            GroupTypeName: ""
        },

        hasValid: {
            Name: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            GroupTypeName: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
        },
        required: {

        }
    })
    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;


    {/*End */ }

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(119))
        dispatch(getGroupTypeslist())
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

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
        };
    }, [userAccess])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    // useEffect(() => {

    //     if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
    //     if ((hasShowloction || hasShowModal)) {

    //         let hasEditVal = null
    //         if (hasShowloction) {
    //             setPageMode(location.pageMode)
    //             hasEditVal = location.editValue
    //         }
    //         else if (hasShowModal) {
    //             hasEditVal = props.editValue
    //             setPageMode(props.pageMode)
    //             setModalCss(true)
    //         }

    //         if (hasEditVal) {
    //             setGroupTypes_dropdown_Select({

    //                 value: hasEditVal.GroupType_id,
    //                 label: hasEditVal.GroupTypeName
    //             })
    //             // dispatch(editCategoryIDSuccess({ Status: false }))
    //             dispatch(BreadcrumbShow(hasEditVal.Name))
    //             return
    //         }
    //     }
    // }, [])

    useEffect(() => {
        debugger
        // if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
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
            
                const { id, Name, GroupTypeName} = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.Name = Name;
                values.GroupTypeName = GroupTypeName;
                values.id= id
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(BreadcrumbShow(hasEditVal.GroupMaster))

            }
            dispatch(editGroupIDSuccess({ Status: false }))
        }
    }, [])


    useEffect(() => {

        if ((postMessage.Status === true) && (postMessage.StatusCode === 200)) {
            setGroupTypes_dropdown_Select('')
            dispatch(PostMethod_GroupList_Success({ Status: false }))
            formRef.current.reset();
            if (pageMode === "other") {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMessage.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMessage.Message,
                    RedirectPath: '/GroupList',
                }))
            }
        }
        else if (postMessage.Status === true) {
            dispatch(PostMethod_GroupList_Success({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMessage])

    useEffect(() => {
      
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })// new change
        }
    }, [pageField])


    // get method for dropdown
    useEffect(() => {
        dispatch(getGroupList());
    }, [dispatch]);


    function handllerGroupTypes(e) {
        setGroupTypes_dropdown_Select(e)
    }

    const GroupTypesValues = GroupTypeAPI.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                Name: values.Name,
                GroupTypeName: values.GroupTypeName.values,
            });

            if (pageMode === "edit") {
                dispatch(updateGroupID(jsonBody, EditData.id));
            }
            else {
                dispatch(postGroupList(jsonBody));

            }
        }
    };


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode ==="dropdownAdd")) {IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>{userPageAccessState.PageHeading} | FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form onSubmit={formSubmitHandler} ref={formRef} noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>
                                                        
                                                    <Col md="4">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> {fieldLabel.GroupTypeName} </Label>
                                                                    <Col sm={12}>
                                                                        <Select
                                                                            name="GroupTypename"
                                                                            Value={values.GroupTypeName}
                                                                            isSearchable={false}
                                                                            className="react-dropdown"
                                                                            classNamePrefix="dropdown"
                                                                            onChange={(v, e) => onChangeSelect({ e, v, state, setState })}
                                                                            options={GroupTypesValues}
                                                                            styles={{
                                                                                control: base => ({
                                                                                    ...base,
                                                                                    border: isError.GroupTypeName.length > 0 ? '1px solid red' : '',

                                                                                })
                                                                            }}
                                                                        />
                                                                        {isError.GroupTypeName.length > 0 && (
                                                                            <span className="text-danger f-8"><small>{isError.GroupTypeName}</small></span>
                                                                        )}
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                      

                                                        <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                                                            <Input
                                                                name="Name"
                                                                id="txtName"
                                                                value={EditData.Name}
                                                                type="text"
                                                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Name"
                                                                autoComplete='off'
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(BreadcrumbShow(event.target.value))
                                                                }}

                                                            />
                                                            {isError.Name.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Name}</span>
                                                            )}
                                                        </FormGroup>







                                                        </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    {SaveButton({ pageMode, userPageAccessState, module: "GroupMaster" })}
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

