import React, { useEffect, useRef, useState, } from "react";
// import Breadcrumb from "../../../components/Common/Breadcrumb3";
import Breadcrumb from "../../../../components/Common/Breadcrumb3"
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
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr"
import { Breadcrumb_inputName, commonPageFieldSuccess, getBaseUnit_ForDropDown, getItemList } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
} from "../../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import SaveButton from "../../../../components/Common/ComponentRelatedCommonFile/CommonSaveButton";
import ItemTab from "./ItemQuantityTab";
import { editBOMListSuccess, GetItemUnitsDrodownAPI, postBOM, postBOMSuccess } from "../../../../store/Purchase/BOMRedux/action";
import { BillOfMaterialsList } from "../../../../routes/route_url";

const BOMMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const formRef = useRef(null);
    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [ItemTabDetails, setItemTabDetails] = useState([])
    console.log("ItemTabDetails", ItemTabDetails)
    const initialFiled = {
        id: "",
        Date: "",
        ItemName: "",
        EstimatedOutput: "",
        UnitName: "",
        Comment: "",
        IsActive: false
    }

    const [state, setState] = useState(initialFiledFunc(initialFiled))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        Items,
        Unit,
        GetItemUnits
    } = useSelector((state) => ({
        postMsg: state.BOMReducer.PostData,
        updateMsg: state.GroupTypeReducer.updateMessage,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        GetItemUnits: state.BOMReducer.GetItemUnits,
        Items: state.ItemMastersReducer.pages,
    }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(69))
        dispatch(getItemList())
        // dispatch(getBaseUnit_ForDropDown());
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

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
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
                console.log("hasEditVal", hasEditVal)
                setEditData(hasEditVal);
                const { id, Date, Item, ItemName, Unit, UnitName, EstimatedOutput, Comment, IsActive } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.id.valid = true;
                hasValid.Date.valid = true;
                hasValid.ItemName.valid = true;
                hasValid.UnitName.valid = true;
                hasValid.EstimatedOutput.valid = true;
                hasValid.Comment.valid = true;
                hasValid.IsActive.valid = true;

                values.id = id
                values.Date = Date;
                values.EstimatedOutput = EstimatedOutput;
                values.Comment = Comment;
                values.IsActive = IsActive;
                values.ItemName = { label: ItemName, value: Item };
                values.UnitName = { label: UnitName, value: Unit };
                setItemTabDetails(hasEditVal.BOMItems)
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(editBOMListSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
            }
        }
    }, [])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postBOMSuccess({ Status: false }))
            formRef.current.reset();
            if (pageMode === "dropdownAdd") {
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
                    RedirectPath: BillOfMaterialsList,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(postBOMSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    // useEffect(() => {
    //     if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
    //         history.push({
    //             pathname: GROUPTYPE_lIST,
    //         })
    //     } else if (updateMsg.Status === true && !modalCss) {
    //         dispatch(updateGroupTypeIDSuccess({ Status: false }));
    //         dispatch(
    //             AlertState({
    //                 Type: 3,
    //                 Status: true,
    //                 Message: JSON.stringify(updateMsg.Message),
    //             })
    //         );
    //     }
    // }, [updateMsg, modalCss]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })// new change
        }
    }, [pageField])

    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const Unit_DropdownOptions = GetItemUnits.map((data) => ({
        value: data.value,
        label: data.label
    }))

    function Items_Dropdown_Handler(e) {
        const jsonBody = JSON.stringify({
            Item: e.value,
        });
        dispatch(GetItemUnitsDrodownAPI(jsonBody))
        setState((i) => {

            const a = { ...i }
            a.values.UnitName = "";
            a.hasValid.UnitName.valid = false
            return a
        })
    }

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const formSubmitHandler = (event) => {
        debugger
        const BOMItems = ItemTabDetails.map((index) => ({
            Item: index.ItemID,
            Quantity: index.Quantity,
            Unit: index.UnitID
        }))

        let Company = ''
        try {
            Company = JSON.parse(localStorage.getItem('Company'))
        } catch (e) {
            alert(e)
        }
        event.preventDefault();
        if (formValid(state, setState)) {
            debugger
            const jsonBody = JSON.stringify({

                Date: values.Date,
                EstimatedOutput: values.EstimatedOutput,
                Comment: values.Comment,
                IsActive: values.IsActive,
                Item: values.ItemName.value,
                Unit: values.UnitName.value,
                CreatedBy: 1,
                Company: Company,
                BOMItems: BOMItems
            });

            if (BOMItems.length === 0) {
                dispatch(
                    AlertState({
                        Type: 4,
                        Status: true,
                        Message: "At Least One Matrial data Add in the table",
                        RedirectPath: false,
                        PermissionAction: false,
                    })
                );
                return;
            }

            if (pageMode === 'edit') {
                // dispatch(updateGroupTypeID(jsonBody, EditData.id));
            }
            else {
                dispatch(postBOM(jsonBody));
                console.log("post jsonBody", jsonBody)
            }
        }
    };


    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>GroupTypeMaster | FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb pageHeading={userPageAccessState.PageHeading} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >

                                <form onSubmit={formSubmitHandler} ref={formRef} noValidate>

                                    <Card>
                                        <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label >{fieldLabel.Date} </Label>
                                                    <Flatpickr
                                                        name="Date"
                                                        value={values.Date}
                                                        className="form-control d-block p-2 bg-white text-dark"
                                                        placeholder="YYYY-MM-DD"
                                                        autoComplete="0,''"
                                                        options={{
                                                            altInput: true,
                                                            altFormat: "F j, Y",
                                                            dateFormat: "Y-m-d",
                                                            // minDate: new Date().fp_incr("n"),
                                                            // maxDate: new Date().fp_incr(0) // 14 days from now"0,''"
                                                        }}
                                                        onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                    />
                                                    {isError.Date.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Date}</span>
                                                    )}
                                                </FormGroup>

                                                <Col md="1"></Col>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label >{fieldLabel.EstimatedOutput} </Label>
                                                    <Input
                                                        name="EstimatedOutput"
                                                        value={values.EstimatedOutput}
                                                        type="text"
                                                        className={isError.EstimatedOutput.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter EstimatedOutput"
                                                        autoComplete='off'
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                        }}
                                                    />
                                                    {isError.EstimatedOutput.length > 0 && (
                                                        <span className="invalid-feedback">{isError.EstimatedOutput}</span>
                                                    )}
                                                </FormGroup>
                                            </Row>

                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label> {fieldLabel.ItemName} </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            name="ItemName"
                                                            value={values.ItemName}
                                                            isSearchable={true}
                                                            className="react-dropdown"
                                                            classNamePrefix="dropdown"
                                                            options={ItemDropdown_Options}
                                                            onChange={(hasSelect, evn) => {
                                                                onChangeSelect({ hasSelect, evn, state, setState });
                                                                Items_Dropdown_Handler(hasSelect);
                                                                dispatch(Breadcrumb_inputName(hasSelect.label))
                                                            }
                                                            }

                                                        />
                                                        {isError.ItemName.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                                        )}
                                                    </Col>
                                                </FormGroup>

                                                <Col md="1"></Col>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label > {fieldLabel.UnitName} </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            name="UnitName"
                                                            value={values.UnitName}
                                                            isSearchable={true}
                                                            className="react-dropdown"
                                                            classNamePrefix="dropdown"
                                                            options={Unit_DropdownOptions}
                                                            onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}

                                                        />
                                                        {isError.UnitName.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.UnitName}</small></span>
                                                        )}
                                                    </Col>
                                                </FormGroup>
                                            </Row>

                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label >{fieldLabel.Comment} </Label>
                                                    <Input
                                                        name="Comment"
                                                        value={values.Comment}
                                                        type="text"
                                                        className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter Comment"
                                                        autoComplete='off'
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                        }}
                                                    />
                                                    {isError.Comment.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Comment}</span>
                                                    )}
                                                </FormGroup>

                                                <Col md="1"></Col>
                                                <FormGroup className="mb-2 col col-sm-3 mt-4">
                                                    <Row className="justify-content-md-left">
                                                        <Label className="col-sm-6 col-form-label" >{fieldLabel.IsActive}</Label>
                                                        <Col md={4} style={{ marginTop: '10px' }} >

                                                            <div className="form-check form-switch form-switch-md mb-3" >
                                                                <Input type="checkbox" className="form-check-input"
                                                                    checked={values.IsActive}
                                                                    name="IsActive"
                                                                    onChange={(e) => {
                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.IsActive = e.target.checked;
                                                                            return a
                                                                        })
                                                                    }}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </FormGroup>
                                            </Row>

                                        </CardBody>
                                    </Card>

                                    <Row>
                                        <Col md={12}  >
                                            <Row className="mt-3">
                                                <Col className=" col col-12 ">
                                                    <ItemTab tableData={ItemTabDetails} func={setItemTabDetails} />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <FormGroup>
                                            <Row>
                                                <Col sm={2}>
                                                    <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                                        module={"GroupTypeMaster"}
                                                    />
                                                </Col>
                                            </Row>
                                        </FormGroup >
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

export default BOMMaster
