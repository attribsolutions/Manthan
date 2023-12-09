import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Label,
    Row,
} from "reactstrap";

import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getGroupList } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
} from "../../../components/Common/validationFunction";
import { Change_Button, Go_Button, SaveButton, } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, metaTagLabel, } from "../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../routes/index"
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { C_Select } from "../../../CustomValidateForm";
import { Get_Subcluster_On_cluster_API, VendorSupplierCustomer } from "../../../helpers/backend_helper";
import { getClusterlist } from "../../../store/Administrator/ClusterRedux/action";
import { GoButton_For_PartyDetails, GoButton_For_PartyDetails_Success, savePartyDetails_Action, savePartyDetails_Success } from "../../../store/Administrator/PartyDetailsRedux/action";
import { getEmployeedropdownList } from "../../../store/Administrator/ManagementPartiesRedux/action";
import { width } from "dom-helpers";


const PartyDetails = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        IsActive: false
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.edit);
    const [userPageAccessState, setUserAccState] = useState('');

    const [tableData, setTableData] = useState([]);
    const [forceRefresh, setForceRefresh] = useState(false);
    const [forceRefreshGM, setForceRefreshGM] = useState(false);
    const [forceRefreshNH, setForceRefreshNH] = useState(false);
    const [forceRefreshRH, setForceRefreshRH] = useState(false);
    const [forceRefreshASM, setForceRefreshASM] = useState(false);
    const [forceRefreshSE, setForceRefreshSE] = useState(false);
    const [forceRefreshSR, setForceRefreshSR] = useState(false);
    const [forceRefreshMT, setForceRefreshMT] = useState(false);
    const [forceRefreshSO, setForceRefreshSO] = useState(false);




    const [groupSelect, setGroupSelect] = useState({ value: 0, label: "All" });
    const [goBtnLoading, setGoBtnLoading] = useState(false);

    const {
        goBtnList,
        saveBtnloading,
        postMsg,
        pageField,
        clusterDropdown,
        groupList,
        employeeList,
        groupListLoading,
        userAccess } = useSelector((state) => ({
            goBtnList: state.PartyDetailsReducer.goBtnList,

            clusterDropdown: state.ClusterReducer.ClusterListData,

            saveBtnloading: state.PartyDetailsReducer.saveBtnloading,
            postMsg: state.PartyDetailsReducer.postMsg,

            groupListLoading: state.GroupReducer.goBtnLoading,
            groupList: state.GroupReducer.groupList,

            employeeList: state.ManagementPartiesReducer.employeeList,

            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.PARTY_DETAILS
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id));
        dispatch(getClusterlist());
        dispatch(getGroupList());
        dispatch(getEmployeedropdownList())

        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        return () => {
            dispatch(GoButton_For_PartyDetails_Success([]));
        }
    }, []);

    useEffect(() => {

        fetchDistributorData(goBtnList)
    }, [goBtnList]);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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
    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(savePartyDetails_Success({ Status: false }))
            setTableData([]);
            setGroupSelect({ value: 0, label: "All" })
            if (pageMode === "other") {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
        }
        else if (postMsg.Status === true) {
            dispatch(savePartyDetails_Success({ Status: false }));
            setTableData([]);
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])




    async function fetchDistributorData(data) {

        try {
            setGoBtnLoading(true);

            const requests = data.map(async (distributor) => {

                const jsonBody = {
                    "Company": _cfunc.loginCompanyID(),
                    "Route": "",
                    "Type": 2,
                    "PartyID": distributor.PartyID
                };

                let subClusterResponse;

                if (distributor.Cluster_id !== null) {
                    subClusterResponse = await Get_Subcluster_On_cluster_API(distributor.Cluster_id);
                }

                const resp = await VendorSupplierCustomer(JSON.stringify(jsonBody));

                if (resp.StatusCode === 200) {
                    const employeeOptions = employeeList.map((index) => ({
                        value: index.id,
                        label: index.Name,
                    }));

                    const subClusterOptions = (subClusterResponse && subClusterResponse.Data) ?
                        subClusterResponse.Data.map((index) => ({
                            value: index.id,
                            label: index.Name,
                        })) : [];

                    const superstokiestOptions = resp.Data.map((index) => ({
                        value: index.id,
                        label: index.Name,
                    }));

                    return {
                        DistributorID: distributor.PartyID,
                        DistributorName: distributor.PartyName,
                        SuperstokiestID: distributor.Supplier_id,
                        SuperstokiestName: distributor.SupplierName,
                        clusterId: distributor.Cluster_id,
                        clusterName: distributor.ClusterName,
                        subClusterId: distributor.SubCluster_id || "",
                        subClusterName: distributor.SubClusterName || "Select...",
                        EmployeesOption: employeeOptions,
                        subClusterOptions: subClusterOptions,
                        SuperstokiestOptions: superstokiestOptions,
                        GMId: distributor.GM,
                        NHId: distributor.NH,
                        RHId: distributor.RH,
                        ASMId: distributor.ASM,
                        SEId: distributor.SE,
                        SOId: distributor.SO,
                        SRId: distributor.SR,
                        MTId: distributor.MT,

                    };
                } else {
                    customAlert({
                        Type: 3,
                        Message: `Error for distributor: ${distributor.PartyName}`,
                    });
                    return null;
                }
            });

            const innterTableData = await Promise.all(requests.filter(Boolean));

            setTableData(innterTableData);
        } catch (error) {
            _cfunc.CommonConsole("Error occurred in fetchDistributorData", error);
        } finally {
            setGoBtnLoading(false);
        }
    }









    const Cluster_Options = clusterDropdown.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const GroupList_Options = groupList.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    GroupList_Options.unshift({
        value: 0,
        label: "All"
    });

    const fetchSubClusterOptions = async (clusterID, row) => {
        try {
            const response = await Get_Subcluster_On_cluster_API(clusterID);
            if (response.StatusCode === 200) {

                row.subClusterOptions = response.Data.map(item => ({ value: item.id, label: item.Name }));
                setForceRefresh(i => !i)
            } else {
                customAlert({
                    Type: 3,
                    Message: `Error for Subcluster ID ${clusterID}:`,
                });
            }
        } catch (error) {
            _cfunc.CommonConsole(`Error for Subcluster ID ${clusterID}:`, error);
        }
    };

    const pagesListColumns = [
        {
            text: "Distributor",
            dataField: "DistributorName",
        },
        {
            text: "Superstokiest",
            dataField: "",

            formatter: (cell, row) => {

                return (
                    <Col style={{ width: "150px" }}>

                        <C_Select
                            defaultValue={(row.SuperstokiestID === null || row.SuperstokiestName === undefined) ? "" : { value: row.SuperstokiestID, label: row.SuperstokiestName }}
                            options={row.SuperstokiestOptions}
                            onChange={(e) => {
                                row.SuperstokiestID = e.value;
                                row.SuperstokiestName = e.label;
                            }}

                        >
                        </C_Select>
                    </Col >

                );
            },
        },
        {
            text: "Cluster",
            dataField: "",

            formatter: (cell, row, key,) => {
                return (
                    <Col style={{ width: "150px" }}>

                        <C_Select
                            id={`Cluster${key}`}
                            key={`Cluster${row.id}`}
                            defaultValue={(row.clusterId === null || row.clusterName === undefined) ? "" : { value: row.clusterId, label: row.clusterName }}
                            onChange={(e) => {
                                row.clusterId = e.value;
                                row.clusterName = e.label;
                                row.subClusterId = "";
                                row.subClusterName = "";
                                fetchSubClusterOptions(e.value, row);
                            }}
                            options={Cluster_Options}


                        >
                        </C_Select>
                    </Col>

                );
            },
        },
        {
            text: "Sub-Cluster",
            dataField: "",

            formatExtraData: { forceRefresh },
            formatter: (cell, row,) => {

                return (
                    <Col style={{ width: "150px" }}>
                        <C_Select
                            key={row.subClusterId}
                            value={(row.subClusterId === "" || row.subClusterName === undefined) ?
                                { value: "", label: "Select..." }
                                : { value: row.subClusterId, label: row.subClusterName }}
                            onChange={(e) => {
                                setForceRefresh(i => !i)
                                row.subClusterId = e.value;
                                row.subClusterName = e.label;
                            }}
                            options={row.subClusterOptions}

                        >
                        </C_Select >
                    </Col>
                );
            },
        },




        {
            text: "GM",
            dataField: "",

            formatExtraData: { forceRefreshGM },
            formatter: (cell, row,) => {

                return (
                    <Col style={{ width: "150px" }}>

                        <C_Select
                            key={row.GMId}
                            value={(row.GMId === "" || row.GMName === undefined) ?
                                { value: "", label: "Select..." }
                                : { value: row.GMId, label: row.GMName }}
                            onChange={(e) => {


                                row.GMId = e.value;
                                row.GMName = e.label;
                                setForceRefreshGM(i => !i)

                            }}
                            options={row.EmployeesOption}

                        >
                        </C_Select >
                    </Col>
                );
            },
        },
        {
            text: "NH",
            dataField: "",

            formatExtraData: { forceRefreshNH },
            formatter: (cell, row,) => {

                return (
                    <Col style={{ width: "150px" }}>

                        <C_Select
                            key={row.NHId}
                            value={(row.NHId === "" || row.NHName === undefined) ?
                                { value: "", label: "Select..." }
                                : { value: row.NHId, label: row.NHName }}
                            onChange={(e) => {
                                setForceRefreshNH(i => !i)
                                row.NHId = e.value;
                                row.NHName = e.label;
                            }}
                            options={row.EmployeesOption}

                        >
                        </C_Select >

                    </Col>
                );
            },
        },

        {
            text: "RH",
            dataField: "",

            formatExtraData: { forceRefreshRH },
            formatter: (cell, row,) => {

                return (
                    <Col style={{ width: "150px" }}>

                        <C_Select
                            key={row.RHId}
                            value={(row.RHId === "" || row.RHName === undefined) ?
                                { value: "", label: "Select..." }
                                : { value: row.RHId, label: row.RHName }}
                            onChange={(e) => {
                                setForceRefreshRH(i => !i)
                                row.RHId = e.value;
                                row.RHName = e.label;
                            }}
                            options={row.EmployeesOption}


                        >
                        </C_Select >
                    </Col>
                );
            },
        },

        {
            text: "ASM",
            dataField: "",

            formatExtraData: { forceRefreshASM },
            formatter: (cell, row,) => {

                return (
                    <Col style={{ width: "150px" }}>

                        <C_Select
                            key={row.ASMId}
                            value={(row.ASMId === "" || row.ASMName === undefined) ?
                                { value: "", label: "Select..." }
                                : { value: row.ASMId, label: row.ASMName }}
                            onChange={(e) => {
                                setForceRefreshASM(i => !i)
                                row.ASMId = e.value;
                                row.ASMName = e.label;
                            }}
                            options={row.EmployeesOption}

                        >
                        </C_Select >
                    </Col>
                );
            },
        }, {
            text: "SO",
            dataField: "",

            formatExtraData: { forceRefreshSO },
            formatter: (cell, row,) => {

                return (
                    <Col style={{ width: "150px" }}>

                        <C_Select
                            key={row.SOId}
                            value={(row.SOId === "" || row.SOName === undefined) ?
                                { value: "", label: "Select..." }
                                : { value: row.SOId, label: row.SOName }}
                            onChange={(e) => {
                                setForceRefreshSO(i => !i)
                                row.SOId = e.value;
                                row.SOName = e.label;
                            }}
                            options={row.EmployeesOption}

                        >
                        </C_Select >
                    </Col>

                );
            },
        }, {
            text: "SE",
            dataField: "",
            formatExtraData: { forceRefreshSE },

            formatter: (cell, row,) => {

                return (
                    <Col style={{ width: "150px" }}>

                        <C_Select
                            key={row.SEId}
                            value={(row.SEId === "" || row.SEName === undefined) ?
                                { value: "", label: "Select..." }
                                : { value: row.SEId, label: row.SEName }}
                            onChange={(e) => {
                                setForceRefreshSE(i => !i)
                                row.SEId = e.value;
                                row.SEName = e.label;
                            }}
                            options={row.EmployeesOption}

                        >
                        </C_Select >
                    </Col >

                );
            },
        }, {
            text: "SR",
            dataField: "",

            formatExtraData: { forceRefreshSR },
            formatter: (cell, row,) => {

                return (
                    <Col style={{ width: "150px" }}>

                        <C_Select
                            key={row.SRId}
                            value={(row.SRId === "" || row.SRName === undefined) ?
                                { value: "", label: "Select..." }
                                : { value: row.SRId, label: row.SRName }}
                            onChange={(e) => {
                                setForceRefreshSR(i => !i)
                                row.SRId = e.value;
                                row.SRName = e.label;
                            }}
                            options={row.EmployeesOption}

                        >
                        </C_Select >
                    </Col>
                );
            },
        },

        {
            text: "MT",
            dataField: "",
            formatExtraData: { forceRefreshMT },
            formatter: (cell, row) => {
                return (
                    <Col style={{ width: "150px" }}>
                        <C_Select
                            key={row.MTId}
                            value={(row.MTId === "" || row.MTName === undefined) ?
                                { value: "", label: "Select..." }
                                : { value: row.MTId, label: row.MTName }}
                            onChange={(e) => {
                                setForceRefreshMT(i => !i)
                                row.MTId = e.value;
                                row.MTName = e.label;
                            }}
                            options={row.EmployeesOption}
                        >
                        </C_Select >
                    </Col >
                );
            },
        }
    ];

    async function goButtonHandler() {
        dispatch(GoButton_For_PartyDetails({ employeeID: _cfunc.loginEmployeeID(), groupID: groupSelect.value }))
    }

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id
        try {

            const data = tableData.map((index) => (
                {
                    "Party": index.DistributorID,
                    "Group": (groupSelect.value === 0) ? null : groupSelect.value,
                    "Cluster": index.clusterId,
                    "SubCluster": index.subClusterId,
                    "Supplier": index.SuperstokiestID,
                    "GM": index.GMId,
                    "NH": index.NHId,
                    "RH": index.RHId,
                    "ASM": index.ASMId,
                    "SE": index.SEId,
                    "SO": index.SOId,
                    "SR": index.SRId,
                    "MT": index.MTId,

                }))

            const jsonBody = JSON.stringify(data)
            dispatch(savePartyDetails_Action({ jsonBody, btnId }));

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" >
                    <div className="px-2  mb-1 c_card_filter text-black" >
                        <div className="row" >

                            <Col sm={4} >
                                <FormGroup className="mb- row mt-3 mb-2" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "65px" }}>Group</Label>
                                    <Col sm="8">
                                        <C_Select
                                            name="groupSelect"
                                            value={groupSelect}
                                            isSearchable={true}
                                            isLoading={groupListLoading}
                                            className="react-dropdown"
                                            isDisabled={(tableData.length > 0) ? true : false}
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={GroupList_Options}
                                            onChange={(e) => { setGroupSelect(e) }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col sm="1" className="mt-3 mb-3">
                                {tableData.length === 0 ?
                                    <Go_Button
                                        loading={goBtnLoading}
                                        onClick={goButtonHandler}
                                    />
                                    :
                                    <Change_Button onClick={(e) => dispatch(GoButton_For_PartyDetails_Success([]))} />
                                }
                            </Col>
                        </div>
                    </div>

                    {/* <div style={{ overflowX: 'auto', minHeight: "45vh" }}> */}
                    <ToolkitProvider
                        keyField="PartyID"
                        data={tableData}
                        columns={pagesListColumns}
                        search
                    >
                        {toolkitProps => (
                            <React.Fragment>
                                <Row >
                                    <Col xl="12" style={{ overflowX: "auto" }}>
                                        <div className="table-responsive table">

                                            <BootstrapTable
                                                keyField="PartyID"
                                                id="table_Arrow"
                                                // classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Party Not available
                                                    </div>
                                                }
                                                onDataSizeChange={({ dataSize }) => {
                                                    dispatch(BreadcrumbShowCountlabel(`Count : ${dataSize}`))
                                                }}
                                                {...toolkitProps.baseProps}
                                            />
                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>
                                    </Col>
                                </Row>
                                {tableData.length > 0 ?
                                    <div className="row save1" style={{ paddingBottom: 'center' }}>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                        />
                                    </div>
                                    : null
                                }

                            </React.Fragment>
                        )}
                    </ToolkitProvider>
                    {/* </div> */}
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default PartyDetails



