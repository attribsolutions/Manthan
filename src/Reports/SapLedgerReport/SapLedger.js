
import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Button,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageFieldSuccess } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";
import { mode, pageId } from "../../routes/index"

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";

import * as _cfunc from "../../components/Common/CommonFunction";
import { C_DatePicker } from "../../CustomValidateForm";
import { commonPageField } from "../../store/actions";
import { SapLedger_Go_Button_API, SapLedger_Go_Button_API_Success } from "../../store/Report/SapLedger Redux/action";
import { Go_Button } from "../../components/Common/CommonButton";

const SapLedger = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [userPageAccessState, setUserAccState] = useState('');
    const [loadingDate, setLoadingDate] = useState(currentDate_ymd);
    const [headerFilters, setHeaderFilters] = useState('');

    const {
        userAccess,
        List,
        goBtnLoading,
        pageField,
    } = useSelector((state) => ({
        goBtnLoading: state.SapLedgerReducer.goBtnLoading,
        List: state.SapLedgerReducer.goBtnSapLedger,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,

    }));

    const { data = [], Data = [] } = List
    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

    const tableColumns = [
        {
            text: "Document No",
            dataField: "DocumentNo",
        },
        {
            text: "FiscalYear",
            dataField: "Fiscalyear",
        },
        {
            text: "DocumentType",
            dataField: "DocumentType",
        },
        {
            text: "	DocumentDesc",
            dataField: "DocumentDesc",
        },
        {
            text: "PostingDate",
            dataField: "PostingDate",
        },
        {
            text: "DebitCredit",
            dataField: "DebitCredit",
        },
        {
            text: "Debit Amount",
            dataField: "Debit_Amount",
            align: "right"

        },
        {
            text: "	Credit Amount",
            dataField: "Credit_Amount",
            align: "right"


        },
        {
            text: "	ItemText",
            dataField: "ItemText",
        },

    ];

    const rowStyle = (row, rowIndex) => {

        const style = {};
        if (row.id > 0) {

        } else {
            style.backgroundColor = 'rgb(239, 239, 239)';
            style.fontWeight = 'bold';
            style.fontSize = '4';
        }
        return style;
    };

    // const [tableColumns] = DynamicColumnHook({ pageField })

    useEffect(() => {
        dispatch(SapLedger_Go_Button_API_Success([]))
        const page_Id = pageId.SAP_LEDGER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`${"Sap Ledger count"} :${Number(data.length)}`))
    }, [List])

    let partdata = localStorage.getItem("roleId")
    var partyDivisiondata = JSON.parse(partdata);

    function goButtonHandler() {

        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            SAPCode: partyDivisiondata.SAPPartyCode
        });
        dispatch(SapLedger_Go_Button_API_Success([]))
        dispatch(SapLedger_Go_Button_API(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
        dispatch(SapLedger_Go_Button_API_Success([]))

    }

    function todateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.todate = date
        setHeaderFilters(newObj)
        dispatch(SapLedger_Go_Button_API_Success([]))

    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    <div className="px-2  c_card_filter text-black " >
                        <div className="row">
                            <div className=" row">
                                <Col sm="5" className="">
                                    <FormGroup className="mb- row mt-2 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "83px" }}>From Date</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='fromdate'
                                                value={fromdate}
                                                onChange={fromdateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col sm="6" className="">
                                    <FormGroup className="mb- row mt-2 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "65px" }}>To Date</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                nane='todate'
                                                value={todate}
                                                onChange={todateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col sm="1" className="mt-2 ">
                                    <Go_Button loading={goBtnLoading} onClick={goButtonHandler} />

                                </Col>
                            </div>

                        </div>
                    </div>
                    <ToolkitProvider
                        keyField="id"
                        data={data}
                        columns={tableColumns}
                        search
                    >
                        {toolkitProps => (
                            <React.Fragment>
                                <Row>
                                    <Col sm={9}>
                                        <Label className="col-sm-6 mt-1 p-1 text-black"
                                            style={{ width: "270px", background: "#efefef", borderRadius: "5px" }}>Opening Balance:  {Data.OpeingBal}
                                        </Label>
                                    </Col>
                                    <Col sm={3}>

                                        <Label className="col-sm-6 mt-1 p-1 text-black"
                                            style={{ width: "257px", background: "#efefef", borderRadius: "5px" }}>Closing Balance: {Data.ClosingBal}
                                        </Label>
                                    </Col>

                                </Row>

                                <div className="table-responsive" id="TableDiv" >
                                    <BootstrapTable
                                        keyField={"id"}
                                        bordered={true}
                                        striped={false}
                                        rowStyle={rowStyle}
                                        // selectRow={selectAllCheck(rowSelected())}
                                        noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                        classes={"table align-middle table-nowrap table-hover"}
                                        headerWrapperClasses={"thead-light"}

                                        {...toolkitProps.baseProps}

                                    />
                                    {mySearchProps(toolkitProps.searchProps)}
                                </div>
                                {/* <div >Closing Balance :<Label className="col-sm-5"
                                    style={{ width: "65px" }}>{List.ClosingBal}</Label></div> */}

                            </React.Fragment>
                        )
                        }
                    </ToolkitProvider>


                </div >
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default SapLedger;




