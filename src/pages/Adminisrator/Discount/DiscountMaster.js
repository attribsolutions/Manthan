// import React, { useEffect, useState } from "react";
// import {
//     Col,
//     FormGroup,
//     Label,
//     Input,
//     Row,

// } from "reactstrap";
// import { MetaTags } from "react-meta-tags";
// import { BreadcrumbShowCountlabel, GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess, Retailer_List, commonPageFieldSuccess } from "../../../store/actions";
// import { useDispatch, useSelector } from "react-redux";
// import { commonPageField } from "../../../store/actions";
// import { useHistory } from "react-router-dom";
// import {
//     comAddPageFieldFunc,
//     initialFiledFunc,
//     onChangeSelect,
//     resetFunction,

// } from "../../../components/Common/validationFunction";
// import { mode, pageId, url } from "../../../routes/index"
// import "../../Sale/SalesReturn/salesReturn.scss";
// import { CInput, C_DatePicker, C_Select, decimalRegx, floatRegx } from "../../../CustomValidateForm/index";
// import * as _cfunc from "../../../components/Common/CommonFunction";
// import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
// import BootstrapTable from "react-bootstrap-table-next";
// import ToolkitProvider from "react-bootstrap-table2-toolkit";
// import { Change_Button, C_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
// import { getPartyTypelist } from "../../../store/Administrator/PartyTypeRedux/action";
// import PriceDropOptions from "../PartyMaster/MasterAdd/FirstTab/PriceDropOptions";
// import { priceListByPartyAction } from "../../../store/Administrator/PriceList/action";
// import Select from "react-select";
// import { DiscountCustomer_Dropdown_Action, DiscountCustomer_Dropdown_Success, DiscountPartyType_Dropdown_Action, DiscountPartyType_Dropdown_Success, goBtnDiscountAddActionSuccess, saveDiscountAction, saveDiscountActionSuccess } from "../../../store/Administrator/DiscountRedux/actions";
// import { customAlert } from "../../../CustomAlert/ConfirmDialog";
// import { goBtnDiscountAddAction } from "../../../store/Administrator/DiscountRedux/actions";
// import { priceListByPartyActionSuccess } from "../../../store/Administrator/PriceList/action";

// const DiscountMaster = (props) => {

//     const dispatch = useDispatch();
//     const history = useHistory()
//     const currentDate_ymd = _cfunc.date_ymd_func();

//     const [pageMode] = useState(mode.defaultsave);
//     const [userPageAccessState, setUserAccState] = useState('');

//     const fileds = {
//         FromDate: currentDate_ymd,
//         ToDate: currentDate_ymd,
//         Partytype: "",
//         CustomerName: { value: "", label: "All" },
//         PriceListName: "",
//     }

//     const [state, setState] = useState(initialFiledFunc(fileds))
//     const [subPageMode] = useState(history.location.pathname)
//     const [priceListSelect, setPriceListSelect] = useState({ value: '' });
//     const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }])
//     const [changeAllDiscount, setChangeAllDiscount] = useState(false)
//     const [discountValueAll, setDiscountValueAll] = useState("");
//     const [discountTypeAll, setDiscountTypeAll] = useState({ value: 2, label: " % " });
//     const [forceReload, setForceReload] = useState(false)
//     const [customerDropdown, setCustomerDropdown] = useState([{ value: "", label: "All" }]);

//     const [tableData, setTableData] = useState([]);

//     //Access redux store Data /  'save_ModuleSuccess' action data

//     const {
//         gobtnDiscount_redux,
//         partyType_redux,
//         priceListByPartyType,
//         postMsg,
//         customer,
//         pageField,
//         userAccess,
//         goBtnLoading,
//         saveBtnloading,
//         partyTypeDropDownLoading,
//         customerDropDownLoading,
//     } = useSelector((state) => ({
//         gobtnDiscount_redux: state.DiscountReducer.gobtnDiscount_redux,
//         postMsg: state.DiscountReducer.postMsg,
//         partyType_redux: state.DiscountReducer.partyType,
//         priceListByPartyType: state.PriceListReducer.priceListByPartyType,
//         customer: state.DiscountReducer.customer,
//         userAccess: state.Login.RoleAccessUpdateData,
//         pageField: state.CommonPageFieldReducer.pageField,
//         goBtnLoading: state.DiscountReducer.goBtnLoading,
//         saveBtnloading: state.DiscountReducer.saveBtnloading,
//         partyTypeDropDownLoading: state.DiscountReducer.partyTypeDropDownLoading,
//         customerDropDownLoading: state.DiscountReducer.customerDropDownLoading
//     }));

