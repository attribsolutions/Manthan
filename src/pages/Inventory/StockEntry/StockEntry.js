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
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    resetFunction,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../components/Common/CommonButton";
import { url, mode, pageId } from "../../../routes/index"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import CustomTable2 from "../../../CustomTable2/Table";
import { CInput, C_DatePicker } from "../../../CustomValidateForm/index";
import { decimalRegx, } from "../../../CustomValidateForm/RegexPattern";
import { getpartyItemList } from "../../../store/Administrator/PartyItemsRedux/action";
import { SalesReturn_add_button_api_For_Item } from "../../../helpers/backend_helper";
import * as _cfunc from "../../../components/Common/CommonFunction";
import "../../Sale/Invoice/SalesReturn/salesReturn.scss";
import { saveStockEntryAction, saveStockEntrySuccess } from "../../../store/Inventory/StockEntryRedux/action";

const StockEntry = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        Date: currentDate_ymd,
        ItemName: "",
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [TableArr, setTableArr] = useState([]);
    const [defaultMRP, setdefaultMRP] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        ItemList,
        pageField,
        userAccess,
        saveBtnloading,
    } = useSelector((state) => ({
        saveBtnloading: state.StockEntryReducer.saveBtnloading,
        postMsg: state.StockEntryReducer.postMsg,
        ItemList: state.PartyItemsReducer.partyItem,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        const page_Id = pageId.STOCK_ENTRY
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getpartyItemList(_cfunc.loginJsonBody()))
    }, []);

    const location = { ...history.location }
    // const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveStockEntrySuccess({ Status: false }))
            setTableArr([])
            dispatch(Breadcrumb_inputName(''))

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
                    RedirectPath: url.STOCK_ENTRY,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveStockEntrySuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    function Date_Onchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.Date = date;
            a.hasValid.Date.valid = true
            return a
        })
    }

    const itemList = ItemList.map((index) => ({
        value: index.Item,
        label: index.ItemName,
        itemCheck: index.selectCheck
    }));

    const ItemList_Options = itemList.filter((index) => {
        return index.itemCheck === true
    });

    function deleteButtonAction(row) {
        const newArr = TableArr.filter((index) => !(index.id === row.id))
        setTableArr(newArr)
    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {
                return (
                    <Label>{row.ItemName}</Label>
                )
            }
        },
        {
            text: "Quantity",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <CInput
                        id={`Qty${key}`}
                        key={`Qty${row.id}`}
                        autoComplete="off"
                        type="text"
                        cpattern={decimalRegx}
                        className="col col-sm text-end"
                        onChange={(e) => { row.Qty = e.target.value }}
                    />
                </span>)
            }
        },
        {
            text: "Unit",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key, a, b) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Select
                        id={`Unit${key}`}
                        name="Unit"
                        isSearchable={true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={row.ItemUnitDetails}
                        styles={{
                            menu: provided => ({ ...provided, zIndex: 2 })
                        }}
                        onChange={(event) => {
                            row.Unit = event.value
                            row.BaseUnitQuantity = event.BaseUnitQuantity
                        }}
                    />
                </span>)
            }
        },
        {
            text: "MRP",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (
                    <>
                        <span style={{ justifyContent: 'center', width: "100px" }}>
                            <Select
                                id={`MRP${key}`}
                                name="MRP"
                                defaultValue={row.defaultMRP}
                                isSearchable={true}
                                className="react-dropdown"
                                classNamePrefix="dropdown"
                                options={row.ItemMRPDetails}
                                onChange={(event) => { row.defaultMRP = event }}
                            />
                        </span></>)
            }
        },
        {
            text: "GST",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
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
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Input
                        id=""
                        key={row.id}
                        defaultValue={row.BatchCode}
                        type="text"
                        className="col col-sm text-center"
                        onChange={(event) => { row.BatchCode = event.target.value }}
                    />
                </span>)
            }
        },
        {
            text: "BatchDate",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
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
            formatter: (cellContent, row, key) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Button
                                    id={"deleteid"}
                                    type="button"
                                    className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete MRP'
                                    onClick={(e) => { deleteButtonAction(row) }}
                                >
                                    <i className="mdi mdi-delete font-size-18"></i>
                                </Button>
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
    ];

    async function AddPartyHandler() {
        if (values.ItemName === '') {
            customAlert({
                Type: 4,
                Message: `Select Item Name`
            });
            return;
        }

        let resp;
        try {
            resp = await SalesReturn_add_button_api_For_Item(values.ItemName.value);

            const responseData = resp.Data.InvoiceItems.map((i) => ({
                unitOps: i.ItemUnitDetails.map(i => ({ label: i.UnitName, value: i.Unit, BaseUnitQuantity: i.BaseUnitQuantity })),
                MRPOps: i.ItemMRPDetails.map(i => ({ label: i.MRPValue, value: i.MRP })),
                highest_MRP: i.ItemMRPDetails.filter((obj, index, arr) => {
                    return obj.MRP === Math.max(...arr.map(item => item.MRP));
                }),
                GSTOps: i.ItemGSTDetails.map(i => ({ label: i.GSTPercentage, value: i.GST })),
                highest_GST: i.ItemGSTDetails.filter((obj, index, arr) => {
                    return obj.GST === Math.max(...arr.map(item => item.GST));
                }),
                ItemName: i.ItemName,
                ItemId: i.Item,
                Quantity: i.Quantity,
            }));

            const initialTableData = [...TableArr];
            const dateString = currentDate_ymd.replace(/-/g, "");

            responseData.forEach((i) => {
                let batchCode = 0;

                initialTableData.forEach((index) => {
                    if (index.ItemId === i.ItemId) {
                        batchCode++;
                    }
                });

                initialTableData.push({
                    id: initialTableData.length + 1,
                    ItemUnitDetails: i.unitOps,
                    ItemMRPDetails: i.MRPOps,
                    ItemGSTHSNDetails: i.GSTOps,
                    ItemName: i.ItemName,
                    ItemId: i.ItemId,
                    Quantity: i.Quantity,
                    BatchDate: currentDate_ymd,
                    BatchCode: `${dateString}_${i.ItemId}_${_cfunc.loginPartyID()}_${batchCode}`,
                    defaultMRP: { value: i.highest_MRP[0].MRP, label: i.highest_MRP[0].MRPValue },
                    defaultGST: { value: i.highest_GST[0].GST, label: i.highest_GST[0].GSTPercentage },
                });
            });

            setTableArr(initialTableData);

            setState((i) => {
                let a = { ...i };
                a.values.ItemName = "";
                a.hasValid.ItemName.valid = true;
                return a;
            });
        } catch (w) { }
    }
    const SaveHandler = async (event) => {

        event.preventDefault();

        const btnId = event.target.id

        const ReturnItems = TableArr.map((index) => {

            return ({
                "Item": index.ItemId,
                "ItemName": index.ItemName,
                "Quantity": index.Qty,
                "MRP": index.defaultMRP.value,
                "Unit": index.Unit,
                "GST": index.defaultGST.value,
                "BatchDate": index.BatchDate,
                "BatchCode": index.BatchCode
            })
        })

        const filterData = ReturnItems.map(({ ItemName, ...rest }) => rest).filter((i) => {
            return i.Quantity > 0;
        });

        if (filterData.length === 0) {
            customAlert({
                Type: 4,
                Message: " Please Enter One Item Quantity"
            })
            return _cfunc.btnIsDissablefunc({ btnId, state: false })
        }

        const invalidMsg1 = []

        ReturnItems.forEach((i) => {

            if ((i.Unit === undefined) || (i.Unit === null)) {
                invalidMsg1.push(`${i.ItemName} : Unit Is Required`)
            }
            else if ((i.MRP === undefined) || (i.MRP === null)) {
                invalidMsg1.push(`${i.ItemName} : MRP Is Required`)
            }
            else if ((i.GST === undefined) || (i.GST === null)) {
                invalidMsg1.push(`${i.ItemName} : GST Is Required`)
            }
            else if ((i.BatchCode === "") || (i.BatchCode === undefined)) {
                invalidMsg1.push(`${i.ItemName} : BatchCode Is Required`)
            };
        })

        if (invalidMsg1.length > 0) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(invalidMsg1)
            })
            return _cfunc.btnIsDissablefunc({ btnId, state: false })
        }

        try {
            if (formValid(state, setState)) {
                _cfunc.btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    "PartyID": _cfunc.loginPartyID(),
                    "CreatedBy": _cfunc.loginUserID(),
                    "Date": values.Date,
                    "StockItems": filterData
                }
                );
                dispatch(saveStockEntryAction({ jsonBody, btnId }));
            }

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-3 c_card_filter header text-black mb-1" >

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Date}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='Date'
                                                value={values.Date}
                                                onChange={Date_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ItemName} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="ItemName "
                                                name="ItemName"
                                                value={values.ItemName}
                                                isSearchable={true}
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

                        <CustomTable2
                            data={TableArr}
                            columns={pagesListColumns}
                            classes={" table table-responsive table-bordered table-hover"}
                            noDataIndication={
                                <div className="text-danger text-center ">
                                    Record Not available
                                </div>
                            }
                        >
                        </CustomTable2>

                        {
                            TableArr.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton pageMode={pageMode}
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

export default StockEntry
