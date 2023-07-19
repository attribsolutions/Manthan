import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,

} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { GetVenderSupplierCustomer, Retailer_List, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeSelect,
} from "../../../components/Common/validationFunction";
import { mode, pageId, url } from "../../../routes/index"
import "../../Sale/SalesReturn/salesReturn.scss";
import { CInput, C_DatePicker, C_Select, decimalRegx, floatRegx } from "../../../CustomValidateForm/index";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Change_Button, C_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import { getPartyTypelist } from "../../../store/Administrator/PartyTypeRedux/action";
import PriceDropOptions from "../PartyMaster/MasterAdd/FirstTab/PriceDropOptions";
import { priceListByPartyAction } from "../../../store/Administrator/PriceList/action";
import Select from "react-select";

const DiscountMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        PartyType: "",
        PriceList: "",
        Customer: "",
        ItemList: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [subPageMode] = useState(history.location.pathname)
    const [priceListSelect, setPriceListSelect] = useState({ value: '' });

    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }])
    const [changeAllDiscount, setChangeAllDiscount] = useState(false)
    const [discountValueAll, setDiscountValueAll] = useState("");
    const [discountTypeAll, setDiscountTypeAll] = useState({ value: 2, label: " % " });
    const [forceReload, setForceReload] = useState(false)

    const [tableData] = useState([{
        id: 1, ItemName: "Bakarwadi 500 g Tray",
    },
    {
        id: 2, ItemName: "Chakli 200 g Box"
    }])

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        PartyType,
        priceListByPartyType,
        customer,
        pageField,
        userAccess,
    } = useSelector((state) => ({
        PartyType: state.PartyTypeReducer.ListData,
        priceListByPartyType: state.PriceListReducer.priceListByPartyType,
        customer: state.CommonAPI_Reducer.RetailerList,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.DISCOUNT_MASTER))
        dispatch(getPartyTypelist())
        dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))

        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {// userAccess useEffect
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

    const PartyTypeOptions = PartyType.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const customerOptions = customer.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
        },

        {//*************** Discount Type ******************* */

            formatExtraData: {
                discountValueAll: discountValueAll,
                discountTypeAll: discountTypeAll,
                changeAllDiscount: changeAllDiscount,
                forceReload: forceReload,
                tableList: tableData
            },

            headerFormatter: () => {
                return (
                    <div className="">

                        <div className="row">
                            <div className="col col-5" style={{ marginTop: "10px" }} >
                                <Label >Discount Type</Label>
                            </div>

                            <div className="col col-6" >
                                <Select
                                    type="text"
                                    defaultValue={discountTypeAll}
                                    classNamePrefix="select2-selection"
                                    options={discountDropOption}
                                    style={{ textAlign: "right" }}
                                    onChange={(e) => {
                                        setChangeAllDiscount(true);
                                        setDiscountTypeAll(e);
                                        setDiscountValueAll('');
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );
            },

            formatter: (cellContent, index1, key, formatExtraData) => {
                let { tableList, discountValueAll, discountTypeAll } = formatExtraData;

                if (formatExtraData.changeAllDiscount) {
                    index1["DiscountType"] = discountTypeAll.value;
                }
                if (!index1.DiscountType) { index1["DiscountType"] = discountTypeAll.value }

                const defaultDiscountTypelabel =
                    index1.DiscountType === 1 ? discountDropOption[0] : discountDropOption[1];

                return (
                    <>
                        <div className="mb-2">
                            <div className="parent">

                                <div className="child">
                                    <Select
                                        id={`DicountType_${key}`}
                                        classNamePrefix="select2-selection"
                                        key={`DicountType_${key}-${index1.id}`}
                                        value={defaultDiscountTypelabel}
                                        options={discountDropOption}
                                        onChange={(e) => {

                                            setChangeAllDiscount(false);
                                            setForceReload(!forceReload);
                                            index1.DiscountType = e.value;
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                );
            },
            headerStyle: () => {
                return { width: '300px', };
            }
        },

        {//***************  Discount ******************************* */

            formatExtraData: {
                discountValueAll: discountValueAll,
                discountTypeAll: discountTypeAll,
                changeAllDiscount: changeAllDiscount,
                forceReload: forceReload,
                tableList: tableData
            },
            headerFormatter: () => {
                return (
                    <div className="row">
                        <div className="col col-3" style={{ marginTop: "10px" }} >
                            <Label >Discount</Label>
                        </div>

                        <div className="col col-5" >
                            <CInput
                                type="text"
                                className="input"
                                style={{ textAlign: "right" }}
                                cpattern={decimalRegx}
                                value={discountValueAll}
                                onChange={(e) => {
                                    let e_val = Number(e.target.value);

                                    // Check if discount type is "percentage"
                                    if (discountTypeAll.value === 2) {// Discount type 2 represents "percentage"
                                        // Limit the input to the range of 0 to 100
                                        if (e_val > 100) {
                                            e.target.value = 100; // Set the input value to 100 if it exceeds 100
                                        } else if (!(e_val >= 0 && e_val < 100)) {
                                            e.target.value = ""; // Clear the input value if it is less than 0
                                        }
                                    }
                                    setChangeAllDiscount(true);
                                    setDiscountValueAll(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                );
            },

            classes: () => "invoice-discount-row",
            formatter: (cellContent, index1, key, formatExtraData) => {
                let { tableList, discountValueAll, discountTypeAll } = formatExtraData;

                if (formatExtraData.changeAllDiscount) {
                    index1["Discount"] = discountValueAll;
                    index1["DiscountType"] = discountTypeAll.value;
                }

                if (!index1.DiscountType) { index1.DiscountType = discountTypeAll.value }

                return (
                    <>
                        <div className="parent">
                            <div className="child">
                                <CInput
                                    className="input"
                                    id={`Dicount_${key}-${index1.id}`}
                                    style={{ textAlign: "right" }}
                                    type="text"
                                    value={index1.Discount}
                                    cpattern={decimalRegx}
                                    onChange={(e) => {
                                        let e_val = Number(e.target.value);
                                        // Check if discount type is "percentage"
                                        if (index1.DiscountType === 2) { // Discount type 2 represents "percentage"
                                            // Limit the input to the range of 0 to 100
                                            if (e_val > 100) {
                                                e.target.value = 100; // Set the input value to 100 if it exceeds 100
                                            } else if (!(e_val >= 0 && e_val < 100)) {
                                                e.target.value = ''; // Clear the input value if it is less than 0
                                            }
                                        }
                                        index1.Discount = e.target.value;
                                        setForceReload(!forceReload);
                                        setChangeAllDiscount(false);
                                    }}
                                />
                            </div>
                        </div>
                    </>
                );
            },
            headerStyle: () => {
                return { width: '300px', };
            }
        },
    ];

    const FromDate_Onchange = (e, date) => {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
    }

    const ToDate_Onchange = (e, date) => {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
    }

    const priceListOnClick = function () {

        const hasNone = document.getElementById("price-drop").style;

        if ((priceListByPartyType.length > 0)) {
            if ((hasNone.display === "none") || (hasNone.display === "")) {
                hasNone.display = "block";
            } else {
                hasNone.display = "none";
            }
        }

    };

    function partyTypeOnChange(hasSelect, evn) {

        onChangeSelect({ hasSelect, evn, state, setState })
        setPriceListSelect({ label: '' })
        dispatch(priceListByPartyAction(hasSelect.value))
    }
    const goButtonHandler = async (selectSupplier) => {
        let config = { subPageMode, jsonBody:{} }
        // dispatch(_act.GoButton_For_Order_Add(config))
    };



    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-1" >

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.FromDate}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='FromDate'
                                                value={values.FromDate}
                                                onChange={FromDate_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ToDate}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='ToDate'
                                                value={values.ToDate}
                                                onChange={ToDate_Onchange}
                                            />
                                        </Col>
                                        <Col sm="1" className="mx-6 mt-1 ">
                                            {true ?
                                                <Go_Button
                                                    type="button"
                                                    // loading={addBtnLoading}
                                                    onClick={goButtonHandler}>
                                                    GO
                                                </Go_Button> :

                                                <Change_Button onClick={(e) => {
                                                    // setTableArr([])
                                                    // setState((i) => {
                                                    //     let a = { ...i }
                                                    //     a.values.ItemName = ""
                                                    //     a.values.InvoiceNumber = ""
                                                    //     return a
                                                    // })
                                                }} />

                                            }
                                        </Col>
                                    </FormGroup>
                                </Col >

                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.PartyType} </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="PartyType "
                                                name="PartyType"
                                                value={values.PartyType}
                                                isSearchable={true}
                                                options={PartyTypeOptions}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                onChange={partyTypeOnChange}

                                            />
                                            {isError.PartyType.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.PartyType}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.PriceList} </Label>
                                        <Col sm="7">

                                            <Input
                                                value={priceListSelect.label}
                                                autoComplete={"off"}
                                                placeholder="Select..."
                                                onClick={priceListOnClick}
                                            >
                                            </Input>

                                            <PriceDropOptions
                                                data={priceListByPartyType}
                                                priceList={priceListSelect}
                                                setPriceSelect={setPriceListSelect} />
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer} </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="Customer "
                                                name="Customer"
                                                value={values.Customer}
                                                isSearchable={true}
                                                options={customerOptions}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }

                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>
                        </div>

                        <div>
                            <ToolkitProvider
                                keyField={"id"}
                                data={tableData}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive table" style={{ minHeight: "60vh" }}>
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        id="table_Arrow"
                                                        classes={"table  table-bordered "}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Record Not available
                                                            </div>
                                                        }
                                                        onDataSizeChange={(e) => {
                                                            _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                        }}
                                                        {...toolkitProps.baseProps}
                                                    />
                                                </div>
                                            </Col>
                                            {mySearchProps(toolkitProps.searchProps,)}
                                        </Row>

                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        </div>

                    </form >

                    {/* {
                        tableData.length > 0 ?
                            <div style={{ marginLeft: '-35px' }}>
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"} >
                                        <SaveButton
                                            pageMode={mode.edit}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            module={"SalesReturn"}
                                        />

                                    </Col>
                                </FormGroup >
                            </div>
                            : null
                    } */}

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

export default DiscountMaster





