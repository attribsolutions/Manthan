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
import { BreadcrumbShow, getCategoryTypelist } from "../../../store/actions";
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
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";

import { fieldData } from '../CategoryPages/FieldData';


const CategoryMaster = (props) => {

    let editDataGatingFromList = props.state;
    let pageModeProps = props.pageMode;

    const formRef = useRef(null);
    const history = useHistory()
    const dispatch = useDispatch();

    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("");
    const [CategoryTypes_dropdown_Select, setCategoryTypes_dropdown_Select] = useState("");
    const [userPageAccessState, setUserPageAccessState] = useState(123);


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse, CategoryAPI, pageFiled, RoleAccessModifiedinSingleArray } = useSelector((state) => ({
        PostAPIResponse: state.CategoryReducer.PostDataMessage,
        CategoryAPI: state.categoryTypeReducer.categoryTypeListData,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
        pageFiled: state.CommonPageFieldReducer.pageField
    }));

    {/** Dyanamic Page access state and OnChange function */ }
    {/*start */ }
    const [state, setState] = useState({
        values: {
            Name: "",
            ProductCategoryTypeName: ""
        },
        fieldLabel: {
            Name: '',

        },

        isError: {
            Name: "",

        },

        hasValid: {
            Name: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            ProductCategoryTypeName: {
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



    const onChangeText = (event) => {
        formValChange({ event, state, setState })
    }

    const onChangeDropDown = (e, v) => {
        const event = { name: v.name, value: e }
        formValChange({ event, state, setState })
    }

    useEffect(() => {
        comAddPageFieldFunc({ state, setState, fieldData })
    }, [fieldData])
    {/*End */ }



    //userAccess useEffect
    useEffect(() => {

        let userAcc = undefined
        if ((editDataGatingFromList === undefined)) {

            let locationPath = history.location.pathname
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === locationPath)
            })
        }
        else if (!(editDataGatingFromList === undefined)) {
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
        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList);
            setPageMode(pageModeProps);
            setCategoryTypes_dropdown_Select({

                value: editDataGatingFromList.ProductCategoryType_id,
                label: editDataGatingFromList.ProductCategoryTypeName
            })
            dispatch(editCategoryIDSuccess({ Status: false }))
            dispatch(BreadcrumbShow(editDataGatingFromList.Name))
            return
        }
    }, [editDataGatingFromList])


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
                ProductCategoryType: values.ProductCategoryTypeName.value,
            });

            if (pageMode === "edit") {
                dispatch(updateCategoryID(jsonBody, EditData.id));
            }
            else {
                dispatch(PostMethodForCategory(jsonBody));
                console.log("jsonBody", jsonBody)
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
                                                                onChange={(e) => {
                                                                    onChangeText(e)
                                                                    dispatch(BreadcrumbShow(e.target.value))
                                                                }}
                                                            />
                                                            {isError.Name.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Name}</span>
                                                            )}
                                                        </FormGroup>

                                                        <Row>
                                                            <Col md="4">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> {fieldLabel.ProductCategoryTypeName} </Label>
                                                                    <Col sm={12}>
                                                                        <Select
                                                                            name="ProductCategoryTypeName"
                                                                            Value={values.categorytype}
                                                                            isSearchable={false}
                                                                            className="react-dropdown"
                                                                            classNamePrefix="dropdown"
                                                                            onChange={onChangeDropDown}
                                                                            options={CategoryTypesValues}

                                                                        />


                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    <div>
                                                                        {
                                                                            pageMode === "edit" ?
                                                                                userPageAccessState.RoleAccess_IsEdit ?
                                                                                    <button
                                                                                        type="submit"
                                                                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Category"
                                                                                        className="btn btn-success w-md"
                                                                                    >
                                                                                        <i class="fas fa-edit me-2"></i>Update
                                                                                    </button>
                                                                                    :
                                                                                    <></>
                                                                                : (
                                                                                    userPageAccessState.RoleAccess_IsSave ?
                                                                                        <button
                                                                                            type="submit"
                                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Category"
                                                                                            className="btn btn-primary w-sm">
                                                                                            <i className="fas fa-save me-2"></i>
                                                                                            Save

                                                                                        </button>
                                                                                        :
                                                                                        <></>
                                                                                )
                                                                        }
                                                                    </div>
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

