import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
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

const CategoryMaster = (props) => {

    let editDataGatingFromList = props.state;
    let pageModeProps = props.pageMode;

    const formRef = useRef(null);
    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("");
    const [CategoryTypes_dropdown_Select, setCategoryTypes_dropdown_Select] = useState("");
    const dispatch = useDispatch();
    const [userPageAccessState, setUserPageAccessState] = useState(123);
    const [CategoryTypes, setCategoryTypes] = useState("");
    const history = useHistory()

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse, CategoryAPI, RoleAccessModifiedinSingleArray } = useSelector((state) => ({
        PostAPIResponse: state.CategoryMasterReducer.PostDataMessage,
        CategoryAPI: state.categoryTypeReducer.categoryTypeListData,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
    }));
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

    const FormSubmitButton_Handler = (event, values) => {
        const jsonBody = JSON.stringify({
            Name: values.Name,
            ProductCategoryType: CategoryTypes_dropdown_Select.value,
        });

        if (pageMode === "edit") {
            dispatch(updateCategoryID(jsonBody, EditData.id));
        }
        else {
            dispatch(PostMethodForCategory(jsonBody));
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
                            <title>CategoryMaster | FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb breadcrumbItem={"Category Master"} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v) }}
                                    ref={formRef}
                                >
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">Name </Label>
                                                            <AvField
                                                                name="Name"
                                                                id="txtName"
                                                                value={EditData.Name}
                                                                type="text"
                                                                placeholder="Please Enter Name"
                                                                autoComplete='off'
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'Please Enter Name' },
                                                                }}
                                                                onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                            />
                                                        </FormGroup>

                                                        <Row>
                                                            <Col md="4">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> Category Type </Label>
                                                                    <Col sm={12}>
                                                                        <Select
                                                                            value={CategoryTypes_dropdown_Select}
                                                                            options={CategoryTypesValues}
                                                                            onChange={(e) => { handllerCategoryTypes(e) }}
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
                                </AvForm>
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