//     useEffect(() => {
//         dispatch(commonPageFieldSuccess(null));
//         dispatch(commonPageField(pageId.DISCOUNT_MASTER))
//         dispatch(DiscountPartyType_Dropdown_Action())
//         dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))

//         const jsonBody = JSON.stringify({
//             Type: 1,
//             PartyID: _cfunc.loginPartyID(),
//             CompanyID: _cfunc.loginCompanyID()
//         });
//         dispatch(Retailer_List(jsonBody));

//         return () => {
//             dispatch(DiscountCustomer_Dropdown_Success([]));
//             dispatch(commonPageFieldSuccess(null));
//             dispatch(GetVenderSupplierCustomerSuccess([]));
//             dispatch(DiscountPartyType_Dropdown_Success([]));
//             dispatch(priceListByPartyActionSuccess([]));
//         }
//     }, []);

//     useEffect(() => {// userAccess useEffect
//         let userAcc = null;
//         let locationPath = location.pathname;
//         if (hasShowModal) {
//             locationPath = props.masterPath;
//         };
//         userAcc = userAccess.find((inx) => {
//             return (`/${inx.ActualPagePath}` === locationPath)
//         })
//         if (userAcc) {
//             setUserAccState(userAcc)
//             _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
//         };
//     }, [userAccess])

//     const location = { ...history.location }
//     const hasShowModal = props.hasOwnProperty(mode.editValue)

//     const values = { ...state.values }
//     const { isError } = state;
//     const { fieldLabel } = state;

//     useEffect(() => {
//         if (pageField) {
//             const fieldArr = pageField.PageFieldMaster
//             comAddPageFieldFunc({ state, setState, fieldArr })
//         }
//     }, [pageField])

//     useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [tableData]);

//     useEffect(async () => {
//         if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {

//             dispatch(saveDiscountActionSuccess({ Status: false }))
//             setTableData([])
//             setState(() => resetFunction(fileds, state))// Clear form values  
//             setPriceListSelect({ value: '', label: '' })
//             if (pageMode === mode.dropdownAdd) {
//                 customAlert({
//                     Type: 1,
//                     Message: postMsg.Message,
//                 })
//             }
//             else {
//                 let isPermission = await customAlert({
//                     Type: 1,
//                     Status: true,
//                     Message: postMsg.Message,
//                 })
//                 if (isPermission) {
//                     history.push({ pathname: url.DISCOUNT_LIST })
//                 }
//             }
//         }
//         else if (postMsg.Status === true) {
//             dispatch(saveDiscountActionSuccess({ Status: false }))
//             customAlert({
//                 Type: 4,
//                 Message: JSON.stringify(postMsg.Message),
//             })
//         }
//     }, [postMsg])

//     useEffect(() => {

//         if (gobtnDiscount_redux.Status === true) {
//             const { Data = [] } = gobtnDiscount_redux;
//             const UpdatedTableData = Data.map((item, index) => {
//                 return {
//                     ...item, tableId: index + 1,
//                     preDiscountValue: item.Discount,
//                 };
//             });
//             setTableData(UpdatedTableData);
//             dispatch(goBtnDiscountAddActionSuccess([]))
//         }
//     }, [gobtnDiscount_redux]);

//     useEffect(() => {
//         if (priceListSelect.value > 0) {
//             const config = {
//                 PartyID: _cfunc.loginPartyID(),
//                 PartyTypeID: values.Partytype.value,
//                 PricelistID: priceListSelect.value
//             }
//             dispatch(DiscountCustomer_Dropdown_Action(config))
//         }
//         setState((i) => {
//             const a = { ...i }
//             a.values.CustomerName = { value: "", label: "All" };
//             a.hasValid.CustomerName.valid = false
//             return a
//         })
//     }, [priceListSelect]);

//     const PartyTypeOptions = partyType_redux.map((i) => ({
//         value: i.id,
//         label: i.Name,
//     }));

//     const customerOptions = customer.map((index) => ({
//         value: index.id,
//         label: index.Name,
//     }));

//     customerOptions.unshift({ value: "", label: "All" });

//     const pagesListColumns = [
//         {
//             text: "Group Name",
//             dataField: "GroupName",
//         }, {
//             text: "Sub Group Name",
//             dataField: "SubGroupName",
//         },
//         {
//             text: "Item Name",
//             dataField: "ItemName",
//         },

