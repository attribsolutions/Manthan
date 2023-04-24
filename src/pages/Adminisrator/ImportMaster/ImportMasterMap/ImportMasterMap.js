import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess, } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { mySearchProps } from "../../../../components/Common/SearchBox/MySearch";
import * as pageId from "../../../../routes/allPageID";
import * as mode from "../../../../routes/PageMode";
import { Change_Button, Go_Button, SaveButton } from "../../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, loginCompanyID, loginUserID } from "../../../../components/Common/CommonFunction";
import { comAddPageFieldFunc, initialFiledFunc, } from "../../../../components/Common/validationFunction";
import { getPartyListAPI } from "../../../../store/Administrator/PartyRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { CustomAlert } from "../../../../CustomAlert/ConfirmDialog";
import {
    GoButton_ImportMasterMap,
    GoButton_ImportMasterMap_Success,
    save_ImportMasterMap,
    save_ImportMasterMap_Success
} from "../../../../store/Administrator/ImportMasterMapRedux/action";


const ImportMasterMap = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [mapTypeSelect, SetMapTypeSelect] = useState("")
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
        goButtonArr,
        partyList
    } = useSelector((state) => ({
        postMsg: state.ImportFieldMap_Reducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        goButtonArr: state.ImportFieldMap_Reducer.addGoButton,
        partyList: state.PartyMasterReducer.partyList,
    }));

    useEffect(() => {
        const page_Id = pageId.IMPORT_FIELD_MAP
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyListAPI());
        dispatch(GoButton_ImportMasterMap_Success([]));

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

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(save_ImportMasterMap_Success({ Status: false }))
            CustomAlert({
                Type: 1,
                Message: postMsg.Message,
            })


        }
        else if (postMsg.Status === true) {
            dispatch(save_ImportMasterMap_Success({ Status: false }))
            CustomAlert({
                Type: 4,
                Message: JSON.stringify(postMessage.Message),
            })
        }
    }, [postMsg])

    const partyDropdown_Options = partyList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const mapTypeDropdown_Options = [{
        value: 1,
        label: "Item",
    },
    {
        value: 2,
        label: "Party",
    },
    {
        value: 3,
        label: "Customer",
    }]



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
            formatter: (cellContent, row) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    type="text"
                                    key={`Value-${row.id}`}
                                    defaultValue={cellContent}
                                    onChange={(e) => row.Value = e.target.value}
                                />
                            </FormGroup>
                        </Col>
                    </div>

                </>
            ),
        },

    ];

    async function goButtonHandler() {
        // const jsonBody = JSON.stringify({
           let  PartyId= partySelect.value;
           let  typeId= mapTypeSelect.value;
           
        //     CompanyID: loginCompanyID()
        // })
        dispatch(GoButton_ImportMasterMap({ PartyId,typeId }))
    };

    function change_ButtonHandler(e) {
        dispatch(GoButton_ImportMasterMap_Success([]))
    }

    function SaveHandler(event) {
        event.preventDefault();

        let jsonArr = []

        goButtonArr.forEach(i => {
            if ((!(i.Value === '') && !(i.Value === null))) {
                const obj = {
                    Value: i.Value,
                    ImportField: i.id,
                    Party: partySelect.value,
                    Company: loginCompanyID(),
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                }
                jsonArr.push(obj)
            }
        })

        const jsonBody = JSON.stringify(jsonArr);
        dispatch(save_ImportMasterMap({ jsonBody }));

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
                                    <Col sm="5">
                                        <FormGroup className="mb-2 row mt-3 " >
                                            <Label className=" p-2"

                                                style={{ maxWidth: "115px" }}>{fieldLabel.Party}</Label>
                                            <Col style={{ maxWidth: "300px" }} >
                                                <Select
                                                    classNamePrefix="select2-Customer"
                                                    isDisabled={!(goButtonArr.length === 0) && true}
                                                    value={partySelect}
                                                    options={partyDropdown_Options}
                                                    onChange={(e) => { SetPartySelect(e) }}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                    <Col sm="5">
                                        <FormGroup className="mb-2 row mt-3 " >
                                            <Label className=" p-2"

                                                style={{ maxWidth: "115px" }}>{fieldLabel.Party}</Label>
                                            <Col style={{ maxWidth: "300px" }} >
                                                <Select
                                                    classNamePrefix="select2-Customer"
                                                    isDisabled={!(goButtonArr.length === 0) && true}
                                                    value={mapTypeSelect}
                                                    options={mapTypeDropdown_Options}
                                                    onChange={(e) => { SetMapTypeSelect(e) }}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >



                                    <Col sm="2" className="mt-3 ">
                                        {(goButtonArr.length === 0) ?
                                            < Go_Button onClick={goButtonHandler} />
                                            :
                                            <Change_Button onClick={change_ButtonHandler} />
                                        }

                                    </Col>
                                </div>

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

                    <FormGroup>
                        <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                            {(goButtonArr.length > 0) && <SaveButton pageMode={pageMode}
                                userAcc={userPageAccessState}
                                module={"LoadingSheet"}
                            />}
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

export default ImportMasterMap
