import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Button
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageFieldSuccess } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import { url, mode, pageId } from "../../../../routes/index"
import { LoadingSheet_GoBtn_API_Succcess } from "../../../../store/Sales/LoadingSheetRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../../components/Common/SearchBox/MySearch";
import { makeBtnCss } from "./../../../../components/Common/ListActionsButtons";
import { GetOpeningBalance, ReceiptGoButtonMaster, ReceiptGoButtonMaster_Success } from "../../../../store/Accounting/Receipt/action";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import DynamicColumnHook, { selectAllCheck } from "../../../../components/Common/TableCommonFunc";
import { C_DatePicker } from "../../../../CustomValidateForm";
import * as _cfunc from "../../../../components/Common/CommonFunction";

const LoadingSheetUpdate = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [userPageAccessState, setUserAccState] = useState('');
    const [loadingDate, setLoadingDate] = useState(currentDate_ymd);

    const {
        userAccess,
        List,
        makeReceipt,
        OpeningBalance,
        pageField,
    } = useSelector((state) => ({
        List: state.LoadingSheetReducer.LoadingSheetUpdate,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        makeReceipt: state.ReceiptReducer.ReceiptGoButton,
        OpeningBalance: state.ReceiptReducer.OpeningBalance,
    }));
    const { InvoiceParent = [], PartyDetails = {} } = List

    const lastColumn = () => ({
        text: "Action",
        dataField: "",
        formatter: (cellContent, row) => {

            return (<span style={{ justifyContent: 'center' }}>
                <Button
                    type="button"
                    id={`btn-makeBtn-${row.id}`}
                    title={"Make Receipt"}
                    className={makeBtnCss}
                    onClick={(e) => {
                        makeBtnFunc(e, row)
                    }}
                >
                    <span style={{ marginLeft: "6px", marginRight: "6px" }}
                        className=" fas fa-file-invoice" ></span> </Button></span>)
        }
    })
    const [tableColumns] = DynamicColumnHook({ pageField,lastColumn })
    
    useEffect(() => {
        dispatch(LoadingSheet_GoBtn_API_Succcess([]))
        const page_Id = pageId.LOADING_SHEET_LIST_UPDATE
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

        if ((makeReceipt.Status === true) && (makeReceipt.StatusCode === 200) && !(OpeningBalance === '')) {
            dispatch(ReceiptGoButtonMaster_Success({ ...makeReceipt, Status: false }))

            history.push({
                pathname: makeReceipt.path,
                pageMode: makeReceipt.pageMode,
                editValue: makeReceipt.ListData,
            })
        }
    }, [makeReceipt, OpeningBalance])

    function makeBtnFunc(e, row) {
        var { CustomerID, id } = row
        try {
            const jsonBody = JSON.stringify({
                PartyID: _cfunc.loginPartyID(),
                CustomerID: CustomerID,
                InvoiceID: (id).toString()
            });

            const jsonBody1 = JSON.stringify({
                PartyID: _cfunc.loginPartyID(),
                CustomerID: CustomerID,
                ReceiptDate: currentDate_ymd
            });

            const body = { jsonBody, pageMode: mode.modeSTPList, path: url.RECEIPTS, ListData: row }
            dispatch(ReceiptGoButtonMaster(body));
            dispatch(GetOpeningBalance(jsonBody1));

        } catch (e) { }
    }
   
    function rowSelected() {
        return InvoiceParent.map((index) => { return (index.selectCheck) && index.id })
    }

    function DateOnchange(e, date) {
        setLoadingDate(date)
    }

    function MakeReceiptForAll() {
        const result = InvoiceParent.map((index) => {
            if (index.selectCheck === true) {
                return index.id
            }
        })

        const LoadingNumber = result.toString()

        const jsonBody = JSON.stringify({
            PartyID: _cfunc.loginPartyID(),
            CustomerID: "",
            InvoiceID: LoadingNumber
        });

        const body = { jsonBody }

        if (LoadingNumber === ",") {
            customAlert({
                Type: 3,
                Message: "Select At Least One Invoice",
            })
        }
        else {
            dispatch(ReceiptGoButtonMaster(body))
            history.push(url.BULK_RECIPT);
        }
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>
                    <div id="id1"></div>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-2" >

                            <div className=" row ">
                                <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px" }}>Loading NO :</Label>
                                        <Col sm="7">
                                            <Label className=" mt-2">{PartyDetails.LoadingSheetNo}</Label>
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>Loading Date </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='Date'
                                                value={loadingDate}
                                                onChange={DateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </div>
                        </div>

                        <ToolkitProvider
                            keyField="id"
                            data={InvoiceParent}
                            columns={tableColumns}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <div className="table">
                                        <BootstrapTable
                                            keyField={"id"}
                                            bordered={true}
                                            striped={false}
                                            selectRow={selectAllCheck(rowSelected())}
                                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                            classes={"table align-middle table-nowrap table-hover"}
                                            headerWrapperClasses={"thead-light"}

                                            {...toolkitProps.baseProps}

                                        />
                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>

                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>

                        {
                            InvoiceParent.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} className={"row save1"}>
                                        <button type="button" style={{ width: "120px" }} onClick={MakeReceiptForAll} className="btn btn-primary  waves-effect waves-light">Make Receipt</button>
                                    </Col>
                                </FormGroup >
                                : null
                        }

                    </form >
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

export default LoadingSheetUpdate



