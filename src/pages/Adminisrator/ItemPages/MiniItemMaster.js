import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    CardBody,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table
} from 'reactstrap';
import Select from 'react-select';

import { C_Select, CInput, decimalRegx_3dit } from '../../../CustomValidateForm';
import { Breadcrumb_inputName, commonPageField, commonPageFieldSuccess, get_Category_By_CategoryType_ForDropDownAPI, get_CategoryTypes_ForDropDown, get_Group_By_GroupType_ForDropDown, get_Sub_Group_By_Group_ForDropDown, get_Sub_Group_By_Group_ForDropDown_Success, getBaseUnit_ForDropDown, getCategoryTypelist, saveItemMasterAction, SaveItemMasterActionSuccess } from '../../../store/actions';
import { comAddPageFieldFunc, formValid, initialFiledFunc, onChangeSelect, onChangeText, resetFunction } from '../../../components/Common/validationFunction';
import { breadcrumbReturnFunc, btnIsDissablefunc, currentDate_ymd, getSettingBasedPartyTypeID, loginCompanyID, loginRoleID, loginSystemSetting, loginUserID, metaTagLabel } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { MetaTags } from 'react-meta-tags';
import { mode, pageId, url } from '../../../routes';
import { unitConversionInitial } from './ItemMaster/itemIndex';
import { GeneralMasterSubType } from '../../../store/Administrator/GeneralRedux/action';
import { priceListByPartyAction } from '../../../store/Administrator/PriceList/action';
import { getPartyListAPI } from '../../../store/Administrator/PartyRedux/action';
import { getPartyTypelist } from '../../../store/Administrator/PartyTypeRedux/action';

import { getGroupTypeslist } from '../../../store/Administrator/GroupTypeRedux/action';
import { Tbody, Thead } from 'react-super-responsive-table';
import { SaveButton } from '../../../components/Common/CommonButton';
import { saveMsgUseEffect } from '../../../components/Common/CommonUseEffect';
import { customAlert } from '../../../CustomAlert/ConfirmDialog';


