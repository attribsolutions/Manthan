import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { Change_Button, Go_Button, SaveButton, } from "../../../components/Common/CommonButton";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, get_Group_By_GroupType_ForDropDown, get_Group_By_GroupType_ForDropDown_Success, postSelect_Field_for_dropdown } from "../../../store/actions";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { C_Select } from "../../../CustomValidateForm";
import { ItemWiseUpdateGoButton_Action, ItemWiseUpdateGoButton_Success, ItemWiseUpdate_Save_Action, ItemWiseUpdate_Save_Success } from "../../../store/Administrator/ItemWiseUpdateRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { getGroupTypeslist, getGroupTypeslistSuccess } from "../../../store/Administrator/GroupTypeRedux/action";
import { SubGroup_By_Group_DropDown_API } from "../../../helpers/backend_helper";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";

const ItemMasterBulkUpdate = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [SelectFieldName, setSelectFieldName] = useState([]);
    const [groupTypeSelect, setGroupTypeSelect] = useState({ value: 1, label: "Primary" });
    const [forceRefresh, setForceRefresh] = useState(false);

    const reducers = useSelector(
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
            pageField: state.CommonPageFieldReducer.pageField
        })
    );
    const { userAccess, SelectDropdown, goBtnLoading, goButtonData = [], postMsg, saveBtnloading, GroupType, GroupList, GroupTypeLoading } = reducers;

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

    // Select Dropdown GeneralMasterSubType api call
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 102
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

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
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    function SelectFieldHandler(event) {
        setSelectFieldName(event);
    }

    function tableSelectHandler(event, row) {
        let input = event.target.value;
        row.Newvalue = input
    }

    function GroupTypeHandler(event) {
        setGroupTypeSelect(event)
        dispatch(get_Group_By_GroupType_ForDropDown(event.value))
    }

    const GroupNameHandler = async (GroupID, row) => {

        try {
            const response = await SubGroup_By_Group_DropDown_API(GroupID.value);
            if (response.StatusCode === 200) {

                row.Newvalue = GroupID.value
                row.selectGroup = GroupID
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
        row.NewSubGroup = event.value
    }

    const createAndSortDropdownOptions = (list, valueKey = 'id', labelKey = 'Name') => {
        return list
            .map(item => ({ value: item[valueKey], label: item[labelKey] }))
            .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
    };

    //  function to handle the goButtonHandler logic
    const handleGoButton = () => {
        if (SelectFieldName.length === 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.fieldSelectionIsRequired
            });
            return;
        }

        if (SelectFieldName.label === "Group" && groupTypeSelect.length === 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.groupTypeIsRequired
            });
            return;
        }

        const jsonBody = JSON.stringify({
            "Type": SelectFieldName.label,
            "GroupType": groupTypeSelect.value
        });

        dispatch(ItemWiseUpdateGoButton_Action(jsonBody));
    };

    //  function to create the Newvalue column
    const createNewValueColumn = () => {
        return {
            text: `New${SelectFieldName.label === undefined ? "Value" : SelectFieldName.label}`,
            dataField: "Newvalue",
            formatExtraData: { forceRefresh },
            formatter: (cellContent, row, key) => {
                return (
                    <>
                        {SelectFieldName.label === "Group" ?

                            <div style={{ width: "180px" }}>
                                <Col>
                                    <FormGroup>
                                        <C_Select
                                            key={row.Newvalue}
                                            value={(row?.selectGroup === "") ? { value: "", label: "Select..." } : row.selectGroup}
                                            options={Group_DropdownOptions}
                                            onChange={(event) => GroupNameHandler(event, row, key)}
                                        />
                                    </FormGroup>
                                </Col>
                            </div>
                            :
                            <div style={{ width: "180px" }}>
                                <Col>
                                    <FormGroup>
                                        <Input
                                            id={key}
                                            type="text"
                                            placeholder={`Enter New ${SelectFieldName.label}`}
                                            defaultValue={row.Newvalue}
                                            className="col col-sm "
                                            onChange={(event) => tableSelectHandler(event, row)}
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

    const SelectDropdownOptions = createAndSortDropdownOptions(SelectDropdown);
    const GroupType_DropdownOptions = createAndSortDropdownOptions(GroupType, 'id', 'Name');
    const Group_DropdownOptions = createAndSortDropdownOptions(GroupList, 'id', 'Name');

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

            goButtonData.forEach(i => {

                if (i.Newvalue) {
                    const arr = {
                        ItemName: i.ItemName,
                        ItemID: i.id,
                        Value1: i.Newvalue,
                        Value2: i.NewSubGroup

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
                    Type: SelectFieldName.label,
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
                                            options={SelectDropdownOptions}
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
                                        {goButtonData.length === 0 ?
                                            <Go_Button
                                                onClick={handleGoButton}
                                                loading={goBtnLoading}
                                            />
                                            :
                                            <Change_Button onClick={(e) => {
                                                dispatch(ItemWiseUpdateGoButton_Success([]));

                                            }} />
                                        }

                                    </Col>
                                </FormGroup>
                            </Col >

                        </Row>
                    </div>

                    <div className="mt-1" style={{ minHeight: "45vh" }}>
                        <ToolkitProvider
                            keyField="id"
                            data={goButtonData}
                            columns={pagesListColumns}
                            search
                        >
                            {(toolkitProps,) => (
                                <React.Fragment>
                                    <Row>
                                        <Col xl="12">
                                            <div className="table-responsive table" style={{ minHeight: "55vh" }}>
                                                <BootstrapTable
                                                    keyField="id"
                                                    classes={"table  table-bordered table-hover"}
                                                    noDataIndication={
                                                        <div className="text-danger text-center ">
                                                            Record Not available
                                                        </div>
                                                    }
                                                    onDataSizeChange={({ dataSize }) => {
                                                        dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
                                                    }}
                                                    {...toolkitProps.baseProps}


                                                />
                                                {mySearchProps(toolkitProps.searchProps)}
                                            </div>
                                        </Col>
                                    </Row>

                                </React.Fragment>
                            )}
                        </ToolkitProvider>
                    </div>

                    {goButtonData.length > 0 &&
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