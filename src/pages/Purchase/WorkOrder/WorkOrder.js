import React, { useEffect, useMemo, useRef, useState, } from "react";
// import Breadcrumb from "../../../components/Common/Breadcrumb3";
import Breadcrumb from "../../../components/Common/Breadcrumb3"
import {
    Button,
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
import { Breadcrumb_inputName, commonPageFieldSuccess, getItemList } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import SaveButton from "../../../components/Common/ComponentRelatedCommonFile/CommonSaveButton";
import { postBOM, postBOMSuccess, updateBOMList, } from "../../../store/Purchase/BOMRedux/action";
import { BillOfMaterialsList } from "../../../routes/route_url";
import { createdBy, userCompany } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { getBOMList } from "../../../store/Purchase/WorkOrder/action";

const WorkOrder = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const formRef = useRef(null);
    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [ItemTabDetails, setItemTabDetails] = useState([])
    const [EstimatedOutputLabel, setEstimatedOutputLabel] = useState("")
    const [quantity, setQuantity] = useState("")


    const initialFiled = useMemo(() => {

        const fileds = {
            id: "",
            WorkOrderDate: "",
            ItemBom: "",
            NumberOfLot: "",
            Quantity: "",
            StockQuantity: "",
            EstimatedOutput: ""
        }
        return initialFiledFunc(fileds)
    }, []);

    const [state, setState] = useState(initialFiled)

    console.log(state.values)
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
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        GetItemUnits: state.BOMReducer.GetItemUnits,
        Items: state.WorkOrderReducer.BOMList,
    }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(72))
        dispatch(getBOMList())
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
    // useEffect(() => {

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
    //             console.log("hasEditVal", hasEditVal)
    //             setEditData(hasEditVal);
    //             const { id, BomDate, Item, ItemName, Unit, UnitName, EstimatedOutput, Comment, IsActive } = hasEditVal
    //             const { values, fieldLabel, hasValid, required, isError } = { ...state }

    //             hasValid.id.valid = true;
    //             hasValid.BomDate.valid = true;
    //             hasValid.ItemName.valid = true;
    //             hasValid.UnitName.valid = true;
    //             hasValid.EstimatedOutput.valid = true;
    //             hasValid.Comment.valid = true;
    //             hasValid.IsActive.valid = true;

    //             values.id = id
    //             values.BomDate = BomDate;
    //             values.EstimatedOutput = EstimatedOutput;
    //             values.Comment = Comment;
    //             values.IsActive = IsActive;
    //             values.ItemName = { label: ItemName, value: Item };
    //             values.UnitName = { label: UnitName, value: Unit };
    //             setItemTabDetails(hasEditVal.BOMItems)
    //             setState({ values, fieldLabel, hasValid, required, isError })
    //             dispatch(editBOMListSuccess({ Status: false }))
    //             dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
    //         }
    //     }
    // }, [])

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
    //     debugger
    //     if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
    //         history.push({
    //             pathname: BillOfMaterialsList,
    //         })
    //     } else if (updateMsg.Status === true && !modalCss) {
    //         dispatch(updateBOMListSuccess({ Status: false }));
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
        label: index.ItemName,
        EstimatedOutput: index.EstimatedOutput
    }));

    // function Items_Dropdown_Handler(e) {
    //     const jsonBody = JSON.stringify({
    //         Item: e.value,
    //     });
    //     dispatch(GetItemUnitsDrodownAPI(jsonBody))
    //     setState((i) => {

    //         const a = { ...i }
    //         a.values.UnitName = "";
    //         a.hasValid.UnitName.valid = false
    //         return a
    //     })
    // }

    function ItemOnchange(e) {
        debugger
        setEstimatedOutputLabel(e)
        setQuantity('')
        setState((i) => {
            debugger
            const a = { ...i }
            a.values.NumberOfLot = "";
            // a.hasValid.NumberOfLot.valid = false
            return a
        })
    }

    function NumberOfLotchange(e) {
        debugger
        let NumberOfLot = e * EstimatedOutputLabel.EstimatedOutput
        setQuantity(NumberOfLot)
        setState((i) => {
            debugger
            const a = { ...i }
            a.values.Quantity = "";
            a.hasValid.Quantity.valid = false
            return a
        })
    }

    function Quantitychange(e) {
        debugger
        setState((i) => {
            debugger
            const a = { ...i }
            a.values.NumberOfLot = "22222";
            a.hasValid.NumberOfLot.valid = false
            return a
        })
    }
    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const formSubmitHandler = (event) => {
        debugger
        const BOMItems = ItemTabDetails.map((index) => ({
            Item: index.Item,
            Quantity: index.Quantity,
            Unit: index.Unit
        }))

        event.preventDefault();
        if (formValid(state, setState)) {

            const jsonBody = JSON.stringify({

                BomDate: values.BomDate,
                EstimatedOutput: values.EstimatedOutput,
                Comment: values.Comment,
                IsActive: values.IsActive,
                Item: values.ItemName.value,
                Unit: values.UnitName.value,
                CreatedBy: createdBy(),
                Company: userCompany(),
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

                dispatch(updateBOMList(jsonBody, `${EditData.id}/${EditData.Company}`));
                console.log("update jsonBody", jsonBody)
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
                                                    <Label >{fieldLabel.WorkOrderDate} </Label>
                                                    <Flatpickr
                                                        name="WorkOrderDate"
                                                        value={values.WorkOrderDate}
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
                                                    {isError.WorkOrderDate.length > 0 && (
                                                        <span className="invalid-feedback">{isError.WorkOrderDate}</span>
                                                    )}
                                                </FormGroup>

                                                <Col md="1"></Col>
                                                <FormGroup className="mb-3 col col-sm-4 ">
                                                    <Label> {fieldLabel.ItemBom} </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            name="ItemBom"
                                                            value={values.ItemBom}
                                                            isSearchable={true}
                                                            className="react-dropdown"
                                                            classNamePrefix="dropdown"
                                                            options={ItemDropdown_Options}
                                                            onChange={(hasSelect, evn) => {
                                                                onChangeSelect({ hasSelect, evn, state, setState });
                                                                ItemOnchange(hasSelect)
                                                                dispatch(Breadcrumb_inputName(hasSelect.label))
                                                            }
                                                            }

                                                        />
                                                        {isError.ItemBom.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.ItemBom}</small></span>
                                                        )}
                                                    </Col>
                                                </FormGroup>

                                            </Row>

                                            <Row>

                                                <FormGroup className="mb-3 col col-sm-4 ">
                                                    <Label >{fieldLabel.StockQuantity} : </Label>
                                                </FormGroup>

                                                <Col md="1"></Col>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label >{fieldLabel.EstimatedOutput} : </Label>
                                                    <Label style={{ color: "#B0290B" }}>&nbsp;&nbsp; &nbsp; 
                                                     {EstimatedOutputLabel.EstimatedOutput}&nbsp;&nbsp; &nbsp;(1 lot)</Label>
                                                </FormGroup>

                                            </Row>


                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label >{fieldLabel.NumberOfLot} </Label>
                                                    <Input
                                                        name="NumberOfLot"
                                                        defaultValue={values.NumberOfLot}
                                                        type="text"
                                                        className={isError.NumberOfLot.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter NumberOfLot"
                                                        autoComplete='off'
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                            NumberOfLotchange(event.target.value)
                                                        }}
                                                    />
                                                    {isError.NumberOfLot.length > 0 && (
                                                        <span className="invalid-feedback">{isError.NumberOfLot}</span>
                                                    )}
                                                </FormGroup>
                                                <Col md="1"></Col>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label >Quantity </Label>
                                                    <Input
                                                        name="Quantity"
                                                        defaultValue={quantity}
                                                        type="text"
                                                        // className={isError.Quantity.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter Quantity"
                                                        autoComplete='off'
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                            Quantitychange(event.target.value)
                                                        }}
                                                    />
                                                    {/* {isError.Quantity.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Quantity}</span>
                                                    )} */}
                                                </FormGroup>
                                                <Col md="1"></Col>
                                                <Col md="1" className="mt-4 ">
                                                    <Button type="button" color="btn btn-outline-success border-2 font-size-12 " style={{ marginTop: '6px' }}
                                                    // onClick={() => goButtonHandler()}
                                                    >Go</Button>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>

                                    <Row>
                                        <FormGroup>
                                            <Row>
                                                <Col sm={2}>
                                                    <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                                        module={"WorkOrder"}
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

export default WorkOrder
