import React, { useMemo, useRef, useState } from 'react'
import { useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, CardBody, Col, FormGroup, Label, Modal, Row, Spinner } from 'reactstrap';
import { C_Button, Go_Button, PageLoadingSpinner } from '../../components/Common/CommonButton';
import { breadcrumbReturnFunc, CommonConsole, convertDateTime_ydm, getDateTime_dmy, loginCompanyID, loginEmployeeID } from '../../components/Common/CommonFunction';
import { customAlert } from '../../CustomAlert/ConfirmDialog';
import { C_Select, C_TimePicker } from '../../CustomValidateForm';
import { showToastAlert } from '../../helpers/axios_Config';
import { commonPartyDropdown_API, GenralMasterSubType, POSLog_Go_Btn_Api, TransactionLog_Get_User_Api, TransactionLog_getjson_for_Transation_Id, TransactionLog_Go_Btn_Api, TransactionLog_transactionType_Api } from '../../helpers/backend_helper';
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from '../../store/actions';
import SimpleBar from "simplebar-react"
import { allLabelWithBlank } from '../../components/Common/CommonErrorMsg/HarderCodeData';
import GlobalCustomTable from '../../GlobalCustomTable';
import { ExcelReportComponent } from '../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS';
import DynamicColumnHook from '../../components/Common/TableCommonFunc';
import { pageId } from '../../routes';


const POS_Log = () => {

    const dispatch = useDispatch();
    const history = useHistory()
    const jsonRef = useRef(null);

    const [userPageAccessState, setUserAccState] = useState('');

    const [partySelect, setPartySelect] = useState({ value: 0, label: "All" });
    const [formDateSelect, setFormDateSelect] = useState(() => getDateTime_dmy(1));//offSetTime 1 hour earlier
    const [toDateSelect, setToDateSelect] = useState(getDateTime_dmy(-1));
    const [categoryTypeSelect, setCategoryTypeSelect] = useState([allLabelWithBlank]);

    const [goBtnloading, setGoBtnloading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [partyRedux, setPartyRedux] = useState([]);

    const [btnMode, setbtnMode] = useState(0);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { userAccess, pageField

    } = useSelector((state) => ({
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    useEffect(() => {

        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.POS_LOG));
        return () => {
            dispatch(commonPageFieldSuccess(null));

        }
    }, []);

    useEffect(async () => {//initioal Api

        const resp3 = await commonPartyDropdown_API(loginEmployeeID())
        if (resp3.StatusCode === 200) {
            setPartyRedux(resp3.Data)
        }
    }, [])

    const partyOptions = partyRedux
        ?.filter((data) => data.PartyType === "Franchises")
        .map((data) => ({
            value: data.id,
            label: data.Name
        }));


    // userAccess useEffect
    partyOptions.unshift({ value: 0, label: "All" })


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


    const [tableColumns] = DynamicColumnHook({ pageField })

    function onChangeParty(e) {
        setPartySelect(e);
        setTableData([]);
    }

    useEffect(() => {
        if ((btnMode === 2) && (tableData.length > 0)) {

            ExcelReportComponent({
                excelTableData: tableData,
                excelFileName: 'Transaction Log',
                extraColumn: tableColumns
                // customKeyColumns: { tableData: tableColumns, isButton: true },
            });
            // setTableData([]);
        }
    }, [tableData])

    const goButtonHandler = async (btnMode) => {
        setbtnMode(btnMode)
        try {
            if (partySelect.length === 0) {
                customAlert({
                    Type: 3,
                    Message: "Please Select Party"
                })
                return
            }
            // setTableData([]);
            setGoBtnloading(true);
            const jsonBody = JSON.stringify({
                "FromDate": convertDateTime_ydm(formDateSelect),
                "ToDate": convertDateTime_ydm(toDateSelect),
                "DivisionID": partySelect.value
            })
            const resp3 = await POSLog_Go_Btn_Api({ jsonBody })
            setGoBtnloading(false);
            if (resp3.StatusCode === 200) {

                setTableData(resp3.Data);
                dispatch(BreadcrumbShowCountlabel(`Count : ${resp3.Data.length}`))
            }
        } catch (w) { setGoBtnloading(false); }

    }

    const HeaderContent = () => {
        return (
            <div className="px-2 c_card_filter text-black">
                <div className="row mb-1">
                    <Col sm="3" className='mt-1'>
                        <FormGroup>
                            <div className="d-flex align-items-center">
                                <Label className="col-sm-5 p-2" htmlFor="fromdate">
                                    FromDate
                                </Label>
                                <Col sm="7">
                                    <C_TimePicker
                                        id="fromdate"
                                        value={formDateSelect}
                                        placeholder="Select FromDate"
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
                    <Col sm="3" className='mt-1' >
                        <FormGroup >
                            <div className="d-flex align-items-center">
                                <Label className="col-sm-5 p-2" htmlFor="todate">
                                    ToDate
                                </Label>
                                <Col sm="7">
                                    <C_TimePicker
                                        id="todate"
                                        name="todate"
                                        placeholder="Select ToDate"
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

                    <Col sm="3" className='mt-1' >
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

                    <Col sm="3" className='mt-2' >
                        <Row>
                            <Col sm="4" ></Col>
                            <Col sm="2" >
                                <Go_Button
                                    loading={btnMode === 1 && goBtnloading}
                                    onClick={() => goButtonHandler(1)} />
                            </Col>
                            <Col sm="4" className='mt-n2' >
                                <C_Button
                                    type="button"
                                    spinnerColor="white"
                                    loading={btnMode === 2 && goBtnloading}
                                    className="btn btn-primary mt-1 mr"
                                    onClick={() => goButtonHandler(2)}
                                >
                                    Excel
                                </C_Button>
                            </Col>
                        </Row>
                    </Col>
                </div>

            </div>
        );
    };

    return (

        <React.Fragment>
            <PageLoadingSpinner isLoading={!pageField} />
            <div className="page-content">
                <HeaderContent />
                <GlobalCustomTable
                    keyField="id"
                    data={tableData}
                    columns={tableColumns}
                    paginationEnabled={200}//show pagination 200 per page
                    classes={"custom-table"}
                    noDataIndication={
                        <div className="text-danger text-center ">
                            Record Not available
                        </div>
                    }
                    onDataSizeChange={({ dataCount }) => {

                        dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                    }}
                />

            </div>
        </React.Fragment>
    )
}
export default POS_Log
