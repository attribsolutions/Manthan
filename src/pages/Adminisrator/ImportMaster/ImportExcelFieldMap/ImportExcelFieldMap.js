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
import { Change_Button, Go_Button, SaveButton } from "../../../../components/Common/CommonButton";
import * as commonFunc from "../../../../components/Common/CommonFunction";
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
import { CustomAlert } from "../../../../CustomAlert/ConfirmDialog";
import * as commonFunc from "../../../../components/Common/CommonFunction";

const ImportExcelFieldMap = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

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
        updateMsg,
        pageField,
        userAccess,
        goButtonItem,
        partyList
    } = useSelector((state) => ({
        postMsg: state.ImportExportFieldMap_Reducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        goButtonItem: state.ImportExportFieldMap_Reducer.addGoButton,
        partyList: state.PartyMasterReducer.partyList,
    }));

    useEffect(() => {
        const page_Id = pageId.IMPORT_EXCEL_FIELD_MAP_add
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyListAPI());
        dispatch(GoButton_ImportFiledMap_AddSuccess([]));
        if ((commonFunc.loginIsSCMCompany() === 1)) {
            goButtonHandler()
        }
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const { fieldLabel } = state;

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
            commonFunc.breadcrumbReturnFunc({ dispatch, userAcc });
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
            CustomAlert({
                Type: 1,
                Message: postMsg.Message,
            })


        }
        else if (postMsg.Status === true) {
            dispatch(save_ImportFiledMap_Success({ Status: false }))
            CustomAlert({
                Type: 4,
                Message: JSON.stringify(postMessage.Message),
            })
        }
    }, [postMsg])


    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`${" Field Count"} :${goButtonItem.length}`))
    }, [goButtonItem])

    useEffect(commonFunc.tableInputArrowUpDounFunc("#table_Arrow"), [goButtonItem]);


    const partyDropdown_Options = partyList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));



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
        let partyId = ((commonFunc.loginIsSCMCompany() === 1)) ? commonFunc.loginPartyID() : partySelect.value;
        const jsonBody = JSON.stringify({
            PartyID: partyId,
            CompanyID: commonFunc.loginCompanyID()
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
        let partyId = ((commonFunc.loginIsSCMCompany() === 1)) ? commonFunc.loginPartyID() : partySelect.value;
        goButtonItem.forEach(i => {

            if ((((i.Value === '') || (i.Value === null)) && (i.IsCompulsory === true))) {
                invalid.push({ [i.FieldName]: "this filed Requird." })
            }
            if ((!(i.Value === '') && !(i.Value === null))) {
                const obj = {
                    Value: i.Value,
                    ImportField: i.id,
                    Party: partyId,
                    Company: commonFunc.loginCompanyID(),
                    CreatedBy: commonFunc.loginUserID(),
                    UpdatedBy: commonFunc.loginUserID(),
                }
                jsonArr.push(obj)
            }
        })

        if (invalid.length > 0) {
            CustomAlert({ Type: 3, Message: invalid })
            return
        } else {
            const jsonBody = JSON.stringify(jsonArr);
            dispatch(save_ImportFiledMap({ jsonBody }));
        }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{commonFunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <form onSubmit={(event) => SaveHandler(event)} noValidate>
                    <div className="page-content">
                        <div style={{ display: ((commonFunc.loginIsSCMCompany() === 1)) && "none" }}>
                            <div className="px-2 c_card_header text-black" >
                                <div className="px-2   c_card_filter text-black" >
                                    <div className="row" >
                                        <Col sm="10">
                                            <FormGroup className="mb-2 row mt-3 " >
                                                <Label className=" p-2"

                                                    style={{ maxWidth: "115px" }}>{fieldLabel.Party}</Label>
                                                <Col style={{ maxWidth: "300px" }} >
                                                    <Select
                                                        classNamePrefix="select2-Customer"
                                                        isDisabled={!(goButtonItem.length === 0) && true}
                                                        value={partySelect}
                                                        options={partyDropdown_Options}
                                                        onChange={(e) => { SetPartySelect(e) }}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>

                                        <Col sm="2" className="mt-3 ">
                                            {(goButtonItem.length === 0) ?
                                                < Go_Button onClick={goButtonHandler} />
                                                :
                                                <Change_Button onClick={change_ButtonHandler} />
                                            }
                                        </Col>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div >
                            <ToolkitProvider
                                keyField="id"
                                data={goButtonItem}
                                columns={pagesListColumns}

                                search
                            >
                                {toolkitProps => (
                                    <React.Fragment>
                                        <div className="table">
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
                            {(goButtonItem.length > 0) && <SaveButton pageMode={pageMode}
                                userAcc={userPageAccessState}
                                module={"LoadingSheet"}
                            />}
                        </Col>
                    </FormGroup >
                </form>
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
