import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mode, url } from "../../../routes";
import { PartyListforApproval_Action, PartyListforApproval_Success, editPartyID } from "../../../store/Administrator/PartyRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from '../../../components/Common/SearchBox/MySearch';
import { Button, Spinner } from "reactstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SimpleBar from "simplebar-react"

const MobileRetailerApprove = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const reducers = useSelector(
        (state) => ({
            goBtnLoading: state.PartyMasterReducer.goBtnLoading,
            listBtnLoading: state.PartyMasterReducer.listBtnLoading,
            tableList: state.PartyMasterReducer.PartyListForApproval,
            RetailerApprovalID: state.PartyMasterReducer.PartyListForApproval_ID,
            editData: state.PartyMasterReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
        })
    );

    const { goBtnLoading, tableList, editData, commonPartyDropSelect } = reducers;

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            goButtonHandler();
        }
        return () => {
            dispatch(PartyListforApproval_Success([]));
        }
    }, [commonPartyDropSelect]);

    useEffect(() => {

        if (editData.Status === true && editData.StatusCode === 200) {
            history.push({
                pathname: url.FRANCHISE_PARTY_MASTER,
                pageMode: mode.edit,
                editValue: editData.Data,
                IsMobileRetailer: true,
                Redirect_From: url.DASHBORD_1
            })
        }
    }, [editData])

    const goButtonHandler = () => {
        try {
            const jsonBody = JSON.stringify({
                PartyID: commonPartyDropSelect.value
            });
            dispatch(PartyListforApproval_Action(jsonBody));
        } catch (error) { }
    };

    const makeBtnFunc = (list = {}) => {
        var { id } = list
        try {
            dispatch(editPartyID({ btnId: `btn-edit-${id}`, btnmode: mode.edit, editId: id }))
        } catch (e) { }
    }

    const pagesListColumns = [
        {
            text: "Name",
            dataField: "Name",
        },
        {
            text: "PAN",
            dataField: "PAN",
        },
        {
            text: "Email",
            dataField: "Email",
        },
        {
            text: "MobileNo",
            dataField: "MobileNo",
        },
        {
            text: "Action",
            dataField: "",
            formatExtraData: { listBtnLoading: goBtnLoading, },
            formatter: (cellContent, rowData, key, formatExtra) => {

                let { goBtnLoading } = formatExtra;
                return (<>
                    < Button
                        type="button"
                        id={`btn-makeBtn-${rowData.id}`}
                        className="badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light "
                        title="Retailer Approve"
                        disabled={goBtnLoading}
                        onClick={() => {
                            const btnId = `btn-makeBtn-${rowData.id}`
                            makeBtnFunc(rowData, btnId)
                        }}
                    >
                        {(goBtnLoading === `btn-makeBtn-${rowData.id}`) ?
                            <Spinner style={{ height: "16px", width: "16px" }} color="white" />
                            : <span
                                style={{ marginLeft: "6px", marginRight: "6px" }}
                                className=" fas fa-file-invoice"
                            ></span>
                        }
                    </Button>
                </>)
            }
        },
    ];

    return (
        <ToolkitProvider
            keyField="id"
            data={tableList}
            columns={pagesListColumns}
            search
        >
            {toolkitProps => (
                <React.Fragment>
                    <SimpleBar className="" style={{ maxHeight: "352px" }}>
                        <BootstrapTable
                            keyField={"Invoice"}
                            bordered={true}
                            striped={false}
                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                            classes={"table align-middle table-nowrap table-hover"}
                            headerWrapperClasses={"thead-light"}

                            {...toolkitProps.baseProps}

                        />
                        {globalTableSearchProps(toolkitProps.searchProps)}
                    </SimpleBar>
                </React.Fragment>
            )}
        </ToolkitProvider>
    )
}

export default MobileRetailerApprove;
