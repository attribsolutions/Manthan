import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import {  commonPageField, commonPageFieldSuccess,  } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import Select from "react-select";
import * as pageId from "../../../routes/allPageID";
import * as mode from "../../../routes/PageMode";
import { Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc } from "../../../components/Common/CommonFunction";
import { comAddPageFieldFunc, formValid, initialFiledFunc, } from "../../../components/Common/validationFunction";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
const ImportMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [EditData, setEditData] = useState({});
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [ItemTabDetails, setItemTabDetails] = useState([])
    const [partySelect, SetPartySelect] = useState([])

    const fileds = {
        id: "",
        Party: "",
        ImportType: "",
        PatternType: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        VehicleNumber,
        partyList
    } = useSelector((state) => ({
        postMsg: state.BOMReducer.PostData,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        VehicleNumber: state.VehicleReducer.VehicleList,
        partyList: state.PartyMasterReducer.partyList,
    }));

    useEffect(() => {
        const page_Id = pageId.IMPORT_MASTER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyListAPI());
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

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    // useEffect(() => {
    //     if ((hasShowloction || hasShowModal)) {
    //         let hasEditVal = null
    //         if (hasShowloction) {
    //             setPageMode(location.pageMode)
    //             hasEditVal = location.editValue
    //         }
    //         else if (hasShowModal) {
    //             hasEditVal = props.editValue
    //             setPageMode(props.pageMode)
    //             setModalCss(true)
    //         }

    //         if (hasEditVal) {
    //             let ItemUnits = hasEditVal.ParentUnitDetails.map((data) => ({
    //                 value: data.Unit,
    //                 label: data.UnitName
    //             }))
    //             // setItemUnitOptions(ItemUnits)
    //             setEditData(hasEditVal);
    //             const { id, BomDate, Item, ItemName, Unit, UnitName, EstimatedOutputQty, Comment, IsActive, IsVDCItem } = hasEditVal
    //             const { values, fieldLabel, hasValid, required, isError } = { ...state }
    //             hasValid.id.valid = true;
    //             hasValid.BomDate.valid = true;
    //             hasValid.ItemName.valid = true;
    //             hasValid.UnitName.valid = true;
    //             hasValid.EstimatedOutputQty.valid = true;
    //             hasValid.Comment.valid = true;
    //             hasValid.IsActive.valid = true;
    //             hasValid.IsVDCItem.valid = true;

    //             values.id = id
    //             values.BomDate = BomDate;
    //             values.EstimatedOutputQty = EstimatedOutputQty;
    //             values.Comment = Comment;
    //             values.IsActive = IsActive;
    //             values.ItemName = { label: ItemName, value: Item };
    //             values.UnitName = { label: UnitName, value: Unit };
    //             values.IsVDCItem = IsVDCItem;
    //             setItemTabDetails(hasEditVal.BOMItems)
    //             setState({ values, fieldLabel, hasValid, required, isError })
    //             dispatch(editBOMListSuccess({ Status: false }))
    //             dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
    //         }
    //     }
    // }, [])

    // useEffect(() => {
    //     if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
    //         dispatch(saveBOMMasterSuccess({ Status: false }))
    //         // setState(() => resetFunction(fileds, state))// Clear form values  
    //         // saveDissable(false);//save Button Is enable function
    //         dispatch(Breadcrumb_inputName(''))

    //         if (pageMode === mode.dropdownAdd) {
    //             dispatch(AlertState({
    //                 Type: 1,
    //                 Status: true,
    //                 Message: postMsg.Message,
    //             }))
    //         }
    //         else {
    //             dispatch(AlertState({
    //                 Type: 1,
    //                 Status: true,
    //                 Message: postMsg.Message,
    //                 RedirectPath: url.BIllOf_MATERIALS_LIST,
    //             }))
    //         }
    //     }
    //     else if (postMsg.Status === true) {
    //         dispatch(saveBOMMasterSuccess({ Status: false }))
    //         // saveDissable(false);//save Button Is enable function
    //         dispatch(AlertState({
    //             Type: 4,
    //             Status: true,
    //             Message: JSON.stringify(postMessage.Message),
    //             RedirectPath: false,
    //             AfterResponseAction: false
    //         }));
    //     }
    // }, [postMsg])

    // useEffect(() => {
    //     if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
    //         // saveDissable(false);//Update Button Is enable function
    //         // setState(() => resetFunction(fileds, state))// Clear form values  
    //         history.push({
    //             pathname: url.BIllOf_MATERIALS_LIST,
    //         })
    //     } else if ((updateMsg.Status === true) && (updateMsg.StatusCode === 100) && !(modalCss)) {
    //         dispatch(updateBOMListSuccess({ Status: false }));
    //         dispatch(AlertState({
    //             Type: 6, Status: true,
    //             Message: JSON.stringify(updateMsg.Message),
    //             PermissionFunction: PermissionFunction,

    //         }));
    //     }
    //     else if (updateMsg.Status === true && !modalCss) {
    //         // saveDissable(false);//Update Button Is enable function
    //         dispatch(updateBOMListSuccess({ Status: false }));
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

    const PartyDropdown_Options = partyList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const VehicleNumber_Options = VehicleNumber.map((index) => ({
        value: index.id,
        label: index.VehicleNumber,
    }));
    
    const data = [{
        id: 1,
        fieldLabel: "asas",
    },
    {
        id: 2,
        fieldLabel: "asxdasd",
    },
    {
        id: 3,
        fieldLabel: "asdasdasas",
    },
    {
        id: 4,
        fieldLabel: "sdasd",
    },
    ]
    const pagesListColumns = [
        {
            text: "FieldLabel",
            dataField: "fieldLabel",
        },
        {
            text: "Related Key Field",
            dataField: "",
            formatter: (cellContent, user) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    id=""
                                    type="text"
                                    // disabled={true}
                                    // defaultValue={cellContent.toPrecision(5)}
                                    // defaultValue={parseFloat(cellContent).toFixed(3)}
                                    className="col col-sm text-center"
                                // onChange={(e) => QuantityHandler(e, user)}
                                />
                            </FormGroup>
                        </Col>
                    </div>

                </>
            ),
        },

        {
            text: "Compulsory",
            dataField: "",
            formatter: (cellContent, user) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    id=""
                                    type="checkbox"
                                    // disabled={true}
                                    // defaultValue={cellContent.toPrecision(5)}
                                    // defaultValue={parseFloat(cellContent).toFixed(3)}
                                    className="col col-sm text-center"
                                // onChange={(e) => QuantityHandler(e, user)}
                                />
                            </FormGroup>
                        </Col>
                    </div>

                </>
            ),
        },
    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: data.length,
        custom: true,
    };

    const SaveHandler = (event) => {
        event.preventDefault();
        const BOMItems = ItemTabDetails.map((index) => ({
            Item: index.Item,
            Quantity: index.Quantity,
            Unit: index.Unit
        }))
        if (formValid(state, setState)) {

            let BOMrefID = 0
            if ((pageMode === mode.edit)) {
                BOMrefID = EditData.id
            };

            const jsonBody = JSON.stringify({
                // BomDate: values.BomDate,
                // EstimatedOutputQty: values.EstimatedOutputQty,
                // Comment: values.Comment,
                // IsActive: values.IsActive,
                // Item: values.ItemName.value,
                // Unit: values.UnitName.value,
                // CreatedBy: loginUserID(),
                // Company: loginCompanyID(),
                // BOMItems: BOMItems,
                // IsVDCItem: values.IsVDCItem,
                // ReferenceBom: BOMrefID
            });


            // saveDissable(true);//save Button Is dissable function

            // if (pageMode === mode.edit) {
            //     dispatch(updateBOMList(jsonBody, `${EditData.id}/${EditData.Company}`));
            // }
            // else {
            //     dispatch(saveBOMMaster(jsonBody));
            // }
        }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <form onSubmit={(event) => SaveHandler(event)} noValidate>
                    <div className="page-content">

                        <div className="px-2 c_card_header text-black" >
                            <div className="px-2   c_card_filter text-black" >
                                <div className="row" >
                                    <Col sm="3">
                                        <FormGroup className="mb-2 row mt-3 " >
                                            <Label className=" p-2"

                                                style={{ width: "115px" }}>{fieldLabel.Party}</Label>
                                            <Col >
                                                <Select
                                                    classNamePrefix="select2-Customer"
                                                    value={partySelect}
                                                    options={PartyDropdown_Options}
                                                    onChange={(e) => { SetPartySelect(e) }}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                    <Col sm="3">
                                        <FormGroup className="mb-2 row mt-3 " >
                                            <Label className=" p-2"

                                                style={{ width: "115px" }}>{fieldLabel.ImportType}</Label>
                                            <Col >
                                                <Select
                                                    classNamePrefix="select2-Customer"
                                                // value={SupplierSelect}
                                                // options={SupplierOptions}
                                                // onChange={SupplierOnchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                    <Col sm="3">
                                        <FormGroup className="mb-2 row mt-3 " >
                                            <Label className=" p-2"

                                                style={{ width: "115px" }}>{fieldLabel.PatternType}</Label>
                                            <Col >
                                                <Select
                                                    classNamePrefix="select2-Customer"
                                                // value={SupplierSelect}
                                                // options={SupplierOptions}
                                                // onChange={SupplierOnchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                    <Col md="1"></Col>
                                    <Col sm="2" className="mt-3 ">
                                        <Go_Button
                                        //  onClick={goButtonHandler} 
                                        />
                                    </Col>
                                </div>
                               
                            </div>

                        </div>

                        <div className="mt-1">
                        <PaginationProvider
                                    pagination={paginationFactory(pageOptions)}
                                >
                                    {({ paginationProps, paginationTableProps }) => (
                                        <ToolkitProvider

                                            keyField="id"
                                            data={data}
                                            columns={pagesListColumns}

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
                            {/* <PaginationProvider pagination={paginationFactory(pageOptions)}>
                                {({ paginationProps, paginationTableProps }) => (
                                    <ToolkitProvider
                                        keyField={"id"}
                                        data={data}
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
                                                                noDataIndication={<div className="text-danger text-center ">Data Not available</div>}
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
                            </PaginationProvider> */}
                        </div>
                    </div>

                    <FormGroup>
                        <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                            <SaveButton pageMode={pageMode}
                                //   onClick={onsave}
                                userAcc={userPageAccessState}
                                module={"LoadingSheet"}
                            />
                        </Col>
                    </FormGroup >
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

export default ImportMaster
