import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, FormGroup, Label, Row } from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb_inputName, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { editPartyItemIDSuccess, getpartyItemList, getPartyItemListSuccess, SavePartyItems, SavePartyItemsSuccess } from "../../../store/Administrator/PartyItemsRedux/action";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { SaveButton } from "../../../components/Common/CommonButton";
import { comAddPageFieldFunc, initialFiledFunc, onChangeSelect } from "../../../components/Common/validationFunction";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import BootstrapTable from "react-bootstrap-table-next";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { breadcrumbReturnFunc, btnIsDissablefunc, loginIsSCMCompany, loginJsonBody, loginPartyID, metaTagLabel } from "../../../components/Common/CommonFunction";
import * as pageId from "../../../routes/allPageID";
import { selectAllCheck } from "../../../components/Common/TableCommonFunc";
import * as _cfunc from "../../../components/Common/CommonFunction";

const PartyItems = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const fileds = {
        id: "",
        Name: loginIsSCMCompany() === 1 ? { value: loginPartyID() } : "",
    };

    const [state, setState] = useState(() => initialFiledFunc(fileds));

    const values = { ...state.values };
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location };
    const hasShowloction = location.hasOwnProperty(mode.editValue);
    const hasShowModal = props.hasOwnProperty(mode.editValue);

    const {
        postMsg,
        supplier,
        pageField,
        tableList,
        saveBtnloading,
        userAccess,
    } = useSelector((state) => ({
        saveBtnloading: state.PartyItemsReducer.saveBtnloading,
        postMsg: state.PartyItemsReducer.postMsg,
        tableList: state.PartyItemsReducer.partyItem,
        supplier: state.PartyMasterReducer.partyList,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        const page_Id = pageId.PARTYITEM;
        dispatch(getPartyItemListSuccess([]));
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id));
        if (!(hasShowloction && hasShowModal)) {
            dispatch(getPartyListAPI());
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
                const { values, fieldLabel, hasValid, required, isError } = { ...state };

                hasValid.Name.valid = true;
                values.Name = { value: Party, label: PartyName };

                const convArr = PartyItem.map((item) => {
                    item.selectCheck = false;
                    if (item.Party > 0) {
                        item.selectCheck = true;
                    }
                    return item;
                });
                dispatch(getPartyItemListSuccess(convArr));

                setState({ values, fieldLabel, hasValid, required, isError });
                dispatch(Breadcrumb_inputName(PartyName));
            }
            dispatch(editPartyItemIDSuccess({ Status: false }));
        } else if (loginIsSCMCompany() === 1) {
            const jsonBody = JSON.stringify({ ...loginJsonBody(), ...{ PartyID: loginPartyID() } });
            dispatch(getpartyItemList(jsonBody));
        }
    }, []);

    useEffect(() => {
        if (postMsg.Status === true && postMsg.StatusCode === 200) {
            dispatch(SavePartyItemsSuccess({ Status: false }));
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
                history.push({ pathname: url.PARTYITEM_LIST });
            } else {
                dispatch(Breadcrumb_inputName(""));
                const promise = customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                });
                if (promise) {
                    history.push({ pathname: url.PARTYITEM });
                }
            }
        } else if (postMsg.Status === true) {
            customAlert({
                Type: 3,
                Message: JSON.stringify(postMsg.Message),
            });
        }
    }, [postMsg]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster;
            comAddPageFieldFunc({ state, setState, fieldArr });
        }
    }, [pageField]);

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [tableList]);

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

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

    const GoButton_Handler = async (e) => {
        let supplier = e.value;
        if (!supplier > 0) {
            alert("Please Select Supplier");
            return;
        }

        if (tableList.length > 0) {
            const ispermission = await customAlert({
                Type: 7,
                Message: "Refresh  Item...!",
            });
            if (ispermission) {
                dispatch(getPartyItemListSuccess([]));
            } else {
                return;
            }
        }
        const jsonBody = JSON.stringify({ ...loginJsonBody(), ...{ PartyID: supplier } });
        dispatch(getpartyItemList(jsonBody));
    };

    const rowSelected = (tableArray) => {
        return tableArray.map((index) => (index.selectCheck && index.Item));
    };

    const SaveHandler = (event) => {
        event.preventDefault();
        const selectedItems = groupWiseItemArray.flatMap(group => group.items.filter(item => item.selectCheck));
        const btnId = event.target.id;

        if (selectedItems.length === 0) {
            customAlert({
                Type: 4,
                Message: "Select Atleast One Item",
            });
            return;
        }
        try {
            btnIsDissablefunc({ btnId, state: true });
            var PartyData = selectedItems.map((index) => ({
                Item: index.Item,
                Party: values.Name.value,
            }));

            const jsonBody = JSON.stringify(PartyData);
            dispatch(SavePartyItems({ jsonBody, btnId }));
        } catch (e) {
            btnIsDissablefunc({ btnId, state: false });
        }
    };

    const PartyDropdown = () => {
        if (loginIsSCMCompany() === 1) {
            return null;
        }
        return (
            <Card>
                <CardBody className="c_card_body">
                    <Row>
                        <Row>
                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label htmlFor="validationCustom01">{fieldLabel.Name}</Label>
                                    <Col md="12">
                                        <Select
                                            name="Name"
                                            value={values.Name}
                                            isDisabled={pageMode === mode.assingLink ? true : false}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: (provided) => ({ ...provided, zIndex: 2 }),
                                            }}
                                            options={supplierOptions}
                                            onChange={(hasSelect, evn) => {
                                                onChangeSelect({ hasSelect, evn, state, setState });
                                                GoButton_Handler(hasSelect);
                                                dispatch(Breadcrumb_inputName(hasSelect.label));
                                            }}
                                        />
                                        {isError.Name.length > 0 && (
                                            <span className="text-danger f-8">
                                                <small>{isError.Name}</small>
                                            </span>
                                        )}
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col md="3" className="mt-4"></Col>
                        </Row>
                    </Row>
                </CardBody>
            </Card>
        );
    };

    let IsEditMode_Css = "";
    if (modalCss || pageMode === mode.dropdownAdd) {
        IsEditMode_Css = "-5.5%";
    }

    return (
        <>
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

                                <PartyDropdown />

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
                                                        selectRow={selectAllCheck(rowSelected(i.items))}
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
