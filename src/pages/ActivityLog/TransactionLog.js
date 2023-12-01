import React, { useMemo, useRef, useState } from 'react'
import { useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardBody, Col, FormGroup, Label, Modal, Row, Spinner } from 'reactstrap';
import { Go_Button } from '../../components/Common/CommonButton';
import { breadcrumbReturnFunc, convertDateTime_ydm, getDateTime_dmy, loginCompanyID, loginEmployeeID } from '../../components/Common/CommonFunction';
import { mySearchProps } from '../../components/Common/SearchBox/MySearch';
import { customAlert } from '../../CustomAlert/ConfirmDialog';
import { C_Select, C_TimePicker } from '../../CustomValidateForm';
import { showToastAlert } from '../../helpers/axios_Config';
import { commonPartyDropdown_API, genaraMasterBy_Type_API, GenralMasterSubType, TransactionLog_Get_User_Api, TransactionLog_getjson_for_Transation_Id, TransactionLog_Go_Btn_Api, TransactionLog_transactionType_Api } from '../../helpers/backend_helper';
import { BreadcrumbShowCountlabel } from '../../store/actions';
import SimpleBar from "simplebar-react"


const TransactionLog = () => {

    const dispatch = useDispatch();
    const history = useHistory()
    const jsonRef = useRef(null);

    const [userPageAccessState, setUserAccState] = useState('');
    const [transactionTypeSelect, setTransactionTypeSelect] = useState([{ value: '', label: "All" }]);
    const [userSelect, setUserSelect] = useState([{ value: '', label: "All" }]);
    const [partySelect, setPartySelect] = useState([{ value: '', label: "All" }]);
    const [formDateSelect, setFormDateSelect] = useState(() => getDateTime_dmy(1));//offSetTime 1 hour earlier
    const [toDateSelect, setToDateSelect] = useState(getDateTime_dmy(-1));
    const [categoryTypeSelect, setCategoryTypeSelect] = useState([{ value: '', label: "All" }]);

    const [goBtnloading, setGoBtnloading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [transctionTypeReux, setTransctionTypeReux] = useState([]);
    const [usersRedux, setUsersRedux] = useState([]);
    const [partyRedux, setPartyRedux] = useState([]);
    const [categoryTypeRedux, setCategoryTypeRedux] = useState([]);
    const [modal_view, setModal_view] = useState(false);
    const [modal_backdrop, setmodal_backdrop] = useState(false);   // Image Model open Or not
    const [JsonData, setJsonData] = useState('');
    const [UpdateJsonData, setUpdateJsonData] = useState('');
    const [isCopy, setisCopy] = useState({});



    const [ViewbtnLoading, setViewbtnLoading] = useState('');




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

        const resp4 = await GenralMasterSubType(JSON.stringify({//Api genral master
            Company: loginCompanyID(),
            TypeID: 90 //hardcode 90 id
        }))
        if (resp4.StatusCode === 200) {
            setCategoryTypeRedux(resp4.Data)
        }

    }, [])

    const generateOptions = (sourceArray, labelField = "Name", valueField = "id") =>
        [{ value: '', label: "All" }, ...sourceArray.map(item => ({ value: item[valueField], label: item[labelField] }))];

    const transactionTypeOptions = useMemo(() => generateOptions(transctionTypeReux), [transctionTypeReux])
    const userOptions = useMemo(() => generateOptions(usersRedux), [usersRedux]);
    const partyOptions = useMemo(() => generateOptions(partyRedux), [partyRedux]);
    const categoryTypeOptions = useMemo(() => generateOptions(categoryTypeRedux), [categoryTypeRedux]);

    // const categoryTypeOptions = useMemo(() => categoryTypeRedux.map(item => ({ value: item.id, label: item.Name })), [categoryTypeRedux]);

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



    const makeBtnHandler = async (TransactionID) => {
        const response = await TransactionLog_getjson_for_Transation_Id({ TransctionID: TransactionID })

        if (response.Status === true && response.StatusCode === 200) {
            setViewbtnLoading(false)
            if (response.Data.length > 0) {
                if (response.Data[0]) {
                    setJsonData(response.Data[0])
                    setModal_view(true)
                }
            }

        } else if (response.Status === false && response.StatusCode === 404) {
            setViewbtnLoading(false)
            customAlert({
                Type: 4,
                Message: JSON.stringify(response.Message),
            });
            return
        } else {
            setViewbtnLoading(false)
        }



    }
    function modalToggleFunc() {
        setModal_view(false);
        setisCopy({ isCopy: false })
    }

    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop)
        removeBodyCss()
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }


    function onChangeCategoryType(e = []) {
        if (e.length === 0) {
            e = [{ value: "", label: "All" }]
        } else {
            e = e.filter(i => !(i.value === ''))
        }
        setCategoryTypeSelect(e);
        setTableData([]);
    }

    function onChangeTransactionType(e = []) {
        if (e.length === 0) {
            e = [{ value: "", label: "All" }]
        } else {
            e = e.filter(i => !(i.value === ''))
        }
        setTransactionTypeSelect(e);
        setTableData([]);
    }

    function onChangeUser(e = []) {
        if (e.length === 0) {
            e = [{ value: "", label: "All" }]
        } else {
            e = e.filter(i => !(i.value === ''))
        }
        setUserSelect(e);
        setTableData([]);
    }

    function onChangeParty(e = []) {
        if (e.length === 0) {
            e = [{ value: "", label: "All" }]
        } else {
            e = e.filter(i => !(i.value === ''))
        }
        setPartySelect(e);
        setTableData([]);
    }





    useEffect(() => {

        const transformedData = Object.keys(JsonData).map((key, index) => ({
            key,
            value: JsonData[key],
            index: index
        }));
        setUpdateJsonData(transformedData)

    }, [JsonData])




    const copyToClipboard = (CopyValue, btnId) => {
        try {
            const textToCopy = JSON.stringify(CopyValue, null, 2);
            const textField = document.createElement('textarea');

            textField.value = textToCopy;
            document.body.appendChild(textField);

            textField.select();
            const success = document.execCommand('copy');

            document.body.removeChild(textField);

            if (success) {
                setisCopy({ isCopy: true, btnId: btnId });
            } else {
                console.error('Copy to clipboard using execCommand failed.');
            }
        } catch (error) {
            console.error('Error during copy:', error);
        }
    };






    const viewColumn = [
        {
            text: "Keys",
            dataField: "key",
            sort: true
        }, {
            text: "values",
            dataField: "value",
            sort: true
        },
        {
            text: "Copy",
            dataField: "",
            formatExtraData: { isCopy: isCopy, },

            formatter: (cellContent, rowData, key, formatExtra) => {

                let { isCopy } = formatExtra;
                return (<>
                    < Button
                        type="button"
                        onClick={() => copyToClipboard(rowData.value, `Copy-${rowData.index}`)}
                        title="Copy Field"
                        className="badge badge-soft-primary font-size-12 btn c_btn-primary waves-effect waves-light w-xxs border border-light" >
                        {(isCopy.isCopy) && (isCopy.btnId === `Copy-${rowData.index}`) ?
                            <span
                                style={{ marginLeft: "6px", marginRight: "6px" }}
                                className=" bx bx-check font-size-16"
                            ></span> : <span
                                style={{ marginLeft: "6px", marginRight: "6px" }}
                                className="bx bxs-copy font-size-16"
                            ></span>

                        }

                    </Button>

                </>)
            }

        }
    ]

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
            text: "Customer/Supplier Name",
            dataField: "CustomerName",
            sort: true
        },
        {
            text: "Action",
            dataField: "",
            formatExtraData: { listBtnLoading: ViewbtnLoading, },


            formatter: (cellContent, rowData, key, formatExtra) => {
                let { listBtnLoading } = formatExtra;

                return (<>
                    < Button
                        type="button"
                        id={`btn-makeBtn-${rowData.id}`}
                        className="badge badge-soft-primary font-size-12 btn c_btn-primary waves-effect waves-light w-xxs border border-light"
                        title="View Json"
                        disabled={listBtnLoading}
                        onClick={() => {
                            const btnId = `btn-makeBtn-${rowData.id}`
                            setViewbtnLoading(btnId)
                            makeBtnHandler(rowData.id)
                        }}
                    >
                        {(listBtnLoading === `btn-makeBtn-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <span
                                style={{ marginLeft: "6px", marginRight: "6px" }}
                                className="bx bxs-show font-size-16"
                            ></span>
                        }


                    </Button>
                </>)
            }
        },

    ]

    const goButtonHandler = async () => {

        try {
            if (!categoryTypeSelect.length > 0) {
                showToastAlert("Please Select Category Type", 'error');
                return
            }
            setTableData([]);
            setGoBtnloading(true);
            const jsonBody = JSON.stringify({
                "FromDate": convertDateTime_ydm(formDateSelect),
                "ToDate": convertDateTime_ydm(toDateSelect),
                "TransactionType": transactionTypeSelect.map(item => item.value).join(','),
                "User": userSelect.map(item => item.value).join(','),
                "Party": partySelect.map(item => item.value).join(','),
                "TransactionCategory": categoryTypeSelect.map(item => item.value).join(',')
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
                                        placeholder="Select From Date"
                                        name="fromdate"
                                        data-enable-time
                                        data-enable-seconds
                                        data-enable-input={true} // Enable manual input
                                        options={{
                                            altInput: true,
                                            altFormat: 'd-m-Y H:i:S', // Updated date format with 24-hour time
                                            dateFormat: 'd-m-Y H:i:S', // Updated date format with 24-hour time
                                        }}
                                        onChange={(obj, selectedDate) => {

                                            setFormDateSelect(selectedDate)
                                        }}
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
                                        placeholder="Select To Date"
                                        value={toDateSelect}
                                        data-enable-time
                                        data-enable-seconds
                                        data-enable-input={true} // Enable manual input
                                        options={{
                                            altInput: true,
                                            altFormat: 'd-m-Y H:i:S', // Updated date format with 24-hour time
                                            dateFormat: 'd-m-Y H:i:S', // Updated date format with 24-hour time
                                        }}
                                        onChange={(obj, selectedDate) => setToDateSelect(selectedDate)}
                                    />
                                </Col>
                            </div>
                        </FormGroup>
                    </Col>

                    <Col sm="3" >
                        <FormGroup >
                            <div className="d-flex align-items-center">
                                <Label className="col-sm-5 p-2" >
                                    Category Type
                                </Label>


                                <Col sm="7">
                                    <C_Select
                                        id="CategoryTypee"
                                        placeholder="Category Type"
                                        classNamePrefix="select2-Customer"
                                        isMulti
                                        value={categoryTypeSelect}
                                        onChange={onChangeCategoryType}
                                        options={categoryTypeOptions}
                                        styles={{
                                            menu: (provided) => ({ ...provided, zIndex: 2 }),
                                        }}
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
                                        onChange={onChangeTransactionType}
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
                                        onChange={onChangeUser}
                                        options={userOptions}
                                        styles={{
                                            menu: (provided) => ({ ...provided, zIndex: 2 }),
                                        }}
                                    />
                                </Col>
                            </div>
                        </FormGroup>
                    </Col>

                    <Col sm="3" >
                        <FormGroup>
                            <div className="d-flex align-items-center">
                                <Label className="col-sm-5 p-2" htmlFor="transactionType">
                                    Party
                                </Label>
                                <Col sm="7">
                                    <C_Select
                                        id="party"
                                        placeholder="Select Party"
                                        classNamePrefix="select2-Customer"
                                        isMulti
                                        value={partySelect}
                                        options={partyOptions}
                                        onChange={onChangeParty}
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
                <Modal
                    isOpen={modal_view}
                    toggle={modalToggleFunc}
                    size="xl"
                    className="modal-dialog-centered "
                >
                    <CardBody className="c_card_body">
                        <h2 className="text-center">Transaction Log Details</h2>
                        <ToolkitProvider
                            keyField={"id"}
                            // defaultSorted={defaultSorted}
                            data={UpdateJsonData}
                            columns={viewColumn}
                            search
                        >
                            {(toolkitProps,) => (
                                <React.Fragment>
                                    <Row>
                                        <Col xl="12">
                                            {/* <div className="table-responsive table" style={{ minHeight: "45vh" }}> */}
                                            <SimpleBar className="table-responsive ">

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
                                            </SimpleBar>

                                            {/* </div> */}
                                        </Col>
                                    </Row>

                                </React.Fragment>
                            )}
                        </ToolkitProvider>

                    </CardBody>

                </Modal>

            </div>
        </React.Fragment>
    )
}

export default TransactionLog
