import React, { useMemo, useState } from 'react'
import { useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { Go_Button, PageLoadingSpinner } from '../../components/Common/CommonButton';
import { breadcrumbReturnFunc, loginEmployeeID } from '../../components/Common/CommonFunction';
import { mySearchProps } from '../../components/Common/SearchBox/MySearch';
import { C_DatePicker, C_Select, C_TimePicker } from '../../CustomValidateForm';
import { commonPartyDropdown_API, TransactionLog_Get_User_Api, TransactionLog_Go_Btn_Api, TransactionLog_transactionType_Api } from '../../helpers/backend_helper';

const TransactionLog = () => {
    const dispatch = useDispatch();
    const history = useHistory()



    const [userPageAccessState, setUserAccState] = useState('');
    const [transactionTypeSelect, setTransactionTypeSelect] = useState([]);
    const [userSelect, setUserSelect] = useState([]);
    const [partySelect, setPartySelect] = useState([]);
    const [formDateSelect, setFormDateSelect] = useState('');
    const [toDateSelect, setToDateSelect] = useState('');

    const [goBtnloading, setGoBtnloading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [transctionTypeReux, setTransctionTypeReux] = useState([]);
    const [usersRedux, setUsersRedux] = useState([]);
    const [partyRedux, setPartyRedux] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { userAccess } = useSelector((state) => ({ userAccess: state.Login.RoleAccessUpdateData }));

    useEffect(async () => {//initioal Api
        const resp1 = await TransactionLog_transactionType_Api()
        if (resp1.StatusCode === 200) {
            setTransctionTypeReux(resp1.Data)
        }
        const resp2 = await TransactionLog_Get_User_Api()
        if (resp2.StatusCode === 200) {
            setUsersRedux(resp2.Data)
        }
        const resp3 = await commonPartyDropdown_API(loginEmployeeID())
        if (resp3.StatusCode === 200) {
            setPartyRedux(resp3.Data)
        }
    }, [])

    const generateOptions = (sourceArray, labelField = "Name", valueField = "id") =>
        [{ value: '', label: "All" }, ...sourceArray.map(item => ({ value: item[valueField], label: item[labelField] }))];

    const transactionTypeOptions = useMemo(() => generateOptions(transctionTypeReux), [transctionTypeReux])
    const userOptions = useMemo(() => generateOptions(usersRedux), [usersRedux]);
    const partyOptions = useMemo(() => generateOptions(partyRedux), [partyRedux]);

    // userAccess useEffect
    useEffect(() => {
        let locationPath = history.location.pathname;
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserAccState(userAcc);
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess]);

    const tableColumns = [{
        text: "Id",
        dataField: "id",
        sort: true
    }, {
        text: "Transaction Date",
        dataField: "TransactionDate",
        sort: true
    }, {
        text: "User Name",
        dataField: "UserName",
        sort: true
    }, {
        text: "Ip Address",
        dataField: "IpAddress",
        sort: true
    },
    {
        text: "Transaction Type",
        dataField: "TransactionType",
        sort: true
    },
    {
        text: "Transaction Id",
        dataField: "TransactionId",
        sort: true
    },{
        text: "Party Name",
        dataField: "PartyName",
        sort: true
    },]

    const goButtonHandler = async () => {
        try {
            setGoBtnloading(true);
            const jsonBody = JSON.stringify({
                "FromDate": formDateSelect,
                "ToDate": toDateSelect,
                "TransactionType": transactionTypeSelect.map(item => item.id).join(', '),
                "User": userSelect.map(item => item.id).join(', '),
                "Party": partySelect.map(item => item.id).join(', '),
            })
            const resp3 = await TransactionLog_Go_Btn_Api({ jsonBody })
            setGoBtnloading(false);
            if (resp3.StatusCode === 200) {
                setTableData(resp3.Data);
            };
        } catch (w) { setGoBtnloading(false); }

    }
    // const jsonBody = JSON.stringify({
    //     "FromDate": "2023-09-14 12:00",
    //     "ToDate": "2023-09-14 12:00",
    //     "TransactionType": "1,2,3",
    //     "User": "1,2,3",
    //     "Party": "1,2,3",
    // })

    const HeaderContent = () => {
        return (
            <div className="px-2 c_card_filter text-black">
                <div className="row">
                    <Col sm="3">
                        <FormGroup>
                            <div className="d-flex align-items-center">
                                <Label className="col-sm-5 p-2" htmlFor="fromdate">
                                    From Date
                                </Label>
                                <Col sm="7">
                                    <C_TimePicker
                                        id="fromdate"
                                        value={formDateSelect}
                                        onChange={(selectedDate) => setFormDateSelect(selectedDate)}
                                        placeholder="Select From Date"
                                        name="fromdate"
                                    />
                                </Col>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col sm="3" >
                        <FormGroup >
                            <div className="d-flex align-items-center">
                                <Label className="col-sm-5 p-2" htmlFor="todate">
                                    To Date
                                </Label>
                                <Col sm="7">
                                    <C_TimePicker
                                        id="todate"
                                        name="todate"
                                        value={toDateSelect}
                                        onChange={(selectedDate) => setToDateSelect(selectedDate)}
                                        placeholder="Select To Date"
                                    />
                                </Col>
                            </div>
                        </FormGroup>
                    </Col>
                    {/* <Col sm="3">
                        <FormGroup>
                            <div className="d-flex align-items-center">
                                <Label className="col-sm-5 p-2" htmlFor="fromtime">
                                    From Time
                                </Label>
                                <Col sm="7">
                                    <C_TimePicker
                                        id="fromtime"
                                        value={formDateSelect}
                                        onChange={(selectedDate) => setFormDateSelect(selectedDate)}
                                        placeholder="Select from time"
                                        name="fromtime"
                                    />
                                </Col>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col sm="3" >
                        <FormGroup >
                            <div className="d-flex align-items-center">
                                <Label className="col-sm-5 p-2" htmlFor="totime">
                                    To Time
                                </Label>
                                <Col sm="7">
                                    <C_TimePicker
                                        id="totime"
                                        name="totime"
                                        value={toDateSelect}
                                        onChange={(selectedDate,a,b,c) => {
                                            debugger
                                            setToDateSelect(selectedDate)}}
                                        placeholder="Select To time"
                                    />
                                </Col>
                            </div>
                        </FormGroup>
                    </Col> */}
                </div>
                <div className="row">
                    <Col sm="3" >
                        <FormGroup>
                            <div className="d-flex align-items-center">
                                <Label className="col-sm-5 p-2" htmlFor="transactionType">
                                    Transaction Type
                                </Label>
                                <Col sm="7">
                                    <C_Select
                                        id="transactionType"
                                        placeholder="Select Transaction"
                                        classNamePrefix="select2-Customer"
                                        isMulti
                                        value={transactionTypeSelect}
                                        onChange={(e => setTransactionTypeSelect(e))}
                                        options={transactionTypeOptions}
                                        styles={{
                                            menu: (provided) => ({ ...provided, zIndex: 2 }),
                                        }}
                                    />
                                </Col>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col sm="3" >
                        <FormGroup >
                            <div className="d-flex align-items-center">
                                <Label className="col-sm-5 p-2" htmlFor="userName">
                                    User Name
                                </Label>
                                <Col sm="7">
                                    <C_Select
                                        id="userName"
                                        placeholder="Select User"
                                        classNamePrefix="select2-Customer"
                                        isMulti
                                        value={userSelect}
                                        onChange={(e => setUserSelect(e))}
                                        options={userOptions}
                                        styles={{
                                            menu: (provided) => ({ ...provided, zIndex: 2 }),
                                        }}
                                    />
                                </Col>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col sm="5" >
                        <FormGroup >
                            <div className="d-flex align-items-center">
                                <Label className="col-sm-3 p-2" htmlFor="party">
                                    Party
                                </Label>
                                <Col sm="5">
                                    <C_Select
                                        id="party"
                                        placeholder="Select Party"
                                        classNamePrefix="select2-Customer"
                                        isMulti
                                        value={partySelect}
                                        options={partyOptions}
                                        onChange={(e => setPartySelect(e))}
                                        styles={{
                                            menu: (provided) => ({ ...provided, zIndex: 2 }),
                                        }}
                                    />
                                </Col>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col sm="1" >
                        <Go_Button
                            loading={goBtnloading}
                            onClick={goButtonHandler} />
                    </Col>
                </div>
            </div>
        );
    };

    return (
        <React.Fragment>
            {/* <PageLoadingSpinner isLoading={goBtnloading || !pageField} /> */}
            <div className="page-content">
                {/* <PartyDropdown_Common pageMode={pageMode}
                    goButtonHandler={partySelectButtonHandler}
                    changeButtonHandler={partyOnChngeButtonHandler} /> */}
                <HeaderContent />
                <ToolkitProvider
                    keyField={"id"}
                    // defaultSorted={defaultSorted}
                    data={tableData}
                    columns={tableColumns}
                    search
                >
                    {(toolkitProps,) => (
                        <React.Fragment>
                            <Row>
                                <Col xl="12">
                                    <div className="table-responsive table" style={{ minHeight: "45vh" }}>
                                        <BootstrapTable
                                            keyField={"id"}
                                            id="table_Arrow"
                                            classes={"table  table-bordered table-hover"}
                                            noDataIndication={
                                                <div className="text-danger text-center ">
                                                    Record Not available
                                                </div>
                                            }
                                            onDataSizeChange={(e) => {
                                                // _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
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
        </React.Fragment>
    )
}

export default TransactionLog
