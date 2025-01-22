
import React, { useEffect, useMemo, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,
    Button,
    Spinner
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageFieldSuccess, getpdfReportdataSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,

} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { C_Button, DashboardLoader, Loader, SaveButton } from "../../../components/Common/CommonButton";
import { url, mode, pageId } from "../../../routes/index"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { CInput, C_DatePicker, C_ItemSelect, C_Select } from "../../../CustomValidateForm/index";
import { decimalRegx, decimalRegx_3dit, } from "../../../CustomValidateForm/RegexPattern";
import { goButtonPartyItemAddPageSuccess, goButtonPartyItemAddPage } from "../../../store/Administrator/PartyItemsRedux/action";
import { StockEntry_GO_button_api_For_Item } from "../../../helpers/backend_helper";
import * as _cfunc from "../../../components/Common/CommonFunction";
import "../../../pages/Sale/SalesReturn/salesReturn.scss";
import { GetStockCount, Get_Items_Drop_Down, Get_Items_Drop_Down_Success, saveStockEntryAction, saveStockEntrySuccess } from "../../../store/Inventory/StockEntryRedux/action";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { ItemAPIResponseFunc } from "./stockEntryFunctions";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import paginationFactory from "react-bootstrap-table2-paginator";
import { table_ArrowUseEffect } from "../../../components/Common/CommonUseEffect";
import { ExcelReportComponent } from "../../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { GroupSubgroupDisplay, ModifyTableData_func } from "../../../components/Common/TableCommonFunc";
import * as report from '../../../Reports/ReportIndex'
import C_Report from "../../../components/Common/C_Report";


