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
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import {
    editSubCategoryIDSuccess,
    PostMethodForSubCategory,
    PostMethod_ForSubCategoryAPISuccess,
    updateSubCategoryID
} from "../../../store/Administrator/SubCategoryRedux/action";
import { AlertState, BreadcrumbShow, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { getCategorylist } from "../../../store/Administrator/CategoryRedux/action";
import {
    comAddPageFieldFunc,
    formValChange,
    formValid,
    onChangeSelect,
    onChangeText,
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import SaveButton from "../../../components/Common/CmponentRelatedCommonFile/SearchBox/CommonSaveButton";

const SubCategoryMaster = (props) => {

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGetingFromList = props.state;
    let pageModeProps = props.pageMode;

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory()

    const [pageMode, setPageMode] = useState("");
    const [EditData, setEditData] = useState([]);
    const [category_dropdown_Select, setCategory_dropdown_Select] = useState("");
    const [userPageAccessState, setUserPageAccessState] = useState(123);



    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        PostAPIResponse,
        CategoryAPI,
        pageField,
        RoleAccessModifiedinSingleArray
    } = useSelector((state) => ({
        PostAPIResponse: state.SubCategoryReducer.PostDataMessage,
        CategoryAPI: state.CategoryReducer.CategoryListData,
        pageField: state.CommonPageFieldReducer.pageField,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,

    }));


    {/** Dyanamic Page access state and OnChange function */ }
    {/*start */ }
    const [state, setState] = useState({
        values: {
            Name: "",
            ProductCategoryName: "",
        },
        fieldLabel: {
            Name: '',
            Category: '',
        },

        isError: {
            Name: "",
            ProductCategoryName: "",

        },

        hasValid: {
            Name: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            ProductCategoryName: {
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


    useEffect(() => {
        // dispatch(commonPageFieldSuccess([]));
        dispatch(commonPageField(90))
    }, []);
    {/*End */ }



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

    useEffect(() => {
        dispatch(getCategorylist());
    }, [dispatch]);

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
        if (!(editDataGetingFromList === undefined)) {
            setEditData(editDataGetingFromList);
            setPageMode(pageModeProps);
            setCategory_dropdown_Select({
                value: editDataGetingFromList.ProductCategory_id,
                label: editDataGetingFromList.ProductCategoryName
            })
            dispatch(editSubCategoryIDSuccess({ Status: false }))
            dispatch(BreadcrumbShow(editDataGetingFromList.Name))
            return
        }
    }, [editDataGetingFromList])


    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            setCategory_dropdown_Select('')
            dispatch(PostMethod_ForSubCategoryAPISuccess({ Status: false }))
            formRef.current.reset();
            if (pageMode === "dropdownAdd") {
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
                    RedirectPath: '/SubCategoryList',
                }))
            }
        }
        else if (PostAPIResponse.Status === true) {
            dispatch(PostMethod_ForSubCategoryAPISuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostAPIResponse.Message),
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

    const CategoryDropdownOptions = CategoryAPI.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    function handllerCategoryDropdown(e) {
        setCategory_dropdown_Select(e)
    }


    const formSubmitHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                Name: values.Name,
                ProductCategory: values.ProductCategoryName.value,
            });

            if (pageMode === "edit") {
                dispatch(updateSubCategoryID(jsonBody, EditData.id));
            }
            else {
                dispatch(PostMethodForSubCategory(jsonBody));
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
                            <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
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
                                                                    <Label htmlFor="validationCustom01"> {fieldLabel.ProductCategoryName}</Label>
                                                                    <Col sm={12}>
                                                                        <Select
                                                                            name="ProductCategoryName"
                                                                            Value={values.category}
                                                                            isSearchable={false}
                                                                            className="react-dropdown"
                                                                            classNamePrefix="dropdown"
                                                                            onChange={(v, e) => onChangeSelect({ e, v, state, setState })}
                                                                            options={CategoryDropdownOptions}
                                                                            styles={{
                                                                                control: base => ({
                                                                                    ...base,
                                                                                    border: isError.ProductCategoryName.length > 0 ? '1px solid red' : '',

                                                                                })
                                                                            }}
                                                                        />
                                                                        {isError.ProductCategoryName.length > 0 && (
                                                                            <span className="text-danger f-8"><small>{isError.ProductCategoryName}</small></span>
                                                                        )}
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                                                    module={"SubCategoryMaster"}
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
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default SubCategoryMaster

