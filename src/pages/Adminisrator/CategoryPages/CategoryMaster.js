import React, { useEffect, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
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
    getCategoryTypelist
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    editCategoryIDSuccess,
    PostMethodForCategory,
    PostMethod_ForCategoryAPISuccess,
    updateCategoryID,
    updateCategoryIDSuccess
} from "../../../store/Administrator/CategoryRedux/action";
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,

} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { CATEGORY_lIST } from "../../../routes/route_url";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

const CategoryMaster = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const [pageMode, setPageMode] = useState("");
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserPageAccessState] = useState(123);
   

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        CategoryAPI,
        pageField,
        updateMsg,
        userAccess } = useSelector((state) => ({
            postMsg: state.CategoryReducer.PostDataMessage,
            updateMsg: state.CategoryReducer.updateMessage,
            CategoryAPI: state.categoryTypeReducer.categoryTypeListData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));


    {/** Dyanamic Page access state and OnChange function */ }

    const fileds = {
        id: "",
        Name: "",
        CategoryTypeName: ""
    }


    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(23))
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

                const { id, Name, CategoryTypeName, CategoryType } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;
                hasValid.CategoryTypeName.valid = true;

                values.id = id
                values.Name = Name;
                values.CategoryTypeName = { label: CategoryTypeName, value: CategoryType };

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))

            }
            dispatch(editCategoryIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(PostMethod_ForCategoryAPISuccess({ Status: false }))
            setState(() => initialFiledFunc(fileds)) //+++++++++ Clear form values 
            saveDissable(false);//+++++++++save Button Is enable function
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
                    RedirectPath: CATEGORY_lIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            saveDissable(false);//+++++++++save Button Is enable function
            dispatch(PostMethod_ForCategoryAPISuccess({ Status: false }))
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
            saveDissable(false);//+++++++++Update Button Is enable function
            setState(() => initialFiledFunc(fileds)) //+++++++++ Clear form values
            history.push({
                pathname: CATEGORY_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            saveDissable(false);//+++++++++Update Button Is enable function
            dispatch(updateCategoryIDSuccess({ Status: false }));
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

    //get method for dropdown
    useEffect(() => {
        dispatch(getCategoryTypelist());
    }, [dispatch]);

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

            saveDissable(true);//+++++++++save Button Is dissable function

            if (pageMode === "edit") {
                dispatch(updateCategoryID(jsonBody, values.id,));
            }
            else {
                dispatch(PostMethodForCategory(jsonBody));
            }
        }

    };


    
    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>{userPageAccessState.PageHeading} | FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb pageHeading={userPageAccessState.PageHeading} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form onSubmit={formSubmitHandler} noValidate>
                                    <Row className="">
                                        <Col md={12}>
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

                                                        <Row>
                                                            <Col md="4" >
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> {fieldLabel.CategoryTypeName} </Label>
                                                                    <Col sm={12} style={{ height: "2.5cm" }}>
                                                                        <Select
                                                                            name="CategoryTypeName"
                                                                            value={values.CategoryTypeName}
                                                                            isSearchable={true}
                                                                            className="react-dropdown"
                                                                            classNamePrefix="dropdown"
                                                                            options={CategoryTypesValues}
                                                                            onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}

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
                                                                    <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                                                        module={"CategoryMaster"}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
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

