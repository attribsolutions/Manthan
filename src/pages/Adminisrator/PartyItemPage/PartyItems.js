import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, FormGroup, Label, Row } from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb_inputName, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { editPartyItemIDSuccess, goButtonPartyItemAddPage, goButtonPartyItemAddPageSuccess, savePartyItemsAction, savePartyItemsActionSuccess } from "../../../store/Administrator/PartyItemsRedux/action";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { PageLoadingSpinner, SaveButton } from "../../../components/Common/CommonButton";
import { comAddPageFieldFunc, initialFiledFunc } from "../../../components/Common/validationFunction";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import BootstrapTable from "react-bootstrap-table-next";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { breadcrumbReturnFunc, loginIsSCMCompany, loginPartyID, metaTagLabel } from "../../../components/Common/CommonFunction";
import * as pageId from "../../../routes/allPageID";
import { selectAllCheck } from "../../../components/Common/TableCommonFunc";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_Select } from "../../../CustomValidateForm";
import { getPartyTypelist, getPartyTypelistSuccess } from "../../../store/Administrator/PartyTypeRedux/action";


function initialState(history) {

    let page_Id = '';
    let listPath = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.PARTYITEM) {
        page_Id = pageId.PARTYITEM;
        listPath = url.PARTYITEM_LIST
    }
    else if (sub_Mode === url.CHANNEL_ITEM) {
        page_Id = pageId.CHANNEL_ITEM;
        listPath = url.CHANNEL_ITEM_LIST
    }

    return { page_Id, listPath }
};

