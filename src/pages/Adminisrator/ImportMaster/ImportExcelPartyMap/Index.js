import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, goButtonPartyItemAddPage, goButtonPartyItemAddPageSuccess, } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { globalTableSearchProps } from "../../../../components/Common/SearchBox/MySearch";
import * as pageId from "../../../../routes/allPageID";
import * as mode from "../../../../routes/PageMode";
import { Change_Button, Go_Button, PageLoadingSpinner, SaveButton } from "../../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    loginIsSCMCompany,
    loginUserID,
    metaTagLabel
} from "../../../../components/Common/CommonFunction";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeSelect,
} from "../../../../components/Common/validationFunction";
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
import SaveButtonDraggable from "../../../../components/Common/saveButtonDraggable";
import { alertMessages } from "../../../../components/Common/CommonErrorMsg/alertMsg";

const ImportExcelPartyMap = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = { Party: "", MapType: "", }
    const [state, setState] = useState(initialFiledFunc(fileds))
    const [UpdateTableList, setUpdateTableList] = useState([])
    const [isCopy, setisCopy] = useState(false)





    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        userAccess,
        goButtonArr,
        partyList,
        listBtnLoading,
        saveBtnloading,
        partyDropDownLoading,
        ItemList,
    } = useSelector((state) => ({
        saveBtnloading: state.GroupReducer.saveBtnloading,
        listBtnLoading: (state.ImportExcelPartyMap_Reducer.listBtnLoading || state.PartyItemsReducer.partyItemListLoading),
        postMsg: state.ImportExcelPartyMap_Reducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,

        pageField: state.CommonPageFieldReducer.pageField,
        goButtonArr: state.ImportExcelPartyMap_Reducer.addGoButton,
        partyList: state.PartyMasterReducer.partyList,
        ItemList: state.PartyItemsReducer.partyItem,
        partyDropDownLoading: state.PartyMasterReducer.goBtnLoading,
    }));
    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            if (values.MapType.value > 0) {
                goButtonActionCall();
            }
        } else {
            partyOnChangeHandler();
        }
    }, [commonPartyDropSelect]);

    useEffect(() => {
        const page_Id = pageId.IMPORT_MASTER_MAP
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))

        dispatch(GoButton_ImportExcelPartyMap_Success([]));
        return () => {
            dispatch(GoButton_ImportExcelPartyMap_Success([]));
            dispatch(commonPageFieldSuccess(null));
        }
    }, []);

    const location = { ...history.location }
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

        if (values.MapType.value === 2) {
            const newItemList = ItemList.map(i => ({
                "party": commonPartyDropSelect.value,
                "fieldName": i.ItemName,
                "fieldId": i.Item,
                "mapValue": i.MapItem,
            }))

            if (isCopy) {
                const updatedGoButtonArr = newItemList.map(i => {
                    if (i.mapValue === null) {
                        return {
                            ...i,
                            mapValue: i.fieldName
                        };
                    }
                    return i;
                });
                setUpdateTableList(updatedGoButtonArr);
            } else {
                setUpdateTableList(newItemList);
            }
        } else {

            if (isCopy) {
                const updatedGoButtonArr = goButtonArr.map(i => {
                    if (i.mapValue === null) {
                        return {
                            ...i,
                            mapValue: i.fieldName
                        };
                    }
                    return i;
                });
                setUpdateTableList(updatedGoButtonArr);
            } else {
                setUpdateTableList(goButtonArr);
            }
        }
    }, [goButtonArr, isCopy, ItemList])

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`${"Count"} :${UpdateTableList.length}`))
    }, [UpdateTableList])


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
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [UpdateTableList]);

    const partyDropdown_Options = partyList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const mapTypeDropdown_Options = [{  // this map type also check in invoice excel upload   for mapping validation!!s
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
            text: `${values.MapType.label === undefined ? "Party" : values.MapType.label}`,
            dataField: "fieldName",


            headerFormatter: () => {
                return (
                    <Row>
                        <Col sm={9}>
                            <span
                            > {values.MapType.label === undefined ? "Party" : values.MapType.label} </span>
                        </Col>
                        {(UpdateTableList.length > 0) && <Col>
                            <div className="btn-group " role="group" aria-label="Basic checkbox toggle button group">
                                <input
                                    type="checkbox"
                                    id={"btncheck"}
                                    className="btn-check"
                                    title="Copy"
                                    onChange={(e) => {
                                        setisCopy(e.target.checked)
                                    }}
                                />
                                <label className="btn btn-outline-primary" title="Copy" htmlFor={"btncheck"}><span
                                    className="bx bxs-copy font-size-9"
                                ></span></label>
                            </div>
                        </Col>}
                    </Row>
                );
            }
        },
        {
            text: "Route",
            dataField: "RouteName",
            sort: true,
            hidden: values.MapType.value !== 1
        },
        {
            text: "Customer Address",
            dataField: "CustomerAddress",
            sort: true,
            hidden: values.MapType.value !== 1
        },
        {
            text: "GSTIN No",
            dataField: "GSTIN",
            sort: true,
            hidden: values.MapType.value !== 1
        },
        {
            text: "Related Key Field",
            dataField: "mapValue",
            formatter: (cellContent, row) => {

                return <>
                    <div style={{ justifyContent: 'center' }} >
                        <Input
                            type="text"
                            key={`mapValue-${row.fieldId}`}
                            defaultValue={cellContent}
                            onChange={(e) => row.mapValue = e.target.value}
                        />

                    </div>
                </>
            },
        },
    ];

    async function goButtonHandler(event) {

        if (commonPartyDropSelect.value === 0) {
            customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
            return;
        }
        else if (values.MapType === '') {
            customAlert({ Type: 3, Message: alertMessages.selectMappingType })
            return;
        }
        else {
            goButtonActionCall();
        }
    };

    function goButtonActionCall() {
        const mapType = values.MapType?.value;
        if (mapType === 2) {
            const jsonBody = {
                ..._cfunc.loginJsonBody(),
                PartyID: commonPartyDropSelect.value,
            };
            dispatch(goButtonPartyItemAddPage({ jsonBody }));
        } else {
            dispatch(GoButton_ImportExcelPartyMap({ partyId: commonPartyDropSelect.value, mapType }))
        }
    }

    function partyOnChangeHandler(e) {
        dispatch(GoButton_ImportExcelPartyMap_Success([]));
        dispatch(goButtonPartyItemAddPageSuccess([]));

        setState((i) => {
            let a = { ...i }
            a.values.MapType = ''
            a.hasValid.MapType.valid = true;
            return a
        })
    }

    async function SaveHandler(event) {

        event.preventDefault();

        const mapType = values.MapType.value;
        const jsonArr = [];
        let mapValueToFieldIds = new Map();
        let duplicateFieldIds = [];

        await UpdateTableList.forEach((i) => {

            if (i.mapValue !== '' && i.mapValue !== null) {
                const mapValue = i.mapValue;

                if (!mapValueToFieldIds.has(mapValue)) {
                    mapValueToFieldIds.set(mapValue, [i.fieldName]);
                } else {
                    mapValueToFieldIds.get(mapValue).push(i.fieldName);
                }
                const defaultBody = {
                    Party: i.party,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                }
                if (mapType === 1) {// 1==party/Customer
                    jsonArr.push({ ...defaultBody, Customer: i.fieldId, MapCustomer: mapValue })
                } else if (mapType === 2) {// 2==Item
                    jsonArr.push({ ...defaultBody, Item: i.fieldId, MapItem: mapValue })
                } else {
                    jsonArr.push({ ...defaultBody, Unit: i.fieldId, MapUnit: mapValue })
                }
            }

        });

        mapValueToFieldIds.forEach((fieldIds, mapValue) => {// Find fieldIds with duplicate mapValues
            if (fieldIds.length > 1) {
                duplicateFieldIds.push({ [`'${mapValue}'`]: ` This Is Duplicate MapValue of ${fieldIds.join(', ')}` });
            }
        });

        if (duplicateFieldIds.length > 0) {
            // Show an alert indicating which FieldId values have duplicate mapValues
            customAlert({
                Type: 3,
                Message: duplicateFieldIds
            });
            return
        }
        dispatch(save_ImportExcelPartyMap({ jsonBody: JSON.stringify(jsonArr), mapType, }));

    };


    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <PageLoadingSpinner isLoading={((partyDropDownLoading && !(loginIsSCMCompany() === 1)) || !pageField)} />

                <div className="page-content">

                    <div className="px-2 c_card_filter text-black" >
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
                                                isDisabled={!(UpdateTableList.length === 0) && true}
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
                                                isDisabled={(!(UpdateTableList.length === 0) || (partyDropDownLoading && !(loginIsSCMCompany() === 1)))}
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
                                    {(UpdateTableList.length === 0) ?
                                        <Go_Button
                                            forceDisabled={(partyDropDownLoading && !(loginIsSCMCompany() === 1))}
                                            onClick={goButtonHandler} loading={listBtnLoading} />
                                        :
                                        <Change_Button onClick={partyOnChangeHandler} />
                                    }
                                </Col>
                            </div>
                        </form>
                    </div>

                    <div className="mt-1">
                        <ToolkitProvider
                            keyField="id"
                            data={UpdateTableList}
                            columns={pagesListColumns}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <BootstrapTable
                                        keyField="id"
                                        bordered={true}
                                        defaultSorted={[{
                                            dataField: 'fieldName',
                                            order: 'asc'
                                        }]}
                                        id="table_Arrow"
                                        noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                                        classes={"custom-table"}
                                        {...toolkitProps.baseProps}
                                        onDataSizeChange={({ dataSize }) => {
                                            dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
                                        }}
                                    />
                                    {globalTableSearchProps(toolkitProps.searchProps)}

                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>


                    </div>
                </div>

                {(UpdateTableList.length > 0) &&
                    <SaveButtonDraggable>
                        <SaveButton
                            onClick={SaveHandler}
                            pageMode={pageMode}
                            userAcc={userPageAccessState}
                            loading={saveBtnloading}
                        />
                    </SaveButtonDraggable>
                }
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
