import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
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
    getpartyItemList,
    getPartyItemListSuccess,
    getSupplier,
    PostPartyItems,
    PostPartyItemsSuccess
} from "../../../store/Administrator/PartyItemsRedux/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable, { CHECKBOX_STATUS_CHECKED } from "react-bootstrap-table-next";
import { countlabelFunc } from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import { mySearchProps } from "../../../components/Common/ComponentRelatedCommonFile/SearchBox/MySearch";
import SaveButton from "../../../components/Common/ComponentRelatedCommonFile/CommonSaveButton";
import { PARTYITEM_LIST } from "../../../routes/route_url";
import { comAddPageFieldFunc, formValid, initialFiledFunc, onChangeSelect } from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";



const PartyItems = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const [pageMode, setPageMode] = useState("");
    const [modalCss, setModalCss] = useState(false);
    const [supplierSelect, setSupplierSelect] = useState('');
    const [userAccState, setUserPageAccessState] = useState("");

    // get method for dropdown
    useEffect(() => {
        dispatch(getSupplier());
    }, [dispatch]);


    {/** Dyanamic Page access state and OnChange function */ }

    const fileds = {
        id: "",
        SupplierName: "",

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(36))
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        supplier,
        partyItem,
        pageField,
        tableList,
        userAccess } = useSelector((state) => ({

            postMsg: state.PartyItemsReducer.postMsg,
            updateMsg: state.PartyItemsReducer.updateMsg,
            partyItem: state.PartyItemsReducer.partyItem,
            tableList: state.GroupReducer.groupList,
            supplier: state.PartyItemsReducer.supplier,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        dispatch(getSupplier())
        dispatch(getGroupList());
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
        };
    }, [userAccess])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.


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

                const { id, SupplierName } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.SupplierName.valid = true;


                values.id = id
                values.SupplierName = { label: SupplierName, value: SupplierName };

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.SupplierName))

            }
            dispatch(editGroupIDSuccess({ Status: false }))
        }
    }, [])


    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(PostPartyItemsSuccess({ Status: false }))
            setState(() => initialFiledFunc(fileds)) //+++++++++ Clear form values 
            saveDissable(false);//+++++++++save Button Is enable function
            dispatch(getPartyItemListSuccess([]))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: false,
            }))

        } else if
            (postMsg.Status === true) {
            saveDissable(false);//+++++++++save Button Is enable function
            dispatch(PostPartyItemsSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])


    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            saveDissable(false);//+++++++++Update Button Is enable function
            setState(() => initialFiledFunc(fileds)) //+++++++++ Clear form values
            history.push({
                pathname: PARTYITEM_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            saveDissable(false);//+++++++++Update Button Is enable function
            dispatch(updategroupIDSuccess({ Status: false }));
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
        label: i.Supplier,
    }));

    const tableColumns = [
        {
            text: "PartyItemID",
            dataField: "id",
            sort: true,
        },
        {
            text: "ItemName",
            dataField: "Name",
            sort: true,
        },
        {
            text: "SelectAll",
            dataField: "itemCheck",
            sort: true,
            mode: 'checkbox',
            clickToSelect: true,
            headerColumnStyle: {
                lable: 'SelectAll'
            },


            // formatter: (cellContent, row,i) => {
            //     return (
            //         <button
            //             className="btn btn-danger btn-xs"
            //             onClick={() => handleDelete(row.id,i)}
            //         >
            //             Add
            //         </button>
            //     );
            // },

            formatter: (cellContent, row, col, k) => (
                <span >
                    <Input type="checkbox"
                        defaultChecked={cellContent}
                        onChange={e => row.itemCheck = e.target.checked}
                    />

                </span>


            ),

        }
    ];
    // const handleDelete = (i) => {
    //         var Index = i + 1
    //         document.getElementById("BootstrapTable")
    //         $table.bootstrapTable('insertRow', {
    //           index: 1,
    //           row: {
    //             name: 'Item ' + Index,
    //             price: '$' + Index
    //           }
    //         // })
    //     //   } )
    //     })

    // };

    // const selectRow = {

    //     mode: 'checkbox',
    //     clickToSelect: true,
    //     text: "Action",
    //     dataField: "itemCheck",
    //     sort: true,
    //     selectColumnPosition: 'right',
    //     // headerColumnStyle: {
    //     //     lable:'SelectAll'
    //     //   },

    //     formatter: (cellContent, row, col,k) => (
    //         <span >
    //             <Input type="checkbox"
    //                 defaultChecked={cellContent}
    //                 onChange={e => row.itemCheck = e.target.checked}
    //             />

    //         </span>


    //     ),


    // }



    const pageOptions = {
        sizePerPage: 15,
        custom: true,
    };


    const GoButton_Handler = (e) => {
        let supplier = e.value
        setSupplierSelect(e)
        if (!supplier > 0) {
            alert("Please Select Supplier")
            return
        }

        if (partyItem.length > 0) {
            if (window.confirm("Refresh  Item...!")) {
                dispatch(getPartyItemListSuccess([]))
            } else {


                return
            }
        }
        dispatch(getpartyItemList(supplier))
        // dispatch(getItemList(ItemList))
    };


    const SubmitHandler = (event) => {

        const Find = partyItem.filter((index) => {
            return (index.itemCheck === true)
        })
        var PartyData = Find.map((index) => ({
            Item: index.id,
            Party: supplierSelect.value

        }))
        const jsonBody = JSON.stringify(Find, PartyData)
        dispatch(PostPartyItems(PartyData));

        saveDissable(true);//+++++++++save Button Is dissable function
    };

   


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userAccState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>{userAccState.PageHeading} | FoodERP-React FrontEnd</title>
                        </MetaTags>

                        <Breadcrumb
                            pageHeading={userAccState.PageHeading}
                            newBtnView={false}
                            showCount={true}
                            excelBtnView={false}
                        />

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
                                                                <Label htmlFor="validationCustom01"> SupplierName </Label>
                                                                <Col md="12">
                                                                    <Select
                                                                        name="SupplierName"
                                                                        value={values.SupplierName}
                                                                        isSearchable={true}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={supplierOptions}
                                                                        onChange={(hasSelect, evn) => {
                                                                            onChangeSelect({ hasSelect, evn, state, setState, })
                                                                            GoButton_Handler(hasSelect)
                                                                        }}
                                                                    />
                                                                    {isError.SupplierName.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.SupplierName}</small></span>
                                                                    )}

                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="3" className="mt-4">
                                                            {/* <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                                                // onClick={GoButton_Handler}
                                                            >Go</Button> */}
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
                                            data={partyItem}
                                            columns={tableColumns}

                                            search
                                        >
                                            {toolkitProps => (
                                                <React.Fragment>
                                                    <div className="table">
                                                        <BootstrapTable
                                                            // id="BootstrapTable"
                                                            // selectRow={selectRow}
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
                                    <SaveButton pageMode={pageMode} userAcc={userAccState}
                                        module={"supplier"} onClick={SubmitHandler}
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



