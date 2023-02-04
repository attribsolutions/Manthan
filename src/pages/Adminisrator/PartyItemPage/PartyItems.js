import React, { useEffect, useState } from "react";
import {
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
import {
    AlertState,
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
    editGroupIDSuccess,
    getGroupList,
    updategroupIDSuccess
} from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    editPartyItemIDSuccess,
    getpartyItemList,
    getPartyItemListSuccess,
    PostPartyItems,
    PostPartyItemsSuccess
} from "../../../store/Administrator/PartyItemsRedux/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { countlabelFunc } from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import { mySearchProps } from "../../../components/Common/ComponentRelatedCommonFile/SearchBox/MySearch";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { comAddPageFieldFunc, initialFiledFunc, onChangeSelect, } from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import BootstrapTable from "react-bootstrap-table-next";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";

const PartyItems = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userAccState, setUserPageAccessState] = useState("");
    const [itemArr, setitemArr] = useState([]);
    console.log("itemArr", itemArr)

    const fileds = {
        id: "",
        Name: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;


    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)
    const hasDropMode = props.hasOwnProperty("dropMode")

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        supplier,
        pageField,
        tableList,
        userAccess } = useSelector((state) => ({
            postMsg: state.PartyItemsReducer.postMsg,
            updateMsg: state.PartyItemsReducer.updateMsg,
            tableList: state.PartyItemsReducer.partyItem,
            supplier: state.PartyMasterReducer.partyList,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(36))
        dispatch(getPartyListAPI())
        dispatch(getGroupList());
    }, []);

    useEffect(() => {
        setitemArr(tableList)
    }, [tableList]);

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) {
            locationPath = props.masterPath;
        }
        else if (hasDropMode) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserPageAccessState(userAcc)
        };
    }, [userAccess])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
                setModalCss(true)
            }
            else if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            if (hasEditVal) {
                debugger
                const { Party, PartyName } = hasEditVal.Party
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;
                values.Name = { value: Party, label: PartyName };

                dispatch(getpartyItemList(Party))
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(PartyName))
            }
            dispatch(editPartyItemIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {

            dispatch(PostPartyItemsSuccess({ Status: false }))
            if (hasDropMode) {
                props.isOpenModal(false)
            }
            dispatch(PostPartyItemsSuccess({ Status: false }))
            dispatch(getPartyItemListSuccess([]))
            dispatch(Breadcrumb_inputName(''))

            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: url.PARTYITEM_LIST,
            }))

        } else if
            (postMsg.Status === true) {
            dispatch(PostPartyItemsSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath:url.PARTYITEM_LIST,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            history.push({
                pathname: url.PARTYITEM_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(PostPartyItemsSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss]);

    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const tableColumns = [
        {
            text: "ItemID",
            dataField: "Item",
            sort: true,
        },
        {
            text: "ItemName",
            dataField: "ItemName",
            sort: true,
        },
        {
            text: "SelectAll",
            dataField: "itemCheck",
            sort: true,
            formatter: (cellContent, row, col, k) => {
                debugger
                if ((row["hasInitialVal"] === undefined)) { row["hasInitialVal"] = cellContent }
                return (<span >
                    <Input type="checkbox"
                        defaultChecked={cellContent}
                        key={row.Item}
                        disabled={hasDropMode ? row.hasInitialVal ? pageMode === mode.edit ? true : false : false : false}
                        onChange={e => {
                            setitemArr(ele => {
                                var newrr = ele.map(i => {
                                    if (row.Item === i.Item) {
                                        i.itemCheck = !i.itemCheck;
                                    }
                                    return i
                                });
                                return newrr
                            })

                        }}
                    />

                </span>
                )
            },

        }
    ];

    const pageOptions = {
        sizePerPage: 15,
        custom: true,
    };

    const GoButton_Handler = (e) => {
        let supplier = e.value
        if (!supplier > 0) {
            alert("Please Select Supplier")
            return
        }

        if (tableList.length > 0) {
            if (window.confirm("Refresh  Item...!")) {
                dispatch(getPartyItemListSuccess([]))
            } else {
                return
            }
        }
        dispatch(getpartyItemList(supplier))
    };

    const SubmitHandler = (e) => {

        e.preventDefault();
        const Find = itemArr.filter((index) => {
            return (index.itemCheck === true)
        })

        var PartyData = Find.map((index) => ({
            Item: index.Item,
            Party: values.Name.value

        }))
        const jsonBody = JSON.stringify(PartyData)
        dispatch(PostPartyItems(jsonBody));
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userAccState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userAccState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userAccState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >

                                <Row className="">
                                    <Col md={12}>
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
                                                                        isDisabled={props.dropMode === "dropdownAdd" ? true : false}
                                                                        isSearchable={true}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={supplierOptions}
                                                                        onChange={(hasSelect, evn) => {
                                                                            onChangeSelect({ hasSelect, evn, state, setState, })
                                                                            GoButton_Handler(hasSelect)
                                                                            dispatch(Breadcrumb_inputName(hasSelect.label
                                                                            ))
                                                                        }}
                                                                    />
                                                                    {isError.Name.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.Name}</small></span>
                                                                    )}

                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="3" className="mt-4">
                                                        </Col>
                                                    </Row>
                                                </Row>

                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>

                                <PaginationProvider
                                    pagination={paginationFactory(pageOptions)}
                                >
                                    {({ paginationProps, paginationTableProps }) => (
                                        <ToolkitProvider

                                            keyField="id"
                                            data={tableList}
                                            columns={tableColumns}

                                            search
                                        >
                                            {toolkitProps => (
                                                <React.Fragment>
                                                    <div className="table">
                                                        <BootstrapTable
                                                            keyField={"id"}
                                                            bordered={true}
                                                            striped={false}
                                                            noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                                                            classes={"table align-middle table-nowrap table-hover"}
                                                            headerWrapperClasses={"thead-light"}

                                                            {...toolkitProps.baseProps}
                                                            {...paginationTableProps}
                                                        />
                                                        {countlabelFunc(toolkitProps, paginationProps, dispatch, "MRP")}
                                                        {mySearchProps(toolkitProps.searchProps)}
                                                    </div>

                                                    <Row className="align-items-md-center mt-30">
                                                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                            <PaginationListStandalone
                                                                {...paginationProps}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </React.Fragment>
                                            )
                                            }
                                        </ToolkitProvider>
                                    )
                                    }

                                </PaginationProvider>


                                {(supplier.length > 0) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                                    <SaveButton
                                        pageMode={pageMode}
                                        userAcc={userAccState}
                                        module={"PartyItems"} onClick={SubmitHandler}
                                    />
                                </div>
                                    : <div className="row save1"></div>}

                            </CardBody>

                        </Card>

                    </Container>
                </div>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }

};
export default PartyItems