const PartyItems = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [subPageMode] = useState(history.location.pathname)
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState("");
    const [searchQuery, setSearchQuery] = useState("");


    const [page_id] = useState(() => initialState(history).page_Id)
    const [listPath] = useState(() => initialState(history).listPath)
    const [partyIdSelect, setPartyIdSelect] = useState({ value: _cfunc.loginSelectedPartyID() })
    const [channelTypeSelect, setChannelTypeSelect] = useState('');

    const location = { ...history.location };
    const hasShowloction = location.hasOwnProperty(mode.editValue);
    const hasShowModal = props.hasOwnProperty(mode.editValue);
    debugger
    const {
        postMsg,
        pageField,
        tableList,
        saveBtnloading,
        GoBtnlistloading,
        userAccess,
        PartyTypes
    } = useSelector((state) => ({
        saveBtnloading: state.PartyItemsReducer.saveBtnloading,
        GoBtnlistloading: state.PartyItemsReducer.partyItemListLoading,
        postMsg: state.PartyItemsReducer.postMsg,
        tableList: state.PartyItemsReducer.partyItem,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        PartyTypes: state.PartyTypeReducer.ListData,
    }));

    useEffect(() => {

        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_id));
        dispatch(getPartyTypelist());

        if (!(_cfunc.loginSelectedPartyID() === 0) && !(hasShowloction && hasShowModal)) {
            goButtonHandler()
        }
        return () => {
            dispatch(getPartyTypelistSuccess([]));
        }
    }, []);

    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) {
            locationPath = props.masterPath;
        }

        userAcc = userAccess.find((inx) => {
            return `/${inx.ActualPagePath}` === locationPath;
        });

        if (userAcc) {
            setUserAccState(userAcc);
            if (!props.isAssing) {
                breadcrumbReturnFunc({ dispatch, userAcc });
            }
        }
    }, [userAccess]);

    useEffect(() => {
        debugger
        if (hasShowloction || hasShowModal) {
            let hasEditVal = null;
            if (hasShowModal) {
                hasEditVal = props.editValue;
                setPageMode(props.pageMode);
                setModalCss(true);
            } else if (hasShowloction) {
                setPageMode(location.pageMode);
                hasEditVal = location.editValue;
            }
            if (hasEditVal) {
                const { Party, PartyName, PartyItem = [] } = hasEditVal;
                const convArr = PartyItem.map((item) => {
                    item.selectCheck = false;
                    if (item.Party > 0) {
                        item.selectCheck = true;
                    }
                    return item;
                });
                setPartyIdSelect({ value: Party, label: PartyName })
                dispatch(goButtonPartyItemAddPageSuccess(convArr));
                dispatch(Breadcrumb_inputName(PartyName));
            }
            dispatch(editPartyItemIDSuccess({ Status: false }));
        }
    }, []);

    useEffect(() => {
        if (postMsg.Status === true && postMsg.StatusCode === 200) {
            dispatch(savePartyItemsActionSuccess({ Status: false }));
            if (pageMode === mode.assingLink) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                });
                props.isOpenModal(false);
            } else if (pageMode === mode.edit) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                });
                history.push({ pathname: listPath });
            } else {
                dispatch(Breadcrumb_inputName(""));
                const promise = customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                });
                if (promise) {
                    history.push({ pathname: listPath });
                }
            }
        } else if (postMsg.Status === true) {
            customAlert({
                Type: 3,
                Message: JSON.stringify(postMsg.Message),
            });
        }
    }, [postMsg]);

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [tableList]);

    const channelDropdownOptions = useMemo(() => {
        return PartyTypes.map(item => ({ value: item.id, label: item.Name }))
    }, [PartyTypes]);

    mySearchProps({
        onSearch: (text) => {
            setSearchQuery(text);
        },
    });

    const groupWiseItemArray = useMemo(() => {
        const groupItemsByGroup = (items) => {
            const groupedItems = items.reduce((result, item) => {
                const { GroupName, ...rest } = item;
                if (!result[GroupName]) {
                    result[GroupName] = [];
                }
                result[GroupName].push(rest);
                return result;
            }, {});
            return Object.entries(groupedItems).map(([group, items]) => ({ group, items, })
            );
        };
        return groupItemsByGroup(tableList);
    }, [tableList]);

    const filterdItemWise_tableData = useMemo(() => {
        return groupWiseItemArray
            .map(({ items, ...rest }) => ({
                ...rest,
                items: items.filter((item) => {
                    return (
                        item.ItemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        String(item.Item).toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }),
            }))
            .filter((row) => row.items.length > 0);
    }, [searchQuery, groupWiseItemArray]);

    const tableColumns = [
        {
            text: "Item ID",
            dataField: "Item",
            sort: true,
            style: {
                width: "100px",
            },
        },
        {
            text: "Item Name",
            dataField: "ItemName",
            sort: true,
            style: {
                width: "700px",
            },
        },
    ];

    function goButtonHandler() {
        try {
            if ((_cfunc.loginSelectedPartyID() === 0)) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                return;
            };
            const jsonBody = {
                ..._cfunc.loginJsonBody(),
                PartyID: _cfunc.loginSelectedPartyID()
            };
            dispatch(goButtonPartyItemAddPage(jsonBody, subPageMode));
        }
        catch (error) { }
        return
    };

    function partyOnChngeButtonHandler() {
        dispatch(goButtonPartyItemAddPageSuccess([]));
    }

    const rowSelected = (tableArray) => {
        return tableArray.map((index) => (index.selectCheck && index.Item));
    };

    const SaveHandler = (event) => {
        event.preventDefault();

        const selectedItems = groupWiseItemArray.flatMap(group => group.items.filter(item => item.selectCheck));

        if (selectedItems.length === 0) {
            customAlert({
                Type: 4,
                Message: "Select Atleast One Item",
            });
            return;
        }
        try {
            const jsonBody = JSON.stringify(selectedItems.map((index) => ({
                Item: index.Item,
                Party: partyIdSelect.value,
            })));
            dispatch(savePartyItemsAction({ jsonBody, subPageMode }));
        } catch (w) { }
    };

    const PageHeaderDropdown = () => {
        if (subPageMode === url.PARTYITEM) {
            return (
                <PartyDropdown_Common
                    goBtnLoading={GoBtnlistloading}
                    goButtonHandler={goButtonHandler}
                    changeButtonHandler={partyOnChngeButtonHandler}
                />
            )
        }
        if (subPageMode === url.CHANNEL_ITEM) {
            return (
                <div className="px-2 c_card_header text-black mb-1">
                    <div className="row pt-2">
                        <Col sm="5">
                            <FormGroup className="row">
                                <Label className="col-sm-5 p-2" style={{ width: "120px" }}>
                                    Channel Type
                                </Label>
                                <Col sm="6">
                                    <C_Select
                                        name="Name"
                                        value={channelTypeSelect}
                                        isDisabled={pageMode === mode.assingLink ? true : false}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: (provided) => ({ ...provided, zIndex: 2 }),
                                        }}
                                        options={channelDropdownOptions}
                                        onChange={(e) => { setChannelTypeSelect(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </div>
                </div>
            );
        }
        return null
    };

    let IsEditMode_Css = "";
    if (modalCss || pageMode === mode.dropdownAdd) {
        IsEditMode_Css = "-5.5%";
    }

    return (
        <>
            <PageLoadingSpinner isLoading={(GoBtnlistloading || !pageField)} />
            {userPageAccessState && (
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header">
                                <h4 className="card-title text-black">
                                    {userPageAccessState.PageDescription}
                                </h4>
                                <p className="card-title-desc text-black">
                                    {userPageAccessState.PageDescriptionDetails}
                                </p>
                            </CardHeader>

                            <CardBody style={{ backgroundColor: "#whitesmoke" }}>

                                <PageHeaderDropdown />

                                {filterdItemWise_tableData.length > 0 ? (
                                    <>
                                        {filterdItemWise_tableData.map((i, key) => (
                                            <div key={i.group}>
                                                <Label
                                                    style={{
                                                        background: "#efefef",
                                                        padding: "7px 10px 0px 8px",
                                                        borderRadius: "3px",
                                                    }}
                                                >
                                                    <h6> Group : {i.group ? i.group : `No Group Assign`}</h6>
                                                </Label>
                                                <div className="table">
                                                    <BootstrapTable
                                                        keyField={"Item"}
                                                        key={`table-key-${i.group}-${key}`}
                                                        data={i.items}
                                                        columns={tableColumns}
                                                        Item="table_Arrow"
                                                        selectRow={selectAllCheck({
                                                            rowSelected: rowSelected(i.items),
                                                            bgColor: ''
                                                        })}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Items Not available
                                                            </div>
                                                        }
                                                        classes={"table align-middle table-nowrap table-hover"}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <BootstrapTable
                                            keyField={"Item"}
                                            data={[]}
                                            columns={tableColumns}
                                            noDataIndication={
                                                <div className="text-danger text-center ">
                                                    Items Not available
                                                </div>
                                            }
                                        />
                                    </>
                                )}

                                <div className="row save1">
                                    <SaveButton
                                        loading={saveBtnloading}
                                        pageMode={pageMode}
                                        userAcc={userPageAccessState}
                                        module={"PartyItems"}
                                        onClick={SaveHandler}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            )}
        </>
    );
};

export default PartyItems;
