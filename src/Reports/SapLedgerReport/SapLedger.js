
// import React, { useEffect, useState } from "react";
// import {
//     Col,
//     FormGroup,
//     Label,
//     Button
// } from "reactstrap";
// import { MetaTags } from "react-meta-tags";
// import { commonPageFieldSuccess } from "../../store/actions";
// import { useDispatch, useSelector } from "react-redux";

// import { useHistory } from "react-router-dom";
// import { url, mode, pageId } from "../../routes/index"
// import { LoadingSheet_GoBtn_API_Succcess } from "../../store/Sales/LoadingSheetRedux/action";
// import ToolkitProvider from "react-bootstrap-table2-toolkit";
// import BootstrapTable from "react-bootstrap-table-next";
// import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
// import { makeBtnCss } from "../../components/Common/ListActionsButtons";
// import { GetOpeningBalance, ReceiptGoButtonMaster, ReceiptGoButtonMaster_Success } from "../../store/Accounting/Receipt/action";

// import DynamicColumnHook, { selectAllCheck } from "../../components/Common/TableCommonFunc";
// import * as _cfunc from "../../components/Common/CommonFunction";
// import { customAlert } from "../../CustomAlert/ConfirmDialog";
// import { C_DatePicker } from "../../CustomValidateForm";
// import { commonPageField } from "../../store/actions";
// import { SapLedger_Go_Button_API, SapLedger_Go_Button_API_Success } from "../../store/Report/SapLedger Redux/action";

// const SapLedger = (props) => {

//     const dispatch = useDispatch();
//     const history = useHistory()
//     const currentDate_ymd = _cfunc.date_ymd_func();

//     const [userPageAccessState, setUserAccState] = useState('');
//     const [loadingDate, setLoadingDate] = useState(currentDate_ymd);
//     const [headerFilters, setHeaderFilters] = useState('');

//     const {
//         userAccess,
//         List,
//         LoginPartydata,
//         pageField,
//     } = useSelector((state) => ({
//         List: state.SapLedgerReducer.goBtnSapLedger,
//         userAccess: state.Login.RoleAccessUpdateData,
//         pageField: state.CommonPageFieldReducer.pageField,
//          LoginPartydata:state.Login.divisionDropdown
//     }));
//     const { data = [], PartyDetails = {} } = List
//     const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;


//     const [tableColumns] = DynamicColumnHook({ pageField })

//     useEffect(() => {
//         dispatch(SapLedger_Go_Button_API_Success([]))
//         const page_Id = pageId.SAP_LEDGER
//         dispatch(commonPageFieldSuccess(null));
//         dispatch(commonPageField(page_Id))
//     }, []);

//     const location = { ...history.location }
//     const hasShowloction = location.hasOwnProperty(mode.editValue)
//     const hasShowModal = props.hasOwnProperty(mode.editValue)

//     // userAccess useEffect
//     useEffect(() => {
//         let userAcc = null;
//         let locationPath = location.pathname;
//         if (hasShowModal) {
//             locationPath = props.masterPath;
//         };
//         userAcc = userAccess.find((inx) => {
//             return (`/${inx.ActualPagePath}` === locationPath)
//         })
//         if (userAcc) {
//             setUserAccState(userAcc)
//             _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
//         };
//     }, [userAccess])

//     // const Sapcode = LoginPartydata.map((index) => ({
//     //     Sapcode: index.SAPPartyCode,

//     // }));
//     debugger
//   let partdata =  localStorage.getItem("roleId")
//   var partyDivisiondata  = JSON.parse(partdata);

//     function goButtonHandler() {

//         const jsonBody = JSON.stringify({
//             FromDate: fromdate,
//             ToDate: todate,
//             SAPCode:partyDivisiondata.SAPPartyCode
//         });
//         dispatch(SapLedger_Go_Button_API(jsonBody));
//     }

//     function fromdateOnchange(e, date) {
//         let newObj = { ...headerFilters }
//         newObj.fromdate = date
//         setHeaderFilters(newObj)
//     }

