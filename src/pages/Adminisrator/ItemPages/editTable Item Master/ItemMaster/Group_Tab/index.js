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
import { getGroupTypeslist } from "../../../../../store/Administrator/GroupTypeRedux/action";
import GroupTable from "./Table";
import { get_Group_By_GroupType_ForDropDown, get_Sub_Group_By_Group_ForDropDown } from "../../../../../store/Administrator/ItemsRedux/action";

function GroupTab(props) {
    const dispatch = useDispatch();
    const [groupTypeDropdownSelect, setGroupTypeDropdownSelect] = useState("");
    const [groupDropdownSelect, setGroupDropdownSelect] = useState("");
    const [subGroupDropdownSelect, setSubGroupDropdownSelect] = useState("");

    const { GroupType, GroupList, SubGroupList } = useSelector((state) => ({
        GroupType: state.GroupTypeReducer.GroupType,
        GroupList: state.ItemMastersReducer.GroupList,
        SubGroupList: state.ItemMastersReducer.SubGroupList,
    }));

    useEffect(() => {
        dispatch(getGroupTypeslist());
        dispatch(get_Group_By_GroupType_ForDropDown());
        dispatch(get_Sub_Group_By_Group_ForDropDown());
    }, [dispatch]);

    const GroupType_DropdownOptions = GroupType.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const Group_DropdownOptions = GroupList.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const SubGroup_DropdownOptions = SubGroupList.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const GroupType_Handler = (event) => {
        setGroupTypeDropdownSelect(event);
        dispatch(get_Group_By_GroupType_ForDropDown(event.value))
    };

    const Group_Handler = (event) => {
        setGroupDropdownSelect(event);
        dispatch(get_Sub_Group_By_Group_ForDropDown(event.value))
    };

    const SubGroup_Handler = (event) => {
        setSubGroupDropdownSelect(event);
    };

    const addRowsHandler = (e) => {
        debugger;
        const val = {
            GroupType: groupTypeDropdownSelect === "" ? "" : groupTypeDropdownSelect.value,
            GroupTypeName: groupTypeDropdownSelect.label,
            Group: groupDropdownSelect === "" ? "" : groupDropdownSelect.value,
            GroupName: groupDropdownSelect.label,
            SubGroup: subGroupDropdownSelect === "" ? "" : subGroupDropdownSelect.value,
            SubGroupName: subGroupDropdownSelect.label,
        };

        if (!(groupTypeDropdownSelect === "")) {
            const totalTableData = props.tableData.length;
            val.id = totalTableData + 1;
            const updatedTableData = [...props.tableData];
            updatedTableData.push(val);
            props.func(updatedTableData);
            clearState();
        } else {
            alert("Please select value");
        }
    };
    const clearState = () => {
        setGroupTypeDropdownSelect("");
        setGroupDropdownSelect("");
        setSubGroupDropdownSelect("");
    };

    return (
        <Row>
            <Col md={12}>
                <Card className="text-black">
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                        <Row className="mt-3">
                            <Col className=" col col-11 ">
                                <Row>
                                    <FormGroup className=" col col-sm-4 ">
                                        <Label>Group Type</Label>
                                        <Select
                                            id={`dropGroupType-${0}`}
                                            value={groupTypeDropdownSelect}
                                            options={GroupType_DropdownOptions}
                                            onChange={GroupType_Handler}
                                        />
                                    </FormGroup>

                                    <FormGroup className="mb-3 col col-sm-4 ">
                                        <Label>Group</Label>
                                        <Select
                                            id={`dropGroup-${0}`}
                                            value={groupDropdownSelect}
                                            options={Group_DropdownOptions}
                                            onChange={Group_Handler}
                                        />
                                    </FormGroup>

                                    <FormGroup className="mb-3 col col-sm-4 ">
                                        <Label>Sub Group</Label>
                                        <Select
                                            id={`dropSubGroup-${0}`}
                                            value={subGroupDropdownSelect}
                                            options={SubGroup_DropdownOptions}
                                            onChange={SubGroup_Handler}
                                        />
                                    </FormGroup>

                                </Row>
                            </Col>
                            <Col md={1}>
                                <Row className=" mt-3">
                                    <Col md={6}>
                                        <Button
                                            className="btn btn-sm btn-light mt-3   align-items-sm-end"
                                            type="button"
                                            onClick={addRowsHandler}
                                        >
                                            <i className="dripicons-plus"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Row>
                    <GroupTable tableData={props.tableData} func={props.func} />
                </Row>
            </Col>
        </Row>
    );
}

export default GroupTab;
