import React, { useEffect, useState } from "react";
import {
    Col,
    Input,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageFieldSuccess } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import { SaveButton } from "../../../../components/Common/CommonButton";
import { url, mode, pageId } from "../../../../routes/index"
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { goButtonPartyItemAddPageSuccess, goButtonPartyItemAddPage } from "../../../../store/Administrator/PartyItemsRedux/action";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { saveStockEntryAction, saveStockEntrySuccess } from "../../../../store/Inventory/StockEntryRedux/action";
import "../../../../pages/Sale/SalesReturn/salesReturn.scss";
import SaveButtonDraggable from "../../../../components/Common/saveButtonDraggable";
import { alertMessages } from "../../../../components/Common/CommonErrorMsg/alertMsg";
import data from '../data.json';
import GlobalCustomTable from "../../../../GlobalCustomTable";
import { Bulk_BOM_for_WorkOrderSuccess, Save_Bulk_BOM_for_WorkOrder, Save_Bulk_BOM_for_WorkOrderSuccess } from "../../../../store/Production/WorkOrder/action";

const BulkWorkOrder = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const location = { ...history.location }
    const [pageMode] = useState(mode.defaultsave);
    const [subPageMode] = useState(history.location.pathname)
    const [userPageAccessState, setUserAccState] = useState('');
    const [BulkData, setBulkData] = useState(location.state);

    const [checked, setchecked] = useState(false);
    const [LotChange, setLotChange] = useState(false);

    const [QuantityChange, setQuantityChange] = useState(false);






    const [allChecked, setAllChecked] = useState(false);








    const hasShowModal = props.hasOwnProperty(mode.editValue);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {

        postMsg,
        saveBtnloading,
        userAccess,
    } = useSelector((state) => ({
        saveBtnloading: state.WorkOrderReducer.saveBtnloading,
        postMsg: state.WorkOrderReducer.Save_Bulk_Bom_for_WorkOrder,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            partySelectButtonHandler();
        } else {
            partySelectOnChangeHandler();
        }
    }, [commonPartyDropSelect]);

    useEffect(() => {


        const page_Id = pageId.BULK_WORK_ORDER;

        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id));
        dispatch(Bulk_BOM_for_WorkOrderSuccess({ Status: false }));


        if ((commonPartyDropSelect.value > 0)) {
            dispatch(goButtonPartyItemAddPage({
                jsonBody: JSON.stringify({
                    ..._cfunc.loginJsonBody(),
                    PartyID: commonPartyDropSelect.value
                })
            }))
        };

        return () => {
            dispatch(goButtonPartyItemAddPageSuccess([]));
            dispatch(Bulk_BOM_for_WorkOrderSuccess({ Status: false }));



        }
    }, []);


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
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(Save_Bulk_BOM_for_WorkOrderSuccess({ Status: false }))
            setBulkData([])
            customAlert({
                Type: 1,
                Message: postMsg.Message,
                RedirectPath: url.WORK_ORDER_LIST,
            })
        }
        else if (postMsg.Status === true) {
            dispatch(Save_Bulk_BOM_for_WorkOrderSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    function partySelectButtonHandler() {
        dispatch(goButtonPartyItemAddPage({
            jsonBody: JSON.stringify({
                ..._cfunc.loginJsonBody(),
                PartyID: commonPartyDropSelect.value
            })
        }))
    }

    function partySelectOnChangeHandler() {
        setBulkData([]);
        dispatch(goButtonPartyItemAddPageSuccess([]))
    }


    const QuantityCalculationFunc = ({ inx_1, Input_Qty }) => {

        inx_1.BOMItems = inx_1.BOMItems.map(inx_2 => {
            try {
                const Qty = parseFloat(inx_2.BomQuantity) / parseFloat(inx_1.EstimatedOutputQty)
                const ActualQuantity = parseFloat(Number(Input_Qty) * Qty)
                document.getElementById(`Quantity${inx_1.Item}-${inx_2.id}`).value = ActualQuantity
            } catch (error) {
                _cfunc.CommonConsole('QuantityCalculationFunc', error);
            }
            return inx_2;
        });
    }

    const SaveHandler = async (event) => {

        event.preventDefault();
        try {
            {
                const WorkOrderItems = location.state.map((inx_1) => ({
                    Bom: inx_1.id,
                    WorkOrderDate: _cfunc.currentDate_ymd,
                    IsActive: inx_1.IsActive,
                    Item: inx_1.Item,
                    ItemName: inx_1.ItemName,
                    Stock: inx_1.Stock,
                    NumberOfLot: inx_1.Number_Lots,
                    EstimatedOutputQty: (Number(inx_1.EstimatedOutputQty)).toFixed(3),
                    Company: _cfunc.loginCompanyID(),
                    Party: _cfunc.loginSelectedPartyID(),
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                    Quantity: (Number(inx_1.Qty)).toFixed(3),
                    Unit: inx_1.Unit,
                    UnitName: inx_1.UnitName,
                    WorkOrderItems: inx_1.BOMItems.map((inx_2) => ({
                        id: inx_2.id,
                        Item: inx_2.Item,
                        ItemName: inx_2.ItemName,
                        Unit: inx_2.Unit,
                        UnitName: inx_2.UnitName,
                        StockQuantity: (Number(inx_2.Quantity)).toFixed(3),
                        BomQuantity: (Number(inx_2.BomQuantity)).toFixed(3),
                        Quantity: (Number(inx_2.Quantity)).toFixed(3),
                    })),
                }))
                const jsonBody = JSON.stringify(WorkOrderItems);
                dispatch(Save_Bulk_BOM_for_WorkOrder({ jsonBody }));

            }
        } catch (e) { console.log(e) }
    };


    function Header(column, colIndex, { sortElement, filterElement }) {

        const handleAllCheckboxChange = ({ e, Data }) => {
            setAllChecked(e.target.checked)
            let BulkData = []
            if (e.target.checked) {
                BulkData = Data.map(item => {
                    return { ...item, IsTableOpen: e.target.checked };
                });
            } else {
                BulkData = Data.map(item => {
                    return { ...item, IsTableOpen: e.target.checked };
                });
            }
            setBulkData(BulkData)
        };
        return (
            <span>
                <label
                    htmlFor={`btn-Header`}
                    className=" badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light ml-2 mb-n1"
                    title="Expand Table"
                    style={{ borderRadius: "50%", marginRight: "5px", cursor: "pointer", marginLeft: "10px" }}
                >
                    <input
                        type="checkbox"
                        id={`btn-Header`}
                        checked={allChecked}
                        onChange={(e) => { handleAllCheckboxChange({ e: e, Data: BulkData }) }}
                        style={{ display: "none" }}
                    />
                    {allChecked ? <span id={`Icon-Header`} className="mdi mdi-arrow-collapse-up font-size-10"></span> : <span id={`Icon-Header`} className="mdi mdi-arrow-expand-down font-size-10"></span>}
                </label>
                Item Name
            </span>
        );
    }

    const pagesListColumns = [
        //*************** ItemName ********************************* */
        {

            text: "Item Name",
            dataField: "ItemName",
        },

        {
            text: "Stock Quantity",
            dataField: "Stock",
            align: 'Right',
            formatter: (cellContent, inx_1, key) => {
                return <> <span id={`Stock-${key}`}>{cellContent} {inx_1.UnitName}</span></>
            }

        },

        {//*************** StockDetails ********************************** */
            text: "Change Quantity",
            dataField: "BOMItems",
            headerStyle: { zIndex: "2", width: "40% " },
            formatExtraData: { checked, BulkData },
            headerFormatter: Header,
            formatter: (cellContent, inx_1, key) => {
                const handleCheckboxChange = ({ e, ID }) => {
                    setchecked(i => !i)
                    inx_1.IsTableOpen = e.target.checked
                };
                return <>
                    <div className="table-responsive">
                        <table className="custom-table ">
                            <thead >
                                <tr>
                                    <th>
                                        <span>
                                            <label
                                                htmlFor={`btn-${inx_1.Item}`}
                                                className=" badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light ml-2 mb-n1"
                                                title="Expand Table"
                                                style={{ borderRadius: "50%", marginRight: "5px", cursor: "pointer" }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`btn-${inx_1.Item}`}
                                                    checked={inx_1.IsTableOpen}
                                                    onChange={(e) => { handleCheckboxChange({ e: e, ID: inx_1.Item }) }}
                                                    style={{ display: "none" }}
                                                />
                                                {inx_1.IsTableOpen ? <span id={`Icon-${inx_1.Item}`} className="mdi mdi-arrow-collapse-up font-size-10"></span> : <span id={`Icon-${inx_1.Item}`} className="mdi mdi-arrow-expand-down font-size-10"></span>}
                                            </label>
                                            Item Name
                                        </span>
                                    </th>
                                    <th>Stock Quantity  </th>
                                    <th>BOM Quantity</th>
                                    <th style={{ width: "150px" }}>Quantity</th>
                                    <th>Unit</th>
                                </tr>
                            </thead>
                            <tbody id={`Body-${inx_1.Item}`} className={inx_1.IsTableOpen ? '' : 'hidden-row'}  >
                                {cellContent.map((inx_2) => {

                                    return (
                                        <tr key={inx_1.Item}>
                                            <td data-label="Item Name">{inx_2.ItemName}</td>
                                            <td data-label="Stock Quantity" style={{ textAlign: "right" }} >
                                                <samp id={`ActualQuantity-${inx_1.Item}-${inx_2.id}`}>{inx_2.StockQuantity}</samp>
                                            </td>
                                            <td data-label="BOM Quantity">{inx_2.BomQuantity}</td>
                                            <td data-label='Quantity'>
                                                <Input
                                                    type="text"
                                                    disabled={pageMode === 'edit' ? true : false}
                                                    placeholder="Manually enter quantity"
                                                    className="right-aligned-placeholder"
                                                    key={`Quantity${inx_1.Item}-${inx_2.id}`}
                                                    id={`Quantity${inx_1.Item}-${inx_2.id}`}
                                                    autoComplete="off"
                                                    defaultValue={inx_2.Quantity}
                                                    onChange={(event) => {
                                                        // QuantityOnchange(event, inx_1, inx_2,);
                                                    }}
                                                />
                                            </td>
                                            < td >
                                                <span className="d-flex justify-content-center align-items-center">
                                                    {inx_2.UnitName}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div ></>
            }

        },

        // //*************** Quantity ********************************* */

        {

            text: "Estimated Quantity",
            dataField: "EstimatedOutputQty",
            align: 'Right',
            formatter: (cellContent, inx_1, key) => {
                return <> <span id={`Qty-${key}`}>{inx_1.EstimatedOutputQty} {inx_1.UnitName}</span></>
            }

        },

        {
            text: "Number of Lots",
            dataField: "Number_Lots",

            formatter: (cellContent, inx_1, key,) => {
                const LotsOnchange = (event, inx_1, key) => {
                    let inputQty = event.target.value;
                    if (!isNaN(Number(inputQty))) {
                        const quantity = Number(inputQty) * Number(inx_1.EstimatedOutputQty);
                        QuantityCalculationFunc({ inx_1: inx_1, Input_Qty: quantity })
                        document.getElementById(`Quantity${inx_1.Item}`).value = quantity;
                    } else {
                        event.target.value = "";
                    }
                };
                return <>
                    <Input
                        type="text"
                        placeholder="Manually enter Lot"
                        className="right-aligned-placeholder"
                        key={`Number_Lots${inx_1.Item}`}
                        id={`Number_Lots${inx_1.Item}`}
                        autoComplete="off"
                        defaultValue={inx_1.Number_Lots}
                        onChange={(event) => {
                            LotsOnchange(event, inx_1, key);
                        }}
                    />
                </>
            }
        },

        {

            text: "Quantity",
            dataField: "Qty",
            align: 'Right',
            formatter: (cellContent, inx_1, key) => {
                const QuantityOnchange = (event, inx_1, key,) => {
                    let inputQty = event.target.value;
                    if (!isNaN(Number(inputQty))) {
                        QuantityCalculationFunc({ inx_1: inx_1, Input_Qty: inputQty })
                        let NumberLot = Number(inputQty) / Number(inx_1.EstimatedOutputQty)
                        inx_1.Number_Lots = NumberLot;
                        inx_1.Qty = inputQty;
                        document.getElementById(`Number_Lots${inx_1.Item}`).value = NumberLot
                    } else {
                        event.target.value = "";
                    }
                };
                return <>
                    <Row>
                        <Col sm={10}>
                            <Input
                                type="text"
                                placeholder="Manually enter Lot"
                                className="right-aligned-placeholder"
                                key={`Quantity${inx_1.Item}`}
                                id={`Quantity${inx_1.Item}`}
                                defaultValue={`${inx_1.Qty}`}
                                onChange={(event) => {
                                    QuantityOnchange(event, inx_1, key,);
                                }}
                            />
                        </Col>
                        <Col sm={2}>
                            <span >{inx_1.UnitName}</span>
                        </Col>
                    </Row>
                </>
            }

        },


    ];


    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content">
                    <GlobalCustomTable
                        keyField="Item"
                        data={BulkData}
                        columns={pagesListColumns}
                        paginationEnabled={200}//show pagination 200 per page
                        classes={"custom-table"}
                        noDataIndication={
                            <div className="text-danger text-center ">
                                Record Not available
                            </div>
                        }
                        onDataSizeChange={({ dataCount }) => {
                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                        }}
                    />


                    {
                        BulkData.length > 0 &&
                        <SaveButtonDraggable>
                            <SaveButton
                                pageMode={pageMode}
                                loading={saveBtnloading}
                                onClick={SaveHandler}
                                userAcc={userPageAccessState}
                            />

                        </SaveButtonDraggable>
                    }

                </div >
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default BulkWorkOrder
