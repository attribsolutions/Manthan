import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr"
import { BreadcrumbShowCountlabel, Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeText,
    resetFunction
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import { Go_Button, SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import {
    createdBy,
    currentDate,
    saveDissable,
    userCompany,
    userParty
} from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import {
    editIBOrderIdSuccess,
    postIBOrder,
    postIBOrderSuccess,
    postDivision,
    postGoButtonForIBOrder,
    postGoButtonForIBOrderSuccess,
    updateIBOrderId,
    updateIBOrderIdSuccess
} from "../../../store/Inter Branch/IBOrderRedux/action";
import { mySearchProps } from "../../../components/Common/ComponentRelatedCommonFile/MySearch";
import { Amount, basicAmount, GstAmount, handleKeyDown } from "../../Purchase/Order/OrderPageCalulation";

const IBOrder = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        IBOrderDate: currentDate,
        SupplierName: "",
        Comment: "",
        IBOrderNo: "",
        FullIBOrderNumber: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [EditData, setEditData] = useState({});
    const [userAccState, setUserPageAccessState] = useState("");
    const [iborderdate, setiborderdate] = useState(currentDate)
    const [iborderItemTable, setiborderItemTable] = useState([])
    const [iborderAmount, setIBOrderAmount] = useState(0);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        Supplier,
        GoButton,
    } = useSelector((state) => ({
        postMsg: state.IBOrderReducer.postMsg,
        updateMsg: state.IBOrderReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Supplier: state.IBOrderReducer.Supplier,
        GoButton: state.IBOrderReducer.GoButton,
    }));

    useEffect(() => {
        const page_Id = pageId.IB_ORDER
        dispatch(postGoButtonForIBOrderSuccess([]))
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

                // console.log("hasEditVal", hasEditVal)

                setEditData(hasEditVal);
                const { id, SupplierName, Supplier, Comment, IBOrderDate, IBOrderNo, FullIBOrderNumber } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.IBOrderDate = IBOrderDate;
                values.SupplierName = { value: hasEditVal.Supplier, label: hasEditVal.SupplierName };
                values.Comment = Comment;
                values.IBOrderNo = IBOrderNo;
                values.FullIBOrderNumber = FullIBOrderNumber;
                values.id = id;

                hasValid.SupplierName.valid = true;
                hasValid.IBOrderDate.valid = true;
                hasValid.Comment.valid = true;
                hasValid.IBOrderNo.valid = true;
                hasValid.FullIBOrderNumber.valid = true;
                hasValid.id.valid = true

                // ++++++++++++++++++++++++++**Dynamic go Button API Call method+++++++++++++++++

                const jsonBody = JSON.stringify({
                    Supplier: hasEditVal.Supplier,
                    Customer: userParty(),
                    EffectiveDate: hasEditVal.IBOrderDate,
                    IBOrderID: hasEditVal.id
                })
                dispatch(postGoButtonForIBOrder(jsonBody));
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(editIBOrderIdSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
            }
        }
    }, [])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postIBOrderSuccess({ Status: false }))
            dispatch(postGoButtonForIBOrderSuccess([]))
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
                    RedirectPath: url.IB_ORDER_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            saveDissable({ id: userAccState.ActualPagePath, dissable: false });//+++++++++save Button Is enable function
            dispatch(postIBOrderSuccess({ Status: false }))
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
            // Comment = ''
            history.push({
                pathname: url.IB_ORDER_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            saveDissable(false);//Update Button Is enable function
            dispatch(updateIBOrderIdSuccess({ Status: false }));
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

    useEffect(() => {
        if (GoButton) {
            let { IBOrderItems = [] } = GoButton
            setiborderItemTable(IBOrderItems)
            dispatch(postGoButtonForIBOrderSuccess(''))
        }
    }, [GoButton]);

    const SupplierDropdown_Options = Supplier.map((i) => ({ label: i.Name, value: i.id }))

    const pagesListColumns = [

        {//------------- ItemName column ----------------------------------
            text: "Item Name",
            dataField: "ItemName",
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
                    <span>
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
                                handleKeyDown(e, iborderItemTable)
                            }}
                            autoComplete="off"
                            onKeyDown={(e) => handleKeyDown(e, iborderItemTable)}
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

        // {//------------- Rate column ----------------------------------
        //     text: "Rate/Unit",
        //     dataField: "",
        //     formatter: (value, row, k) => {

        //         return (
        //             <span className="text-right" >
        //                 <Input
        //                     type="text"
        //                     id={`Ratey${k}`}
        //                     defaultValue={row.Rate}
        //                     autoComplete="off"
        //                     className="text-end"
        //                     onChange={(e) => {
        //                         const val = e.target.value
        //                         let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
        //                         if ((isnum) || (val === '')) {
        //                             val_onChange(val, row, "rate")
        //                         } else {
        //                             document.getElementById(`Ratey${k}`).value = row.Rate
        //                         }
        //                     }}
        //                     onKeyDown={(e) => handleKeyDown(e, iborderItemTable)}
        //                 />
        //             </span>
        //         )
        //     },

        //     headerStyle: (colum, colIndex) => {
        //         return { width: '140px', textAlign: 'center' };
        //     }
        // },
    ];

    const defaultSorted = [
        {
            dataField: "PriceList", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pageOptions = {
        sizePerPage: (iborderItemTable.length + 2),
        totalSize: 0,
        custom: true,
    };

    const goButtonHandler = () => {
      
        // if (!SupplierSelect > 0) {
        //     dispatch(
        //         AlertState({
        //             Type: 4,
        //             Status: true,
        //             Message: "Please select Division",
        //             RedirectPath: false,
        //             PermissionAction: false,
        //         })
        //     );
        //     return;
        // }
        const jsonBody = JSON.stringify({
            Supplier: values.SupplierName.value,
            Customer: userParty(),
            EffectiveDate: iborderdate,
            IBOrderID: (pageMode === mode.defaultsave) ? 0 : EditData.id
        })

        dispatch(postGoButtonForIBOrder(jsonBody))
    };

    function iborderdateOnchange(e, date) {
        setiborderdate(date)
    };

    function permissionfunc(istrue) {
        if (istrue) {
            // setSupplierSelect(istrue)// **istrue is == event value
            setiborderItemTable([])
        }
    }

    function SupplierOnchange(e) {
        var isfind = iborderItemTable.find(i => (i.Quantity > 0))
        if (isfind) {
            dispatch(
                AlertState({
                    Type: 7,
                    Status: true,
                    Message: "If you are change Division Name then All Item Data is Clear",
                    RedirectPath: false,
                    PermissionFunction: permissionfunc,
                    permissionValueReturn: e
                })
            );
            return;
        } else {
            // setSupplierSelect(e)
            setState((i) => {
                i.values.SupplierName = e;
                return i
            })
            setiborderItemTable([])
        }
    };

    function val_onChange(val, row, type) {

        if (type === "qty") {
            row["Quantity"] = val;
        }
        else {
            row["Rate"] = val
        }

        row["Amount"] = Amount(row)

        let sum = 0
        iborderItemTable.forEach(ind => {
            if (ind.Amount === null) {
                ind.Amount = 0
            }
            var amt = parseFloat(ind.Amount)
            sum = sum + amt
        });
        setIBOrderAmount(sum.toFixed(2))
        dispatch(BreadcrumbShowCountlabel(`${"IBOrder Amount"} :${sum.toFixed(2)}`))
    };

    const SaveHandler = (event) => {
        event.preventDefault();
        const validMsg = []
        const itemArr = []

        function isChanged({ i, isedit, isdel }) {
            const basicAmt = parseFloat(basicAmount(i))
            const cgstAmt = (GstAmount(i))
            const arr = {
                id: i.editrowId,
                Item: i.Item_id,
                Quantity: isdel ? 0 : i.Quantity,
                Rate: i.Rate,
                Unit: i.Unit_id,
                BaseUnitQuantity: i.BaseUnitQuantity,
                Margin: "",
                BasicAmount: basicAmt.toFixed(2),
                GSTAmount: cgstAmt.toFixed(2),
                GST: i.GST_id,
                CGST: (cgstAmt / 2).toFixed(2),
                SGST: (cgstAmt / 2).toFixed(2),
                IGST: 0,
                CGSTPercentage: (i.GSTPercentage / 2),
                SGSTPercentage: (i.GSTPercentage / 2),
                IGSTPercentage: 0,
                Amount: i.Amount,
                IsDeleted: isedit,
            }
            itemArr.push(arr)
        };

        function iborderItem({ i, isedit }) {
            if ((i.Quantity > 0) && (i.Rate > 0)) {
                var isdel = false;
                isChanged({ i, isedit, isdel })
            }
            else if ((i.Quantity < 1) && (i.editrowId)) {
                var isdel = true;
                isChanged({ i, isedit, isdel })
            };
        };

        iborderItemTable.forEach(i => {

            // if ((i.Quantity > 0) && !(i.Rate > 0)) {
            //     validMsg.push(`${i.ItemName}:  This Item Rate Is Require...`);
            // }

            if (pageMode === "edit") {
                const ischange = (!(i.poQty === i.Quantity) ||
                    !(i.poRate === i.Rate) || !(i.poBaseUnitQty === i.BaseUnitQuantity))

                if (ischange && (i.poQty === 0)) {
                    var isedit = 0;
                    iborderItem({ i, isedit })
                }
                else if (ischange) {
                    var isedit = 1;
                    iborderItem({ i, isedit })
                } else {
                    var isedit = 0;
                    iborderItem({ i, isedit })
                }
            }
            else {
                var isedit = 0;
                iborderItem({ i, isedit })
            };
        });

        if (validMsg.length > 0) {
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: validMsg,
                RedirectPath: false,
                AfterResponseAction: false
            }));
            return
        };

        if (itemArr.length === 0) {
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "Please Enter One  Quantity",
                RedirectPath: false,
                AfterResponseAction: false
            }));
            return
        };

        const jsonBody = JSON.stringify({
            DemandDate: iborderdate,
            DemandAmount: iborderAmount,
            Comment: values.Comment,
            Customer: userParty(),
            Supplier: values.SupplierName.value,
            Division: userParty(),
            BillingAddressID: 4,
            ShippingAddressID: 4,
            Inward: 0,
            DemandNo: (pageMode === "edit" ? EditData.IBOrderNo : values.IBOrderNo),
            FullDemandNumber: (pageMode === "edit" ? EditData.FullIBOrderNumber : values.FullIBOrderNumber),
            MaterialIssue: null,
            CreatedBy: createdBy(),
            UpdatedBy: createdBy(),
            DemandItem: itemArr
        }
        );
        //  saveDissable({ id: userAccState.ActualPagePath, state: true });//+++++++++save Button Is dissable function
        if (pageMode === mode.edit) {
            dispatch(updateIBOrderId(jsonBody, EditData.id))
        }
        else {
            dispatch(postIBOrder(jsonBody));
        }
    }

    if (!(userAccState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                <div className="page-content" >
                    <form>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
                            <Row>
                                <Col className=" mt-1 row " sm={11} >
                                    <Col sm="6">
                                        <FormGroup className="row mt-2  ">
                                            <Label className="mt-1" style={{ width: "150px" }}> IBOrder Date</Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    style={{ userselect: "all" }}
                                                    id="iborderdate"
                                                    name="Date"
                                                    value={iborderdate}
                                                    disabled={pageMode === mode.edit ? true : false}
                                                    className="form-control d-block p-2 bg-white text-dark"
                                                    placeholder="Select..."
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={iborderdateOnchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="row mt-2 ">
                                            <Label className="mt-2" style={{ width: "100px" }}> Division </Label>
                                            <Col sm={7}>
                                                <Select
                                                    isDisabled={pageMode === mode.edit ? true : false}
                                                    name="SupplierName"
                                                    value={values.SupplierName}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={SupplierDropdown_Options}
                                                    onChange={SupplierOnchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                    <Col sm="6">
                                        <FormGroup className="mb-2 mt-2 row  " style={{ marginTop: "" }}>
                                            <Label className="mt-1 " style={{ width: "150px" }}> Comment </Label>
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

                                    {
                                        pageMode === mode.edit ? <Col sm="6">
                                            <FormGroup className="row mt-2 ">
                                                <Label className="mt-2" style={{ width: "100px" }}> IBOrder No. </Label>
                                                <Col sm={7}>
                                                    <Input
                                                        name="IBOrderNo"
                                                        value={values.IBOrderNo}
                                                        type="text"
                                                        disabled={true}
                                                    />

                                                </Col>
                                            </FormGroup>
                                        </Col > : <></>
                                    }

                                </Col>

                                <Col sm="1" className="mx-2 mt-3">
                                    {pageMode === mode.defaultsave ?
                                        <Go_Button onClick={(e) => goButtonHandler()} />
                                        : null}
                                </Col>
                            </Row>
                        </Col>

                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField="id"
                                    defaultSorted={defaultSorted}
                                    data={iborderItemTable}
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
                        {
                            ((iborderItemTable.length > 0)) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                                <SaveButton pageMode={pageMode} userAcc={userAccState}
                                    module={"IBOrder"}
                                    onClick={SaveHandler}
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

export default IBOrder
