import React, { useEffect, useState } from "react";
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
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    Breadcrumb_inputName,
    BreadcrumbShowCountlabel,
    commonPageField,
    commonPageFieldSuccess,
    deleteGSTId_ForMaster,
    deleteGSTId_ForMaster_Success,
    getGSTList,
    goButtonForGST_Master,
    goButtonForGST_Master_Success,
    saveGSTMaster,
    saveGSTMasterSuccess,
} from "../../../store/actions";
import {
    breadcrumbReturnFunc,
    loginUserID,
    loginCompanyID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { CInput, C_DatePicker, C_Select, decimalRegx } from "../../../CustomValidateForm";
import { mode, pageId, url } from "../../../routes";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { comAddPageFieldFunc, initialFiledFunc, onChangeDate, onChangeSelect, resetFunction } from "../../../components/Common/validationFunction";
import { Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import GlobalCustomTable from "../../../GlobalCustomTable";
import { getPartyTypelist, getPartyTypelistSuccess } from "../../../store/Administrator/PartyTypeRedux/action";

const GSTMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const fileds = {
        PartyTypeName: "",
        EffectiveDate: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    //SetState  Edit data Geting From Modules List component
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState("");
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        tableData,
        deleteMessage,
        userAccess,
        pageField,
        saveBtnloading,
        listBtnLoading,
        PartyTypeList,
        PartyTypeListLoading
    } = useSelector((state) => ({
        listBtnLoading: state.GSTReducer.listBtnLoading,
        saveBtnloading: state.GSTReducer.saveBtnloading,

        PartyTypeList: state.PartyTypeReducer.ListData,
        PartyTypeListLoading: state.PartyTypeReducer.goBtnLoading,

        tableData: state.GSTReducer.GSTGoButton,
        deleteMessage: state.GSTReducer.deleteMsgForMaster,
        postMsg: state.GSTReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    const { Data = [] } = tableData

    useEffect(() => {
        const page_Id = pageId.GST
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        dispatch(getPartyTypelist());
        return () => {
            dispatch(getPartyTypelistSuccess([]));
        }
    }, []);


    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

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

                const { id, EffectiveDate } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.EffectiveDate = EffectiveDate
                values.id = id

                hasValid.EffectiveDate.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.PriceListName))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
        else {
            dispatch(goButtonForGST_Master_Success({ Status: false }))
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveGSTMasterSuccess({ Status: false }))
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
                    history.push({ pathname: url.GST_LIST })
                }
            }
        }

        else if (postMsg.Status === true) {
            dispatch(saveGSTMasterSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
            dispatch(deleteGSTId_ForMaster_Success({ Status: false }));
            dispatch(goButtonForGST_Master_Success([]))
            GoButton_Handler()

            customAlert({
                Type: 1,
                Status: true,
                Message: deleteMessage.Message,
                // AfterResponseAction: getGSTList,
            })

        } else if (deleteMessage.Status === true) {
            dispatch(deleteGSTId_ForMaster_Success({ Status: false }));

            customAlert({
                Type: 3,
                Status: true,
                Message: JSON.stringify(deleteMessage.Message),
            })

        }
    }, [deleteMessage]);

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [Data]);

    const GoButton_Handler = (event) => {

        if (values.EffectiveDate === '') {
            customAlert({
                Type: 4,
                Message: alertMessages.effectiveDateIsRequired,
            })
            return
        }
        else {
            const jsonBody = JSON.stringify({
                "EffectiveDate": values.EffectiveDate,
                "PartyTypeID": values.PartyTypeName.value ? values.PartyTypeName.value : 0,
                "Company": loginCompanyID()
            });

            dispatch(goButtonForGST_Master({ jsonBody }));
        }
    };

    //select id for delete row
    const deleteHandeler = (id, name) => {
        customAlert({
            Type: 5,
            Status: true,
            Message: `${alertMessages.deleteThisItem} : "${name}"`,
            RedirectPath: false,
            PermissionAction: deleteGSTId_ForMaster,
            ID: id,
        })
    };

    const PartyTypeDropdown_Options = PartyTypeList.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "Name",
            sort: true,
            headerStyle: () => { return { width: '300px' } },
        },
        {
            text: "Current GSTPercentage",
            dataField: "CurrentGSTPercentage",
            sort: true,
            headerStyle: () => { return { width: '200px' } },
            formatter: (cellContent, row) => {
                return (<span style={{ justifyContent: 'center' }}>
                    < Input
                        key={`CurrentGSTPercentage${row.Item}`}
                        id=""
                        type="text"
                        disabled={true}
                        defaultValue={cellContent}
                        className="col col-sm text-end"
                        onChange={(e) => { row["CurrentGSTPercentage"] = e.target.value }}
                    />
                </span>)
            },
        },

        {
            text: "GSTPercentage",
            dataField: "GSTPercentage",
            sort: true,
            headerStyle: () => { return { width: '200px' } },
            formatter: (cellContent, row, key) => {
                if (((cellContent > 0) && (row["GSTPerDis"] === undefined) || row.GSTPerDis)) {
                    row["GSTPerDis"] = true
                } else {
                    row["GSTPerDis"] = false
                }
                return (
                    <span style={{ justifyContent: 'center' }}>
                        <CInput
                            key={`GSTPercentage${row.Item}`}
                            id=""
                            cpattern={decimalRegx}
                            type="text"
                            defaultValue={cellContent}
                            disabled={row.GSTPerDis}
                            className="col col-sm text-end"
                            onChange={(e) => { row["GSTPercentage"] = e.target.value }}
                        />
                    </span>
                )
            },
        },

        {
            text: "Current HSNCode",
            dataField: "CurrentHSNCode",
            sort: true,
            headerStyle: () => { return { width: '200px' } },
            formatter: (cellContent, row) => {
                return (<span style={{ justifyContent: 'center' }}>
                    < Input
                        key={`CurrentHSNCode${row.Item}`}
                        id=""
                        type="text"
                        disabled={true}
                        defaultValue={cellContent}
                        className="col col-sm "
                        onChange={(e) => { row["CurrentHSNCode"] = e.target.value }}
                    />
                </span>)
            },
        },

        {

            text: "HSNCode ",
            dataField: "HSNCode",
            sort: true,
            headerStyle: () => { return { width: '200px' } },
            formatter: (cellContent, row, key) => {
                if (((cellContent > 0) && (row["hsncodeDis"] === undefined) || row.hsncodeDis)) {
                    row["hsncodeDis"] = true
                } else {
                    row["hsncodeDis"] = false
                }
                return (
                    <span style={{ justifyContent: 'center' }}>
                        <CInput
                            key={`HSNCode${row.Item}`}
                            type="text"
                            cpattern={decimalRegx}
                            defaultValue={cellContent}
                            disabled={row.hsncodeDis}
                            className="col col-sm "
                            onChange={(e) => { row["HSNCode"] = e.target.value }}
                        />

                    </span>

                )
            },
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
                                onClick={() => { deleteHandeler(user.id, user.Name); }}
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
            
            _cfunc.btnIsDissablefunc({ btnId, state: true })

            var ItemData = Data.map((index) => ({
                "EffectiveDate": values.EffectiveDate,
                "PartyType": values.PartyTypeName.value ? values.PartyTypeName.value : null,
                "Company": loginCompanyID(),
                "CreatedBy": loginUserID(),
                "IsDeleted": 0,
                "UpdatedBy": loginUserID(),
                "Item": index.Item,
                "GSTPercentage": index.GSTPercentage,
                "HSNCode": index.HSNCode,
                "id": index.id
            }))

            const filterData = ItemData.filter((index) => {
                return (!(index.GSTPercentage === '') && !(index.HSNCode === '') && (index.id === ''))
            })

            const jsonBody = JSON.stringify(filterData)

            if (!(filterData.length > 0)) {

                customAlert({
                    Type: 4,
                    Status: true,
                    Message: alertMessages.enterGSTPercentage_HSNCodeIsRequired
                })

                return _cfunc.btnIsDissablefunc({ btnId, state: false })
            }
            else {
                dispatch(saveGSTMaster(jsonBody));
            }

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === mode.edit) || (pageMode === mode.copy) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    return (
        <React.Fragment>
            <div className="page-content" >
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <Container fluid>

                    <form noValidate>
                        <Card className="text-black ">
                            <CardHeader className="card-header  text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>
                            <CardBody className=" vh-10 0 text-black" style={{ marginBottom: "4cm" }}>

                                <Card style={{ backgroundColor: "whitesmoke" }} className=" mb-1">
                                    <CardHeader className="c_card_body"  >
                                        <Row className="mt-3">
                                            <Col sm={4}>
                                                <FormGroup className="mb-3 row">
                                                    <Label className="col-md-6 p-2" style={{ width: "2.9cm" }}>{fieldLabel.PartyTypeName}</Label>
                                                    <Col sm={8}>
                                                        <C_Select
                                                            name="PartyTypeName"
                                                            value={values.PartyTypeName}
                                                            options={PartyTypeDropdown_Options}
                                                            isSearchable={true}
                                                            classNamePrefix="dropdown"
                                                            isLoading={PartyTypeListLoading}
                                                            styles={{
                                                                menu: provided => ({ ...provided, zIndex: 2 })
                                                            }}
                                                            onChange={(hasSelect, evn) => {

                                                                onChangeSelect({ hasSelect, evn, state, setState, })
                                                            }}
                                                        />
                                                    </Col>
                                                    {isError.PartyTypeName.length > 0 && (
                                                        <span className="invalid-feedback">{isError.PartyTypeName}</span>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col sm={4}>
                                                <FormGroup className="mb-3 row ">
                                                    <Label className="col-md-6 p-2" style={{ width: "2.9cm" }}>{fieldLabel.EffectiveDate}</Label>
                                                    <Col sm={8}>
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

                                <GlobalCustomTable
                                    keyField={"Item"}
                                    data={Data}
                                    columns={pagesListColumns}
                                    id="table_Arrow"
                                    noDataIndication={
                                        <div className="text-danger text-center ">
                                            Items Not available
                                        </div>
                                    }
                                    onDataSizeChange={({ dataCount }) => {
                                        dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                                    }}
                                />
                                {Data.length > 0 &&
                                    <SaveButtonDraggable>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            editCreatedBy={editCreatedBy}
                                        />
                                    </SaveButtonDraggable>
                                }

                            </CardBody>
                        </Card>
                    </form>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default GSTMaster
