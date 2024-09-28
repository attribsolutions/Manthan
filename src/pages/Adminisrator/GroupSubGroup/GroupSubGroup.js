import React, { useState, useEffect, useRef } from 'react';
import { Card, Col, FormGroup, Label, Row, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, UncontrolledDropdown, Form, Spinner } from 'reactstrap';
import { DndProvider, useDrag, useDrop, useDragLayer } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SaveButtonDraggable from '../../../components/Common/saveButtonDraggable';
import { Udate_Group_Subgroup, get_SubGroup_Group } from '../../../helpers/backend_helper';
import { breadcrumbReturnFunc } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { mode } from '../../../routes';
import { useHistory } from "react-router-dom";
import { customAlert } from '../../../CustomAlert/ConfirmDialog';
import Select from "react-select";
import { getGroupTypeslist } from '../../../store/Administrator/GroupTypeRedux/action';
import { getGroupList } from '../../../store/actions';
import SimpleBar from "simplebar-react"
import { C_Button } from '../../../components/Common/CommonButton';

const ItemType = {
    ITEM: 'item',
    GROUP: 'group',
};

const Add_SubGroup = ({ addItem, groupName, items }) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [New_subGroup, setNew_SubGroup] = useState("");


    const inputRef = useRef(null);

    const toggleDropdown = () => {

        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        if (dropdownOpen && inputRef.current) {

            inputRef.current.focus();
        }
    }, [dropdownOpen]);



    return (
        <div>
            <UncontrolledDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle type="button" tag="span">
                    <Button
                        style={{ width: "30px", height: "30px", borderRadius: "50%", paddingBottom: "3px", paddingTop: "5px", paddingLeft: "7px", marginTop: "4px", boxShadow: '0px 1px 5px 1px grey', marginLeft: "10px" }}
                        color="btn  border-2 font-size-8"
                        id={`btn_${groupName}_id`}
                        onClick={toggleDropdown}
                        type="button"
                    >
                        <i className="dripicons-plus align-center"></i>
                    </Button>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-md p-4" style={{ marginTop: "11px" }}>
                    <Form>
                        <div className="mb-2">
                            <Label className="form-label" htmlFor="exampleDropdownFormEmail">Sub Product</Label>
                            <Input ref={inputRef}
                                type="text" className="form-control"
                                value={New_subGroup}
                                onChange={(e) => { setNew_SubGroup(e.target.value) }}
                                placeholder="Enter Sub Product" />
                        </div>
                        <button type="button" id={`Add_btn_${groupName}_id`} onClick={() => { addItem({ New_subGroup: New_subGroup, groupName: groupName, GroupID: items[0]?.GroupID }); setDropdownOpen(false); setNew_SubGroup("") }} className="btn btn-primary">Add</button>
                    </Form>
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    );
};

