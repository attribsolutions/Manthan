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
import DatePicker from 'react-flatpickr';
import { C_DatePicker, C_Select, CInput, decimalRegx_3dit } from '../../../CustomValidateForm';
import BootstrapTable from 'react-bootstrap-table-next';

import { commonPageField, commonPageFieldSuccess, get_Category_By_CategoryType_ForDropDownAPI, get_CategoryTypes_ForDropDown, get_Group_By_GroupType_ForDropDown, get_Sub_Group_By_Group_ForDropDown, get_Sub_Group_By_Group_ForDropDown_Success, getBaseUnit_ForDropDown, getCategoryTypelist } from '../../../store/actions';
import { comAddPageFieldFunc, initialFiledFunc, onChangeSelect } from '../../../components/Common/validationFunction';
import { breadcrumbReturnFunc, getSettingBasedPartyTypeID, loginCompanyID, loginRoleID, loginSystemSetting, metaTagLabel } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { MetaTags } from 'react-meta-tags';
import { pageId } from '../../../routes';
import { unitConversionInitial } from './ItemMaster/itemIndex';
import { GeneralMasterSubType } from '../../../store/Administrator/GeneralRedux/action';
import { priceListByPartyAction } from '../../../store/Administrator/PriceList/action';
import { getPartyListAPI } from '../../../store/Administrator/PartyRedux/action';
import { getPartyTypelist } from '../../../store/Administrator/PartyTypeRedux/action';
import { customAlert } from '../../../CustomAlert/ConfirmDialog';
import { getGroupTypeslist } from '../../../store/Administrator/GroupTypeRedux/action';
import { Tbody, Thead } from 'react-super-responsive-table';


