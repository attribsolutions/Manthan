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
import { BreadcrumbShowCountlabel, Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
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
import { Go_Button, SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
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
    postGoButtonForDemandSuccess,
    updateDemandId
} from "../../../store/Inter Branch/DemandRedux/action";
import { mySearchProps } from "../../../components/Common/ComponentRelatedCommonFile/MySearch";
import { Amount, handleKeyDown } from "../../Purchase/Order/OrderPageCalulation";
let comment = ''
let editVal = {}

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
    const [userAccState, setUserPageAccessState] = useState("");
    const [deliverydate, setdeliverydate] = useState(currentDate)
    const [demanddate, setdemanddate] = useState(currentDate)
    const [poFromDate, setpoFromDate] = useState(currentDate);
    const [poToDate, setpoToDate] = useState(currentDate);
    const [orderTypeSelect, setorderTypeSelect] = useState('');

    const [demandItemTable, setdemandItemTable] = useState([])
    const [demandAmount, setDemandAmount] = useState(0);
   
    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        InterBranches,
        GoButton,
    } = useSelector((state) => ({
        postMsg: state.DemandReducer.postMsg,
        updateMsg: state.DemandReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        InterBranches: state.DemandReducer.InterBranches,
        GoButton: state.DemandReducer.GoButton,
    }));

    // const { DemandItems = [] } = GoButton

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

                // // setItemselect(hasEditVal)
                // const { id, Item, ItemName, WorkDate, EstimatedOutputQty, NumberOfLot } = hasEditVal
                // setState((i) => {
                //     i.values.MaterialIssueDate = currentDate
                //     i.values.ItemName = { value: id, label: ItemName, Item: Item, NoLot: NumberOfLot, lotQty: EstimatedOutputQty };
                //     i.values.NumberOfLot = NumberOfLot;
                //     i.values.LotQuantity = EstimatedOutputQty;
                //     i.hasValid.ItemName.valid = true;
                //     i.hasValid.MaterialIssueDate.valid = true;
                //     i.hasValid.NumberOfLot.valid = true;
                //     i.hasValid.LotQuantity.valid = true;
                //     return i
                // })
           // ++++++++++++++++++++++++++**Dynamic go Button API Call method+++++++++++++++++

                const jsonBody = JSON.stringify({
                   
                    Supplier:values.Division.value,
                    Customer: userParty(),
                    EffectiveDate: demanddate,
                    DemandID: (pageMode === mode.save) ? 0 : editVal.id
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
            setState(() => resetFunction(fileds, state))// Clear form values 
            saveDissable(false);//save Button Is enable function

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
            saveDissable({ id: userAccState.ActualPagePath, dissable: false });//+++++++++save Button Is enable function
             dispatch(postDemandSuccess({ Status: false }))
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
            //  dispatch(updateBOMListSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss]);



    function val_onChange(val, row, type) {

        if (type === "qty") {
            row["Quantity"] = val;
        }
        else {
            row["Rate"] = val
        }

        row["Amount"] = Amount(row)

        let sum = 0
        demandItemTable.forEach(ind => {
            if (ind.Amount === null) {
                ind.Amount = 0
            }
            var amt = parseFloat(ind.Amount)
            sum = sum + amt
        });
        setDemandAmount(sum.toFixed(2))
        // dispatch(BreadcrumbShowCountlabel(`${"Order Amount"} :${sum.toFixed(2)}`))
        // dispatch(BreadcrumbShowCountlabel(`${"Order Amount"} :${sum.toFixed(2)}`))
        dispatch(BreadcrumbShowCountlabel(`${"Demand Amount"} :${sum.toFixed(2)}`))
    };


    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])


    const divisiondropdown_Options = InterBranches.map((i) => ({ label: i.Name, value: i.id }))


    useEffect(() => {
        if (GoButton) {
            let { DemandItems = [] } = GoButton
            setdemandItemTable(DemandItems)
            dispatch(postGoButtonForDemandSuccess(''))
        }
    }, [GoButton]);



    const goButtonHandler = () => {
    
        const jsonBody = JSON.stringify({
            Supplier: values.Division.value,
            Customer: userParty(),
            EffectiveDate: demanddate,
             DemandID: (pageMode === mode.save) ? 0 : editVal.id  
        })

        dispatch(postGoButtonForDemand(jsonBody))
    };

    function demanddateOnchange(e, date) {
        setdemanddate(date)
    };

   
    const SaveHandler = (event) => {
        event.preventDefault();
        const jsonBody = JSON.stringify({

                DemandDate: demanddate,
                DemandAmount: "102.00",
                Description: "",
                Customer: 4,
                Supplier: 5,
                Division:4,
                BillingAddressID: 4,
                ShippingAddressID: 4,
                Inward: 0,
                MaterialIssue: null,
                CreatedBy:1,
                UpdatedBy:1,
                DemandItem: [
                    {
                        Item: 62,
                        Quantity: "10",
                        Rate: "10.00",
                        Unit: 362,
                        BaseUnitQuantity: "1.000",
                        Margin: "",
                        BasicAmount: "100.00",
                        GSTAmount: "2.00",
                        GST: 61,
                        CGST: "1.00",
                        SGST: "1.00",
                        IGST: 0,
                        CGSTPercentage: 1,
                        SGSTPercentage: 1,
                        IGSTPercentage: 0,
                        Amount: "102.00",
                        IsDeleted: 0,
                        Comment: "asdasdas"
                    }
                ]
            }
        );
        saveDissable({ id: userAccState.ActualPagePath, state: true });//+++++++++save Button Is dissable function
debugger
        if (pageMode === mode.edit) {
            dispatch(updateDemandId(jsonBody, editVal.id))
        }
        else {
            dispatch(postDemand(jsonBody));
        }

    };

    const pagesListColumns = [
        {//------------- ItemName column ----------------------------------
            text: "Item Name",
            dataField: "ItemName",
            // headerFormatter: (value, row, k) => {
            //     return (
            //         <div className="d-flex justify-content-between">
            //             <div>
            //                 Item Name
            //             </div>

            //             <div>
            //                 <samp style={{ display: (supplierSelect.value > 0) && (findPartyItemAccess) ? "block" : "none" }} className="text-primary fst-italic text-decoration-underline"
            //                     onClick={assignItem_onClick}>
            //                     Assign-Items</samp>
            //             </div>

            //         </div>
            //     )
            // },
        },

        {//------------- Stock Quantity column ----------------------------------
            text: "Stock Qty",
            dataField: "StockQuantity",
            // sort: true,
            formatter: (value, row, k) => {

                return (
                    <div className="text-end">
                        <span>{row.StockQuantity}</span>
                    </div>
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            },
        },

        { //------------- Quantity column ----------------------------------
            text: "Quantity",
            dataField: "",
            // sort: true,
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`Quantity${k}`}
                            defaultValue={row.Quantity}
                            key={row.Quantity}
                            className="text-end"
                            onChange={(e) => {
                                const val = e.target.value
                                let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                                if ((isnum) || (val === '')) {
                                    val_onChange(val, row, "qty")
                                } else {
                                    document.getElementById(`Quantity${k}`).value = row.Quantity
                                }
                                handleKeyDown(e, demandItemTable)
                            }}
                            autoComplete="off"
                            onKeyDown={(e) => handleKeyDown(e, demandItemTable)}
                        />
                    </span>

                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }


        },

        {  //------------- Unit column ----------------------------------
            text: "Unit",
            dataField: "",
            // sort: true,
            formatter: (value, row, key) => {

                if (!row.UnitName) {
                    row["Unit_id"] = row.UnitDetails[0].UnitID
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
                                value: i.UnitID,
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

        {//------------- Rate column ----------------------------------
            text: "Rate/Unit",
            dataField: "",
            // sort: true,
            formatter: (value, row, k) => {

                return (
                    <span className="text-right" >
                        <Input
                            type="text"
                            id={`Ratey${k}`}
                            defaultValue={row.Rate}
                            autoComplete="off"
                            className="text-end"
                            onChange={(e) => {
                                const val = e.target.value
                                let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                                if ((isnum) || (val === '')) {
                                    // val_onChange(val, row, "rate")
                                } else {
                                    document.getElementById(`Ratey${k}`).value = row.Rate
                                }
                            }}
                            onKeyDown={(e) => handleKeyDown(e, demandItemTable)}
                        />
                    </span>
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        { //------------- Comment column ----------------------------------
            text: "Comment",
            dataField: "",
            // sort: true,
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`Comment${k}`}
                            defaultValue={row.Comment}
                            autoComplete="off"
                            onChange={(e) => { row["Comment"] = e.target.value }}
                        />
                    </span>

                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }

        },
    ];

    const defaultSorted = [
        {
            dataField: "PriceList", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pageOptions = {
        sizePerPage: (demandItemTable.length + 2),
        totalSize: 0,
        custom: true,
    };
    if (!(userAccState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                <BreadcrumbNew userAccess={userAccess} pageId={pageId.DEMAND} />

                <div className="page-content" >
                    <form>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
                            <Row>
                                <Col className=" mt-1 row  " sm={11} >
                                    <Col sm="6">
                                        <FormGroup className="row mt-2  ">
                                            <Label className="mt-1" style={{ width: "150px" }}>Date</Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    style={{ userselect: "all" }}
                                                    id="demanddate"
                                                    name="Date"
                                                    value={demanddate}
                                                    disabled={pageMode === "edit" ? true : false}
                                                    className="form-control d-block p-2 bg-white text-dark"
                                                    placeholder="Select..."
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={demanddateOnchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="row mt-2 ">
                                            <Label className="mt-2" style={{ width: "100px" }}> Division </Label>
                                            <Col sm={7}>
                                                <Select
                                                    isDisabled={pageMode === "edit" ? true : false}
                                                    name="Division"
                                                    value={values.Division}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={divisiondropdown_Options}
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
                                    keyField="id"
                                    defaultSorted={defaultSorted}
                                    data={demandItemTable}
                                    columns={pagesListColumns}
                                    search
                                >
                                    {(toolkitProps,) => (
                                        <React.Fragment>
                                            <Row>
                                                <Col xl="12">
                                                    <div className="table table-Rresponsive ">
                                                        <BootstrapTable
                                                            keyField={"id"}
                                                            responsive
                                                            bordered={false}
                                                            striped={false}
                                                            classes={"table  table-bordered table-hover"}
                                                            noDataIndication={
                                                                <div className="text-danger text-center ">
                                                                    Items Not available
                                                                </div>
                                                            }
                                                            {...toolkitProps.baseProps}
                                                            {...paginationTableProps}
                                                        />
                                                        {mySearchProps(toolkitProps.searchProps)}
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

                        {/* <FormGroup>
                            <Col sm={2} style={{ marginLeft: "9px" }}>
                                <SaveButton pageMode={pageMode}
                                    userAcc={userPageAccessState}
                                    editCreatedBy={editCreatedBy}
                                    module={"Demand"}
                                />
                            </Col>
                        </FormGroup> */}

                        {
                            ((demandItemTable.length > 0)) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                                <SaveButton pageMode={pageMode} userAcc={userAccState}
                                    module={"Demand"} onClick={SaveHandler}
                                />
                            </div>
                                : <div className="row save1"></div>
                        }
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
