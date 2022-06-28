import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import { Card, CardBody, Col, Container, Row, Label, Input } from "reactstrap";

import { AvForm, AvInput, AvGroup } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
// import {
//   getItemCategory,
//   getItemSubCategory,
//   postBaseUnit,
// } from "../../store/actions";
// import OrderList from "../Sale/OrderList";
import UnitTable from "./UnitTable";

const AddItemMaster = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    // dispatch(postBaseUnit());
    // dispatch(getItemCategory());
  }, [dispatch]);

  const [baseUN, setbaseUN] = useState("");
  const [category, setCategory] = useState("qq");
  const [subCategory, setSubCategory] = useState("qq");

  const  baseUnit=[]
    const  itemSubCategory=[]
      const  itemCategoryData=[]
  // const { baseUnit, itemCategoryData, itemSubCategory } = useSelector(
  //   (state) => ({
  //     baseUnit: state.addMaster.baseUnit,
  //     itemCategoryData: state.addMaster.itemCategoryData,
  //     itemSubCategory: state.addMaster.itemSubCategory,
  //   })
  // );
  const [data, setdata] = useState([]);
  // console.log("itemSubCategory", itemSubCategory);
  const [unittables, setSubCategory1] = useState(<></>);


  const itemCategoryOptions = itemCategoryData.map((d) => ({
    value: d.ID,
    label: d.Name,
  }));
  const itemSubCategoryOptions = itemSubCategory.map((d) => ({
    value: d.ID,
    label: d.Name,
  }));
  const baseUnitValues = baseUnit.map((d) => ({
    value: d.ID,
    label: d.Name,
  }));
  const handleValidSubmit = (event, values) => {

  };
  function handllerItemcategory(e) {
    setCategory(e);
    console.log("handllerItemcategory", e.value);
    // dispatch(getItemSubCategory(e.value));
  }
  var unittables1 = <></>;

  function handllerBaseUnit(e) {
    //unittables1=<UnitTable baseUnit={baseUnit} />
    setbaseUN(e);
    baseUnit.forEach(element => {
      if (e.label === element.Name) {
        element.defaultValue = 1;
      }
      else {
        element.defaultValue = 0;
      }
    });
    setdata(baseUnit);
  }
  // console.log("democonsol",unittables1)



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"item "} breadcrumbItem={"Item Master "} />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm
                    onValidSubmit={(e, v) => {
                      handleValidSubmit(e, v);
                    }}
                  >
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-3 col-form-label">
                          ItemName
                        </Label>
                        <Col sm={4}>
                          <AvInput
                            name="ItemName"
                            placeholder=""
                            value={""}
                            place
                          />
                        </Col>
                      </Row>
                    </AvGroup>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label
                          htmlFor="horizontal-password-input"
                          className="col-sm-3 col-form-label"
                        >
                          Short Name
                        </Label>
                        <Col sm={4}>
                          <AvInput name="ShortName" type="" value={""} place />
                        </Col>
                      </Row>
                    </AvGroup>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label
                          htmlFor="horizontal-password-input"
                          className="col-sm-3 col-form-label"
                        >
                          HSN Code
                        </Label>
                        <Col sm={4}>
                          <AvInput name="HSNCode" value={""} />
                        </Col>
                      </Row>
                    </AvGroup>
                    <AvGroup></AvGroup>
                    <Row className="mb-4">
                      <Label className="col-sm-3 col-form-label">
                        Base Unit
                      </Label>
                      <Col sm={4}>
                        <Select
                          value={baseUN}
                          required
                          options={baseUnitValues}
                          onChange={(e) => {
                            handllerBaseUnit(e);
                          }}
                        />
                      </Col>
                    </Row>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-3 col-form-label">
                          Item Category
                        </Label>
                        <Col sm={4}>
                          <Select
                            value={category}
                            required
                            options={itemCategoryOptions}
                            onChange={(e) => {
                              handllerItemcategory(e);
                            }}
                          />
                        </Col>
                      </Row>
                    </AvGroup>{" "}
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-3 col-form-label">
                          Item SubCategory
                        </Label>
                        <Col sm={4}>
                          <Select
                            value={subCategory}
                            required
                            options={itemSubCategoryOptions}
                            onChange={(e) => {
                              setSubCategory(e);
                            }}
                          />
                        </Col>
                      </Row>
                    </AvGroup>
                    <Row className="mb-4">
                      <Label className="col-sm-3 col-form-label">
                        Is Active
                      </Label>
                      <Col sm={4}>
                        {" "}
                        <AvInput
                          type="checkbox"
                          value={"pagetype"}
                          name="IsActive"
                          //   onSelect={()=>{
                          //   if(pagetype===1){setIsActive(0)}else{setIsActive(1)}
                          //   }}
                          className="form-control"
                        />
                      </Col>
                    </Row>
                    <Col sm={6}>
                      <UnitTable baseUnit={baseUnit} baseUN={baseUN} data={data} />
                    </Col>
                    <Row className="justify-content-end">
                      <Col sm={2}>
                        <div>
                          <button
                            type="submit"
                            className="btn btn-success w-md"
                          >
                            Save
                          </button>
                          <button
                            
                            className="btn btn-success w-md"
                          >
                            clear
                          </button>
                        </div>
                      </Col>{" "}
                      <Col sm={10}></Col>
                    </Row>
                  </AvForm>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddItemMaster;
