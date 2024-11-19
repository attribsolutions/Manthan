import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    Col,
    FormGroup,
    Label,
    Row,
} from "reactstrap";
import Select from "react-select";
import { useSelector } from "react-redux";
import DivisionTable from "./Table";

function DivisionTab(props) {
    const [divisionDropdownSelect, setDivisionDropdownSelect] = useState("");

    const { DivisionName } = useSelector((state) => ({
        DivisionName: state.ItemMastersReducer.Division,
    }));

    const Division_DropdownOptions = DivisionName.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const Division_Handler = (event) => {
        setDivisionDropdownSelect(event);
    };

    const addRowsHandler = (e) => {

        const val = {
            Division: divisionDropdownSelect === "" ? "" : divisionDropdownSelect.value,
            DivisionName: divisionDropdownSelect.label,
        };

        if (!(divisionDropdownSelect === "")) {
            const totalTableData = props.tableData.length;
            val.id = totalTableData + 1;
            const updatedTableData = [...props.tableData];
            updatedTableData.push(val);
            props.func(updatedTableData);
            clearState();
        }
        else {
            alert("Please select value");
        }
    };

    const clearState = () => {
        setDivisionDropdownSelect("");
    };

    return (
        <Row>
            <Col md={12}>
                <Card className="text-black">
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                        <Row className="mt-3">

                            <Row>
                                <FormGroup className="mb-3 col col-sm-4 ">
                                    <Label>Division</Label>
                                    <Select
                                        id={`dropDivision-${0}`}
                                        value={divisionDropdownSelect}
                                        options={Division_DropdownOptions}
                                        onChange={Division_Handler}
                                    />
                                </FormGroup>

                                <Col md={1}>
                                    <Row className=" mt-3">
                                        <Col >
                                            <Button
                                                className="btn btn-sm mt-1 mt-3 btn-light  btn-outline-primary  "
                                                type="button"
                                                onClick={addRowsHandler}
                                            >
                                                <i className="dripicons-plus mt-3"> </i> Add
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Row>
                    </CardBody>
                </Card>
                <Row>
                    <DivisionTable tableData={props.tableData} func={props.func} />
                </Row>
            </Col>

        </Row>
    );
}

export default DivisionTab;