//         {//*************** Discount Type ******************* */
//             text: "Discount Type",
//             formatExtraData: {
//                 discountValueAll: discountValueAll,
//                 discountTypeAll: discountTypeAll,
//                 changeAllDiscount: changeAllDiscount,
//                 forceReload: forceReload,
//                 tableList: tableData
//             },

//             headerFormatter: () => {
//                 return (
//                     <div className="row">
//                         {tableData.length <= 0 ?
//                             <div className="col col-5" style={{ marginTop: "10px" }}>
//                                 <Label>Discount Type</Label>
//                             </div>
//                             :
//                             <>
//                                 <div className="col col-5" style={{ marginTop: "10px" }} >
//                                     <Label >Discount Type</Label>
//                                 </div>
//                                 <div className="col col-6" >
//                                     <Select
//                                         type="text"
//                                         defaultValue={discountTypeAll}
//                                         classNamePrefix="select2-selection"
//                                         options={discountDropOption}
//                                         style={{ textAlign: "right" }}
//                                         onChange={(e) => {
//                                             setChangeAllDiscount(true);
//                                             setDiscountTypeAll(e);
//                                             setDiscountValueAll('');
//                                         }}
//                                     />
//                                 </div>
//                             </>
//                         }

//                     </div>
//                 );
//             },

//             formatter: (cellContent, index1, key, formatExtraData) => {
//                 let { tableList, discountValueAll, discountTypeAll } = formatExtraData;

//                 if (formatExtraData.changeAllDiscount) {
//                     index1["DiscountType"] = discountTypeAll.value;
//                 }
//                 if (!index1.DiscountType) { index1["DiscountType"] = discountTypeAll.value }

//                 const defaultDiscountTypelabel =
//                     index1.DiscountType === 1 ? discountDropOption[0] : discountDropOption[1];

//                 return (
//                     <>
//                         <div className="mb-2">
//                             <div className="parent">

//                                 <div className="child">
//                                     <Select
//                                         id={`DicountType_${key}`}
//                                         classNamePrefix="select2-selection"
//                                         key={`DicountType_${key}-${index1.tableId}`}
//                                         value={defaultDiscountTypelabel}
//                                         options={discountDropOption}
//                                         isDisabled={(index1.RecordCount === 1) && true}
//                                         onChange={(e) => {

//                                             setChangeAllDiscount(false);
//                                             setForceReload(!forceReload);
//                                             index1.DiscountType = e.value;
//                                         }}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </>
//                 );
//             },
//             headerStyle: () => {
//                 return { width: '300px', };
//             }
//         },

//         {//***************  Discount ******************************* */
//             text: "Discount ",
//             formatExtraData: {
//                 discountValueAll: discountValueAll,
//                 discountTypeAll: discountTypeAll,
//                 changeAllDiscount: changeAllDiscount,
//                 forceReload: forceReload,
//                 tableList: tableData,
//             },
//             headerFormatter: () => {
//                 return (

//                     <div className="row">
//                         {tableData.length <= 0 ?
//                             <div className="col col-3" style={{ marginTop: "10px" }}>
//                                 <Label>Discount</Label>
//                             </div>
//                             :
//                             <>
//                                 <div className="col col-3" style={{ marginTop: "10px" }} >
//                                     <Label >Discount</Label>
//                                 </div>
//                                 <div className="col col-5" >
//                                     <CInput
//                                         type="text"
//                                         className="input"
//                                         autoComplete='off'
//                                         style={{ textAlign: "right" }}
//                                         cpattern={decimalRegx}
//                                         value={discountValueAll}
//                                         onChange={(e) => {
//                                             let e_val = Number(e.target.value);

//                                             // Check if discount type is "percentage"
//                                             if (discountTypeAll.value === 2) {// Discount type 2 represents "percentage"
//                                                 // Limit the input to the range of 0 to 100
//                                                 if (e_val > 100) {
//                                                     e.target.value = 100; // Set the input value to 100 if it exceeds 100
//                                                 } else if (!(e_val >= 0 && e_val < 100)) {
//                                                     e.target.value = ""; // Clear the input value if it is less than 0
//                                                 }
//                                             }
//                                             setChangeAllDiscount(true);
//                                             setDiscountValueAll(e.target.value);
//                                         }}
//                                     />
//                                 </div>
//                             </>
//                         }
//                     </div>

//                 );
//             },

//             classes: () => "invoice-discount-row",
//             formatter: (cellContent, index1, key, formatExtraData) => {

//                 let { tableList, discountValueAll, discountTypeAll, showMessage } = formatExtraData;

//                 if (formatExtraData.changeAllDiscount) {
//                     index1["Discount"] = discountValueAll;
//                     index1["DiscountType"] = discountTypeAll.value;
//                 }