const ItemMasterForm = (props) => {
    const dispatch = useDispatch();
    const history = useHistory()
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty("editValue")


    const fileds = {
        HSNCode: "",
        GST: "",
        MRP: "",
        Name: "",
        ShortName: "",
        ShelfLife: "",
        BaseUnitName: "",
        SAPItemCode: null,
        BarCode: '',
        Category: [],
        CategoryType: "",
        BrandName: [],
        Division: [],
        Tag: '',
        Sequence: '',
        IsCBMItem: false,
        isActive: true,
        IsSCM: false,
        IsMixItem: false,
        settable: [],
        BaseUnit: [],
        PartyType: { value: null, label: "All" }, // Default value for PartyType
        GroupType: { value: null, label: "Select" },
        SubGroup: { value: null, label: "Select" },
        Group: { value: null, label: "Select" },
        ItemShelfLife: [],

    }

    const [userPageAccessState, setUserAccState] = useState('');
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [baseUnit, setBaseUnit] = useState([]);


    const { values } = state;
    const { isError } = state;
    const { fieldLabel } = state;

    const {
        postMsg,
        CategoryTypeList,
        pageField,
        BaseUnit,
        userAccess,
        CategoryList,
        PartyTypes,
        GroupType, GroupList, SubGroupList, groupDropDownLoading, subgroupDropDownLoading, saveBtnloading,
    } = useSelector((state) => ({
        PartyTypes: state.PartyTypeReducer.ListData,
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        CategoryList: state.ItemMastersReducer.Category,
        CategoryTypeList: state.categoryTypeReducer.categoryTypeListData,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        postMsg: state.ItemMastersReducer.postMsg,

        saveBtnloading: state.ItemMastersReducer.saveBtnloading,
        GroupType: state.GroupTypeReducer.GroupType,
        GroupList: state.ItemMastersReducer.GroupList,
        SubGroupList: state.ItemMastersReducer.SubGroupList,
        groupDropDownLoading: state.ItemMastersReducer.groupDropDownLoading,
        subgroupDropDownLoading: state.ItemMastersReducer.subgroupDropDownLoading,

    }));


    useEffect(() => {

        dispatch(getCategoryTypelist());//Category tab
        dispatch(get_CategoryTypes_ForDropDown());
        dispatch(getPartyListAPI());
        dispatch(getBaseUnit_ForDropDown());

        dispatch(getGroupTypeslist());//group Tab

        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 1
        });
        dispatch(GeneralMasterSubType(jsonBody));

    }, []);






    // useEffect(() => {
    //     if (postMsg.Status === true && postMsg.StatusCode === 200) {
    //         try {
    //             dispatch(SaveItemMasterActionSuccess({ Status: false }));
    //         } catch (error) {
    //             console.error("An error occurred while fetching:", error);
    //         }

    //         if (mode.dropdownAdd) {
    //             customAlert({
    //                 Type: 1,
    //                 Message: postMsg.Message,
    //             });
    //         } else {
    //             const promise = customAlert({
    //                 Type: 1,
    //                 Message: postMsg.Message,
    //             });

    //             if (promise) {
    //                 history.push({
    //                     pathname: url.ITEM_lIST,
    //                 });
    //             }
    //         }
    //     } else if (postMsg.Status === true) {
    //         dispatch(SaveItemMasterActionSuccess({ Status: false }));
    //         customAlert({
    //             Type: 4,
    //             Message: JSON.stringify(postMsg.Message),
    //         });
    //     }
    // }, [postMsg]);



    useEffect(() => saveMsgUseEffect({
        postMsg,
        history,
        dispatch,
        postSuccss: SaveItemMasterActionSuccess,
        resetFunc: { fileds, state, setState },
        listPath: url.ITEM_lIST
    }), [postMsg]);








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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        const page_Id = pageId.MINI_ITEM_MASTER;
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    // ********************************************************* Base Unit Dropdown Options  **********************************


    function BaseUnitOnchange(hasSelect, evn) {
        onChangeSelect({ hasSelect, evn, state, setState });

        const additionalUnits = [];

        if (hasSelect.value !== 1) {
            additionalUnits.push({ ...unitConversionInitial, Unit: { value: 1, label: 'No' }, Conversion: 1, IsBase: false, id: 2, IsShowUnit: true, });
        }
        if (hasSelect.value !== 2) {
            additionalUnits.push({ ...unitConversionInitial, Unit: { value: 2, label: 'Kg' }, Conversion: 1, IsBase: false, id: 3, IsShowUnit: true, });
        }
        if (hasSelect.value !== 4) {
            additionalUnits.push({ ...unitConversionInitial, Unit: { value: 4, label: 'Box' }, Conversion: 1, IsBase: false, id: 4, IsShowUnit: true, });
        }


        if (state.values.BaseUnitName?.value !== hasSelect.value) {
            const baseRow = {
                ...unitConversionInitial,
                IsBase: true,
                Conversion: 1,
                Unit: hasSelect,
                id: 1,
                IsShowUnit: true,
            };

            const newRows = [baseRow, ...additionalUnits];
            setBaseUnit(newRows);
        }
    }

    const BaseUnit_DropdownOptions = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));


    // ***********************************************************Category Type Dropdown Options*********************************

    const CategoryTypeList_DropdownOptions = CategoryTypeList.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const CategoryList_DropdownOptions = CategoryList.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    //*****************************************/ partyType Dropdown Options *************************************************

    useEffect(() => {
        dispatch(getPartyTypelist());
    }, []);

    useEffect(() => {
        if (PartyTypes.length === 1) {

            setState((i) => {
                let a = { ...i }
                a.values.PartyType = {
                    value: PartyTypes[0].id,
                    label: PartyTypes[0].Name
                }
                a.hasValid.valid = true;
                return a
            })
            dispatch(priceListByPartyAction(PartyTypes[0].id))
        }
    }, [PartyTypes])


    useEffect(() => {

        const PartyTypeID = getSettingBasedPartyTypeID(loginSystemSetting().PriceListSetting, loginRoleID())
        let PartyType = null
        if (PartyTypeID !== null) {
            PartyType = PartyTypes.find(i => (i.id === PartyTypeID))
        } else {
            PartyType = PartyTypes.find(i => (i.IsRetailer))
        }


    }, [PartyTypes, pageField])

    const PartyTypeDropdown_Options = PartyTypes.map((index) => ({
        value: index.id,
        label: index.Name,
        division: index.IsDivision,
        IsRetailer: index.IsRetailer
    }));

    PartyTypeDropdown_Options.unshift({ value: null, label: "All" });


    //********************************************** Group dropdwon***************************************/

    const GroupType_DropdownOptions = GroupType.map((index) => ({
        value: index.id,
        label: index.Name,
        IsReserved: index.IsReserved
    }));

    const Group_DropdownOptions = GroupList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const SubGroup_DropdownOptions = SubGroupList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));



    const GroupType_Handler = (hasSelect, evn,) => {

        onChangeSelect({ hasSelect, evn, state, setState })

        dispatch(get_Group_By_GroupType_ForDropDown(hasSelect.value));
        dispatch(get_Sub_Group_By_Group_ForDropDown_Success([]));



    };

    const Group_Handler = (hasSelect, evn,) => {
        onChangeSelect({ hasSelect, evn, state, setState })
        dispatch(get_Sub_Group_By_Group_ForDropDown(hasSelect.value))
        dispatch(get_Sub_Group_By_Group_ForDropDown_Success([]));


    };

    function CategoryType_Handler(hasSelect, evn,) {
        onChangeSelect({ hasSelect, evn, state, setState })
        dispatch(get_Category_By_CategoryType_ForDropDownAPI(hasSelect.value))

        setState((i) => {
            const a = { ...i }
            a.values.Category = [];
            a.hasValid.Category.valid = false
            return { ...a }
        })
    }


    //********************************************** table  ***************************************/


    const { settable, setFormValue } = props;

    function deleteRow_Handler(Id) {
        settable((prevTableData) => prevTableData.filter((row) => row.id !== Id));
    }


    function addRow_Handler() {
        const lastRow = baseUnit[baseUnit.length - 1];
        const newId = lastRow?.id + 1 || 1;

        const newRow = {
            ...unitConversionInitial,

            id: newId,
            isNew: true,  // <-- identify manually added rows
            IsShowUnit: true,
        };

        setBaseUnit((prev) => [...prev, newRow]);
    }

    function handleUnitChange(selectedOption, index) {
        const updated = [...baseUnit];
        updated[index].Unit = selectedOption;
        setBaseUnit(updated);
    }

    // **********************************************************************  ShowUnit_onChange  ****************************************

    function ShowUnit_onChange(checked, index) {
        setBaseUnit((prev) =>
            prev.map((row, i) =>
                i === index ? { ...row, IsShowUnit: checked } : row
            )
        );
    }


    // **********************************************************************  baseUnit2_onChange  ****************************************
    function baseUnit2_onChange(type, index) {
        setBaseUnit(prevTableData =>
            prevTableData.map((row, i) => {

                if (i === index) {
                    return {
                        ...row,
                        IsShowUnit: true,
                        [type]: true
                    };
                } else {

                    return {
                        ...row,
                        [type]: false
                    };
                }
            })
        );
    }

    function handleConversionChange(e, index) {
        const { value } = e.target;
        setBaseUnit(prev =>
            prev.map((row, i) => {
                if (i === index) {
                    return {
                        ...row,
                        Conversion: value
                    };
                }
                return row;
            })
        );
    }

    // **********************************************************************  SaveHandler  ****************************************



    // const SaveHandler = (event) => {
    //     debugger
    //     event.preventDefault();
    //     const btnId = event.target.id;
    //     btnIsDissablefunc({ btnId, state: true });

    //     const currentDate = currentDate_ymd;
    //     const Company = loginCompanyID();
    //     const CreatedBy = loginUserID();
    //     const UpdatedBy = loginUserID();
    //    debugger


    //     try {
    //         if (formValid(state, setState)) {

    //             const payload = {
    //                 Name: values.Name,
    //                 BarCode: values.BarCode,
    //                 BaseUnitID: values.BaseUnitName?.value,
    //                 ShelfLife: values.ShelfLife,
    //                 MRP: values.MRP,
    //                 HSNCode: values.HSNCode,
    //                 GST: values.GST,
    //                 CategoryType: values.CategoryType?.value,
    //                 Category: values.Category,
    //                 PartyType: values.PartyType?.value,

    //                 ShortName: values.Name,
    //                 SAPItemCode: null,

    //                 IsCBMItem: false,
    //                 isActive: true,
    //                 IsSCM: false,
    //                 IsMixItem: false,

    //                 Company: Company,
    //                 BrandName: "",
    //                 Tag: "",
    //                 Sequence: "",

    //                 CreatedBy: CreatedBy,
    //                 UpdatedBy: UpdatedBy,

    //                 Breadth: "",
    //                 Grammage: "",
    //                 Height: "",
    //                 Length: "",
    //                 StoringCondition: values.StoringCondition || "",

    //                 ItemCategoryDetails: [
    //                     {
    //                         CategoryType: values.CategoryType.value,
    //                         Category: values.Category.value,
    //                     }
    //                 ],

    //                 ItemUnitDetails: [
    //                     ...baseUnit.map((row, index) => {

    //                         return {
    //                             id: row.id,
    //                             BaseUnitQuantity: row.Conversion,
    //                             UnitID: row.Unit.value,
    //                             IsBase: row.IsBase,
    //                             SODefaultUnit: row.SOUnit,
    //                             PODefaultUnit: row.POUnit,
    //                             IsShowUnit: row.IsShowUnit,
    //                         };
    //                     })
    //                 ],
    //                 ItemImagesDetails: [],
    //                 ItemMRPDetails: [
    //                     {
    //                         Division: "",
    //                         DivisionName: "",
    //                         PartyName: "",
    //                         Party: "",
    //                         EffectiveDate:currentDate,
    //                         MRP: values.MRP,
    //                         PartyType: values.PartyType,
    //                         PartyTypeName: values.PartyType.label,
    //                         CreatedBy: CreatedBy,
    //                         UpdatedBy: UpdatedBy,
    //                         Company: Company,
    //                         IsDeleted: 0,
    //                         CommonID: 0,
    //                         IsAdd: true,
    //                         id: 1
    //                     }
    //                 ],
    //                 ItemMarginDetails: [],
    //                 ItemGSTHSNDetails: [
    //                     {
    //                         CommonID: 0,
    //                         Company: Company,
    //                         CreatedBy: CreatedBy,
    //                         EffectiveDate: currentDate,
    //                         GSTPercentage: values.GST,
    //                         HSNCode: values.HSNCode,
    //                         id: null,
    //                         IsAdd: true,
    //                         IsDeleted: 0,
    //                         UpdatedBy: UpdatedBy,
    //                     }],
    //                 ItemGroupDetails: [
    //                     {
    //                         Group: values.Group.value,
    //                         GroupName: values.Group.label,
    //                         GroupType: values.GroupType.value,
    //                         GroupTypeName: values.GroupType.label,
    //                         id: 1,
    //                         SubGroup: values.SubGroup.value,
    //                         SubGroupName: values.SubGroup.label,
    //                     }
    //                 ],
    //                 ItemShelfLife: [
    //                     {
    //                         Days: values.ShelfLife,
    //                         CreatedBy: CreatedBy,
    //                         UpdatedBy: UpdatedBy,
    //                         IsAdd: true
    //                     }
    //                 ],

    //                 ItemDivisionDetails: values.Division?.map(i => ({
    //                     Party: i.value
    //                 })) || []
    //             };

    //             const jsonBody = JSON.stringify(payload);

    //             dispatch(saveItemMasterAction({ jsonBody, btnId }));
    //         }
    //     } catch (e) {
    //         console.error("SaveHandler Error:", e);
    //         btnIsDissablefunc({ btnId, state: false });
    //     }
    // };


    const SaveHandler = (event) => {
        debugger
        event.preventDefault();
        const btnId = event.target.id;
        btnIsDissablefunc({ btnId, state: true });

        try {
            if (formValid(state, setState)) {


                const payload = {
                    Name: values.Name,
                    BarCode: values.BarCode,
                    BaseUnitID: values.BaseUnitName?.value,
                    ShelfLife: values.ShelfLife,
                    MRP: values.MRP,
                    HSNCode: values.HSNCode,
                    GST: values.GST,



                    ShortName: values.Name,
                    SAPItemCode: null,

                    IsCBMItem: false,
                    isActive: true,
                    IsSCM: false,
                    IsMixItem: false,

                    Company: loginCompanyID(),
                    BrandName: "",
                    Tag: "",
                    Sequence: "",

                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),

                    Breadth: "",
                    Grammage: "",
                    Height: "",
                    Length: "",
                    StoringCondition: values.StoringCondition || "",


                    ItemCategoryDetails: values.Category.map((index) => ({
                        CategoryType: values.CategoryType.value,
                        Category: index.value
                    })),

                    ItemUnitDetails: [
                        ...baseUnit.map((row, index) => {

                            return {
                                id: row.id,
                                BaseUnitQuantity: row.Conversion,
                                UnitID: row.Unit.value,
                                IsBase: row.IsBase,
                                SODefaultUnit: row.SOUnit,
                                PODefaultUnit: row.POUnit,
                                IsShowUnit: row.IsShowUnit,
                            };
                        })
                    ],

                    ItemImagesDetails: [],
                    ItemMRPDetails: [
                        {
                            Division: "",
                            DivisionName: "",
                            PartyName: "",
                            Party: "",
                            EffectiveDate: currentDate_ymd,
                            MRP: values.MRP,
                            PartyType: values.PartyType.value,
                            PartyTypeName: values.PartyType.label,
                            CreatedBy: loginUserID(),
                            UpdatedBy: loginUserID(),
                            Company: loginCompanyID(),
                            IsDeleted: 0,
                            CommonID: 0,
                            IsAdd: true,
                            id: 1
                        }
                    ],
                    ItemMarginDetails: [],
                    ItemGSTHSNDetails: [
                        {
                            CommonID: 0,
                            Company: loginCompanyID(),
                            CreatedBy: loginUserID(),
                            EffectiveDate: currentDate_ymd,
                            GSTPercentage: values.GST,
                            HSNCode: values.HSNCode,
                            id: null,
                            IsAdd: true,
                            IsDeleted: 0,
                            UpdatedBy: loginUserID(),
                        }],
                    ItemGroupDetails: [
                        {
                            Group: values.Group.value,
                            GroupName: values.Group.label,
                            GroupType: values.GroupType.value,
                            GroupTypeName: values.GroupType.label,
                            id: 1,
                            SubGroup: values.SubGroup.value,
                            SubGroupName: values.SubGroup.label,
                        }
                    ],
                    ItemShelfLife: [
                        {
                            Days: values.ShelfLife,
                            CreatedBy: loginUserID(),
                            UpdatedBy: loginUserID(),
                            IsAdd: true
                        }
                    ],

                    ItemDivisionDetails: values.Division?.map(i => ({
                        Party: i.value
                    })) || []
                };

                const jsonBody = JSON.stringify(payload);

                dispatch(saveItemMasterAction({ jsonBody, btnId }));
            }
        } catch (e) {
            console.error("SaveHandler Error:", e);
            btnIsDissablefunc({ btnId, state: false });
        }
    };





    // **********************************************************************  tbodyfunction  ****************************************
    const tbodyfunction = () => {

        return baseUnit.map((row, index, key) => (
            <tr key={row.id}>
                <td>
                    <Row>
                        <Label className="col-sm-2 col-form-label">{index + 1}</Label>
                        <Col md={7}>
                            <Select
                                isDisabled={!row.isNew} // only enable for new rows
                                placeholder="Select..."
                                value={row.Unit}
                                options={BaseUnit_DropdownOptions}
                                onChange={(selectedOption) => handleUnitChange(selectedOption, index)} // new function to handle manual change
                            />

                        </Col>
                    </Row>
                </td>
                <td>
                    <Row>
                        <Col>
                            <CInput
                                type="text"
                                placeholder="Enter conversion"
                                id={`txtConversion${index}`}
                                cpattern={decimalRegx_3dit}
                                autoComplete="off"
                                value={row.Conversion}
                                onChange={(e) => handleConversionChange(e, index)}
                            />
                        </Col>
                    </Row>
                </td>
                <td>
                    <Input
                        type="radio"
                        checked={row.POUnit}
                        onChange={() => baseUnit2_onChange("POUnit", index)}
                    />
                </td>

                <td>
                    <Input
                        type="radio"
                        checked={row.SOUnit}
                        onChange={() => baseUnit2_onChange("SOUnit", index)}
                    />
                </td>


                <td>
                    <Input
                        type="checkbox"
                        defaultChecked={row.IsShowUnit}
                        disabled={row.POUnit || row.SOUnit}  //  disable if PO or SO selected

                        onChange={(e) => ShowUnit_onChange(e.target.checked, index)}
                    />
                </td>

                <td>
                    <Row>
                        <Col md={6} className="mt-3" />
                        <Col md={6}>
                            {/* Show plus button only for the last row */}
                            {index === baseUnit.length - 1 && (
                                <Button
                                    style={{ marginLeft: "-0.6cm" }}
                                    className="button_add"
                                    color="btn btn-outline-primary border-2 font-size-12"
                                    type="button"
                                    onClick={() => addRow_Handler()}
                                >
                                    <i className="dripicons-plus"></i>
                                </Button>
                            )}

                        </Col>
                    </Row>
                    <i onClick={() => deleteRow_Handler(row.id)}></i>
                </td>
            </tr>
        ));
    };

    // ********************************************************************************************************

    return (
        <div className="page-content" >
            <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
            <Card>
                <CardBody>
                    <Row>
                        <Row className="d-flex align-items-start">
                            {/* LEFT SIDE */}
                            <Col md={6} className="d-flex flex-column">
                                <Card className="c_card_body p-3 h-100" style={{ flex: 1, height: '100%' }}>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="validationCustom01"> {fieldLabel.Name} </Label>

                                                <Input
                                                    type="text"
                                                    name="Name"
                                                    className="mb-1"
                                                    placeholder="Enter item name"
                                                    value={values.Name}
                                                    onChange={(event) => {
                                                        onChangeText({ event, state, setState })
                                                        dispatch(Breadcrumb_inputName(event.target.value))
                                                    }}
                                                />
                                                {isError.Name.length > 0 && (
                                                    <span className="text-danger f-8">
                                                        <small>{isError.Name}</small>
                                                    </span>
                                                )}
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="validationCustom01"> {fieldLabel.BarCode} </Label>
                                                <Input
                                                    type="text"
                                                    name="BarCode"
                                                    className="mb-1"
                                                    placeholder="Enter barcode"
                                                    value={values.BarCode}
                                                    onChange={(event) => {
                                                        onChangeText({ event, state, setState })

                                                    }}

                                                />
                                                {isError.BarCode.length > 0 && (
                                                    <span className="text-danger f-8">
                                                        <small>{isError.BarCode}</small>
                                                    </span>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="validationCustom01"> {fieldLabel.ShelfLife} </Label>
                                                <Input
                                                    type="text"
                                                    name="ShelfLife"
                                                    className="mb-1"
                                                    placeholder="Enter shelf life"
                                                    value={values.ShelfLife}
                                                    onChange={(event) => {
                                                        onChangeText({ event, state, setState })

                                                    }}
                                                />
                                                {isError.ShelfLife.length > 0 && (
                                                    <span className="text-danger f-8">
                                                        <small>{isError.ShelfLife}</small>
                                                    </span>
                                                )}
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="validationCustom01"> {fieldLabel.CategoryType} </Label>
                                                <Select
                                                    name="CategoryType"
                                                    value={values.CategoryType}
                                                    isSearchable
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={CategoryTypeList_DropdownOptions}
                                                    onChange={CategoryType_Handler}
                                                />
                                                {isError.CategoryType.length > 0 && (
                                                    <span className="text-danger f-8">
                                                        <small>{isError.CategoryType}</small>
                                                    </span>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                       

                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="validationCustom01"> {fieldLabel.Category} </Label>
                                                <Select
                                                    name="Category"
                                                    value={values.Category}
                                                    isMulti={true}
                                                    isSearchable
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={CategoryList_DropdownOptions}
                                                    onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                />
                                                {isError.Category.length > 0 && (
                                                    <span className="text-danger f-8">
                                                        <small>{isError.Category}</small>
                                                    </span>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Card>
                                <Card className="c_card_body p-3">
                                    <Row className="align-items-end">
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="validationCustom01"> {fieldLabel.PartyType} </Label>
                                                <Select
                                                    name="PartyType"
                                                    value={values.PartyType}
                                                    isSearchable
                                                    options={PartyTypeDropdown_Options}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                                    onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                />
                                                {isError.PartyType.length > 0 && (
                                                    <span className="text-danger f-8">
                                                        <small>{isError.PartyType}</small>
                                                    </span>
                                                )}
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="validationCustom01"> {fieldLabel.MRP} </Label>
                                                <Input
                                                    name="MRP"
                                                    type="text"
                                                    id="txtMRP0"
                                                    value={values.MRP}
                                                    placeholder="Please Enter MRP"
                                                    onChange={(event) => {
                                                        onChangeText({ event, state, setState })

                                                    }}
                                                />
                                                {isError.MRP.length > 0 && (
                                                    <span className="text-danger f-8">
                                                        <small>{isError.MRP}</small>
                                                    </span>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Card>

                                <Card className="c_card_body p-3">
                                    <Row className="align-items-end">
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="validationCustom01"> {fieldLabel.GST} </Label>
                                                <Input
                                                    name="GST"
                                                    type="text"
                                                    id="txtGST0"
                                                    value={values.GST}
                                                    placeholder="Please Enter GST"
                                                    autoComplete="off"
                                                    onChange={(event) => {
                                                        onChangeText({ event, state, setState })

                                                    }}
                                                />
                                                {isError.GST.length > 0 && (
                                                    <span className="text-danger f-8">
                                                        <small>{isError.GST}</small>
                                                    </span>
                                                )}
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="validationCustom01"> {fieldLabel.HSNCode} </Label>
                                                <Input
                                                    type="HSNCode"
                                                    name="HSNCode"
                                                    id="txtHSNCode0"
                                                    value={values.HSNCode}
                                                    placeholder="Please Enter HSNCode"
                                                    autoComplete="off"
                                                    onChange={(event) => {
                                                        onChangeText({ event, state, setState })

                                                    }}
                                                />
                                                {isError.HSNCode.length > 0 && (
                                                    <span className="text-danger f-8">
                                                        <small>{isError.HSNCode}</small>
                                                    </span>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                            {/* RIGHT SIDE */}
                            <Col md={6} className="d-flex flex-column">


                                <Row className="">

                                    <Card className="c_card_body p-3">


                                        <Row className="align-items-end">
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label htmlFor="validationCustom01"> {fieldLabel.GroupType} </Label>
                                                    <Select
                                                        name="GroupType"
                                                        value={values.GroupType}
                                                        options={GroupType_DropdownOptions}

                                                        onChange={GroupType_Handler}
                                                        styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                                    />
                                                    {isError.GroupType.length > 0 && (
                                                        <span className="text-danger f-8">
                                                            <small>{isError.GroupType}</small>
                                                        </span>
                                                    )}
                                                </FormGroup>
                                            </Col>

                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label htmlFor="validationCustom01"> {fieldLabel.Group} </Label>
                                                    <C_Select
                                                        name="Group"
                                                        value={values.Group}
                                                        options={Group_DropdownOptions}
                                                        onChange={Group_Handler}
                                                        isLoading={groupDropDownLoading}
                                                        styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                                    />
                                                    {isError.Group.length > 0 && (
                                                        <span className="text-danger f-8">
                                                            <small>{isError.Group}</small>
                                                        </span>
                                                    )}
                                                </FormGroup>
                                            </Col>

                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label htmlFor="validationCustom01"> {fieldLabel.SubGroup} </Label>
                                                    <C_Select
                                                        name="SubGroup"
                                                        value={values.SubGroup}
                                                        options={SubGroup_DropdownOptions}
                                                        isLoading={subgroupDropDownLoading}
                                                        onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                        styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                                    />
                                                    {isError.SubGroup.length > 0 && (
                                                        <span className="text-danger f-8">
                                                            <small>{isError.SubGroup}</small>
                                                        </span>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Card>

                                    <Card className="c_card_body p-3">
                                        <Col md={6}>
                                            <FormGroup className='m-2'>
                                                <Label htmlFor="validationCustom01"> {fieldLabel.BaseUnitName} </Label>
                                                <Select
                                                    name="BaseUnitName"
                                                    value={values.BaseUnitName}
                                                    isSearchable
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={BaseUnit_DropdownOptions}
                                                    onChange={BaseUnitOnchange}
                                                    styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                                />
                                                {isError.BaseUnitName.length > 0 && (
                                                    <span className="text-danger f-8">
                                                        <small>{isError.BaseUnitName}</small>
                                                    </span>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <div className="mt-2" style={{ overflowX: 'auto' }}>
                                            <Table className="table table-bordered mb-0">
                                                <Thead>
                                                    <tr>
                                                        <th className="col-sm-3">Unit Name</th>
                                                        <th className="col-sm-3 text-center">Conversion To Base Unit</th>
                                                        <th className="col-sm-1 text-center">PO Unit</th>
                                                        <th className="col-sm-1 text-center">SO Unit</th>
                                                        <th className="col-sm-1 text-center" style={{ width: "70px" }}>
                                                            Show Unit
                                                        </th>
                                                        <th className="col-sm-2">Action</th>
                                                    </tr>
                                                </Thead>
                                                <Tbody>
                                                    {baseUnit.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="6">
                                                                <div className="text-danger text-center">Unit Not available</div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        tbodyfunction()
                                                    )}
                                                </Tbody>
                                            </Table>
                                        </div>

                                    </Card>

                                </Row>


                            </Col>
                        </Row>

                        {/* GST SECTION */}

                        <SaveButton
                            loading={saveBtnloading}
                            pageMode={mode.defaultsave}
                            onClick={SaveHandler}
                            userAcc={userPageAccessState}

                            module={"Item"}
                        />

                    </Row>
                </CardBody>

            </Card >
        </div >
    );
};

export default ItemMasterForm;
