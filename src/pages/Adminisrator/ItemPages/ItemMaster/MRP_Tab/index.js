import React, {useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Label,
  Row,
} from "reactstrap";
import MRPTable from "./Table";
import { loginUserID, loginCompanyID } from "../../../../../components/Common/CommonFunction";
import { customAlert } from "../../../../../CustomAlert/ConfirmDialog";
import { C_DatePicker } from "../../../../../CustomValidateForm";
import { alertMessages } from "../../../../../components/Common/CommonErrorMsg/alertMsg";

function MRPTab(props) {

  const [division, setDivision] = useState("");
  const [partyName, setPartyName] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [MRP, setMRP] = useState("");

  const EffectiveDateHandler = (e, date) => {
    setEffectiveDate(date);
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
      CreatedBy: loginUserID(),
      UpdatedBy: loginUserID(),
      Company: loginCompanyID(),
      IsDeleted: 0,
      CommonID: 0,
      IsAdd: true
    };

    if (!(effectiveDate === "") && !(MRP === "")) {
      let highestId = -Infinity;
      for (const item of props.tableData) {
          if (item.id !== undefined && item.id > highestId) {
              highestId = item.id;
          }
      }
      val.id = highestId + 1;
      const updatedTableData = [...props.tableData];
      updatedTableData.push(val);
      props.func(updatedTableData);
      clearState();
    } else {
      customAlert({ Type: 4, Message: alertMessages.enterValue })
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
          <CardBody className="c_card_body">
            <Row className="mt-3">
              <div className="mb-3 col col-sm-3 ">
                <Label>Effective Date</Label>
                <div id={`txtEffectiveDate${0}`}>
                  <C_DatePicker
                    id={`txtEffectiveDate${0}`}
                    value={effectiveDate}
                    placeholder="Please Enter EffectiveDate"
                    onChange={EffectiveDateHandler}
                    options={{
                      altInput: true,
                      altFormat: "d-m-Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                </div>
              </div>

              <div className="mb-3 col col-sm-3 ">
                <Label>MRP</Label>
                <Input
                  type="text"
                  id={`txtMRP${0}`}
                  value={MRP}
                  placeholder="Please Enter MRP"
                  onChange={MRPHandler}
                />
              </div>

              <Col sm={0}>
                <Row className=" mt-3">
                  <Col >
                    <Button
                      className=" button_add"
                      color="btn btn-outline-primary border-2 font-size-12"
                      type="button"
                      onClick={addRowsHandler} >
                      <i className="dripicons-plus"></i>
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