const StockEntry = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const isVisibleRateDrop = _cfunc.checkRateDropVisibility()
    const IsFranchise = _cfunc.loginUserIsFranchisesRole()
    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        Date: currentDate_ymd,
        ItemName: "",
        IsAllStockZero: false
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [TableArr, setTableArr] = useState([]);

    const [itemAPIData, setItemAPIData] = useState([]);
    const [itemAPIDataLoading, setItemAPIDataLoading] = useState(false);

    const [AddLoading, setAddLoading] = useState(false);
    const [Add_AllLoading, setAdd_AllLoading] = useState(false);


    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { fieldLabel } = state;

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        ItemList,
        pageField,
        userAccess,
        saveBtnloading,
        partyItemListLoading,
        StockCount,
        ItemDropDown,
        lastStockEntryDate,
        ItemDropDownloading
    } = useSelector((state) => ({
        partyItemListLoading: state.PartyItemsReducer.partyItemListLoading,
        saveBtnloading: state.StockEntryReducer.saveBtnloading,
        lastStockEntryDate: state.StockEntryReducer.lastStockEntryDate,
        ItemDropDown: state.StockEntryReducer.ItemDropDown,
        ItemDropDownloading: state.StockEntryReducer.ItemDropDownloading,

        postMsg: state.StockEntryReducer.postMsg,
        ItemList: state.PartyItemsReducer.partyItem,
        StockCount: state.StockEntryReducer.StockCount,

        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));
    debugger

    console.log(lastStockEntryDate)
    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    // Common Party select Dropdown useEffect

    useEffect(() => {
        const page_Id = pageId.STOCK_ENTRY
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id));

        dispatch(Get_Items_Drop_Down({
            jsonBody: JSON.stringify({
                UserID: _cfunc.loginUserID(),
                RoleID: _cfunc.loginRoleID(),
                CompanyID: _cfunc.loginCompanyID(),
                IsSCMCompany: _cfunc.loginIsSCMCompany(),
                CompanyGroup: _cfunc.loginCompanyGroup(),
                PartyID: _cfunc.loginSelectedPartyID(),
            })
        }));

        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
    }, []);



    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            dispatch(Get_Items_Drop_Down({
                jsonBody: JSON.stringify({
                    UserID: _cfunc.loginUserID(),
                    RoleID: _cfunc.loginRoleID(),
                    CompanyID: _cfunc.loginCompanyID(),
                    IsSCMCompany: _cfunc.loginIsSCMCompany(),
                    CompanyGroup: _cfunc.loginCompanyGroup(),
                    PartyID: _cfunc.loginSelectedPartyID(),
                })
            }));
        } else {
            dispatch(Get_Items_Drop_Down_Success([]));
            setTableArr([]);
        }
    }, [commonPartyDropSelect]);

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
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveStockEntrySuccess({ Status: false }))
            setTableArr([])

            if (pageMode === "other") {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.STOCK_ENTRY_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveStockEntrySuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg]);

    useEffect(() => {
        const PartyID = _cfunc.loginSelectedPartyID()
        const jsonBody = JSON.stringify({
            "FromDate": currentDate_ymd,
            "PartyID": PartyID
        });
        dispatch(GetStockCount({ jsonBody }))
    }, [currentDate_ymd])

    useEffect(() => table_ArrowUseEffect("#table_Arrow"), [TableArr]);

    function Date_Onchange(e, date) {
        const PartyID = _cfunc.loginPartyID()
        const jsonBody = JSON.stringify({
            "FromDate": date,
            "PartyID": PartyID
        });

        dispatch(GetStockCount({ jsonBody }))
        setState((i) => {
            const a = { ...i }
            a.values.Date = date;
            a.hasValid.Date.valid = true
            return a
        })
    }

    function isAllStockZero_Onchange(e) {
        setState((i) => {
            const a = { ...i }
            a.hasValid.IsAllStockZero.valid = true
            a.values.IsAllStockZero = e.target.checked;
            return a
        })
    }

    const ItemList_Options = ItemDropDown.map((index) => ({
        ...index,
        value: index.Item,
        label: index.ItemName,
    }));


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

        {
            text: "Item Name",
            dataField: "ItemName",
            classes: () => "",
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
        {
            text: "Current Stock",
            dataField: "CurrentStock",
            classes: () => "",
            hidden: !(IsFranchise),
            formatter: (cellContent, row, key) => {
                if (row.GroupRow || row.SubGroupRow) { return }

                return (
                    <Label>{row.CurrentStock}</Label>
                )
            }
        },
        {
            text: "Quantity",
            dataField: "",
            classes: () => "",
            formatter: (cellContent, row, key) => {
                if (row.GroupRow || row.SubGroupRow) { return }

                return (<span style={{ justifyContent: 'center' }}>
                    <CInput
                        id={`Qty${key}`}
                        key={`Qty${row.id}`}
                        defaultValue={row.Qty}
                        autoComplete="off"
                        type="text"
                        cpattern={decimalRegx_3dit}
                        className="text-end"
                        onChange={(e) => {
                            row.Qty = e.target.value
                        }}
                    />
                </span>)
            }
        },
        {
            text: "Unit",
            dataField: "",
            classes: () => "",
            style: { minWidth: "10vw" },
            formatter: (cellContent, row, key,) => {
                if (row.GroupRow || row.SubGroupRow) { return }

                return (<span style={{ justifyContent: 'center' }}>
                    <Select
                        id={`Unit${key}`}
                        name="Unit"
                        isSearchable={true}
                        defaultValue={row.defaultUnit}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={row.Unit_DropdownOptions}
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
        {
            text: "MRP",
            dataField: "",
            style: { minWidth: "10vw" },
            classes: () => "",
            hidden: (isVisibleRateDrop || IsFranchise),
            formatter: (cellContent, row, key) => {
                if (row.GroupRow || row.SubGroupRow) { return }

                return (
                    <>
                        <span >
                            <Select
                                id={`MRP${key}`}
                                name="MRP"
                                defaultValue={row.defaultMRP}
                                isSearchable={true}
                                className="react-dropdown "
                                classNamePrefix="dropdown"
                                options={row.MRP_DropdownOptions}
                                onChange={(event) => { row.defaultMRP = event }}
                            />
                        </span></>)
            }
        },

        {
            text: "Rate",
            dataField: "",
            style: { minWidth: "10vw" },
            classes: () => "",
            hidden: !(isVisibleRateDrop),
            formatter: (cellContent, row, key) => {
                if (row.GroupRow || row.SubGroupRow) { return }

                return (
                    <>
                        <span >
                            <Select
                                id={`Rate${key}`}
                                name="Rate"
                                defaultValue={row.defaultRate.value === null ? [] : row.defaultRate}
                                isSearchable={true}
                                className="react-dropdown "
                                classNamePrefix="dropdown"
                                options={row.Rate_DropdownOptions}
                                onChange={(event) => { row.defaultRate = event }}
                            />
                        </span></>)
            }
        },
        {
            text: "GST",
            dataField: "",
            style: { minWidth: "10vw" },
            classes: () => "",
            hidden: IsFranchise,
            formatter: (cellContent, row, key) => {
                if (row.GroupRow || row.SubGroupRow) { return }

                return (<span >
                    <Select
                        id={`GST${key}`}
                        name="GST"
                        defaultValue={row.defaultGST}
                        isSearchable={true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={row.ItemGSTHSNDetails}
                        onChange={(event) => { row.defaultGST = event }}
                    />
                </span>)
            }
        },
        {
            text: "BatchCode",
            dataField: "",
            classes: () => "",
            hidden: IsFranchise,
            formatter: (cellContent, row, key) => {
                if (row.GroupRow || row.SubGroupRow) { return }

                return (<span >
                    <Input
                        id=""
                        key={row.id}
                        defaultValue={row.BatchCode}
                        type="text"
                        className=" text-center"
                        onChange={(event) => { row.BatchCode = event.target.value }}
                    />
                </span>)
            }
        },
        {
            text: "BatchDate",
            dataField: "",
            classes: () => "",
            hidden: IsFranchise,
            formatter: (cellContent, row, key) => {
                if (row.GroupRow || row.SubGroupRow) { return }

                return (<span style={{ justifyContent: 'center' }}>
                    <C_DatePicker
                        name='Date'
                        value={row.BatchDate}
                        onChange={(e, date) => {
                            row.BatchDate = _cfunc.date_ymd_func(date)
                        }}
                    />
                </span>)
            }
        },
        {
            text: "Action ",
            dataField: "",
            formatExtraData: { TableArr: TableArr, setTableArr: setTableArr },

            formatter: (cellContent, row, _key, formatExtraData) => {
                if (row.GroupRow || row.SubGroupRow) { return }
                return (<div style={{ justifyContent: 'center' }} >
                    <Col>
                        <FormGroup className=" col col-sm-4 ">
                            <Button
                                id={"deleteid"}
                                type="button"
                                className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete MRP'
                                onClick={(e) => { deleteButtonAction(row, _key, formatExtraData) }}
                            >
                                <i className="mdi mdi-delete font-size-18"></i>
                            </Button>
                        </FormGroup>
                    </Col>
                </div>)
            }

        },
    ];

    const filterItemsById = (items, ids) => {
        return items.filter(item => ids.includes(item.Item));
    };

    async function ItemAPICall(itemIDs, Items) {

        // Find itemsObject that are present in ItemListOptionsItems but not in filterDataItems
        const filteredItems = filterItemsById(Items, itemIDs);
        const initialTableData = await ItemAPIResponseFunc(filteredItems, [...itemAPIData]);
        setItemAPIData(initialTableData);
        return initialTableData;
    }

    async function AddPartyHandler(e, Type) {

        setAddLoading(true)

        let selectedItem = []
        if (_cfunc.loginSelectedPartyID() === 0 && values.ItemName === '') {
            customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
            setAddLoading(false)
            return;
        }

        if (values.ItemName === '') {
            if (Type === "add_All" && TableArr.length !== ItemDropDown.length) {
                setAddLoading(false)
                setAdd_AllLoading(true)
                selectedItem = ItemDropDown
            } else {
                if (TableArr.length === ItemDropDown.length) {
                    setAddLoading(false)
                    setAdd_AllLoading(false)
                    customAlert({
                        Type: 4,
                        Message: alertMessages.AllItemExist
                    });
                } else if (values.ItemName === '' && Type !== "add_All") {
                    setAddLoading(false)
                    setAdd_AllLoading(false)
                    customAlert({
                        Type: 4,
                        Message: alertMessages.selectItemName
                    });
                }
                return;
            }
        }

        try {
            // const apiResponse = await StockEntry_GO_button_api_For_Item(values.ItemName.value);
            if (values.ItemName !== '' && Type !== "add_All") {
                selectedItem = ItemDropDown.filter((index, key) => (values.ItemName.value === index.Item))
                const ExistInTable = TableArr.filter((index, key) => (values.ItemName.value === index.ItemId))


            }
            const updatedTableData = await ItemAPIResponseFunc(selectedItem, Type !== "add_All" ? [...TableArr] : []);

            updatedTableData.reverse();

            setState((prevState) => {
                const newState = { ...prevState };
                newState.values.ItemName = "";
                newState.hasValid.ItemName.valid = true;
                return newState;
            });
            setTableArr(updatedTableData);

            dispatch(BreadcrumbShowCountlabel(`Count:${updatedTableData.length}`));
            setAddLoading(false)
            setAdd_AllLoading(false)
        } catch (error) {
            setAddLoading(false)
            setAdd_AllLoading(false)
            _cfunc.CommonConsole('Error in AddPartyHandler:', error);
        }
    }

    function deleteButtonAction(row, key, { TableArr = [], setTableArr }) {

        const newArr = TableArr.filter((index, key1) => !(row.ItemId === index.ItemId))
        setTableArr(newArr)
        dispatch(BreadcrumbShowCountlabel(`Count:${newArr.length}`));

    }

    const SaveHandler = async (event) => {

        event.preventDefault();

        const btnId = event.target.id
        let isConfirmed = ""
        let updatedTableData = []
        let ReturnItemsArr = []
        let StockItemsArray = []

        const mapItemArray = (index) => ({
            "Item": index.ItemId,
            "ItemName": index.ItemName,
            "Quantity": index.Qty === undefined ? 0 : index.Qty,
            "MRP": index.defaultMRP.value,
            "Unit": index.defaultUnit?.value,
            "GST": index.defaultGST.value,
            "MRPValue": index.defaultMRP.label,
            "GSTPercentage": index.defaultGST.label,
            "Rate": index.defaultRate.value,
            "RateValue": index.defaultRate.label,
            "BatchDate": index.BatchDate,
            "BatchCode": index.BatchCode,
            "BatchCodeID": 0
        });

        const ReturnItems = TableArr.map(mapItemArray);

        const filterData = ReturnItems.filter((i) => {
            return i.Quantity > 0;
        });

        if (filterData.length === 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.itemQtyIsRequired
            })
            return _cfunc.btnIsDissablefunc({ btnId, state: false })
        }

        const invalidMsg1 = []

        ReturnItems.forEach((i) => {

            if ((i.Unit === undefined) || (i.Unit === null)) {
                invalidMsg1.push(`${i.ItemName} : ${alertMessages.unitIsRequired}`)
            }
            else if ((i.MRP === undefined) || (i.MRP === null) && !(isVisibleRateDrop)) {
                invalidMsg1.push(`${i.ItemName} :${alertMessages.mrpIsRequired}`)
            }
            else if ((i.Rate === undefined) || (i.Rate === null) && (isVisibleRateDrop)) {
                invalidMsg1.push(`${i.ItemName} :${alertMessages.rateIsRequired}`)
            }
            else if ((i.GST === undefined) || (i.GST === null)) {
                invalidMsg1.push(`${i.ItemName} : ${alertMessages.gstIsRequired}`)
            }
            else if ((i.BatchCode === "") || (i.BatchCode === undefined)) {
                invalidMsg1.push(`${i.ItemName} : ${alertMessages.batchCodeIsRequired}`)
            };
        })

        if (invalidMsg1.length > 0) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(invalidMsg1)
            })
            return _cfunc.btnIsDissablefunc({ btnId, state: false })
        }

        if (values.IsAllStockZero) {

            setItemAPIDataLoading(true)
            const filterDataItems = filterData.map(item => item.Item);
            const ItemListOptionsItems = ItemList_Options.map(item => item.value);

            // Find items that are present in ItemListOptionsItems but not in filterDataItems
            const ItemIDs = ItemListOptionsItems.filter(item => !filterDataItems.includes(item));

            try {
                const results = await ItemAPICall(ItemIDs, ItemDropDown);
                updatedTableData = [...itemAPIData, ...results];
                updatedTableData.sort((a, b) => b.id - a.id);
                setItemAPIData(updatedTableData);

            } catch (error) {
                _cfunc.CommonConsole(error);
            } finally {
                setItemAPIDataLoading(false);
            }
            const newArray = updatedTableData.flat().map(item => ({ ...item }));

            ReturnItemsArr = newArray.map(mapItemArray);
        }

        StockItemsArray = [...filterData, ...ReturnItemsArr];

        try {
            if (formValid(state, setState)) {
                _cfunc.btnIsDissablefunc({ btnId, state: true })
                const jsonBody = JSON.stringify({
                    "PartyID": commonPartyDropSelect.value,
                    "CreatedBy": _cfunc.loginUserID(),
                    "Date": values.Date,
                    "Mode": 1,
                    "StockItems": StockItemsArray,
                    "IsAllStockZero": values.IsAllStockZero,
                    "IsStockAdjustment": false
                }
                );

                if (values.IsAllStockZero) {
                    isConfirmed = await customAlert({
                        Type: 7,
                        Message: alertMessages.stockIsZero,
                    });
                }
                if ((isConfirmed) || (!values.IsAllStockZero)) {

                    dispatch(saveStockEntryAction({ jsonBody, btnId }));
                };
            }
        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    const paginationOptions = {
        sizePerPage: 300, // Number of rows per page
        hideSizePerPage: true, // Hide the size per page dropdown
        hidePageListOnlyOnePage: true, // Hide the pagination list when there's only one page
        onPageChange: (page, sizePerPage) => {
            _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
        }
    };
    const ExcelDownloadhandler = () => {
        debugger
        const StockItem_Array = TableArr.map(item => {
            const [ItemName] = item.ItemName.split('-');
            return {
                GroupName: item.GroupName,
                SubGroupName: item.SubGroupName,
                ItemName: ItemName,
                Quantity: item.Qty ? parseFloat(item.Qty) : item.Quantity,
                Unit: item.defaultUnit.label,
                MRP: item.defaultMRP.label,
                GST: item.defaultGST.label,
                BatchCode: item.BatchCode,
                BatchDate: item.BatchDate,

            };
        });

        let column = [...pagesListColumns, {
            text: "Group Name",
            dataField: "GroupName",
            hidden: false

        }, {
            text: "Sub Group Name",
            dataField: "SubGroupName",
            hidden: false
        }]

        ExcelReportComponent({

            extraColumn: column,
            excelTableData: StockItem_Array,
            excelFileName: "Stock Entry Report"
        })
    }

    const PDFDownloadhandler = () => {

        let config = {}
        TableArr["Closingdate"] = values.Date
        config["Data"] = TableArr
        config["ReportType"] = report.StockEntry
        config["Status"] = true
        config["StatusCode"] = 200
        dispatch(getpdfReportdataSuccess(config));
    }

    const processedData = useMemo(() => ModifyTableData_func(TableArr), [TableArr]);


    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content">
                    <form noValidate>
                        {!StockCount && <div style={{ color: "red", fontSize: "18px" }} className="sliding-text " > {` Warning: Can not Save Stock Entry for  ${_cfunc.date_dmy_func(values.Date)}`}.  </div>}

                        <div className="px-2   c_card_filter text-black" >
                            <div className="row" >
                                <Col sm={3} className="">
                                    <FormGroup className="mb- row mt-3 mb-1 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "150px" }}>{fieldLabel.Date}</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='Date'
                                                value={values.Date}
                                                onChange={Date_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col sm={3} className="">
                                    <FormGroup className="mb- row mt-3 mb-1 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "115px" }}>{fieldLabel.ItemName}</Label>
                                        <Col sm="7">
                                            <C_ItemSelect
                                                id="ItemName "
                                                name="ItemName"
                                                value={values.ItemName}
                                                isSearchable={true}
                                                isLoading={ItemDropDownloading}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={ItemList_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>

                                </Col>

                                <Col className="">
                                    <FormGroup className="mb- row mt-3 mb-1 " >
                                        <Label className="col p-2"
                                            style={{ width: "130px" }}>{fieldLabel.IsAllStockZero} </Label>
                                        <Col className="col-lg-8" style={{ marginTop: '5px' }} >
                                            <div className="form-check form-switch form-switch-md mb-3">
                                                <Input type="checkbox" className="form-check-input"
                                                    checked={values.IsAllStockZero}
                                                    name="IsAllStockZero"
                                                    onChange={isAllStockZero_Onchange}

                                                />
                                            </div>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup className="mb mt-3 mb-1 " >
                                        <Label className=" p-2"
                                            style={{ width: "130px" }}>{"Last Stock Entry"} : </Label>
                                        <Label className=" p-2"
                                            style={{ fontSize: "20px" }}> {_cfunc.date_dmy_func(lastStockEntryDate)}</Label>
                                    </FormGroup>
                                </Col>

                                <Col className="mt-3 col-auto" >
                                    {AddLoading
                                        ? < Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center mt-1"
                                        ><Spinner className="mt-1" style={{ width: "15px", height: "15px" }} /></Button> :
                                        < Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center mt-1  p-2"
                                            onClick={(e,) => AddPartyHandler(e, "add")}
                                            disabled={!StockCount || ItemDropDownloading}
                                        > Add </Button>
                                    }


                                </Col>

                                <Col className="mt-3 col-auto" >
                                    {Add_AllLoading
                                        ? < Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center mt-1"
                                        ><Spinner className="mt-1" style={{ width: "15px", height: "15px" }} /></Button> :
                                        < Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center mt-1  p-2"
                                            style={{ cursor: "pointer" }}
                                            onClick={(e,) => AddPartyHandler(e, "add_All")}
                                            disabled={!StockCount || ItemDropDownloading || (TableArr.length === ItemDropDown.length)}
                                        > Add All</Button>
                                    }

                                </Col>
                                {TableArr.length > 0 && <Col className="mt-2 col-auto" >
                                    <C_Button
                                        type="button"
                                        spinnerColor="white"
                                        // loading={excelLoading}
                                        className="btn btn-primary m-3 mr"
                                        onClick={ExcelDownloadhandler}
                                    >
                                        Excel
                                    </C_Button>
                                    <C_Button
                                        type="button"
                                        spinnerColor="white"
                                        // loading={excelLoading}
                                        className="btn btn-success m-3 mr"
                                        onClick={PDFDownloadhandler}
                                    >
                                        PDF
                                    </C_Button>
                                </Col>}




                            </div>
                        </div >

                        {values.IsAllStockZero && <div style={{ color: "red", fontSize: "18px" }} className="sliding-text " >  Warning: If new stock is added then the previous whole item stock will become zero.  </div>}

                        <ToolkitProvider
                            keyField="id"
                            data={processedData}
                            columns={pagesListColumns}

                            search
                        >
                            {(toolkitProps) => (
                                <React.Fragment>
                                    <BootstrapTable
                                        keyField="id"
                                        id="table_Arrow"
                                        classes='custom-table'
                                        rowStyle={rowStyle}
                                        rowClasses={rowClasses}
                                        noDataIndication={<div className="text-danger text-center">Item Not available</div>}
                                        onDataSizeChange={({ dataSize }) => {
                                            dispatch(BreadcrumbShowCountlabel(`Count : ${dataSize}`));
                                            _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                        }}

                                        pagination={paginationFactory(paginationOptions)} // Add pagination options
                                        {...toolkitProps.baseProps}
                                    />
                                    {globalTableSearchProps(toolkitProps.searchProps)}
                                </React.Fragment>
                            )}
                        </ToolkitProvider>



                        {
                            TableArr.length > 0 &&
                            <SaveButtonDraggable>
                                <SaveButton pageMode={pageMode}
                                    loading={saveBtnloading || itemAPIDataLoading}
                                    forceDisabled={!StockCount}
                                    onClick={SaveHandler}
                                    userAcc={userPageAccessState}
                                />
                            </SaveButtonDraggable>
                        }

                    </form >
                </div >
                <C_Report />
            </React.Fragment >


        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default StockEntry