//     function todateOnchange(e, date) {
//         let newObj = { ...headerFilters }
//         newObj.todate = date
//         setHeaderFilters(newObj)
//     }



//     // function MakeReceiptForAll() {
//     //     const result = data.map((index) => {
//     //         if (index.selectCheck === true) {
//     //             return index.id
//     //         }
//     //     })

//     //     const LoadingNumber = result.toString()

//     //     const jsonBody = JSON.stringify({
//     //         PartyID: _cfunc.loginPartyID(),
//     //         CustomerID: "",
//     //         InvoiceID: LoadingNumber
//     //     });

//     //     const body = { jsonBody }

//     //     if (LoadingNumber === ",") {
//     //         customAlert({
//     //             Type: 3,
//     //             Message: "Select At Least One Invoice",
//     //         })
//     //     }
//     //     else {
//     //         dispatch(ReceiptGoButtonMaster(body))
//     //         history.push(url.BULK_RECIPT);
//     //     }
//     // }

//     if (!(userPageAccessState === '')) {
//         return (
//             <React.Fragment>
//                 <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

//                 <div className="page-content" style={{ marginBottom: "5cm" }}>

//                 <div className="px-2  c_card_filter text-black " >
//                     <div className="row">
//                         <div className=" row">
//                             <Col sm="5" className="">
//                                 <FormGroup className="mb- row mt-3 " >
//                                     <Label className="col-sm-5 p-2"
//                                         style={{ width: "83px" }}>From Date</Label>
//                                     <Col sm="7">
//                                         <C_DatePicker
//                                             name='fromdate'
//                                             value={fromdate}
//                                             onChange={fromdateOnchange}
//                                         />
//                                     </Col>
//                                 </FormGroup>
//                             </Col>
//                             <Col sm="5" className="">
//                                 <FormGroup className="mb- row mt-3 " >
//                                     <Label className="col-sm-5 p-2"
//                                         style={{ width: "65px" }}>To Date</Label>
//                                     <Col sm="7">
//                                         <C_DatePicker
//                                             nane='todate'
//                                             value={todate}
//                                             onChange={todateOnchange}
//                                         />
//                                     </Col>
//                                 </FormGroup>
//                             </Col>
//                             <Col sm="2" className="mt-3 ">
//                                 <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
//                                     onClick={() => goButtonHandler()}
//                                 >Go</Button>
//                             </Col>
//                         </div>

//                     </div>
//                 </div>
//                 <ToolkitProvider
//                             keyField="id"
//                             data={data}
//                             columns={tableColumns}
//                             search
//                         >
//                             {toolkitProps => (
//                                 <React.Fragment>
//                                     <div  className="table-responsive" id="TableDiv" >
//                                         <BootstrapTable
//                                             keyField={"id"}
//                                             bordered={true}
//                                             striped={false}
//                                             // selectRow={selectAllCheck(rowSelected())}
//                                             noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
//                                             classes={"table align-middle table-nowrap table-hover"}
//                                             headerWrapperClasses={"thead-light"}

//                                             {...toolkitProps.baseProps}

//                                         />
//                                         {mySearchProps(toolkitProps.searchProps)}
//                                     </div>

//                                 </React.Fragment>
//                             )
//                             }
//                         </ToolkitProvider>






//                     {/* <div id="id1"></div>

//                     <form noValidate>
//                         <div className="px-2 c_card_filter header text-black mb-2" >

//                             <div className=" row ">
//                                 <Col sm="6">
//                                     <FormGroup className=" row mt-2" >
//                                         <Label className="col-sm-1 p-2"
//                                             style={{ width: "115px" }}>Loading NO :</Label>
//                                         <Col sm="7">
//                                             <Label className=" mt-2">{PartyDetails.LoadingSheetNo}</Label>
//                                         </Col>
//                                     </FormGroup>
//                                 </Col >

//                                 <Col sm="6">
//                                     <FormGroup className=" row mt-2" >
//                                         <Label className="col-sm-1 p-2"
//                                             style={{ width: "115px", marginRight: "0.4cm" }}>Loading Date </Label>
//                                         <Col sm="7">
//                                             <C_DatePicker
//                                                 name='Date'
//                                                 value={loadingDate}
//                                                 onChange={DateOnchange}
//                                             />
//                                         </Col>
//                                     </FormGroup>
//                                 </Col >
//                             </div>
//                         </div>

