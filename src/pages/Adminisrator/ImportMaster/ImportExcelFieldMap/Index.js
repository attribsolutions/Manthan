import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Input,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import {
    BreadcrumbShowCountlabel,
    commonPageField,
    commonPageFieldSuccess
} from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as pageId from "../../../../routes/allPageID";
import * as mode from "../../../../routes/PageMode";
import { PageLoadingSpinner, SaveButton } from "../../../../components/Common/CommonButton";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { comAddPageFieldFunc, initialFiledFunc, } from "../../../../components/Common/validationFunction";
import {
    GoButton_ImportFiledMap_Add,
    GoButton_ImportFiledMap_AddSuccess,
    save_ImportFiledMap,
    save_ImportFiledMap_Success
} from "../../../../store/Administrator/ImportExportFieldMapRedux/action";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import SaveButtonDraggable from "../../../../components/Common/saveButtonDraggable";
import GlobalCustomTable from "../../../../GlobalCustomTable";
import { url } from "../../../../routes";

const ImportExcelFieldMap = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [SortTable, setSortTable] = useState([])
    const [subPageMode] = useState(history.location.pathname);

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
        partyDropDownLoading,
        saveBtnLoading,
        commonPartyDropSelect
    } = useSelector((state) => ({
        postMsg: state.ImportExportFieldMap_Reducer.postMsg,

        saveBtnLoading: state.ImportExportFieldMap_Reducer.saveBtnLoading,
        goBtnLoading: state.ImportExportFieldMap_Reducer.goBtnLoading,

        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        goButtonItem: state.ImportExportFieldMap_Reducer.addGoButton,

        partyDropDownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,

        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect

    }));

    useEffect(() => {
        let page_Id
        if (subPageMode === url.IMPORT_EXCEL_FIELD_MAP) {
            page_Id = pageId.IMPORT_EXCEL_FIELD_MAP
        }
        else {
            page_Id = pageId.IMPORT_CREDIT_NOTE_EXCEL_FIELD_MAP
        }
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    useEffect(() => {

        if (goButtonItem.length > 0) {
            dispatch(BreadcrumbShowCountlabel(`Count:${goButtonItem.length}`));
        }
    }, [goButtonItem]);

    useEffect(() => {
        dispatch(GoButton_ImportFiledMap_AddSuccess([]));
        if (commonPartyDropSelect.value > 0) {
            goButtonHandler()
        }
        return () => {
            dispatch(GoButton_ImportFiledMap_AddSuccess([]));
        }

    }, [commonPartyDropSelect]);

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

        goButtonItem.sort((a, b) => {

            if (a.Sequence === null && b.Sequence !== null) {
                return 1; // 'a' with id 0 comes after 'b' with a non-zero id
            } else if (a.Sequence !== null && b.Sequence === null) {
                return -1; // 'a' with a non-zero id comes before 'b' with id 0
            } else {
                return a.Sequence - b.Sequence; // Sort other values in ascending order by id
            }
        });

        setSortTable(goButtonItem)
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
            text: "Compulsory",
            dataField: "IsCompulsory",

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


        {
            text: "Sequence",
            dataField: "Sequence",
            // sort: true,
            formatter: (cellContent, row) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    type="text"
                                    key={`Value-${row.id}`}
                                    defaultValue={cellContent}
                                    onChange={(e) => row.Sequence = e.target.value}
                                />
                            </FormGroup>
                        </Col>
                    </div>

                </>
            ),
        }

    ];

    async function goButtonHandler() {

        const jsonBody = JSON.stringify({
            PartyID: _cfunc.loginSelectedPartyID(),
            CompanyID: _cfunc.loginCompanyID(),
            IsFieldType: subPageMode === url.IMPORT_EXCEL_FIELD_MAP ? 1 : 3// type 1 is all Invoices fields and 3 for Credit Note Fields
        })
        dispatch(GoButton_ImportFiledMap_Add({ jsonBody }))
    };

    function SaveHandler(event) {
        event.preventDefault();

        let jsonArr = []
        const invalid = []
        goButtonItem.forEach(i => {
            if ((((i.Value === '') || (i.Value === null)) && (i.IsCompulsory === true))) {
                invalid.push({ [i.FieldName]: "this field Requird." })
            }
            if ((!(i.Value === '') && !(i.Value === null))) {
                const obj = {
                    Value: i.Value,
                    ImportField: i.id,
                    Party: _cfunc.loginSelectedPartyID(),
                    Company: _cfunc.loginCompanyID(),
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                    Sequence: i.Sequence
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
                <PageLoadingSpinner isLoading={((partyDropDownLoading) || !pageField)} />
                <div className="page-content">

                    <GlobalCustomTable
                        keyField="id"
                        data={SortTable}
                        columns={pagesListColumns}
                        paginationEnabled
                        id="table_Arrow"
                        noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                        classes={"custom-table"}
                        onDataSizeChange={({ dataCount, filteredData = [] }) => {
                            debugger
                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                        }}
                    />
                </div>


                {(goButtonItem.length > 0) &&
                    <SaveButtonDraggable>
                        <SaveButton
                            pageMode={pageMode}
                            loading={saveBtnLoading}
                            userAcc={userPageAccessState}
                            onClick={SaveHandler}
                        />
                    </SaveButtonDraggable>
                }

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










