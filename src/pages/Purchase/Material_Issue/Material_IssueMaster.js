import React, { useEffect, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb3"
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
import { getWorkOrderListPage } from "../../../store/Purchase/WorkOrder/action";
import { postGoButtonForMaterialIssue_Master, postGoButtonForMaterialIssue_MasterSuccess, postMaterialIssue, postMaterialIssueSuccess } from "../../../store/Purchase/Matrial_Issue/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import { handleKeyDown } from "../Order/OrderPageCalulation";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"

const MaterialIssueMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        MaterialIssueDate: currentDate,
        ItemName: "",
        NumberOfLot: "",
        LotQuantity: "",
        
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(url.MATERIAL_ISSUE);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [Itemselect, setItemselect] = useState([])
    const [Itemselectonchange, setItemselectonchange] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        Items,
        GoButton
    } = useSelector((state) => ({
        postMsg: state.MaterialIssueReducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Items: state.WorkOrderReducer.WorkOrderList,
        GoButton: state.MaterialIssueReducer.GoButton
    }));

    useEffect(() => {
        const page_Id = pageId.MATERIAL_ISSUE
        dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
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
            FromDate: "2022-12-01",
            ToDate: currentDate
        });
        dispatch(getWorkOrderListPage(jsonBody));
    }, [])

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
                const { id, Item, ItemName, WorkDate, EstimatedOutputQty, NumberOfLot } = hasEditVal
                setState((i) => {
                    i.values.MaterialIssueDate = currentDate
                    i.values.ItemName = { value: id, label: ItemName, Item: Item };
                    i.values.NumberOfLot = NumberOfLot;
                    i.values.LotQuantity = EstimatedOutputQty;
                    i.hasValid.ItemName.valid = true;
                    i.hasValid.MaterialIssueDate.valid = true;
                    i.hasValid.NumberOfLot.valid = true;
                    i.hasValid.LotQuantity.valid = true;
                    return i
                })
            }
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postMaterialIssueSuccess({ Status: false }))
            dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
            dispatch(postBOMSuccess({ Status: false }))
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
                    RedirectPath: url.MATERIAL_ISSUE_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {

            dispatch(postMaterialIssueSuccess({ Status: false }))
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

    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.ItemName,
        Quantity: index.Quantity,
        Item: index.Item,
        BomID: index.Bom,
        Unit: index.Unit,
        NumberOfLot: index.NumberOfLot
    }));

    function ItemOnchange(hasSelect, evn) {
        onChangeSelect({ hasSelect, evn, state, setState });
        dispatch(Breadcrumb_inputName(hasSelect.label))
        dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
        setState((i) => {
            i.values.ItemName = hasSelect
            i.values.NumberOfLot = hasSelect.NumberOfLot;
            i.values.LotQuantity = hasSelect.Quantity;
            i.hasValid.NumberOfLot.valid = true;
            i.hasValid.LotQuantity.valid = true;
            i.hasValid.MaterialIssueDate.valid = true;
            return i
        })
    }

    function goButtonHandler(event) {
        debugger

        event.preventDefault();
        if (state.values.LotQuantity == "0") {
            alert("Quantity Can Not be 0")
        }else
        if (formValid(state, setState)) {
           
            const jsonBody = JSON.stringify({
                WorkOrder: values.ItemName.value,
                Item: values.ItemName.Item,
                Company: userCompany(),
                Party: userParty(),
                Quantity: parseInt(values.LotQuantity)
            });

            dispatch(postGoButtonForMaterialIssue_Master(jsonBody));
        }
    }

    function ItemOnchange(e) {
        dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
        setItemselectonchange(e)
        setState((i) => {
            i.values.ItemName = { value: e.value, label: e.label, Item: e.Item };
            i.values.NumberOfLot = e.NumberOfLot;
            i.values.LotQuantity = e.Quantity;
            i.hasValid.NumberOfLot.valid = true;
            i.hasValid.LotQuantity.valid = true;
            i.hasValid.ItemName.valid = true;
            return i
        })
    }
   

    function Quantitychange(event) {


        dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
        const value1 = Math.max('', Math.min(Itemselectonchange.value > 0 ?
            Itemselectonchange.Quantity :
            Itemselect.Quantity, Number(event.target.value)));
        event.target.value = value1
        if (event.target.value === "NaN") {
            event.target.value = 0
        }
        onChangeText({ event, state, setState });
        setState((i) => {
            i.hasValid.NumberOfLot.valid = true;
            i.hasValid.LotQuantity.valid = true;
            return i
        })
    }

    function NumberOfLotchange(event) {
        dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
        const value1 = Math.max('', Math.min(Itemselectonchange.value > 0 ?
            Itemselectonchange.NumberOfLot
            : Itemselect.NumberOfLot, Number(event.target.value)));
        event.target.value = value1
        if ((event.target.value === "NaN")) {
            event.target.value = 0
        }
        onChangeText({ event, state, setState });
        setState((i) => {
            i.hasValid.NumberOfLot.valid = true;
            i.hasValid.LotQuantity.valid = true;
            return i
        })
    }

    const handleChange = (event, index) => {
        index.Qty = event.target.value
    };



    const SaveHandler = (event) => {
        const validMsg = []

        const MaterialIssueItems = []
        GoButton.map((index) => {
            debugger
            let Stock = index.BatchesData.map((i) => {
                return i.ObatchwiseQuantity
            })
            var TotalStock = 0;
            Stock.forEach(x => {
                TotalStock += parseFloat(x);
            });
            var OrderQty = parseFloat(index.Quantity)
            if (OrderQty > TotalStock) {
                {
                    // alert(` ${index.ItemName} out of stock`)
                    validMsg.push(`${index.ItemName}:Item is Out Of Stock`);

                };
            }

            index.BatchesData.map((ele) => {
                MaterialIssueItems.push({
                    Item: index.Item,
                    Unit: index.Unit,
                    WorkOrderQuantity: index.Quantity,
                    BatchCode: ele.BatchCode,
                    BatchDate: ele.BatchDate,
                    SystemBatchDate: ele.SystemBatchDate,
                    SystemBatchCode: ele.SystemBatchCode,
                    IssueQuantity: parseInt(ele.Qty),
                    BatchID: ele.id
                })
            })
        })

        const FilterData = MaterialIssueItems.filter((index) => {
            return (index.IssueQuantity > 0)
        })

        event.preventDefault();
        if (formValid(state, setState)) {
            debugger

            if (validMsg.length > 0) {
                dispatch(AlertState({
                    Type: 4,
                    Status: true,
                    Message: (validMsg),
                    RedirectPath: false,
                    AfterResponseAction: false
                }));
                return
            }
            const jsonBody = JSON.stringify({
                MaterialIssueDate: values.MaterialIssueDate,
                NumberOfLot: values.NumberOfLot,
                LotQuantity: values.LotQuantity,
                CreatedBy: createdBy(),
                UpdatedBy: createdBy(),
                Company: userCompany(),
                Party: userParty(),
                Item: Itemselect.Item,
                Unit: Itemselect.Unit,
                MaterialIssueItems: FilterData,
                MaterialIssueWorkOrder: [
                    {
                        WorkOrder: Itemselect.id,
                        Bom: Itemselect.Bom

                    }
                ]
            }
            );
            if (pageMode === mode.edit) {
            }
            else {
                dispatch(postMaterialIssue(jsonBody));
            }
        };
    }
    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            style: (cellContent, user, cell, row, rowIndex, colIndex) => {
                let Stock = user.BatchesData.map((index) => {
                    return index.ObatchwiseQuantity
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
            text: "Work Order Qty",
            dataField: "Quantity",
        },
        {
            text: "Unit",
            dataField: "UnitName",
        },
        {
            text: "Batch Code",
            dataField: "BatchesData",

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
                                                    onKeyDown={(e) => handleKeyDown(e, GoButton)}
                                                >
                                                    {index.ObatchwiseQuantity}
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
                <MetaTags>
                    <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
                </MetaTags>
                <div className="page-content" >
                    {/* <Breadcrumb pageHeading={userPageAccessState.PageHeading}
                    /> */}
                    <form onSubmit={SaveHandler} noValidate>
                        <Col className="px-2 mb-1  c_card_filter header text-black" sm={12}>
                            <Row>
                                <Col className=" mt-1 row  " sm={11} >
                                    <Col sm="6">
                                        <FormGroup className="row mt-2  ">
                                            <Label className="mt-1" style={{ width: "150px" }}>{fieldLabel.MaterialIssueDate} </Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    name="MaterialIssueDate"
                                                    value={values.MaterialIssueDate}
                                                    className="form-control d-block bg-white text-dark"
                                                    placeholder="YYYY-MM-DD"
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                />
                                                {isError.MaterialIssueDate.length > 0 && (
                                                    <span className="invalid-feedback">{isError.MaterialIssueDate}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="row mt-2 ">
                                            <Label className="mt-2" style={{ width: "100px" }}> {fieldLabel.ItemName} </Label>
                                            <Col sm={7}>
                                                <Select
                                                    isDisabled={values.ItemName ? true : null}
                                                    name="ItemName"
                                                    value={values.ItemName}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={ItemDropdown_Options}
                                                    onChange={ItemOnchange}
                                                />
                                                {isError.ItemName.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                    <Col sm="6">
                                        <FormGroup className="mb-2 mt-2 row  " style={{ marginTop: "" }}>
                                            <Label className="mt-1" style={{ width: "150px" }}> {fieldLabel.NumberOfLot} </Label>
                                            <Col sm={7}>
                                                <Input
                                                    style={{ textAlign: "right" }}
                                                    name="NumberOfLot"
                                                    value={values.NumberOfLot}
                                                    type="text"
                                                    className={isError.NumberOfLot.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter Number Of Lots"
                                                    autoComplete='off'
                                                    onChange={NumberOfLotchange}
                                                />
                                                {isError.NumberOfLot.length > 0 && (
                                                    <span className="invalid-feedback">{isError.NumberOfLot}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="mb-1 mt-2  row" >
                                            <Label className="mt-2" style={{ width: "100px" }}> {fieldLabel.LotQuantity} </Label>
                                            <Col sm={7}>
                                                <Input
                                                    style={{ textAlign: "right" }}
                                                    name="LotQuantity"
                                                    value={values.LotQuantity}
                                                    type="text"
                                                    className={isError.LotQuantity.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter LotQuantity"
                                                    autoComplete='off'
                                                    onChange={Quantitychange}

                                                />
                                                {isError.LotQuantity.length > 0 && (
                                                    <span className="invalid-feedback">{isError.LotQuantity}</span>
                                                )}
                                            </Col>
                                            <div className="col col-1">
                                                    <Label style={{ marginTop: '5px', width: "72px", marginLeft: '-23px' }}>
                                                       </Label>
                                                </div>
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

export default MaterialIssueMaster
