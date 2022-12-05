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
import { AlertState } from "../../../../../store/actions";

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

        debugger
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
                AlertState({
                    Type: 4,
                    Status: true,
                    Message: "Please Select GroupType value...!",
                    RedirectPath: false,
                    PermissionAction: false,
                })
            );
            return;
        }
         if ((groupDropdownSelect.value === undefined) ){
            dispatch(
                AlertState({
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
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                        <Row className="mt-6">
                            <Col className="col-11 ">
                                <Row>
                                    <FormGroup className="col-sm-4 ">
                                        <Label>Group Type</Label>
                                        <Select

                                            // id={`dropGroupType-${0}`}
                                            value={groupTypeDropdownSelect}
                                            options={GroupType_DropdownOptions}
                                            onChange={GroupType_Handler}
                                        />
                                    </FormGroup>

                                    <FormGroup className=" col col-sm-4 ">
                                        <Label>Group</Label>
                                        <Select
                                            // id={`dropGroup-${0}`}
                                            value={groupDropdownSelect}
                                            options={Group_DropdownOptions}
                                            onChange={Group_Handler}
                                        />
                                    </FormGroup>

                                    <FormGroup className="mb-3 col col-sm-4 ">
                                        <Label>Sub Group</Label>
                                        <Select
                                            // id={`dropSubGroup-${0}`}
                                            value={subGroupDropdownSelect}
                                            options={SubGroup_DropdownOptions}
                                            onChange={SubGroup_Handler}
                                        />
                                    </FormGroup>

                                </Row>
                            </Col>
                            <Col md={1}>

                                <Row className=" mt-3">
                                    <Col >
                                        <Button
                                            className="button_add badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light "
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
