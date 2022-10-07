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
import { useDispatch, useSelector } from "react-redux";
import {
    get_Division_ForDropDown,
} from "../../../../../store/Administrator/ItemsRedux/action";
import { AlertState } from "../../../../../store/actions";
import DivisionTable from "./Table";

function DivisionTab(props) {
    const dispatch = useDispatch();
    const [divisionDropdownSelect, setDivisionDropdownSelect] = useState("");

    const { DivisionName } = useSelector((state) => ({
        DivisionName: state.ItemMastersReducer.Division,
    }));

    useEffect(() => {
        dispatch(get_Division_ForDropDown());
    }, [dispatch]);

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

        const totalTableData = props.tableData.length;
        val.id = totalTableData + 1;
        const updatedTableData = [...props.tableData];
        updatedTableData.push(val);
        props.func(updatedTableData);
        clearState();
        //     if (!(divisionDropdownSelect === "")) {
        //         const totalTableData = props.tableData.length;
        //         val.id = totalTableData + 1;
        //         const updatedTableData = [...props.tableData];
        //         updatedTableData.push(val);
        //         props.func(updatedTableData);
        //         clearState();
        //     }
        //     else {
        //         alert("Please select value");
        //     }
        // };
        const find = updatedTableData.find((element) => {
            return element.value === e.Division
        });
        console.log("find", find)
        if (divisionDropdownSelect.length <= 0) {

            dispatch(AlertState({
                Type: 3, Status: true,
                Message: "Select One Role",
            }));
        }
        else if (find === undefined) {
            // document.getElementById("dropDivision-0").className = ""
            // setDivisionTableData([...props.tableData, divisionDropdownSelect]);
          
        }
        else {
            document.getElementById("dropDivision-0").className = ""
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: "DivisionType already Exists ",
            }));
        }
    }
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
