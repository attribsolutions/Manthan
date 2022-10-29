import {
    Button,
    Card,
    CardBody,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
    get_Division_ForDropDown,
    get_Party_ForDropDown,
} from "../../../store/Administrator/ItemsRedux/action";

import React, { useEffect, useState } from "react";
import { Tbody, Thead } from "react-super-responsive-table";

import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";

export default function EditTabaleTable() {
    const [marginMaster, setMarginMaster] = useState([]);

    return (
        <div className="page-content">
            <MRPTab tableData={marginMaster} func={setMarginMaster} />
        </div>
    )
}



function MRPTab(props) {
    const dispatch = useDispatch();
    const [division, setDivision] = useState("");
    const [partyName, setPartyName] = useState("");
    const [effectiveDate, setEffectiveDate] = useState("");
    const [MRP, setMRP] = useState("");

    const { Party, Division } = useSelector((state) => ({
        Division: state.ItemMastersReducer.Division,
        Party: state.ItemMastersReducer.Party,
    }));

    useEffect(() => {
        dispatch(get_Division_ForDropDown());
        dispatch(get_Party_ForDropDown());
    }, [dispatch]);

    const Party_DropdownOptions = Party.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const Division_DropdownOptions = Division.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const DivisiontHandler = (event) => {
        setDivision(event);
    };

    const EffectiveDateHandler = (e, date) => {
        setEffectiveDate(date);
    };

    const PartyNameHandler = (event) => {
        setPartyName(event);
    };

    const MRPHandler = (event) => {
        setMRP(event.target.value);
    };

    const addRowsHandler = (e) => {
        debugger;
        const val = {
            Division: division === "" ? "" : division.value,
            DivisionName: division.label,
            PartyName: partyName.label,
            Party: partyName === "" ? "" : partyName.value,
            EffectiveDate: effectiveDate,
            MRP: MRP,
            CreatedBy: 1,
            UpdatedBy: 1,
            Company: 1,
        };

        if (!(effectiveDate === "") && !(MRP === "")) {
            const totalTableData = props.tableData.length;
            val.id = totalTableData + 1;
            const updatedTableData = [...props.tableData];
            updatedTableData.push(val);
            props.func(updatedTableData);
            clearState();
        } else {
            alert("Please Enter value");
        }
    };
    const clearState = () => {
        setDivision("");
        setPartyName("");
        setEffectiveDate("");
        setMRP("");
    };

    return (
        <Row>
            <Col md={12}>
                <Card className="text-black">
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                        <Row className="mt-3">
                            <Col className=" col col-11 ">
                                <Row>
                                    <FormGroup className=" col col-sm-3 ">
                                        <Label>Division</Label>
                                        <Select
                                            id={`dropDivision-${0}`}
                                            value={division}
                                            options={Division_DropdownOptions}
                                            onChange={DivisiontHandler}
                                        />
                                    </FormGroup>

                                    <FormGroup className="mb-3 col col-sm-3 ">
                                        <Label>Party Name</Label>
                                        <Select
                                            id={`dropPartyName-${0}`}
                                            value={partyName}
                                            options={Party_DropdownOptions}
                                            onChange={PartyNameHandler}
                                        />
                                    </FormGroup>

                                    <FormGroup className="mb-3 col col-sm-3 ">
                                        <Label>Effective Date</Label>
                                        <div id={`txtEffectiveDate${0}`}>
                                            <Flatpickr
                                                id={`txtEffectiveDate${0}`}
                                                value={effectiveDate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="off"
                                                options={{
                                                    altInput: true,
                                                    altFormat: "F j, Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                                onChange={EffectiveDateHandler}
                                            />
                                        </div>
                                    </FormGroup>

                                    <FormGroup className="mb-3 col col-sm-3 ">
                                        <Label>MRP</Label>
                                        <Input
                                            type="text"
                                            id={`txtMRP${0}`}
                                            value={MRP}
                                            placeholder="Please Enter Margin"
                                            onChange={MRPHandler}
                                        />
                                    </FormGroup>
                                </Row>
                            </Col>
                            <Col md={1}>
                                <Row className=" mt-3">
                                    <Col md={6}>
                                        <Button
                                            className="btn btn-sm btn-light mt-3   align-items-sm-end"
                                            type="button"
                                            onClick={addRowsHandler}
                                        >
                                            <i className="dripicons-plus"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Row>
                    <MRPTable tableData={props.tableData} func={props.func} />
                </Row>
                <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
            </Col>
        </Row>
    );
}





const  MRPTable=(props)=> {

    const dispatch = useDispatch();
 
    const { Party, Division } = useSelector((state) => ({
        Division: state.ItemMastersReducer.Division,
        Party: state.ItemMastersReducer.Party,
    }));

    useEffect(() => {
        dispatch(get_Division_ForDropDown());
        dispatch(get_Party_ForDropDown());
    }, [dispatch]);

    const Party_DropdownOptions = Party.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const Division_DropdownOptions = Division.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const ondeleteHandeler = (ele) => {
       
            var fil = props.tableData.filter((i) => {
                return !(i.id === ele.id);
            });
            props.func(fil);
       
    };
    const partyOnchange=(e,row)=>{
        row["PartyName"] = e.label
        row["Party"] = e.value;
        row["alert"]=true
        
    }

    const options = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'In Active' },
        { value: 'deleted', label: 'Delete' },
    ];
    const pagesListColumns = [
        {
            text: "DivisionName",
            dataField: "DivisionName",
            sort: true,
            formatter: (value, row) => (
                <span className={`${row.alert?"text-warning":null}`}>
                  {value}
                </span>
              )
        },
        {
            text: "PartyName",
            dataField: "PartyName",
            sort: true,
            formatter: (value, row) => (
                <div style={{ backgroundColor: "#FFFAFA" }}>
                <span className={`${row.alert?"text-info":null}`}>
                  {value}
                </span>
                </div>
              ),

            editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
                <>
                                       <Select
                                                                        defaultValue={options[0]}
                                                                        isSearchable={false}
                                                                        className="react-dropdown"
                                                                        // onChange={(v, e) => onChangeSelect({ e, v, state, setState })}
                                                                        classNamePrefix="dropdown"
                                                                        options={Party_DropdownOptions}
                                                                        name="Party"
                                                                        styles={{
                                                                            control: base => ({
                                                                                ...base,
                                                                                // border: isError.Address.length > 0 ? '1px solid red' : '',

                                                                            })
                                                                        }}
                                                                        onChange={(e)=>partyOnchange(e,row)}
                                                                    />
                </>


            )
        },


        {
            text: "EffectiveDate",
            dataField: "EffectiveDate",
            sort: true,

            editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
                // <QualityRanger { ...editorProps } value={ value } />
                <>
                    {/* <Input type="checkbox" />
                    <Input type="text" onChange={(e)=>{debugger}}>

                    </Input> */}
                  <Flatpickr
                                                                        name="DOB"
                                                                        className="form-control d-block p-2 bg-white text-dark"
                                                                        placeholder="YYYY-MM-DD"
                                                                        autoComplete="0,''"
                                                                        options={{
                                                                            altInput: true,
                                                                            altFormat: "F j, Y",
                                                                            dateFormat: "Y-m-d",
                                                                            minDate: new Date().fp_incr("n"),
                                                                            maxDate: new Date().fp_incr(0) // 14 days from now"0,''"
                                                                        }}
                                                                        // onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                                    />
                </>


            )
        },

        {
            text: "MRP",
            dataField: "MRP",
            sort: true,
            //   editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (

            // <QualityRanger { ...editorProps } value={ value } />
            //   )
        },
        {
            text: "Action",
            dataField: "MRP",
            sort: true,
           
            editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
               
               <Button onClick={(e)=>ondeleteHandeler(row)} >delete</Button>
            )
           
        },

        
     
    ];
    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: props.tableData.length,
        custom: true,
    };

    return (
        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                defaultSorted={defaultSorted}
                                data={props.tableData}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps) => (
                                    <React.Fragment>
                                        
                                        <Row>
                                            <Col xl="12">
                                                <div className="table">
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        responsive
                                                        bordered={false}
                                                        striped={false}
                                                        cellEdit={cellEditFactory({ mode: 'click', blurToSave: true })}
                                                        classes={"table  table-bordered"}
                                                        {...toolkitProps.baseProps}
                                                        {...paginationTableProps}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="align-items-md-center mt-30">
                                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                <PaginationListStandalone {...paginationProps} />
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        )}
                     
                    </PaginationProvider> 
    )
}


