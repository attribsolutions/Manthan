import React, { useEffect, useState, } from "react";
import {
    Container,
    Input,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageFieldSuccess } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import { PageLoadingSpinner, SaveButton } from "../../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    metaTagLabel,
    loginCompanyID,
    loginPartyID,
} from "../../../../components/Common/CommonFunction";
import { url, pageId, mode } from "../../../../routes/index";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { C_Select } from "../../../../CustomValidateForm";
import { GenralMasterSubType } from "../../../../helpers/backend_helper";
import { SPos_MachineTypeList_Action, SPos_MachineTypeList_Success, SPos_MachineTypeSave_Action, SPos_MachineTypeSave_Success } from "../../../../store/SweetPOSStore/Administrator/MachineTypeMasterRedux/action";
import SaveButtonDraggable from "../../../../components/Common/saveButtonDraggable";
import GlobalCustomTable from "../../../../GlobalCustomTable";

const MachineTypeMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [pageMode] = useState(mode.defaultsave);
    const [machineTypeOptions, setMachineTypeOptions] = useState([]);
    const [userPageAccessState, setUserAccState] = useState('');

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        userAccess,
        saveBtnloading,
        listBtnLoading,
        tableListData
    } = useSelector((state) => ({
        saveBtnloading: state.SPos_MachineType_Reducer.saveBtnloading,
        tableListData: state.SPos_MachineType_Reducer.SPosMachineTypeListData,
        listBtnLoading: state.SPos_MachineType_Reducer.listBtnLoading,
        postMsg: state.SPos_MachineType_Reducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    useEffect(() => {
        const page_Id = pageId.SWEET_POS_MACHINE_MASTER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(SPos_MachineTypeList_Action({ "Party": loginPartyID() }))
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    // userAccess useEffect
    useEffect(() => {

        let userAcc = null;
        let locationPath;

        if (props.pageMode === mode.dropdownAdd) {
            locationPath = props.masterPath;
        } else {
            locationPath = location.pathname;
        }

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc);
            if (!props.isdropdown) {
                breadcrumbReturnFunc({ dispatch, userAcc });
            }
        };

    }, [userAccess])

    useEffect(async () => {

        const jsonBody = {
            Company: loginCompanyID(),
            TypeID: 179
        };
        const response = await GenralMasterSubType(jsonBody)

        setMachineTypeOptions(response.Data.map((index) => ({
            value: index.id,
            label: index.Name,
        })))
    }, [])

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`Count:${tableListData.length}`));
    }, [tableListData])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SPos_MachineTypeSave_Success({ Status: false }));
            dispatch(SPos_MachineTypeList_Success([]));

            if (pageMode === "other") {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.SWEET_POS_MACHINE_MASTER
                })

                dispatch(SPos_MachineTypeList_Action({ "Party": loginPartyID() }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(SPos_MachineTypeSave_Success({ Status: false }))
            dispatch(SPos_MachineTypeList_Success([]));
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    const pagesListColumns = [
        {
            text: "MacID",
            dataField: "MacID",
        },
        {
            text: "Machine Type",
            dataField: "",
            formatExtraData: { machineTypeOptions: machineTypeOptions },
            formatter: (value, row, key, { machineTypeOptions }) => {
                return (
                    <div style={{ minWidth: "290px" }}>
                        <C_Select
                            defaultValue={!(row.MachineTypeDetails.length > 0) ? "" :
                                row?.MachineTypeDetails?.map((index) => ({
                                    value: index.id,
                                    label: index.MachineTypeName,
                                }))}

                            options={machineTypeOptions}
                            isMulti={true}
                            onChange={e => {
                                row["MachineTypeDetails"] = e.map((index) => ({
                                    id: index.value,
                                    MachineTypeName: index.label,
                                }));

                            }}
                        >
                        </C_Select >
                    </div>

                )
            },
        },
        {
            text: "IsServer",
            dataField: "IsServer",
            style: () => ({ width: "30%" }),
            formatter: (value, row, key,) => {

                return (
                    <Input type="checkbox" className="form-check-input"
                        defaultChecked={row.IsServer}
                        name="IsServer"
                        onChange={(e) => {
                            row.IsServer = e.target.checked;
                        }}
                    />
                )
            },
        },
        {
            text: "ClientID",
            dataField: "ClientID",
        },
        {
            text: "MachineRole",
            dataField: "MachineRole",
        },
        {
            text: "IsAutoUpdate",
            dataField: "IsAutoUpdate",
        },
        {
            text: "IsGiveUpdate",
            dataField: "IsGiveUpdate",
        },
        {
            text: "IsService",
            dataField: "IsService",
        },
        {
            text: "MachineName",
            dataField: "MachineName",
        },
        {
            text: "ServerSequence",
            dataField: "ServerSequence",
        },
        {
            text: "UploadSaleRecordCount",
            dataField: "UploadSaleRecordCount",
        },
        {
            text: "Validity",
            dataField: "Validity",
        },
        {
            text: "Version",
            dataField: "Version",
        },
    ];

    const SaveHandler = async (event) => {
        event.preventDefault();

        try {
            const jsonBody = JSON.stringify(tableListData.map((i) => ({
                "MacID": i.MacID,
                "MachineType": i.MachineTypeDetails.map(i => i.id).join(','),
                "IsServer": i.IsServer,
                "Party": loginPartyID(),
                "ClientID": i.ClientID,
            })))

            dispatch(SPos_MachineTypeSave_Action({ jsonBody }));

        } catch (e) { }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" >
                    <PageLoadingSpinner isLoading={(listBtnLoading)} />
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>


                        <GlobalCustomTable
                            keyField="id"
                            data={tableListData}
                            columns={pagesListColumns}
                            paginationEnabled={200}//show pagination 200 per page
                            classes={"custom-table"}
                            noDataIndication={
                                <div className="text-danger text-center ">
                                    Record Not available
                                </div>
                            }
                            onDataSizeChange={({ dataCount }) => {

                                dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                            }}
                        />

                        {/* <div className="mb-4">
                            <ToolkitProvider
                                keyField="id"
                                data={tableListData}
                                columns={pagesListColumns}
                                search
                            >
                                {toolkitProps => (
                                    <React.Fragment>
                                        <div className="table-responsive table mb-6">
                                            <GlobalCustomTable
                                                keyField="id"
                                                id="table_Arrow"
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Party Not available
                                                    </div>
                                                }
                                                onDataSizeChange={({ dataSize }) => {
                                                    dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
                                                }}
                                                {...toolkitProps.baseProps}
                                            />
                                            {globalTableSearchProps(toolkitProps.searchProps)}
                                        </div>

                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        </div> */}

                        {tableListData.length > 0 &&
                            <SaveButtonDraggable>
                                <SaveButton pageMode={pageMode}
                                    loading={saveBtnloading}
                                    onClick={SaveHandler}
                                    userAcc={userPageAccessState}
                                />
                            </SaveButtonDraggable>
                        }
                    </Container>
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

export default MachineTypeMaster
