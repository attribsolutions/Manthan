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
import { CInput, C_Select, decimalRegx } from "../../../CustomValidateForm/index";
import { goButtonPartyItemAddPageSuccess, goButtonPartyItemAddPage } from "../../../store/Administrator/PartyItemsRedux/action";
import * as _cfunc from "../../../components/Common/CommonFunction";
import "../../../pages/Sale/SalesReturn/salesReturn.scss";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { getBatchCode_By_ItemID_Action, getBatchCode_By_ItemID_Action_Success } from "../../../store/Inventory/StockAdjustmentRedux/action";
import { saveStockEntryAction, saveStockEntrySuccess } from "../../../store/Inventory/StockEntryRedux/action";

// function initialState(history) {

//     let page_Id = '';
//     let sub_Mode = history.location.pathname;

//     if (sub_Mode === url.STOCK_ADJUSTMENT) {
//         page_Id = pageId.PARTY;
//     }
//         else {
//         page_Id = pageId.STO;
//     }
//     return { page_Id }
// };

const StockAdjustment = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const [TableArr, setTableArr] = useState([]);

    const [itemNameSelect, setItemNameSelect] = useState('');
    const [batchCodeSelect, setBatchCodeSelect] = useState('');

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        ItemList,
        partyItemListLoading,
        BatchCodeRedux,
        batchCodeDropLoading,
        postMsg,
        saveBtnloading,
        userAccess,
    } = useSelector((state) => ({
        partyItemListLoading: state.PartyItemsReducer.partyItemListLoading,
        ItemList: state.PartyItemsReducer.partyItem,

        saveBtnloading: state.StockEntryReducer.saveBtnloading,
        postMsg: state.StockEntryReducer.postMsg,

        BatchCodeRedux: state.StockAdjustmentReducer.batchCode_By_ItemID,
        batchCodeDropLoading: state.StockAdjustmentReducer.batchCodeDropLoading,

        userAccess: state.Login.RoleAccessUpdateData,
    }));

    useEffect(() => {
        const page_Id = pageId.STOCK_ADJUSTMENT
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id));

        dispatch(goButtonPartyItemAddPage({
            jsonBody: JSON.stringify({
                ..._cfunc.loginJsonBody(),
                PartyID: _cfunc.loginSelectedPartyID()
            })
        }))
        return () => {
            dispatch(goButtonPartyItemAddPageSuccess([]));
            dispatch(getBatchCode_By_ItemID_Action_Success([]));
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

    const itemList = ItemList.map((index) => ({
        value: index.Item,
        label: index.ItemName,
        itemCheck: index.selectCheck
    }));

    const ItemList_Options = itemList.filter((index) => {
        return index.itemCheck === true
    });

    const BatchCode_Options = BatchCodeRedux.map((index) => ({
        value: index.id,
        label: `${index.BatchCode}(${index.SystemBatchCode})MRP:${index.MRP}Qty:${index.OriginalBaseUnitQuantity}`,
    }));

    function QuantityHandler(event, row) {

        let input = event.target.value

        let v1 = Number(row.OriginalBaseUnitQuantity);
        let v2 = Number(input)
        if (!(v1 >= v2)) {
            event.target.value = v1;
        }
        row.Quantity = input;
    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
        },
        {
            text: "BatchCode",
            dataField: "BatchCode",
        },
        {
            text: "MRP",
            dataField: "MRP",
        },
        {
            text: "Original Quantity",
            dataField: "OriginalBaseUnitQuantity",
            formatter: (cellContent, row, key) => {

                return (<span >
                    <Label >{row.OriginalBaseUnitQuantity}&nbsp;&nbsp;&nbsp;&nbsp;{row.OriginalQtyUnitName}</Label>
                </span>)
            }
        },
        {
            text: "Quantity",
            dataField: "",
            formatExtraData: { TableArr },
            formatter: (cell, row, key, { TableArr }) => {
                return (
                    <div className="parent" >
                        <div className="child" style={{ minWidth: "100px" }}>
                            <CInput
                                defaultValue={row.Quantity}
                                autoComplete="off"
                                type="text"
                                cpattern={decimalRegx}
                                className="col col-sm text-end"
                                onChange={(event) => {
                                    QuantityHandler(event, row, TableArr)
                                }}
                            />
                        </div>

                    </div>
                )
            },
            headerStyle: () => {
                return { width: '120px', textAlign: 'center' };
            }
        },
        {
            text: "Unit",
            dataField: "",
            classes: () => "",
            style: { minWidth: "10vw" },
            formatter: (cellContent, row, key,) => {

                return (<span style={{ justifyContent: 'center' }}>
                    <C_Select
                        id={`Unit${key}`}
                        name="Unit"
                        isSearchable={true}
                        defaultValue={row.defaultUnit}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={row.UnitOptions}
                        styles={{
                            menu: provided => ({ ...provided, zIndex: 2 })
                        }}
                        onChange={(event) => {
                            row.defaultUnit = event
                        }}
                    />
                </span>)
            }
        },
    ];

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

    function ItemNameOnChange(e) {
        setItemNameSelect(e)
        setBatchCodeSelect('')
        dispatch(getBatchCode_By_ItemID_Action({ itemId: e.value, partyId: _cfunc.loginPartyID() }));
    }

    const AddPartyHandler = async () => {

        let isfound = TableArr.find(i => i.id === batchCodeSelect.value);
        if (itemNameSelect === '') {
            return customAlert({ Type: 4, Message: `Please Select ItemName` })

        }
        else if (batchCodeSelect === '') {
            return customAlert({ Type: 4, Message: `Please Select Batch Code` })

        }
        else if (!(isfound === undefined)) {
            return customAlert({ Type: 3, Message: "This BatchCode Already Exist" })
        }

        setBatchCodeSelect('');
        setItemNameSelect('');
        dispatch(getBatchCode_By_ItemID_Action_Success([]));

        // Assuming TableArr is an array
        const data = [...TableArr];

        const BatchCodeFind = BatchCodeRedux.find(i => i.id === batchCodeSelect.value);

        // Check if BatchCodeFind exists before constructing the object
        if (BatchCodeFind) {

            const defaultUnitOption = BatchCodeFind.UnitOptions.find(option => option.UnitName.includes("No"));

            data.push({
                id: BatchCodeFind.id,
                Item: BatchCodeFind.Item,
                ItemName: BatchCodeFind.ItemName,
                BatchCode: BatchCodeFind.BatchCode,
                MRP: BatchCodeFind.MRP,
                MRPID: BatchCodeFind.MRPID,
                GSTID: BatchCodeFind.GSTID,
                GSTPercentage: BatchCodeFind.GSTPercentage,
                OriginalBaseUnitQuantity: BatchCodeFind.OriginalBaseUnitQuantity,
                OriginalQtyUnitName: BatchCodeFind.UnitName,
                UnitOptions: BatchCodeFind.UnitOptions.map(i => ({ value: i.Unit, label: i.UnitName })),
                defaultUnit: defaultUnitOption ? { value: defaultUnitOption.Unit, label: defaultUnitOption.UnitName } : null,
                BatchDate: BatchCodeFind.BatchDate,
                Quantity: ""
            });
        }

        setTableArr(data);
    }

    const SaveHandler = async (event) => {

        event.preventDefault();

        const btnId = event.target.id

        const ReturnItems = TableArr.map((index) => {

            return ({
                "Item": index.Item,
                "Quantity": index.Quantity,
                "MRP": index.MRPID,
                "Unit": index.defaultUnit.value,
                "GST": index.GSTID,
                "MRPValue": index.MRP,
                "GSTPercentage": index.GSTPercentage,
                "BatchDate": index.BatchDate,
                "BatchCode": index.BatchCode,
                "BatchCodeID": index.id
            })
        })

        const filterData = ReturnItems.filter((i) => {
            return i.Quantity > 0;
        });

        if (filterData.length === 0) {
            customAlert({
                Type: 4,
                Message: " Please Enter One Item Quantity"
            })
            return _cfunc.btnIsDissablefunc({ btnId, state: false })
        }

        try {
            const jsonBody = JSON.stringify({
                "PartyID": _cfunc.loginPartyID(),
                "CreatedBy": _cfunc.loginUserID(),
                "Date": currentDate_ymd,
                "Mode": 2,
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
                                                onChange={(e) => { ItemNameOnChange(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>Batch Code</Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="batchCode "
                                                name="batchCode"
                                                value={batchCodeSelect}
                                                isSearchable={true}
                                                isLoading={batchCodeDropLoading}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={BatchCode_Options}
                                                onChange={(e) => { setBatchCodeSelect(e) }}
                                            />
                                        </Col>

                                        <Col sm="1" className="mx-6 mt-1">
                                            {
                                                < Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center"
                                                    onClick={(e,) => AddPartyHandler(e, "add")}
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
