import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Label,
    Row,
} from "reactstrap";

import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { BreadcrumbShowCountlabel, Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    resetFunction,
} from "../../../components/Common/validationFunction";
import { Change_Button, Go_Button, PageLoadingSpinner, SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    loginCompanyID,
    metaTagLabel,
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import {
    getEmployeedropdownList,
    getPartyTableList,
    getPartyTableListSuccess,
    saveManagementParties,
    saveManagementParties_Success
} from "../../../store/Administrator/ManagementPartiesRedux/action";
import { selectAllCheck } from "../../../components/Common/TableCommonFunc";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { C_Select } from "../../../CustomValidateForm";

const ManagementEmpParties = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);

    const fileds = {
        Employee: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        employeeList,
        partyList,
        pageField,
        loading,
        saveBtnloading,
        employeeDropdownLoading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.ManagementPartiesReducer.saveBtnloading,
            employeeDropdownLoading: state.ManagementPartiesReducer.employeeDropdownLoading,
            loading: state.ManagementPartiesReducer.loading,
            postMsg: state.ManagementPartiesReducer.postMsg,
            employeeList: state.ManagementPartiesReducer.employeeList,
            partyList: state.ManagementPartiesReducer.partyList,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.MANAGEMENT_PARTIES
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getEmployeedropdownList())
        dispatch(getPartyTableListSuccess([]))
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveManagementParties_Success({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values 
            dispatch(Breadcrumb_inputName(''))
            dispatch(getPartyTableListSuccess([]))
            if (pageMode === "other") {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.MANAGEMENT_PARTIES })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveManagementParties_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])


    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`${"Management Count"} :${partyList.length}`))
    }, [partyList])

    const employeeListOptions = employeeList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    function goButtonHandler(event) {

        event.preventDefault();
        if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                "Company": loginCompanyID(),
                "Employee": values.Employee.value
            })
            dispatch(getPartyTableList(jsonBody));
        }
    }

    function rowSelected() {
        return partyList.map((index) => { return (index.selectCheck) && index.id })
    }

    const pagesListColumns = [
        {
            text: "Party Name",
            dataField: "Name",
        },
        {
            text: "Party Type",
            dataField: "PartyType",
        },
        {
            text: "State",
            dataField: "State",
        },
        {
            text: "District",
            dataField: "District",
        },
    ];

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id;

        const CheckArray = partyList.filter(index => index.selectCheck === true);

        if (CheckArray.length === 0) {
            customAlert({ Type: 4, Status: true, Message: "At least One Party is Selected" });
            return;
        }
        const PartiesJson = CheckArray.map(index => ({ Employee: values.Employee.value, Party: index.id }));
        const jsonBody = JSON.stringify(PartiesJson);
        dispatch(saveManagementParties({ jsonBody, btnId }));
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <PageLoadingSpinner isLoading={(!pageField)} />
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginTop: IsEditMode_Css, marginBottom: "200px" }}>
                    <div className="px-2   c_card_header text-black mb-1" >
                        <div className="row">
                            <Col sm="5">
                                <FormGroup className=" row mt-2  mb-1" >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}> {fieldLabel.Employee}</Label>
                                    <Col sm="6">
                                        <C_Select
                                            name="Employee"
                                            value={values.Employee}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            autoFocus={true}
                                            options={employeeListOptions}
                                            isLoading={employeeDropdownLoading}
                                            isDisabled={(partyList.length > 0) ? true : false}
                                            onChange={(hasSelect, evn) => {
                                                onChangeSelect({ hasSelect, evn, state, setState, })
                                            }}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                        />
                                        {isError.Employee.length > 0 && (
                                            <span className="text-danger f-8"><small>{isError.Employee}</small></span>
                                        )}
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col sm="1" className="mt-2  mb-1">
                                {partyList.length === 0 ?
                                    <Go_Button
                                        loading={loading}
                                        onClick={goButtonHandler}
                                    />
                                    :
                                    <Change_Button onClick={(e) => dispatch(getPartyTableListSuccess([]))} />
                                }
                            </Col>

                        </div>
                    </div>

                    <form noValidate>
                        <ToolkitProvider
                            keyField="id"
                            data={partyList}
                            columns={pagesListColumns}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <div className="table">
                                        <BootstrapTable
                                            keyField={"id"}
                                            bordered={true}
                                            striped={false}
                                            selectRow={selectAllCheck(rowSelected())}
                                            noDataIndication={<div className="text-danger text-center ">Party Not available</div>}
                                            classes={"table align-middle table-nowrap table-hover"}
                                            headerWrapperClasses={"thead-light"}
                                            {...toolkitProps.baseProps}
                                        />

                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>

                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>

                        {partyList.length > 0 ?
                            <FormGroup style={{ marginTop: "-25px" }}>
                                <Row >
                                    <Col sm={2} className="mt-n4">  <div className="row save1" style={{ paddingBottom: 'center' }}>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            module={"RouteUpdate"}
                                        />
                                    </div>
                                    </Col>
                                </Row>
                            </FormGroup >
                            : null
                        }

                    </form>
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default ManagementEmpParties