//                 if (!index1.DiscountType) { index1.DiscountType = discountTypeAll.value }

//                 return (
//                     <>
//                         <div className="parent">
//                             <div className="child">
//                                 <CInput
//                                     className="input"
//                                     id={`Dicount_${key}-${index1.tableId}`}
//                                     style={{ textAlign: "right" }}
//                                     type="text"
//                                     disabled={(index1.RecordCount === 1) && true}
//                                     autoComplete='off'
//                                     value={index1.Discount}
//                                     cpattern={decimalRegx}
//                                     onChange={(e) => {
//                                         let e_val = Number(e.target.value);
//                                         // Check if discount type is "percentage"
//                                         if (index1.DiscountType === 2) { // Discount type 2 represents "percentage"
//                                             // Limit the input to the range of 0 to 100
//                                             if (e_val > 100) {
//                                                 e.target.value = 100; // Set the input value to 100 if it exceeds 100
//                                             } else if (!(e_val >= 0 && e_val < 100)) {
//                                                 e.target.value = ''; // Clear the input value if it is less than 0
//                                             }
//                                         }
//                                         index1.Discount = e.target.value;
//                                         setForceReload(!forceReload);
//                                         setChangeAllDiscount(false);
//                                     }}
//                                 />
//                                 {/* {((index1.Discount === null) && (index1.RecordCount === 1)) &&
//                                     <span className="text-danger f-8">
//                                         <small>This item is already discounted...!</small>
//                                     </span>
//                                 } */}
//                             </div>

//                         </div>
//                     </>
//                 );
//             },
//             headerStyle: () => {
//                 return { width: '300px', };
//             }
//         },
//     ];

//     const FromDate_Onchange = (e, date) => {
//         setState((i) => {
//             const a = { ...i }
//             a.values.FromDate = date;
//             a.hasValid.FromDate.valid = true
//             return a
//         })
//     }

//     const ToDate_Onchange = (e, date) => {
//         setState((i) => {
//             const a = { ...i }
//             a.values.ToDate = date;
//             a.hasValid.ToDate.valid = true
//             return a
//         })
//     }

//     const priceListOnClick = function () {

//         const hasNone = document.getElementById("price-drop").style;

//         if ((priceListByPartyType.length > 0)) {

//             if ((hasNone.display === "none") || (hasNone.display === "")) {
//                 hasNone.display = "block";
//             } else {
//                 hasNone.display = "none";
//             }
//         }
//     };

//     function partyTypeOnChange(hasSelect, evn) {
//         onChangeSelect({ hasSelect, evn, state, setState })
//         setPriceListSelect({ label: "", value: "" })
//         setState((i) => {
//             const a = { ...i }
//             a.values.CustomerName = { value: "", label: "All" };
//             a.hasValid.CustomerName.valid = false
//             return a
//         })
//         dispatch(priceListByPartyAction(hasSelect.value))
//     }

//     function CustomerTypeOnChange(e = []) {

//         if (e.length === 0) {
//             e = [{ value: "", label: "All" }]
//         } else {
//             e = e.filter(i => !(i.value === ''))
//         }
//         setCustomerDropdown(e)
//         setTableData([])
//     }

//     function goButtonHandler() {

//         
//         var isCustomerDropdown = ''
//         if (customerDropdown.length > 0) {
//             isCustomerDropdown = customerDropdown.filter(i => !(i.value === '')).map(obj => obj.value).join(',');
//         }

//         if (values.Partytype === '') {
//             customAlert({
//                 Type: 4,
//                 Message: "Select Party Type",
//             });
//             return;
//         }

//         else if (priceListSelect.value === '') {
//             customAlert({
//                 Type: 4,
//                 Message: "Select PriceList",
//             });
//             return;
//         }
//         
//         const jsonBody = JSON.stringify({
//             "FromDate": values.FromDate,
//             "ToDate": values.ToDate,
//             "Party": _cfunc.loginPartyID(),
//             "PartyType": values.Partytype.value,
//             "PriceList": priceListSelect.value,
//             "Customer": isCustomerDropdown === "" ? "" : isCustomerDropdown,
//         });
//         dispatch(goBtnDiscountAddAction({ jsonBody }))
//     }

