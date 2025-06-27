// import React, { useEffect, useState } from "react";
// import {
//     Col,
//     FormGroup,
//     Input,
//     Label,
//     Row
// } from "reactstrap";
// import { MetaTags } from "react-meta-tags";
// import { Breadcrumb_inputName, commonPageFieldSuccess, getItemList } from "../../../../store/actions";
// import { useDispatch, useSelector } from "react-redux";
// import { commonPageField } from "../../../../store/actions";
// import { useHistory } from "react-router-dom";
// import {
//     comAddPageFieldFunc,
//     formValid,
//     initialFiledFunc,
//     onChangeDate,
//     onChangeSelect,
//     onChangeText,
//     resetFunction,
// } from "../../../../components/Common/validationFunction";
// import Select from "react-select";
// import { SaveButton } from "../../../../components/Common/CommonButton";
// import ItemTab from "./ItemQuantityTab";
// import {
//     editBOMListSuccess,
//     saveBOMMaster,
//     saveBOMMasterSuccess,
//     updateBOMList,
//     updateBOMListSuccess
// } from "../../../../store/Production/BOMRedux/action";
// import * as pageId from "../../../../routes//allPageID";
// import * as url from "../../../../routes/route_url";
// import * as mode from "../../../../routes/PageMode";
// import { C_DatePicker, C_Select } from "../../../../CustomValidateForm";
// import * as _cfunc from "../../../../components/Common/CommonFunction";
// import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
// import { alertMessages } from "../../../../components/Common/CommonErrorMsg/alertMsg";
// import SaveButtonDraggable from "../../../../components/Common/saveButtonDraggable";

// const BOMMaster = (props) => {

//     const dispatch = useDispatch();
//     const history = useHistory()
//     const currentDate_ymd = _cfunc.date_ymd_func();

//     const [EditData, setEditData] = useState({});
//     const [modalCss, setModalCss] = useState(false);
//     const [pageMode, setPageMode] = useState(mode.defaultsave);
//     const [userPageAccessState, setUserAccState] = useState('');
//     const [ItemTabDetails, setItemTabDetails] = useState([])
//     const [editCreatedBy, seteditCreatedBy] = useState("");
//     const [ItemUnitOptions, setItemUnitOptions] = useState([]);
//     const [ItemUnitOnEditData, setItemUnitOnEditData] = useState([]);

//     const fileds = {
//         id: "",
//         BomDate: currentDate_ymd,
//         ItemName: "",
//         EstimatedOutputQty: "",
//         UnitName: "",
//         Comment: "",
//         IsActive: true,
//         IsVDCItem: false,
//     }

//     const [state, setState] = useState(initialFiledFunc(fileds))

//     //Access redux store Data /  'save_ModuleSuccess' action data
//     const {
//         postMsg,
//         updateMsg,
//         pageField,
//         userAccess,
//         Items,
//         ItemListloading,
//         saveBtnloading
//     } = useSelector((state) => ({
//         saveBtnloading: state.BOMReducer.saveBtnloading,
//         postMsg: state.BOMReducer.PostData,
//         updateMsg: state.BOMReducer.updateMsg,
//         Items: state.ItemMastersReducer.ItemList,
//         ItemListloading: state.ItemMastersReducer.loading,
//         pageField: state.CommonPageFieldReducer.pageField,
//         userAccess: state.Login.RoleAccessUpdateData,
//     }));

//     useEffect(() => {
//         const page_Id = pageId.BIllOf_MATERIALS
//         dispatch(commonPageFieldSuccess(null));
//         dispatch(commonPageField(page_Id))
//         dispatch(getItemList())
//     }, []);

//     const location = { ...history.location }
//     const hasShowloction = location.hasOwnProperty(mode.editValue)
//     const hasShowModal = props.hasOwnProperty(mode.editValue)

//     const values = { ...state.values }
//     const { isError } = state;
//     const { fieldLabel } = state;

//     // userAccess useEffect
//     useEffect(() => {
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

//     //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
//     useEffect(() => {
//         if ((hasShowloction || hasShowModal)) {
//             let hasEditVal = null
//             if (hasShowloction) {
//                 setPageMode(location.pageMode)
//                 hasEditVal = location.editValue
//             }
//             else if (hasShowModal) {
//                 hasEditVal = props.editValue
//                 setPageMode(props.pageMode)
//                 setModalCss(true)
//             }

