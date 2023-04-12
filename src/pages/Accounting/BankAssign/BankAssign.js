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
    PartyBankfilter,
    saveBankAssign,
    saveBankAssign_Success
} from "../../../store/Accounting/BankAssignRedux/action";

const BankAssign = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        IFSC: "",
        BranchName: "",
        AccountNo: "",
        IsSelfDepositoryBank: false
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [Arr, setArr] = useState([]);


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        Data,
        userAccess } = useSelector((state) => ({
            postMsg: state.BankAssignReducer.postMsg,
            userAccess: state.Login.RoleAccessUpdateData,
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
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])


    const pagesListColumns = [
        {
            text: "Name",
            dataField: "BankName",
            sort: true,
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`BankName${k}`}
                            key={`BankName${row.id}`}

                            defaultValue={row.BankName}
                            autoComplete="off"
                            onChange={(e) => { row["BankName"] = e.target.value }}
                        />
                    </span>
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }
        },
        {
            text: "Depository Bank",
            dataField: "IsSelfDepositoryBank",
            sort: true,
            formatter: (cellContent, row, col, k) => {
                return (<span >
                    <Input type="checkbox"
                        defaultChecked={cellContent}
                        key={row.BankName}
                        onChange={e => {
                            setArr(ele => {
                                let a = { ...ele };
                                const newrr = [...ele].map(i => {
                                    if (row.BankName === i.BankName) {
                                        i.bankCheck = !i.bankCheck;
                                    }
                                    return i
                                });
                                return newrr
                            })

                        }}
                    />
                </span>
                )
            },
        },
        {
            text: " Default",
            dataField: "IsDefault",
            sort: true,
            formatter: (cellContent, row, col, k) => {
                return (<span >
                    <Input type="checkbox"
                        defaultChecked={cellContent}
                        key={row.BankName}
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
                            onChange={(e) => { row["AccountNo"] = e.target.value }}
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
                            onChange={(e) => { row["IFSC"] = e.target.value }}
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
                            onChange={(e) => { row["BranchName"] = e.target.value }}
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
        const Find = Arr.filter((index) => {
            return (index.bankCheck === true)
        })
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })
                    var Data = Find.map((index) => ({
                    BranchName: values.BranchName,
                    IFSC: values.IFSC,
                    AccountNo: values.AccountNo,
                    IsSelfDepositoryBank: values.IsSelfDepositoryBank,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    Party: loginPartyID(),
                    Company: loginCompanyID(),
                }))
                const jsonBody = JSON.stringify(Data)
                if (pageMode === mode.edit) { 
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
                                            <Card>
                                                <CardBody className="c_card_body">
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
                                                </CardBody>
                                            </Card>
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

