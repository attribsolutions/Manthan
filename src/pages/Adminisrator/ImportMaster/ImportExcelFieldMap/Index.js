import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {
    BreadcrumbShowCountlabel,
    commonPageField,
    commonPageFieldSuccess
} from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { mySearchProps } from "../../../../components/Common/SearchBox/MySearch";
import * as pageId from "../../../../routes/allPageID";
import * as mode from "../../../../routes/PageMode";
import { Change_Button, Go_Button, PageLoadingSpinner, SaveButton } from "../../../../components/Common/CommonButton";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { comAddPageFieldFunc, initialFiledFunc, } from "../../../../components/Common/validationFunction";
import { getPartyListAPI } from "../../../../store/Administrator/PartyRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
// import { GoButton_ImportFiledMap_Add, GoButton_ImportFiledMap_AddSuccess, save_ImportFiledMap, save_ImportFiledMap_Success } from "../../../../store/Administrator/ImportExportFieldMapRedux/action";
import {
    GoButton_ImportFiledMap_Add,
    GoButton_ImportFiledMap_AddSuccess,
    save_ImportFiledMap,
    save_ImportFiledMap_Success
} from "../../../../store/Administrator/ImportExportFieldMapRedux/action";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import PartyDropdown_Common from "../../../../components/Common/PartyDropdown";
import { C_Select } from "../../../../CustomValidateForm";

const ImportExcelFieldMap = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const userAdminRole = _cfunc.loginUserAdminRole();

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [partySelect, SetPartySelect] = useState("")

    const fileds = {
        id: "",
        Party: "",
        ImportType: "",
        PatternType: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        userAccess,
        goButtonItem,
        goBtnLoading,
        partyDropDownLoading,
        partyList,
        saveBtnLoading
    } = useSelector((state) => ({
        postMsg: state.ImportExportFieldMap_Reducer.postMsg,

        saveBtnLoading: state.ImportExportFieldMap_Reducer.saveBtnLoading,
        goBtnLoading: state.ImportExportFieldMap_Reducer.goBtnLoading,

        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        goButtonItem: state.ImportExportFieldMap_Reducer.addGoButton,

        partyList: state.PartyMasterReducer.partyList,
        partyDropDownLoading: state.PartyMasterReducer.goBtnLoading,

    }));

    useEffect(() => {
        const page_Id = pageId.IMPORT_EXCEL_FIELD_MAP
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyListAPI());
        dispatch(GoButton_ImportFiledMap_AddSuccess([]));
        if (!userAdminRole) { goButtonHandler() }
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
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
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(save_ImportFiledMap_Success({ Status: false }))
            customAlert({
                Type: 1,
                Message: postMsg.Message,
            })


        }
        else if (postMsg.Status === true) {
            dispatch(save_ImportFiledMap_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])


    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`${"Count"} :${goButtonItem.length}`))
    }, [goButtonItem])

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [goButtonItem]);


    const pagesListColumns = [
        {
            text: "Field Name",
            dataField: "FieldName",
        },
        {
            text: "Data Type",
            dataField: "ControlTypeName",
        },
        {
            text: "Field Validation",
            dataField: "FieldValidationName",
        },
        {
            text: "Related Key Field",
            dataField: "Value",
            formatter: (cellContent, row) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    type="text"
                                    key={`Value-${row.id}`}
                                    defaultValue={cellContent}
                                    onChange={(e) => row.Value = e.target.value}
                                />
                            </FormGroup>
                        </Col>
                    </div>

                </>
            ),
        },

    ];

    async function goButtonHandler() {

        let partyId = !userAdminRole ? _cfunc.loginPartyID() : partySelect.value;
        const jsonBody = JSON.stringify({
            PartyID: partyId,
            CompanyID: _cfunc.loginCompanyID()
        })
        dispatch(GoButton_ImportFiledMap_Add({ jsonBody }))
    };

    function change_ButtonHandler(e) {
        dispatch(GoButton_ImportFiledMap_AddSuccess([]))
    }

    function SaveHandler(event) {
        event.preventDefault();

        let jsonArr = []
        const invalid = []
        let partyId = ((_cfunc.loginIsSCMCompany() === 1)) ? _cfunc.loginPartyID() : partySelect.value;
        goButtonItem.forEach(i => {

            if ((((i.Value === '') || (i.Value === null)) && (i.IsCompulsory === true))) {
                invalid.push({ [i.FieldName]: "this filed Requird." })
            }
            if ((!(i.Value === '') && !(i.Value === null))) {
                const obj = {
                    Value: i.Value,
                    ImportField: i.id,
                    Party: partyId,
                    Company: _cfunc.loginCompanyID(),
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                }
                jsonArr.push(obj)
            }
        })

        if (invalid.length > 0) {
            customAlert({ Type: 3, Message: invalid })
            return
        } else {
            const jsonBody = JSON.stringify(jsonArr);
            dispatch(save_ImportFiledMap({ jsonBody }));
        }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <PageLoadingSpinner isLoading={((partyDropDownLoading && (userAdminRole)) || !pageField)} />


                <div className="page-content">
                    {userAdminRole &&
                        // <PartyDropdown_Common pageMode={pageMode}
                        //     partySelect={partySelect}
                        //     setPartyFunc={partyOnChngeHandler}
                        //     goButtonHandler={goButtonHandler}
                        //     changeBtnShow={!(goButtonItem.length === 0)}
                        //     change_ButtonHandler={change_ButtonHandler}
                        // />
                        <div className="px-2   c_card_filter text-black" >
                            <div className="row pt-2">
                                <Col sm="5">
                                    <FormGroup className="row px-1">
                                        <Label className="col-sm-5 p-2" style={{ width: "83px" }}>
                                            Party
                                        </Label>
                                        <Col sm="6">
                                            <C_Select
                                                value={partySelect}
                                                isSearchable={true}
                                                isLoading={partyDropDownLoading}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={partyList.map((data) => ({
                                                    value: data.id,
                                                    label: data.Name,
                                                }))}

                                                onChange={(e) => { SetPartySelect(e) }}
                                                styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col sm="1" className="mb-1">
                                    {(goButtonItem.length === 0) ?
                                        <Go_Button
                                            loading={goBtnLoading}
                                            onClick={goButtonHandler} />
                                        :
                                        <Change_Button onClick={change_ButtonHandler} />
                                    }
                                </Col>
                            </div>
                        </div>
                    }
                    <div >
                        <ToolkitProvider
                            keyField="id"
                            data={goButtonItem}
                            columns={pagesListColumns}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <div className="table mt-1">
                                        <BootstrapTable
                                            bordered={true}
                                            striped={false}
                                            id="table_Arrow"
                                            noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                                            classes={"table align-middle  table-hover"}
                                            headerWrapperClasses={"thead-light"}

                                            {...toolkitProps.baseProps}
                                        />
                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>
                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>
                    </div>
                </div>

                <FormGroup>
                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                        {(goButtonItem.length > 0) &&
                            <SaveButton
                                pageMode={pageMode}
                                loading={saveBtnLoading}
                                userAcc={userPageAccessState}
                                onClick={SaveHandler}
                            />}
                    </Col>
                </FormGroup >

            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default ImportExcelFieldMap
