import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup } from "reactstrap";
import { useHistory } from "react-router-dom";
import { PageLoadingSpinner, SaveButton, } from "../../../components/Common/CommonButton";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../../routes/index"
import { MetaTags } from "react-meta-tags";
import {
    BreadcrumbShowCountlabel,
    GetVender,
    GetVenderSuccess,
    commonPageField,
    commonPageFieldSuccess,
} from "../../../store/actions";
import { C_Select } from "../../../CustomValidateForm";
import {
    ItemSupplierList_Action,
    ItemSupplierList_Success,
    ItemWiseUpdate_Save_Action,
    ItemWiseUpdate_Save_Success
} from "../../../store/Administrator/ItemWiseUpdateRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import GlobalCustomTable from "../../../GlobalCustomTable"
import { sideBarPageFiltersInfoAction } from "../../../store/Utilites/PartyDrodown/action";
import Select from "react-select"

const ItemSupplierAssign = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [SelectFieldName] = useState({ label: "Supplier", DataType: "dropdown" });
    const [forceRefresh, setForceRefresh] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [selectFieldNameDropOptions, setSelectFieldNameDropOptions] = useState([]);

    const { userAccess,
        goBtnLoading,
        goButtonData = [],
        postMsg,
        saveBtnloading,
        SupplierList,
        SupplierDroploading,
        pageField
    } = useSelector(
        (state) => ({
            SupplierList: state.CommonAPI_Reducer.vender,
            SupplierDroploading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
            goBtnLoading: state.ItemWiseUpdateReducer.loading,
            goButtonData: state.ItemWiseUpdateReducer.itemSupplierList,

            postMsg: state.ItemWiseUpdateReducer.postMsg,
            saveBtnloading: state.ItemWiseUpdateReducer.saveBtnloading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );

    // Featch Modules List data  First Rendering
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
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    // sideBar Page Filters Information
    useEffect(() => {

        dispatch(sideBarPageFiltersInfoAction([
            { label: "Select Field", content: SelectFieldName.label, },
        ]));

    }, [SelectFieldName]);

    // Select Dropdown GeneralMasterSubType api call
    useEffect(() => {

        dispatch(GetVender({ "PartyID": _cfunc.loginSelectedPartyID(), "Type": 6 }));
        dispatch(ItemSupplierList_Action())
        return () => {
            dispatch(GetVenderSuccess([]));
        }
    }, []);

    useEffect(() => {
        if (SupplierList.length > 0 && SelectFieldName.label === "Supplier") {
            setSelectFieldNameDropOptions(createAndSortDropdownOptions(SupplierList, 'id', 'Name'))
        }
    }, [SelectFieldName, SupplierList])

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.ITEM_MASTER_BULK_UPDATE));

        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(ItemSupplierList_Success([]));
        }
    }, [])

    useEffect(() => {

        if (goButtonData.length > 0) {
            setTableData(goButtonData);
        }
    }, [goButtonData])

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(ItemWiseUpdate_Save_Success({ Status: false }));
            dispatch(ItemSupplierList_Action())
            customAlert({
                Type: 1,
                Message: postMsg.Message,
            })
        }
        else if (postMsg.Status === true) {
            dispatch(ItemWiseUpdate_Save_Success({ Status: false }));
            dispatch(ItemSupplierList_Success([]));
            setTableData([])
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    const AllDropdownHandler = (event, row) => {

        if (SelectFieldName.label === "Supplier") {
            SupplierHandler(event, row)
        }
        return [];
    };

    const SupplierHandler = async (supplierID, row) => {
        
        row.Newvalue = supplierID
        setForceRefresh(i => !i)
    };

    const createAndSortDropdownOptions = (list, valueKey = 'id', labelKey = 'Name') => {
        return list
            .map(item => ({ value: item[valueKey], label: item[labelKey] }))
            .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
    };

    //  function to create the Newvalue column
    const createNewValueColumn = () => {
        return {
            text: `New ${SelectFieldName.label === undefined ? "Value" : SelectFieldName.label}`,
            dataField: "Newvalue",
            formatExtraData: { forceRefresh, dropdownOptions: selectFieldNameDropOptions, tableData: tableData },
            headerStyle: () => {
                return { width: '40%', textAlign: 'center' };
            },
            formatter: (cellContent, row, key, { dropdownOptions, tableData }) => {

                const defaultSelected = row.SupplierDetails
                    .filter(data => data.SupplierId !== null)
                    .map(data => ({
                        value: data.SupplierId,
                        label: data.SupplierName
                    }));

                return (
                    <>
                        <div >
                            <Col>
                                <FormGroup>
                                    <Select
                                        key={row.Newvalue}
                                        defaultValue={defaultSelected}
                                        value={row.Newvalue}
                                        isMulti={true}
                                        options={dropdownOptions}
                                        onChange={(event) => AllDropdownHandler(event, row, tableData)}
                                    />
                                </FormGroup>
                            </Col>
                        </div>
                    </>
                );
            }
        };
    };

    const pagesListColumns = [
        {
            text: "Group",
            dataField: "GroupName",
        },
        {
            text: "SubGroup",
            dataField: "SubGroupName",
        },
        {
            text: "Name",
            dataField: "ItemName",
            sort: true
        },
    ];

    pagesListColumns.push(createNewValueColumn());

    const SaveHandler = (event) => {

        event.preventDefault();

        try {

            let updatedData = [];
            tableData.forEach(item => {
                const hasNewvalue = item?.Newvalue;
                const hasSupplierDetails = item?.SupplierDetails && item.SupplierDetails.length > 0;

                // Case 1: Process Newvalue if available
                if (hasNewvalue) {
                    item.Newvalue.forEach(supplier => {
                        updatedData.push({
                            Item: item.ItemID,
                            Supplier: supplier.value
                        });
                    });
                }
                // Case 2: Process SupplierDetails if Newvalue is not available
                else if (hasSupplierDetails) {
                    item.SupplierDetails.forEach(supplier => {
                        updatedData.push({
                            Item: item.ItemID,
                            Supplier: supplier.SupplierId
                        });
                    });
                }
            });

            // Log or dispatch the updated data
            if (updatedData.length === 0) {
                customAlert({
                    Type: 3,
                    Message: "Update at least one field is required."
                });
            } else {
                const jsonBody = JSON.stringify(updatedData);
                dispatch(ItemWiseUpdate_Save_Action({ jsonBody, subPageMode: url.ITEM_SUPPLIER_ASSIGN }));
            }

        } catch (e) { }
    };

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(goBtnLoading || SupplierDroploading)} />
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <form noValidate>

                    <GlobalCustomTable
                        keyField="id"
                        data={tableData}
                        columns={pagesListColumns}
                        classes={"custom-table"}
                        defaultSorted={[
                            {
                                dataField: "ItemName",
                                order: "asc",
                            },
                        ]}
                        noDataIndication={
                            <div className="text-danger text-center ">
                                Record Not available
                            </div>
                        }
                        onDataSizeChange={({ dataCount }) => {
                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                        }}
                    />

                    {tableData.length > 0 &&
                        <SaveButtonDraggable>
                            <SaveButton pageMode={pageMode}
                                loading={saveBtnloading}
                                onClick={SaveHandler}
                                userAcc={userPageAccessState}
                                module={"PartyMasterBulkUpdate"}
                            />
                        </SaveButtonDraggable>
                    }
                </form>
            </div>

        </React.Fragment >
    )
}

export default ItemSupplierAssign;