const DragLayer = () => {
    const { itemType, isDragging, item, currentOffset } = useDragLayer((monitor) => ({
        itemType: monitor.getItemType(),
        isDragging: monitor.isDragging(),
        item: monitor.getItem(),
        currentOffset: monitor.getClientOffset(),
    }));

    if (!isDragging || !currentOffset) {
        return null;
    }

    const { x, y } = currentOffset;

    const renderItem = () => {
        if (itemType === ItemType.ITEM) {
            return (
                <div style={{ padding: '4px', margin: '4px', display: 'inline-block' }}>
                    <span style={{ boxShadow: '0px 1px 5px 1px grey', borderRadius: '7px', padding: '5px', background: 'white', opacity: 0.8 }}>
                        {item.item.label}
                    </span>
                </div>
            );
        } else if (itemType === ItemType.GROUP) {
            return (
                <Card style={{ background: '#d2d6f7', paddingBottom: '15px', paddingLeft: '13px', paddingRight: '13px', borderRadius: '13px', boxShadow: '0px 1px 5px 1px grey', opacity: 0.8 }}>
                    <FormGroup>
                        <Label style={{ marginTop: '10px', marginLeft: '10px' }}>{item.groupName.charAt(0).toUpperCase() + item.groupName.slice(1)} Group</Label>
                        <div style={{ minHeight: '10px', padding: '8px', display: 'flex', flexWrap: 'wrap', borderRadius: '12px', background: '#e5e7ed', boxShadow: '0px 1px 5px 1px grey' }}>
                            {item.items.map((subItem) => (
                                <div key={subItem.value} style={{ padding: '4px', margin: '4px', display: 'inline-block' }}>
                                    <span style={{ boxShadow: '0px 1px 5px 1px grey', borderRadius: '7px', padding: '5px', background: 'white', opacity: 0.8 }}>
                                        {subItem.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </FormGroup>
                </Card>
            );
        }
        return null;
    };

    return (
        <div style={{ position: 'fixed', pointerEvents: 'none', left: 0, top: 0, width: '100%', height: '100%', zIndex: 100 }}>
            <div style={{ transform: `translate(${itemType === ItemType.GROUP ? 260 : x}px, ${y}px)` }}>
                {renderItem()}
            </div>
        </div>
    );
};

const DraggableItem = ({ item, index, groupName, moveItemWithinGroup }) => {
    const [cursorStyle, setCursorStyle] = useState('grab');


    const [{ isDragging }, ref, preview] = useDrag({
        type: ItemType.ITEM,
        item: { item, index, groupName },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemType.ITEM,
        hover: (draggedItem) => {
            if (draggedItem.index !== index && draggedItem.groupName === groupName) {
                moveItemWithinGroup(draggedItem.index, index, groupName);
                draggedItem.index = index;
            }
        },
    });

    const handleMouseDown = () => {
        setCursorStyle('grabbing');
    };

    const handleMouseUp = () => {
        setCursorStyle('grab');
    };

    return (
        <>
            <div ref={(node) => ref(drop(node))} style={{ padding: '4px', margin: '4px', display: 'inline-block', opacity: isDragging ? 0 : 1 }}>
                <span onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp} style={{ cursor: isDragging ? "grabbing" : cursorStyle, boxShadow: '0px 1px 5px 1px grey', borderRadius: '7px', padding: '5px', background: 'white' }}>
                    {item.label}
                </span>
            </div>
            <div ref={preview} style={{ display: 'none' }} />
        </>
    );
};

const DroppableContainer = ({ items, groupName, moveItem, moveItemWithinGroup, addItem }) => {

    const [, ref] = useDrop({
        accept: ItemType.ITEM,
        drop: (draggedItem) => {
            if (draggedItem.groupName !== groupName) {
                moveItem(draggedItem.item, draggedItem.groupName, groupName);
            }
        },
    });

    return (
        <div ref={ref} style={{ minHeight: '10px', padding: '8px', display: 'flex', flexWrap: 'wrap', borderRadius: '12px', background: '#e5e7ed', boxShadow: '0px 1px 5px 1px grey' }}>
            {items.map((item, index) => (

                <DraggableItem key={item.value} item={item} index={index} groupName={groupName} moveItemWithinGroup={moveItemWithinGroup} />
            ))}
            {/* <Add_SubGroup addItem={addItem} groupName={groupName} items={items} /> */}
        </div>
    );
};


const UnAsginItemDroppableContainer = ({ items, groupName, moveItem, moveItemWithinGroup, addItem }) => {
    const UnAsginItemItems = (items["UnAssign"] === undefined) ? [] : items["UnAssign"];

    const [, ref] = useDrop({
        accept: ItemType.ITEM,
        drop: (draggedItem) => {
            if (draggedItem.groupName !== groupName) {
                moveItem(draggedItem.item, draggedItem.groupName, groupName);
            }
        },
    });

    return (
        <div ref={ref} style={{ minHeight: '10px', padding: '8px', display: 'flex', flexWrap: 'wrap', borderRadius: '12px', background: '#e5e7ed', boxShadow: '0px 1px 5px 1px grey' }}>
            {UnAsginItemItems?.map((item, index) => (
                //   {  console.log(item.value)}
                <DraggableItem key={item.value} item={item} index={index} groupName={groupName} moveItemWithinGroup={moveItemWithinGroup} />
            ))}
            {/* <Add_SubGroup addItem={addItem} groupName={groupName} items={items} /> */}
        </div>
    );
};





const DraggableGroup = ({ groupName, items, index, moveGroup, moveItem, moveItemWithinGroup, addItem, Type }) => {

    const [{ isDragging }, ref, preview] = useDrag({
        type: ItemType.GROUP,
        item: { groupName, index, items },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemType.GROUP,
        hover: (draggedGroup) => {
            if (draggedGroup.index !== index) {
                moveGroup(draggedGroup.index, index);
                draggedGroup.index = index;
            }
        },
    });

    return (
        <>
            <div ref={(node) => Type === "Group" && ref(drop(node))} style={{ opacity: isDragging ? 0 : 1 }}>
                <Card style={{ background: '#d2d6f7', paddingBottom: '15px', paddingLeft: '13px', paddingRight: '13px', borderRadius: '13px', boxShadow: '0px 1px 5px 1px grey' }}>
                    <FormGroup>
                        <Label style={{ marginTop: '10px', marginLeft: '10px' }}>{groupName.charAt(0).toUpperCase() + groupName.slice(1)} </Label>
                        <DroppableContainer items={items} groupName={groupName} moveItem={moveItem} moveItemWithinGroup={moveItemWithinGroup} addItem={addItem} />
                    </FormGroup>
                </Card>
            </div>
            <div ref={preview} style={{ display: 'none' }} />
        </>
    );
};

const GroupSubGroup = (props) => {
    const [groups, setGroups] = useState({});

    const [SubGroups, setSubGroups] = useState({ UnAssign: [] });


    const [UnAssign, setUnAssign] = useState([]);


    const [orderedSubGroups, setOrderedSubGroups] = useState([]);

    const [SequenceSubGroupItem, setSequenceSubGroupItem] = useState({});




    const [orderedGroups, setOrderedGroups] = useState([]);
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userPageAccessState, setUserAccState] = useState('');
    const [GroupType, setGroupType] = useState({ label: "Select...", value: "" });
    const [Group, setGroup] = useState({ label: "Select...", value: "" });



    const dispatch = useDispatch();
    const history = useHistory()

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const { userAccess, GroupTypeAPI, groupList } = useSelector((state) => ({
        userAccess: state.Login.RoleAccessUpdateData,
        GroupTypeAPI: state.GroupTypeReducer.GroupType,
        groupList: state.GroupReducer.groupList,
    }));


    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserAccState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])





    const fetchData = async () => {

        const GroupType_id = JSON.stringify({ GroupType_id: GroupType.value })
        const response = await get_SubGroup_Group({ GroupType_id })
        return response.Data
    }



    const fetchGroups = async () => {
        const response = await fetchData()
        //   Set initial sequence  based on array 
        response.sort((a, b) => {
            if (a.GroupSequence === b.GroupSequence) {
                if ((a.SubGroupSequence === "" || a.SubGroupSequence === null)) return 1;
                if ((b.SubGroupSequence === "" || b.SubGroupSequence === null)) return -1;
                return parseFloat(a.SubGroupSequence) - parseFloat(b.SubGroupSequence);
            } else {
                if ((a.GroupSequence === "" || a.GroupSequence === null)) return 1;
                if ((b.GroupSequence === "" || b.GroupSequence === null)) return -1;
                return parseFloat(a.GroupSequence) - parseFloat(b.GroupSequence);
            }
        });

        const groupedData = response.reduce((acc, item, index) => {

            let group = acc.find(g => g.GroupID === item.GroupID);
            if (!group) {
                group = {
                    GroupID: item.GroupID,
                    GroupName: item.GroupName,
                    GroupSequence: item.GroupSequence,
                    SubgroupDetails: []
                };
                acc.push(group);
            }

            group.SubgroupDetails.push({
                value: item.SubGroupID,
                label: item.SubGroupName,
                SubGroupSequence: item.SubGroupSequence,
                GroupID: item.GroupID,
                GroupName: item.GroupName,
                GroupSequence: item.GroupSequence,
                Items: item.Items.map(obj => ({
                    ...obj,
                    PriviousGroup_ID: null,
                    PriviousSubGroup_ID: null,  // initiall  set null 
                }))
            });
            return acc;
        }, []);



        // Sort SubgroupDetails based on SubGroupSequence within each group 
        groupedData.forEach(group => {
            group.SubgroupDetails.sort((a, b) => a.SubGroupSequence - b.SubGroupSequence);
        });

        try {

            // Replace with your API endpoint
            const transformedData = transformData(groupedData);
            setGroups(transformedData);
            setOrderedGroups(Object.keys(transformedData));
        } catch (error) {
            setError(error.message);
        }
    };



    useEffect(async () => {
        dispatch(getGroupList())
        dispatch(getGroupTypeslist())
    }, []);

    useEffect(() => {

        if (GroupType.value !== "") {
            setGroup({ label: "Select...", value: "" })
            fetchGroups();
        }
    }, [GroupType])


    useEffect(async () => {

        let response = []
        if ((Group.value !== "")) {

            setUnAssign(SubGroups["UnAssign"])
            if (GroupType.value !== "") {
                response = await fetchData()
            }
            let nullGroupItems = [];
            const groupedData = response.reduce((acc, item, index) => {
                let group = {}


                if ((item.GroupID === Group.value)) {
                    group = {
                        GroupID: item.SubGroupID,
                        GroupName: item.SubGroupName,
                        GroupSequence: item.SubGroupSequence,
                        SubgroupDetails: item.Items.map((inx, i) => ({
                            value: inx.ItemID,
                            label: inx.ItemName,
                            SubGroupSequence: i + 1,    // set item Sequence based on  Index  From backend order by sequence so index will match the Sequence
                            GroupID: item.SubGroupID,
                            GroupName: item.SubGroupName,
                            GroupSub_ID: item.GroupID
                        }))
                    };
                    acc.push(group);
                }

                if (item.GroupID === null && item.SubGroupID === null) {
                    nullGroupItems = nullGroupItems.concat(item.Items.map(inx => inx));
                }
                return acc;
            }, []);

            // Sort SubgroupDetails based on SubGroupSequence within each group
            groupedData.forEach(group => {
                group.SubgroupDetails.sort((a, b) => a.SubGroupSequence - b.SubGroupSequence);
            });

            let transformedData = transformData(groupedData);
            const updatedNullItems = nullGroupItems.map((item, index) => {

                return {
                    ...item,
                    value: item.ItemID,
                    label: item.ItemName,
                    GroupID: null,
                    GroupName: null,
                    SubGroup: null,
                    SubGroupID: null,
                };
            });
            if (SubGroups["UnAssign"] !== undefined) {
                transformedData["UnAssign"] = updatedNullItems?.concat(SubGroups["UnAssign"]);
            }
            debugger
            transformedData["UnAssign"] = transformedData["UnAssign"].filter((item, index, self) =>
                index === self.findIndex((i) => i.ItemID === item.ItemID)
            );

            setSubGroups(transformedData);
            setOrderedSubGroups(Object.keys(transformedData));
        }
    }, [Group])

    useEffect(() => {

        setSequenceSubGroupItem((prevSubGroups) => ({
            ...prevSubGroups,
            ...SubGroups
        }));

    }, [SubGroups])



    const transformData = (data) => {
        return data.reduce((acc, group) => {
            acc[group.GroupName] = group.SubgroupDetails;
            return acc;
        }, {});
    };

    const moveItem = (item, sourceGroupName, targetGroupName) => {

        if (sourceGroupName === targetGroupName) return;
        setGroups((prevGroups) => {
            const sourceGroup = prevGroups[sourceGroupName].filter((i) => i.value !== item.value);
            const targetGroupdata = [...prevGroups[targetGroupName]];

            item = { GroupID: targetGroupdata[0]?.GroupID, GroupName: targetGroupdata[0]?.GroupName, GroupSequence: 2, SubGroupSequence: item.GroupSequence, label: item.label, value: item.GroupSequence }
            const targetGroup = [...prevGroups[targetGroupName], item];

            return {
                ...prevGroups,
                [sourceGroupName]: sourceGroup,
                [targetGroupName]: targetGroup,
            };
        });
    };



    const moveSubGroupItem = (item, sourceGroupName, targetGroupName) => {

        if (sourceGroupName === targetGroupName) return;
        setSubGroups((prevGroups) => {
            prevGroups["UnAssign"] ? prevGroups["UnAssign"] = prevGroups["UnAssign"] : prevGroups["UnAssign"] = []

            let sourceGroup = []
            if (sourceGroupName === "UnAssign") {

                sourceGroup = prevGroups[sourceGroupName].filter((i) => i.label !== item.label);
            } else {
                sourceGroup = prevGroups[sourceGroupName].filter((i) => i.value !== item.value);
            }
            let PriviousGroup_ID = null
            let PriviousSubGroup_ID = null

            if (item.hasOwnProperty('PriviousGroup_ID') || item.hasOwnProperty('PriviousSubGroup_ID')) {
                PriviousGroup_ID = item.PriviousGroup_ID
                PriviousSubGroup_ID = item.PriviousSubGroup_ID
            } else {
                PriviousGroup_ID = sourceGroup[0]?.GroupID
                PriviousSubGroup_ID = sourceGroup[0]?.GroupSub_ID
            }

            const targetGroupdata = [...prevGroups[targetGroupName]];
            // here Group ID is SUB Group ID AND Sub Group ID IS GRoup ID Swap only key field  not value
            item = { GroupID: targetGroupdata[0]?.GroupID, GroupName: targetGroupdata[0]?.GroupName, SubGroupSequence: item.SubGroupSequence, label: item.label, value: item.value, PriviousGroup_ID: PriviousGroup_ID, PriviousSubGroup_ID: PriviousSubGroup_ID }
            const targetGroup = [...prevGroups[targetGroupName], item];

            return {
                ...prevGroups,
                [sourceGroupName]: sourceGroup,
                [targetGroupName]: targetGroup,
            };
        });
    };


    const moveItemWithinGroup = (sourceIndex, targetIndex, groupName) => {

        setGroups((prevGroups) => {
            const updatedGroup = Array.from(prevGroups[groupName]);
            const [movedItem] = updatedGroup.splice(sourceIndex, 1);
            updatedGroup.splice(targetIndex, 0, movedItem);

            return {
                ...prevGroups,
                [groupName]: updatedGroup,
            };
        });
    };



    const moveItemWithinSubGroup = (sourceIndex, targetIndex, groupName) => {

        setSubGroups((prevGroups) => {
            const updatedGroup = Array.from(prevGroups[groupName]);
            const [movedItem] = updatedGroup.splice(sourceIndex, 1);
            updatedGroup.splice(targetIndex, 0, movedItem);
            return {
                ...prevGroups,
                [groupName]: updatedGroup,
            };
        });
    };



    const moveGroup = (sourceIndex, targetIndex) => {
        setOrderedGroups((prevOrderedGroups) => {
            const updatedOrderedGroups = Array.from(prevOrderedGroups);
            const [movedGroup] = updatedOrderedGroups.splice(sourceIndex, 1);
            updatedOrderedGroups.splice(targetIndex, 0, movedGroup);
            return updatedOrderedGroups;
        });
    };

    const moveSubGroup = (sourceIndex, targetIndex) => {
        setOrderedSubGroups((prevOrderedGroups) => {
            const updatedOrderedGroups = Array.from(prevOrderedGroups);
            const [movedGroup] = updatedOrderedGroups.splice(sourceIndex, 1);
            updatedOrderedGroups.splice(targetIndex, 0, movedGroup);
            return updatedOrderedGroups;
        });
    };



    const addItem = ({ New_subGroup, groupName, GroupID }) => {

        const newItem = { value: "", label: `${New_subGroup}`, GroupID: GroupID, GroupName: groupName, };
        setGroups((prevGroups) => ({
            ...prevGroups,
            [groupName]: [...prevGroups[groupName], newItem],
        }));
    };

    const addSubGroupItem = ({ New_subGroup, groupName, GroupID }) => {
        const newItem = { value: "", label: `${New_subGroup}`, GroupID: GroupID, GroupName: groupName, };
        setSubGroups((prevGroups) => ({

            ...prevGroups,
            [groupName]: [...prevGroups[groupName], newItem],
        }));
    };




    const SaveHandler = async () => {
        setSaveLoading(true)

        let combinedArray = [];
        orderedGroups.forEach(groupName => {
            combinedArray = combinedArray.concat(groups[groupName]);
        });

        // const GroupSequence = orderedGroups.indexOf(group) + 1
        let currentGroupID = null;
        let subGroupCounter = 0;



        const transformedSubgroups = combinedArray.map((subgroup, index) => {
            if (subgroup.GroupID !== currentGroupID) {
                currentGroupID = subgroup.GroupID;
                subGroupCounter = 0; // Reset counter when GroupID changes
            }
            subGroupCounter++
            currentGroupID = subgroup.GroupID;
            const matchedKey = Object.keys(SequenceSubGroupItem).find(key => subgroup.label === key);
            if (matchedKey) {

            }

            const items = matchedKey
                ? SequenceSubGroupItem[matchedKey].map((item, index) => ({
                    ItemID: item.value,
                    ItemName: item.label,
                    ItemSequence: index + 1,
                    PriviousSubGroup_ID: item.PriviousGroup_ID ? item.PriviousGroup_ID : null,
                    PriviousGroup_ID: item.PriviousSubGroup_ID ? item.PriviousSubGroup_ID : null  // ID is is swap for coad reduction   
                }))
                : [];
            const Obj = {
                GroupID: subgroup.GroupID,
                GroupName: subgroup.GroupName,
                GroupSequence: orderedGroups.indexOf(subgroup.GroupName) + 1,
                SubGroupSequence: subGroupCounter,
                SubGroup: subgroup.label,
                SubGroupID: subgroup.value,
                Items: (items.length === 0 && (matchedKey === undefined)) ? subgroup.Items : items,
                GroupTypeID: GroupType.value
            };



            return Obj
        });




        console.log("groups", groups)
        console.log("orderedGroups", orderedGroups)
        console.log("Subgroups", SubGroups)
        console.log("orderedSubGroups", orderedSubGroups)
        console.log("SequenceSubGroupItem", SequenceSubGroupItem)
        console.log("transformedData", transformedSubgroups);

        const filteredArray = transformedSubgroups.filter(item => (item.GroupID !== null) && (item.SubGroupID !== null));

        const jsonBody = JSON.stringify(filteredArray)
        const response = await Udate_Group_Subgroup({ jsonBody })
        if (response.StatusCode === 200 && response.Status === true) {
            fetchGroups();
            customAlert({
                Type: 1,
                Message: JSON.stringify(response.Message),
            })
            setSaveLoading(false)
        } else {
            customAlert({
                Type: 4,
                Message: JSON.stringify(response.Message),
            })
            setSaveLoading(false)
        }

    }
    const GroupTypesValues = GroupTypeAPI.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    let GroupValues = groupList.filter(item => GroupType.value === item.GroupType)
        .map(item => ({
            value: item.id,
            label: item.Name
        }));

    return (
        <div className="page-content" >
            <DndProvider backend={HTML5Backend}>
                <DragLayer />
                <Row >
                    <Col sm={12} style={{ position: "sticky", top: "3px", zIndex: '2' }} >
                        <Card style={{ background: '#c2c2dbf5', paddingBottom: '4px', paddingLeft: '13px', paddingRight: '13px', borderRadius: '13px', boxShadow: '0px 1px 5px 1px grey', }}>

                            <Row>
                                <Col sm={3} className="">
                                    <FormGroup className=" row mt-2  " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "90px" }}>Group Type</Label>
                                        <Col sm="7">
                                            <Select
                                                name="GroupTypeName"
                                                value={GroupType}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={GroupTypesValues}
                                                onChange={(e) => {
                                                    setGroupType(e);
                                                    setOrderedGroups([]);
                                                    setOrderedSubGroups([]);
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3} className="">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "65px" }}>Group</Label>
                                        <Col sm="7">
                                            <Select
                                                name="GroupName"
                                                value={Group}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={GroupValues}
                                                onChange={(e) => {
                                                    setGroup(e);
                                                    setOrderedSubGroups([]);
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>


                                {((orderedSubGroups.length > 0) || (orderedGroups.length > 0)) && <Col sm={6} className=" d-flex justify-content-end" >
                                    <C_Button
                                        type="button"
                                        spinnerColor="white"
                                        className="btn btn-outline-primary border-1 font-size-14 text-center m-2"
                                        onClick={() => {
                                            setOrderedSubGroups([])
                                            setOrderedGroups([])
                                        }}
                                    >
                                        Reset Sequence
                                    </C_Button>
                                </Col>}
                            </Row>

                        </Card>
                    </Col>


                    {((orderedGroups.length > 0) && Group.value === "") ? orderedGroups.map((groupName, index) => (
                        <Col key={groupName} xs={Group.value === "" ? 12 : 12}  >
                            <DraggableGroup
                                groupName={groupName}
                                items={groups[groupName]}
                                index={index}
                                Type={"Group"}
                                moveGroup={moveGroup}
                                moveItem={moveItem}
                                moveItemWithinGroup={moveItemWithinGroup}
                                addItem={addItem}
                            />
                        </Col>
                    )) :
                        <>
                            <Row>
                                {orderedSubGroups.length > 0 ? (
                                    <Col xs={9} st >
                                        <SimpleBar className="" style={{ maxHeight: "75vh", padding: "3px" }}>
                                            {orderedSubGroups.map((groupName, index) => (
                                                (groupName !== "UnAssign") && <DraggableGroup
                                                    key={groupName}
                                                    groupName={groupName}
                                                    items={SubGroups[groupName]}
                                                    index={index}
                                                    Type={"SubGroup"}
                                                    moveGroup={moveSubGroup}
                                                    moveItem={moveSubGroupItem}
                                                    moveItemWithinGroup={moveItemWithinSubGroup}
                                                    addItem={addSubGroupItem}
                                                />
                                            ))}
                                        </SimpleBar>
                                    </Col>
                                ) : <Col xs={9}></Col>}

                                {Group.value !== "" && <Col sm={3} style={{ position: 'sticky', top: '100px', zIndex: '2' }}>
                                    <SimpleBar className="" style={{ maxHeight: "75vh", padding: "3px" }}>

                                        <Card
                                            style={{
                                                background: '#d2d6f7',
                                                paddingBottom: '15px',
                                                paddingLeft: '13px',
                                                paddingRight: '13px',
                                                borderRadius: '13px',
                                                boxShadow: '0px 1px 5px 1px grey'
                                            }}
                                        >
                                            <FormGroup>
                                                <Label style={{ marginTop: '10px', marginLeft: '10px' }}> </Label>
                                                <UnAsginItemDroppableContainer
                                                    items={SubGroups}
                                                    groupName={"UnAssign"}
                                                    moveItem={moveSubGroupItem}
                                                    moveItemWithinGroup={moveItemWithinSubGroup}
                                                    addItem={addItem}

                                                />
                                            </FormGroup>
                                        </Card>
                                    </SimpleBar>

                                </Col>}
                            </Row>
                        </>

                    }

                </Row>
                {((orderedSubGroups.length > 0) || (orderedGroups.length > 0)) ? <SaveButtonDraggable>
                    {saveLoading ?
                        <button
                            title={`Save Loading`}
                            className="btn btn-primary w-md"
                        >  Saving.. &nbsp;
                            <Spinner style={{ height: "13px", width: "13px" }} color="white" />
                        </button>

                        : <button
                            title={`Save `}
                            className="btn btn-primary w-md"
                            onClick={SaveHandler}
                        > <i className="fas fa-save me-2"></i> Save
                        </button>}
                </SaveButtonDraggable> : null}
            </DndProvider>
        </div >
    );
};

export default GroupSubGroup;






