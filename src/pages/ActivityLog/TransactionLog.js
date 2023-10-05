import React, { useMemo, useState } from 'react'
import { useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { Go_Button} from '../../components/Common/CommonButton';
import { breadcrumbReturnFunc, convertDateTime_ydm,  getDateTime_dmy, loginEmployeeID } from '../../components/Common/CommonFunction';
import { mySearchProps } from '../../components/Common/SearchBox/MySearch';
import { C_Select, C_TimePicker } from '../../CustomValidateForm';
import { showToastAlert } from '../../helpers/axios_Config';
import { commonPartyDropdown_API, TransactionLog_Get_User_Api, TransactionLog_Go_Btn_Api, TransactionLog_transactionType_Api } from '../../helpers/backend_helper';
import { BreadcrumbShowCountlabel } from '../../store/actions';


const TransactionLog = () => {


    const dispatch = useDispatch();
    const history = useHistory()



    const [userPageAccessState, setUserAccState] = useState('');
    const [transactionTypeSelect, setTransactionTypeSelect] = useState([]);
    const [userSelect, setUserSelect] = useState([]);
    const [partySelect, setPartySelect] = useState([]);
    const [formDateSelect, setFormDateSelect] = useState(()=>getDateTime_dmy(1));//offSetTime 1 hour earlier
    const [toDateSelect, setToDateSelect] = useState(getDateTime_dmy);

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

    const tableColumns = [
        {
            text: "Transaction Date",
            dataField: "TransactionDate",
            sort: true
        }, {
            text: "Employee Name (User Name)",
            dataField: "UserName",
            sort: true
        }, {
            text: "IP Address",
            dataField: "IPaddress",
            sort: true
        },
        {
            text: "Transaction Type",
            dataField: "TransactionType",
            sort: true
        },
        {
            text: "Transaction Detail",
            dataField: "TransactionDetails",
            sort: true

        },
        {
            text: "Party Name",
            dataField: "PartyName",
            sort: true
        },
        {
            text: "Customer Name",
            dataField: "CustomerName",
            sort: true
        },
        
    ]

    const goButtonHandler = async () => {
        try {
            setGoBtnloading(true);
            setTableData([])
            const jsonBody = JSON.stringify({
                "FromDate": convertDateTime_ydm(formDateSelect),
                "ToDate": convertDateTime_ydm(toDateSelect),
                "TransactionType": transactionTypeSelect.map(item => item.value).join(','),
                "User": userSelect.map(item => item.value).join(','),
                "Party": partySelect.map(item => item.value).join(','),
            })
            const resp3 = await TransactionLog_Go_Btn_Api({ jsonBody })
            setGoBtnloading(false);
            if (resp3.StatusCode === 200) {

                setTableData(resp3.Data);
                dispatch(BreadcrumbShowCountlabel(`Count : ${resp3.Data.length}`))
            } else if (!(resp3.StatusCode === 406)) {
                showToastAlert()
            }
        } catch (w) { setGoBtnloading(false); }

    }


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
                                        onChange={(obj, selectedDate) => {
                                            setFormDateSelect(selectedDate)
                                        }}
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
                                        onChange={(obj, selectedDate) => setToDateSelect(selectedDate)}
                                        placeholder="Select To Date"
                                    />
                                </Col>
                            </div>
                        </FormGroup>
                    </Col>
                   
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
                                            onDataSizeChange={({ dataSize }) => {
                                                dispatch(BreadcrumbShowCountlabel(`Count : ${dataSize}`))
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
