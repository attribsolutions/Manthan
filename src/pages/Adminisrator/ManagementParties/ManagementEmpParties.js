import React, { useEffect, useState, } from "react";
import {
    Button,
    Col,
    FormGroup,
    Label,
    Row,
} from "reactstrap";

import { MetaTags } from "react-meta-tags";
import { AlertState, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
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
import { Change_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    loginCompanyID,
    metaTagLabel,
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
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
        userAccess } = useSelector((state) => ({
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
    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveManagementParties_Success({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values 
            dispatch(Breadcrumb_inputName(''))
            dispatch(getPartyTableListSuccess([]))
            if (pageMode === "other") {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.MANAGEMENT_PARTIES,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveManagementParties_Success({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
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
        // {
        //     text: "Select",
        //     mode: 'checkbox',
        //     clickToSelect: true,
        //     getSelection: () => <><Input type="checkbox"></Input></>,
        //     selectionRenderer: ({ mode, ...rest }) => (
        //         <Input type={mode} {...rest} />
        //     ),
        //     dataField: "Check",
        //     formatter: (cellContent, row, key) => {
        //         return (<span style={{ justifyContent: 'center' }}>
        //             <Input
        //                 id=""
        //                 key={row.id}
        //                 defaultChecked={row.Check}
        //                 type="checkbox"
        //                 className="col col-sm text-center"
        //                 onChange={e => { SelectAll(e.target.checked, row, key) }}
        //             />
        //         </span>)
        //     }
        // }
    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: partyList.length,
        custom: true,
    };

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id

        const CheckArray = partyList.filter((index) => {
            return (index.selectCheck === true)
        })

        const PartiesJson = CheckArray.map((index) => ({
            Employee: values.Employee.value,
            Party: index.id,
        }))

        const trueValues = partyList.map((index) => {
            return (index.selectCheck === true)
        })

        const totalTrueValues = trueValues.reduce((count, value) => {
            if (value === true) {
                count++
            }
            return count
        }, 0)

        if ((totalTrueValues === 0)) {
            dispatch(
                AlertState({
                    Type: 4,
                    Status: true,
                    Message: "At least One Party is Selected",
                })
            );
            return;
        }
        const jsonBody = JSON.stringify(PartiesJson)
        // console.log(jsonBody)
        dispatch(saveManagementParties({ jsonBody, btnId }));
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginTop: IsEditMode_Css, marginBottom: "200px" }}>
                    {/* <Container fluid> */}
                    <div className="px-2   c_card_header text-black mb-1" >
                        <div className="row">
                            <Col sm="5">
                                <FormGroup className=" row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}> {fieldLabel.Employee}</Label>
                                    <Col sm="6">
                                        <Select
                                            name="Employee"
                                            value={values.Employee}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            autoFocus={true}
                                            options={employeeListOptions}
                                            isDisabled={(partyList.length > 0) ? true : false}
                                            // onChange={(e) => { setEmployeeSelect(e) }}
                                            onChange={(hasSelect, evn) => {
                                                onChangeSelect({ hasSelect, evn, state, setState, })
                                                // State_Dropdown_Handler(hasSelect)
                                            }}
                                        />
                                        {isError.Employee.length > 0 && (
                                            <span className="text-danger f-8"><small>{isError.Employee}</small></span>
                                        )}
                                    </Col>
                                </FormGroup>
                            </Col>
                            {partyList.length === 0 ?
                                <Col sm="1" className="mx-4 ">
                                    <Button type="button" color="btn btn-outline-success border-2 font-size-12 m-3  "
                                        onClick={(e) => goButtonHandler(e)}
                                    >Go</Button>
                                </Col> :
                                <Col sm="1" className="mx-4 mt-3">
                                    <Change_Button onClick={(e) => dispatch(getPartyTableListSuccess([]))} />
                                </Col>
                            }


                            {/* {pageMode === mode.defaultsave ?
                                (orderItemTable.length === 0) ?
                                    < Go_Button onClick={(e) => goButtonHandler()} />
                                    :
                                    <Change_Button onClick={(e) => dispatch(GoButton_For_Order_AddSuccess([]))} />
                                : null
                            } */}
                        </div>
                    </div>

                    <form noValidate>
                        <PaginationProvider

                            pagination={paginationFactory(pageOptions)}
                        >
                            {({ paginationProps, paginationTableProps }) => (
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
                                                    {...paginationTableProps}
                                                />
                                                {/* {countlabelFunc(toolkitProps, paginationProps, dispatch, "Route Update")} */}
                                                {mySearchProps(toolkitProps.searchProps)}
                                            </div>

                                            <Row className="align-items-md-center mt-30">
                                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                    <PaginationListStandalone
                                                        {...paginationProps}
                                                    />
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    )
                                    }
                                </ToolkitProvider>
                            )
                            }

                        </PaginationProvider>

                        {partyList.length > 0 ?
                            <FormGroup style={{ marginTop: "-25px" }}>
                                <Row >
                                    <Col sm={2} className="mt-n4">
                                        <SaveButton pageMode={pageMode}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            module={"RouteUpdate"}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup >
                            : null
                        }

                    </form>
                    {/* </Container> */}
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

