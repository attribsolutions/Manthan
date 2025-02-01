import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    commonPageFieldList,
    commonPageFieldListSuccess,
    getpdfReportdata
} from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Col, FormGroup, Input, Label, Modal, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import { GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess, Retailer_List, Retailer_List_Success } from "../../../store/CommonAPI/SupplierRedux/actions";
import { C_Button, Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import SalesReturn from "./SalesReturn";
import { Upload_Return, Upload_Return_Succcess, confirm_SalesReturn_Id, confirm_SalesReturn_Id_Succcess, delete_SalesReturn_Id, delete_SalesReturn_Id_Succcess, post_Send_to_superStockiest_Id, salesReturnListAPI, salesReturnListAPISuccess } from "../../../store/Sales/SalesReturnRedux/action";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"
import SalesReturnView_Modal from "./SalesReturnConfirm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as report from '../../../Reports/ReportIndex'
import { ReturnPrint_API } from "../../../helpers/backend_helper";
import { return_discountCalculate_Func } from "./SalesCalculation";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import Slidewithcaption from "../../../components/Common/CommonImageComponent";
import { allLabelWithBlank } from "../../../components/Common/CommonErrorMsg/HarderCodeData";
import SERVER_HOST_PATH from "../../../helpers/_serverPath";
import { sideBarPageFiltersInfoAction } from "../../../store/Utilites/PartyDrodown/action";
import { MarathiReport, PDF_ReturnReport } from "../../Purchase/Return/ReturnPDF";

const SalesReturnList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Customer: allLabelWithBlank,
        listData: {},
        UploadModalOpen: false,
        UploadedFile: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [FileLoading, setFileLoading] = useState(false)
    const [Return_Pdf_loading, setReturn_Pdf_loading] = useState(false); 
    const [pageMode, setPageMode] = useState(mode.defaultList)
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [otherState, setOtherState] = useState({ masterPath: '', newBtnPath: '', buttonMsgLable: '' });
    const [PurchaseReturnMode_3_Access, setPurchaseReturnMode_3_Access] = useState(false);
    const customerdropdownLabel = subPageMode === url.SALES_RETURN_LIST ? "Customer" : "Supplier";

    const values = { ...state.values };

    const action = {
        getList: salesReturnListAPI,
        deleteId: delete_SalesReturn_Id,
        deleteSucc: delete_SalesReturn_Id_Succcess
    }

    const reducers = useSelector(
        (state) => ({
            sendToSSbtnLoading: state.SalesReturnReducer.sendToSSbtnLoading,
            retailerDropLoading: state.CommonAPI_Reducer.retailerDropLoading,
            vendorSupplierCustomerLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
            loading: state.SalesReturnReducer.loading,

            UploadMsg: state.SalesReturnReducer.UploadMsg,

            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            listBtnLoading: (state.SalesReturnReducer.listBtnLoading || state.PdfReportReducers.ReportBtnLoading),
            tableList: state.SalesReturnReducer.salesReturnList,
            sendToSSbtnTableData: state.SalesReturnReducer.sendToSSbtnTableData,
            deleteMsg: state.SalesReturnReducer.deleteMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            viewData_redux: state.SalesReturnReducer.confirmBtnData,
            ApprovrMsg: state.SalesReturnReducer.ApprovrMsg,
        })
    );

    const { pageField, RetailerList, supplier, sendToSSbtnTableData, userAccess, ApprovrMsg, loading, sendToSSbtnLoading, retailerDropLoading, vendorSupplierCustomerLoading, UploadMsg } = reducers;

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            partySelectButtonHandler();
        } else {
            partySelectOnChangeHandler();
        }
    }, [commonPartyDropSelect]);

    // sideBar Page Filters Information
    useEffect(() => {

        dispatch(sideBarPageFiltersInfoAction([
            { label: "FromDate", content: _cfunc.date_dmy_func(values.FromDate), },
            { label: "ToDate", content: _cfunc.date_dmy_func(values.ToDate), },
            { label: customerdropdownLabel, content: values.Customer.label, }
        ]));

    }, [state]);

    // userAccess useEffect
    useEffect(() => {
        userAccess.find((index) => {
            if (index.id === pageId.PURCHASE_RETURN_MODE_3) {
                return setPurchaseReturnMode_3_Access(true)
            }
        });
    }, [userAccess])

    // Featch Modules List data  First Rendering
    useEffect(() => {
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let newBtnPath = false;
        let buttonMsgLable = '';

        if (subPageMode === url.PURCHASE_RETURN_LIST) {
            page_Id = pageId.PURCHASE_RETURN_LIST
            masterPath = url.PURCHASE_RETURN
            newBtnPath = url.PURCHASE_RETURN
            buttonMsgLable = "Purchase Return"
        }
        else if (subPageMode === url.SALES_RETURN_LIST) {
            page_Id = pageId.SALES_RETURN_LIST;
            masterPath = url.SALES_RETURN
            newBtnPath = url.SALES_RETURN
            buttonMsgLable = "Sales Return"
        }
        setPageMode(page_Mode)
        setSubPageMode(subPageMode)
        setOtherState({ masterPath, newBtnPath, buttonMsgLable })
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        if (!(_cfunc.loginSelectedPartyID() === 0)) {
            goButtonHandler()
        }

        return () => {
            dispatch(salesReturnListAPISuccess([]));
            dispatch(GetVenderSupplierCustomerSuccess([]));
            dispatch(Retailer_List_Success([]));
        }
    }, []);

    useEffect(async () => {
        if ((sendToSSbtnTableData.Status === true) && (sendToSSbtnTableData.StatusCode === 200)) {
            setFileLoading(true)
            const { Data = [] } = sendToSSbtnTableData;
            let grand_total = 0;
            const updatedTableDataPromises = Data.map((item, index) => {
                return _cfunc.fetchFiles(item.ReturnItemImages)
                    .then(files => {
                        const calculate = return_discountCalculate_Func(item);
                        item["roundedTotalAmount"] = calculate.roundedTotalAmount;
                        grand_total += Number(calculate.roundedTotalAmount);

                        return {
                            ...item,
                            id: index + 1,
                            salesQuantity: item.Quantity,
                            Quantity: item.ApprovedQuantity,
                            tableBatchDate: _cfunc.date_dmy_func(item.BatchDate),
                            File: files  // Adding files to the item object
                        };
                    });
            });
            // Wait for all the file fetching and calculations to complete
            const updatedTableData = await Promise.all(updatedTableDataPromises);

            history.push({
                pathname: url.PURCHASE_RETURN_MODE_3,
                updatedTableData: updatedTableData,
                GrandTotal: grand_total
            })
            setFileLoading(false)
        }
    }, [sendToSSbtnTableData])

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: commonPartyDropSelect.value,
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
        dispatch(GetVenderSupplierCustomer({ subPageMode, PartyID: commonPartyDropSelect.value }))
    }, []);

    useEffect(() => {
        if ((ApprovrMsg.Status === true) && (ApprovrMsg.StatusCode === 200) || (UploadMsg.Status === true) && (UploadMsg.StatusCode === 200)) {
            goButtonHandler()
        }
    }, [ApprovrMsg, UploadMsg])

    useEffect(() => {
        if ((reducers.viewData_redux.Status === true) && (reducers.viewData_redux.pageMode === mode.modeSTPsave)) {

            history.push({
                pathname: url.GOODS_CREDIT_NOTE,
                editValue: reducers.viewData_redux.Data[0],
                pageMode: mode.modeSTPsave
            })
        }
        return () => {
            dispatch(confirm_SalesReturn_Id_Succcess({ Status: false }))
        }
    }, [reducers.viewData_redux.pageMode])

    useEffect(() => {

        if ((UploadMsg.Status === true) && (UploadMsg.StatusCode === 200) && UploadMsg.Type === "Remove") {
            dispatch(Upload_Return_Succcess({ Status: false }))
            setState((i) => {
                const a = { ...i }
                a.values.UploadModalOpen = false;
                a.hasValid.UploadModalOpen.valid = true
                return a
            })
            customAlert({
                Type: 1,
                Message: alertMessages.imageRemoveSuccessfully,
            })

        } else if ((UploadMsg.Status === true) && (UploadMsg.StatusCode === 200)) {
            dispatch(Upload_Return_Succcess({ Status: false }))
            setState((i) => {
                const a = { ...i }
                a.values.UploadModalOpen = false;
                a.hasValid.UploadModalOpen.valid = true
                return a
            })
            customAlert({
                Type: 1,
                Message: UploadMsg.Message,
            })
        }
    }, [UploadMsg])

    const isUploadAccess = useMemo(() => {
        const systemSetting = _cfunc.loginSystemSetting()?.PurchaseReturnPrintUpload;
        const partyTypeId = _cfunc.loginUserDetails()?.PartyTypeID;

        if (systemSetting && partyTypeId) {
            const allowedPartyTypes = systemSetting.split(',').map(value => parseInt(value));
            return allowedPartyTypes.includes(partyTypeId);
        }

        return false; // Default value if any of the required properties is missing
    }, [_cfunc.loginSystemSetting, _cfunc.loginUserDetails]);

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    customerOptions.unshift({
        value: "",
        label: " All"
    });

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    supplierOptions.unshift({
        value: "",
        label: " All"
    });

    const goButtonHandler = () => {
        try {
            if (_cfunc.loginSelectedPartyID() === 0) {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            };
            const salesReturnJsonBody = JSON.stringify({
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                CustomerID: values.Customer.value,
                PartyID: commonPartyDropSelect.value,
            });
            const purchaseReturnJsonBody = JSON.stringify({
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                CustomerID: commonPartyDropSelect.value,
                PartyID: values.Customer.value,
            });

            let jsonBody;
            if (subPageMode === url.SALES_RETURN_LIST) {
                jsonBody = (salesReturnJsonBody);
            }
            else {
                jsonBody = (purchaseReturnJsonBody);
            }
            dispatch(salesReturnListAPI(jsonBody));
        } catch (error) { }
        return
    };

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
    }

    function CustomerOnChange(e) {
        setState((i) => {
            const a = { ...i }
            a.values.Customer = e;
            a.hasValid.Customer.valid = true
            return a
        })
    }

    function viewApprovalBtnFunc(config) {
        config["viewMode"] = subPageMode
        dispatch(confirm_SalesReturn_Id(config))
    }

    const makeBtnFunc = (List, btnId) => {

        const id = List[0].id
        const config = {
            editId: id,
            pageMode: mode.modeSTPsave,
            btnId: btnId
        };

        dispatch(confirm_SalesReturn_Id(config))
    };

    function downBtnFunc(config) {
        config["ReportType"] = report.Return;
        dispatch(getpdfReportdata(ReturnPrint_API, config))
    }

    function upBtnFunc(config) {
        let isMadalOpen = false
        const Image = config.rowData.ASMApprovalImgUpload

        if (Image === null && isUploadAccess) {
            isMadalOpen = false
            customAlert({ Type: 3, Message: alertMessages.returnImageNotUploaded });
            return;
        } else {
            isMadalOpen = true
        }

        setState((i) => {
            const a = { ...i }
            a.values.listData = config;
            a.values.UploadModalOpen = isMadalOpen;

            a.values.UploadedFile = config.rowData.ASMApprovalImgUpload
            a.hasValid.UploadedFile.valid = true;

            a.hasValid.listData.valid = true
            a.hasValid.UploadModalOpen.valid = true
            return a
        })
    }
    const UploadHandler = (Type) => {
        if (Type === "Upload") {
            if (values.UploadedFile !== "") {
                const formData = new FormData();
                const updateId = values.listData.rowData.id
                formData.append(`ASMApprovalImgUpload`, values.UploadedFile);
                dispatch(Upload_Return({ formData, updateId, Type }))
            }
        } else {
            const formData = new FormData();
            const updateId = values.listData.rowData.id
            formData.append(`ASMApprovalImgUpload`, "");
            dispatch(Upload_Return({ formData, updateId, Type }))
        }
    }

    function tog_backdrop() {
        setState((i) => {
            const a = { ...i }
            a.values.UploadModalOpen = !values.UploadModalOpen;
            a.hasValid.UploadModalOpen.valid = true
            return a
        })
        removeBodyCss()
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    const partySelectButtonHandler = () => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: commonPartyDropSelect.value,
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
        dispatch(GetVenderSupplierCustomer({ subPageMode, PartyID: commonPartyDropSelect.value }))
        goButtonHandler()
    }

    function partySelectOnChangeHandler() {
        dispatch(salesReturnListAPISuccess([]));
        dispatch(Retailer_List_Success([]));
        dispatch(GetVenderSupplierCustomerSuccess([]));

        setState((i) => {
            let a = { ...i }
            a.values.Customer = allLabelWithBlank
            a.hasValid.Customer.valid = true;
            return a
        })
    }

    const handlePDFGeneration = async () => {
        setReturn_Pdf_loading(true); // Start the loader
        try {
            await PDF_ReturnReport({ Table_Data: reducers.tableList, Supplier: values.Customer });
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setReturn_Pdf_loading(false); // Stop the loader after completion
        }
    };

    const HeaderContent = () => {
        return (
            <div className="px-2   c_card_filter text-black" >
                <div className="row" >
                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "83px" }}>FromDate</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    name='FromDate'
                                    value={values.FromDate}
                                    onChange={fromdateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "65px" }}>ToDate</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    name="ToDate"
                                    options={{
                                        minDate: (_cfunc.disablePriviousTodate({ fromDate: values.FromDate })),
                                        maxDate: "today",
                                        altInput: true,
                                        altFormat: "d-m-Y",
                                        dateFormat: "Y-m-d",
                                    }}
                                    value={_cfunc.ToDate({ FromDate: values.FromDate, Todate: values.ToDate })}
                                    onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="4">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"

                                style={{ width: "115px" }}>{customerdropdownLabel}</Label>
                            <Col sm="5">
                                <C_Select
                                    name="Customer"
                                    classNamePrefix="select2-Customer"
                                    value={values.Customer}
                                    isLoading={subPageMode === url.SALES_RETURN_LIST ? retailerDropLoading : vendorSupplierCustomerLoading}
                                    options={subPageMode === url.SALES_RETURN_LIST ? customerOptions : supplierOptions}
                                    onChange={CustomerOnChange}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col >



                    <Col sm={2} className=" d-flex justify-content-end" >

                        <C_Button className="btn btn-success" spinnerColor="white" style={{ marginTop: "18px", marginBottom: "16px", marginRight: ((values.Customer.value !== "" && reducers.tableList.length > 0)?"0px":"50px")  }} loading={reducers.loading} onClick={goButtonHandler} >
                            Go</C_Button>
                        {((values.Customer.value !== "" && reducers.tableList.length > 0) && (subPageMode !== url.SALES_RETURN_LIST)) ? 
                        <C_Button
                            type="button"
                            spinnerColor="primary"
                            style={{
                                marginTop: "18px",
                                marginBottom: "16px",

                            }}
                            loading={Return_Pdf_loading}
                            className="btn btn-outline-primary border-1 font-size-12 text-center m-3 "
                            onClick={handlePDFGeneration}
                        >
                            Print</C_Button> : null}
                    </Col>

                </div>
            </div >
        )
    }

    const selectSaveBtnHandler = (row = []) => {

        let ischeck = row.filter(i => (i.selectCheck && !i.forceSelectDissabled))
        if (!ischeck.length > 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectOneCheckbox,
            });
            return
        }
        let idString = ischeck.map(obj => obj.id).join(',')
        let jsonBody = JSON.stringify({ PartyID: commonPartyDropSelect.value, ReturnID: idString })
        dispatch(post_Send_to_superStockiest_Id({ jsonBody, ReturnID: idString }))
    }

    function isFile(obj) {
        return obj instanceof File || (obj instanceof Blob && typeof obj.name === "string");
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <PageLoadingSpinner isLoading={(loading || !pageField)} />
                {
                    (pageField) &&
                    <CommonPurchaseList
                        action={action}
                        reducers={reducers}
                        showBreadcrumb={false}
                        MasterModal={SalesReturn}
                        masterPath={otherState.masterPath}
                        newBtnPath={otherState.newBtnPath}
                        subPageMode={subPageMode}
                        pageMode={pageMode}
                        viewApprovalBtnFunc={viewApprovalBtnFunc}
                        makeBtnFunc={makeBtnFunc}
                        makeBtnName={"Create Credit Note for"}
                        HeaderContent={HeaderContent}
                        downBtnFunc={downBtnFunc}
                        upBtnFunc={upBtnFunc}
                        goButnFunc={goButtonHandler}
                        ButtonMsgLable={otherState.buttonMsgLable}
                        deleteName={"FullReturnNumber"}
                        totalAmountShow={true}
                        selectCheckParams={{
                            // isShow: ((subPageMode === url.SALES_RETURN_LIST) && PurchaseReturnMode_3_Access),
                            selectSaveBtnHandler: selectSaveBtnHandler,
                            selectSaveBtnLabel: "Send To Supplier",
                            selectHeaderLabel: "Select",
                            selectSaveBtnLoading: sendToSSbtnLoading || FileLoading
                        }}

                    />
                }
            </div >
            <SalesReturnView_Modal subPageMode={subPageMode} />

            {/* image  show and upload modal  */}
            <Modal
                isOpen={values.UploadModalOpen}
                toggle={() => {
                    tog_backdrop()
                }}
                style={{ width: "800px", height: "800px", borderRadius: "50%" }}
                className="modal-dialog-centered"
            >
                <div>
                    {((values.UploadedFile !== null)) && <Slidewithcaption Images={[{
                        Image: isFile(values.UploadedFile) ? URL.createObjectURL(values.UploadedFile) : `${SERVER_HOST_PATH}${values.listData.rowData?.ASMApprovalImgUpload}`

                    }]} />}
                    {!isUploadAccess && !values.listData.rowData?.IsApproved ? <div className=" px-2 col-12" role="group">
                        <Row>
                            <Col sm={2}>
                                <Label className=" mt-2 p-2"
                                    style={{ width: "60px" }}>Upload</Label>
                            </Col>
                            <Col sm={5}>
                                <Input
                                    type="file"
                                    className="form-control mt-2"
                                    name="image"
                                    id="file"
                                    accept=".jpg, .jpeg, .png,"
                                    onChange={(event) => {
                                        const selectedFile = event.target.files[0];
                                        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                                        if (selectedFile) {
                                            if (allowedTypes.includes(selectedFile.type)) {
                                                setState((i) => {
                                                    let a = { ...i }
                                                    a.values.UploadedFile = selectedFile
                                                    a.hasValid.UploadedFile.valid = true;
                                                    return a
                                                })
                                            } else {
                                                customAlert({
                                                    Type: 4,
                                                    Message: alertMessages.ImageIsRequired,
                                                });

                                            }
                                        }
                                    }}
                                />
                            </Col>
                            {values.UploadedFile !== null ? null : <Col sm={2}></Col>}
                            <Col sm={2}>
                                <button name="image"
                                    accept=".jpg, .jpeg, .png ,.pdf"
                                    onClick={() => {
                                        UploadHandler("Upload")
                                    }}
                                    id="ImageId" type="button" className="btn btn-primary mt-2">Upload</button>
                            </Col>
                            {values.UploadedFile !== null ? <Col sm={1}>
                                <button name="image"
                                    accept=".jpg, .jpeg, .png ,.pdf"
                                    onClick={() => {
                                        UploadHandler("Remove")
                                    }}
                                    id="ImageId" type="button" className="btn btn-danger mt-2 ">Remove</button>
                            </Col> : null}
                        </Row>
                    </div> : null}


                </div>




            </Modal>

        </React.Fragment >
    )
}

export default SalesReturnList;