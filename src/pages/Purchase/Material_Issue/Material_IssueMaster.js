import React, { useEffect, useRef, useState, } from "react";
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
    Row,
    Table
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
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import {
    editBOMListSuccess,
    GetItemUnitsDrodownAPI,
    postBOM,
    postBOMSuccess,
    updateBOMList,
    updateBOMListSuccess
} from "../../../store/Purchase/BOMRedux/action";
import { BIllOf_MATERIALS_LIST } from "../../../routes/route_url";
import { createdBy, currentDate, userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { getWorkOrderListPage } from "../../../store/Purchase/WorkOrder/action";
import { postGoButtonForMaterialIssue_Master, postGoButtonForMaterialIssue_MasterSuccess } from "../../../store/Purchase/Matrial_Issue/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
const MaterialIssueMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const formRef = useRef(null);
    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [ItemTabDetails, setItemTabDetails] = useState([])
    const [Quantity, setQuantity] = useState([])
    const [Itemselect, setItemselect] = useState([])

    const initialFiled = {
        id: "",
        Date: "",
        Items: "",
        NumberOfLots: "",
        Quantity: "",
    }

    const [state, setState] = useState(initialFiledFunc(initialFiled))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        Items,
        GoButton

    } = useSelector((state) => ({
        postMsg: state.BOMReducer.PostData,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Items: state.WorkOrderReducer.WorkOrderList,
        GoButton: state.MaterialIssueReducer.GoButton
    }));

    const { ItemsData = [], id = '', Item = '', Unit = '' } = GoButton

    const BatchesData = ItemsData.map((index) => {
        return index.BatchesData
    })

    useEffect(() => {
        dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(75))
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

    useEffect(() => {
        const jsonBody = JSON.stringify({
            FromDate: "2022-12-01",
            ToDate: currentDate()
        });
        dispatch(getWorkOrderListPage(jsonBody));
    }, [])

    const goButtonHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                WorkOrder: Itemselect.WorkOrderId,
                Item: Itemselect.Item,
                Company: userCompany(),
                Party: userParty(),
                Quantity: parseInt(values.Quantity)
            });
            dispatch(postGoButtonForMaterialIssue_Master(jsonBody));
        }
    }

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
                const { id, BomDate, Item, ItemName, Unit, UnitName, EstimatedOutputQty, Comment, IsActive } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.id.valid = true;
                hasValid.BomDate.valid = true;
                hasValid.ItemName.valid = true;
                hasValid.UnitName.valid = true;
                hasValid.EstimatedOutputQty.valid = true;
                hasValid.Comment.valid = true;
                hasValid.IsActive.valid = true;

                values.id = id
                values.BomDate = BomDate;
                values.EstimatedOutputQty = EstimatedOutputQty;
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
                    RedirectPath: BIllOf_MATERIALS_LIST,
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

    useEffect(() => {
        debugger
        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            history.push({
                pathname: BIllOf_MATERIALS_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateBOMListSuccess({ Status: false }));
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
            comAddPageFieldFunc({ state, setState, fieldArr })// new change
        }
    }, [pageField])

    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.ItemName,
        Quantity: index.Quantity,
        WorkOrderId: index.id,
        Item: index.Item,

    }));

    function ItemOnchange(e) {
        debugger
        setItemselect(e)
        setState((i) => {
            i.values.NumberOfLots = "1";
            i.values.Quantity = e.Quantity;
            return i
        })
    }

    function Quantitychange(e) {
        debugger

        // if (Itemselect.Quantity>e) {
        //     alert("Quantity is greter")
        //     setState((i) => {
        //         i.values.Quantity = e;
        //         return i
        //     })
        // }

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
            debugger
            const jsonBody = JSON.stringify({

                BomDate: values.BomDate,
                EstimatedOutputQty: values.EstimatedOutputQty,
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

    const handleChange = event => {
        const result = event.target.value.replace(/\D/g, '');
        setQuantity(result);
    };

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            sort: true,
        },
        {
            text: "Work Order Quantity",
            dataField: "Quantity",
            sort: true,
        },
        {
            text: "Batch Code",
            dataField: "",
            sort: true,

            formatter: (cellContent, user) => (
                <>
                    <Table className="table table-bordered table-responsive ">
                        <Thead  >
                            <tr style={{ zIndex: "23" }} className="">
                                <th className="">Batch Code </th>
                                <th className="">Batch Date</th>
                                <th className="">Stock Quantity</th>
                                <th className="" >Quantity</th>
                                <th className="" >Supplier BatchCode</th>
                            </tr>
                        </Thead>

                        <Tbody  >
                            {BatchesData[0].map((TableValue, key) => (
                                <tr >
                                    <td>
                                        <div style={{ width: "150px" }}>
                                            <label>
                                                {TableValue.SystemBatchCode}
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "150px" }}>
                                            <label>
                                                {TableValue.SystemBatchDate}
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "150px" }}>
                                            <label>
                                                {TableValue.ObatchwiseQuantity}
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "150px" }}>
                                            <Input type="text"
                                                defaultValue={TableValue.Qty}
                                                onChange={handleChange}
                                            ></Input>

                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "150px" }}>
                                            <label>
                                                {TableValue.BatchCode}
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </Tbody>
                    </Table>


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
        totalSize: ItemsData.length,
        custom: true,
    };


    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (


            <React.Fragment>

                <MetaTags>
                    <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
                </MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <Breadcrumb pageHeading={userPageAccessState.PageHeading}
                        showCount={true}
                    />
                    <form onSubmit={formSubmitHandler} ref={formRef} noValidate>

                        <div className="px-2 mb-1 mt-n3 c_card_filter header text-black" >

                            <div className=" mt-1 row  ">

                                <Col sm="6">
                                    <FormGroup className="mb-2 row mt-2  ">
                                        <Label className="mt-2" style={{ width: "115px" }}>{fieldLabel.Date} </Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name="Date"
                                                value={values.Date}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="0,''"
                                                disabled={pageMode === "edit" ? true : false}
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                    defaultDate: pageMode === "edit" ? values.Date : "today"
                                                }}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />
                                            {isError.Date.length > 0 && (
                                                <span className="invalid-feedback">{isError.Date}</span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col>

                                <Col sm="6">

                                    <FormGroup className="mb-2 row mt-2 ">
                                        <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.Items} </Label>
                                        <Col sm={7}>
                                            <Select
                                                name="Items"
                                                value={values.Items}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ItemDropdown_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                    ItemOnchange(hasSelect);
                                                    dispatch(Breadcrumb_inputName(hasSelect.label))
                                                }
                                                }

                                            />
                                            {isError.Items.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Items}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>

                                </Col >

                                <Col sm="6">
                                    <FormGroup className="mb-2 row  ">
                                        <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.NumberOfLots} </Label>
                                        <Col sm={7}>
                                            <Input
                                                name="NumberOfLots"
                                                value={values.NumberOfLots}
                                                type="text"
                                                className={isError.Quantity.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Number Of Lots"
                                                autoComplete='off'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.NumberOfLots.length > 0 && (
                                                <span className="invalid-feedback">{isError.NumberOfLots}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="6">
                                    <FormGroup className="mb-2 row  ">
                                        <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.Quantity} </Label>
                                        <Col sm={7}>
                                            <Input
                                                name="Quantity"
                                                value={values.Quantity}
                                                type="text"
                                                min={"1"}
                                                max={Itemselect.Quantity}
                                                className={isError.Quantity.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Quantity"
                                                autoComplete='off'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState });
                                                    Quantitychange(event.target.value)
                                                }}
                                            />
                                            {isError.Quantity.length > 0 && (
                                                <span className="invalid-feedback">{isError.Quantity}</span>
                                            )}
                                        </Col>
                                        <div className="col col-1">
                                            <Button
                                                color="btn btn-outline-success border-2 font-size-12 " style={{ marginTop: '3px' }}
                                                onClick={(e) => goButtonHandler(e)}
                                            >Go</Button>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </div>
                        </div>

                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField={"id"}
                                    data={ItemsData}
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


                        {/* <div className="px-2 mb-1 mt-n3" style={{ marginRight: '-28px', marginLeft: "-8px" }}>
                            <Row>
                                <FormGroup>

                                    <Col sm={2} style={{ marginLeft: "9px" }}>
                                        <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                            module={"BOMMaster"}
                                        />

                                    </Col>

                                </FormGroup >
                            </Row>
                        </div> */}
                    </form>
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

export default MaterialIssueMaster
