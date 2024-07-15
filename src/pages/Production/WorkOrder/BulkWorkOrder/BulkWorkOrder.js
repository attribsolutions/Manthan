import React, { useEffect, useState } from "react";
import {
    Input,
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
import { Save_Bulk_BOM_for_WorkOrder } from "../../../../store/Production/WorkOrder/action";

const BulkWorkOrder = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const location = { ...history.location }
    const [pageMode] = useState(mode.defaultsave);
    const [subPageMode] = useState(history.location.pathname)
    const [userPageAccessState, setUserAccState] = useState('');
    const [BulkData, setBulkData] = useState(location.state);
    const [checked, setchecked] = useState(false);

    const [allChecked, setAllChecked] = useState(false);








    const hasShowModal = props.hasOwnProperty(mode.editValue);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {

        postMsg,
        saveBtnloading,
        userAccess,
    } = useSelector((state) => ({
        saveBtnloading: state.StockEntryReducer.saveBtnloading,
        postMsg: state.StockEntryReducer.postMsg,
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
            dispatch(saveStockEntrySuccess({ Status: false }))
            setBulkData([])
            customAlert({
                Type: 1,
                Message: postMsg.Message,
                // RedirectPath: url.STOCK_ENTRY,
            })
        }
        else if (postMsg.Status === true) {
            dispatch(saveStockEntrySuccess({ Status: false }))
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


    function QuantityOnchange(event, index1, index2) {

        const InputQty = event.target.value;
        index2.Qty = InputQty

        const totalOriginalBaseUnitQuantity = index1.StockDetails.reduce(
            (total, stockDetail) =>
                total + Number(stockDetail.Qty) || 0,
            0
        );
        try {
            document.getElementById(`OrderQty-${index1.id}`).value = totalOriginalBaseUnitQuantity
        } catch (e) { _cfunc.CommonConsole('inner-Stock-Caculation', e) };

    }


    const SaveHandler = async (event) => {
        event.preventDefault();
        try {
            {
                const WorkOrderItems = location.state.map((inx_1) => ({
                    id: 31,
                    IsActive: true,
                    Item: inx_1.Item,
                    ItemName: inx_1.ItemName,
                    Stock: 0,
                    EstimatedOutputQty: inx_1.EstimatedOutputQty,
                    TotalQuantity: 0,
                    WorkQuantity: 0,
                    Unit: inx_1.Unit,
                    UnitName: inx_1.UnitName,
                    WorkOrderItems: inx_1.BOMItems.map((inx_2) => ({
                        id: 9,
                        Item: inx_2.Item,
                        ItemName: inx_2.ItemName,
                        Unit: inx_2.Unit,
                        UnitName: inx_2.UnitName,
                        StockQuantity: inx_2.Quantity,
                        BomQuantity: "50.000",
                        Quantity: 50
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
        },

        {//*************** StockDetails ********************************** */
            text: "Change Quantity",
            dataField: "BOMItems",
            headerStyle: { zIndex: "2", width: "40% " },
            formatExtraData: { checked, BulkData },
            headerFormatter: Header,
            formatter: (cellContent, inx_1, keys_, { Data }) => {

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
                                {cellContent.map((inx_2) => (
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
                                                key={`batchQty${inx_1.Item}-${inx_2.id}`}
                                                id={`batchQty${inx_1.Item}-${inx_2.id}`}
                                                autoComplete="off"
                                                defaultValue={inx_2.Quantity}
                                                onChange={(event) => {
                                                    QuantityOnchange(event, inx_1, inx_2,);
                                                }}
                                            />
                                        </td>

                                        < td >
                                            <span className="d-flex justify-content-center align-items-center">
                                                {inx_2.UnitName}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div ></>
            }

        },

        // //*************** Quantity ********************************* */

        {

            text: "Total Quantity",
            dataField: "TotalQuantity",
            formatter: (cellContent, row) => {
                return <> <span></span></>
            }

        },

        {

            text: "Work Quantity",
            dataField: "WorkQuantity",

        },

        {
            text: "Number of Lots",
            dataField: "",

        },
        {

            text: "Estimated Quantity",
            dataField: "EstimatedOutputQty",

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
