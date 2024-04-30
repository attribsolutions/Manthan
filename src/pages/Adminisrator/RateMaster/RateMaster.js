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
    commonPageField,
    commonPageFieldSuccess,
    getBaseUnit_ForDropDown,
    getBaseUnit_ForDropDownSuccess,
} from "../../../store/actions";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
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
import { comAddPageFieldFunc, initialFiledFunc, onChangeDate, resetFunction } from "../../../components/Common/validationFunction";
import { Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { deleteRateId_ForMaster, deleteRateId_ForMaster_Success, goButtonForRate_Master, goButtonForRate_Master_Success, saveRateMaster, saveRateMasterSuccess } from "../../../store/Administrator/RateMasterRedux/action";

const RateMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const fileds = {
        EffectiveDate: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    //SetState  Edit data Geting From Modules List component
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState("");
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store tableData /  'save_ModuleSuccess' action data
    const { postMsg,
        tableData,
        deleteMessage,
        userAccess,
        pageField,
        saveBtnloading,
        listBtnLoading,
        BaseUnit
    } = useSelector((state) => ({
        listBtnLoading: state.RateMasterReducer.listBtnLoading,
        saveBtnloading: state.RateMasterReducer.saveBtnloading,
        tableData: state.RateMasterReducer.RateMasterGoButton,
        deleteMessage: state.RateMasterReducer.deleteMsgForMaster,
        postMsg: state.RateMasterReducer.postMsg,
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    useEffect(() => {
        const page_Id = pageId.GST
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id));
        dispatch(getBaseUnit_ForDropDown());
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(getBaseUnit_ForDropDownSuccess([]));
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
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
        else {
            dispatch(goButtonForRate_Master_Success({ Status: false }))
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveRateMasterSuccess({ Status: false }))
            dispatch(goButtonForRate_Master_Success([]))
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
                    history.push({ pathname: url.RATE_LIST })
                }
            }
        }

        else if (postMsg.Status === true) {
            dispatch(saveRateMasterSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
            dispatch(deleteRateId_ForMaster_Success({ Status: false }));
            dispatch(goButtonForRate_Master_Success([]))
            GoButton_Handler()

            customAlert({
                Type: 1,
                Status: true,
                Message: deleteMessage.Message,
                // AfterResponseAction: getGSTList,
            })

        } else if (deleteMessage.Status === true) {
            dispatch(deleteRateId_ForMaster_Success({ Status: false }));

            customAlert({
                Type: 3,
                Status: true,
                Message: JSON.stringify(deleteMessage.Message),
            })

        }
    }, [deleteMessage]);

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [tableData]);

    const BaseUnit_DropdownOptions = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));

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
                "CompanyID": loginCompanyID()
            });

            dispatch(goButtonForRate_Master({ jsonBody }));
        }
    };

    //select id for delete row
    const deleteHandeler = (id, name) => {

        customAlert({
            Type: 5,
            Status: true,
            Message: `${alertMessages.deleteThisItem} : "${name}"`,
            RedirectPath: false,
            PermissionAction: deleteRateId_ForMaster,
            ID: id,
        })

    };

    const defaultSorted = [
        {
            dataField: "ItemName", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            headerStyle: () => { return { width: '300px' } },
        },
        {
            text: "Current Date",
            dataField: "CurrentDate",
            sort: true,
            headerStyle: () => { return { width: '200px' } },
            formatter: (cellContent, row, key) => {
                if (!row.EffectiveDate) {
                    return null
                }
                return (<span style={{ justifyContent: 'center' }}>
                    <Label
                        style={{ color: "black", textAlign: "center", display: "block", }}
                        key={`CurrentDate${row.ItemID}`}
                    >{_cfunc.date_dmy_func(row.EffectiveDate)}</Label>
                </span>)
            },
        },

        {
            text: "CurrentRate",
            dataField: "CurrentRate",
            headerStyle: () => { return { width: '200px' } },
            formatter: (cellContent, row, key) => {
                return (
                    <span style={{ justifyContent: 'center' }}>
                        <CInput
                            key={`CurrentRate${row.ItemID}`}
                            id=""
                            cpattern={decimalRegx}
                            type="text"
                            defaultValue={Number(cellContent).toFixed(2)}
                            disabled={true}
                            className="col col-sm text-end"
                            onChange={(e) => { row["CurrentRate"] = e.target.value }}
                        />
                    </span>
                )
            },
        },

        {
            text: "Rate ",
            dataField: "Rate",
            headerStyle: () => { return { width: '200px' } },
            formatter: (cellContent, row, key) => {
                return (
                    <span style={{ justifyContent: 'center' }}>
                        <CInput
                            key={`Rate${row.ItemID}`}
                            type="text"
                            cpattern={decimalRegx}
                            className="col col-sm "
                            onChange={(e) => { row["Rate"] = e.target.value }}
                        />
                    </span>
                )
            },
        },

        {

            text: "Unit ",
            dataField: "Unit",
            headerStyle: () => { return { width: '200px' } },
            formatter: (cellContent, row, key) => {
                return (
                    <span style={{ justifyContent: 'center' }}>
                        <C_Select
                            key={`unit${row.ItemID}`}
                            defaultValue={row.defaultUnit.value === null ? [] : row.defaultUnit}
                            isDisabled={true}
                            options={BaseUnit_DropdownOptions}
                            onChange={(e) => { row["defaultUnit"] = e }}
                            styles={{
                                menu: provided => ({ ...provided, zIndex: 2 })
                            }}
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
                        {!(user.CurrentRate === null) &&
                            <Button
                                id={"deleteid"}
                                type="button"
                                className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete Rate'
                                onClick={() => { deleteHandeler(user.id, user.ItemName); }}
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
        const invalidMessages = [];
        try {

            var ItemData = tableData.map((index) => ({
                "id": index.id,
                "Rate": Number(index.Rate),
                "BaseUnitID": index.defaultUnit.value,
                "CommonID": 0,
                "EffectiveDate": values.EffectiveDate,
                "Company": loginCompanyID(),
                "CreatedBy": loginUserID(),
                "UpdatedBy": loginUserID(),
                "IsDeleted": 0,
                "Item": index.ItemID,
                "ItemName": index.ItemName,
            }))

            const filteredData = ItemData.filter((index) => {
                return index.Rate > 0
            })

            if (!(filteredData.length > 0)) {
                dispatch(
                    customAlert({
                        Type: 4,
                        Status: true,
                        Message: alertMessages.RateIsRequired
                    })
                );
                return
            }

            // const filteredDataWithUnit = filteredData.filter(({ UnitID, ItemName }) => {
            //     if (UnitID === null) {
            //         invalidMessages.push({ [ItemName]: alertMessages.unitIsRequired });
            //         return false;
            //     }
            //     return true;
            // });

            // if (invalidMessages.length > 0) {
            //     customAlert({
            //         Type: 4,
            //         Message: invalidMessages,
            //     });
            //     return;
            // }
            const jsonBody = JSON.stringify(filteredData.map(({ ItemName, ...rest }) => rest));
            dispatch(saveRateMaster(jsonBody));

        } catch (e) { }
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
                                                                minDate: "today",
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

                                {tableData.length > 0 ?

                                    <ToolkitProvider
                                        keyField={"ItemID"}
                                        data={tableData}
                                        columns={pagesListColumns}
                                        search
                                    >
                                        {(toolkitProps,) => (
                                            <React.Fragment>

                                                <BootstrapTable
                                                    keyField={"ItemID"}
                                                    id="table_Arrow"
                                                    defaultSorted={defaultSorted}
                                                    classes='custom-table'
                                                    noDataIndication={
                                                        <div className="text-danger text-center table-cursor-pointer">
                                                            Items Not available
                                                        </div>
                                                    }
                                                    onDataSizeChange={(e) => {
                                                        _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                    }}
                                                    {...toolkitProps.baseProps}
                                                />
                                                {globalTableSearchProps(toolkitProps.searchProps)}


                                            </React.Fragment>
                                        )}
                                    </ToolkitProvider>
                                    : null}

                                {tableData.length > 0 &&
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

export default RateMaster
