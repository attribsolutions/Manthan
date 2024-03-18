import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Button,
    Spinner
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { url, mode, pageId } from "../../../routes/index"
import { LoadingSheet_GoBtn_API_Succcess, UpdateLoadingSheetSucccess } from "../../../store/Sales/LoadingSheetRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import { ReceiptGoButtonMaster, ReceiptGoButtonMaster_Success } from "../../../store/Accounting/Receipt/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import DynamicColumnHook, { selectAllCheck } from "../../../components/Common/TableCommonFunc";
import { C_DatePicker } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_Button } from "../../../components/Common/CommonButton";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

const LoadingSheetUpdate = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [subPageMode] = useState(history.location.pathname)
    const [userPageAccessState, setUserAccState] = useState('');
    const [loadingDate, setLoadingDate] = useState(currentDate_ymd);
    const [tableListData, setTableListData] = useState([]);
    const [partyDetails, setPartyDetails] = useState({});

    const {
        listBtnLoading,
        userAccess,
        LoadingSheetUpdateList,
        makeReceipt,
        OpeningBalance,
        pageField,
        commonPartyDropSelect
    } = useSelector((state) => ({
        listBtnLoading: state.ReceiptReducer.listBtnLoading,
        LoadingSheetUpdateList: state.LoadingSheetReducer.LoadingSheetUpdate,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        makeReceipt: state.ReceiptReducer.ReceiptGoButton,
        OpeningBalance: state.ReceiptReducer.OpeningBalance,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    // const { ReceiptFlag } = LoadingSheetUpdateList
    // const lastColumn = () => ({
    //     text: "Action",
    //     dataField: "",
    //     formatExtraData: { listBtnLoading },
    //     // hidden: true,
    //     formatter: (cellContent, row, key, { listBtnLoading }) => {
    //         const { ReceiptFlag } = row

    //         return (<></>
    //             // <span style={{ justifyContent: 'center' }}>
    //             //     <Button
    //             //         type="button"
    //             //         id={`btn-makeBtn-${row.id}`}
    //             //         title={"Make Receipt"}
    //             //         disabled={listBtnLoading || ReceiptFlag}
    //             //         className={makeBtnCss}
    //             //         onClick={(e) => {
    //             //             makeBtnFunc(e, row)
    //             //         }}
    //             //     >
    //             //         {(listBtnLoading === `btn-makeBtn-${row.id}`) ?
    //             //             <Spinner style={{ height: "16px", width: "16px" }} color="white" />
    //             //             : <span style={{ marginLeft: "6px", marginRight: "6px" }}
    //             //                 className=" fas fa-file-invoice" ></span>
    //             //         }
    //             //     </Button></span>
    //         )
    //     }
    // })

    useEffect(() => {
        dispatch(LoadingSheet_GoBtn_API_Succcess([]))
        const page_Id = pageId.LOADING_SHEET_LIST_UPDATE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    useEffect(() => {

        if ((LoadingSheetUpdateList.Status === true) && (LoadingSheetUpdateList.StatusCode === 200)) {
            dispatch(UpdateLoadingSheetSucccess({ Status: false }))
            setTableListData(LoadingSheetUpdateList.Data.InvoiceParent)
            setPartyDetails(LoadingSheetUpdateList.Data.PartyDetails)
        }

    }, [LoadingSheetUpdateList])

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const [tableColumns] = DynamicColumnHook({ pageField, reducers: { listBtnLoading } })

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

    // function makeBtnFunc(e, row) {
    //     var { CustomerID, id } = row
    //     try {
    //         const jsonBody = JSON.stringify({
    //             PartyID: _cfunc.loginPartyID(),
    //             CustomerID: CustomerID,
    //             InvoiceID: (id).toString()
    //         });

    //         const jsonBody1 = JSON.stringify({
    //             PartyID: _cfunc.loginPartyID(),
    //             CustomerID: CustomerID,
    //             ReceiptDate: currentDate_ymd
    //         });

    //         const config = { jsonBody, pageMode: mode.modeSTPList, path: url.RECEIPTS, ListData: row, btnId: `btn-makeBtn-${id}` }
    //         dispatch(ReceiptGoButtonMaster(config));
    //         dispatch(GetOpeningBalance(jsonBody1));

    //     } catch (e) { }
    // }

    function rowSelected() {
        return tableListData.map((index) => { return (index.selectCheck) && index.id })
    }

    const nonSelectedRow = () => {
        return tableListData.filter(row => row.ReceiptFlag).map(row => row.id)
    }

    function DateOnchange(e, date) {
        setLoadingDate(date)
    }

    function MakeReceiptForAll() {
        const result = tableListData.filter(index => index.selectCheck && !index.forceSelectDissabled).map(index => index.id);

        const LoadingNumber = result.toString()

        const jsonBody = JSON.stringify({
            PartyID: commonPartyDropSelect.value,
            CustomerID: "",
            InvoiceID: LoadingNumber
        });

        const body = { jsonBody }

        if (LoadingNumber === "") {
            customAlert({
                Type: 3,
                Message: alertMessages.atLeastOneInvoiceRequired,
            })
        }
        else {
            dispatch(ReceiptGoButtonMaster(body))
            history.push(url.BULK_RECIPT);
        }
    }

    const pagesListColumns = [
        {
            text: "Bill Date",
            dataField: "InvoiceDate",
        },

        {
            text: "Bill NO",
            dataField: "FullInvoiceNumber",
        },

        {
            text: "Customer Name",
            dataField: "Customer",
        },

        {
            text: "Amount",
            dataField: "AmountPaid",
            align: "right"
        },

    ];

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >
                    <form noValidate>

                        <div className="px-2   c_card_filter text-black" >
                            <div className="row" >
                                <Col sm={3} className="">
                                    <FormGroup className="mb- row mt-3 mb-1 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "115px" }}>Loading NO :</Label>
                                        <Col sm="7">
                                            <Label className=" mt-2">{partyDetails.LoadingSheetNo}</Label>
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={3} className="">
                                    <FormGroup className="mb- row mt-3 mb-1  " >
                                        <Label className="col-sm-7 p-2"
                                            style={{ width: "65px" }}>ToDate</Label>
                                        <Col sm="7" >
                                            <C_DatePicker
                                                name='Date'
                                                value={loadingDate}
                                                onChange={DateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                            </div>
                        </div >

                        <div className="mt-n1">
                            <ToolkitProvider
                                keyField="id"
                                data={tableListData}
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
                                                selectRow={selectAllCheck({
                                                    rowSelected: rowSelected(),
                                                    nonSelectable: nonSelectedRow(),
                                                    tableList: tableListData
                                                })}
                                                noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                                classes={"table align-middle table-nowrap table-hover"}
                                                headerWrapperClasses={"thead-light"}

                                                {...toolkitProps.baseProps}

                                            />
                                            {globalTableSearchProps(toolkitProps.searchProps)}
                                        </div>

                                    </React.Fragment>
                                )
                                }
                            </ToolkitProvider>
                        </div>

                        {
                            <SaveButtonDraggable>
                                <C_Button type="button"
                                    onClick={MakeReceiptForAll}
                                    className="btn btn-primary  waves-effect waves-light">
                                    Make Receipt</C_Button>
                            </SaveButtonDraggable>

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



