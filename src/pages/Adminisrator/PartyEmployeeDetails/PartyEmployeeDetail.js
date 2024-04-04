
import React, { useEffect, useMemo, useState } from "react";

import { MetaTags } from "react-meta-tags";
import {
    BreadcrumbShowCountlabel,
    commonPageField,
    commonPageFieldSuccess,


} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
} from "../../../components/Common/validationFunction";
import {
    breadcrumbReturnFunc,
    loginEmployeeID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../routes/index";
import { getPartyEmployeeDetails, getPartyEmployeeDetails_API_Success } from "../../../store/Administrator/PartyEmployeeDetailsRedux/action";
import GlobalCustomTable from "../../../GlobalCustomTable";
import { hideBtnCss } from "../../../components/Common/ListActionsButtons";
import { C_Button } from "../../../components/Common/CommonButton";
import paginationFactory, { PaginationProvider, PaginationTotalStandalone } from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import _debounce from 'lodash/debounce';



const PartyEmployeeDetails = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        ItemName: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState('');
    const [searchText, setSearchText] = useState('');





    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        pageField,
        PartyEmployeeDetails,
        userAccess } = useSelector((state) => ({
            PartyEmployeeDetails: state.PartyEmployeeDetailsReducer.PartyEmployeeDetails,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));


    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)




    useEffect(() => {
        const page_Id = pageId.PARTY_EMPLOYEE_DETAILS
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyEmployeeDetails({ EmployeeId: loginEmployeeID() }))
    }, []);



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

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])



    const pagesListColumns = [
        {
            text: "Sr No",
            dataField: "id",

        },
        {
            text: "Party Details",
            dataField: "PartyName",
            formatter: (cellContent, index) => {
                return (
                    <>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Full Name:</span> {index.PartyName}
                        </div>

                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Login Name:</span> {index.LoginName}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Party Type:</span> {index.PartyType}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Party Id:</span> {index.PartyID}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Sap Code:</span> {index.SAPPartyCode}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Party Email:</span> {index.PartyEmail}

                        </div> <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Mobile No:</span> {index.MobileNo}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Alternate Contact No:</span> {index.AlternateContactNo}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>DOB:</span> {index.DOB}
                        </div>

                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>PAN:</span> {index.PartyPAN}
                        </div>

                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Aadhar No:</span> {index.AadharNo}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Status:</span> {index.Status === "Active" ?
                                <span style={{ color: "green", fontWeight: "bold" }}>{index.Status}</span> :
                                <span style={{ color: "red", fontWeight: "bold" }}> {index.Status}</span>}
                        </div>

                    </>
                );
            }
        },
        {
            text: "Party Address Details",
            dataField: "PartyAddress",
            formatter: (cellContent, index) => {
                return (
                    <>
                        <div style={{ width: "auto" }}>
                            <span style={{ fontWeight: "bold" }}>Address:</span> {index.PartyAddress}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>State:</span> {index.PartyState}
                        </div> <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>District:</span> {index.PartyDistrict}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>City:</span> {index.PartyCity}
                        </div>

                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Pin Code:</span> {index.PartyPIN}
                        </div>

                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Location:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            {(index.Latitude !== undefined && index.Longitude !== undefined && index.Latitude !== null && index.Longitude !== null) ? <C_Button
                                type="button"
                                className={`${hideBtnCss} px-2`}
                                title={"Party Location"}
                                onClick={() => {
                                    if (index.Latitude !== undefined && index.Longitude !== undefined && index.Latitude !== null && index.Longitude !== null) {
                                        window.open(`https://maps.google.com/?q=${index.Latitude},${index.Longitude}`, "_blank");
                                    }
                                }}
                            >
                                <i className="bx bx-map-pin"></i>
                            </C_Button> : <span style={{ fontWeight: "bold", marginLeft: "-14px" }}>-</span>}
                        </div>

                    </>
                );
            }

        },
        {
            text: "Employee Details",
            dataField: "EmpType",
            formatter: (cellContent, index) => {
                return (
                    <>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }} >
                            <span style={{ fontWeight: "bold" }}>Full Name:</span> {index.EmpName}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Employee Type:</span> {index.EmpType}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Email:</span> {index.EmpEmail}
                        </div> <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Mobile:</span> {index.EmpMobile}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>DOB:</span> {index.DOB}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>PAN:</span> {index.EmpPAN}
                        </div>
                    </>
                );
            }



        },
        {
            text: "Employee Address Details",
            dataField: "EmpAddress",
            formatter: (cellContent, index) => {
                return (
                    <>

                        <div style={{ width: "auto" }}>
                            <span style={{ fontWeight: "bold" }}>Address:</span> {index.EmpAddress}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>State:</span> {index.EmpState}
                        </div> <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>District:</span> {index.EmpDistrict}
                        </div>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>Pin Code:</span> {index.EmpPIN}
                        </div>
                    </>
                );
            }

        },

        {
            text: "FSSAI Details",
            dataField: "FSSAIExpiry",
            formatter: (cellContent, index) => {
                return (
                    <>
                        <div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>FSSAI No:</span> {index.FSSAINo}
                        </div><div style={{ width: "auto", whiteSpace: "nowrap" }}>
                            <span style={{ fontWeight: "bold" }}>FSSAI Expiry:</span> {index.FSSAIExpiry}
                        </div>

                    </>
                );
            }
        },

    ];


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)

    const debounceHandleSearch = _debounce((val) => {
        setSearchText(val);
    }, 300);


    const sortCaretFunction = {
        sortCaret: (order, column) => {
            if (!order) {
                return <i className="fas fa-sort-up pl-1 font-size-12" style={{ color: "#e9e9ef" }}></i>;
            } else if (order === 'asc') {
                return <i className="fas fa-sort-up pl-1 font-size-12"></i>;
            } else if (order === 'desc') {
                return <i className="fas fa-sort-down pl-1 font-size-12"></i>;
            }
            return <i className="fas fa-sort-up pl-1 font-size-12" style={{ color: "#e9e9ef" }}></i >;
        }
    };

    const filteredData = useMemo(() => {
        return PartyEmployeeDetails?.filter((row) =>
            Object.values(row).some(value =>
                value !== null && value.toString().toLowerCase().includes(searchText.toLowerCase())
            )
        );

    }, [PartyEmployeeDetails, searchText]);


    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`Count:${filteredData?.length}`));
    }, [])



    const options = {
        page: 1,
        paginationSize: 5,
        pageStartIndex: 1,
        custom: true,
        sizePerPage: filteredData?.length,
        totalSize: filteredData?.length,
        hidePageListOnlyOnePage: true,
    };

    useEffect(() => {
        globalTableSearchProps({ onSearch: debounceHandleSearch });
    }, []); // Ensure that globalTableSearchProps is called after mounting


    if ((modalCss) || (pageMode === mode.dropdownAdd));

    return (
        <React.Fragment>
            <div className="page-content" >
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                <PaginationProvider
                    data={filteredData}
                    columns={pagesListColumns}
                    keyField={"id"}
                    pagination={paginationFactory(options)}
                >
                    {
                        ({
                            paginationProps,
                            paginationTableProps
                        }) => (
                            <div>
                                <BootstrapTable
                                    data={filteredData}
                                    columns={pagesListColumns}
                                    keyField={"id"}
                                    classes='custom-table '
                                    sort={sortCaretFunction} // Include the sortCaret function
                                    noDataIndication={<div className="text-danger text-center ">No Records Found</div>}
                                    onDataSizeChange={({ dataSize }) => {
                                        dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
                                    }}
                                    {...paginationTableProps}
                                    bootstrap4
                                />
                                <PaginationTotalStandalone
                                    {...paginationProps}
                                />
                            </div>
                        )
                    }
                </PaginationProvider>
            </div>
        </React.Fragment >
    );
}



export default PartyEmployeeDetails
















































