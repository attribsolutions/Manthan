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
import { BreadcrumbShow, commonPageField, getCategoryTypelist } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    editCategoryIDSuccess, getMethodForCategory,
    PostMethodForCategory,
    PostMethod_ForCategoryAPISuccess,
    updateCategoryID
} from "../../../store/Administrator/CategoryRedux/action";
import { AlertState } from "../../../store/actions";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValChange,
    formValid,
    onChangeSelect,
    onChangeText,

} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";


import { SaveButton } from "../../../components/CommonSaveButton";


const CategoryMaster = (props) => {

    let editDataGetingFromList = props.state;
    let pageModeProps = props.pageMode;

    const formRef = useRef(null);
    const history = useHistory()
    const dispatch = useDispatch();

    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("");
    const [CategoryTypes_dropdown_Select, setCategoryTypes_dropdown_Select] = useState("");
    const [userPageAccessState, setUserPageAccessState] = useState(123);


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse, CategoryAPI, pageField, RoleAccessModifiedinSingleArray } = useSelector((state) => ({
        PostAPIResponse: state.CategoryReducer.PostDataMessage,
        CategoryAPI: state.categoryTypeReducer.categoryTypeListData,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    {/** Dyanamic Page access state and OnChange function */ }
    {/*start */ }
    const [state, setState] = useState({
        values: {
            Name: "",
            CategoryTypeName: ""
        },
        fieldLabel: {
            Name: '',
            CategoryTypeName: '',
        },

        isError: {
            Name: "",
            CategoryTypeName: ""
        },

        hasValid: {
            Name: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            CategoryTypeName: {
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
        // dispatch(commonPageFieldSuccess([]));
        dispatch(commonPageField(18))
    }, []);

    //userAccess useEffect
    useEffect(() => {

        let userAcc = undefined
        if ((editDataGetingFromList === undefined)) {

            let locationPath = history.location.pathname
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === locationPath)
            })
        }
        else if (!(editDataGetingFromList === undefined)) {
            let relatatedPage = props.relatatedPage
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === relatatedPage)
            })

        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }

    }, [RoleAccessModifiedinSingleArray])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
        if (!(editDataGetingFromList === undefined)) {
            setEditData(editDataGetingFromList);
            setPageMode(pageModeProps);
            setCategoryTypes_dropdown_Select({

                value: editDataGetingFromList.CategoryType_id,
                label: editDataGetingFromList.CategoryTypeName
            })
            dispatch(editCategoryIDSuccess({ Status: false }))
            dispatch(BreadcrumbShow(editDataGetingFromList.Name))
            return
        }
    }, [editDataGetingFromList])


    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            setCategoryTypes_dropdown_Select('')
            dispatch(PostMethod_ForCategoryAPISuccess({ Status: false }))
            formRef.current.reset();
            if (pageMode === "other") {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PostAPIResponse.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PostAPIResponse.Message,
                    RedirectPath: '/CategoryList',
                }))
            }
        }
        else if (PostAPIResponse.Status === true) {
            dispatch(PostMethod_ForCategoryAPISuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse])

    useEffect(() => {
        if (pageField.length > 0) {
            comAddPageFieldFunc({ state, setState, pageField })
        }
    }, [pageField])

    //get method for dropdown
    useEffect(() => {
        dispatch(getCategoryTypelist());
    }, [dispatch]);


    function handllerCategoryTypes(e) {
        setCategoryTypes_dropdown_Select(e)
    }

    const CategoryTypesValues = CategoryAPI.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                Name: values.Name,
                CategoryType: values.CategoryTypeName.value,
            });

            if (pageMode === "edit") {
                dispatch(updateCategoryID(jsonBody, EditData.id));
            }
            else {
                dispatch(PostMethodForCategory(jsonBody));

            }
        }
    };


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

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

                                                        <Row>
                                                            <Col md="4">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> {fieldLabel.CategoryTypeName} </Label>
                                                                    <Col sm={12}>
                                                                        <Select   
                                                                            name="CategoryTypeName"
                                                                            Value={values.CategoryType}
                                                                            isSearchable={false}
                                                                            className="react-dropdown"
                                                                            classNamePrefix="dropdown"
                                                                            onChange={(v, e) => onChangeSelect({ e, v, state, setState })}
                                                                            options={CategoryTypesValues}
                                                                            styles={{
                                                                                control: base => ({
                                                                                    ...base,
                                                                                    border: isError.CategoryTypeName.length > 0 ? '1px solid red' : '',

                                                                                })
                                                                            }}
                                                                        />
                                                                        {isError.CategoryTypeName.length > 0 && (
                                                                            <span className="text-danger f-8"><small>{isError.CategoryTypeName}</small></span>
                                                                        )}
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    {SaveButton({ pageMode, userPageAccessState, module: "CategoryMaster" })}
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

export default CategoryMaster

