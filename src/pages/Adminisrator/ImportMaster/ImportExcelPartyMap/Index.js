import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { mySearchProps } from "../../../../components/Common/SearchBox/MySearch";
import * as pageId from "../../../../routes/allPageID";
import * as mode from "../../../../routes/PageMode";
import { Change_Button, Go_Button, SaveButton } from "../../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginIsSCMCompany,
    loginPartyID,
    loginUserID,
    metaTagLabel
} from "../../../../components/Common/CommonFunction";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeSelect,
} from "../../../../components/Common/validationFunction";
import { getPartyListAPI } from "../../../../store/Administrator/PartyRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import {
    GoButton_ImportExcelPartyMap,
    GoButton_ImportExcelPartyMap_Success,
    save_ImportExcelPartyMap,
    save_ImportExcelPartyMap_Sucess
} from "../../../../store/Administrator/ImportExcelPartyMapRedux/action";
import * as _cfunc from "../../../../components/Common/CommonFunction";

const ImportExcelPartyMap = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [mapTypeSelect, SetMapTypeSelect] = useState("")
    const [partySelect, SetPartySelect] = useState("")

    const fileds = {
        Party: "",
        MapType: "",
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        goButtonArr,
        partyList
    } = useSelector((state) => ({
        postMsg: state.ImportExcelPartyMap_Reducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        goButtonArr: state.ImportExcelPartyMap_Reducer.addGoButton,
        partyList: state.PartyMasterReducer.partyList,
    }));
    useEffect(() => {
        const page_Id = pageId.IMPORT_MASTER_MAP
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyListAPI());
        dispatch(GoButton_ImportExcelPartyMap_Success([]));

    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;
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


    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`${"Import Count"} :${goButtonArr.length}`))
    }, [goButtonArr])


    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(save_ImportExcelPartyMap_Sucess({ Status: false }))
            customAlert({
                Type: 1,
                Message: postMsg.Message,
            })
        }
        else if (postMsg.Status === true) {
            dispatch(save_ImportExcelPartyMap_Sucess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMessage.Message),
            })
        }
    }, [postMsg])

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [goButtonArr]);

    const partyDropdown_Options = partyList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const mapTypeDropdown_Options = [{
        value: 1,
        label: "Party",
    },
    {
        value: 2,
        label: "Item",
    },
    {
        value: 3,
        label: "Unit",
    }]


    const pagesListColumns = [
        {
            text: "Field Name",
            dataField: "fieldName",
        },
        {
            text: "Related Key Field",
            dataField: "mapValue",
            formatter: (cellContent, row) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    type="text"
                                    key={`mapValue-${row.id}`}
                                    defaultValue={cellContent}
                                    onChange={(e) => row.mapValue = e.target.value}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
    ];

    async function goButtonHandler(event) {
        event.preventDefault();
        const btnId = event.target.id
        try {
            btnIsDissablefunc({ btnId, state: true })
            let partyId = (((loginIsSCMCompany()) === 1)) ? loginPartyID() : values.Party.value;
            let mapType = values.MapType.value;

            dispatch(GoButton_ImportExcelPartyMap({ partyId, mapType }))
        } catch (error) { }
    };

    function change_ButtonHandler(e) {
        dispatch(GoButton_ImportExcelPartyMap_Success([]))
    }

    async function SaveHandler(event) {
        event.preventDefault();


        async function funcForParty() {
            let jsonArr = []
            await goButtonArr.forEach(i => {
                if ((!(i.mapValue === '') && !(i.mapValue === null))) {
                    jsonArr.push({
                        "Party": i.party,
                        "Customer": i.fieldId,
                        "MapCustomer": i.mapValue,
                        "CreatedBy": loginUserID(),
                        "UpdatedBy": loginUserID()
                    })
                }
            })


            return jsonArr
        }

        async function funcForItem() {
            let jsonArr = []
            await goButtonArr.forEach(i => {
                if ((!(i.mapValue === '') && !(i.mapValue === null))) {
                    jsonArr.push({
                        "Party": i.party,
                        "Item": i.fieldId,
                        "MapItem": i.mapValue,
                        "CreatedBy": loginUserID(),
                        "UpdatedBy": loginUserID()
                    })
                }
            })
            return jsonArr

        }


        async function funcForUnit() {
            let jsonArr = []
            await goButtonArr.forEach(i => {
                if ((!(i.mapValue === '') && !(i.mapValue === null))) {
                    jsonArr.push({
                        "Party": i.party,
                        "Unit": i.fieldId,
                        "MapUnit": i.mapValue,
                        "CreatedBy": loginUserID(),
                        "UpdatedBy": loginUserID()
                    })
                }
            })
            return jsonArr
        }
        let mapType = values.MapType.value;

        const jsonBody = JSON.stringify(
            (mapType === 1) ? await funcForParty() :
                (mapType === 2) ? await funcForItem() : await funcForUnit());

        dispatch(save_ImportExcelPartyMap({ jsonBody, mapType, }));

    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content">
                    <div className="px-2 c_card_header text-black" >
                        <div className="px-2   c_card_filter text-black" >
                            <form onSubmit={(event) => goButtonHandler(event)} noValidate>
                                <div className="row">
                                    <Col sm="5" style={{ display: (loginIsSCMCompany() === 1) ? "none" : "block" }}>
                                        <FormGroup className="mb-2 row mt-3 " >
                                            <Label className=" p-2"
                                                style={{ maxWidth: "115px" }}>{fieldLabel.Party}</Label>
                                            <Col style={{ maxWidth: "300px" }} >
                                                <Select
                                                    name="Party"
                                                    value={values.Party}
                                                    isSearchable={true}
                                                    isDisabled={!(goButtonArr.length === 0) && true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                    options={partyDropdown_Options}
                                                    onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                />
                                                {isError.Party.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.Party}</small></span>
                                                )}

                                            </Col>
                                        </FormGroup>
                                    </Col >
                                    <Col sm="5">
                                        <FormGroup className="mb-2 row mt-3 " >
                                            <Label className=" p-2"
                                                style={{ maxWidth: "115px" }}>{fieldLabel.MapType}</Label>
                                            <Col style={{ maxWidth: "300px" }} >
                                                <Select
                                                    name="MapType"
                                                    value={values.MapType}
                                                    isSearchable={true}
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                    isDisabled={!(goButtonArr.length === 0) && true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={mapTypeDropdown_Options}
                                                    onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                />
                                                {isError.MapType.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.MapType}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="2" className="mt-3 ">
                                        {(goButtonArr.length === 0) ?
                                            < Go_Button onClick={goButtonHandler} type="submit" />
                                            :
                                            <Change_Button onClick={change_ButtonHandler} />
                                        }
                                    </Col>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mt-1">
                        <ToolkitProvider
                            keyField="id"
                            data={goButtonArr}
                            columns={pagesListColumns}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <div className="table">
                                        <BootstrapTable
                                            bordered={true}
                                            id="table_Arrow"
                                            striped={false}
                                            noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                                            classes={"table align-middle  table-hover"}
                                            headerWrapperClasses={"thead-light"}
                                            {...toolkitProps.baseProps}
                                        />
                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>
                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>


                    </div>
                </div>
                <form onSubmit={(event) => SaveHandler(event)} noValidate>
                    <FormGroup>
                        <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                            {(goButtonArr.length > 0) &&
                                <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                // module={"Import Master Map"} 
                                />
                            }
                        </Col>
                    </FormGroup>
                </form>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default ImportExcelPartyMap