//  const  MRPTable=(props)=> {

//     const ondeleteHandeler = (ele) => {
//         if (!(ele === 0)) {
//             var fil = props.tableData.filter((i) => {
//                 return !(i.id === ele);
//             });
//             props.func(fil);
//         }
//     };

//     const tableRows = props.tableData.map((info) => {
//         return (
//             <tr>
//                 {/* <td>{info.id}</td> */}
//                 <td>{info.DivisionName}</td>
//                 <td>{info.PartyName}</td>
//                 <td>{info.EffectiveDate}</td>
//                 <td>{info.MRP}</td>
//                 <td>
//                     <Button
//                         className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
//                         data-mdb-toggle="tooltip"
//                         data-mdb-placement="top"
//                         title="Delete Party Type"
//                         onClick={(e) => {
//                             ondeleteHandeler(info.id);
//                         }}
//                     >
//                         <i className="mdi mdi-delete font-size-18"></i>
//                     </Button>
//                 </td>
//             </tr>
//         );
//     });

//     return (
     
//             <div>
//                 {props.tableData.length > 0 ? (
//                     <Table className="table table-bordered table-hover">
//                         <Thead>
//                             <tr>
//                                 <th className="col col-sm-3">Division</th>
//                                 <th className="col col-sm-3">Party Name</th>
//                                 <th className="col col-sm-3">Effective Date</th>
//                                 <th className="col col-sm-3">MRP</th>
//                                 <th className="col col-sm-3">{"Action"}</th>
//                             </tr>
//                         </Thead>
//                         <Tbody>{tableRows}</Tbody>
//                     </Table>
//                 ) : null}
//             </div>
      
//     );
// }


