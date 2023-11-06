import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Label,
    Row,
} from "reactstrap";

import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess, getGroupList } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
} from "../../../components/Common/validationFunction";
import { Change_Button, Go_Button, SaveButton, } from "../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, metaTagLabel, } from "../../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../../routes/index"
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { C_Select } from "../../../CustomValidateForm";
import { Get_Subcluster_On_cluster_API, VendorSupplierCustomer } from "../../../helpers/backend_helper";
import { getClusterlist } from "../../../store/Administrator/ClusterRedux/action";
import { GoButton_For_PartyDetails, GoButton_For_PartyDetails_Success, savePartyDetails_Action, savePartyDetails_Success } from "../../../store/Administrator/PartyDetailsRedux/action";

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
    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const [tableData, setTableData] = useState([]);
    const [forceRefresh, setForceRefresh] = useState(false);

    const [groupSelect, setGroupSelect] = useState({ value: 0, label: "All" });
    const [goBtnLoading, setGoBtnLoading] = useState(false);

    const {
        goBtnList,
        saveBtnloading,
        postMsg,
        pageField,
        clusterDropdown,
        groupList,
        groupListLoading,
        userAccess } = useSelector((state) => ({
            goBtnList: state.PartyDetailsReducer.goBtnList,

            clusterDropdown: state.ClusterReducer.ClusterListData,

            saveBtnloading: state.PartyDetailsReducer.saveBtnloading,
            postMsg: state.PartyDetailsReducer.postMsg,

            groupListLoading: state.GroupReducer.goBtnLoading,
            groupList: state.GroupReducer.groupList,

            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.PARTY_DETAILS
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id));
        dispatch(getClusterlist());
        dispatch(getGroupList());
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

        let innterTableData = []

        const jsonBody = {
            "Company": _cfunc.loginCompanyID(),
            "Route": "",
            "Type": 2,
        };
        setGoBtnLoading(true);
        for (const distributor of data) {
            jsonBody.PartyID = distributor.PartyID;

            try {

                let subClusterResponse
                const resp = await VendorSupplierCustomer(JSON.stringify(jsonBody));

                if (!(distributor.Cluster_id === null)) {
                    subClusterResponse = await Get_Subcluster_On_cluster_API(distributor.Cluster_id);
                }
                if (resp.StatusCode === 200) {

                    innterTableData.push({
                        DistributorID: distributor.PartyID,
                        DistributorName: distributor.PartyName,

                        SuperstokiestID: distributor.Supplier_id,
                        SuperstokiestName: distributor.SupplierName,

                        clusterId: distributor.Cluster_id,
                        clusterName: distributor.ClusterName,

                        subClusterId: distributor.SubCluster_id === null ? "" : distributor.SubCluster_id,
                        subClusterName: distributor.SubClusterName === null ? "Select..." : distributor.SubClusterName,

                        subClusterOptions: (subClusterResponse === undefined) ? [] : subClusterResponse.Data.map((index) => ({
                            value: index.id,
                            label: index.Name,
                        })),

                        SuperstokiestOptions: resp.Data.map((index) => ({
                            value: index.id,
                            label: index.Name,
                        }))
                    })

                } else {
                    customAlert({
                        Type: 1,
                        Message: `Error for distributor :${distributor.PartyName}`,
                    });
                }

            } catch (error) {
                _cfunc.CommonConsole(`Error for distributor :${distributor.PartyName}}`, error);
            }
        }
        setGoBtnLoading(false);
        setTableData(innterTableData)
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
                    Type: 1,
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
            style: () => ({ width: "20%" }),
        },
        {
            text: "Superstokiest",
            dataField: "",
            style: () => ({ width: "20%" }),
            formatter: (cell, row) => {
                return (
                    <C_Select
                        defaultValue={(row.SuperstokiestID === null || row.SuperstokiestName === undefined) ? "" : { value: row.SuperstokiestID, label: row.SuperstokiestName }}
                        options={row.SuperstokiestOptions}
                        onChange={(e) => {
                            row.SuperstokiestID = e.value;
                            row.SuperstokiestName = e.label;
                        }}
                        styles={{
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 10,
                                overflowY: "auto", // Add a scrollbar if the content exceeds the height
                            }),
                        }}
                    >
                    </C_Select>
                );
            },
        },
        {
            text: "Cluster",
            dataField: "",
            style: () => ({ width: "20%" }),
            formatter: (cell, row, key,) => {
                return (
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

                        styles={{
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 10,
                                overflowY: "auto", // Add a scrollbar if the content exceeds the height
                            }),
                        }}
                    >
                    </C_Select>
                );
            },
        },
        {
            text: "Sub-Cluster",
            dataField: "",
            style: () => ({ width: "20%" }),
            formatExtraData: { forceRefresh },
            formatter: (cell, row,) => {

                return (
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
                        styles={{
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 10,
                                overflowY: "auto", // Add a scrollbar if the content exceeds the height
                            }),
                        }}
                    >
                    </C_Select >
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

            const data = tableData.map((index) => ({
                "Party": index.DistributorID,
                "Group": (groupSelect.value === 0) ? null : groupSelect.value,
                "Cluster": index.clusterId,
                "SubCluster": index.subClusterId,
                "Supplier": index.SuperstokiestID,
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
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
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

                    <div style={{ minHeight: "45vh" }}>

                        <ToolkitProvider
                            keyField="PartyID"
                            data={tableData}
                            columns={pagesListColumns}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <div className="table-responsive table" style={{ minHeight: "55vh" }}>
                                        <BootstrapTable
                                            keyField="PartyID"
                                            id="table_Arrow"
                                            classes={"table  table-bordered table-hover"}
                                            noDataIndication={
                                                <div className="text-danger text-center ">
                                                    Party Not available
                                                </div>
                                            }
                                            onDataSizeChange={(e) => {
                                                _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                            }}
                                            {...toolkitProps.baseProps}
                                        />
                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>

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

                    </div>


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