//             if (hasEditVal) {
//                 let ItemUnits = hasEditVal.ParentUnitDetails.map((data) => ({
//                     value: data.Unit,
//                     label: data.UnitName
//                 }))
//                 setItemUnitOnEditData(ItemUnits)
//                 // setItemUnitOptions(ItemUnits)
//                 setEditData(hasEditVal);
//                 const { id, BomDate, Item, ItemName, Unit, UnitName, EstimatedOutputQty, Comment, IsActive, IsVDCItem } = hasEditVal
//                 const { values, fieldLabel, hasValid, required, isError } = { ...state }
//                 hasValid.id.valid = true;
//                 hasValid.BomDate.valid = true;
//                 hasValid.ItemName.valid = true;
//                 hasValid.UnitName.valid = true;
//                 hasValid.EstimatedOutputQty.valid = true;
//                 hasValid.Comment.valid = true;
//                 hasValid.IsActive.valid = true;
//                 hasValid.IsVDCItem.valid = true;

//                 values.id = id
//                 values.BomDate = BomDate;
//                 values.EstimatedOutputQty = EstimatedOutputQty;
//                 values.Comment = Comment;
//                 values.IsActive = IsActive;
//                 values.ItemName = { label: ItemName, value: Item };
//                 values.UnitName = { label: UnitName, value: Unit };
//                 values.IsVDCItem = IsVDCItem;
//                 setItemTabDetails(hasEditVal.BOMItems)
//                 setState({ values, fieldLabel, hasValid, required, isError })
//                 dispatch(editBOMListSuccess({ Status: false }))
//                 dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
//                 seteditCreatedBy(hasEditVal.CreatedBy)
//             }
//         }
//     }, [])

//     useEffect(async () => {
//         if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
//             dispatch(saveBOMMasterSuccess({ Status: false }))
//             setState(() => resetFunction(fileds, state))// Clear form values  
//             setItemTabDetails([]);
//             dispatch(Breadcrumb_inputName(''))

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
//                     history.push({ pathname: url.BIllOf_MATERIALS_LIST })
//                 }
//             }
//         }
//         else if (postMsg.Status === true) {
//             dispatch(saveBOMMasterSuccess({ Status: false }))
//             customAlert({
//                 Type: 4,
//                 Message: JSON.stringify(postMsg.Message),
//             })
//         }
//     }, [postMsg])

//     useEffect(() => {

//         if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
//             // setState(() => resetFunction(fileds, state))// Clear form values  
//             history.push({
//                 pathname: url.BIllOf_MATERIALS_LIST,
//             })
//         } else if ((updateMsg.Status === true) && (updateMsg.StatusCode === 100) && !(modalCss)) {

//             dispatch(updateBOMListSuccess({ Status: false }));
//             customAlert({
//                 Type: 5,
//                 Status: true,
//                 Message: JSON.stringify(updateMsg.Message),
//                 // PermissionAction: SaveHandler(),
//             })

//             // if (altertResponse===true) {
//             //     SaveHandler()
//             // }
//         }
//         else if (updateMsg.Status === true && !modalCss) {
//             dispatch(updateBOMListSuccess({ Status: false }));

//             customAlert({
//                 Type: 3,
//                 Message: JSON.stringify(updateMsg.Message),
//             })
//         }
//     }, [updateMsg, modalCss]);

//     useEffect(() => {

//         if (pageField) {
//             const fieldArr = pageField.PageFieldMaster
//             comAddPageFieldFunc({ state, setState, fieldArr })
//         }
//     }, [pageField])

//     const ItemDropdown_Options = Items.map((index) => ({
//         value: index.id,
//         label: index.Name,
//     }));

//     // function PermissionFunction() {
//     //     
//     //     let event = { preventDefault: (e) => {  } }
//     //     SaveHandler(event)
//     // }

//     function Items_Dropdown_Handler(e) {

//         setItemTabDetails([])
//         let Item = Items.filter((index) => {
//             return index.id === e.value
//         })
//         let ItemUnits = Item[0]?.UnitDetails.map((data) => ({
//             value: data.UnitID,
//             label: data.UnitName
//         }))

