import React, { useState } from 'react';
import { Button, Table, } from 'reactstrap';
import { Tbody, Thead } from 'react-super-responsive-table';
import StudentForm from './StudentForm';
import ItemsMaster from './ItemMaster';
function GSTDetailsTable(props) {
    const [TableData, setTableData] = useState([]);


    const ondeleteHandeler = (ele) => {

        if (!(ele === 0)) {
            var a = TableData.filter((i) => {
                return !(i.id === ele);
            });
            setTableData(a);
        }
    };

    const tableRows = TableData.map((info) => {
        return (
            <tr>
                {/* <td>{info.id}</td> */}
                <td>{info.EffectiveDate}</td>
                <td>{info.GST}</td>
                <td>{info.HSNCode}</td>
                <td>
                    <Button
                        className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Party Type"
                        onClick={(e) => {
                            ondeleteHandeler(info.id);
                        }}
                    >
                        <i className="mdi mdi-delete font-size-18"></i>
                    </Button>
                </td>
            </tr>
        );
    });

    const addRows = (data) => {
        const totalTableData = TableData.length;
        data.id = totalTableData + 1;
        const updatedTableData = [...TableData];
        updatedTableData.push(data);
        setTableData(updatedTableData);
    };
    return (

        <div>
            <StudentForm func={addRows} />
            
            {TableData.length > 0 ?
                    <Table className="table table-bordered table-hover">
                        <Thead>
                            <tr>
                                <th className="col col-sm-3">EffectiveDate</th>
                                <th className="col col-sm-3">GST</th>
                                <th className="col col-sm-3">HSNCode</th>
                                <th className="col col-sm-3">{"Action"}</th>
                            </tr>
                        </Thead>
                        <Tbody>{tableRows}</Tbody>
                    </Table>
                    : null}

        </div>
        
    );
}

export default GSTDetailsTable;
