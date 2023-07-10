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
import {
    get_Group_By_GroupType_ForDropDown,
    get_Sub_Group_By_Group_ForDropDown,
    get_Sub_Group_By_Group_ForDropDown_Success
} from "../../../../../store/Administrator/ItemsRedux/action";
import { customAlert } from "../../../../../CustomAlert/ConfirmDialog";

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
    }, [dispatch]);

    const GroupType_DropdownOptions = GroupType.map((index) => ({
        value: index.id,
        label: index.Name,
        IsReserved: index.IsReserved
    }));

    const Group_DropdownOptions = GroupList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const SubGroup_DropdownOptions = SubGroupList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const GroupType_Handler = (event) => {
        const found = props.tableData.find(element => {
            return element.GroupType == event.value
        });
        if (found == undefined) {
            setGroupTypeDropdownSelect(event);
            dispatch(get_Group_By_GroupType_ForDropDown(event.value))
            dispatch(get_Sub_Group_By_Group_ForDropDown_Success([]))
            setGroupDropdownSelect([]);
            setSubGroupDropdownSelect([]);

        }
        else {
            alert(`${event.label} Is Already Selected...!`)
        }
    };

    const Group_Handler = (event) => {

        const found = props.tableData.find(element => {
            return element.Group == event.value
        });
        if (found == undefined) {
            setGroupDropdownSelect(event);
            dispatch(get_Sub_Group_By_Group_ForDropDown(event.value))
            setSubGroupDropdownSelect([]);
        }
        else {
            alert(`${event.label} Is Already Selected...!`)
        }
    };

    const SubGroup_Handler = (event) => {
        setSubGroupDropdownSelect(event);
    };

    const addRowsHandler = (e) => {
        const val = {
            GroupType: groupTypeDropdownSelect === "" ? "" : groupTypeDropdownSelect.value,
            GroupTypeName: groupTypeDropdownSelect.label,
            Group: groupDropdownSelect === "" ? "" : groupDropdownSelect.value,
            GroupName: groupDropdownSelect.label,
            SubGroup: subGroupDropdownSelect === "" ? "" : subGroupDropdownSelect.value,
            SubGroupName: subGroupDropdownSelect.label,
        };
        if ((groupTypeDropdownSelect.value === undefined)) {
            dispatch(
                customAlert({
                    Type: 4,
                    Status: true,
                    Message: "Please Select GroupType value...!",
                    RedirectPath: false,
                    PermissionAction: false,
                })
            );
            return;
        }
        if ((groupDropdownSelect.value === undefined)) {
            dispatch(
                customAlert({
                    Type: 4,
                    Status: true,
                    Message: "Please Select Group value...!",
                    RedirectPath: false,
                    PermissionAction: false,
                })
            );
            return;
        }
        else {
            const totalTableData = props.tableData.length;
            val.id = totalTableData + 1;
            const updatedTableData = [...props.tableData];
            updatedTableData.push(val);
            props.func(updatedTableData);
            clearState();
        }

    };

    const clearState = () => {
        setGroupTypeDropdownSelect("");
        setGroupDropdownSelect("");
        setSubGroupDropdownSelect("");
    };

    return (

        <Row style={{ marginBottom: "" }}>

            <Col md={12} >
                <Card className="text-black" >
                    <CardBody className="c_card_body">
                        <Row className="mt-6">
                            <Col className="col-11 ">
                                <Row>
                                    <FormGroup className="col-sm-4 ">
                                        <Label>Group Type</Label>
                                        <Select
                                            value={groupTypeDropdownSelect}
                                            options={GroupType_DropdownOptions}
                                            onChange={GroupType_Handler}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                        />
                                    </FormGroup>

                                    <FormGroup className=" col col-sm-4 ">
                                        <Label>Group</Label>
                                        <Select
                                            value={groupDropdownSelect}
                                            options={Group_DropdownOptions}
                                            onChange={Group_Handler}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                        />
                                    </FormGroup>

                                    <FormGroup className="mb-3 col col-sm-4 ">
                                        <Label>Sub Group</Label>
                                        <Select
                                            value={subGroupDropdownSelect}
                                            options={SubGroup_DropdownOptions}
                                            onChange={SubGroup_Handler}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                        />
                                    </FormGroup>

                                </Row>
                            </Col>
                            <Col md={1}>
                                <Row className="mt-3 ">
                                    <Col >
                                        <Button
                                            className=" button_add"
                                            color="btn btn-outline-primary border-2 font-size-12"
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
