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
    getCategoryTypelist
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    editCategoryIDSuccess,
    saveCategoryMaster,
    saveCategoryMaster_Success,
    updateCategoryID,
    updateCategoryIDSuccess
} from "../../../store/Administrator/CategoryRedux/action";
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
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginUserID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import AddMaster from "../../Adminisrator/EmployeePages/Drodown";
import CategoryTypeMaster from "../CategoryTypePages/CategoryTypeMaster";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const CategoryMaster = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        CategoryTypeName: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [categoryType_AddAccess, setCategoryType_AddAccess] = useState(false)
    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        CategoryAPI,
        pageField,
        updateMsg,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.CategoryReducer.saveBtnloading ,
            postMsg: state.CategoryReducer.postMsg,
            updateMsg: state.CategoryReducer.updateMessage,
            CategoryAPI: state.categoryTypeReducer.categoryTypeListData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.CATEGORY//changes
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getCategoryTypelist());
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)//changes
    const hasShowModal = props.hasOwnProperty(mode.editValue)//changes

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath;

        if (props.pageMode === mode.dropdownAdd) {
            locationPath = props.masterPath;
        } else {
            locationPath = location.pathname;
        }

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc);
            if (!props.isdropdown) {
                breadcrumbReturnFunc({ dispatch, userAcc });
            }
        };
        userAccess.find((index) => {
            if (index.id === pageId.CATEGORYTYPE) {
                return setCategoryType_AddAccess(true)
            }

        });
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
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editCategoryIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveCategoryMaster_Success({ Status: false }))
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
                    history.push({ pathname: url.CATEGORY_lIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveCategoryMaster_Success({ Status: false }))
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
                pathname: url.CATEGORY_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateCategoryIDSuccess({ Status: false }));
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

    const CategoryTypesValues = CategoryAPI.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const saveHandeller = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    CategoryType: values.CategoryTypeName.value,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID()
                });

                if (pageMode === mode.edit) {
                    dispatch(updateCategoryID({ jsonBody, updateId: values.id, btnId }));
                }

                else {
                    dispatch(saveCategoryMaster({ jsonBody, btnId }));
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

                <div className="page-content" style={{ marginTop: IsEditMode_Css, height: "18cm" }}>
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
                                                        <Label htmlFor="validationCustom01"> {fieldLabel.CategoryTypeName} </Label>
                                                        <Col sm={12} >
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

                                                {(categoryType_AddAccess) &&
                                                    <Col md="1" className=" mt-3">
                                                        <AddMaster
                                                            masterModal={CategoryTypeMaster}
                                                            masterPath={url.CATEGORYTYPE}
                                                        />
                                                    </Col>}
                                            </Row>

                                            <FormGroup className="mt-1">
                                                <Row>
                                                    <Col sm={2}>
                                                        <SaveButton pageMode={pageMode}
                                                            loading={saveBtnloading}
                                                            onClick={saveHandeller}
                                                            userAcc={userPageAccessState}
                                                            editCreatedBy={editCreatedBy}
                                                            module={"CategoryMaster"}
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

export default CategoryMaster

