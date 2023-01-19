import React, { useEffect, useState, } from "react";
import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table
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
    resetFunction,
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import {
    convertDatefunc,
    createdBy,
    currentDate,
    saveDissable,
    userCompany,
    userParty
} from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew";
import {
    postDemand,
    postDemandSuccess,
    postDivision,
    postGoButtonForDemand,
    postGoButtonForDemandSuccess
} from "../../../store/Inter Branch/DemandRedux/action";

const Demand = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {

        Date: currentDate,
        Division: "",
        Comment: "",

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [deliverydate, setdeliverydate] = useState(currentDate)
    const [demanddate, setdemanddate] = useState(currentDate)
    const [poFromDate, setpoFromDate] = useState(currentDate);
    const [poToDate, setpoToDate] = useState(currentDate);
    const [demandAmount, setdemandAmount] = useState(0);
    const [orderTypeSelect, setorderTypeSelect] = useState('');
    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        InterBranches,
        GoButton
    } = useSelector((state) => ({
        postMsg: state.DemandReducer.postMsg,
        updateMsg: state.DemandReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Division: state.DemandReducer.InterBranches,
        GoButton: state.DemandReducer.GoButton
    }));

    useEffect(() => {
        const page_Id = pageId.DEMAND
        dispatch(postGoButtonForDemandSuccess([]))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

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
            Company: userCompany(),
            Party: userParty()
        });
        dispatch(postDivision(jsonBody));
    }, []);


    // useEffect(() => {
    //     const jsonBody = JSON.stringify({
    //         // FromDate: "2022-12-01",
    //         ToDate: currentDate
    //     });
    //     // dispatch(getWorkOrderListPage(jsonBody));
    // }, [])

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

                // setItemselect(hasEditVal)
                const { id, Item, ItemName, WorkDate, EstimatedOutputQty, NumberOfLot } = hasEditVal
                setState((i) => {
                    i.values.MaterialIssueDate = currentDate
                    i.values.ItemName = { value: id, label: ItemName, Item: Item, NoLot: NumberOfLot, lotQty: EstimatedOutputQty };
                    i.values.NumberOfLot = NumberOfLot;
                    i.values.LotQuantity = EstimatedOutputQty;
                    i.hasValid.ItemName.valid = true;
                    i.hasValid.MaterialIssueDate.valid = true;
                    i.hasValid.NumberOfLot.valid = true;
                    i.hasValid.LotQuantity.valid = true;
                    return i
                })

                // ++++++++++++++++++++++++++**Dynamic go Button API Call method+++++++++++++++++
                const jsonBody = JSON.stringify({
                    WorkOrder: id,
                    Item: Item,
                    Company: userCompany(),
                    Party: userParty(),
                    Quantity: parseInt(EstimatedOutputQty)
                });
                dispatch(postGoButtonForDemand(jsonBody));
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postDemandSuccess({ Status: false }))
            dispatch(postGoButtonForDemandSuccess([]))
            // dispatch(postBOMSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values 
            saveDissable(false);//save Button Is enable function

            // dispatch(AlertState({
            //     Type: 1,
            //     Status: true,
            //     Message: "Item is out of stock",
            //     RedirectPath: url.MATERIAL_ISSUE_LIST,
            // }))
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
                    RedirectPath: url.DEMAND_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {

            dispatch(postDemandSuccess({ Status: false }))
            // saveDissable(false);//save Button Is enable function
            // dispatch(postBOMSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            setState(() => resetFunction(fileds, state))// Clear form values 
            saveDissable(false);//save Button Is enable function
            history.push({
                pathname: url.DEMAND_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            saveDissable(false);//Update Button Is enable function
            // dispatch(updateBOMListSuccess({ Status: false }));
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

    // const divisiondropdown_Options = InterBranches.map((i) => ({ label: i.Name, value: i.id }))


    function goButtonHandler(event) {


        event.preventDefault();
        if (state.values.LotQuantity == "0") {
            alert("Quantity Can Not be 0")
        } else
            if (formValid(state, setState)) {

                const jsonBody = JSON.stringify({
                    WorkOrder: values.ItemName.value,
                    Item: values.ItemName.Item,
                    Company: userCompany(),
                    Party: userParty(),
                    Quantity: parseInt(values.LotQuantity)
                });

                dispatch(postGoButtonForDemand(jsonBody));
            }
    }

    function DivisionOnchange(e) {
        dispatch(postGoButtonForDemandSuccess([]))
        // setItemselectonchange(e)
        setState((i) => {
            i.values.ItemName = {
                value: e.value,
                label: e.label,
                Item: e.Item,
                NoLot: e.NumberOfLot,
                lotQty: e.Quantity
            };
            i.values.NumberOfLot = e.NumberOfLot;
            i.values.LotQuantity = e.Quantity;
            i.hasValid.NumberOfLot.valid = true;
            i.hasValid.LotQuantity.valid = true;
            i.hasValid.ItemName.valid = true;
            return i
        })
    }


    // function Quantitychange(event) {


    //     dispatch(postGoButtonForDemandSuccess([]))
    //     let value1 = Math.max('', Math.min(Itemselectonchange.value > 0 ?
    //         Itemselectonchange.Quantity :
    //         Itemselect.Quantity, Number(event.target.value)));
    //     event.target.value = value1
    //     if (event.target.value === "NaN") {
    //         value1 = 0
    //     }
    //     // onChangeText({ event, state, setState });
    //     setState((i) => {
    //         i.values.LotQuantity = value1
    //         // i.hasValid.NumberOfLot.valid = true;
    //         i.hasValid.LotQuantity.valid = true;
    //         return i
    //     })
    // }

    // function NumberOfLotchange(event) {
    //     //  dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
    //     let value1 = Math.max('', Math.min(Itemselectonchange.value > 0 ?
    //         Itemselectonchange.NumberOfLot
    //         : Itemselect.NumberOfLot, Number(event.target.value)));
    //     event.target.value = value1
    //     if ((event.target.value === "NaN")) {
    //         value1 = 0
    //     }
    //     // onChangeText({ event, state, setState });
    //     setState((i) => {
    //         i.values.NumberOfLot = value1
    //         i.hasValid.NumberOfLot.valid = true;
    //         // i.hasValid.LotQuantity.valid = true;
    //         return i
    //     })
    // }

    const handleChange = (event, index) => {
        // GoButton.map((index) => {
        //     let Stock = index.BatchesData.map((i) => {
        //         return i.BaseUnitQuantity
        //     })       
        // console.log(Stock)

        // })

        // var OrderQty = parseFloat(stockQty)
        // console.log(Stock)


        index.Qty = event.target.value
    };

    const SaveHandler = (event) => {

        const jsonBody = JSON.stringify({

            DemandDate: demanddate,
            DeliveryDate: deliverydate,
            Customer: 4,
            Supplier: 5,
            DemandAmount: demandAmount,
            Description: "",
            BillingAddress: 4,
            ShippingAddress: 4,
            OrderNo: 1,
            FullOrderNumber: "PO0001",
            OrderType: 1,
            POType: 1,
            Division: 4,
            POFromDate: orderTypeSelect.value === 1 ? currentDate : poFromDate,
            POToDate: orderTypeSelect.value === 1 ? currentDate : poToDate,
            CreatedBy: createdBy(),
            UpdatedBy: createdBy(),
            DemandItem: [
                {
                    Item: 62,
                    // Quantity: isdel ? 0 : i.Quantity,
                    // Rate: i.Rate,
                    Unit: 362,
                    // BaseUnitQuantity: i.BaseUnitQuantity,
                    Margin: "",
                    // BasicAmount: basicAmt.toFixed(2),
                    // GSTAmount: cgstAmt.toFixed(2),
                    GST: 61,
                    // CGST: (cgstAmt / 2).toFixed(2),
                    // SGST: (cgstAmt / 2).toFixed(2),
                    IGST: 0,
                    CGSTPercentage: 1,
                    SGSTPercentage: 1,
                    IGSTPercentage: 0,
                    // Amount: i.Amount,
                    IsDeleted: 0,
                    // Comment: i.Comment
                }
            ],
            DemandReferences: [
                {
                    MaterialIssue: ""
                }

            ]

        }
        );
        if (pageMode === mode.edit) {
        }
        else {
            dispatch(postDemand(jsonBody));
        }
    };

    const pagesListColumns = [
        {
            text: "Item Group",
            dataField: "ItemGroup",
            style: (cellContent, user, cell, row, rowIndex, colIndex) => {

                let Stock = user.BatchesData.map((index) => {
                    return index.BaseUnitQuantity
                })
                var TotalStock = 0;
                Stock.forEach(x => {
                    TotalStock += parseFloat(x);
                });
                var OrderQty = parseFloat(user.Quantity)
                if (OrderQty > TotalStock) {
                    return {
                        color: "red",

                    };
                }
            },
        },

        {
            text: "ItemName",
            dataField: "ItemName",
        },
        {
            text: "Stock Qty",
            dataField: "StockQty",
        },
        {
            text: "Consolidation Qty",
            dataField: "ConsolidationQty",

            formatter: (cellContent, user) => (
                <>
                    <Table className="table table-bordered table-responsive mb-1">
                        <Thead  >
                            {/* <tr style={{ zIndex: "23" }} className="">
                                <th className="">Batch Code </th>
                                <th className="" >Supplier BatchCode</th>
                                <th className="" >Batch Date</th>
                                <th className="">Stock Quantity</th>
                                <th className="" >Quantity</th>
                            </tr> */}
                        </Thead>
                        <Tbody  >
                            {cellContent.map((index) => {
                                return (
                                    < tr >
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Label  >
                                                    {index.SystemBatchCode}
                                                </Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Label>
                                                    {index.BatchCode}
                                                </Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "100px" }}>
                                                <Label>
                                                    {convertDatefunc(index.BatchDate)}
                                                </Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "120px", textAlign: "right" }}>
                                                <Label
                                                // onKeyDown={(e) => handleKeyDown(e, GoButton)}
                                                >
                                                    {index.BaseUnitQuantity}
                                                </Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Input type="text"
                                                    style={{ textAlign: "right" }}
                                                    defaultValue={index.Qty}
                                                    onChange={(event) => handleChange(event, index)}
                                                ></Input>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </>
            ),
        },

        {
            text: "Demanded Qty",
            dataField: "DemandedQty",
        },

        {
            text: "Qty",
            dataField: "Qty",
        },

        {
            text: "Unit",
            dataField: "UnitName",
        },

        {
            text: "Comment",
            dataField: "Comment",
        },

    ]

    const pageOptions = {
        sizePerPage: 10,
        totalSize: GoButton.length,
        custom: true,
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                <BreadcrumbNew userAccess={userAccess} pageId={pageId.DEMAND} />

                <div className="page-content" >
                    <form onSubmit={SaveHandler} noValidate>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
                            <Row>
                                <Col className=" mt-1 row  " sm={11} >
                                    <Col sm="6">
                                        <FormGroup className="row mt-2  ">
                                            <Label className="mt-1" style={{ width: "150px" }}>Date</Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    name="Date"
                                                    value={demanddate}
                                                    className="form-control d-block bg-white text-dark"
                                                    placeholder="YYYY-MM-DD"
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                />
                                                {isError.Date.length > 0 && (
                                                    <span className="invalid-feedback">{isError.Date}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="row mt-2 ">
                                            <Label className="mt-2" style={{ width: "100px" }}> Division </Label>
                                            <Col sm={7}>
                                                <Select
                                                    isDisabled={values.Division ? true : null}
                                                    name="Division"
                                                    value={values.Division}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    // options={divisiondropdown_Options}
                                                    onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}

                                                />
                                                {isError.Division.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.Division}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                    <Col sm="6">
                                        <FormGroup className="mb-2 mt-2 row  " style={{ marginTop: "" }}>
                                            <Label className="mt-1" style={{ width: "150px" }}> Comment </Label>
                                            <Col sm={7}>
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
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Col>

                                <Col sm={1} className="mt-2">
                                    <Button
                                        color="btn btn-outline-success border-2 font-size-12 " style={{ marginTop: '3px' }}
                                        onClick={(e) => goButtonHandler(e)}
                                    >Go</Button>
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                        </Col>

                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField={"id"}
                                    data={GoButton}
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
                                                            classes={"table  table-bordered"}
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

                        <FormGroup>
                            <Col sm={2} style={{ marginLeft: "9px" }}>
                                <SaveButton pageMode={pageMode}
                                    userAcc={userPageAccessState}
                                    editCreatedBy={editCreatedBy}
                                    module={"Demand"}
                                />
                            </Col>
                        </FormGroup>
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

export default Demand
