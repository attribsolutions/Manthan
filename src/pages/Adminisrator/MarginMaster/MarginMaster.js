import React, { useEffect, useState, useRef } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Breadcrumb_inputName, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { get_Party_ForDropDown } from "../../../store/Administrator/ItemsRedux/action";
import BootstrapTable from "react-bootstrap-table-next";
import {
    deleteIdForMarginMaster,
    deleteIdForMarginMasterSuccess,
    getMarginList,
    goButtonForMargin,
    goButtonForMarginSuccess,
    saveMarginMaster,
    saveMarginMasterSuccess
} from "../../../store/Administrator/MarginMasterRedux/action";
import {
    breadcrumbReturnFunc,
    loginUserID,
    loginCompanyID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import { priceListByCompay_Action } from "../../../store/Administrator/PriceList/action";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { CInput, C_DatePicker, decimalRegx } from "../../../CustomValidateForm";
import { mode, pageId, url } from "../../../routes";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { comAddPageFieldFunc, formValid, initialFiledFunc, onChangeDate, onChangeSelect, resetFunction } from "../../../components/Common/validationFunction";
import { Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { async } from "q";
import { mobileApp_ProductAdd_Api, mobileApp_ProductUpdate_Api } from "../../../helpers/backend_helper";
import { showToastAlert } from "../../../helpers/axios_Config";

const MarginMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const fileds = {
        EffectiveDate: "",
        PartyName: "",
        PriceListName: "",
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    //SetState  Edit data Geting From Modules List component
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState("");
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [selectedMargin, setSelectedMargin] = useState([]);
    const [marginDeleteId, setMarginDeleteId] = useState("");




    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        tableData,
        deleteMessage,
        Party,
        PriceList,
        userAccess,
        pageField,
        saveBtnloading,
        listBtnLoading,
    } = useSelector((state) => ({
        listBtnLoading: state.MarginMasterReducer.listBtnLoading,
        saveBtnloading: state.MarginMasterReducer.saveBtnloading,
        tableData: state.MarginMasterReducer.MarginGoButton,
        deleteMessage: state.MarginMasterReducer.deleteId_For_MarginMaster,
        postMsg: state.MarginMasterReducer.postMsg,
        Party: state.ItemMastersReducer.Party,
        PriceList: state.PriceListReducer.priceListByCompany,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    const { Data = [] } = tableData

    useEffect(() => {
        const page_Id = pageId.MARGIN
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        dispatch(priceListByCompay_Action());
        dispatch(get_Party_ForDropDown());
    }, [dispatch]);

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

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    // hasShowloction && hasShowModal useEffect
    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.page_Mode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
            }

            if (hasEditVal) {

                const { id, PriceList_id, PriceListName, Party_id, PartyName, EffectiveDate } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.PriceListName = { label: PriceListName, value: PriceList_id };
                values.PartyName = Party_id === null ? { label: "select", value: "" } : { label: PartyName, value: Party_id };
                values.EffectiveDate = EffectiveDate
                values.id = id

                hasValid.PriceListName.valid = true;
                hasValid.PartyName.valid = true;
                hasValid.EffectiveDate.valid = true;
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.PriceListName))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
        else {
            dispatch(goButtonForMarginSuccess({ Status: false }))
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveMarginMasterSuccess({ Status: false }))

            //***************mobail app api*********************** */
            let arrayOfMrpID = selectedMargin.map(function (i) {
                return i.Item;
            });
            const jsonBody = JSON.stringify({
                products: arrayOfMrpID.join(', ')
            })
            const mobilApiResp = await mobileApp_ProductUpdate_Api({ jsonBody })
            if (mobilApiResp.StatusCode === 200) { showToastAlert(mobilApiResp.Message) }
            //************************************** */

            setState(() => resetFunction(fileds, state))// Clear form values  
            if (pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.MARGIN_lIST })
                }
            }
        }

        else if (postMsg.Status === true) {
            dispatch(saveMarginMasterSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(async () => {
        if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {

            dispatch(deleteIdForMarginMasterSuccess({ Status: false }));
            //***************mobail app api*********************** */
            const jsonBody = JSON.stringify({
                products: marginDeleteId.toString()
            })
            const mobilApiResp = await mobileApp_ProductUpdate_Api({ jsonBody });
            if (mobilApiResp.StatusCode === 200) { showToastAlert(mobilApiResp.Message); }
            //************************************** */

            dispatch(goButtonForMarginSuccess([]))
            GoButton_Handler()
            customAlert({
                Type: 1,
                Message: deleteMessage.Message,
            })

        } else if (deleteMessage.Status === true) {
            dispatch(deleteIdForMarginMasterSuccess({ Status: false }));

            customAlert({
                Type: 3,
                Status: true,
                Message: JSON.stringify(deleteMessage.Message),
            })

        }
    }, [deleteMessage]);

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [Data]);

    const PartyTypeDropdown_Options = Party.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));
    PartyTypeDropdown_Options.unshift({
        value: "",
        label: "select"
    });

    const PriceList_DropdownOptions = PriceList.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const GoButton_Handler = () => {

        if (values.EffectiveDate === '') {
            customAlert({
                Type: 4,
                Message: "Please select EffectiveDate",
            })
            return
        }
        try {
            if (formValid(state, setState)) {

                const jsonBody = JSON.stringify({
                    PriceList: values.PriceListName.value,
                    Party: values.PartyName.value ? values.PartyName.value : 0,
                    EffectiveDate: values.EffectiveDate
                });
                dispatch(goButtonForMargin({ jsonBody }));
            }
        } catch (e) { console.log(e) }
    };

    //select id for delete row
    const deleteHandeler = async (id, name, ItemID) => {
        debugger
        const isConfirmed = await customAlert({
            Type: 7,
            Message: `Are you sure you want to delete this Item : "${name}"`
        });

        if (isConfirmed) {
            setMarginDeleteId(ItemID)
            dispatch(deleteIdForMarginMaster(id))
        }

    };


    const pageOptions = {
        sizePerPage: 10,
        totalSize: Data.length,
        custom: true,
    };

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "Name",
            sort: true,
            headerStyle: () => {
                return { width: '500px', };
            }
        },
        {
            text: "Current Margin",
            dataField: "CurrentMargin",
            sort: true,
            formatter: (cellContent, row, key) => {
                return (<span style={{ justifyContent: 'center' }}>
                    <Input
                        key={`CurrentMargin${row.Item}`}
                        id=""
                        type="text"
                        disabled={true}
                        defaultValue={cellContent}
                        className="col col-sm text-end"
                    />
                </span>)
            },
            headerStyle: () => {
                return { width: '200px', };
            }
        },
        {
            text: "Effective from ",
            dataField: "CurrentDate",
            sort: true,
            headerStyle: () => {
                return { width: '200px' };
            },
            formatter: (cellContent, row, key) => {
                if (!cellContent) {
                    return null
                }
                return (<span style={{ justifyContent: 'center' }}>
                    <Label
                        style={{ color: "black", textAlign: "center", display: "block", }}
                        key={`CurrentDate${row.Item}`}
                    >{_cfunc.date_dmy_func(cellContent)}</Label>
                </span>)
            },
        },
        {
            text: "Margin ",
            dataField: "Margin",
            sort: true,
            formatter: (cellContent, row) => {

                if (((cellContent > 0) && (row["margin"] === undefined) || row.margin)) {
                    row["margin"] = true
                } else {
                    row["margin"] = false
                }
                return (<span style={{ justifyContent: 'center' }}>
                    <CInput
                        key={`Margin${row.Item}`}
                        type="text"
                        cpattern={decimalRegx}
                        defaultValue={cellContent}
                        disabled={row.margin}
                        className="col col-sm text-end"
                        onChange={(e) => row["Margin"] = e.target.value}
                    />
                </span>)
            },
            headerStyle: () => {
                return { width: '200px' };
            }
        },
        {
            text: "Action ",
            dataField: "",
            headerStyle: () => {
                return { width: '100px' };
            },
            formatter: (cellContent, user) => {
                return (
                    <span className="d-flex justify-content-center align-items-center">
                        {!(user.id === '') &&
                            <Button
                                id={"deleteid"}
                                type="button"
                                className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete MRP'
                                onClick={() => { deleteHandeler(user.id, user.Name, user.Item); }}
                            >
                                <i className="mdi mdi-delete font-size-18"></i>
                            </Button>}
                    </span>
                )
            }
        },
    ]

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            // if (formValid(state, setState)) {
            _cfunc.btnIsDissablefunc({ btnId, state: true })

            var ItemData = Data.map((index) => ({
                PriceList: values.PriceListName.value,
                Party: values.PartyName.value,
                EffectiveDate: values.EffectiveDate,
                Company: loginCompanyID(),
                CreatedBy: loginUserID(),
                UpdatedBy: loginUserID(),
                IsDeleted: 0,
                Item: index.Item,
                Margin: index.Margin,
                id: index.id
            }))

            const Find = ItemData.filter((index) => {   // condition for margin save without 0
                return (Number(index.Margin) > 0)
            })
            setSelectedMargin(Find)
            const jsonBody = JSON.stringify(Find)

            if (!(Find.length > 0)) {

                customAlert({
                    Type: 4,
                    Message: "Please Enter Margin"
                })
                return _cfunc.btnIsDissablefunc({ btnId, state: false })
            }
            else {
                dispatch(saveMarginMaster({ jsonBody, btnId }));
            }

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === mode.edit) || (pageMode === mode.copy) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <Container fluid>

                    {/* <form noValidate> */}
                    <Card className="text-black ">
                        <CardHeader className="card-header  text-black c_card_header" >
                            <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                            <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                        </CardHeader>
                        <CardBody className=" vh-10 0 text-black" style={{ marginBottom: "4cm" }}>

                            <Card style={{ backgroundColor: "whitesmoke" }} className=" mb-1">
                                <CardHeader className="c_card_body"  >
                                    <Row className="mt-3">
                                        <Col sm={3}>
                                            <FormGroup className="mb-3 row">
                                                <Label htmlFor="validationCustom01" className="col-sm-4 p-1 ml-n1 ">{fieldLabel.PriceListName}</Label>
                                                <Col sm={8}>
                                                    <Select
                                                        name="PriceListName"
                                                        value={values.PriceListName}
                                                        id={"PriceListName"}
                                                        options={PriceList_DropdownOptions}
                                                        isDisabled={pageMode === mode.edit ? true : false}
                                                        isSearchable={true}
                                                        autoFocus={true}
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                        placeholder="select"
                                                        onChange={(hasSelect, evn) => {
                                                            onChangeSelect({ hasSelect, evn, state, setState, })
                                                            dispatch(Breadcrumb_inputName(hasSelect.label))
                                                        }}
                                                        classNamePrefix="dropdown"
                                                    />
                                                    {isError.PriceListName.length > 0 && (
                                                        <span className="text-danger f-8"><small>{isError.PriceListName}</small></span>
                                                    )}

                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col sm={3}>
                                            <FormGroup className="mb-3 row ">
                                                <Label htmlFor="validationCustom01" className="col-sm-3 p-2" style={{ width: "2.5cm" }}>{fieldLabel.PartyName}</Label>
                                                <Col sm={8} >
                                                    <Select
                                                        name="PartyName"
                                                        value={values.PartyName}
                                                        id={"PartyName"}
                                                        options={PartyTypeDropdown_Options}
                                                        isDisabled={pageMode === mode.edit ? true : false}
                                                        isSearchable={true}
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                        placeholder="select"
                                                        onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                        classNamePrefix="dropdown"
                                                    />
                                                    {isError.PartyName.length > 0 && (
                                                        <span className="text-danger f-8"><small>{isError.PartyName}</small></span>
                                                    )}
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col sm={4}>
                                            <FormGroup className="mb-3 row ">
                                                <Label className="col-md-6 p-2" style={{ width: "2.9cm" }}>{fieldLabel.EffectiveDate}</Label>
                                                <Col sm={6}>
                                                    <C_DatePicker
                                                        id="EffectiveDate"
                                                        name="EffectiveDate"
                                                        placeholder={"DD/MM/YYYY"}
                                                        value={values.EffectiveDate}
                                                        isDisabled={pageMode === mode.edit ? true : false}
                                                        onChange={(y, v, e) => {
                                                            onChangeDate({ e, v, state, setState })
                                                        }}
                                                        options={{
                                                            altInput: true,
                                                            altFormat: "d-m-Y",
                                                            dateFormat: "Y-m-d",
                                                        }}
                                                    />
                                                    {isError.EffectiveDate.length > 0 && (
                                                        <span className="invalid-feedback">{isError.EffectiveDate}</span>
                                                    )}
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col sm={1}>
                                            <Go_Button onClick={(event) => { GoButton_Handler(event) }} loading={listBtnLoading} />
                                        </Col>
                                    </Row>
                                </CardHeader>
                            </Card>

                            {Data.length > 0 ?
                                <ToolkitProvider
                                    keyField="Item"
                                    data={Data}
                                    columns={pagesListColumns}
                                    search
                                >
                                    {(toolkitProps) => (
                                        <React.Fragment>
                                            <Row>
                                                <Col xl="12">
                                                    <div className="table-responsive">
                                                        <BootstrapTable
                                                            keyField={"Item"}
                                                            id="table_Arrow"
                                                            responsive
                                                            bordered={false}
                                                            striped={false}
                                                            classes={"table  table-bordered"}
                                                            noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                                                            {...toolkitProps.baseProps}
                                                        />
                                                        {mySearchProps(toolkitProps.searchProps)}

                                                    </div>
                                                </Col>
                                            </Row>

                                        </React.Fragment>
                                    )}
                                </ToolkitProvider>
                                : null
                            }

                            {Data.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            editCreatedBy={editCreatedBy}
                                        />
                                    </Col>
                                </FormGroup >
                                : null
                            }

                        </CardBody>
                    </Card>
                    {/* </form> */}
                </Container>
            </div>
        </React.Fragment>
    )
}

export default MarginMaster
