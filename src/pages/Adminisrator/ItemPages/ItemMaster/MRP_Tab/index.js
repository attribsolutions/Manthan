import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import MRPTable from "./Table";
import {
  get_Division_ForDropDown,
  get_Party_ForDropDown,
} from "../../../../../store/Administrator/ItemsRedux/action";

function MRPTab(props) {
  const dispatch = useDispatch();
  const [division, setDivision] = useState("");
  const [partyName, setPartyName] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [MRP, setMRP] = useState("");

  const { Party, Division } = useSelector((state) => ({
    Division: state.ItemMastersReducer.Division,
    Party: state.ItemMastersReducer.Party,
  }));

  useEffect(() => {
    dispatch(get_Division_ForDropDown());
    dispatch(get_Party_ForDropDown());
  }, [dispatch]);

  const Party_DropdownOptions = Party.map((data) => ({
    value: data.id,
    label: data.Name,
  }));

  const Division_DropdownOptions = Division.map((data) => ({
    value: data.id,
    label: data.Name,
  }));

  const DivisiontHandler = (event) => {
    setDivision(event);
  };

  const EffectiveDateHandler = (e, date) => {
    setEffectiveDate(date);
  };

  const PartyNameHandler = (event) => {
    setPartyName(event);
  };

  const MRPHandler = (event) => {
    setMRP(event.target.value);
  };

  const addRowsHandler = (e) => {
   
    const val = {
      Division: division === "" ? "" : division.value,
      DivisionName: division.label,
      PartyName: partyName.label,
      Party: partyName === "" ? "" : partyName.value,
      EffectiveDate: effectiveDate,
      MRP: MRP,
      CreatedBy: 1,
      UpdatedBy: 1,
      Company: 1,
      IsAdd:true
    };

    if (!(effectiveDate === "") && !(MRP === "")) {
      const totalTableData = props.tableData.length;
      val.id = totalTableData + 1;
      const updatedTableData = [...props.tableData];
      updatedTableData.push(val);
      props.func(updatedTableData);
      clearState();
    } else {
      alert("Please Enter value");
    }
  };
  const clearState = () => {
    setDivision("");
    setPartyName("");
    setEffectiveDate("");
    setMRP("");
  };

  return (
    <Row>
      <Col md={12}>
        <Card className="text-black">
          <CardBody style={{ backgroundColor: "whitesmoke" }}>
            <Row className="mt-3">
              <Col className=" col col-11 ">
                <Row>
                  <FormGroup className=" col col-sm-3 ">
                    <Label>Division</Label>
                    <Select
                      id={`dropDivision-${0}`}
                      value={division}
                      options={Division_DropdownOptions}
                      onChange={DivisiontHandler}
                    />
                  </FormGroup>

                  <FormGroup className="mb-3 col col-sm-3 ">
                    <Label>Party Name</Label>
                    <Select
                      id={`dropPartyName-${0}`}
                      value={partyName}
                      options={Party_DropdownOptions}
                      onChange={PartyNameHandler}
                    />
                  </FormGroup>

                  <FormGroup className="mb-3 col col-sm-3 ">
                    <Label>Effective Date</Label>
                    <div id={`txtEffectiveDate${0}`}>
                      <Flatpickr
                        id={`txtEffectiveDate${0}`}
                        value={effectiveDate}
                        className="form-control d-block p-2 bg-white text-dark"
                        placeholder="YYYY-MM-DD"
                        autoComplete="off"
                        options={{
                          altInput: true,
                          altFormat: "F j, Y",
                          dateFormat: "Y-m-d",
                        }}
                        onChange={EffectiveDateHandler}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="mb-3 col col-sm-3 ">
                    <Label>MRP</Label>
                    <Input
                      type="text"
                      id={`txtMRP${0}`}
                      value={MRP}
                      placeholder="Please Enter Margin"
                      onChange={MRPHandler}
                    />
                  </FormGroup>
                </Row>
              </Col>
              <Col md={1}>
                <Row className=" mt-3">
                  <Col >
                    <Button
                     className="btn btn-sm mt-1 mt-3 btn-light  btn-outline-primary  "
                      type="button"
                      onClick={addRowsHandler}
                    >
                      <i className="dripicons-plus"></i> Add
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Row>
          <MRPTable tableData={props.tableData} func={props.func} />
        </Row>
      </Col>
    </Row>
  );
}

export default MRPTab;
