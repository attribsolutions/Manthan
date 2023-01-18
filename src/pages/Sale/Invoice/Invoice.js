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
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import {
    postBOMSuccess,
    updateBOMListSuccess
} from "../../../store/Purchase/BOMRedux/action";
import { convertDatefunc, createdBy, currentDate, userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { postGoButtonForMaterialIssue_Master, postGoButtonForMaterialIssue_MasterSuccess, postMaterialIssue, postMaterialIssueSuccess } from "../../../store/Purchase/Matrial_Issue/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew";
import { GoButton_post_For_Invoice, postInvoiceMasterSuccess } from "../../../store/Sales/Invoice/action";
import { GetCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import { postInvoiceMaster } from "../../../store/Sales/Invoice/action";

const Invoice = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        // id: "",
        InvoiceDate: currentDate,
        CustomerName: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.save);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [Itemselect, setItemselect] = useState([])
    

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        customer,
        GoButton
    } = useSelector((state) => ({
        postMsg: state.MaterialIssueReducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        customer: state.SupplierReducer.customer,
        GoButton: state.InvoiceReducer.GoButton
    }));
    console.log("GoButton", GoButton)

    useEffect(() => {
        const page_Id = pageId.INVOICE
        dispatch(GetCustomer())
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

                setItemselect(hasEditVal)
                const { id, Item, CustomerName, WorkDate, EstimatedOutputQty, NumberOfLot } = hasEditVal
                setState((i) => {
                    i.values.InvoiceDate = currentDate
                    i.values.CustomerName = { value: id, label: CustomerName, Item: Item, NoLot: NumberOfLot, lotQty: EstimatedOutputQty };
                    i.values.NumberOfLot = NumberOfLot;
                    i.values.LotQuantity = EstimatedOutputQty;
                    i.hasValid.CustomerName.valid = true;
                    i.hasValid.InvoiceDate.valid = true;
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

                dispatch(postGoButtonForMaterialIssue_Master(jsonBody));
            }
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postInvoiceMasterSuccess({ Status: false }))
            // dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
            // dispatch(postBOMSuccess({ Status: false }))
            // setState(() => resetFunction(fileds, state))// Clear form values 
            // saveDissable(false);//save Button Is enable function

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
                    RedirectPath: url.INVOICE,
                }))
            }
        }
        else if (postMsg.Status === true) {

            dispatch(postInvoiceMasterSuccess({ Status: false }))
            // saveDissable(false);//save Button Is enable function
            dispatch(postBOMSuccess({ Status: false }))
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
            // setState(() => resetFunction(fileds, state))// Clear form values 
            // saveDissable(false);//save Button Is enable function
            history.push({
                pathname: url.MATERIAL_ISSUE_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            // saveDissable(false);//Update Button Is enable function
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
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const CustomerDropdown_Options = customer.map((index) => ({
        value: index.id,
        label: index.Name,

    }));

    function ItemOnchange(hasSelect, evn) {
        debugger
        onChangeSelect({ hasSelect, evn, state, setState });
        dispatch(Breadcrumb_inputName(hasSelect.label))
        // dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
        setState((i) => {
            i.values.CustomerName = hasSelect
            return i
        })
    }

    function goButtonHandler(event) {
        // event.preventDefault();
        // if (formValid(state, setState)) {
        const jsonBody = JSON.stringify({
            FromDate: values.InvoiceDate,
            Customer: values.CustomerName.value,
            Party: userParty(),
            OrderIDs: ""
        });

        dispatch(GoButton_post_For_Invoice(jsonBody));
        // }
    }

    const handleChange = (event, index) => {
        index.Qty = event.target.value
    };

    const SaveHandler = (event) => {
        debugger
        const validMsg = []

        const InvoiceItems = []
        GoButton.map((index) => {
            let Stock = index.StockDetails.map((i) => {
                return i.BaseUnitQuantity
            })
            var TotalStock = 0;
            Stock.forEach(x => {
                TotalStock += parseFloat(x);
            });
            var OrderQty = parseFloat(index.Quantity)
            if (OrderQty > TotalStock) {
                {
                    validMsg.push(`${index.ItemName}:Item is Out Of Stock`);
                };
            }
            if (index["invalid"]) {
                validMsg.push(`${index.ItemName}:${index["invalidMsg"]}`);
            };

            index.StockDetails.map((ele) => {
                InvoiceItems.push({
                    BatchCode: ele.BatchCode,
                    Quantity: index.Quantity,
                    BaseUnitQuantity: index.BaseUnitQuantity,
                    MRP: null,
                    Rate: index.Rate,
                    BasicAmount: index.BasicAmount,
                    TaxType: "GST",
                    GSTPercentage: index.GSTPercentage,
                    GSTAmount: index.GSTAmount,
                    Amount: index.Amount,
                    DiscountType: "",
                    Discount: "0",
                    DiscountAmount: "0",
                    CGST: index.CGST,
                    SGST: index.SGST,
                    IGST: index.IGST,
                    CGSTPercentage: index.CGSTPercentage,
                    SGSTPercentage: index.SGSTPercentage,
                    IGSTPercentage: index.IGSTPercentage,
                    CreatedOn: "",
                    Item: index.Item,
                    Unit: index.Unit,
                    BatchDate: index.BatchDate,
                    BatchID: ele.id,
                    InvoicesReferences:[{"Order":index.OrderID}]
                })
            })
        })

        const FilterData = InvoiceItems.filter((index) => {
            return (index.IssueQuantity > 0)
        })
       
        event.preventDefault();
        if (formValid(state, setState)) {

            const jsonBody = JSON.stringify({
                InvoiceDate: currentDate,
                CustomerGSTTin: "2023-01-06",
                GrandTotal: "6615.00",
                RoundOffAmount: 1,
                Customer: values.CustomerName.value,
                Party: userParty(),
                CreatedBy: createdBy(),
                UpdatedBy: createdBy(),
                InvoiceItems: InvoiceItems,
            }
            );
            if (pageMode === mode.edit) {
            }
            else {
                dispatch(postInvoiceMaster(jsonBody));
            }
        };
    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            style: (cellContent, user) => {

                let Stock = user.StockDetails.map((index) => {
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

        // {
        //     text: "Order Qty",
        //     dataField: "Quantity",
        // },
        {
            text: "Quantity",
            dataField: "Quantity",
            formatter: (cellContent, user) => (
                <>
                    <div style={{ width: "150px" }}>
                        <Input type="text"
                            style={{ textAlign: "right" }}
                            defaultValue={cellContent}
                        // onChange={(event) => handleChange(event, index)}
                        ></Input>
                    </div>
                </>
            )
        },
        {
            text: "Unit",
            dataField: "",
            formatter: (value, row, key) => {
                debugger
                if (!row.UnitName) {
                    row["Unit_id"] = row.UnitDetails[0].Unit
                    row["UnitName"] = row.UnitDetails[0].UnitName
                    row["BaseUnitQuantity"] = row.UnitDetails[0].BaseUnitQuantity
                    row["poBaseUnitQty"] = row.UnitDetails[0].BaseUnitQuantity
                }

                return (
                    <Select
                        classNamePrefix="select2-selection"
                        id={"ddlUnit"}
                        defaultValue={{ value: row.Unit_id, label: row.UnitName }}
                        // value={{value:row.Unit,label:row.UnitName}}
                        options={
                            row.UnitDetails.map(i => ({
                                label: i.UnitName,
                                value: i.Unit,
                                baseUnitQty: i.BaseUnitQuantity
                            }))
                        }
                        onChange={e => {
                            row["Unit_id"] = e.value;
                            row["UnitName"] = e.label
                            row["BaseUnitQuantity"] = e.baseUnitQty
                        }}
                    >
                    </Select >
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '150px', textAlign: 'center' };
            }
        },
        {
            text: "Batch Code",
            dataField: "StockDetails",

            formatter: (cellContent, user) => (
                <>
                    <Table className="table table-bordered table-responsive mb-1">
                        <Thead  >
                            <tr style={{ zIndex: "23" }} className="">
                                <th className="">Batch Code </th>
                                <th className="" >Supplier BatchCode</th>
                                <th className="" >Batch Date</th>
                                <th className="">Stock Quantity</th>
                                <th className="" >Quantity</th>
                            </tr>
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
                {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.INVOICE} /> */}

                <div className="page-content" >

                    <form onSubmit={SaveHandler} noValidate>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
                            <Row>
                                <Col className=" mt-1 row  " sm={11} >
                                    <Col sm="6">
                                        <FormGroup className="row mt-2 mb-3  ">
                                            <Label className="mt-1" style={{ width: "150px" }}>{fieldLabel.InvoiceDate} </Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    name="InvoiceDate"
                                                    value={values.InvoiceDate}
                                                    className="form-control d-block bg-white text-dark"
                                                    placeholder="YYYY-MM-DD"
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                />
                                                {isError.InvoiceDate.length > 0 && (
                                                    <span className="invalid-feedback">{isError.InvoiceDate}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="row mt-2 mb-3 ">
                                            <Label className="mt-2" style={{ width: "100px" }}> {fieldLabel.CustomerName} </Label>
                                            <Col sm={7}>
                                                <Select
                                                    // isDisabled={values.CustomerName ? true : null}
                                                    name="CustomerName"
                                                    value={values.CustomerName}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={CustomerDropdown_Options}
                                                    onChange={ItemOnchange}
                                                />
                                                {isError.CustomerName.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.CustomerName}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >

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

                        {GoButton.length > 0 ? <FormGroup>
                            <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                <SaveButton pageMode={pageMode}
                                    //   onClick={onsave}
                                    userAcc={userPageAccessState}
                                    module={"Material Issue"}
                                />
                            </Col>
                        </FormGroup > : null}
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

export default Invoice
