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
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    resetFunction,
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginCompanyID,
    loginPartyID,
    loginUserID
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import {
    editBankAssignIDSuccess,
    PartyBankfilter,
    saveBankAssign,
    saveBankAssign_Success,
    updateBankAssignID,
    updateBankAssignIDSuccess
} from "../../../store/Accounting/BankAssignRedux/action";

const BankAssign = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        BankName: "",
        BranchName: "",
        IFSC: "",
        AccountNo: "",
        CustomerBank: "",
        IsSelfDepositoryBank: false,
        IsDefault: false,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");
    // const [Arr, setArr] = useState([]);


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        updateMsg,
        Data,
        userAccess } = useSelector((state) => ({
            postMsg: state.BankAssignReducer.postMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            updateMsg: state.BankAssignReducer.updateMessage,
            Data: state.BankAssignReducer.Data,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.BANK_ASSIGN
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(PartyBankfilter())
    }, []);


    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)//changes
    const hasShowModal = props.hasOwnProperty(mode.editValue)//changes

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


    // // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    // useEffect(() => {

    //     if ((hasShowloction || hasShowModal)) {

    //         let hasEditVal = null
    //         if (hasShowloction) {
    //             setPageMode(location.pageMode)
    //             hasEditVal = location.editValue
    //         }
    //         else if (hasShowModal) {
    //             hasEditVal = props.editValue
    //             setPageMode(props.pageMode)
    //             setModalCss(true)
    //         }

    //         if (hasEditVal) {
    //             const { id, BankName, BranchName, IFSC, AccountNo, IsSelfDepositoryBank,IsDefault } = hasEditVal
    //             const { values, fieldLabel, hasValid, required, isError } = { ...state }

    //             hasValid.BankName.valid = true;
    //             hasValid.BranchName.valid = true;
    //             hasValid.IFSC.valid = true;
    //             hasValid.AccountNo.valid = true;
    //             hasValid.IsSelfDepositoryBank.valid = true;
    //             hasValid.IsDefault.valid = true

    //             values.id = id
    //             values.BankName = BankName;
    //             values.BranchName = BranchName;
    //             values.IFSC = IFSC;
    //             values.AccountNo = AccountNo;
    //             values.IsSelfDepositoryBank = IsSelfDepositoryBank;
    //             values. IsDefault = IsDefault

    //             setState({ values, fieldLabel, hasValid, required, isError })
    //             dispatch(Breadcrumb_inputName(hasEditVal.BankName))
    //             seteditCreatedBy(hasEditVal.CreatedBy)
    //         }
    //          dispatch(editBankAssignIDSuccess({ Status: false }))
    //     }
    // }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveBankAssign_Success({ Status: false }))
            setState(() => resetFunction(fileds, state)) //Clear form values 
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
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state)) // Clear form values 
            history.push({
                pathname: url.BANK_ASSIGN,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateBankAssignIDSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss]);



    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    function handllerBranchName(event, row) {
        let input = event.target.value;
        row.NewBranchName = input
    }

    function handllerIFSC(event, row) {
        let input = event.target.value;
        row.NewIFSC = input
    }

    function handllerAccountNo(event, row) {
        let input = event.target.value;
        row.NewAccountNo = input
    }

    function handllerIsDefault(event, row) {
        let input = event.target.checked;
        row.NewIsDefault = input
    }

    function handllerIsSelfDepositoryBank(event, row) {
        let input = event.target.checked;
        row.NewIsSelfDepositoryBank = input
    }

    function handllerCustomerBank(event, row) {
        let input = event.target.checked;;
        row.NewCustomerBank = input
    }

    const pagesListColumns = [
        {
            text: "Name",
            dataField: "BankName",
            sort: true,
        },
        {
            text: " Customer Bank",
            dataField: "CustomerBank",
            sort: true,
            formatter: (cellContent, row, col, k) => {

                return (<span >
                    <Input type="checkbox"
                        defaultChecked={row.CustomerBank}
                        key={row.CustomerBank}
                        onChange={(event) => handllerCustomerBank(event, row)}
                    />
                </span>
                )
            },
        },
        {
            text: "Depository Bank",
            dataField: "IsSelfDepositoryBank",
            sort: true,
            formatter: (cellContent, row, col, k) => {
                return (<span >
                    <Input type="checkbox"
                        defaultChecked={row.IsSelfDepositoryBank}
                        key={row.BankName}
                        onChange={(event) => handllerIsSelfDepositoryBank(event, row)}
                    />
                </span>
                )
            },
        },
        {
            text: " Invoice Show",
            dataField: "IsDefault",
            sort: true,
            formatter: (cellContent, row, col, k) => {
                return (<span >
                    <Input type="checkbox"
                        defaultChecked={row.IsDefault}
                        key={row.BankName}
                        onChange={(event) => handllerIsDefault(event, row)}
                    />
                </span>
                )
            },
        },
        {
            text: "Account No",
            dataField: "AccountNo",
            sort: true,
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`AccountNo${k}`}
                            key={`AccountNo${row.id}`}
                            defaultValue={row.AccountNo}
                            autoComplete="off"
                            onChange={(event) => handllerAccountNo(event, row)}
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
            sort: true,
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`IFSC${k}`}
                            key={`IFSC${row.id}`}
                            defaultValue={row.IFSC}
                            autoComplete="off"
                            onChange={(event) => handllerIFSC(event, row)}
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
            sort: true,
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`BranchName${k}`}
                            key={`BranchName${row.id}`}
                            defaultValue={row.BranchName}
                            autoComplete="off"
                            onChange={(event) => handllerBranchName(event, row)}
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
        const arr1 = []
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })
              
                Data.forEach(i => {
                    if (i.NewBranchName || i.NewCustomerBank || i.NewIFSC || i.NewAccountNo || i.NewIsSelfDepositoryBank || i.NewIsDefaul) {
                        const arr = {
                            Bank: i.Bank,
                            BranchName: i.NewBranchName,
                            CustomerBank: i.NewCustomerBank,
                            IFSC: i.NewIFSC,
                            AccountNo: i.NewAccountNo,
                            IsSelfDepositoryBank: i.NewIsSelfDepositoryBank,
                            IsDefault: i.NewIsDefault,
                            CreatedBy: loginUserID(),
                            UpdatedBy: loginUserID(),
                            Party: loginPartyID(),
                            Company: loginCompanyID()
                        }
                        arr1.push(arr)
                    }
                })
                const jsonBody = JSON.stringify(
                    arr1
                );

                if (pageMode === mode.edit) {
                    dispatch(updateBankAssignID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveBankAssign({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

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
                                                                keyField="id"
                                                                data={Data}
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

