import React from 'react'
import Select from 'react-select'
import { Tbody, Thead } from 'react-super-responsive-table'
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap'
import { unitConversionInitial } from '../itemIndex';

export default function UnitConverstion(props) {

    const { pageMode, formValue, TableData = [], BaseUnit = [], } = props.state;

    const { settable, setFormValue } = props

    const BaseUnit_DropdownOptions = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function baseunitOnchange(event) {

        const val = { ...formValue }
        const a1 = { ...unitConversionInitial, Unit: event, Conversion: 1, IsBase: true }
        val["BaseUnit"] = event
        setFormValue(val)
        settable([a1])
    }

    function addRow_Handler(ID) {
        let a1 = { ...unitConversionInitial, id: ID + 1 }
        const newarr = [...TableData, a1]
        
        settable(newarr)
    }

    function deleteRow_Handler(Id) {
        const found = TableData.filter((i) => {
            return !(i.id === Id)
        })
        
        settable(found)
    }

    function baseUnit2_onChange(event, type = '', Id) {
        settable(e1 => {
            const newarr = e1.map((index) => {

                if (((type === 'POUnit') && !(index.id === Id))) {
                    index.POUnit = false
                };
                if (((type === 'SOUnit') && !(index.id === Id))) {
                    index.SOUnit = false
                };
                if (index.id === Id) { index[type] = event };
                return index
            })
            return (newarr)
        })
    };

    //start  => BaseUnit DropDown select id(array value) ,Table BaseUnit dropdown option filter is notinclude BaseUnit DropDown select +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
    let BaseUnit_DropdownOptions2 = []
    BaseUnit.forEach(myFunction);
    function myFunction(item, index, arr) {

        if (!(formValue.BaseUnit.label === item.Name)) {
            BaseUnit_DropdownOptions2[index] = {
                value: item.id,
                label: item.Name
            };
        }
    }
    //end Table BaseUnit dropdown option ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const tbodyfunction = () => {
        const newarr = []
        TableData.forEach((index, key) => {
            newarr.push(
                (
                    <tr >
                        <td>
                            <Row>
                                <Label className=" col-sm-2 col-form-label">1</Label>
                                <Col md={7}>
                                    <Select
                                        id={`dropUnit-${key}`}
                                        isDisabled={(key === 0) ? true : false}
                                        placeholder="Select..."
                                        value={index.Unit}
                                        options={BaseUnit_DropdownOptions2}
                                        onChange={(e) => baseUnit2_onChange(e, "Unit", index.id)}
                                    />
                                </Col>
                                < Label className=" col-sm-2 col-form-label">=</Label>
                            </Row>
                        </td>

                        <td>
                            <Row>
                                <Col>
                                    <Input
                                        type="text"
                                        id={`txtConversion${key}`}
                                        placeholder="Select"
                                        disabled={(key === 0) ? true : false}
                                        autoComplete="off"
                                        value={index.Conversion}
                                        onChange={(event) => baseUnit2_onChange(event.target.value, "Conversion", index.id)}
                                    >
                                    </Input>
                                </Col>
                                <Label className=" col-sm-4 col-form-label"> {formValue.BaseUnit.label}</Label>
                            </Row>
                        </td>

                        <td >
                            <div>
                                <Input
                                    type="radio"
                                    // id={`POUnit-${key}`}
                                    key={`POUnit-${index.id}`}
                                    // name={"btnPOUnit"}
                                    checked={index.POUnit}
                                    // value={TableData[key].POUnit}
                                    onChange={(e) => baseUnit2_onChange(e.target.checked, "POUnit", index.id)}
                                >
                                </Input>
                            </div>
                        </td>

                        <td>
                            <div>
                                <Input
                                    type="radio"
                                    // id={`SOUnit-${key}`}
                                    // name={'btnSOUnit'}
                                    key={`SOUnit-${index.id}`}
                                    checked={index.SOUnit}
                                    // value={TableData[key].SOUnit}
                                    onChange={(e) => baseUnit2_onChange(e.target.checked, "SOUnit", index.id)}
                                >
                                </Input>
                            </div>
                        </td>

                        <td>
                            {(TableData.length === key + 1) ?
                                //Table show Only length is greter than =1

                                <Row className="">
                                    <Col md={6} className=" mt-3">
                                        {(TableData.length > 1) ?
                                            //(Add New RowButton and delete Button) vissible Last Index Of The table row
                                            <>
                                                < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                    deleteRow_Handler(index.id)
                                                }} >
                                                </i>
                                            </> : <Col md={6} ></Col>}

                                    </Col>

                                    <Col md={6} style={{ marginRight: "" }}>
                                        <Button
                                            style={{ marginLeft: "-0.6cm" }}
                                            className=" button_add"
                                            color="btn btn-outline-primary border-2 font-size-12"
                                            type="button"
                                            onClick={() => { addRow_Handler(index.id) }}
                                        >
                                            <i className="dripicons-plus "></i>
                                        </Button>
                                    </Col>
                                </Row>
                                :
                                //if BaseUnit Id and table-Unit id same then Selete Button hide
                                (!(index.IsBase)) ? < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                    deleteRow_Handler(index.id)
                                }} >
                                </i>
                                    : <></>
                            }
                        </td>
                    </tr>
                )
            )

        });
        return newarr
    }

    return (
        <div>
            <Card className="text-black">
                <CardBody className='c_card_body'>

                    <Row>
                        <FormGroup className=" col col-sm-4 " >
                            <Label >Base Unit</Label>
                            <Select
                                id={`dropBaseUnit-0`}
                                placeholder="Select..."
                                value={formValue.BaseUnit}
                                isDisabled={pageMode === "edit" ? true : false}
                                options={BaseUnit_DropdownOptions}
                                onChange={baseunitOnchange}
                                styles={{
                                    menu: provided => ({ ...provided, zIndex: 2 })
                                }}
                            />
                        </FormGroup>
                    </Row>

                    {!(formValue.BaseUnit.value === 0)
                        ? <Row className="mt-3">
                            <Col md={8}>
                                <Table className="table table-bordered  ">
                                    <Thead >
                                        <tr>
                                            <th className="col-sm-3">Unit Name</th>
                                            <th className="col-sm-3 text-center">Conversion To Base Unit </th>
                                            <th className="col-sm-1 text-center">PO Unit</th>
                                            <th className="col-sm-1 text-center">SO Unit</th>
                                            <th className="col-sm-2">Action</th>
                                        </tr>
                                    </Thead>
                                    <Tbody  >
                                        {tbodyfunction()}
                                    </Tbody>
                                </Table>
                            </Col>
                        </Row>
                        :
                        <Row className="mt-3">
                            <br></br>
                            <Label className="text-danger">Please select BaseUnit</Label></Row>}
                </CardBody>
            </Card>
        </div>
    )
}
