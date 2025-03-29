import React, { useEffect, useMemo, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,
    Button
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { SaveButton } from "../../../components/Common/CommonButton";
import { url, mode, pageId } from "../../../routes/index"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { CInput, C_Select, floatRegx } from "../../../CustomValidateForm/index";
import { goButtonPartyItemAddPageSuccess, goButtonPartyItemAddPage } from "../../../store/Administrator/PartyItemsRedux/action";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { saveStockEntryAction, saveStockEntrySuccess } from "../../../store/Inventory/StockEntryRedux/action";
import { AddItemInTableFunc, stockQtyUnit_SelectOnchange } from "./StockAdjust_Func";
import "../../../pages/Sale/SalesReturn/salesReturn.scss";
import Select, { components } from "react-select";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import GlobalCustomTable from "../../../GlobalCustomTable";
import { GroupSubgroupDisplay, ModifyTableData_func } from "../../../components/Common/TableCommonFunc";

const StockAdjustment = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode] = useState(mode.defaultsave);
    const [subPageMode] = useState(history.location.pathname)
    const [userPageAccessState, setUserAccState] = useState('');

    const [TableArr, setTableArr] = useState([]);
    const [itemNameSelect, setItemNameSelect] = useState('');


    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue);

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
        let page_Id
        if (subPageMode === url.STOCK_ADJUSTMENT) {
            page_Id = pageId.STOCK_ADJUSTMENT;
        }
        else if (subPageMode === url.STOCK_ADJUSTMENT_MODE_2) {
            page_Id = pageId.STOCK_ADJUSTMENT_MODE_2;
        } else if (subPageMode === url.RATE_ADJUSTMENT) {
            page_Id = pageId.RATE_ADJUSTMENT;
        }


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
            setTableArr([])
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

    const ItemList_Options = ItemList.map((index) => ({
        value: index.Item,
        label: index.ItemName,
        itemCheck: index.selectCheck
    })).filter((index) => index.itemCheck === true);

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
                PartyID: commonPartyDropSelect.value
            })
        }))
    }

    function partySelectOnChangeHandler() {
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
        index1["BatchCodeSelect"] = event
    }

    function QuantityOnchange(event, index1, index2) {
        debugger
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

        let isfound = index1.StockDetails.find(i => i.id === index1.BatchCodeSelect?.id);

        if (!(isfound === undefined)) {
            return customAlert({ Type: 3, Message: alertMessages.batchCodeAlreadyExist })
        }

        const itemIndex = tableList.indexOf(index1);

        if (itemIndex !== -1) {

            const bachcodeUnit = index1.BatchCodeSelect;
            const isDifferntUnit = bachcodeUnit?.UnitID !== index1.UnitID;

            if (isDifferntUnit) {

                const _hasActualQuantity = _cfunc.roundToDecimalPlaces((index1.BaseUnitQuantity / bachcodeUnit.BaseUnitQuantity), 3);

                index1.BatchCodeSelect.ActualQuantity = _hasActualQuantity
                index1.BatchCodeSelect.Qty = _hasActualQuantity

            }

            tableList[itemIndex].StockDetails.push(index1.BatchCodeSelect);

            setTableList([...tableList]);
            QuantityOnchange(event, index1, tableList,)
        } else {
            _cfunc.CommonConsole("Item not found in tableList.");
        }
    }

    const customOption = (props) => {
        const { innerProps, label, data } = props;
        return (
            <components.Option {...props}>
                <div {...innerProps}>
                    <div >Batch:{data.BatchCode}</div>
                    <div>BatchCode:{data.BatchCode}</div>
                    <div>MRP:{data.MRP}</div>
                    <div>Quantity:{data.BaseUnitQuantity}</div>
                </div>
            </components.Option>
        );
    };

    function batchDeleteHandler(event, index1, index2, tableList) {

        const filterData = tableList.map((item1) => {

            const filteredStockDetails = item1.StockDetails.filter((item2) => {

                return index2.id !== item2.id;
            });
            return {
                ...item1,
                StockDetails: filteredStockDetails,
            };
        });

        setTableArr(filterData);
    }

    const rowStyle = (row, rowIndex) => {
        if (row.GroupRow) {
            return { backgroundColor: 'white', fontWeight: 'bold', fontSize: '18px' };
        } else if (row.SubGroupRow) {
            return { backgroundColor: '#f2f2f2', fontWeight: 'bold', fontSize: '15px' };
        }
        return {};
    };

    const rowClasses = (row) => {
        if (row.GroupRow || row.SubGroupRow) {
            return 'group-row hide-border';
        }
        return '';
    };

    const pagesListColumns = [

        {//*************** ItemName ********************************* */
            text: "Item Name",
            dataField: "ItemName",
            formatter: (value, row, k) => {
                if (row.SubGroupRow) {
                    const [Group, SubGroup] = row.Group_Subgroup.split('-');
                    return (
                        <GroupSubgroupDisplay group={Group} subgroup={SubGroup} />
                    );
                } else {
                    const [itemName] = row.ItemName.split('-');
                    return (
                        <>
                            <div>
                                {itemName}
                            </div>
                        </>
                    )
                }


            },
        },

        {//*************** Quantity ********************************* */
            text: "Quantity/Unit",
            dataField: "",
            formatExtraData: { tableList: TableArr, setTableList: setTableArr },
            formatter: (cellContent, index1, key, { tableList = [], setTableList }) => {

                if (index1.GroupRow || index1.SubGroupRow) { return }

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
                                defaultValue={index1.defaultUnitSelect}
                                options={index1.unitDetailsOptions}
                                onChange={(event) => {

                                    stockQtyUnit_SelectOnchange(event, index1, tableList);
                                }}
                            />
                        </div>
                    </div>
                    {!(_cfunc.loginUserIsFranchisesRole()) && <div className="mt-2" >
                        <Select
                            id={`BatchCode-${index1.id}`}
                            key={`BatchCode-${index1.id}`}
                            classNamePrefix="select2-selection"
                            options={index1.BatchCodeDetailsOptions}
                            placeholder="Please Select Batch."
                            onChange={(event) => {
                                BatchCodeHandler(event, index1, tableList)
                            }}
                            components={{ Option: customOption }}
                            styles={{
                                menu: (provided) => ({
                                    ...provided,
                                    zIndex: 10,
                                    overflowY: "auto", // Add a scrollbar if the content exceeds the height
                                }),
                            }}
                        />
                    </div>}

                    {!(_cfunc.loginUserIsFranchisesRole()) &&
                        <div className="mt-1">
                            <Label className="text-black pt-2" style={{ float: "left" }}>Add New Batch</Label>
                            < Button type="button" style={{ float: "right" }} color="btn btn-btn-sm btn-outline-primary border-2 font-size-12 text-center"
                                onClick={(event) => BatchCode_Add_Handler(event, index1, tableList, setTableList)}
                            > <i className="dripicons-plus align-center " style={{ flot: "center" }}></i></Button>

                        </div>}

                </>)
            }
        },

        {//*************** StockDetails ********************************** */
            text: "Stock Details",
            dataField: "StockDetails",
            attrs: () => ({ 'data-label1': "Stock Details", "stock-header": "true" }),
            headerStyle: { zIndex: "2" },
            formatExtraData: { tableList: TableArr },
            formatter: (cellContent, index1, keys_, { tableList = [] }) => {
                if (index1.GroupRow || index1.SubGroupRow) { return }
                
                return <>
                    <div className="table-responsive">
                        <table className="custom-table ">
                            <thead >
                                <tr>
                                    <th>BatchCode</th>
                                    <th>Stock </th>
                                    {(subPageMode === url.RATE_ADJUSTMENT) ? <th>Rate</th> : <th>Quantity</th>}
                                    <th>MRP</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cellContent.map((index2) => (
                                    <tr key={index1.id}>
                                        <td data-label="BatchCode">{index2.BatchCode}</td>
                                        <td data-label="Stock Quantity" style={{ textAlign: "right" }} >
                                            <samp id={`ActualQuantity-${index1.id}-${index2.id}`}>{index2.ActualQuantity}</samp>
                                        </td>
                                        <td data-label={(subPageMode === url.RATE_ADJUSTMENT) ? `Quantity` : `Rate`}>

                                            {(subPageMode === url.RATE_ADJUSTMENT) ?
                                                <Input
                                                    type="text"
                                                    disabled={pageMode === 'edit' ? true : false}
                                                    placeholder="Manually enter quantity"
                                                    className="right-aligned-placeholder"
                                                    key={`batchQty${index1.id}-${index2.id}`}
                                                    id={`batchQty${index1.id}-${index2.id}`}
                                                    autoComplete="off"
                                                    defaultValue={index2.Rate}
                                                    onChange={(event) => {
                                                        index2.Rate = Number(event.target.value)
                                                    }}
                                                />
                                                : <Input
                                                    type="text"
                                                    disabled={pageMode === 'edit' ? true : false}
                                                    placeholder="Manually enter quantity"
                                                    className="right-aligned-placeholder"
                                                    key={`batchQty${index1.id}-${index2.id}`}
                                                    id={`batchQty${index1.id}-${index2.id}`}
                                                    autoComplete="off"
                                                    defaultValue={index2.Qty}
                                                    onChange={(event) => {
                                                        QuantityOnchange(event, index1, index2, tableList);
                                                    }}
                                                />}
                                        </td>
                                        <td data-label="MRP">{index2.MRP}</td>
                                        < td >
                                            <span className="d-flex justify-content-center align-items-center">
                                                <Button
                                                    id={"deleteid"}
                                                    type="button"
                                                    disabled={!(index2.ActualQuantity === "0.000" || index2.ActualQuantity === "") && true}

                                                    className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light btn btn-secondary"
                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete Item'
                                                    onClick={(event) => { batchDeleteHandler(event, index1, index2, tableList); }}
                                                >
                                                    <i className="mdi mdi-delete font-size-16"></i>
                                                </Button>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div ></>
            }

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
                if (index1.GroupRow || index1.SubGroupRow) { return }

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

        const flatStockTableArr = TableArr.reduce((accumulator, index1) => {

            index1.StockDetails.forEach((index2) => {

                index2.Qty = Number(_cfunc.roundToDecimalPlaces(index2.Qty, 3));
                index2.ActualQuantity = Number(_cfunc.roundToDecimalPlaces(index2.ActualQuantity, 3));

                // const hasChange = index2.Qty !== index2.ActualQuantity;

                // function changebodyFunc() {
                accumulator.push({
                    "Item": index2.Item,
                    // "Quantity": index2.Qty,
                    "Quantity": (subPageMode === url.RATE_ADJUSTMENT) ? undefined : index2.Qty, // Only set "Quantity" if condition is false
                    "Rate": (subPageMode === url.RATE_ADJUSTMENT) ? index2.Rate : undefined,
                    "MRP": index2.MRPID,
                    "Unit": index1.UnitID,
                    "GST": index2.GSTID,
                    "MRPValue": index2.MRPValue,
                    "GSTPercentage": index2.GSTPercentage,
                    "BatchDate": index2.BatchDate,
                    "BatchCode": index2.BatchCode,
                    "BatchCodeID": index2.id
                })
                // };

                // if (hasChange) {
                //     if (index2.Qty > 0) {
                //         changebodyFunc()
                //     }
                //     else if (((index2.ActualQuantity > 0) && (index2.Qty === 0))) {
                //         changebodyFunc()
                //     } else if (((index2.ActualQuantity === 0) && (index2.Qty > 0))) {
                //         changebodyFunc()
                //     };
                // } else if (index2.Qty === 0) {
                // changebodyFunc()
                // };


            });

            return accumulator

        }, [])


        if (flatStockTableArr.length === 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.changeOneStockQty
            })
            return
        }

        try {
            const jsonBody = JSON.stringify({
                "PartyID": commonPartyDropSelect.value,
                "CreatedBy": _cfunc.loginUserID(),
                "Date": currentDate_ymd,
                "Mode": subPageMode === url.STOCK_ADJUSTMENT ? 2 : 3,
                "StockItems": flatStockTableArr,
                "IsStockAdjustment": true,//if stock  
                "IsAllStockZero": false
            })
            dispatch(saveStockEntryAction({ jsonBody, subPageMode }));
        }
        catch (w) { }
    };

    const processedData = useMemo(() => ModifyTableData_func(TableArr), [TableArr]);

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content">
                    <form noValidate>

                        <div className="px-2   c_card_filter text-black" >
                            <div className="row" >
                                <Col sm={4} className="">
                                    <FormGroup className="mb- row mt-3 mb-1 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "83px" }}>ItemName</Label>
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
                                </Col>
                                <Col sm={7} className="">
                                </Col>
                                <Col sm={1} className="mt-3" style={{}}>
                                    {
                                        < Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center mt-1"
                                            onClick={(e,) => ItemAddButtonHandler(e)}
                                        > Add</Button>
                                    }

                                </Col>
                            </div>
                        </div >


                        <div className="mb-1 ">
                            <GlobalCustomTable
                                keyField={"id"}
                                data={processedData}
                                rowStyle={rowStyle}
                                rowClasses={rowClasses}
                                columns={pagesListColumns}
                                id="table_Arrow"
                                noDataIndication={
                                    <div className="text-danger text-center ">
                                        Items Not available
                                    </div>
                                }
                                onDataSizeChange={({ dataCount, filteredData = [] }) => {
                                    dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} currency_symbol ${_cfunc.TotalAmount_Func(filteredData)}`));
                                }}
                            />
                        </div>

                        {
                            TableArr.length > 0 &&
                            <SaveButtonDraggable>
                                <SaveButton
                                    pageMode={pageMode}
                                    loading={saveBtnloading}
                                    onClick={SaveHandler}
                                    userAcc={userPageAccessState}
                                />

                            </SaveButtonDraggable>
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

















