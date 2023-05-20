import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Change_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    saveBOMMasterSuccess,
    updateBOMListSuccess
} from "../../../store/Production/BOMRedux/action";
import {
    breadcrumbReturnFunc,
    convertDatefunc,
    loginUserID, currentDate_ymd,
    loginCompanyID,
    loginPartyID,
    metaTagLabel
}
 from "../../../components/Common/CommonFunction";
import {
    goButtonForMaterialIssue_Master_Action,
    goButtonForMaterialIssue_Master_ActionSuccess,
    SaveMaterialIssueSuccess
} from "../../../store/Production/Matrial_Issue/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import {
    Save_Production_ReIssue,
    Save_Production_ReIssueSuccess,
    makeBtnProduction_ReIssue_STP_actionSuccess,
} from "../../../store/Production/ProductionReissueRedux/actions";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_DatePicker } from "../../../CustomValidateForm";

const ProductionReIssueAdd = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        ProductionReIssueDate: currentDate_ymd,
        ItemName: [],
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [goButtonList, setGoButtonList] = useState([]);
    const [itemOption, setItemOption] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        makeProductionReIssue,
    } = useSelector((state) => ({
        postMsg: state.ProductionReIssueReducer.postMsg,
        updateMsg: state.ProductionReIssueReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        ItemsList: state.ProductionReIssueReducer.WorkOrderList,
        makeProductionReIssue: state.ProductionReIssueReducer.makeProductionReIssue
    }));
    //****************************************************************** */
    useEffect(() => {
        const page_Id = pageId.PRODUCTION_REISSUE
        dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);
    //****************************************************************** */

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;
    //****************************************************************** */

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
            setUserAccState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });

        };
    }, [userAccess]);
    //****************************************************************** */

    useEffect(() => {

        if ((makeProductionReIssue.Status === true) && (makeProductionReIssue.StatusCode === 200)) {

            const arr = makeProductionReIssue.Data.map((index) => ({
                value: index.Item,
                label: index.ItemName,
                data: index,
                productionId: makeProductionReIssue.productionId
            }))

            setItemOption(arr)
            setPageMode(makeProductionReIssue.pageMode)
            setGoButtonList(makeProductionReIssue.Data)
            dispatch(makeBtnProduction_ReIssue_STP_actionSuccess({ Status: false }))
            const { Items } = makeProductionReIssue
            setState((i) => {
                i.values.ItemName = { value: Items.value, label: Items.label };
                return i
            })
        }

    }, [makeProductionReIssue])
    //****************************************************************** */

    // useEffect(() => {
    //     
    //     if ((hasShowloction || hasShowModal)) {

    //         let hasEditVal = null
    //         let insidePageMode = null
    //         if (hasShowloction) {
    //             insidePageMode = location.pageMode;
    //             setPageMode(location.pageMode)
    //             hasEditVal = location[mode.editValue]
    //         }
    //         else if (hasShowModal) {
    //             hasEditVal = props[mode.editValue]
    //             insidePageMode = props.pageMode;
    //             setPageMode(props.pageMode)
    //             setModalCss(true)
    //         }

    //         if (hasEditVal) {
    //             
    //             // setItemselect(hasEditVal)
    //             const { id, Item, ItemName, WorkDate, EstimatedOutputQty, NumberOfLot, MaterialIssueItems = [] } = hasEditVal
    //             // const { BatchesData = [] } = MaterialIssueItems
    //             setState((i) => {
    //                 i.values.MaterialIssueDate = currentDate_ymd
    //                 i.values.ItemName = { value: Item, label: ItemName, Item: Item, NoLot: NumberOfLot, lotQty: EstimatedOutputQty };
    //                 i.values.NumberOfLot = NumberOfLot;
    //                 i.values.LotQuantity = EstimatedOutputQty;
    //                 i.hasValid.ItemName.valid = true;
    //                 i.hasValid.MaterialIssueDate.valid = true;
    //                 i.hasValid.NumberOfLot.valid = true;
    //                 i.hasValid.LotQuantity.valid = true;
    //                 return i
    //             })
    //             // ++++++++++++++++++++++++++**Dynamic go Button API Call method+++++++++++++++++

    //             if (insidePageMode === mode.modeSTPsave) {
    //                 const jsonBody = JSON.stringify({
    //                     WorkOrder: id,
    //                     Item: Item,
    //                     Company: loginCompanyID(),
    //                     Party: loginPartyID(),
    //                     Quantity: parseInt(EstimatedOutputQty)
    //                 });
    //                 dispatch(goButtonForMaterialIssue_Master_Action(jsonBody));
    //             } else if (insidePageMode === mode.view) {
    //                 dispatch(goButtonForMaterialIssue_Master_ActionSuccess(MaterialIssueItems))
    //                 dispatch(editMaterialIssueIdSuccess({ Status: false }))
    //             }

    //         }
    //     }
    // }, [])
    //****************************************************************** */

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(Save_Production_ReIssueSuccess({ Status: false }))
            setGoButtonList([])
            if (pageMode === mode.dropdownAdd) {
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
                    RedirectPath: url.PRODUCTION_REISSUE_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {

            dispatch(SaveMaterialIssueSuccess({ Status: false }))
            dispatch(saveBOMMasterSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])
    //****************************************************************** */

    useEffect(() => {

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            history.push({
                pathname: url.MATERIAL_ISSUE_LIST,
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
    //****************************************************************** */

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField]);


    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [goButtonList]);

    //****************************************************************** */
    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            formatter: (cellContent, index) => {
                return (
                    <>
                        <div><samp id={`ItemName${index.id}`}>{cellContent}</samp></div>
                        <div><samp id={`ItemNameMsg${index.id}`} style={{ color: "red" }}></samp></div>
                    </>
                )
            },
            style: (cellContent, user,) => {

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
            text: "Work Order Qty",
            // dataField: "Quantity",
            formatter: (cellContent, index, k) => {

                return (<div>
                    <Input id={`OrderQty${index.id}`}
                        onChange={(e) => {
                            index.Quantity = Number(e.target.value)
                            stockDistributeFunc(index)
                        }}> </Input>
                </div>)
            },
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
                        <Thead>
                            <tr>
                                <th>Batch Code </th>
                                <th>Supplier BatchCode</th>
                                <th>Batch Date</th>
                                <th>Stock Quantity</th>
                                <th>Quantity</th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {cellContent.map((index) => {

                                return (
                                    < tr >
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Label>
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
                                                // onKeyDown={(e) => handleKeyDown(e, goButtonList)}
                                                >
                                                    {index.BaseUnitQuantity}
                                                </Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Input
                                                    type="text"
                                                    key={`stock${user.id}-${index.id}`}
                                                    disabled={pageMode === mode.view ? true : false}
                                                    id={`stock${user.id}-${index.id}`}
                                                    style={{ textAlign: "right" }}
                                                    defaultValue={index.Qty}
                                                    autoComplete='off'
                                                    onChange={(event) => handleChange(event, user, index)}
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
    //****************************************************************** */
    const pageOptions = {
        sizePerPage: 10,
        totalSize: goButtonList.length,
        custom: true,
    };
    //****************************************************************** */

    function goButtonHandler(e) {
        // event.preventDefault();
        if (state.values.LotQuantity === "0") {
            alert("Quantity Can Not be 0")
        } else
            if (formValid(state, setState)) {

                const jsonBody = JSON.stringify({
                    WorkOrder: values.ItemName.value,
                    Item: values.ItemName.Item,
                    Company: loginCompanyID(),
                    Party: loginPartyID(),
                    Quantity: parseInt(values.LotQuantity)
                });

                dispatch(goButtonForMaterialIssue_Master_Action(jsonBody));
            }
    }
    //****************************************************************** */
    function stockDistributeFunc(index) {

        const v1 = index.Quantity;
        let orderqty = Number(v1);

        index.BatchesData = index.BatchesData.map(i2 => {

            let stockqty = Number(i2.BaseUnitQuantity);

            if ((orderqty > stockqty) && !(orderqty === 0)) {
                orderqty = orderqty - stockqty
                i2.Qty = stockqty.toFixed(3)
            } else if ((orderqty <= stockqty) && (orderqty > 0)) {
                i2.Qty = orderqty.toFixed(3)
                orderqty = 0
            }
            else {
                i2.Qty = 0;
            }
            try {
                document.getElementById(`stock${index.id}-${i2.id}`).value = i2.Qty
            } catch (e) { }
            return i2
        });

        const t1 = (v1 * index.ConversionUnit);
        const t2 = index.StockUnit;
        const t3 = index.StockTotal;

        if (t1 > t3) {
            try {
                document.getElementById(`OrderQty${index.id}`).value = t3.toFixed(3)
            } catch (e) { }
        };
        try {
            index.StockInValid = false
            index.StockInvalidMsg = null
            document.getElementById(`ItemNameMsg${index.id}`).style.display = "none";
        } catch (e) { };
        // try {
        //     document.getElementById(`stocktotal${index.id}`).innerText = `Total:${t1} ${t2}`
        // } catch (e) { };

    };
    //****************************************************************** */

    function ItemOnchange(event) {
        dispatch(Breadcrumb_inputName(event.label))
        setState((i) => {
            i.values.ItemName = event
            i.hasValid.ItemName.valid = true;
            i.hasValid.ProductionReIssueDate.valid = true;
            return i
        })
        setGoButtonList([{ ...event.data, ...{ productionId: event.productionId } }])
    }
    //****************************************************************** */

    const handleChange = (event, index1, index2) => {

        let input = event.target.value

        let result = /^\d*(\.\d{0,3})?$/.test(input);
        let val1 = 0;
        if (result) {
            let v1 = Number(index2.BaseUnitQuantity);
            let v2 = Number(input)
            if (v1 >= v2) { val1 = input }
            else { val1 = v1 };

        } else if (((index2.Qty >= 0) && (!(input === '')))) {
            val1 = index2.Qty
        } else {
            val1 = 0
        }

        event.target.value = val1;

        let Qtysum = 0
        index1.BatchesData.forEach((i) => {
            if (!(i.id === index2.id)) {
                Qtysum = Number(Qtysum) + Number(i.Qty)
            }
        });

        Qtysum = Number(Qtysum) + Number(val1);
        index2.Qty = val1;
        let diffrence = Math.abs(index1.Quantity - Qtysum);

        if ((Qtysum === index1.Quantity)) {
            try {
                document.getElementById(`ItemName${index1.id}`).style.color = ""
                document.getElementById(`ItemNameMsg${index1.id}`).innerText = ''
                index1["invalid"] = false
                index1["invalidMsg"] = ''

            } catch (e) { }
        } else {
            try {
                const msg = (Qtysum > index1.Quantity) ? (`Excess Quantity ${diffrence} ${index1.UnitName}`)
                    : (`Short Quantity ${diffrence} ${index1.UnitName}`)
                index1["invalid"] = true;
                index1["invalidMsg"] = msg;

                document.getElementById(`ItemNameMsg${index1.id}`).innerText = msg;
            } catch (e) { }
        }
    };
    //****************************************************************** */

    const SaveHandler = async (event) => {
        event.preventDefault();
        const validMsg = []
        let production_Id = ''
        const productionReIssue_Item = []
        // goButtonList map function start +++++++++++++++++++++++++++++++++++++
        await goButtonList.map((index) => {

            var TotalStock = 0;
            index.BatchesData.map(i => {
                TotalStock += Number(i.BaseUnitQuantity);
            });

            var OrderQty = Number(index.Quantity)
            if (OrderQty > TotalStock) {
                {
                    validMsg.push(`${index.ItemName}:Item is Out Of Stock`);
                };
            }
            let a = index["invalid"]
            if (a) {
                validMsg.push(`${index.ItemName}:${index["invalidMsg"]}`);
            };

            function batch(ele) {  // batch wise calcution start++++++++++++++++++++++++++
                productionReIssue_Item.push({
                    Item: index.Item,
                    Unit: index.Unit,
                    IssueQuantity: index.Quantity,
                    BatchCode: ele.BatchCode,
                    BatchDate: ele.BatchDate,
                    SystemBatchDate: ele.SystemBatchDate,
                    SystemBatchCode: ele.SystemBatchCode,
                    ProductionReIssue: parseInt(ele.Qty),
                    BatchID: ele.id,
                    LiveBatchID: ele.LiveBatchID
                })
            }                      // batch wise calcution end++++++++++++++++++++++++++++

            index.BatchesData.map((ele) => {
                if (Number(ele.Qty) > 0) {
                    batch(ele)
                }
            })

            production_Id = index.productionId;
        })
        // goButtonList map function end++++++++++++++++++++++++++++

        if (formValid(state, setState)) { // formValid  ++++++++++++++++++++++++++++
            if (validMsg.length > 0) {
                dispatch(AlertState({
                    Type: 4,
                    Status: true,
                    Message: JSON.stringify(validMsg),
                    RedirectPath: false,
                    AfterResponseAction: false
                }));
                return
            }

            const jsonBody = JSON.stringify({
                Date: values.ProductionReIssueDate,
                ProductionID: production_Id,
                ProductionItem: values.ItemName.value,
                ProductionReIssueItems: productionReIssue_Item,
                CreatedBy: loginUserID(),
                UpdatedBy: loginUserID(),
                Company: loginCompanyID(),
                Party: loginPartyID(),
            }
            );

            if (pageMode === mode.edit) {
            }
            else {
                dispatch(Save_Production_ReIssue(jsonBody));
            }

        };
    }
    //****************************************************************** */

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" >

                    <form onSubmit={SaveHandler} noValidate>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
                            <Row>
                                <Col className=" mt-1 row" sm={11} >
                                    <Col sm="6">
                                        <FormGroup className="row mt-2  ">
                                            <Label className="mt-1" style={{ width: "150px" }}>{fieldLabel.ProductionReIssueDate} </Label>
                                            <Col sm="7">
                                                <C_DatePicker
                                                    name="ProductionReIssueDate"
                                                    value={values.ProductionReIssueDate}
                                                    onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                />
                                                {isError.ProductionReIssueDate.length > 0 && (
                                                    <span className="invalid-feedback">{isError.ProductionReIssueDate}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        <FormGroup className="row mt-2 ">
                                            <Label className="mt-2" style={{ width: "100px" }}> {fieldLabel.ItemName} </Label>
                                            <Col sm={7}>
                                                <Select
                                                    name="ItemName"
                                                    value={values.ItemName}
                                                    isDisabled={goButtonList.length > 0 ? true : false}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={itemOption}
                                                    onChange={ItemOnchange}
                                                />
                                                {isError.ItemName.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >


                                </Col>
                                <Col sm={1} className="mt-2 mb-2">
                                    {(pageMode === mode.modeSTPsave) ?
                                        (goButtonList.length === 0) ?
                                            < Go_Button onClick={(e) => goButtonHandler()} />
                                            :
                                            <Change_Button onClick={(e) => setGoButtonList([])} />
                                        : null
                                    }
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                        </Col>

                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField={"id"}
                                    data={goButtonList}
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
                                                            id="table_Arrow"
                                                            responsive
                                                            bordered={false}
                                                            striped={false}
                                                            classes={"table  table-bordered"}
                                                            {...toolkitProps.baseProps}
                                                            {...paginationTableProps}
                                                        />
                                                        {countlabelFunc(toolkitProps, paginationProps, dispatch, "Material Issue")}
                                                        {/* {mySearchProps(toolkitProps.searchProps, pageField.id)} */}
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

                        {goButtonList.length > 0 ? <FormGroup>
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

export default ProductionReIssueAdd
