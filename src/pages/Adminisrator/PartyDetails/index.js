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
import paginationFactory from "react-bootstrap-table2-paginator";
import SimpleBar from "simplebar-react"

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
    const [forceRefreshSuperstokiest, setforceRefreshSuperstokiest] = useState(false);







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
            goButtonHandler()
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



                let subClusterResponse;

                if (distributor.Cluster_id !== null) {
                    subClusterResponse = await Get_Subcluster_On_cluster_API(distributor.Cluster_id);
                }


                const employeeOptions = employeeList.map((index) => ({
                    value: index.id,
                    label: index.Name,
                }));

                const subClusterOptions = (subClusterResponse && subClusterResponse.Data) ?
                    subClusterResponse.Data.map((index) => ({
                        value: index.id,
                        label: index.Name,
                    })) : [];

                const superstokiestOptions = distributor.Supplier.map((index) => ({
                    value: index.Supplier_id,
                    label: index.SupplierName,
                }));

                const objectWithIdZero = distributor.Supplier.find(item => item.seletedSupplier === 1);
                let Supplier_id = ""
                let SupplierName = "Select..."
                if (objectWithIdZero) {
                    Supplier_id = objectWithIdZero.Supplier_id
                    SupplierName = objectWithIdZero.SupplierName
                } else {
                    Supplier_id = ""
                    SupplierName = "Select..."
                }

                return {
                    DistributorID: distributor.PartyID,
                    DistributorName: distributor.PartyName,
                    SuperstokiestID: Supplier_id,
                    SuperstokiestName: SupplierName,
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
            formatExtraData: { forceRefreshSuperstokiest },


            formatter: (cell, row) => {

                return (
                    <Col style={{ width: "150px" }}>

                        <C_Select
                            value={(row.SuperstokiestID === null || row.SuperstokiestName === undefined) ? "" : { value: row.SuperstokiestID, label: row.SuperstokiestName }}
                            options={row.SuperstokiestOptions}
                            onChange={(e) => {
                                setforceRefreshSuperstokiest(i => !i)
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
            formatExtraData: { forceRefresh },


            formatter: (cell, row, key,) => {

                return (
                    <Col style={{ width: "150px" }}>

                        <C_Select
                            id={`Cluster${key}`}
                            key={`Cluster${row.id}`}
                            styles={{ menu: (provided) => ({ ...provided, zIndex: 2, position: "absolute" }) }}
                            value={(row.clusterId === null || row.clusterName === undefined) ? "" : { value: row.clusterId, label: row.clusterName }}
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
            formatter: (cell, row, key) => {

                return (
                    <Col style={{ width: "200px" }}>

                        <C_Select
                            // id={`GM_${key}`}
                            key={row.GMId}
                            isMulti={true}
                            value={(row.GMId?.length === 0) ?
                                []
                                : row.GMId}
                            onChange={(e = []) => {
                                e = e.filter(i => !(i.value === ''))
                                row.GMId = e
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
            text: "NSM",
            dataField: "",

            formatExtraData: { forceRefreshNH },
            formatter: (cell, row,) => {

                return (
                    <Col style={{ width: "200px" }}>

                        <C_Select
                            key={row.NHId}
                            isMulti={true}

                            value={(row.NHId?.length === 0) ?
                                []
                                : row.NHId}
                            onChange={(e) => {
                                e = e.filter(i => !(i.value === ''))
                                row.NHId = e
                                setForceRefreshNH(i => !i)
                            }}
                            options={row.EmployeesOption}

                        >
                        </C_Select >

                    </Col>
                );
            },
        },

        {
            text: "RSM",
            dataField: "",

            formatExtraData: { forceRefreshRH },
            formatter: (cell, row,) => {

                return (
                    <Col style={{ width: "200px" }}>

                        <C_Select
                            key={row.RHId}
                            isMulti={true}

                            value={(row.RHId?.length === 0) ?
                                []
                                : row.RHId}
                            onChange={(e) => {
                                e = e.filter(i => !(i.value === ''))
                                row.RHId = e
                                setForceRefreshRH(i => !i)

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
                    <Col style={{ width: "200px" }}>

                        <C_Select
                            key={row.ASMId}
                            isMulti={true}

                            value={(row.ASMId?.length === 0) ?
                                []
                                : row.ASMId}
                            onChange={(e) => {
                                e = e.filter(i => !(i.value === ''))
                                row.ASMId = e
                                setForceRefreshASM(i => !i)

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
                    <Col style={{ width: "200px" }}>

                        <C_Select
                            key={row.SEId}
                            isMulti={true}

                            value={(row.SEId?.length === 0) ?
                                []
                                : row.SEId}
                            onChange={(e) => {
                                e = e.filter(i => !(i.value === ''))
                                row.SEId = e
                                setForceRefreshSE(i => !i)

                            }}
                            options={row.EmployeesOption}

                        >
                        </C_Select >
                    </Col >

                );
            },
        },
        {
            text: "SO",
            dataField: "",

            formatExtraData: { forceRefreshSO },
            formatter: (cell, row,) => {

                return (
                    <Col style={{ width: "200px" }}>

                        <C_Select
                            key={row.SOId}
                            isMulti={true}

                            value={(row.SOId?.length === 0) ?
                                []
                                : row.SOId}
                            onChange={(e) => {
                                e = e.filter(i => !(i.value === ''))
                                row.SOId = e
                                setForceRefreshSO(i => !i)
                            }}
                            options={row.EmployeesOption}

                        >
                        </C_Select >
                    </Col>

                );
            },
        },

        {
            text: "SR",
            dataField: "",

            formatExtraData: { forceRefreshSR },
            formatter: (cell, row,) => {

                return (
                    <Col style={{ width: "200px" }}>

                        <C_Select
                            key={row.SRId}
                            isMulti={true}

                            value={(row.SRId?.length === 0) ?
                                []
                                : row.SRId}
                            onChange={(e) => {
                                e = e.filter(i => !(i.value === ''))
                                row.SRId = e
                                setForceRefreshSR(i => !i)

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
            formatter: (cell, row, key) => {

                return (
                    <Col style={{ width: "200px" }}>
                        <C_Select
                            id={`MT_${key}`}
                            key={row.key}
                            isMulti={true}

                            value={(row.MTId?.length === 0) ?
                                []
                                : row.MTId}
                            onChange={(e) => {
                                e = e.filter(i => !(i.value === ''))
                                row.MTId = e
                                setForceRefreshMT(i => !i)

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

            const convertToArrayComaseprateID = (ArrayID = []) => {
                debugger
                let result = { "Id": [], "CommaSeprateID": null };
                if ((ArrayID !== null) && (Array.isArray(ArrayID)) && ((ArrayID.length > 0))) {
                    ArrayID.forEach(item => {
                        result["Id"].push(item.value); // Push id into the corresponding label array
                    });
                    result["CommaSeprateID"] = result.Id.join(', ')

                } else {
                    result["CommaSeprateID"] = null;
                }

                return result.CommaSeprateID
            }

            const data = tableData.map((index) => (

                {
                    "Party": index.DistributorID,
                    "Group": (groupSelect.value === 0) ? null : groupSelect.value,
                    "Cluster": index.clusterId,
                    "SubCluster": index.subClusterId,
                    "Supplier": index.SuperstokiestID,
                    "GM": convertToArrayComaseprateID(index.GMId),
                    "NH": convertToArrayComaseprateID(index.NHId),
                    "RH": convertToArrayComaseprateID(index.RHId),
                    "ASM": convertToArrayComaseprateID(index.ASMId),
                    "SE": convertToArrayComaseprateID(index.SEId),
                    "SO": convertToArrayComaseprateID(index.SOId),
                    "SR": convertToArrayComaseprateID(index.SRId),
                    "MT": convertToArrayComaseprateID(index.MTId),

                }
            ))

            const jsonBody = JSON.stringify(data)
            dispatch(savePartyDetails_Action({ jsonBody, btnId }));

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    const paginationOptions = {
        sizePerPage: 6, // Number of rows per page
        hideSizePerPage: true, // Hide the size per page dropdown
        hidePageListOnlyOnePage: true, // Hide the pagination list when there's only one page
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

                    <div className="" >
                        <ToolkitProvider
                            keyField="PartyID"
                            data={tableData}
                            columns={pagesListColumns}
                            search
                        >
                            {(toolkitProps) => (
                                <React.Fragment>
                                    <SimpleBar style={{ maxHeight: "70vh" }}  >
                                        <div style={{ minHeight: "70vh" }} >

                                            <BootstrapTable

                                                keyField="PartyID"
                                                id="table_Arrow"
                                                noDataIndication={<div className="text-danger text-center">Party Not available</div>}
                                                onDataSizeChange={({ dataSize }) => {
                                                    dispatch(BreadcrumbShowCountlabel(`Count : ${dataSize}`));
                                                }}
                                                pagination={paginationFactory(paginationOptions)} // Add pagination options
                                                {...toolkitProps.baseProps}
                                            />
                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>
                                    </SimpleBar >

                                </React.Fragment>
                            )}
                        </ToolkitProvider>
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


