const ItemMasterForm = (props) => {
    const dispatch = useDispatch();
    const history = useHistory()
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty("editValue")

    const fileds = {
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
    }
    const [formData, setFormData] = useState({
        name: '',
        barcode: '',
        shelfLife: null,
        baseUnit: null,
        categoryType: null,
        category: null,
    });
    const [userPageAccessState, setUserAccState] = useState('');
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [baseUnit, setBaseUnit] = useState([]);

    const [partyName, setPartyName] = useState("");
    const [MRP, setMRP] = useState("");

    const [HSNCode, setHSNCode] = useState('');
    const [GST, setGST] = useState('');

    const [PartyType, setPartyType] = useState({ value: null, label: "All" });
    const [priceListSelect, setPriceListSelect] = useState({ value: '' });

    const [rows, setRows] = useState([]);



    const [groupTypeDropdownSelect, setGroupTypeDropdownSelect] = useState("");
    const [groupDropdownSelect, setGroupDropdownSelect] = useState("");
    const [subGroupDropdownSelect, setSubGroupDropdownSelect] = useState("");

    const { values } = state;
    const { isError } = state;
    const { fieldLabel } = state;

    const {
        CategoryTypeList,
        pageField,
        BaseUnit,
        userAccess,
        CategoryList,
        PartyTypes,
        GroupType, GroupList, SubGroupList, groupDropDownLoading, subgroupDropDownLoading,
    } = useSelector((state) => ({
        PartyTypes: state.PartyTypeReducer.ListData,
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        CategoryList: state.ItemMastersReducer.Category,
        CategoryTypeList: state.categoryTypeReducer.categoryTypeListData,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,


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





    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (field, selectedOption) => {
        setFormData({ ...formData, [field]: selectedOption });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Data:", formData);
    };
    //********************************************************************************************************






    // ********************************************************* Base Unit Dropdown Options  **********************************



    function BaseUnitOnchange(hasSelect, evn) {
        onChangeSelect({ hasSelect, evn, state, setState });

        const additionalUnits = [];

        if (hasSelect.value !== 1) {
            additionalUnits.push({ ...unitConversionInitial, Unit: { value: 1, label: 'No' }, Conversion: 1, IsBase: false, id: 2, });
        }
        if (hasSelect.value !== 2) {
            additionalUnits.push({ ...unitConversionInitial, Unit: { value: 2, label: 'Kg' }, Conversion: 1, IsBase: false, id: 3, });
        }
        if (hasSelect.value !== 4) {
            additionalUnits.push({ ...unitConversionInitial, Unit: { value: 4, label: 'Box' }, Conversion: 1, IsBase: false, id: 4, });
        }


        if (state.values.BaseUnitName?.value !== hasSelect.value) {
            const baseRow = {
                ...unitConversionInitial,
                IsBase: true,
                Conversion: 1,
                Unit: hasSelect,
                id: 1,

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


    function partyTypeOnChange(hasSelect, evn) {

        onChangeSelect({ hasSelect, evn, state, setState })
        setPriceListSelect({ label: '' })
        dispatch(priceListByPartyAction(hasSelect.value))
    }
    function partyTypeOnChange(selectedOption) {
        setPartyType(selectedOption); // set selected value
        setPriceListSelect({ label: '' });
        // dispatch(priceListByPartyAction(selectedOption.value));
    }
    //********************************************** MRP ***************************************/
    const MRPHandler = (event) => {
        setMRP(event.target.value);
    };

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

    const GroupType_Handler = (event) => {
        setGroupTypeDropdownSelect(event);
        dispatch(get_Group_By_GroupType_ForDropDown(event.value));
        dispatch(get_Sub_Group_By_Group_ForDropDown_Success([]));
        setGroupDropdownSelect([]);
        setSubGroupDropdownSelect([]);
    };



    // const Group_Handler = (event) => {

    //     const found = props.tableData.find(element => {
    //         return element.Group == event.value
    //     });
    //     if (found == undefined) {
    //         setGroupDropdownSelect(event);
    //         dispatch(get_Sub_Group_By_Group_ForDropDown(event.value))
    //         setSubGroupDropdownSelect([]);
    //     }
    //     else {
    //         customAlert({
    //             Type: 4,
    //             Status: true,
    //             Message: `${event.label} Is Already Selected...!`,
    //         })
    //     }
    // };

    const Group_Handler = (event) => {
        setGroupDropdownSelect(event);
        dispatch(get_Sub_Group_By_Group_ForDropDown(event.value));
        setSubGroupDropdownSelect([]);
    };



    const SubGroup_Handler = (event) => {
        setSubGroupDropdownSelect(event);
    };

    //********************************************** table  ***************************************/
    const TableData = [];
    // const {  formValue={}, TableData = [] } = props.state;

    const { settable, setFormValue } = props;

    function deleteRow_Handler(Id) {
        settable((prevTableData) => prevTableData.filter((row) => row.id !== Id));
    }

    // Add new row handler
    // function addRow_Handler(ID) {
    //     let newRow = { ...unitConversionInitial, id: ID + 1 };
    //     settable((prevTableData) => [...prevTableData, newRow]);
    // }

    function addRow_Handler() {
        const lastRow = baseUnit[baseUnit.length - 1];
        const newId = lastRow?.id + 1 || 1;

        const newRow = {
            ...unitConversionInitial,
            IsShowUnit: true,
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




    // function ShowUnit_onChange(event, type = '', Id) {

    //     settable((prevTableData) =>
    //         prevTableData.map((row) => {
    //             if ((!row.IsShowUnit)) {
    //                 row.IsShowUnit = false
    //             }
    //             if (row.Unit.value === Id) {
    //                 row.IsShowUnit = event;

    //             }

    //             return row;
    //         })
    //     );
    // }

    function ShowUnit_onChange(checked, type = '', UnitId) {
        settable((prevTableData) =>
            prevTableData.map((row) => {
                if (row.Unit?.value === UnitId) {
                    return { ...row, IsShowUnit: checked };
                }
                return row;
            })
        );
    }


    function baseUnit2_onChange(event, type = '', Id) {
        settable((prevTableData) =>
            prevTableData.map((row) => {
                if (type === 'POUnit' && row.id !== Id) {
                    row.POUnit = false;
                }
                if (type === 'SOUnit' && row.id !== Id) {
                    row.SOUnit = false;
                }
    
                if (row.id === Id) {
                    row[type] = event;
    
                    // Auto-check ShowUnit when POUnit or SOUnit is selected
                    if (type === 'POUnit' || type === 'SOUnit') {
                        row.IsShowUnit = event;
                    }
                }
    
                return { ...row }; // return a new object to trigger re-render
            })
        );
    }
    

    const tbodyfunction = () => {
        return baseUnit.map((row, index) => (
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
                                placeholder="Select"
                                isDisabled={true}
                                autoComplete="off"
                                value={row.Conversion}

                            />
                        </Col>
                    </Row>
                </td>
                <td>
                    <Input
                        type="radio"
                        checked={row.POUnit}
                        onChange={(e) => baseUnit2_onChange(e.target.checked, "POUnit", row.id)}
                    />
                </td>

                <td>
                    <Input
                        type="radio"
                        checked={row.SOUnit}
                        onChange={(e) => baseUnit2_onChange(e.target.checked, "SOUnit", row.id)}
                    />
                </td>
                <td>
                    <Input
                        type="checkbox"
                        checked={row.IsShowUnit}
                        disabled={row.isDisabled}

                        onChange={(e) => ShowUnit_onChange(e.target.checked, "ShowUnit", index.Unit.value)}
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
                                <Card className="c_card_body p-2 h-100" style={{ flex: 1, height: '100%' }}>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Name</Label>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    className="mb-1"
                                                    placeholder="Enter item name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Barcode</Label>
                                                <Input
                                                    type="text"
                                                    name="barcode"
                                                    className="mb-1"
                                                    placeholder="Enter barcode"
                                                    value={formData.barcode}
                                                    onChange={handleInputChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Shelf Life</Label>
                                                <Input
                                                    type="text"
                                                    name="shelfLife"
                                                    className="mb-1"
                                                    placeholder="Enter shelf life"
                                                    value={formData.shelfLife}
                                                    onChange={handleInputChange}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>{fieldLabel.BaseUnitName || "Base Unit"}</Label>
                                                <Select
                                                    name="BaseUnitName"
                                                    value={values.BaseUnitName}
                                                    isSearchable
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={BaseUnit_DropdownOptions}
                                                    onChange={BaseUnitOnchange}
                                                />
                                                {isError.BaseUnitName.length > 0 && (
                                                    <span className="text-danger f-8">
                                                        <small>{isError.BaseUnitName}</small>
                                                    </span>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>{fieldLabel.CategoryType || "Category Type"}</Label>
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

                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>{fieldLabel.Category || "Category"}</Label>
                                                <Select
                                                    name="Category"
                                                    value={values.Category}
                                                    isMulti
                                                    isSearchable
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={CategoryList_DropdownOptions}
                                                    onChange={(hasSelect, evn) => {
                                                        onChangeSelect({ hasSelect, evn, state, setState });
                                                    }}
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
                                                <Label>PartyType</Label>
                                                <Select
                                                    name="PartyType"
                                                    value={PartyType}
                                                    isSearchable
                                                    options={PartyTypeDropdown_Options}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                                    onChange={partyTypeOnChange}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>MRP</Label>
                                                <Input
                                                    type="text"
                                                    id="txtMRP0"
                                                    value={MRP}
                                                    placeholder="Please Enter MRP"
                                                    onChange={MRPHandler}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Card>

                                <Card className="c_card_body p-3">
                                    <Row className="align-items-end">
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>GST</Label>
                                                <Input
                                                    type="text"
                                                    id="txtGST0"
                                                    value={GST}
                                                    placeholder="Please Enter GST"
                                                    autoComplete="off"
                                                    onChange={(e) => setGST(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>HSNCode</Label>
                                                <Input
                                                    type="text"
                                                    id="txtHSNCode0"
                                                    value={HSNCode}
                                                    placeholder="Please Enter HSNCode"
                                                    autoComplete="off"
                                                    onChange={(e) => setHSNCode(e.target.value)}
                                                />
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
                                                    <Label>Group Type</Label>
                                                    <Select
                                                        value={groupTypeDropdownSelect}
                                                        options={GroupType_DropdownOptions}
                                                        onChange={GroupType_Handler}
                                                        styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label>Group</Label>
                                                    <C_Select
                                                        value={groupDropdownSelect}
                                                        options={Group_DropdownOptions}
                                                        onChange={Group_Handler}
                                                        isLoading={groupDropDownLoading}
                                                        styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label>Sub Group</Label>
                                                    <C_Select
                                                        value={subGroupDropdownSelect}
                                                        options={SubGroup_DropdownOptions}
                                                        isLoading={subgroupDropDownLoading}
                                                        onChange={SubGroup_Handler}
                                                        styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Card>

                                    <Card>
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
                                                <Tbody>{tbodyfunction()}</Tbody>
                                            </Table>
                                        </div>
                                    </Card>

                                </Row>


                            </Col>
                        </Row>

                        {/* GST SECTION */}


                        {/* <Button className="mt-3 " color="primary" type="submit">
                            Submit
                        </Button> */}
                    </Row>
                </CardBody>

            </Card >
        </div >
    );
};

export default ItemMasterForm;