//     const saveHandler = async (event) => {
//         event.preventDefault();
//         
//         try {
//             const filteredDiscounts = tableData.reduce((filteredDiscountTable, currentValue) => {
//                 if (currentValue.Discount > 0) {
//                     customerDropdown.forEach(index => {
//                         
//                         filteredDiscountTable.push({
//                             "FromDate": values.FromDate,
//                             "ToDate": values.ToDate,
//                             "DiscountType": currentValue.DiscountType,
//                             "Discount": currentValue.Discount,
//                             "PartyType": values.Partytype.value,
//                             "PriceList": priceListSelect.value,
//                             "Customer": index.value === "" ? "" : index.value,
//                             "Item": currentValue.ItemID,
//                             "Party": _cfunc.loginPartyID(),
//                             "CreatedBy": _cfunc.loginUserID(),
//                             "UpdatedBy": _cfunc.loginUserID(),
//                             "id": currentValue.id
//                         });
//                     });

//                 }

//                 return filteredDiscountTable;
//             }, []);


//             const Find = filteredDiscounts.filter((index) => {   // condition for Discount save without 0
//                 return ((index.Discount > 0) && (index.id === null))
//             })
//             if ((Find.length === 0)) {
//                 customAlert({
//                     Type: 4,
//                     Message: "Please Enter One Item Discount",
//                 });
//                 return;
//             }
//             const jsonBody = JSON.stringify(Find);

//             if (pageMode === mode.edit) {
//                 // dispatch(updateDiscountID({ jsonBody, updateId: editVal.id, gotoInvoiceMode }))

//             } else {

//                 dispatch(saveDiscountAction({ jsonBody }))
//             }
//         } catch (error) {
//             _cfunc.CommonConsole("dicount_Save", error);
//         }
//     }

//     if (!(userPageAccessState === '')) {
//         return (
//             <React.Fragment>
//                 <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

//                 <div className="page-content" >

//                     <form noValidate>
//                         <div className="px-2 c_card_filter header text-black mb-1" >

//                             <Row>
//                                 <Col sm="6">
//                                     <FormGroup className="row mt-2" >
//                                         <Label className="col-sm-1 p-2"
//                                             style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.FromDate}  </Label>
//                                         <Col sm="7">
//                                             <C_DatePicker
//                                                 name='FromDate'
//                                                 disabled={(tableData.length > 0) && true}
//                                                 value={values.FromDate}
//                                                 onChange={FromDate_Onchange}
//                                             />
//                                         </Col>
//                                     </FormGroup>
//                                 </Col >

//                                 <Col sm="6">
//                                     <FormGroup className="row mt-2" >
//                                         <Label className="col-sm-1 p-2"
//                                             style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ToDate}  </Label>
//                                         <Col sm="7">
//                                             <C_DatePicker
//                                                 name='ToDate'
//                                                 disabled={(tableData.length > 0) && true}
//                                                 value={values.ToDate}
//                                                 onChange={ToDate_Onchange}
//                                             />
//                                         </Col>

//                                     </FormGroup>
//                                 </Col >

//                             </Row>

//                             <Row>
//                                 <Col sm="6">
//                                     <FormGroup className=" row mt-2 " >
//                                         <Label className="col-sm-1 p-2"
//                                             style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Partytype} </Label>
//                                         <Col sm="7">
//                                             <C_Select
//                                                 id="Partytype "
//                                                 name="Partytype"
//                                                 value={values.Partytype}
//                                                 isDisabled={(tableData.length > 0) && true}
//                                                 isSearchable={true}
//                                                 options={PartyTypeOptions}
//                                                 isLoading={partyTypeDropDownLoading}
//                                                 styles={{
//                                                     menu: provided => ({ ...provided, zIndex: 2 })
//                                                 }}
//                                                 onChange={partyTypeOnChange}
//                                             />
//                                         </Col>
//                                     </FormGroup>
//                                 </Col >




//                                 <Col sm="6">
//                                     <FormGroup className=" row mt-2 " >
//                                         <Label className="col-sm-1 p-2"
//                                             style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.PriceListName} </Label>
//                                         <Col sm="7">

//                                             <Input
//                                                 value={priceListSelect.label}
//                                                 disabled={(tableData.length > 0) && true}
//                                                 autoComplete={"off"}
//                                                 placeholder="Select..."
//                                                 onClick={priceListOnClick}
//                                             >
//                                             </Input>

//                                             <PriceDropOptions
//                                                 data={priceListByPartyType}
//                                                 priceList={priceListSelect}
//                                                 setPriceSelect={setPriceListSelect} />
//                                         </Col>
//                                     </FormGroup>
//                                 </Col >
//                             </Row>

//                             <Row>