//                         <ToolkitProvider
//                             keyField="id"
//                             data={InvoiceParent}
//                             columns={tableColumns}
//                             search
//                         >
//                             {toolkitProps => (
//                                 <React.Fragment>
//                                     <div className="table">
//                                         <BootstrapTable
//                                             keyField={"id"}
//                                             bordered={true}
//                                             striped={false}
//                                             selectRow={selectAllCheck(rowSelected())}
//                                             noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
//                                             classes={"table align-middle table-nowrap table-hover"}
//                                             headerWrapperClasses={"thead-light"}

//                                             {...toolkitProps.baseProps}

//                                         />
//                                         {mySearchProps(toolkitProps.searchProps)}
//                                     </div>

//                                 </React.Fragment>
//                             )
//                             }
//                         </ToolkitProvider>

//                         {
//                             InvoiceParent.length > 0 ?
//                                 <FormGroup>
//                                     <Col sm={2} className={"row save1"}>
//                                         <button type="button" style={{ width: "120px" }} onClick={MakeReceiptForAll} className="btn btn-primary  waves-effect waves-light">Make Receipt</button>
//                                     </Col>
//                                 </FormGroup >
//                                 : null
//                         }

//                     </form > */}
//                 </div >
//             </React.Fragment >
//         );
//     }
//     else {
//         return (
//             <React.Fragment></React.Fragment>
//         )
//     }
// };

// export default SapLedger;




import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Button,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageFieldSuccess } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";
import { url, mode, pageId } from "../../routes/index"
import { LoadingSheet_GoBtn_API_Succcess } from "../../store/Sales/LoadingSheetRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { makeBtnCss } from "../../components/Common/ListActionsButtons";
import { GetOpeningBalance, ReceiptGoButtonMaster, ReceiptGoButtonMaster_Success } from "../../store/Accounting/Receipt/action";

import DynamicColumnHook, { selectAllCheck } from "../../components/Common/TableCommonFunc";
import * as _cfunc from "../../components/Common/CommonFunction";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { C_DatePicker } from "../../CustomValidateForm";
import { commonPageField } from "../../store/actions";
import { SapLedger_Go_Button_API, SapLedger_Go_Button_API_Success } from "../../store/Report/SapLedger Redux/action";

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
        
        pageField,
    } = useSelector((state) => ({
        List: state.SapLedgerReducer.goBtnSapLedger,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
     
    }));


    const { data = [], PartyDetails = {} } = List
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
           
        },
        {
            text: "	Credit Amount",
            dataField: "Credit_Amount",
        
        },
        {
            text: "	ItemText",
            dataField: "ItemText",
        },

    ];












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


    let partdata = localStorage.getItem("roleId")
    var partyDivisiondata = JSON.parse(partdata);

    function goButtonHandler() {

        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            SAPCode: partyDivisiondata.SAPPartyCode
        });
        dispatch(SapLedger_Go_Button_API(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.todate = date
        setHeaderFilters(newObj)
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

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
                                <Col sm="5" className="">
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
                                <Col sm="2" className="mt-2 ">
                                    <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                        onClick={() => goButtonHandler()}
                                    >Go</Button>
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
                                            style={{ width: "270px" ,background:"#efefef", borderRadius:"5px" }}>Opening Balance :{List.OpeingBal}
                                        </Label>
                                    </Col>
                                    <Col sm={3}>

                                        <Label className="col-sm-6 mt-1 p-1 text-black"
                                            style={{width: "257px" ,background:"#efefef", borderRadius:"5px" }}>Closing Balance :{List.ClosingBal}
                                        </Label>
                                    </Col>

                                </Row>

                                <div className="table-responsive" id="TableDiv" >
                                    <BootstrapTable
                                        keyField={"id"}
                                        bordered={true}
                                        striped={false}
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




