import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import { mode, url } from "../../../routes";
import { loginPartyID, loginSelectedPartyID } from "../../../components/Common/CommonFunction";
import { PartyListforApproval_Action, PartyListforApproval_Success, editPartyID } from "../../../store/Administrator/PartyRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from '../../../components/Common/SearchBox/MySearch';
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
        const page_Id = pageId.RETAILER_APPROVAL
        dispatch(commonPageFieldListSuccess(null));
        dispatch(commonPageFieldList(page_Id));
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
                pathname: url.RETAILER_MASTER,
                pageMode: mode.edit,
                editValue: editData.Data,
                IsMobileRetailer: true
            })
        }
    }, [editData])

    const goButtonHandler = () => {
        try {
            const jsonBody = JSON.stringify({
                PartyID: loginSelectedPartyID()
            });

            dispatch(PartyListforApproval_Action(jsonBody));
        } catch (error) { }
        return
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
        // {
        //     text: "GSTIN",
        //     dataField: "GSTIN",
        // },
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
                    {/* <div className="table-container"> */}
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
                        {mySearchProps(toolkitProps.searchProps)}
                        {/* </div> */}
                    </SimpleBar>


                </React.Fragment>
            )}
        </ToolkitProvider>
    )
}

export default MobileRetailerApprove;
