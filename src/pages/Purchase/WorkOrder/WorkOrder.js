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
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
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
import { WORKORDER } from "../../../routes/route_url";
import { createdBy, currentDate, userCompany } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { getBOMList, postGoButtonForWorkOrder_Master, postWorkOrderMaster, postWorkOrderMasterSuccess } from "../../../store/Purchase/WorkOrder/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
const WorkOrder = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const formRef = useRef(null);
    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [itemselect, setItemselect] = useState("")

    const initialFiled = useMemo(() => {

        const fileds = {
            id: "",
            WorkOrderDate: "",
            ItemBom: "",
            NumberOfLot: "",
            Quantity: "",
            StockQuantity: "",
            EstimatedOutputQty: ""
        }
        return initialFiledFunc(fileds)
    }, []);

    const [state, setState] = useState(initialFiled)

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        Items,
        GoButton
    } = useSelector((state) => ({
        postMsg: state.WorkOrderReducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        GetItemUnits: state.BOMReducer.GetItemUnits,
        Items: state.WorkOrderReducer.BOMList,
        GoButton: state.WorkOrderReducer.GoButton
    }));


    const { BOMItems = [], EstimatedOutputQty = '' } = GoButton

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(72))
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

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postWorkOrderMasterSuccess({ Status: false }))
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
                    RedirectPath: WORKORDER,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(postWorkOrderMasterSuccess({ Status: false }))
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
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })// new change
        }
    }, [pageField])

    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.ItemName,
        ItemID: index.Item,
        EstimatedOutputQty: index.EstimatedOutputQty
    }));

    useEffect(() => {
        debugger
        let date = currentDate();
        const jsonBody = JSON.stringify({
            FromDate: "2022-12-01",
            ToDate: date,
            Company: userCompany(),
        });
        dispatch(getBOMList(jsonBody));
    }, [])

    function ItemOnchange(e) {
        setItemselect(e)
        setState((i) => {
            i.values.NumberOfLot = "";
            i.values.Quantity = "";
            return i
        })

    }

    function NumberOfLotchange(e) {
        let qty = e * itemselect.EstimatedOutputQty
        setState((i) => {
            i.values.NumberOfLot = e;
            i.values.Quantity = qty;
            return i
        })
    }

    function Quantitychange(e) {
        setState((i) => {
            i.values.NumberOfLot = "1.000000";
            i.values.Quantity = e;
            return i
        })
    }

    const goButtonHandler = (event, value) => {
        const jsonBody = JSON.stringify({
            ItemID: values.ItemBom.ItemID,
            BomID: values.ItemBom.value,
            Quantity: parseInt(values.Quantity)
        });
        dispatch(postGoButtonForWorkOrder_Master(jsonBody));
        console.log("go button post json", jsonBody)
    }

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const formSubmitHandler = (event) => {

        const WorkOrderItems = BOMItems.map((index) => ({
            Item: index.Item,
            Unit: index.Unit,
            BomQuantity: index.BomQuantity,
            Quantity: index.Quantity,
        }))

        event.preventDefault();
        if (formValid(state, setState)) {

            const jsonBody = JSON.stringify({
                WorkOrderDate: values.WorkOrderDate,
                Item: values.ItemBom.ItemID,
                Bom: values.ItemBom.value,
                NumberOfLot: values.NumberOfLot,
                Quantity: values.Quantity,
                Company: userCompany(),
                Division: 2,
                CreatedBy: createdBy(),
                UpdatedBy: createdBy(),
                WorkOrderItems: WorkOrderItems
            });

            dispatch(postWorkOrderMaster(jsonBody));
            console.log("post jsonBody", jsonBody)

        }
    };

    const QuantityHandler = (e, user) => {
        user["CurrentMRP"] = e.target.value
    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            sort: true,
        },
        {

            text: "Stock Quantity",
            dataField: "StockQuantity",
            sort: true,
        },
        {
            text: "BomQuantity",
            dataField: "BomQuantity",
            sort: true,
        },

        {

            text: "Quantity",
            dataField: "Quantity",
            sort: true,
            formatter: (cellContent, user) => (
                <>
                    <div style={{ justifyContent: 'center' }} >

                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    id=""
                                    type="text"
                                    disabled={true}
                                    defaultValue={cellContent}
                                    className="col col-sm text-center"
                                    onChange={(e) => QuantityHandler(e, user)}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                    {console.log("user", cellContent)}
                </>
            ),
        },
        {

            text: "UnitName",
            dataField: "UnitName",
            sort: true,
        },

    ]

    const pageOptions = {
        sizePerPage: 10,
        totalSize: GoButton.length,
        custom: true,
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
                            <CardHeader className="card-header   text-black c_card_header">
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >

                                <form onSubmit={formSubmitHandler} ref={formRef} noValidate>

                                    <Card>
                                        <CardBody className="c_card_body">
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
                                                    <Label >{fieldLabel.EstimatedOutputQty} : </Label>
                                                    <Label style={{ color: "#B0290B" }}>&nbsp;&nbsp; &nbsp;
                                                        {itemselect.EstimatedOutputQty}&nbsp;&nbsp; &nbsp;(1 lot)</Label>
                                                </FormGroup>

                                            </Row>


                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label >{fieldLabel.NumberOfLot} </Label>
                                                    <Input
                                                        name="NumberOfLot"
                                                        value={values.NumberOfLot}

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
                                                    <Label >{fieldLabel.Quantity} </Label>
                                                    <Input
                                                        name="Quantity"
                                                        value={values.Quantity}
                                                        type="text"
                                                        className={isError.Quantity.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter Quantity"
                                                        autoComplete='off'
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                            Quantitychange(event.target.value)
                                                        }}
                                                    />
                                                    {isError.Quantity.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Quantity}</span>
                                                    )}
                                                </FormGroup>

                                                <Col md="1" className="mt-4 ">
                                                    <Button color="btn btn-outline-success border-2 font-size-12 " style={{ marginTop: '6px' }}
                                                        onClick={(e) => goButtonHandler(e)}
                                                    >Go</Button>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>

                                    {BOMItems.length > 0 ?
                                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                                            {({ paginationProps, paginationTableProps }) => (
                                                <ToolkitProvider
                                                    keyField={"id"}
                                                    data={BOMItems}
                                                    columns={pagesListColumns}
                                                    search
                                                >
                                                    {(toolkitProps) => (
                                                        <React.Fragment>
                                                            <Row>
                                                                <Col xl="12">
                                                                    <div className="table-responsive">
                                                                        <BootstrapTable
                                                                            keyField={"id"}
                                                                            responsive
                                                                            bordered={false}
                                                                            striped={false}
                                                                            // defaultSorted={defaultSorted}
                                                                            classes={"table  table-bordered"}
                                                                            // noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                                                                            {...toolkitProps.baseProps}
                                                                            {...paginationTableProps}
                                                                        />
                                                                        <div>
                                                                            <label >EstimatedOutputQty :&nbsp;&nbsp; <span style={{ color: "#B0290B" }}>{EstimatedOutputQty}</span></label>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row className="align-items-md-center mt-30">
                                                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                                    <PaginationListStandalone {...paginationProps} />
                                                                </Col>
                                                            </Row>
                                                        </React.Fragment>
                                                    )}
                                                </ToolkitProvider>
                                            )}

                                        </PaginationProvider>
                                        : null}

                                    <FormGroup>
                                        <Row >
                                            <Col sm={2} >
                                                <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                                    module={"WorkOrder"}
                                                />

                                            </Col>
                                        </Row>
                                    </FormGroup >


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
