import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { Change_Button, Go_Button, SaveButton, } from "../../../components/Common/CommonButton";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, postSelect_Field_for_dropdown } from "../../../store/actions";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { C_Select } from "../../../CustomValidateForm";
import { ItemWiseUpdateGoButton_Action, ItemWiseUpdateGoButton_Success, ItemWiseUpdate_Save_Action, ItemWiseUpdate_Save_Success } from "../../../store/Administrator/ItemWiseUpdateRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const ItemMasterBulkUpdate = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [SelectFieldName, setSelectFieldName] = useState([]);

    const reducers = useSelector(
        (state) => ({
            SelectDropdown: state.PartyMasterBulkUpdateReducer.SelectField,
            goBtnLoading: state.ItemWiseUpdateReducer.loading,
            goButtonData: state.ItemWiseUpdateReducer.goButtonData,
            postMsg: state.ItemWiseUpdateReducer.postMsg,
            saveBtnloading: state.ItemWiseUpdateReducer.saveBtnloading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );
    const { userAccess, SelectDropdown, goBtnLoading, goButtonData = [], postMsg, saveBtnloading } = reducers;

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
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(ItemWiseUpdateGoButton_Success([]));
        }
    }, [])

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
            dispatch(ItemWiseUpdateGoButton_Success([]));
            setSelectFieldName([])
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

    const SelectDropdownOptions = SelectDropdown.map(i => ({
        value: i.id,
        label: i.Name
    }));

    function goButtonHandler() {

        if (SelectFieldName.length === 0) {
            customAlert({
                Type: 4,
                Message: "Field selection is required."
            })
            return;
        }
        const jsonBody = JSON.stringify({ "Type": SelectFieldName.label });
        dispatch(ItemWiseUpdateGoButton_Action(jsonBody))
    }

    function SelectFieldHandler(event) {
        setSelectFieldName(event)
    }

    function tableSelectHandler(event, user) {
        let input = event.target.value;
        user.Newvalue = input
    }

    const pagesListColumns = [
        {
            text: "Name",
            dataField: "ItemName",
        },
        {
            text: SelectFieldName.label,
            dataField: SelectFieldName.label,
        },

    ]

    const Newvalue = {

        text: `New${SelectFieldName.label === undefined ? "Value" : SelectFieldName.label}`,
        dataField: "Newvalue",

        formatter: (cellContent, user, key) => (
            <>
                {(SelectFieldName.label === "ShortName" ||
                    SelectFieldName.label === "ShelfLife" ||
                    SelectFieldName.label === "BarCode" ||
                    SelectFieldName.label === "SAPItemCode" ||
                    SelectFieldName.label === "Sequence"||
                    SelectFieldName.label === "Breadth" ||
                    SelectFieldName.label === "Grammage" ||
                    SelectFieldName.label === "Height" ||
                    SelectFieldName.label === "Length" ||
                    SelectFieldName.label === "StoringCondition" )&&
                    <div style={{ width: "180px" }}>
                        <Col>
                            <FormGroup >
                                <Input
                                    id={key}
                                    type="text"
                                    placeholder={`Enter New ${SelectFieldName.label}`}
                                    defaultValue={user.Newvalue}
                                    className="col col-sm "
                                    onChange={(event) => tableSelectHandler(event, user)}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                }
            </>
        )
    }

    pagesListColumns.push(Newvalue)

    const SaveHandler = (event) => {

        event.preventDefault();
        const btnId = event.target.id;
        try {
            const updatedData = [];

            goButtonData.forEach(i => {
                if (i.Newvalue) {
                    const arr = {
                        ItemID: i.ItemID,
                        Value1: i.Newvalue,
                    };
                    updatedData.push(arr);
                }
            });

            if (updatedData.length === 0) {
                customAlert({
                    Type: 3,
                    Message: "Update At least One Field"
                });
                return;
            }

            const responseData = {
                Type: SelectFieldName.label==="ShelfLife"?"Days": SelectFieldName.label,
                UpdatedData: updatedData
            };

            const jsonBody = JSON.stringify(responseData);
            dispatch(ItemWiseUpdate_Save_Action(jsonBody));
        } catch (e) {
            _cfunc.btnIsDissablefunc({ btnId, state: false });
        }
    };

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <form noValidate>

                    <div className="px-3 c_card_filter header text-black mb-1" >

                        <Row>
                            <Col sm="6">
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

                            <Col sm="6">
                                <FormGroup className=" row mt-2 " >
                                    <Col sm="1" className="mx-6">
                                        {goButtonData.length === 0 ?
                                            <Go_Button
                                                onClick={goButtonHandler}
                                                loading={goBtnLoading}
                                            />
                                            :
                                            <Change_Button onClick={(e) => { dispatch(ItemWiseUpdateGoButton_Success([])) }} />
                                        }

                                    </Col>
                                </FormGroup>
                            </Col >

                        </Row>
                    </div>

                    <div className="mt-1">
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
                                            <div className="table-responsive table">
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
                        <FormGroup className="row row-cols-2 save1" >
                            <Row >
                                <Col sm={2} className="mt-n4">
                                    <SaveButton pageMode={pageMode}
                                        loading={saveBtnloading}
                                        onClick={SaveHandler}
                                        userAcc={userPageAccessState}
                                        module={"PartyMasterBulkUpdate"}
                                    />
                                </Col>
                            </Row>
                        </FormGroup >
                    }
                </form>

            </div>

        </React.Fragment >
    )
}

export default ItemMasterBulkUpdate;