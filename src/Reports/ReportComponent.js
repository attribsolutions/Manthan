import React from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { C_Button } from "../components/Common/CommonButton";
import { C_Select } from "../CustomValidateForm";
import { loginIsSCMParty } from "../components/Common/CommonFunction";
import Papa from 'papaparse';

// export function ReportComponent({ pageField, excelData, excelFileName, extraColumn = "" }) {

//     let csvColumns = []
//     let csvHeaderColumns = []
//     let csvData = []
//     if (pageField) {
//         csvColumns = pageField.PageFieldMaster
//             .filter(column => column.ShowInListPage) // Only include columns where ShowInListPage is true
//             .sort((a, b) => a.ListPageSeq - b.ListPageSeq) // Sort columns by ListPageSeq in ascending order
//             .map(column => column.ControlID); // Extract ControlID as column headers

//         csvHeaderColumns = pageField.PageFieldMaster
//             .filter(column => column.ShowInListPage) // Only include columns where ShowInListPage is true
//             .sort((a, b) => a.ListPageSeq - b.ListPageSeq) // Sort columns by ListPageSeq in ascending order
//             .map(column => column.FieldLabel); // Extract FieldLabel as column headers

//         if (extraColumn !== "") {
//             csvColumns.unshift(extraColumn);
//             csvHeaderColumns.unshift(extraColumn);
//         }

//         // Map the data to include only the properties corresponding to the columns
//         csvData = excelData.map(item =>
//             csvColumns.map(column => item[column])
//         );
//     } else {
//         const objectAtIndex0 = ((excelData[0]));
//         for (const key in objectAtIndex0) {
//             csvHeaderColumns.push(key)
//         }
//         // Map the data to include only the properties corresponding to the columns
//         csvData = excelData.map(item =>
//             csvHeaderColumns.map(column => item[column])
//         );
//     }

//     // Combine column headers and data into a single array
//     const csvContent = [csvHeaderColumns, ...csvData];

//     // Create the CSV content
//     const csvContentString = Papa.unparse(csvContent, { header: true });

//     // Create and trigger the download
//     const blob = new Blob([csvContentString], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${excelFileName}.csv`;
//     a.click();

//     URL.revokeObjectURL(url);

// }

export const ShowAndExcelBtn = (props) => {
    const { showLoading, excelLoading, showOnClick, excelOnClick } = props

    return (
        <>
            <Col sm={1} className="mt-3" >
                <C_Button
                    type="button"
                    spinnerColor="white"
                    loading={showLoading}
                    className="btn btn-success"
                    onClick={showOnClick}
                >
                    Show
                </C_Button>

            </Col>

            <Col sm={2} className="mt-3 ">
                <C_Button
                    type="button"
                    spinnerColor="white"
                    loading={excelLoading}
                    className="btn btn-primary"
                    onClick={excelOnClick}
                >
                    Excel Download
                </C_Button>
            </Col>
        </>)

}

const PartyDropdownForReport = (props) => {

    const isSCMParty = loginIsSCMParty();
    const { partyValue, setPartyValue } = props

    const { partyList, partyDropdownLoading } = useSelector((state) => ({
        partyList: state.CommonPartyDropdownReducer.commonPartyDropdown,
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
    }));

    const PartyDropdownOptions = partyList.map((data) => ({
        value: data.id,
        label: data.Name,
        SAPPartyCode: data.SAPPartyCode
    }))

    return (
        isSCMParty && (
            <>
                <Col sm={3}>
                    <FormGroup className=" row mt-3 " >
                        <Label className="col-md-3 p-2 "
                            style={{ width: "90px" }}>Party</Label>
                        <Col sm={7}>
                            <C_Select
                                value={partyValue}
                                styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                                isSearchable={true}
                                isLoading={partyDropdownLoading}
                                className="react-dropdown"
                                classNamePrefix="dropdown"
                                options={PartyDropdownOptions}
                                onChange={(e) => setPartyValue(e)}
                            />
                        </Col>
                    </FormGroup>
                </Col >
            </>
        )
    );
};

export default PartyDropdownForReport;
