// import React, { useEffect, useState, } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr"
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import { Change_Button, Go_Button, SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import {
    breadcrumbReturn,
    loginUserID,
    currentDate,
    GoBtnDissable,
    saveDissable,
    loginCompanyID,
    loginPartyID
} from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
    editWorkOrderListSuccess,
    getBOMList,
    postGoButtonForWorkOrder_Master,
    postGoButtonForWorkOrder_MasterSuccess,
    postWorkOrderMaster,
    postWorkOrderMasterSuccess,
    updateWorkOrderList,
} from "../../../store/Production/WorkOrder/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import * as pageId from "../../../routes//allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { countlabelFunc } from "../../../components/Common/ComponentRelatedCommonFile/purchase";
import { mySearchProps } from "../../../components/Common/ComponentRelatedCommonFile/MySearch";
import React, { useEffect, useState } from "react";
const goBtnID1 = "workOrdergoBtnID1"
const changeBtnID1 = "workOrderchangeBtnID1"
const saveBtnID1 = "workOrdersaveBtnID1"
const updateBtnID1 = "workOrderupdateBtnID1"

const CreditLimitMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [itemselect, setItemselect] = useState("")

    const fileds = {
        id: "",
        RoutesName:""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        Routes,
        GoButton
    } = useSelector((state) => ({
        postMsg: state.CreditLimitReducer.postMsg,
        // updateMsg: state.WorkOrderReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Routes: state.CreditLimitReducer.Routes,
        GoButton: state.CreditLimitReducer.goBtnCreditLimitAdd
    }));

    const { BOMItems = [], EstimatedOutputQty = '', id = '', Item = '', Unit = '' } = GoButton

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        const page_Id = pageId.CREDITLIMIT
        dispatch(postGoButtonForWorkOrder_MasterSuccess([]))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))

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
            setUserPageAccessState(userAcc)
            breadcrumbReturn({dispatch,userAcc});

        };
    }, [userAccess])

    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {
            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
                setModalCss(true)
            }

            if (hasEditVal) {
                setEditData(hasEditVal);
                const { id,  Route, RouteName } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                hasValid.RouteName.valid = true;

                values.id = id
                values.RouteName = { label: RouteName, value: Route };

                const jsonBody = JSON.stringify({
                    // Item: Item,
                    // Bom: Bom,
                    // Quantity: parseFloat(Quantity),
                    // Party: Party
                });
                // dispatch(postGoButtonForWorkOrder_Master(jsonBody));

                setState({ values, fieldLabel, hasValid, required, isError })
                // dispatch(editWorkOrderListSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
            }
        }
    }, [])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            // dispatch(postWorkOrderMasterSuccess({ Status: false }))
            // setState(() => resetFunction(fileds, state))// Clear form values  
            // saveDissable(false);//save Button Is enable function
            if (pageMode === mode.dropdownAdd) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.CREDITLIMIT_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            saveDissable(false);//save Button Is enable function
            dispatch(postWorkOrderMasterSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    // useEffect(() => {

    //     if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
    //         dispatch(updateWorkOrderList({ Status: false }))
    //         // saveDissable(false);//Update Button Is enable function
    //         // setState(() => resetFunction(fileds, state))// Clear form values  
    //         history.push({
    //             pathname: url.CREDITLIMIT_LIST,
    //         })
    //     } else if (updateMsg.Status === true && !modalCss) {
    //         saveDissable(false);//Update Button Is enable function
    //         dispatch(
    //             AlertState({
    //                 Type: 3,
    //                 Status: true,
    //                 Message: JSON.stringify(updateMsg.Message),
    //             })
    //         );
    //     }
    // }, [updateMsg, modalCss]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    // let filterItems = Items.filter((index) => {
    //     return index.IsActive === true
    // })

    useEffect(() => {
        const jsonBody = JSON.stringify({
            FromDate: "2022-12-01",
            ToDate: currentDate,
            Company: loginCompanyID(),
            Party: loginPartyID()
        });
        dispatch(getBOMList(jsonBody));
    }, [])

    const RoutesDropdown_options = Routes.map((index) => ({
        value: index.id,
        label: index.ItemName,
        ItemID: index.Item,
        Unit: index.Unit,
        UnitName: index.UnitName,
        EstimatedOutputQty: index.EstimatedOutputQty,
        StockQty: index.StockQty
    }));

    const pagesListColumns = [
        {
            text: " Name",
            dataField: "Name",
        },
        {
            text: "Credit Limit",
            dataField: "CreditLimit",
        },
       
    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: GoButton.length,
        custom: true,
    };

    // const QuantityHandler = (event, user) => {

    //     // user["Quantity"] = event.target.value
    //     let val = event.target.value;
    //     const result = /^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/.test(val);
    //     if ((result) && (parseFloat(event.target.value).toFixed(3))) {
    //         user.Quantity = event.target.value;
    //     }
    //     else if (val === "") {
    //         user.Quantity = event.target.value;
    //     }
    //     else {
    //         event.target.value = user.Quantity
    //     }

    // }

    function RoutesOnchange(e) {
        dispatch(postGoButtonForWorkOrder_MasterSuccess([]))
        setItemselect(e)
        setState((i) => {
            i.values.NumberOfLot = "1";
            i.values.Quantity = e.EstimatedOutputQty;
            i.hasValid.NumberOfLot.valid = true;
            i.hasValid.Quantity.valid = true;
            return i
        })
    }

    const goButtonHandler = (event) => {
        
        const jsonBody = JSON.stringify({
            Item: (pageMode === mode.edit ? EditData.Item : values.ItemName.ItemID),
            Bom: (pageMode === mode.edit ? EditData.Bom : values.ItemName.value),
            Quantity: parseFloat(values.Quantity),
            Party: loginPartyID()
        });
        // GoBtnDissable({ id: goBtnID1, state: true })
        dispatch(postGoButtonForWorkOrder_Master(jsonBody, goBtnID1));
    }

    const SaveHandler = (event) => {
        event.preventDefault();

        // const WorkOrderItems = BOMItems.map((index) => ({
        //     Item: index.Item,
        //     Unit: index.Unit,
        //     BomQuantity: index.BomQuantity,
        //     Quantity: index.Quantity,
        // }))

        const jsonBody = JSON.stringify({
            // WorkOrderDate: values.WorkOrderDate,
            // Item: (pageMode === mode.edit ? Item : values.ItemName.ItemID),
            // Bom: (pageMode === mode.edit ? id : values.ItemName.value),
            // Unit: (pageMode === mode.edit ? Unit : values.ItemName.Unit),
            // NumberOfLot: values.NumberOfLot,
            // Quantity: parseFloat(values.Quantity).toFixed(3),
            // Company: loginCompanyID(),
            // Party: loginPartyID(),
            // CreatedBy: loginUserID(),
            // UpdatedBy: loginUserID(),
            // WorkOrderItems: WorkOrderItems
        });

        // saveDissable(true);//save Button Is dissable function

        if (pageMode === mode.edit) {
            GoBtnDissable({ id: updateBtnID1, state: true })
            dispatch(updateWorkOrderList(jsonBody, EditData.id, updateBtnID1));
        }
        else {
            GoBtnDissable({ id: saveBtnID1, state: true })
            dispatch(postWorkOrderMaster(jsonBody, saveBtnID1));
        }
    };
    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" style={{ marginTop: IsEditMode_Css, height: "18cm" }}>
                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form onSubmit={SaveHandler} noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    <Row>
                                                        <Row>
                                                            <Col md="4" >
                                                                <FormGroup className=" row  mt-2" >
                                                                    <Label className="mt-1"
                                                                        style={{ width: "150px" }}>RoutesName </Label>
                                                                    <div className="col col-6 sm-1">
                                                                        <Select
                                                                            name="RoutesName"
                                                                            value={values.RoutesName}
                                                                            isSearchable={true}
                                                                            // isDisabled={(BOMItems.length > 0) ? true : false}
                                                                            className="react-dropdown"
                                                                            classNamePrefix="dropdown"
                                                                             options={RoutesDropdown_options}
                                                                            onChange={(hasSelect, evn) => {
                                                                                onChangeSelect({ hasSelect, evn, state, setState });
                                                                                RoutesOnchange(hasSelect)
                                                                                dispatch(Breadcrumb_inputName(hasSelect.label))
                                                                            }
                                                                            }
                                                                        />
                                                                        {isError.RoutesName.length > 0 && (
                                                                            <span className="text-danger f-8"><small>{isError.RoutesName}</small></span>
                                                                        )}
                                                                    </div>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        
                                                        <Col sm={1}>
                                                            <div className="col col-1 mt-2">
                                                                {pageMode === mode.defaultsave ?
                                                                      (BOMItems.length === 0) ?
                                                                        < Go_Button id={goBtnID1} onClick={(e) => goButtonHandler()} />
                                                                        :
                                                                        <Change_Button 
                                                                            // onClick={(e) =>
                                                                            //     //  dispatch(postGoButtonForWorkOrder_MasterSuccess([]))
                                                                            // } 
                                                                                 />
                                                                    : null
                                                                }
                                                            </div>
                                                        </Col>

                                                        {BOMItems.length > 0 ?
                                                            <PaginationProvider pagination={paginationFactory(pageOptions)}>
                                                                {({ paginationProps, paginationTableProps }) => (
                                                                    <ToolkitProvider
                                                                        keyField={"id"}
                                                                        data={BOMItems}
                                                                        columns={pagesListColumns}
                                                                        search
                                                                    >
                                                                        {(toolkitProps) => (
                                                                            <React.Fragment>
                                                                                <Row>
                                                                                    <Col xl="12">
                                                                                        <div className="table-responsive">
                                                                                            <BootstrapTable
                                                                                                keyField={"id"}
                                                                                                responsive
                                                                                                bordered={false}
                                                                                                striped={false}
                                                                                                classes={"table  table-bordered"}
                                                                                                {...toolkitProps.baseProps}
                                                                                                {...paginationTableProps}
                                                                                            />
                                                                                            {countlabelFunc(toolkitProps, paginationProps, dispatch, "WorkOrder")}
                                                                                            {mySearchProps(toolkitProps.searchProps, pageField.id)}
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                                <Row className="align-items-md-center mt-30">
                                                                                    <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                                                        <PaginationListStandalone {...paginationProps} />
                                                                                    </Col>
                                                                                </Row>
                                                                            </React.Fragment>
                                                                        )}
                                                                    </ToolkitProvider>
                                                                )}

                                                            </PaginationProvider>
                                                            : <></>}

                                                        {BOMItems.length > 0 ? <FormGroup style={{ marginTop: "-25px" }}>
                                                            <Row >
                                                                <Col sm={2} className="mt-n4">
                                                                    <SaveButton pageMode={pageMode}
                                                                        userAcc={userPageAccessState}
                                                                        module={"CreditLimitMaster"}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup >
                                                            : null
                                                        }
                                                    </Row>

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </form>
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

export default CreditLimitMaster