//         setItemUnitOptions(ItemUnits)

//         setState((i) => {
//             i.values.UnitName = "";
//             i.hasValid.UnitName.valid = false
//             return i
//         })
//     }

//     const SaveHandler = async (event) => {

//         event.preventDefault();
//         const btnId = event.target.id
//         const BOMItems = ItemTabDetails.map((index) => ({
//             Item: index.Item,
//             Quantity: index.Quantity,
//             Unit: index.Unit
//         }))

//         try {
//             if (formValid(state, setState)) {

//                 _cfunc.btnIsDissablefunc({ btnId, state: true })
//                 let BOMrefID = 0
//                 if ((pageMode === mode.edit)) {
//                     BOMrefID = EditData.id
//                 };

//                 const jsonBody = JSON.stringify({
//                     BomDate: values.BomDate,
//                     EstimatedOutputQty: values.EstimatedOutputQty,
//                     Comment: values.Comment,
//                     IsActive: values.IsActive,
//                     Item: values.ItemName.value,
//                     Unit: values.UnitName.value,
//                     CreatedBy: _cfunc.loginUserID(),
//                     Company: _cfunc.loginCompanyID(),
//                     BOMItems: BOMItems,
//                     IsVDCItem: values.IsVDCItem,
//                     ReferenceBom: BOMrefID
//                 });
//                 if (BOMItems.length === 0) {
//                     customAlert({
//                         Type: 4,
//                         Status: true,
//                         Message: alertMessages.atLeastOneMaterialDataAddInTable,
//                         RedirectPath: false,
//                         PermissionAction: false,
//                     })

//                     return;
//                 }
//                 if (pageMode === mode.edit) {
//                     const isConfirmed = await customAlert({
//                         Type: 7,
//                         Message: "Do you want To Update Bill of Material",
//                     });
//                     if (isConfirmed) {
//                         dispatch(updateBOMList({ jsonBody, updateId: `${EditData.id}/${EditData.Company}`, btnId }));
//                     }
//                 }
//                 else {
//                     dispatch(saveBOMMaster({ jsonBody, btnId }));
//                 }
//             }
//         } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
//     };

//     if (!(userPageAccessState === '')) {
//         return (
//             <React.Fragment>
//                 <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
//                 <div className="page-content" style={{ marginBottom: "5cm" }}>

//                     <form noValidate>
//                         <div className="px-2 c_card_filter header text-black" >
//                             <div className=" row  ">
//                                 <Col sm="6">
//                                     <FormGroup className="mb-2 row mt-2  ">
//                                         <Label className="mt-2" style={{ width: "115px" }}>{fieldLabel.BomDate} </Label>
//                                         <Col sm="7">
//                                             <C_DatePicker
//                                                 options={{
//                                                     altInput: true,
//                                                     altFormat: "d-m-Y",
//                                                     dateFormat: "Y-m-d",
//                                                 }}
//                                                 name="BomDate"
//                                                 value={values.BomDate}
//                                                 disabled={pageMode === mode.edit ? true : false}
//                                                 onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
//                                             />
//                                             {isError.BomDate.length > 0 && (
//                                                 <span className="invalid-feedback">{isError.BomDate}</span>
//                                             )}
//                                         </Col>
//                                     </FormGroup>
//                                 </Col>

//                                 <Col sm="6">
//                                     <FormGroup className="mb-2 row mt-2 ">
//                                         <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.ItemName} </Label>
//                                         <Col sm={7}>
//                                             <C_Select
//                                                 name="ItemName"
//                                                 value={values.ItemName}
//                                                 isSearchable={true}
//                                                 className="react-dropdown"
//                                                 classNamePrefix="dropdown"
//                                                 styles={{
//                                                     menu: provided => ({ ...provided, zIndex: 2 })
//                                                 }}
//                                                 options={ItemDropdown_Options}
//                                                 isLoading={ItemListloading}
//                                                 onChange={(hasSelect, evn) => {
//                                                     onChangeSelect({ hasSelect, evn, state, setState });
//                                                     Items_Dropdown_Handler(hasSelect);
//                                                     dispatch(Breadcrumb_inputName(hasSelect.label))
//                                                 }
//                                                 }
//                                             />
//                                             {isError.ItemName.length > 0 && (
//                                                 <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
//                                             )}
//                                         </Col>
//                                     </FormGroup>
//                                 </Col>

