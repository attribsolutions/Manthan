import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Label, Row } from "reactstrap";

import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb_inputName, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { goButtonPartyItemAddPageSuccess, goButtonPartyItemAddPage, savePartyItemsAction, savePartyItemsActionSuccess, editPartyItemIDSuccess, channalItemViewDetailAction } from "../../../store/Administrator/PartyItemsRedux/action";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { C_Button, PageLoadingSpinner, SaveButton } from "../../../components/Common/CommonButton";

import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import BootstrapTable from "react-bootstrap-table-next";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { breadcrumbReturnFunc, metaTagLabel } from "../../../components/Common/CommonFunction";
import * as pageId from "../../../routes/allPageID";
import { selectAllCheck } from "../../../components/Common/TableCommonFunc";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_Select } from "../../../CustomValidateForm";
import { getPartyTypelist, getPartyTypelistSuccess } from "../../../store/Administrator/PartyTypeRedux/action";
import ChannelViewDetails from "./ChannelViewDetails";
import { vieBtnCss } from "../../../components/Common/ListActionsButtons";


function initialState(history) {

    let page_Id = '';
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.PARTYITEM) {
        page_Id = pageId.PARTYITEM;
    }
    else if (sub_Mode === url.CHANNEL_ITEM) {
        page_Id = pageId.CHANNEL_ITEM;
    }

    return { page_Id }
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
    const [partyIdSelect, setPartyIdSelect] = useState({ value: _cfunc.loginSelectedPartyID() })
    const [channelTypeSelect, setChannelTypeSelect] = useState('');

    const location = { ...history.location };
    const hasShowloction = location.hasOwnProperty(mode.editValue);
    const hasShowModal = props.hasOwnProperty(mode.editValue);

    const {
        postMsg,
        pageField,
        tableList,
        saveBtnloading,
        GoBtnlistloading,
        userAccess,
        PartyTypes,
        viewBtnLoading
    } = useSelector((state) => ({
        saveBtnloading: state.PartyItemsReducer.saveBtnloading,
        GoBtnlistloading: state.PartyItemsReducer.partyItemListLoading,
        postMsg: state.PartyItemsReducer.postMsg,
        tableList: state.PartyItemsReducer.partyItem,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        PartyTypes: state.PartyTypeReducer.ListData,
        viewBtnLoading: state.PartyItemsReducer.channeItemViewBtnLoading,
    }));

    useEffect(() => {

        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_id));
        dispatch(getPartyTypelist());

        if (!(_cfunc.loginSelectedPartyID() === 0) && !(hasShowloction || hasShowModal)) {
            goButtonHandler()
        }
        return () => {
            dispatch(getPartyTypelistSuccess([]));
            dispatch(goButtonPartyItemAddPageSuccess([]));

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
            dispatch(Breadcrumb_inputName(""));
            if (pageMode === mode.assingLink) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                });
                props.isOpenModal(false);
            } else {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                });
            }
        } else if (postMsg.Status === true) {
            dispatch(savePartyItemsActionSuccess({ Status: false }));
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
        {
            text: "View",
            dataField: "",
            hidden: (subPageMode === url.PARTYITEM),
            formatExtraData: { viewBtnLoading },
            formatter: (cell, row, __, { viewBtnLoading }) => {
                return <div >
                    <C_Button
                        className={vieBtnCss}
                        loading={(viewBtnLoading === row.Item) && true}
                        spinnerColor='white'
                        onClick={() => {
                            const jsonBody = JSON.stringify({
                                "Item": row.Item,
                                "PartyType": channelTypeSelect.value,
                            })
                            dispatch(channalItemViewDetailAction({ jsonBody, btnId: row.Item }))
                        }}><i className="bx bxs-show font-size-16" /></C_Button>
                </div>
            }

        },
    ];

    function goButtonHandler(event) {

        try {
            event?.persist();// Call event.persist() to remove the synthetic event from the pool

            if ((_cfunc.loginSelectedPartyID() === 0 && !(subPageMode === url.CHANNEL_ITEM))) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                return;
            };
            const jsonBody = {
                ..._cfunc.loginJsonBody(),
                PartyID: _cfunc.loginSelectedPartyID(),
                PartyTypeID: channelTypeSelect.value
            };
            dispatch(goButtonPartyItemAddPage({ jsonBody, subPageMode }));
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
    const nonSelectedRow = (tableArray) => {
        var noSelectedIds = [];
        if (subPageMode === url.CHANNEL_ITEM) {
            noSelectedIds = tableArray
                .filter(row => (row.InPartyItem == true))
                .map(row => row.Item);
        }else if (subPageMode === url.PARTYITEM) {
                noSelectedIds = tableArray
                    .filter(row => (row.InStock == true))
                    .map(row => row.Item);
        }
        return noSelectedIds;
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
                // Party: partyIdSelect.value,
                Party: (pageMode === mode.assingLink) ? partyIdSelect.value : _cfunc.loginSelectedPartyID(),
                PartyType: channelTypeSelect.value
            })));
            dispatch(savePartyItemsAction({ jsonBody, subPageMode }));
        } catch (w) { }
    };

    const AdminDivsionRoleDropdown = () => {
        if (subPageMode === url.PARTYITEM) {
            return (
                <PartyDropdown_Common
                    goBtnLoading={GoBtnlistloading}
                    goButtonHandler={goButtonHandler}
                    changeButtonHandler={partyOnChngeButtonHandler}
                />
            )
        }
        return null
    };
    const ChannelTypeDropdown = () => {
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
                                        isDisabled={(filterdItemWise_tableData.length > 0)}
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

                        <Col sm="1">
                            {((filterdItemWise_tableData.length === 0)) ? (
                                <C_Button
                                    type="button"
                                    loading={GoBtnlistloading}
                                    className="btn btn-outline-primary border-1 font-size-12 text-center"
                                    onClick={(e) => {
                                        goButtonHandler(e)
                                    }}
                                >
                                    Select
                                </C_Button>
                            ) : (
                                <C_Button
                                    type="button"
                                    spinnerColor={"info"}
                                    className="btn btn-outline-info border-1 font-size-12 "
                                    onClick={() => { dispatch(goButtonPartyItemAddPageSuccess([])); }}

                                >Change</C_Button>
                            )}
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

                        <AdminDivsionRoleDropdown />
                        <ChannelViewDetails />

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

                                <ChannelTypeDropdown />

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
                                                            nonSelectable: nonSelectedRow(i.items),
                                                            disabledWithMsg:subPageMode==url.PARTYITEM&&"In-stock",
                                                            bgColor: '',
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
