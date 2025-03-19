import React, { useEffect, useState } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { loginSelectedPartyID } from '../../../components/Common/CommonFunction';
import { useSelector } from 'react-redux';
import { globalTableSearchProps } from '../../../components/Common/SearchBox/MySearch';
import SimpleBar from "simplebar-react"

import { POSExEVersion_Api } from '../../../helpers/backend_helper';
import { CardHeader } from 'reactstrap';



const PosExeVersionDetails = () => {


    debugger
    const [ExeVersionData, setExeVersionData] = useState({ Latest_EXE_version: "", Latest_Service_Version: "", Data: [] })

    const { commonPartyDropSelect } = useSelector((state) => ({
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    useEffect(async () => {
        const jsonBody = JSON.stringify({
            Party: loginSelectedPartyID(),
        });
        const jsonData = await POSExEVersion_Api({ jsonBody })
        setExeVersionData(jsonData)
    }, [commonPartyDropSelect])


    const pagesListColumns = [
        {
            text: "Mac ID",
            dataField: "MacID",
        },
        {
            text: "Machine Name",
            dataField: "MachineName",
        },
        {
            text: "Version",
            dataField: "Version",
            formatter: (cellContent, index) => (
                <>
                    <div style={{ width: "120px" }}>{` Exe Version : ${cellContent?.ExeVersion}`}</div>
                    <div style={{ width: "120px" }}>{` Win Servise : ${cellContent?.WinServise || ""}`}</div>
                </>
            )
        },

    ];

    return (
        <ToolkitProvider
            keyField="id"
            data={ExeVersionData?.Data}
            columns={pagesListColumns}
            search
        >
            {toolkitProps => (
                <React.Fragment>
                    <CardHeader style={{ backgroundColor: "whitesmoke" }}
                        className="card-header align-items-center d-flex justify-content-between">

                        {/* Left Side - "Latest" Label */}
                        <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                            Latest
                        </span>

                        {/* Right Side - Versions */}
                        <div>
                            <span style={{ fontWeight: "bold", fontSize: "20px", marginRight: "15px" }}>
                                EXE Version: <span style={{ color: "tomato" }}>{ExeVersionData?.Latest_EXE_version}</span>
                            </span>

                            <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                                Service Version: <span style={{ color: "tomato" }}>{ExeVersionData?.Latest_Service_Version}</span>
                            </span>
                        </div>

                    </CardHeader>



                    <SimpleBar className="" style={{ maxHeight: "352px" }}>
                        <BootstrapTable
                            keyField={"id"}
                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                            classes={"table align-middle table-nowrap table-hover"}
                            headerWrapperClasses={"thead-light"}
                            {...toolkitProps.baseProps}
                        />
                        {globalTableSearchProps(toolkitProps.searchProps)}

                    </SimpleBar >


                </React.Fragment>
            )
            }
        </ToolkitProvider>
    )
}

export default PosExeVersionDetails;