//                                 <Col sm="6">
//                                     <FormGroup className="mb-2 row ">
//                                         <Label className="mt-2" style={{ width: "115px" }} >{fieldLabel.EstimatedOutputQty} </Label>
//                                         <Col sm="7">
//                                             <Input
//                                                 style={{ textAlign: "right" }}
//                                                 name="EstimatedOutputQty"
//                                                 value={values.EstimatedOutputQty}
//                                                 type="text"
//                                                 className={isError.EstimatedOutputQty.length > 0 ? "is-invalid form-control" : "form-control"}
//                                                 placeholder="Please Enter EstimatedOutputQty"
//                                                 autoComplete='off'
//                                                 onChange={(event) => {
//                                                     onChangeText({ event, state, setState })
//                                                 }}
//                                             />
//                                             {isError.EstimatedOutputQty.length > 0 && (
//                                                 <span className="invalid-feedback">{isError.EstimatedOutputQty}</span>
//                                             )}
//                                         </Col>
//                                     </FormGroup>
//                                 </Col>

//                                 <Col sm="6">
//                                     <FormGroup className="mb-2 row  ">
//                                         <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.UnitName} </Label>
//                                         <Col sm={7}>
//                                             <Select
//                                                 name="UnitName"
//                                                 value={values.UnitName}
//                                                 isSearchable={true}
//                                                 className="react-dropdown"
//                                                 classNamePrefix="dropdown"
//                                                 styles={{
//                                                     menu: provided => ({ ...provided, zIndex: 2 })
//                                                 }}
//                                                 options={pageMode === mode.edit ? ItemUnitOnEditData : ItemUnitOptions}
//                                                 onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
//                                             />
//                                             {isError.UnitName.length > 0 && (
//                                                 <span className="text-danger f-8"><small>{isError.UnitName}</small></span>
//                                             )}
//                                         </Col>
//                                     </FormGroup>
//                                 </Col>

//                                 <Col sm="6">
//                                     <FormGroup className="mb-2 row  ">
//                                         <Label className="mt-2" style={{ width: "115px" }} >{fieldLabel.Comment} </Label>
//                                         <Col sm="7">
//                                             <Input
//                                                 name="Comment"
//                                                 value={values.Comment}
//                                                 type="text"
//                                                 className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
//                                                 placeholder="Please Enter Comment"
//                                                 autoComplete='off'
//                                                 onChange={(event) => {
//                                                     onChangeText({ event, state, setState })
//                                                 }}
//                                             />
//                                             {isError.Comment.length > 0 && (
//                                                 <span className="invalid-feedback">{isError.Comment}</span>
//                                             )}
//                                         </Col>
//                                     </FormGroup>
//                                 </Col>

//                                 <Col sm="6">
//                                     <FormGroup className=" row ">
//                                         <Row className="justify-content-md-left">
//                                             <Label className="col-sm-6 col-form-label mt-2" style={{ width: "115px" }} >{fieldLabel.IsActive}</Label>
//                                             <Col md={7} style={{ marginTop: '10px' }} >

//                                                 <div className="form-check form-switch form-switch-md mb-3">
//                                                     <Input type="checkbox" className="form-check-input"
//                                                         checked={values.IsActive}
//                                                         name="IsActive"
//                                                         onChange={(e) => {
//                                                             setState((i) => {
//                                                                 const a = { ...i }
//                                                                 a.values.IsActive = e.target.checked;
//                                                                 return a
//                                                             })
//                                                         }}
//                                                     />
//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     </FormGroup>
//                                 </Col>

//                                 <Col sm="6">
//                                     <FormGroup className=" row ">
//                                         <Row className="justify-content-md-left">
//                                             <Label className="col-sm-6 col-form-label mt-2" style={{ width: "115px" }} >IsVDCItem</Label>
//                                             <Col md={7} style={{ marginTop: '10px' }} >

