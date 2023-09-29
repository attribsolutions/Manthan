import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,
    Button
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { SaveButton } from "../../../components/Common/CommonButton";
import { url, mode, pageId } from "../../../routes/index"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { CInput, C_Select, floatRegx } from "../../../CustomValidateForm/index";
import { goButtonPartyItemAddPageSuccess, goButtonPartyItemAddPage } from "../../../store/Administrator/PartyItemsRedux/action";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { saveStockEntryAction, saveStockEntrySuccess } from "../../../store/Inventory/StockEntryRedux/action";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { AddItemInTableFunc, stockQtyUnit_SelectOnchange } from "./StockAdjust_Func";
import "../../../pages/Sale/SalesReturn/salesReturn.scss";

const StockAdjustment = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode] = useState(mode.defaultsave);
    const [subPageMode] = useState(history.location.pathname)
    const [userPageAccessState, setUserAccState] = useState('');

    const [TableArr, setTableArr] = useState([]);
    const [itemNameSelect, setItemNameSelect] = useState('');

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        ItemList,
        partyItemListLoading,
        postMsg,
        saveBtnloading,
        userAccess,
    } = useSelector((state) => ({
        partyItemListLoading: state.PartyItemsReducer.partyItemListLoading,
        ItemList: state.PartyItemsReducer.partyItem,

        saveBtnloading: state.StockEntryReducer.saveBtnloading,
        postMsg: state.StockEntryReducer.postMsg,

        userAccess: state.Login.RoleAccessUpdateData,
    }));

    useEffect(() => {
        let page_Id
        if (subPageMode === url.STOCK_ADJUSTMENT) {
            page_Id = pageId.STOCK_ADJUSTMENT;
        }
        else {
            page_Id = pageId.STOCK_ADJUSTMENT_MODE_2;
        }
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id));

        if ((_cfunc.loginSelectedPartyID() > 0)) {
            dispatch(goButtonPartyItemAddPage({
                jsonBody: JSON.stringify({
                    ..._cfunc.loginJsonBody(),
                    PartyID: _cfunc.loginSelectedPartyID()
                })
            }))
        };

        return () => {
            dispatch(goButtonPartyItemAddPageSuccess([]));
        }
    }, []);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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
            setTableArr([])
            customAlert({
                Type: 1,
                Message: postMsg.Message,
                RedirectPath: url.STOCK_ENTRY,
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

    const ItemList_Options = ItemList.map((index) => ({
        value: index.Item,
        label: index.ItemName,
        itemCheck: index.selectCheck
    })).filter((index) => index.itemCheck === true);

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

    function BatchCode_Add_Handler(event, index1, tableList, setTableList) {
        
        let isfound = index1.StockDetails.find(i => i.id === index1.BatchCode.id);

        if (!(isfound === undefined)) {
            return customAlert({ Type: 3, Message: "This BatchCode Already Exist" })
        }

        const itemIndex = tableList.indexOf(index1);

        if (itemIndex !== -1) {

            tableList[itemIndex].StockDetails.push(index1.BatchCode);

            setTableList([...tableList]);
            QuantityOnchange(event, index1, tableList,)
            // stockQtyUnit_SelectOnchange(index1.defaultUnitOption, index1, tableList, setTableList)
        } else {
            console.error("Item not found in tableList.");
        }
    }

    const deleteHandeler = (id, tableList) => {
        let filterData = tableList.filter((i) => {
            return (i.Item !== id)
        })
        setTableArr(filterData)
    };

    function partySelectButtonHandler() {
        dispatch(goButtonPartyItemAddPage({
            jsonBody: JSON.stringify({
                ..._cfunc.loginJsonBody(),
                PartyID: _cfunc.loginSelectedPartyID()
            })
        }))
    }

    function partyOnChngeButtonHandler() {
        setItemNameSelect('');
        setTableArr([]);
        dispatch(goButtonPartyItemAddPageSuccess([]))
    }

    const ItemAddButtonHandler = async () => {

        const { TableArr: updatedTableArr, message, type } = await AddItemInTableFunc({
            itemNameSelect,
            TableArr,
        });
        setTableArr(updatedTableArr);
        setItemNameSelect('')
        if (message) {
            customAlert({ Type: type, Message: message });
        }
    };

    function BatchCodeHandler(event, index1, tableList) {
        
        index1["BatchCode"] = event
    }

    const pagesListColumns = [

        {//*************** ItemName ********************************* */
            text: "Item Name",
            dataField: "ItemName",
        },

        {//*************** Quantity ********************************* */
            text: "Quantity/Unit",
            dataField: "",
            formatExtraData: { tableList: TableArr, setTableList: setTableArr },
            formatter: (cellContent, index1, key, { tableList = [], setTableList }) => {

                return (<>
                    <div>
                        <CInput
                            id={`OrderQty-${index1.id}`}
                            key={`OrderQty-${index1.id}`}
                            type="text"
                            placeholder="Enter quantity"
                            className="right-aligned-placeholder mb-1"
                            autoComplete="off"
                            cpattern={floatRegx}
                            defaultValue={index1.Quantity}
                            disabled={true}
                        />
                    </div>
                    <div>
                        <div >
                            <C_Select
                                classNamePrefix="select2-selection"
                                defaultValue={index1.defaultUnitOption}
                                options={index1.UnitDetails}
                                onChange={(event) => {
                                    index1.defaultUnitOption = event
                                    stockQtyUnit_SelectOnchange(event, index1, tableList);
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-2" >
                        <Row >
                            <Col md={9} >
                                <Label className="text-black">BatchCode</Label>
                                <C_Select

                                    id={`BatchCode-${index1.id}`}
                                    key={`BatchCode-${index1.id}`}
                                    classNamePrefix="select2-selection"
                                    options={index1.BatchCodeDetails}
                                    onChange={(event) => {
                                        BatchCodeHandler(event, index1, tableList)

                                    }}
                                />
                            </Col>
                            <Col sm="1" style={{ marginTop: "29px" }}>
                                {
                                    < Button type="button" color="btn btn-outline-primary border-1 font-size-12 text-center"
                                        onClick={(event) => BatchCode_Add_Handler(event, index1, tableList, setTableList)}
                                    > <i className="dripicons-plus align-center"></i></Button>
                                }
                            </Col>
                        </Row>
                    </div>
                </>)
            }
        },

        {//*************** StockDetails ********************************** */
            text: "Stock Details",
            dataField: "StockDetails",
            attrs: () => ({ 'data-label1': "Stock Details", "stock-header": "true" }),
            headerStyle: { zIndex: "2" },
            formatExtraData: { tableList: TableArr },
            formatter: (cellContent, index1, keys_, { tableList = [] }) => (
                <div className="table-responsive">
                    <table className="custom-table ">
                        <thead >
                            <tr>
                                <th>BatchCode</th>
                                <th>Stock </th>
                                <th>Quantity</th>
                                <th>MRP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cellContent.map((index2) => (
                                <tr key={index1.id}>
                                    <td data-label="BatchCode">{index2.SystemBatchCode}</td>
                                    <td data-label="Stock Quantity" style={{ textAlign: "right" }} >
                                        <samp id={`ActualQuantity-${index1.id}-${index2.id}`}>{index2.BaseUnitQuantity}</samp>
                                    </td>
                                    <td data-label='Quantity'>
                                        <Input
                                            type="text"
                                            disabled={pageMode === 'edit' ? true : false}
                                            placeholder="Manually enter quantity"
                                            className="right-aligned-placeholder"
                                            key={`batchQty${index1.id}-${index2.id}`}
                                            id={`batchQty${index1.id}-${index2.id}`}
                                            defaultValue={index2.Qty}
                                            onChange={(event) => {
                                                QuantityOnchange(event, index1, index2);
                                            }}
                                        />
                                    </td>
                                    <td data-label="MRP">{index2.MRP}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ),
        },

        //*************** Delete Action ********************************** */
        {
            text: "Action ",
            dataField: "",
            headerStyle: () => {
                return { width: '100px' };
            },
            formatExtraData: { tableList: TableArr },
            formatter: (cellContent, index1, key, { tableList = [] }) => {
                return (
                    <span className="d-flex justify-content-center align-items-center">

                        <Button
                            id={"deleteid"}
                            type="button"
                            className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete Item'
                            onClick={(e) => { deleteHandeler(index1.Item, tableList); }}
                        >
                            <i className="mdi mdi-delete font-size-18"></i>
                        </Button>
                    </span>
                )
            }
        },
    ];

    const SaveHandler = async (event) => {

        event.preventDefault();

        const btnId = event.target.id

        const ReturnItems = TableArr.map((tableItem) => {

            const stockDetails = tableItem.StockDetails;

            const formattedStockDetails = stockDetails.map((index) => ({
                "Item": index.Item,
                "Quantity": index.Qty,
                "MRP": index.MRPID,
                "Unit": tableItem.defaultUnitOption.value,
                "GST": index.GSTID,
                "MRPValue": index.MRP,
                "GSTPercentage": index.GSTPercentage,
                "BatchDate": index.BatchDate,
                "BatchCode": index.BatchCode,
                "BatchCodeID": index.id
            }));

            // Filter the formatted stock details to include only items with Quantity > 0
            const filteredStockDetails = formattedStockDetails.filter((item) => item.Quantity > 0);

            return filteredStockDetails;
        });

        // Return an array of filtered stock details
        const filterData = ReturnItems.flat(); // Use flat to flatten the array of arrays

        if (filterData.length === 0) {
            customAlert({
                Type: 4,
                Message: " Please Enter One Item Quantity"
            })
            return _cfunc.btnIsDissablefunc({ btnId, state: false })
        }

        try {
            const jsonBody = JSON.stringify({
                "PartyID": _cfunc.loginSelectedPartyID(),
                "CreatedBy": _cfunc.loginUserID(),
                "Date": currentDate_ymd,
                "Mode": subPageMode === url.STOCK_ADJUSTMENT ? 2 : 3,
                "StockItems": filterData
            })

            dispatch(saveStockEntryAction({ jsonBody, btnId }));
        }
        catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content">
                    <PartyDropdown_Common
                        goButtonHandler={partySelectButtonHandler}
                        changeButtonHandler={partyOnChngeButtonHandler} />
                    <form noValidate>
                        <div className="px-3 c_card_filter header text-black mb-1" >

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>ItemName </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="ItemName "
                                                name="ItemName"
                                                value={itemNameSelect}
                                                isSearchable={true}
                                                isLoading={partyItemListLoading}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={ItemList_Options}
                                                onChange={(e) => { setItemNameSelect(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Col sm="1" className="mx-6 mt-1">
                                            {
                                                < Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center"
                                                    onClick={(e,) => ItemAddButtonHandler(e)}
                                                > Add</Button>
                                            }

                                        </Col>
                                    </FormGroup>
                                </Col >

                            </Row>
                        </div>

                        <ToolkitProvider
                            keyField={"id"}
                            data={TableArr}
                            columns={pagesListColumns}
                            search
                        >
                            {(toolkitProps,) => (
                                <React.Fragment>
                                    <Row>
                                        <Col xl="12">
                                            <div className="table-responsive table" style={{ minHeight: "45vh" }}>
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    id="table_Arrow"
                                                    classes={"table  table-bordered table-hover "}
                                                    noDataIndication={
                                                        <div className="text-danger text-center ">
                                                            Items Not available
                                                        </div>
                                                    }
                                                    onDataSizeChange={(e) => {
                                                        _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                    }}
                                                    {...toolkitProps.baseProps}
                                                />
                                                {mySearchProps(toolkitProps.searchProps)}
                                            </div>
                                        </Col>
                                    </Row>

                                </React.Fragment>
                            )}
                        </ToolkitProvider>

                        {
                            TableArr.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton
                                            pageMode={pageMode}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                        />

                                    </Col>
                                </FormGroup >
                                : null
                        }

                    </form >
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

export default StockAdjustment
