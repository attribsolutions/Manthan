import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { Change_Button, Go_Button, SaveButton, } from "../../../components/Common/CommonButton";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../routes/index"
import { MetaTags } from "react-meta-tags";
import {
    BreadcrumbShowCountlabel,
    commonPageField,
    commonPageFieldSuccess,
    getBaseUnit_ForDropDown,
    get_Group_By_GroupType_ForDropDown,
    get_Group_By_GroupType_ForDropDown_Success,
    postSelect_Field_for_dropdown
} from "../../../store/actions";
import { CInput, C_Select, charRegx, decimalRegx } from "../../../CustomValidateForm";
import {
    ItemWiseUpdateGoButton_Action,
    ItemWiseUpdateGoButton_Success,
    ItemWiseUpdate_Save_Action,
    ItemWiseUpdate_Save_Success
} from "../../../store/Administrator/ItemWiseUpdateRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import {
    getGroupTypeslist,
    getGroupTypeslistSuccess
} from "../../../store/Administrator/GroupTypeRedux/action";
import { SubGroup_By_Group_DropDown_API } from "../../../helpers/backend_helper";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import GlobalCustomTable from "../../../GlobalCustomTable"

const ItemMasterBulkUpdate = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [SelectFieldName, setSelectFieldName] = useState([]);
    const [groupTypeSelect, setGroupTypeSelect] = useState({ value: 1, label: "Primary" });
    const [forceRefresh, setForceRefresh] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [selectFieldNameDropOptions, setSelectFieldNameDropOptions] = useState([]);

    const [fieldNameDropOptions, setFieldNameDropOptions] = useState([]);



    const { userAccess,
        SelectDropdown,
        goBtnLoading,
        goButtonData = [],
        postMsg,
        saveBtnloading,
        GroupType,
        GroupList,
        GroupTypeLoading,
        BaseUnit } = useSelector(
            (state) => ({
                GroupType: state.GroupTypeReducer.GroupType,
                GroupTypeLoading: state.GroupTypeReducer.goBtnLoading,
                GroupList: state.ItemMastersReducer.GroupList,
                SelectDropdown: state.PartyMasterBulkUpdateReducer.SelectField,
                goBtnLoading: state.ItemWiseUpdateReducer.loading,
                goButtonData: state.ItemWiseUpdateReducer.goButtonData,
                postMsg: state.ItemWiseUpdateReducer.postMsg,
                saveBtnloading: state.ItemWiseUpdateReducer.saveBtnloading,
                userAccess: state.Login.RoleAccessUpdateData,
                BaseUnit: state.ItemMastersReducer.BaseUnit,
                pageField: state.CommonPageFieldReducer.pageField
            })
        );

    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    // userAccess useEffect
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
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    // Select Dropdown GeneralMasterSubType api call
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 102
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    useEffect(() => {
        if (GroupList.length > 0 && SelectFieldName.label === "Group") {
            setSelectFieldNameDropOptions(createAndSortDropdownOptions(GroupList, 'id', 'Name'))
        }
        else if (BaseUnit.length > 0 && SelectFieldName.label === "SAPUnit") {
            setSelectFieldNameDropOptions(createAndSortDropdownOptions(BaseUnit, 'id', 'Name'))
        }
    }, [SelectFieldName, GroupList, BaseUnit])

    useEffect(() => {
        if (SelectDropdown.length > 0) {
            const updatedDropdown = SelectDropdown.map(item => {
                if (["Group", "SAPUnit"].includes(item.Name)) {
                    return { ...item, DataType: "dropdown" };
                } else if (["BarCode", "Length", "Breadth", "ShelfLife", "SAPItemCode", "Sequence", "Height"].includes(item.Name)) {
                    return { ...item, DataType: "number" };
                } else {
                    return { ...item, DataType: "string" };
                }
            });

            setFieldNameDropOptions(updatedDropdown.map(data => ({
                value: data.id,
                label: data.Name,
                DataType: data.DataType
            })));
        }
    }, [SelectDropdown]);

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.ITEM_MASTER_BULK_UPDATE));
        dispatch(getGroupTypeslist());

        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(ItemWiseUpdateGoButton_Success([]));
            dispatch(getGroupTypeslistSuccess([]));
            dispatch(get_Group_By_GroupType_ForDropDown_Success([]));
        }
    }, [])

    useEffect(() => {
        if (SelectFieldName.label === "Group") {
            dispatch(get_Group_By_GroupType_ForDropDown(groupTypeSelect.value))
        }
    }, [SelectFieldName])

    useEffect(() => {

        if (goButtonData.length > 0 && SelectFieldName.label === "SAPUnit") {
            const updatedGoButtonData = goButtonData.map((i) => {
                const matchingBaseUnit = BaseUnit.find((index) => Number(i.SAPUnitID) === index.id);

                // If a match is found, update i.SAPUnitID with index.Name
                if (matchingBaseUnit) {
                    return {
                        ...i,
                        SAPUnit: matchingBaseUnit.Name
                    };
                }
                return i;
            });
            setTableData(updatedGoButtonData);
        } else {
            setTableData(goButtonData);
        }
    }, [goButtonData, SelectFieldName])

    useEffect(() => {
        if (SelectFieldName.label === "SAPUnit") {
            dispatch(getBaseUnit_ForDropDown());
        }
    }, [SelectFieldName])

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(ItemWiseUpdate_Save_Success({ Status: false }));
            handleGoButton()
            customAlert({
                Type: 1,
                Message: postMsg.Message,
            })
        }
        else if (postMsg.Status === true) {
            dispatch(ItemWiseUpdate_Save_Success({ Status: false }));
            dispatch(ItemWiseUpdateGoButton_Success([]));
            setTableData([])
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    function SelectFieldHandler(event) {
        setSelectFieldName(event);
        setGroupTypeSelect({ value: 1, label: "Primary" })
    }

    //  function to handle the goButtonHandler logic
    const handleGoButton = () => {

        if (SelectFieldName.length === 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.fieldSelectionIsRequired
            });
            return;
        }

        const jsonBody = JSON.stringify({
            "Type": SelectFieldName.label === "SAPUnit" ? "SAPUnitID" : SelectFieldName.label,
            "GroupType": groupTypeSelect.value
        });

        dispatch(ItemWiseUpdateGoButton_Action(jsonBody));
    };

    const AllDropdownHandler = (event, row) => {

        if (SelectFieldName.label === "Group") {
            GroupNameHandler(event, row)

        } else if (SelectFieldName.label === "SAPUnit") {
            row.Newvalue = event.value
        }
        return [];
    };

    function GroupTypeHandler(event) {
        setGroupTypeSelect(event)
        dispatch(get_Group_By_GroupType_ForDropDown(event.value))
    }

    const GroupNameHandler = async (GroupID, row) => {

        try {
            const response = await SubGroup_By_Group_DropDown_API(GroupID.value);
            if (response.StatusCode === 200) {

                row.Newvalue = GroupID.value
                row.DropdownSetValue = GroupID
                row.subGroupOptions = response.Data
                    .map(item => ({ value: item.id, label: item.Name }))
                    .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
                setForceRefresh(i => !i)

            } else {
                customAlert({
                    Type: 1,
                    Message: `${alertMessages.GroupIDError} ${GroupID.label}:`,
                });
            }
        } catch (error) {
            _cfunc.CommonConsole(`${alertMessages.GroupIDError} ${GroupID.label}:`, error);
        }
    };

    function SubGroupType_Handler(event, row) {
        row.NewValue_2 = event.value
    }

    const createAndSortDropdownOptions = (list, valueKey = 'id', labelKey = 'Name') => {
        return list
            .map(item => ({ value: item[valueKey], label: item[labelKey] }))
            .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
    };



    const GroupType_DropdownOptions = createAndSortDropdownOptions(GroupType, 'id', 'Name');

    //  function to create the Newvalue column
    const createNewValueColumn = () => {
        return {
            text: `New ${SelectFieldName.label === undefined ? "Value" : SelectFieldName.label}`,
            dataField: "Newvalue",
            formatExtraData: { forceRefresh, dropdownOptions: selectFieldNameDropOptions, tableData: tableData },
            formatter: (cellContent, row, key, { dropdownOptions, tableData }) => {

                return (
                    <>
                        {SelectFieldName.DataType === "dropdown" ?

                            <div style={{ width: "180px" }}>
                                <Col>
                                    <FormGroup>
                                        <C_Select
                                            key={row.Newvalue}
                                            value={row.DropdownSetValue}
                                            options={dropdownOptions}
                                            onChange={(event) => AllDropdownHandler(event, row, tableData)}
                                        />
                                    </FormGroup>
                                </Col>
                            </div>
                            :
                            <div style={{ width: "180px" }}>
                                <Col>
                                    <FormGroup>
                                        <CInput
                                            id={key}
                                            type="text"
                                            cpattern={(SelectFieldName.DataType === "number") ? decimalRegx : charRegx}
                                            placeholder={`Enter New ${SelectFieldName.label}`}
                                            defaultValue={row.Newvalue}
                                            className="col col-sm "
                                            onChange={(event) => {
                                                row.Newvalue = event.target.value
                                            }}
                                        />
                                    </FormGroup>
                                </Col>
                            </div>
                        }
                    </>
                );
            }
        };
    };

    //  function to create the SubGroupColumn
    const createSubGroupColumn = () => {
        return {
            text: " New SubGroup",
            dataField: "",
            formatExtraData: { forceRefresh },
            formatter: (cellContent, row) => {
                return (
                    <div style={{ width: "180px" }}>
                        <Col>
                            <FormGroup>
                                <C_Select
                                    key={row.Newvalue}
                                    options={row.subGroupOptions}
                                    onChange={(event) => SubGroupType_Handler(event, row)}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                );
            }
        };
    };

    const pagesListColumns = [
        {
            text: "Group",
            dataField: "GroupName",
        },
        {
            text: "SubGroup",
            dataField: "SubGroupName",
        },
        {
            text: "Name",
            dataField: "ItemName",
            sort: true
        },
        {
            text: SelectFieldName.label,
            dataField: SelectFieldName.label,
        },
    ];

    if (SelectFieldName.label === "Group") {
        pagesListColumns.pop();
    }

    pagesListColumns.push(createNewValueColumn());

    if (SelectFieldName.label === "Group") {
        pagesListColumns.push(createSubGroupColumn());
    }

    const SaveHandler = (event) => {

        event.preventDefault();

        try {
            const updatedData = [];

            tableData.forEach(i => {

                if (i.Newvalue) {
                    const arr = {
                        ItemName: i.ItemName,
                        ItemID: i.id,
                        Value1: i.Newvalue,
                        Value2: i.NewValue_2

                    };
                    updatedData.push(arr);
                }
            });

            if (updatedData.length === 0) {
                customAlert({
                    Type: 3,
                    Message: alertMessages.updateOneFieldIsRequired
                });
                return;
            }
            else {
                const invalidMsg1 = []
                updatedData.forEach((i) => {

                    if ((SelectFieldName.label === "Group")) {
                        if (!(i.Value2)) {
                            invalidMsg1.push({ [i.ItemName]: alertMessages.subGroupNameIsRequired })
                        }
                    };
                })

                if (invalidMsg1.length > 0) {
                    customAlert({
                        Type: 4,
                        Message: invalidMsg1
                    })
                    return
                }

                const responseData = {
                    Type: SelectFieldName.label === "SAPUnit" ? "SAPUnitID" : SelectFieldName.label,
                    UpdatedData: updatedData
                };

                const jsonBody = JSON.stringify(responseData);
                dispatch(ItemWiseUpdate_Save_Action(jsonBody));
            }
        } catch (e) { }
    };

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <form noValidate>

                    <div className="px-3 c_card_filter header text-black mb-1" >

                        <Row>
                            <Col sm="5">
                                <FormGroup className="row mt-2" >
                                    <Label className="col-sm-1 p-2"
                                        style={{ width: "115px", marginRight: "0.4cm" }}>SelectField </Label>
                                    <Col sm="7">
                                        <C_Select
                                            name="SelectField"
                                            value={SelectFieldName}
                                            isSearchable={true}
                                            isDisabled={goButtonData.length > 0 && true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={fieldNameDropOptions}
                                            onChange={(event) => SelectFieldHandler(event)}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col >

                            {SelectFieldName.label === "Group" &&
                                <Col sm="5">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>GroupType </Label>
                                        <Col sm="7">
                                            <C_Select
                                                name="groupType"
                                                value={groupTypeSelect}
                                                isSearchable={true}
                                                isDisabled={goButtonData.length > 0 && true}
                                                isLoading={GroupTypeLoading}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={GroupType_DropdownOptions}
                                                onChange={(event) => GroupTypeHandler(event)}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >}

                            <Col sm="2">
                                <FormGroup className=" row mt-2 " >
                                    <Col sm="1" className="mx-6">
                                        {tableData.length === 0 ?
                                            <Go_Button
                                                onClick={handleGoButton}
                                                loading={goBtnLoading}
                                            />
                                            :
                                            <Change_Button onClick={(e) => {
                                                dispatch(ItemWiseUpdateGoButton_Success([]));
                                                setTableData([]);

                                            }} />
                                        }

                                    </Col>
                                </FormGroup>
                            </Col >

                        </Row>
                    </div>

                    <GlobalCustomTable
                        keyField="id"
                        data={tableData}
                        columns={pagesListColumns}
                        classes={"custom-table"}
                        defaultSorted={[
                            {
                                dataField: "ItemName",
                                order: "asc",
                            },
                        ]}
                        noDataIndication={
                            <div className="text-danger text-center ">
                                Record Not available
                            </div>
                        }
                        onDataSizeChange={({ dataCount }) => {
                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                        }}
                    />

                    {tableData.length > 0 &&
                        <SaveButtonDraggable>
                            <SaveButton pageMode={pageMode}
                                loading={saveBtnloading}
                                onClick={SaveHandler}
                                userAcc={userPageAccessState}
                                module={"PartyMasterBulkUpdate"}
                            />
                        </SaveButtonDraggable>
                    }
                </form>
            </div>

        </React.Fragment >
    )
}

export default ItemMasterBulkUpdate;