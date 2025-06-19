import React, { useState } from 'react';
import {
    Button,
    Card,
    CardBody,
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'react-flatpickr';
import { C_DatePicker } from '../../../../CustomValidateForm';
import BootstrapTable from 'react-bootstrap-table-next';

const ItemMasterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        barcode: '',
        shelfLife: null,
        baseUnit: null,
        categoryType: null,
        category: null,
    });

    const dropdownOptions = {
        shelfLife: [
            { label: '6 Months', value: '6m' },
            { label: '12 Months', value: '12m' },
        ],
        baseUnit: [
            { label: 'KG', value: 'kg' },
            { label: 'Liter', value: 'ltr' },
        ],
        categoryType: [
            { label: 'Food', value: 'food' },
            { label: 'Electronics', value: 'electronics' },
        ],
        category: [
            { label: 'Beverages', value: 'beverages' },
            { label: 'Snacks', value: 'snacks' },
        ],
    };

    const columns = [
        {
            dataField: 'effectiveDate',
            text: 'Effective Date',
        },
        {
            dataField: 'gst',
            text: 'GST %',
        },
        {
            dataField: 'hsn',
            text: 'HSN Code',
        },
    ];

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

    return (
        <Card>
            <CardBody>
                <form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Card className='c_card_body p-2'>
                                <Row>

                                    {/* Name */}
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Name</Label>
                                            <Input
                                                type="text"
                                                name="name"
                                                className='mb-1'
                                                placeholder="Enter item name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </FormGroup>
                                    </Col>

                                    {/* Barcode */}
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Barcode</Label>
                                            <Input
                                                type="text"
                                                name="barcode"
                                                className='mb-1'

                                                placeholder="Enter barcode"
                                                value={formData.barcode}
                                                onChange={handleInputChange}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>

                                    {/* Shelf Life */}
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Shelf Life</Label>
                                            <Select
                                                options={dropdownOptions.shelfLife}
                                                value={formData.shelfLife}
                                                className='mb-1'

                                                onChange={(selected) => handleSelectChange('shelfLife', selected)}
                                                placeholder="Select shelf life"
                                            />
                                        </FormGroup>
                                    </Col>

                                    {/* Base Unit */}
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Base Unit</Label>
                                            <Select
                                                options={dropdownOptions.baseUnit}
                                                value={formData.baseUnit}
                                                className='mb-1'

                                                onChange={(selected) => handleSelectChange('baseUnit', selected)}
                                                placeholder="Select base unit"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>

                                    {/* Category Type */}
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Category Type</Label>
                                            <Select
                                                options={dropdownOptions.categoryType}
                                                value={formData.categoryType}
                                                className='mb-1'

                                                onChange={(selected) => handleSelectChange('categoryType', selected)}
                                                placeholder="Select category type"
                                            />
                                        </FormGroup>
                                    </Col>

                                    {/* Category */}
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Category</Label>
                                            <Select
                                                options={dropdownOptions.category}
                                                value={formData.category}
                                                className='mb-1'

                                                onChange={(selected) => handleSelectChange('category', selected)}
                                                placeholder="Select category"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                            </Card >
                        </Col>

                        <Col md={6}>
                            <Card className="c_card_body p-3">
                                <Row className="align-items-end">
                                    <Col md={4} className='mb-2'>
                                        <FormGroup>
                                            <Label>Effective Date</Label>
                                            <C_DatePicker
                                                type="date"
                                                onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4} className='mb-2'>
                                        <FormGroup>
                                            <Label>GST %</Label>
                                            <Input
                                                type="number"
                                                placeholder="Enter GST %"
                                                onChange={(e) => handleInputChange('gst', e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={3} className='mb-2'>
                                        <FormGroup>
                                            <Label>HSN Code</Label>
                                            <Input
                                                type="number"
                                                placeholder="Enter HSN Code"
                                                onChange={(e) => handleInputChange('hsn', e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={1} className='mb-2'>
                                        <Button
                                            className=" button_add"
                                            color="btn btn-outline-primary border-2 font-size-12 mb-1"
                                            type="button"
                                        >
                                            <i className="dripicons-plus"></i>
                                        </Button>
                                    </Col>
                                </Row>

                                <BootstrapTable
                                    keyField="effectiveDate"
                                    data={[]}
                                    columns={columns}
                                    bordered={true}
                                    bootstrap4
                                    noDataIndication={
                                        <div className="text-danger text-center ">
                                            Record Not available
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    </Row>
                    <hr />

                    {/* GST Section */}
                    <Row>
                        <Col md={6}>
                            <Card className="c_card_body p-3">
                                <Row className="align-items-end">
                                    <Col md={4} className='mb-2'>
                                        <FormGroup>
                                            <Label>Effective Date</Label>
                                            <C_DatePicker
                                                type="date"
                                                onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4} className='mb-2'>
                                        <FormGroup>
                                            <Label>GST %</Label>
                                            <Input
                                                type="number"
                                                placeholder="Enter GST %"
                                                onChange={(e) => handleInputChange('gst', e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={3} className='mb-2'>
                                        <FormGroup>
                                            <Label>HSN Code</Label>
                                            <Input
                                                type="number"
                                                placeholder="Enter HSN Code"
                                                onChange={(e) => handleInputChange('hsn', e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={1} className='mb-2'>
                                        <Button
                                            className=" button_add"
                                            color="btn btn-outline-primary border-2 font-size-12 mb-1"
                                            type="button"
                                        >
                                            <i className="dripicons-plus"></i>
                                        </Button>
                                    </Col>
                                </Row>

                                <BootstrapTable
                                    keyField="effectiveDate"
                                    data={[]}
                                    columns={columns}
                                    bordered={true}
                                    bootstrap4
                                    noDataIndication={
                                        <div className="text-danger text-center ">
                                            Record Not available
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>


                        <Col md={6}>
                            <Card className="c_card_body p-3">
                                <Row className="align-items-end">
                                    <Col md={4} className='mb-2'>
                                        <FormGroup>
                                            <Label>Group Type</Label>
                                            <Select
                                                onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4} className='mb-2'>
                                        <FormGroup>
                                            <Label>Group</Label>
                                            <Select
                                                onChange={(e) => handleInputChange('gst', e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={3} className='mb-2'>
                                        <FormGroup>
                                            <Label>Sub Group</Label>
                                            <Select
                                                onChange={(e) => handleInputChange('hsn', e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={1} className='mb-2'>
                                        <Button
                                            className=" button_add"
                                            color="btn btn-outline-primary border-2 font-size-12 mb-1"
                                            type="button"
                                        >
                                            <i className="dripicons-plus"></i>
                                        </Button>
                                    </Col>
                                </Row>

                                <BootstrapTable
                                    keyField="effectiveDate"
                                    data={[]}
                                    columns={columns}
                                    bordered={true}
                                    bootstrap4
                                    noDataIndication={
                                        <div className="text-danger text-center ">
                                            Record Not available
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    </Row>


                    <Card className='c_card_body p-2'>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>From Unit</Label>
                                    <Input type="text" placeholder="e.g., Box" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>To Unit</Label>
                                    <Input type="text" placeholder="e.g., Piece" />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Card >


                    <Button className='mt-2' color="primary" type="submit">
                        Submit
                    </Button>
                </form>
            </CardBody>
        </Card >
    );
};

export default ItemMasterForm;
