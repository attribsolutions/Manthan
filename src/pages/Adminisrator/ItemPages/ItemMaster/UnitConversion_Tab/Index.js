
import React, { useEffect } from 'react'
import Select from 'react-select'
import { Tbody, Thead } from 'react-super-responsive-table'
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap'
import { unitConversionInitial } from '../itemIndex';
import { mode } from '../../../../../routes';
import { CInput, decimalRegx_3dit } from '../../../../../CustomValidateForm';

export default function UnitConverstion(props) {
    const { pageMode, formValue, TableData = [], BaseUnit = [] } = props.state;
    const { settable, setFormValue } = props;

    // Map BaseUnit to dropdown options
    const BaseUnit_DropdownOptions = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    // Initialize table data if in create mode
    useEffect(() => {
        if (pageMode !== mode.edit && pageMode !== mode.view) {
            const initialEvent = formValue.values.BaseUnitName;

            if (Object.keys(initialEvent).length > 0) {
                baseunitOnchange(initialEvent);
            }
        }
    }, [pageMode, formValue.values.BaseUnitName]);

    // Handle Base Unit change
    function baseunitOnchange(event) {
        const { BaseUnitName, ...restRequired } = formValue.required;
        const updatedFormValue = {
            ...formValue,
            values: {
                ...formValue.values,
                BaseUnitName: event,
            },
            isError: {
                ...formValue.isError,
                BaseUnitName: "",
            },
            required: restRequired,
        };
        setFormValue(updatedFormValue);

        // Adding the base unit to the table
        const baseUnitRow = { ...unitConversionInitial, Unit: event, Conversion: 1, IsBase: true, id: 1 };

        // Check the base unit and add additional units if they are not the base unit
        const additionalUnits = [];

        if (event.value !== 1) {
            additionalUnits.push({ ...unitConversionInitial, Unit: { value: 1, label: 'No' }, Conversion: 1, IsBase: false, id: 2 });
        }
        if (event.value !== 2) {
            additionalUnits.push({ ...unitConversionInitial, Unit: { value: 2, label: 'Kg' }, Conversion: 1, IsBase: false, id: 3 });
        }
        if (event.value !== 4) {
            additionalUnits.push({ ...unitConversionInitial, Unit: { value: 4, label: 'Box' }, Conversion: 1, IsBase: false, id: 4 });
        }
        // Setting the table with the base unit and the additional units
        settable([baseUnitRow, ...additionalUnits]);
    }

    // Add new row handler
    function addRow_Handler(ID) {
        let newRow = { ...unitConversionInitial, id: ID + 1 };
        settable((prevTableData) => [...prevTableData, newRow]);
    }

    // Delete row handler
    function deleteRow_Handler(Id) {
        settable((prevTableData) => prevTableData.filter((row) => row.id !== Id));
    }

    // Handle changes in the table rows
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
                    if (type === 'POUnit' || type === 'SOUnit') {
                        const element = document.getElementById(`ShowUnit-${row.id}`)
                        if (element) {
                            element.checked = event;
                        }
                        row.IsShowUnit = event;
                    }
                }
                return row;
            })
        );

    }



    function ShowUnit_onChange(event, type = '', Id) {

        settable((prevTableData) =>
            prevTableData.map((row) => {
                if ((!row.IsShowUnit) && (pageMode !== mode.edit)) {
                    row.IsShowUnit = false
                }
                if (row.Unit.value === Id) {
                    row.IsShowUnit = event;

                }

                return row;
            })
        );
    }



    // Filter options for the table dropdown to exclude the selected base unit
    let BaseUnit_DropdownOptions2 = BaseUnit.filter(item => formValue.values.BaseUnitName.label !== item.Name)
        .map(item => ({
            value: item.id,
            label: item.Name
        }));

    // Generate table body rows
    const tbodyfunction = () => {

        return TableData.map((index, key) => {

            if (formValue.values.BaseUnitName.value === index.Unit.value) {
                index.IsShowUnit = true
                index["isDisabled"] = true;
            }
            if (index.POUnit || index.SOUnit) {
                index["isDisabled"] = true;
            } else {
                index["isDisabled"] = false;
            }
            debugger;
            const isRestrictedUnit = ["No", "Kg", "Box"].includes(index.Unit.label);
            return (
                <tr key={index.id}>
                    <td>
                        <Row>
                            <Label className="col-sm-2 col-form-label">1</Label>
                            <Col md={7}>
                                <Select
                                    id={`dropUnit-${key}`}
                                    isDisabled={key === 0 || isRestrictedUnit}
                                    placeholder="Select..."
                                    value={index.Unit}
                                    options={BaseUnit_DropdownOptions2}
                                    onChange={(e) => baseUnit2_onChange(e, "Unit", index.id)}
                                />
                            </Col>
                            <Label className="col-sm-2 col-form-label">=</Label>
                        </Row>
                    </td>
                    <td>
                        <Row>
                            <Col>
                                <CInput
                                    type="text"
                                    id={`txtConversion${key}`}
                                    placeholder="Select"
                                    disabled={key === 0}
                                    cpattern={decimalRegx_3dit}
                                    autoComplete="off"
                                    value={index.Conversion}
                                    onChange={(event) => baseUnit2_onChange(event.target.value, "Conversion", index.id)}
                                />
                            </Col>
                            <Label className="col-sm-4 col-form-label">{formValue.values.BaseUnitName.label}</Label>
                        </Row>
                    </td>
                    <td>
                        <Input
                            type="radio"
                            key={`POUnit-${index.id}`}
                            checked={index.POUnit}
                            onChange={(e) => baseUnit2_onChange(e.target.checked, "POUnit", index.id)}
                        />
                    </td>
                    <td>
                        <Input
                            type="radio"
                            key={`SOUnit-${index.id}`}
                            checked={index.SOUnit}
                            onChange={(e) => baseUnit2_onChange(e.target.checked, "SOUnit", index.id)}
                        />
                    </td>


                    <td>
                        <Input
                            type="checkbox"
                            key={`ShowUnit-${index.id}`}
                            id={`ShowUnit-${index.id}`}
                            disabled={index.isDisabled}
                            // defaultChecked={formValue.values.BaseUnitName.value === index.Unit.value}
                            defaultChecked={index.IsShowUnit}
                            onChange={(e) => ShowUnit_onChange(e.target.checked, "ShowUnit", index.Unit.value)}
                        />
                    </td>


                    <td>
                        {(TableData.length === key + 1) ? (
                            <Row className="">
                                <Col md={6} className="mt-3">
                                    {(TableData.length > 1 && key > 0 && !isRestrictedUnit) ? (
                                        <i
                                            className="mdi mdi-trash-can d-block text-danger font-size-20"
                                            onClick={() => deleteRow_Handler(index.id)}
                                        >
                                        </i>
                                    ) : (
                                        <Col md={6}></Col>
                                    )}
                                </Col>
                                <Col md={6}>
                                    <Button
                                        style={{ marginLeft: "-0.6cm" }}
                                        className="button_add"
                                        color="btn btn-outline-primary border-2 font-size-12"
                                        type="button"
                                        onClick={() => addRow_Handler(index.id)}
                                    >
                                        <i className="dripicons-plus"></i>
                                    </Button>
                                </Col>
                            </Row>
                        ) : (
                            !index.IsBase && !isRestrictedUnit && (
                                <i
                                    className="mdi mdi-trash-can d-block text-danger font-size-20"
                                    onClick={() => deleteRow_Handler(index.id)}
                                >
                                </i>
                            )
                        )}
                    </td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Card className="text-black">
                <CardBody className='c_card_body'>
                    <Row>
                        <FormGroup className="col col-sm-4">
                            <Label>Base Unit</Label>
                            <Select
                                id={`dropBaseUnit-0`}
                                placeholder="Select..."
                                value={formValue.values.BaseUnitName}
                                isDisabled={pageMode === "edit"}
                                options={BaseUnit_DropdownOptions}
                                onChange={baseunitOnchange}
                                styles={{ menu: provided => ({ ...provided, zIndex: 2 }) }}
                            />
                        </FormGroup>
                    </Row>
                    {formValue.values.BaseUnitName.value !== 0 ? (
                        <Row className="mt-3">
                            <Col md={8}>
                                <Table className="table table-bordered">
                                    <Thead>
                                        <tr>
                                            <th className="col-sm-3">Unit Name</th>
                                            <th className="col-sm-3 text-center">Conversion To Base Unit</th>
                                            <th className="col-sm-1 text-center">PO Unit</th>
                                            <th className="col-sm-1 text-center">SO Unit</th>
                                            <th className="col-sm-1 text-center " style={{ width: "70px" }}>Show Unit</th>

                                            <th className="col-sm-2">Action</th>
                                        </tr>
                                    </Thead>
                                    <Tbody>
                                        {tbodyfunction()}
                                    </Tbody>
                                </Table>
                            </Col>
                        </Row>
                    ) : (
                        <Row className="mt-3">
                            <Label className="text-danger">Please select BaseUnit</Label>
                        </Row>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}
