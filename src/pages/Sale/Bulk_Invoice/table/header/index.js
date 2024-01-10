// TableHeaderSection.js
import React from 'react';
import { Col, FormGroup, Label } from 'reactstrap';
import Select from 'react-select'; // Replace with the correct path
import { C_DatePicker } from '../../../../../CustomValidateForm';

const TableHeaderSection = ({
  key,
  orderDate = "12-03-2024",
  customerName = "Test Customer",
  vehicleNo = "GHB-1425",
}) => {

  return (
    <div key={key}>
      <div className="d-flex px-2 mb-n1 c_card_filter header text-black">
        <div className="flex-grow-1">
          <FormGroup className="mb- row mt-1 d-flex align-items-center">
            <Label className="flex-grow-8 p-2">Order Date: {orderDate}</Label>
          </FormGroup>
        </div>

        <div className="flex-grow-1">
          <FormGroup className="mb- row mt-1 d-flex align-items-center">
            <Label className="flex-grow-6 p-2">Customer Name: {customerName}</Label>
          </FormGroup>
        </div>

        <div className="flex-grow-1">
          <FormGroup className="mb- row mt-1 d-flex align-items-center">
            <Label className="flex-grow-5 p-2">Vehicle No: {vehicleNo}</Label>
          </FormGroup>
        </div>
      </div>

    </div>
  );
};

export default TableHeaderSection;
