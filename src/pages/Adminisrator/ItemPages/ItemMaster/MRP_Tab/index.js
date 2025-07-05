import React, { useEffect, useState } from "react";
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
import { loginUserID, loginCompanyID, loginSystemSetting, getSettingBasedPartyTypeID, loginRoleID } from "../../../../../components/Common/CommonFunction";
import { customAlert } from "../../../../../CustomAlert/ConfirmDialog";
import { C_DatePicker } from "../../../../../CustomValidateForm";
import { alertMessages } from "../../../../../components/Common/CommonErrorMsg/alertMsg";
// import { Select } from "react-select/dist/Select-fd7cb895.cjs.prod";
import { useDispatch, useSelector } from "react-redux";
import { priceListByPartyAction } from "../../../../../store/Administrator/PriceList/action";
import { onChangeSelect } from "../../../../../components/Common/validationFunction";
import Select from "react-select";
import { getPartyTypelist } from "../../../../../store/Administrator/PartyTypeRedux/action";


function MRPTab(props) {
  const dispatch = useDispatch();


  const {

    PartyTypes,
    pageField,

  } = useSelector((state) => ({

    PartyTypes: state.PartyTypeReducer.ListData,

  }));

  const [division, setDivision] = useState("");
  const [partyName, setPartyName] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [MRP, setMRP] = useState("");

  const [state, setState] = useState("")
  const [PartyType, setPartyType] = useState(null);

  const [priceListSelect, setPriceListSelect] = useState({ value: '' });


  const EffectiveDateHandler = (e, date) => {
    setEffectiveDate(date);
  };

  const MRPHandler = (event) => {
    setMRP(event.target.value);
  };


  useEffect(() => {
    dispatch(getPartyTypelist());
  }, []);

  const addRowsHandler = (e) => {
    const val = {
      Division: division === "" ? "" : division.value,
      DivisionName: division?.label || "",
      PartyName: partyName?.label || "",
      Party: partyName === "" ? "" : partyName?.value || "",
      EffectiveDate: effectiveDate,
      MRP: MRP,

      // ✅ Store PartyTypeID and PartyTypeName separately
      PartyType: PartyType?.value || "",
      PartyTypeName: PartyType?.label || "",

      CreatedBy: loginUserID(),
      UpdatedBy: loginUserID(),
      Company: loginCompanyID(),
      IsDeleted: 0,
      CommonID: 0,
      IsAdd: true,
    };
    val.id = props?.tableData.length + 1; // ✅ Assign a unique ID based on the current length of tableData


    if (!(effectiveDate === "") && !(MRP === "") && PartyType?.value) {
      const updatedTableData = [...props.tableData, val];   // ✅ Direct push
      props.func(updatedTableData);
      clearState();
    } else {
      customAlert({ Type: 4, Message: alertMessages.enterValue });
    }
  };




  const clearState = () => {
    setDivision("");
    setPartyName("");
    setEffectiveDate("");
    setMRP("");
    setPartyType(null);  // ✅ clear selected PartyType
  };


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



  return (
    <Row>
      <Col md={12}>
        <Card className="text-black">
          <CardBody className="c_card_body">
            <Row className="mt-3">


              <div className="mb-3 col col-sm-3">
                <Label>PartyType</Label>
                <Select
                  name="PartyType"
                  value={PartyType}
                  isSearchable={true}
                  options={PartyTypeDropdown_Options}
                  className="react-dropdown"
                  classNamePrefix="dropdown"
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                  }}
                  onChange={partyTypeOnChange}
                />




              </div>

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
