import React, { useEffect, useState, } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Row,
} from "reactstrap";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { MetaTags } from "react-meta-tags";
import {
    BreadcrumbShowCountlabel,
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginCompanyID,
    loginPartyID,
    loginUserID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import {
    PartyBankfilter,
    saveBankAssign,
    saveBankAssign_Success,
} from "../../../store/Accounting/BankAssignRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const BankAssign = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        Data,
        userAccess } = useSelector((state) => ({
            postMsg: state.BankAssignReducer.postMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            updateMsg: state.BankAssignReducer.updateMessage,
            Data: state.BankAssignReducer.Data,
        }));

    useEffect(() => {
        const page_Id = pageId.BANK_ASSIGN
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(PartyBankfilter())
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = history.location.pathname;

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


    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveBankAssign_Success({ Status: false }))
            dispatch(Breadcrumb_inputName(''))

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
                    RedirectPath: url.BANK_ASSIGN,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveBankAssign_Success({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`${" Bank Assign Count"} :${Data.length}`))
    }, [Data])

    function handllerIsSelfDepositoryBank(event, row, key) {
        row.IsSelfDepositoryBank = event
        if (event) {
            document.getElementById(`IsDefault${key}`).disabled = false;
            document.getElementById(`AccountNo${key}`).disabled = false;
            document.getElementById(`IFSC${key}`).disabled = false;
            document.getElementById(`BranchName${key}`).disabled = false;
        }
        else {
            document.getElementById(`IsDefault${key}`).checked = false;
            document.getElementById(`AccountNo${key}`).value = "";
            document.getElementById(`IFSC${key}`).value = "";
            document.getElementById(`BranchName${key}`).value = "";
            document.getElementById(`IsDefault${key}`).disabled = true;
            document.getElementById(`AccountNo${key}`).disabled = true;
            document.getElementById(`IFSC${key}`).disabled = true;
            document.getElementById(`BranchName${key}`).disabled = true;
        }
    }

    const pagesListColumns = [
        {
            text: "Name",
            dataField: "BankName",
        },

        {
            text: " Customer Bank",
            dataField: "CustomerBank",
            formatter: (cellContent, row, key) => {

                return (<span >
                    <Input type="checkbox"
                        defaultChecked={row.CustomerBank}
                        onChange={(event) => { row.CustomerBank = event.target.checked; }}
                    />
                </span>
                )
            },
        },

        {
            text: "Depository Bank",
            dataField: "IsSelfDepositoryBank",
            formatter: (cellContent, row, key) => {

                return (<span >
                    <Input type="checkbox"
                        defaultChecked={row.IsSelfDepositoryBank}
                        onChange={(event) => handllerIsSelfDepositoryBank(event.target.checked, row, key)}
                    />
                </span>
                )
            },
        },

        {
            text: "Show On Invoice",
            dataField: "IsDefault",

            formatter: (cellContent, row, key) => {
                return (<span >
                    <Input type="checkbox"
                        disabled={row.IsSelfDepositoryBank ? false : true}
                        id={`IsDefault${key}`}
                        defaultChecked={row.IsDefault}
                        onChange={(event) => { row.IsDefault = event.target.checked; }}
                    />
                </span>
                )
            },
        },

        {
            text: "Account No",
            dataField: "AccountNo",
            formatter: (value, row, key) => {
                return (
                    <span >
                        <Input type="text"
                            disabled={true}
                            id={`AccountNo${key}`}
                            defaultValue={row.AccountNo}
                            autoComplete="off"
                            onChange={(event) => { row.AccountNo = event.target.value }}
                        />
                    </span>
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        {
            text: "IFSC",
            dataField: "IFSC",
            // sort: true,
            formatter: (value, row, key) => {
                return (
                    <span >
                        <Input type="text"
                            id={`IFSC${key}`}
                            disabled={true}
                            defaultValue={row.IFSC}
                            autoComplete="off"
                            onChange={(event) => { row.IFSC = event.target.value }}
                        />
                    </span>
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        {
            text: "Branch ",
            dataField: "BranchName",
            formatter: (value, row, key) => {
                return (
                    <span >
                        <Input type="text"
                            id={`BranchName${key}`}
                            disabled={true}
                            defaultValue={row.BranchName}
                            autoComplete="off"
                            onChange={(e) => { row.BranchName = e.target.value }}
                        />
                    </span>
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }
        },
    ];

    const pageOptions = {
        sizePerPage: 10,
        custom: true,
    };

    const saveHandeller = async (event) => {

        event.preventDefault();
        const btnId = event.target.id
        try {
            btnIsDissablefunc({ btnId, state: true })
            const postJson = Data.map((i) => ({
                Bank: i.Bank,
                CustomerBank: i.CustomerBank === null ? false : i.CustomerBank,
                Party: loginPartyID(),
                IsSelfDepositoryBank: i.IsSelfDepositoryBank === null ? false : i.IsSelfDepositoryBank,
                IsDefault: i.IsDefault === null ? false : i.IsDefault,
                AccountNo: i.AccountNo === null ? "" : i.AccountNo,
                IFSC: i.IFSC === null ? "" : i.IFSC,
                BranchName: i.BranchName === null ? "" : i.BranchName,
                CreatedBy: loginUserID(),
                UpdatedBy: loginUserID(),
                Company: loginCompanyID()
            }))

            const data = postJson.filter((i) => {
                return (i.IsSelfDepositoryBank === true) || ((i.CustomerBank === true))
            })

            const invalidMsg1 = []

            data.forEach((i) => {

                if ((i.IsSelfDepositoryBank === true)) {

                    if ((i.AccountNo === "")) {
                        invalidMsg1.push(`AccountNo Is Required`)
                    }
                    if ((i.BranchName === "")) {
                        invalidMsg1.push(`BranchName Is Required`)
                    };
                    if ((i.IFSC === "")) {
                        invalidMsg1.push(`IFSC Is Required`)
                    };
                    if ((i.IsDefault === "")) {
                        invalidMsg1.push(`IsDefault Is Required`)
                    };
                }
            })
            if (invalidMsg1.length > 0) {
                customAlert({
                    Type: 4,
                    Message: JSON.stringify(invalidMsg1)
                })
                return btnIsDissablefunc({ btnId, state: false })
            }

            const jsonBody = JSON.stringify(data);
            dispatch(saveBankAssign({ jsonBody, btnId }));

        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginTop: IsEditMode_Css, }}>
                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <FormGroup>
                                                <Row>
                                                    <PaginationProvider
                                                        pagination={paginationFactory(pageOptions)}
                                                    >
                                                        {({ paginationProps, paginationTableProps }) => (
                                                            <ToolkitProvider
                                                                keyField="Bank"
                                                                data={Data}
                                                                columns={pagesListColumns}
                                                                search
                                                            >
                                                                {toolkitProps => (
                                                                    <React.Fragment>
                                                                        <div className="table">
                                                                            <BootstrapTable
                                                                                keyField={"Bank"}
                                                                                bordered={true}
                                                                                striped={false}
                                                                                noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                                                                classes={"table align-middle table-nowrap table-hover"}
                                                                                headerWrapperClasses={"thead-light"}

                                                                                {...toolkitProps.baseProps}
                                                                                {...paginationTableProps}
                                                                            />
                                                                            {countlabelFunc(toolkitProps, paginationProps, dispatch, "MRP")}
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

                                                    <Col sm={2}>
                                                        <SaveButton pageMode={pageMode}
                                                            onClick={saveHandeller}
                                                            userAcc={userPageAccessState}
                                                            editCreatedBy={editCreatedBy}
                                                            module={"BankAssign"}
                                                        />
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </form>
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default BankAssign

