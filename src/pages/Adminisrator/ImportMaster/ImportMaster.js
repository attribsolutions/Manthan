import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess, } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import * as pageId from "../../../routes/allPageID";
import * as mode from "../../../routes/PageMode";
import { Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, loginCompanyID } from "../../../components/Common/CommonFunction";
import { comAddPageFieldFunc, formValid, initialFiledFunc, } from "../../../components/Common/validationFunction";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { GoButton_Excel_ImportAdd, saveExcel_ImportMaster } from "../../../store/Administrator/ImportMasterRedux/action";
const ImportMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [EditData, setEditData] = useState({});
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [ItemTabDetails, setItemTabDetails] = useState([])
    const [partySelect, SetPartySelect] = useState("")

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
        goButtonItem,
        partyList
    } = useSelector((state) => ({
        postMsg: state.BOMReducer.PostData,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        goButtonItem: state.ImportMasterReducer.addGoButton,
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

    const PartyDropdown_Options = partyList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));


    const data = [{
        id: 1,
        fieldLabel: "FieldName",
        DataType: "Numner"
    },
    {
        id: 2,
        fieldLabel: "ItemName",
        DataType: "String"

    },
    {
        id: 3,
        fieldLabel: "Unit",
        DataType: "String"

    },
    {
        id: 4,
        fieldLabel: "Amount",
        DataType: "Numner"

    },
    ]
    const pagesListColumns = [
        {
            text: "Field Name",
            dataField: "FieldName",
        },
        {
            text: "Data Type",
            dataField: "ControlTypeName",
        },
        {
            text: "Related Key Field",
            dataField: "Value",
            formatter: (cellContent, user) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    id=""
                                    type="text"
                                    defaultValue={cellContent}
                                    // disabled={true}
                                    // defaultValue={cellContent.toPrecision(5)}
                                    // defaultValue={parseFloat(cellContent).toFixed(3)}
                                    className="col col-sm text-center"
                                    onChange={(e) => user.Value = e.target.value}
                                />
                            </FormGroup>
                        </Col>
                    </div>

                </>
            ),
        },
    ];

    const goButtonHandler = async () => {

        const jsonBody = JSON.stringify({
            PartyID: partySelect.value,
            CompanyID: loginCompanyID()
        })
        dispatch(GoButton_Excel_ImportAdd({ jsonBody }))
    };

    function SaveHandler(event) {
        event.preventDefault();

        let jsonArr = []

        goButtonItem.forEach(i => {
            if ((!(i.Value === '') && !(i.Value === null))) {
                const obj = {
                    Value: i.Value,
                    ImportField: i.id,
                    Party: partySelect.value,
                    Company: loginCompanyID(),
                }
                jsonArr.push(obj)
            }
        })

        const jsonBody = JSON.stringify(jsonArr);
        dispatch(saveExcel_ImportMaster({ jsonBody }));

    };
    console.log("goButtonItem", goButtonItem)
    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <form onSubmit={(event) => SaveHandler(event)} noValidate>
                    <div className="page-content">

                        <div className="px-2 c_card_header text-black" >
                            <div className="px-2   c_card_filter text-black" >
                                <div className="row" >
                                    <Col sm="10">
                                        <FormGroup className="mb-2 row mt-3 " >
                                            <Label className=" p-2"

                                                style={{ maxWidth: "115px" }}>{fieldLabel.Party}</Label>
                                            <Col style={{ maxWidth: "300px" }} >
                                                <Select
                                                    classNamePrefix="select2-Customer"
                                                    value={partySelect}
                                                    options={PartyDropdown_Options}
                                                    onChange={(e) => { SetPartySelect(e) }}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >



                                    <Col sm="2" className="mt-3 ">
                                        <Go_Button
                                            onClick={goButtonHandler}
                                        />
                                    </Col>
                                </div>

                            </div>

                        </div>

                        <div className="mt-1">

                            <ToolkitProvider
                                keyField="id"
                                data={goButtonItem}
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
                                            />
                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>


                                    </React.Fragment>
                                )
                                }
                            </ToolkitProvider>


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
