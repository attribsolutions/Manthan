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
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { get_Division_ForDropDown, get_Division_ForDropDown_Success, get_Party_ForDropDown, get_Party_ForDropDown_Success } from "../../../store/Administrator/ItemsRedux/action";
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
import { comAddPageFieldFunc, formValid, initialFiledFunc, onChangeDate, onChangeSelect, resetFunction } from "../../../components/Common/validationFunction";
import { Change_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import { deleteMRPMaster_Id, deleteMRPMaster_Id_Success, GoButtonForMRP_Master, GoButtonForMRP_MasterSuccess, saveMRPMaster, saveMRPMasterSuccess } from "../../../store/Administrator/MRPMasterRedux/action";
import { mobileApp_ProductUpdate_Api } from "../../../helpers/backend_helper";
import { showToastAlert } from "../../../helpers/axios_Config";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import GlobalCustomTable from "../../../GlobalCustomTable";
import { getPartyTypelist, getPartyTypelistSuccess } from "../../../store/Administrator/PartyTypeRedux/action";

const MRPMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    let IsSCM = _cfunc.loginIsSCMCompany()

    const fileds = {
        PartyTypeName: "",
        // DivisionName: "",
        PartyName: "",
        EffectiveDate: "",
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    //SetState  Edit data Geting From Modules List component
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState("");
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [selectedMrp, setSelectedMrp] = useState([]);
    const [MRPDeleteId, setMRPDeleteId] = useState("");
    const [mobileApiLoading, setMobileApiLoading] = useState(false);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        tableData,
        deleteMessage,
        Party,
        Division,
        userAccess,
        pageField,
        saveBtnloading,
        listBtnLoading,
        partyApiLoading,
        divisionApiLoading,
        PartyTypeList,
        PartyTypeListLoading
    } = useSelector((state) => ({
        PartyTypeList: state.PartyTypeReducer.ListData,
        PartyTypeListLoading: state.PartyTypeReducer.goBtnLoading,

        listBtnLoading: state.MRPMasterReducer.listBtnLoading,
        saveBtnloading: state.MRPMasterReducer.saveBtnloading,
        tableData: state.MRPMasterReducer.MRPGoButton,
        deleteMessage: state.MRPMasterReducer.deleteIdForMRPMaster,
        postMsg: state.MRPMasterReducer.postMsg,
        Party: state.ItemMastersReducer.Party,
        partyApiLoading: state.ItemMastersReducer.partyApiLoading,
        Division: state.ItemMastersReducer.Division,
        divisionApiLoading: state.ItemMastersReducer.divisionApiLoading,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField

    }));

    const { Data = [] } = tableData

    useEffect(() => {
        const page_Id = pageId.MRP
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
        dispatch(get_Party_ForDropDown());
        dispatch(get_Division_ForDropDown());
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        dispatch(getPartyTypelist());
        return () => {
            dispatch(get_Party_ForDropDown_Success([]))
            dispatch(get_Division_ForDropDown_Success([]))
            dispatch(getPartyTypelistSuccess([]));
        }
    }, []);

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

                const { id, Division_id, DivisionName, Party_id, PartyName, EffectiveDate } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.DivisionName = { label: DivisionName, value: Division_id };
                values.PartyName = Party_id === null ? { label: "select", value: "" } : { label: PartyName, value: Party_id };
                values.EffectiveDate = EffectiveDate
                values.id = id

                hasValid.DivisionName.valid = true;
                hasValid.PartyName.valid = true;
                hasValid.EffectiveDate.valid = true;
                setState({ values, fieldLabel, hasValid, required, isError })
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }

    }, [])

    useEffect(async () => {
        if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
            dispatch(deleteMRPMaster_Id_Success({ Status: false }));
            //***************mobail app api*********************** */
            const jsonBody = JSON.stringify({
                products: MRPDeleteId.toString()
            })
            const mobilApiResp = await mobileApp_ProductUpdate_Api({ jsonBody });
            if (mobilApiResp.StatusCode === 200) { showToastAlert(mobilApiResp.Message); }
            //************************************** */
            dispatch(GoButtonForMRP_MasterSuccess([]))
            GoButton_Handler()
            customAlert({
                Type: 1,
                Message: deleteMessage.Message,
            })
        } else if (deleteMessage.Status === true) {
            dispatch(deleteMRPMaster_Id_Success({ Status: false }));
            customAlert({
                Type: 3,
                Status: true,
                Message: JSON.stringify(deleteMessage.Message),
            })
        }
    }, [deleteMessage]);

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [Data]);

    const PartyDropdown_Options = Party.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const PartyTypeDropdown_Options = PartyTypeList.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));
    // PartyDropdown_Options.unshift({
    //     value: "",
    //     label: "select"
    // });

    const Division_DropdownOptions = Division.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const GoButton_Handler = (event) => {

        if (values.EffectiveDate === "") {
            customAlert({
                Type: 4,
                Message: alertMessages.effectiveDateIsRequired,
            })
            return;
        }
        try {

            // if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                "Division": 0,
                "PartyTypeID": values.PartyTypeName.value ? values.PartyTypeName.value : 0,
                "Party": values.PartyName.value ? values.PartyName.value : 0,
                "EffectiveDate": values.EffectiveDate,
                "CompanyID": _cfunc.loginCompanyID()
            });
            dispatch(GoButtonForMRP_Master({ jsonBody }));
            // }
        } catch (e) { _cfunc.CommonConsole(e) }
    };

    //select id for delete row
    const deleteHandeler = async (id, name, ItemID) => {

        const isConfirmed = await customAlert({
            Type: 7,
            Message: `${alertMessages.deleteThisItem} : "${name}"`
        });

        if (isConfirmed) {
            setMRPDeleteId(ItemID)
            dispatch(deleteMRPMaster_Id(id))
        }
    };

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            setMobileApiLoading(true)
            dispatch(saveMRPMasterSuccess({ Status: false }))
            //***************mobail app api*********************** */
            let arrayOfMrpID = selectedMrp.map(function (i) {
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
                    history.push({ pathname: url.MRP_lIST })
                }
            }
        }

        else if (postMsg.Status === true) {
            dispatch(saveMRPMasterSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
        setMobileApiLoading(false);
        dispatch(GoButtonForMRP_MasterSuccess([]));
    }, [postMsg])


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
            text: "Current MRP",
            dataField: "CurrentMRP",
            sort: true,
            formatter: (cellContent, row, key) => {
                return (<span style={{ justifyContent: 'center' }}>
                    <Input
                        key={`CurrentMRP${row.Item}`}
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
            text: "MRP ",
            dataField: "MRP",
            sort: true,
            formatter: (cellContent, row) => {

                if (((cellContent > 0) && (row["mrp"] === undefined) || row.mrp)) {
                    row["mrp"] = true
                } else {
                    row["mrp"] = false
                }
                return (<span style={{ justifyContent: 'center' }}>
                    <CInput
                        key={`MRP${row.Item}`}
                        type="text"
                        cpattern={decimalRegx}
                        defaultValue={cellContent}
                        disabled={row.mrp}
                        className="col col-sm text-end"
                        onChange={(e) => row["MRP"] = e.target.value}
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
                "Division": null,
                // Party: values.PartyName.value,
                "PartyType": values.PartyTypeName.value ? values.PartyTypeName.value : null,
                "Party": values.PartyName.value ? values.PartyName.value : null,
                "EffectiveDate": values.EffectiveDate,
                "Company": loginCompanyID(),
                "CreatedBy": loginUserID(),
                "UpdatedBy": loginUserID(),
                "IsDeleted": 0,
                "Item": index.Item,
                "MRP": index.MRP,
                "id": index.id,

            }))

            const Find = ItemData.filter((index) => {
                return (Number(index.MRP) > 0)
            })
            setSelectedMrp(Find)
            const jsonBody = JSON.stringify(Find)
            if (!(Find.length > 0)) {
                customAlert({
                    Type: 4,
                    Message: alertMessages.MRPIsRequired
                })
                return _cfunc.btnIsDissablefunc({ btnId, state: false })
            }
            else {
                dispatch(saveMRPMaster({ jsonBody, btnId }));
            }

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    function changeButtonHandler() {
        dispatch(GoButtonForMRP_MasterSuccess([]));
        setState((i) => {
            let a = { ...i }
            a.values.PartyTypeName = ''
            a.values.PartyName = ''
            return a
        })
    }

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

                                            <Col sm={3}>
                                                {/* <FormGroup className="mb-3 row">
                                                        <Label className="col-sm-4 p-2 ml-n2 ">{fieldLabel.DivisionName}</Label>
                                                        <Col sm={8}>
                                                            <C_Select
                                                                name="DivisionName"
                                                                value={values.DivisionName}
                                                                options={Division_DropdownOptions}
                                                                isDisabled={pageMode === mode.edit ? true : false}
                                                                isSearchable={true}
                                                                classNamePrefix="dropdown"
                                                                isLoading={divisionApiLoading}
                                                                styles={{
                                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                                }}
                                                                onChange={(hasSelect, evn) => {
                                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                                }}
                                                            />
                                                        </Col>
                                                        {(isError.DivisionName.length > 0 && values.DivisionName === "" && IsSCM === 0) && (
                                                            <span className="invalid-feedback">{isError.DivisionName}</span>
                                                        )}
                                                    </FormGroup> */}
                                                <FormGroup className="mb-3 row">
                                                    <Label className="col-sm-4 p-2 ml-n2 ">{fieldLabel.PartyTypeName}</Label>
                                                    <Col sm={8}>
                                                        <C_Select
                                                            name="PartyTypeName"
                                                            value={values.PartyTypeName}
                                                            options={PartyTypeDropdown_Options}
                                                            isDisabled={!(values.PartyName === "")}
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

                                            {(IsSCM === 0) &&
                                                <Col sm={3}>
                                                    <FormGroup className="mb-3 row ">
                                                        <Label className="col-sm-3 p-2" style={{ width: "2.5cm" }}>{fieldLabel.PartyName}</Label>
                                                        <Col sm={8} >
                                                            <C_Select
                                                                name="PartyName"
                                                                value={values.PartyName}
                                                                options={PartyDropdown_Options}
                                                                isLoading={partyApiLoading}
                                                                isDisabled={!(values.PartyTypeName === "")}
                                                                isSearchable={true}
                                                                classNamePrefix="dropdown"
                                                                styles={{
                                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                                }}
                                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                            />
                                                        </Col>
                                                        {(isError.PartyName.length > 0 && values.PartyName === "" && IsSCM === 0) && (
                                                            <span className="invalid-feedback">{isError.PartyName}</span>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            }

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
                                                    </Col>
                                                    {isError.EffectiveDate.length > 0 && (
                                                        <span className="invalid-feedback">{isError.EffectiveDate}</span>
                                                    )}
                                                </FormGroup>
                                            </Col>

                                            <Col sm={1} className="mb-3 mt-1">
                                                {(values.PartyName.value > 0 || values.PartyTypeName.value > 0) &&
                                                    <Change_Button
                                                        type="button"
                                                        onClick={changeButtonHandler}
                                                    />
                                                }
                                            </Col>

                                            <Col sm={1}>
                                                <Go_Button
                                                    onClick={(event) => GoButton_Handler(event)}
                                                    loading={listBtnLoading}
                                                />

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
                                    onDataSizeChange={({ dataCount, filteredData = [] }) => {
                                        dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                                    }}
                                />

                                {Data.length > 0 &&
                                    <SaveButtonDraggable>
                                        <SaveButton pageMode={pageMode}
                                            onClick={SaveHandler}
                                            loading={(saveBtnloading) || (mobileApiLoading)}
                                            forceDisabled={mobileApiLoading}
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

export default MRPMaster