//                                                 <div className="form-check form-switch form-switch-md mb-3">
//                                                     <Input type="checkbox" className="form-check-input"
//                                                         checked={values.IsVDCItem}
//                                                         name="IsVDCItem"
//                                                         onChange={(e) => {
//                                                             setState((i) => {
//                                                                 const a = { ...i }
//                                                                 a.values.IsVDCItem = e.target.checked;
//                                                                 return a
//                                                             })
//                                                         }}
//                                                     />
//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     </FormGroup>
//                                 </Col>
//                             </div>
//                         </div>

//                         <div className="px-2 mb-1 mt-n3" style={{ marginRight: '-28px', marginLeft: "-8px" }}>
//                             <Row>
//                                 <Row className="mt-3">
//                                     <Col className=" col col-12">
//                                         <ItemTab tableData={ItemTabDetails} func={setItemTabDetails} />
//                                     </Col>
//                                 </Row>
//                             </Row>
//                         </div>
//                         <SaveButtonDraggable>
//                             <SaveButton pageMode={pageMode}
//                                 loading={saveBtnloading}
//                                 onClick={(event) => SaveHandler(event)}
//                                 userAcc={userPageAccessState}
//                                 editCreatedBy={editCreatedBy}
//                             />
//                         </SaveButtonDraggable>
//                     </form>
//                 </div>
//             </React.Fragment>
//         );
//     }
//     else {
//         return (
//             <React.Fragment></React.Fragment>
//         )
//     }
// };

// export default BOMMaster






















import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageFieldSuccess, getItemList } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
    resetFunction,
} from "../../../../components/Common/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../../components/Common/CommonButton";
import ItemTab from "./ItemQuantityTab";
import {
    editBOMListSuccess,
    saveBOMMaster,
    saveBOMMasterSuccess,
    updateBOMList,
    updateBOMListSuccess
} from "../../../../store/Production/BOMRedux/action";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import * as mode from "../../../../routes/PageMode";
import { C_DatePicker, C_Select } from "../../../../CustomValidateForm";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../../components/Common/CommonErrorMsg/alertMsg";
import SaveButtonDraggable from "../../../../components/Common/saveButtonDraggable";

const BOMMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [ItemTabDetails, setItemTabDetails] = useState([])
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [ItemUnitOptions, setItemUnitOptions] = useState([]);
    const [ItemUnitOnEditData, setItemUnitOnEditData] = useState([]);

    const fileds = {
        id: "",
        BomDate: currentDate_ymd,
        ItemName: "",
        EstimatedOutputQty: "",
        UnitName: "",
        Comment: "",
        IsActive: true,
        IsVDCItem: false,
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        Items,
        ItemListloading,
        saveBtnloading
    } = useSelector((state) => ({
        saveBtnloading: state.BOMReducer.saveBtnloading,
        postMsg: state.BOMReducer.PostData,
        updateMsg: state.BOMReducer.updateMsg,
        Items: state.ItemMastersReducer.ItemList,
        ItemListloading: state.ItemMastersReducer.loading,
        pageField: state.CommonPageFieldReducer.pageField,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    useEffect(() => {
        const page_Id = pageId.BIllOf_MATERIALS
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        const jsonBody = {
            ..._cfunc.loginJsonBody(),
            IsBOM: 1
        }
        dispatch(getItemList(jsonBody));
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
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

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        if ((hasShowloction || hasShowModal)) {
            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
                setModalCss(true)
            }

            if (hasEditVal) {
                let ItemUnits = hasEditVal.ParentUnitDetails.map((data) => ({
                    value: data.Unit,
                    label: data.UnitName
                }))
                setItemUnitOnEditData(ItemUnits)
                // setItemUnitOptions(ItemUnits)
                setEditData(hasEditVal);
                const { id, BomDate, Item, ItemName, Unit, UnitName, EstimatedOutputQty, Comment, IsActive, IsVDCItem } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                hasValid.id.valid = true;
                hasValid.BomDate.valid = true;
                hasValid.ItemName.valid = true;
                hasValid.UnitName.valid = true;
                hasValid.EstimatedOutputQty.valid = true;
                hasValid.Comment.valid = true;
                hasValid.IsActive.valid = true;
                hasValid.IsVDCItem.valid = true;

                values.id = id
                values.BomDate = BomDate;
                values.EstimatedOutputQty = EstimatedOutputQty;
                values.Comment = Comment;
                values.IsActive = IsActive;
                values.ItemName = { label: ItemName, value: Item };
                values.UnitName = { label: UnitName, value: Unit };
                values.IsVDCItem = IsVDCItem;
                setItemTabDetails(hasEditVal.BOMItems)
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(editBOMListSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, [])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveBOMMasterSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values  
            setItemTabDetails([]);
            dispatch(Breadcrumb_inputName(''))

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
                    history.push({ pathname: url.BIllOf_MATERIALS_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveBOMMasterSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            // setState(() => resetFunction(fileds, state))// Clear form values  
            history.push({
                pathname: url.BIllOf_MATERIALS_LIST,
            })
        } else if ((updateMsg.Status === true) && (updateMsg.StatusCode === 100) && !(modalCss)) {

            dispatch(updateBOMListSuccess({ Status: false }));
            customAlert({
                Type: 5,
                Status: true,
                Message: JSON.stringify(updateMsg.Message),
                // PermissionAction: SaveHandler(),
            })

            // if (altertResponse===true) {
            //     SaveHandler()
            // }
        }
        else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateBOMListSuccess({ Status: false }));

            customAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);

    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    // function PermissionFunction() {
    //     
    //     let event = { preventDefault: (e) => {  } }
    //     SaveHandler(event)
    // }

    function Items_Dropdown_Handler(e) {
        debugger
        setItemTabDetails([])
        let Item = Items.filter((index) => {
            return index.id === e.value
        })
        let ItemUnits = Item[0]?.UnitDetails.map((data) => ({
            value: data.UnitID,
            label: data.UnitName
        }))

        setItemUnitOptions(ItemUnits)

        setState((i) => {
            i.values.UnitName = "";
            i.hasValid.UnitName.valid = false
            return i
        })
    }

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id
        const BOMItems = ItemTabDetails.map((index) => ({
            Item: index.Item,
            Quantity: index.Quantity,
            Unit: index.Unit
        }))

        try {
            if (formValid(state, setState)) {

                _cfunc.btnIsDissablefunc({ btnId, state: true })
                let BOMrefID = 0
                if ((pageMode === mode.edit)) {
                    BOMrefID = EditData.id
                };

                const jsonBody = JSON.stringify({
                    BomDate: values.BomDate,
                    EstimatedOutputQty: values.EstimatedOutputQty,
                    Comment: values.Comment,
                    IsActive: values.IsActive,
                    Item: values.ItemName.value,
                    Unit: values.UnitName.value,
                    CreatedBy: _cfunc.loginUserID(),
                    Company: _cfunc.loginCompanyID(),
                    BOMItems: BOMItems,
                    IsVDCItem: values.IsVDCItem,
                    ReferenceBom: BOMrefID,
                    Party: _cfunc.loginPartyID()
                });
                if (BOMItems.length === 0) {
                    customAlert({
                        Type: 4,
                        Status: true,
                        Message: alertMessages.atLeastOneMaterialDataAddInTable,
                        RedirectPath: false,
                        PermissionAction: false,
                    })

                    return;
                }
                if (pageMode === mode.edit) {
                    const isConfirmed = await customAlert({
                        Type: 7,
                        Message: "Do you want To Update Bill of Material",
                    });
                    if (isConfirmed) {
                        dispatch(saveBOMMaster({ jsonBody, btnId }));  //Remove Update api And Call Save BIll of material Api changes As per backend ; 
                    }
                }
                else {
                    dispatch(saveBOMMaster({ jsonBody, btnId }));
                }
            }
        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black" >
                            <div className=" row  ">
                                <Col sm="4">
                                    <FormGroup className="mb-2 row mt-2  ">
                                        <Label className="mt-2" style={{ width: "115px" }}>{fieldLabel.BomDate} </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                                name="BomDate"
                                                value={values.BomDate}
                                                disabled={pageMode === mode.view || pageMode === mode.edit}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />
                                            {isError.BomDate.length > 0 && (
                                                <span className="invalid-feedback">{isError.BomDate}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="4">
                                    <FormGroup className="mb-2 row mt-2 ">
                                        <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.ItemName} </Label>
                                        <Col sm={7}>
                                            <C_Select
                                                name="ItemName"
                                                value={values.ItemName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                isDisabled={pageMode === mode.view}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={ItemDropdown_Options}
                                                isLoading={ItemListloading}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                    Items_Dropdown_Handler(hasSelect);
                                                    dispatch(Breadcrumb_inputName(hasSelect.label))
                                                }
                                                }
                                            />
                                            {isError.ItemName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="4">
                                    <FormGroup className="mb-2 row mt-2">
                                        <Label className="mt-2" style={{ width: "115px" }} >{fieldLabel.EstimatedOutputQty} </Label>
                                        <Col sm="7">
                                            <Input
                                                style={{ textAlign: "right" }}
                                                name="EstimatedOutputQty"
                                                value={values.EstimatedOutputQty}
                                                disabled={pageMode === mode.view}
                                                type="text"
                                                className={isError.EstimatedOutputQty.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter EstimatedOutputQty"
                                                autoComplete='off'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.EstimatedOutputQty.length > 0 && (
                                                <span className="invalid-feedback">{isError.EstimatedOutputQty}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="4">
                                    <FormGroup className="mb-2 row  ">
                                        <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.UnitName} </Label>
                                        <Col sm={7}>
                                            <Select
                                                name="UnitName"
                                                value={values.UnitName}
                                                isDisabled={pageMode === mode.view}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={pageMode === mode.edit ? ItemUnitOnEditData : ItemUnitOptions}
                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                            />
                                            {isError.UnitName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.UnitName}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="4">
                                    <FormGroup className="mb-2 row  ">
                                        <Label className="mt-2" style={{ width: "115px" }} >{fieldLabel.Comment} </Label>
                                        <Col sm="7">
                                            <Input
                                                name="Comment"
                                                value={values.Comment}
                                                type="text"
                                                disabled={pageMode === mode.view}
                                                className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Comment"
                                                autoComplete='off'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Comment.length > 0 && (
                                                <span className="invalid-feedback">{isError.Comment}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col sm="4">
                                    <Row>
                                        <Col sm="6" >
                                            <FormGroup className=" row ">
                                                <Row className="justify-content-md-left">
                                                    <Label className="col-sm-5 col-form-label mt-2" style={{ width: "115px" }} >{fieldLabel.IsActive}</Label>
                                                    <Col style={{ marginTop: '10px' }} >

                                                        <div className="form-check form-switch form-switch-md mb-3">
                                                            <Input type="checkbox" className="form-check-input"
                                                                checked={values.IsActive}
                                                                disabled={pageMode === mode.view}
                                                                name="IsActive"
                                                                onChange={(e) => {
                                                                    setState((i) => {
                                                                        const a = { ...i }
                                                                        a.values.IsActive = e.target.checked;
                                                                        return a
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        </Col>

                                        {_cfunc.IsSweetAndSnacksCompany() && <Col sm="6">
                                            <FormGroup className=" row ">
                                                <Row className="justify-content-md-left">
                                                    <Label className="col-sm-5 col-form-label mt-2" style={{ width: "100px" }} >Is VDC Item</Label>
                                                    <Col style={{ marginTop: '10px' }} >

                                                        <div className="form-check form-switch form-switch-md mb-3">
                                                            <Input type="checkbox" className="form-check-input"
                                                                checked={values.IsVDCItem}
                                                                disabled={pageMode === mode.view}
                                                                name="IsVDCItem"
                                                                onChange={(e) => {
                                                                    setState((i) => {
                                                                        const a = { ...i }
                                                                        a.values.IsVDCItem = e.target.checked;
                                                                        return a
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        </Col>}
                                    </Row>
                                </Col>
                            </div>
                        </div>

                        <div className="px-2 mb-1 mt-n3" style={{ marginRight: '-28px', marginLeft: "-8px" }}>
                            <Row>
                                <Row className="mt-3">
                                    <Col className=" col col-12">
                                        <ItemTab tableData={ItemTabDetails} func={setItemTabDetails} pageMode={pageMode} />
                                    </Col>
                                </Row>
                            </Row>
                        </div>
                        <SaveButtonDraggable>
                            <SaveButton pageMode={pageMode}
                                loading={saveBtnloading}
                                onClick={(event) => SaveHandler(event)}
                                userAcc={userPageAccessState}
                                editCreatedBy={editCreatedBy}
                            />
                        </SaveButtonDraggable>
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

export default BOMMaster

