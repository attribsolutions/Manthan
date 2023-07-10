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
import { useHistory } from "react-router-dom";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    CommonConsole,
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

    const [pageMode] = useState(mode.defaultsave);//changes
    const [modalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy,] = useState("");
    const [depositoryBankInTable, setDepositoryBankInTable] = useState('');
    const [forceRefresh, setForceRefresh] = useState(false);

    //Access redux store bankTableList /  'save_ModuleSuccess' action data
    const {
        postMsg,
        bankTableList,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.BankAssignReducer.saveBtnloading,
            postMsg: state.BankAssignReducer.postMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            updateMsg: state.BankAssignReducer.updateMessage,
            bankTableList: state.BankAssignReducer.bankTableList,
        }));

    useEffect(() => {
        const page_Id = pageId.BANK_ASSIGN
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(PartyBankfilter())
    }, []);

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

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveBankAssign_Success({ Status: false }))
            dispatch(Breadcrumb_inputName(''))

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
                    history.push({ pathname: url.BANK_ASSIGN })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveBankAssign_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`${" Bank Assign Count"} :${bankTableList.length}`))
    }, [bankTableList])

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
            formatExtraData: { depositoryBankInTable, setDepositoryBankInTable, forceRefresh, setForceRefresh },
            formatter: (cellContent, row, key, { depositoryBankInTable = '', setDepositoryBankInTable, forceRefresh, setForceRefresh }) => {
                const isdissabled = (depositoryBankInTable === '' || row.Bank === depositoryBankInTable) ? false : true
                return (<span >
                    <Input type="checkbox"
                        disabled={isdissabled}
                        defaultChecked={row.IsSelfDepositoryBank}
                        onChange={(event) => {
                            let check = event.target.checked;
                            //if  check Box checked then set bank row id other wise "" (blank)
                            if (!check) {
                                row.IsDefault = false
                            }
                            setForceRefresh(!forceRefresh)
                            setDepositoryBankInTable(check ? row.Bank : "");
                            row.IsSelfDepositoryBank = check

                        }}
                    />
                </span>
                )
            },
        },

        {
            text: "Show On Invoice",
            dataField: "IsDefault",
            formatExtraData: { depositoryBankInTable, forceRefresh, setForceRefresh },
            formatter: (cellContent, row, key, { forceRefresh, setForceRefresh }) => {
                const idDissabled = ((row.IsSelfDepositoryBank) && (row.Bank === depositoryBankInTable || depositoryBankInTable === '')) ? false : true
                return (<span >
                    <Input type="checkbox"
                        disabled={idDissabled}
                        checked={row.IsDefault}
                        onChange={(event) => {
                            setForceRefresh(!forceRefresh)
                            row.IsDefault = event.target.checked;
                        }}
                    />
                </span>
                )
            },
        },

        {
            text: "Account No",
            dataField: "AccountNo",
            formatExtraData: { forceRefresh },
            formatter: (value, row, key) => {
                const idDissabled = ((row.IsSelfDepositoryBank) && (row.Bank === depositoryBankInTable || depositoryBankInTable === '')) ? false : true
                return (
                    <span >
                        <Input type="text"
                            disabled={idDissabled}
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
            formatExtraData: { forceRefresh },
            formatter: (value, row, key) => {
                const idDissabled = ((row.IsSelfDepositoryBank) && (row.Bank === depositoryBankInTable || depositoryBankInTable === '')) ? false : true

                return (
                    <span >
                        <Input type="text"
                            disabled={idDissabled}
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
            formatExtraData: { forceRefresh },
            formatter: (value, row, key) => {
                const idDissabled = ((row.IsSelfDepositoryBank) && (row.Bank === depositoryBankInTable || depositoryBankInTable === '')) ? false : true
                return (
                    <span >
                        <Input type="text"
                            disabled={idDissabled}
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

    const saveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id;
        try {
            const assignedBanks = bankTableList
                .filter((bank) => bank.IsSelfDepositoryBank || bank.CustomerBank)
                .map((bank) => ({
                    Bank: bank.Bank,
                    CustomerBank: bank.CustomerBank || false,
                    Party: loginPartyID(),
                    IsSelfDepositoryBank: bank.IsSelfDepositoryBank || false,
                    IsDefault: bank.IsDefault || false,
                    AccountNo: bank.AccountNo || "",
                    IFSC: bank.IFSC || "",
                    BranchName: bank.BranchName || "",
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    Company: loginCompanyID(),
                }));


            if (assignedBanks.length === 0) {
                customAlert({
                    Type: 3,
                    Message: "No assigned banks available. Please select at least one bank.",
                });
                return;
            }


            const invalidMessages = assignedBanks.reduce((messages, bank) => {
                if (bank.IsSelfDepositoryBank) {
                    if (bank.AccountNo === "") {
                        messages.push("AccountNo is required");
                    }
                    if (bank.BranchName === "") {
                        messages.push("BranchName is required");
                    }
                    if (bank.IFSC === "") {
                        messages.push("IFSC is required");
                    }
                    if (!bank.IsDefault) {
                        messages.push("IsDefault is required");
                    }
                }
                return messages;
            }, []);

            if (invalidMessages.length > 0) {
                customAlert({
                    Type: 3,
                    Message: JSON.stringify(invalidMessages),
                });
                return
            }

            const jsonBody = JSON.stringify(assignedBanks);
            dispatch(saveBankAssign({ jsonBody, btnId }));

        } catch (error) {
            CommonConsole(error)
        }
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
                                                                data={bankTableList}
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
                                                                            {countlabelFunc(toolkitProps, paginationProps, dispatch, "Bank Assign")}
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
                                                            loading={saveBtnloading}
                                                            onClick={saveHandler}
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

