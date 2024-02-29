import React, { useImperativeHandle, forwardRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { comAddPageFieldFunc, onChangeCheckbox, onChangeSelect, onChangeText } from '../../../../../components/Common/validationFunction'
import { Breadcrumb_inputName, get_Category_By_CategoryType_ForDropDownAPI } from '../../../../../store/actions'
import Select from "react-select"
import { unitConversionInitial } from '../../ItemMaster/itemIndex'

const BasicInfoTabForm = forwardRef(({ state, setState, settable, pageField }, ref) => {

    const dispatch = useDispatch();

    const [searchResults, setSearchResults] = React.useState([]);

    useImperativeHandle(ref, () => ({
        setCurrentState(arr) {
            setState(arr)
        },
        getCurrentState: () => {
            return state
        },
    }));

    const {
        BaseUnit,
        CategoryTypeList,
        CategoryList,
        BrandName,
        ItemTagList,
    } = useSelector((state) => ({
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        CategoryTypeList: state.categoryTypeReducer.categoryTypeListData,
        CategoryList: state.ItemMastersReducer.Category,
        categotyDropDownLoading: state.ItemMastersReducer.categotyDropDownLoading,
        BrandName: state.GeneralReducer.GeneralMasterSubType,
        ItemTagList: state.ItemMastersReducer.ItemTagList,
    }));

    const { values } = state;
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster;
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const BaseUnit_DropdownOptions = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const CategoryTypeList_DropdownOptions = CategoryTypeList.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const CategoryList_DropdownOptions = CategoryList.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const BrandName_DropdownOptions = BrandName.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

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

    function BaseUnitOnchange(hasSelect, evn) {
        onChangeSelect({ hasSelect, evn, state, setState })
        settable([{ ...unitConversionInitial, IsBase: true, Conversion: 1, Unit: hasSelect }]);
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        try {
            var x = document.getElementById("itemtag");
            if (event.target == "") {
                var x = document.getElementById("itemtag");
                x.style.display = "none";
            }
        } catch (w) { }
    }

    let data = ItemTagList.map((index) => {
        return index.dta
    })

    function handleChange(event) {

        try {
            onChangeText({ event, state, setState })
            dispatch(Breadcrumb_inputName(event.target.value));
            // CommonTab_SimpleText_INPUT_handller_ForAll(event.target.value, "Name")
            var searchtext = event.target.value
            const results = data.filter(person =>
                person.toLowerCase().includes(searchtext)
            );

            setSearchResults(results);

            var x = document.getElementById("itemtag");
            document.addEventListener('click', function handleClickOutsideBox(event) {
                if (!x.contains(event.target)) {
                    x.style.display = 'none';
                }
            });

            x.style.display = "block";
            var di = "100Px"

            if (event.target.value == "") {
                di = `${x.style.display = "none"}`
            }
            else if (results.length == 0) {
                di = `${x.style.display = "none"}`
            }
            else if (results.length < 2) {
                di = "50Px"
            } else if (results.length > 5) {
                di = "300Px"
            } else if (results.length < 2) {
                di = "50Px"
            }
            x.style.height = di;

        } catch (w) { }
    };

    const onclickselect = function () {
        const hasNone = document.getElementById("itemtag").style;

        if (hasNone.display === "none") {
            hasNone.display = "block";
        } else {
            hasNone.display = "none";
        }
    };

    const FirstTab = (
        <div id={"base-tabe-area"}>
            <Card className="text-black"  >
                <CardBody className="c_card_body">

                    <Col md={12} >
                        <Row className="mt-1 ">
                            <FormGroup className="mb-3 col col-sm-4 " >
                                <Label >{fieldLabel.Name} </Label>
                                <Input
                                    name="Name"
                                    id="txtName"
                                    value={values.Name}
                                    type="text"
                                    className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                    placeholder={`Please Enter ${fieldLabel.Name}`}
                                    autoComplete='off'
                                    autoFocus={true}
                                    onClick={onclickselect}
                                    onChange={(e) => { handleChange(e) }}
                                />
                                {isError.Name.length > 0 && (
                                    <span className="invalid-feedback">{isError.Name}</span>
                                )}
                                <div id="itemtag" >
                                    <ul style={{}}>
                                        {searchResults.map(item => (
                                            <li className="liitem" >{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-4 " >
                                <Label >{fieldLabel.ShortName} </Label>
                                <Input
                                    name="ShortName"
                                    id="txtName"
                                    value={values.ShortName}
                                    type="text"
                                    className={isError.ShortName.length > 0 ? "is-invalid form-control" : "form-control"}
                                    placeholder={`Please Enter ${fieldLabel.ShortName}`}
                                    autoComplete='off'
                                    autoFocus={true}
                                    onChange={(event) => {
                                        onChangeText({ event, state, setState })
                                    }}
                                />
                                {isError.ShortName.length > 0 && (
                                    <span className="invalid-feedback">{isError.ShortName}</span>
                                )}
                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-4 " >
                                <Label >{fieldLabel.ShelfLife}<samp className="text-secondary">/Day</samp> </Label>
                                <Input
                                    name="ShelfLife"
                                    id="txtName"
                                    value={values.ShelfLife}
                                    type="text"
                                    className={isError.ShelfLife.length > 0 ? "is-invalid form-control" : "form-control"}
                                    placeholder={`Please Enter ${fieldLabel.ShelfLife}`}
                                    autoComplete='off'
                                    autoFocus={true}
                                    onChange={(event) => {
                                        onChangeText({ event, state, setState })
                                    }}
                                />
                                {isError.ShelfLife.length > 0 && (
                                    <span className="invalid-feedback">{isError.ShelfLife}</span>
                                )}
                            </FormGroup>
                        </Row>
                    </Col>

                    <Col md={12} >
                        <Row className="mt-1 ">
                            <FormGroup className="mb-3 col col-sm-4 " >
                                <Label >{fieldLabel.BaseUnitName} </Label>
                                <Select
                                    name="BaseUnitName"
                                    value={values.BaseUnitName}
                                    isSearchable={true}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    options={BaseUnit_DropdownOptions}
                                    onChange={BaseUnitOnchange}
                                />
                                {isError.BaseUnitName.length > 0 && (
                                    <span className="text-danger f-8"><small>{isError.BaseUnitName}</small></span>
                                )}
                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-4 " >
                                <Label >{fieldLabel.BarCode} </Label>
                                <Input
                                    name="BarCode"
                                    id="txtName"
                                    value={values.BarCode}
                                    type="text"
                                    className={isError.BarCode.length > 0 ? "is-invalid form-control" : "form-control"}
                                    placeholder={`Please Enter ${fieldLabel.BarCode}`}
                                    autoComplete='off'
                                    autoFocus={true}
                                    onChange={(event) => {
                                        onChangeText({ event, state, setState })
                                    }}
                                />
                                {isError.BarCode.length > 0 && (
                                    <span className="invalid-feedback">{isError.BarCode}</span>
                                )}
                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-4 " >
                                <Label >{fieldLabel.SAPItemCode} </Label>
                                <Input
                                    name="SAPItemCode"
                                    id="txtName"
                                    value={values.SAPItemCode}
                                    type="text"
                                    className={isError.SAPItemCode.length > 0 ? "is-invalid form-control" : "form-control"}
                                    placeholder={`Please Enter ${fieldLabel.SAPItemCode}`}
                                    autoComplete='off'
                                    autoFocus={true}
                                    onChange={(event) => {
                                        onChangeText({ event, state, setState })
                                    }}
                                />
                                {isError.SAPItemCode.length > 0 && (
                                    <span className="invalid-feedback">{isError.SAPItemCode}</span>
                                )}
                            </FormGroup>
                        </Row>
                    </Col>

                    <Col md={12} >
                        <Row className="mt-1 ">
                            <FormGroup className="mb-3 col col-sm-4 " >
                                <Label >{fieldLabel.CategoryType} </Label>
                                <Select
                                    name="CategoryType"
                                    value={values.CategoryType}
                                    isSearchable={true}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    options={CategoryTypeList_DropdownOptions}
                                    onChange={CategoryType_Handler}
                                />
                                {isError.CategoryType.length > 0 && (
                                    <span className="text-danger f-8"><small>{isError.CategoryType}</small></span>
                                )}
                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-4 " >
                                <Label >{fieldLabel.Category} </Label>
                                <Select
                                    name="Category"
                                    value={values.Category}
                                    isMulti={true}
                                    isSearchable={true}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    options={CategoryList_DropdownOptions}
                                    onChange={(hasSelect, evn) => {
                                        onChangeSelect({ hasSelect, evn, state, setState })
                                    }}
                                />
                                {isError.Category.length > 0 && (
                                    <span className="text-danger f-8"><small>{isError.Category}</small></span>
                                )}
                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-4 " >
                                <Label >{fieldLabel.BrandName}</Label>
                                <Select
                                    name="BrandName"
                                    value={values.BrandName}
                                    isMulti={true}
                                    isSearchable={true}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    options={BrandName_DropdownOptions}
                                    onChange={(hasSelect, evn) => {
                                        onChangeSelect({ hasSelect, evn, state, setState })
                                    }}
                                />
                                {/* {isError.BrandName.length > 0 && (
                                    <span className="text-danger f-8"><small>{isError.BrandName}</small></span>
                                )} */}
                            </FormGroup>
                        </Row>
                    </Col>

                    <Col md={12} >
                        <Row className="mt-1 ">
                            <FormGroup className="mb-3 col col-sm-4 " >
                                <Label >{fieldLabel.Tag} </Label>
                                <Input
                                    name="Tag"
                                    id="txtName"
                                    value={values.Tag}
                                    type="text"
                                    className={isError.Tag.length > 0 ? "is-invalid form-control" : "form-control"}
                                    placeholder={`Please Enter ${fieldLabel.Tag}`}
                                    autoComplete='off'
                                    autoFocus={true}
                                    onChange={(event) => {
                                        onChangeText({ event, state, setState })
                                    }}
                                />
                                {isError.Tag.length > 0 && (
                                    <span className="invalid-feedback">{isError.Tag}</span>
                                )}
                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-4 " >
                                <Label >{fieldLabel.Sequence} </Label>
                                <Input
                                    name="Sequence"
                                    id="txtName"
                                    value={values.Sequence}
                                    type="text"
                                    className={isError.Sequence.length > 0 ? "is-invalid form-control" : "form-control"}
                                    placeholder={`Please Enter ${fieldLabel.Sequence}`}
                                    autoComplete='off'
                                    autoFocus={true}
                                    onChange={(event) => {
                                        onChangeText({ event, state, setState })
                                    }}
                                />
                                {isError.Sequence.length > 0 && (
                                    <span className="invalid-feedback">{isError.Sequence}</span>
                                )}
                            </FormGroup>
                        </Row>
                    </Col>

                    <Col md={12} >
                        <Row className="mt-n3 ">
                            <FormGroup className="mb-1 col col-sm-4 " >
                                <Row style={{ marginTop: '25px' }}>
                                    <Label
                                        className="col-sm-4 col-form-label">
                                        {fieldLabel.isActive}
                                    </Label>
                                    <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                        <div className="form-check form-switch form-switch-md mb-3">
                                            <Input
                                                name="isActive"
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={values.isActive}
                                                onChange={(event) => onChangeCheckbox({ event, state, setState })}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </FormGroup>

                            <FormGroup className="mb- col col-sm-4 " >
                                <Row style={{ marginTop: '25px' }}>
                                    <Label
                                        className="col-sm-4 col-form-label">
                                        {fieldLabel.IsSCM}
                                    </Label>
                                    <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                        <div className="form-check form-switch form-switch-md mb-3">
                                            <Input
                                                name="IsSCM"
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={values.IsSCM}
                                                onChange={(event) => onChangeCheckbox({ event, state, setState })}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </FormGroup>

                        </Row>
                    </Col>
                </CardBody>
            </Card>

        </div >
    )
    return FirstTab
})

export default BasicInfoTabForm