//                                 <Col sm={6} className="">
//                                     <FormGroup className="mb- row mt-2" >
//                                         <Label className="col-sm-1 p-2"
//                                             style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.CustomerName}</Label>
//                                         <Col sm="7">
//                                             <C_Select
//                                                 id="CustomerName "
//                                                 name="CustomerName"
//                                                 value={customerDropdown}
//                                                 isSearchable={true}
//                                                 isMulti={true}
//                                                 isLoading={customerDropDownLoading}
//                                                 className="react-dropdown"
//                                                 classNamePrefix="dropdown"
//                                                 styles={{
//                                                     menu: provided => ({ ...provided, zIndex: 2 })
//                                                 }}
//                                                 options={customerOptions}
//                                                 onChange={CustomerTypeOnChange}
//                                             />
//                                         </Col>
//                                     </FormGroup>
//                                 </Col>


//                                 <Col md={4}> </Col>

//                                 <Col sm="1" className="mx-6 mt-1 ">
//                                     {!tableData.length > 0 ?
//                                         <Go_Button
//                                             loading={goBtnLoading}
//                                             onClick={goButtonHandler}>
//                                         </Go_Button>
//                                         :
//                                         <Change_Button
//                                             onClick={(e) => setTableData([])}
//                                         />
//                                     }
//                                 </Col>
//                             </Row>
//                         </div>

//                         <div>
//                             <ToolkitProvider
//                                 keyField={"tableId"}
//                                 data={tableData}
//                                 columns={pagesListColumns}
//                                 search
//                             >

//                                 {(toolkitProps) => (
//                                     <React.Fragment>
//                                         <Row>
//                                             <Col xl="12">
//                                                 <div className="table-responsive table" style={{ minHeight: "60vh" }}>
//                                                     <BootstrapTable
//                                                         keyField={"tableId"}
//                                                         id="table_Arrow"
//                                                         classes={"table  table-bordered "}
//                                                         noDataIndication={
//                                                             <div className="text-danger text-center ">
//                                                                 Record Not available
//                                                             </div>
//                                                         }
//                                                         onDataSizeChange={(e) => {
//                                                             _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
//                                                         }}
//                                                         {...toolkitProps.baseProps}
//                                                     />
//                                                 </div>
//                                             </Col>
//                                             {mySearchProps(toolkitProps.searchProps,)}
//                                         </Row>

//                                     </React.Fragment>
//                                 )}
//                             </ToolkitProvider>
//                         </div>

//                     </form >

//                     {
//                         (tableData.length > 0) &&
//                         <div className="row save1" >
//                             <SaveButton
//                                 loading={saveBtnloading}
//                                 editCreatedBy={"editCreatedBy"}
//                                 pageMode={pageMode}
//                                 userAcc={userPageAccessState}
//                                 onClick={saveHandler}
//                             // forceDisabled={goBtnloading}
//                             />

//                         </div>
//                     }

//                 </div >
//             </React.Fragment >
//         );
//     }
//     else {
//         return (
//             <React.Fragment></React.Fragment>
//         )
//     }
// };

// export default DiscountMaster



import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,

} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess, Retailer_List, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeSelect,
    resetFunction,

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
import { DiscountCustomer_Dropdown_Action, DiscountCustomer_Dropdown_Success, DiscountPartyType_Dropdown_Action, DiscountPartyType_Dropdown_Success, goBtnDiscountAddActionSuccess, saveDiscountAction, saveDiscountActionSuccess } from "../../../store/Administrator/DiscountRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { goBtnDiscountAddAction } from "../../../store/Administrator/DiscountRedux/actions";
import { priceListByPartyActionSuccess } from "../../../store/Administrator/PriceList/action";

const DiscountMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Partytype: "",
        CustomerName: { value: "", label: "All" },
        PriceListName: "",
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [subPageMode] = useState(history.location.pathname)
    const [priceListSelect, setPriceListSelect] = useState({ value: '' });
    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }])
    const [changeAllDiscount, setChangeAllDiscount] = useState(false)
    const [discountValueAll, setDiscountValueAll] = useState("");
    const [discountTypeAll, setDiscountTypeAll] = useState({ value: 2, label: " % " });
    const [forceReload, setForceReload] = useState(false)
    const [tableData, setTableData] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data

    const {
        gobtnDiscount_redux,
        partyType_redux,
        priceListByPartyType,
        postMsg,
        customer,
        pageField,
        userAccess,
        goBtnLoading,
        saveBtnloading,
        partyTypeDropDownLoading,
        customerDropDownLoading,
    } = useSelector((state) => ({
        gobtnDiscount_redux: state.DiscountReducer.gobtnDiscount_redux,
        postMsg: state.DiscountReducer.postMsg,
        partyType_redux: state.DiscountReducer.partyType,
        priceListByPartyType: state.PriceListReducer.priceListByPartyType,
        customer: state.DiscountReducer.customer,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        goBtnLoading: state.DiscountReducer.goBtnLoading,
        saveBtnloading: state.DiscountReducer.saveBtnloading,
        partyTypeDropDownLoading: state.DiscountReducer.partyTypeDropDownLoading,
        customerDropDownLoading: state.DiscountReducer.customerDropDownLoading
    }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.DISCOUNT_MASTER))
        dispatch(DiscountPartyType_Dropdown_Action())
        dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))

        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));

        return () => {
            dispatch(DiscountCustomer_Dropdown_Success([]));
            dispatch(commonPageFieldSuccess(null));
            dispatch(GetVenderSupplierCustomerSuccess([]));
            dispatch(DiscountPartyType_Dropdown_Success([]));
            dispatch(priceListByPartyActionSuccess([]));
        }
    }, []);

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

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [tableData]);

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {

            dispatch(saveDiscountActionSuccess({ Status: false }))
            setTableData([])
            setState(() => resetFunction(fileds, state))// Clear form values  
            setPriceListSelect({ value: '', label: '' })
            if (pageMode === mode.dropdownAdd) {
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
                    history.push({ pathname: url.DISCOUNT_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveDiscountActionSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if (gobtnDiscount_redux.Status === true) {
            const { Data = [] } = gobtnDiscount_redux;
            const UpdatedTableData = Data.map((item, index) => {
                return {
                    ...item, tableId: index + 1,
                    preDiscountValue: item.Discount,
                };
            });
            setTableData(UpdatedTableData);
            dispatch(goBtnDiscountAddActionSuccess([]))
        }
    }, [gobtnDiscount_redux]);

    useEffect(() => {
        if (priceListSelect.value > 0) {
            const config = {
                PartyID: _cfunc.loginPartyID(),
                PartyTypeID: values.Partytype.value,
                PricelistID: priceListSelect.value
            }
            dispatch(DiscountCustomer_Dropdown_Action(config))
        }
        setState((i) => {
            const a = { ...i }
            a.values.CustomerName = { value: "", label: "All" };
            a.hasValid.CustomerName.valid = false
            return a
        })
    }, [priceListSelect]);

    const PartyTypeOptions = partyType_redux.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const customerOptions = customer.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    customerOptions.unshift({ value: "", label: "All" });

    const pagesListColumns = [
        {
            text: "Group Name",
            dataField: "GroupName",
        }, {
            text: "Sub Group Name",
            dataField: "SubGroupName",
        },
        {
            text: "Item Name",
            dataField: "ItemName",
        },

        {//*************** Discount Type ******************* */
            text: "Discount Type",
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
                        {tableData.length <= 0 ?
                            <div className="col col-5" style={{ marginTop: "10px" }}>
                                <Label>Discount Type</Label>
                            </div>
                            :
                            <>
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
                            </>
                        }

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
                                        key={`DicountType_${key}-${index1.tableId}`}
                                        value={defaultDiscountTypelabel}
                                        options={discountDropOption}
                                        isDisabled={(index1.RecordCount === 1) && true}
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
            text: "Discount ",
            formatExtraData: {
                discountValueAll: discountValueAll,
                discountTypeAll: discountTypeAll,
                changeAllDiscount: changeAllDiscount,
                forceReload: forceReload,
                tableList: tableData,
            },
            headerFormatter: () => {
                return (

                    <div className="row">
                        {tableData.length <= 0 ?
                            <div className="col col-3" style={{ marginTop: "10px" }}>
                                <Label>Discount</Label>
                            </div>
                            :
                            <>
                                <div className="col col-3" style={{ marginTop: "10px" }} >
                                    <Label >Discount</Label>
                                </div>
                                <div className="col col-5" >
                                    <CInput
                                        type="text"
                                        className="input"
                                        autoComplete='off'
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
                            </>
                        }
                    </div>

                );
            },

            classes: () => "invoice-discount-row",
            formatter: (cellContent, index1, key, formatExtraData) => {

                let { tableList, discountValueAll, discountTypeAll, showMessage } = formatExtraData;

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
                                    id={`Dicount_${key}-${index1.tableId}`}
                                    style={{ textAlign: "right" }}
                                    type="text"
                                    disabled={(index1.RecordCount === 1) && true}
                                    autoComplete='off'
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
                                {/* {((index1.Discount === null) && (index1.RecordCount === 1)) &&
                                    <span className="text-danger f-8">
                                        <small>This item is already discounted...!</small>
                                    </span>
                                } */}
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
        setPriceListSelect({ label: "", value: "" })
        setState((i) => {
            const a = { ...i }
            a.values.CustomerName = { value: "", label: "All" };
            a.hasValid.CustomerName.valid = false
            return a
        })
        dispatch(priceListByPartyAction(hasSelect.value))
    }

    function goButtonHandler() {

        if (values.Partytype === '') {
            customAlert({
                Type: 4,
                Message: "Select Party Type",
            });
            return;
        }

        else if (priceListSelect.value === '') {
            customAlert({
                Type: 4,
                Message: "Select PriceList",
            });
            return;
        }

        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Party": _cfunc.loginPartyID(),
            "PartyType": values.Partytype.value,
            "PriceList": priceListSelect.value,
            "Customer": values.CustomerName === "" ? "" : values.CustomerName.value,
        });
        dispatch(goBtnDiscountAddAction({ jsonBody }))
    }

    const saveHandler = async (event) => {
        event.preventDefault();

        try {
            const filteredDiscounts = tableData.reduce((filteredDiscountTable, currentValue) => {
                if (currentValue.Discount > 0) {
                    filteredDiscountTable.push({
                        "FromDate": values.FromDate,
                        "ToDate": values.ToDate,
                        "DiscountType": currentValue.DiscountType,
                        "Discount": currentValue.Discount,
                        "PartyType": values.Partytype.value,
                        "PriceList": priceListSelect.value,
                        "Customer": values.CustomerName === "" ? "" : values.CustomerName.value,
                        "Item": currentValue.ItemID,
                        "Party": _cfunc.loginPartyID(),
                        "CreatedBy": _cfunc.loginUserID(),
                        "UpdatedBy": _cfunc.loginUserID(),
                        "id": currentValue.id
                    });
                }
                return filteredDiscountTable;
            }, []);


            const Find = filteredDiscounts.filter((index) => {   // condition for margin save without 0
                return ((index.Discount > 0) && (index.id === null))
            })
            if ((Find.length === 0)) {
                customAlert({
                    Type: 4,
                    Message: "Please Enter One Item Discount",
                });
                return;
            }
            const jsonBody = JSON.stringify(Find);

            if (pageMode === mode.edit) {
                // dispatch(updateDiscountID({ jsonBody, updateId: editVal.id, gotoInvoiceMode }))

            } else {

                dispatch(saveDiscountAction({ jsonBody }))
            }
        } catch (error) {
            _cfunc.CommonConsole("dicount_Save", error);
        }
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

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
                                                disabled={(tableData.length > 0) && true}
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
                                                disabled={(tableData.length > 0) && true}
                                                value={values.ToDate}
                                                onChange={ToDate_Onchange}
                                            />
                                        </Col>

                                    </FormGroup>
                                </Col >

                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Partytype} </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="Partytype "
                                                name="Partytype"
                                                value={values.Partytype}
                                                isDisabled={(tableData.length > 0) && true}
                                                isSearchable={true}
                                                options={PartyTypeOptions}
                                                isLoading={partyTypeDropDownLoading}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                onChange={partyTypeOnChange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.PriceListName} </Label>
                                        <Col sm="7">

                                            <Input
                                                value={priceListSelect.label}
                                                disabled={(tableData.length > 0) && true}
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
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.CustomerName} </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="CustomerName "
                                                name="CustomerName"
                                                value={values.CustomerName}
                                                isDisabled={(tableData.length > 0) && true}
                                                isSearchable={true}
                                                isLoading={customerDropDownLoading}
                                                options={customerOptions}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />

                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col md={4}> </Col>

                                <Col sm="1" className="mx-6 mt-1 ">
                                    {!tableData.length > 0 ?
                                        <Go_Button
                                            loading={goBtnLoading}
                                            onClick={goButtonHandler}>
                                        </Go_Button>
                                        :
                                        <Change_Button
                                            onClick={(e) => setTableData([])}
                                        />
                                    }
                                </Col>
                            </Row>
                        </div>

                        <div>
                            <ToolkitProvider
                                keyField={"tableId"}
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
                                                        keyField={"tableId"}
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

                    {
                        (tableData.length > 0) &&
                        <div className="row save1" >
                            <SaveButton
                                loading={saveBtnloading}
                                editCreatedBy={"editCreatedBy"}
                                pageMode={pageMode}
                                userAcc={userPageAccessState}
                                onClick={saveHandler}
                            // forceDisabled={goBtnloading}
                            />

                        </div>
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

export default DiscountMaster



