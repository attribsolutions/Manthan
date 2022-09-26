import React, { useState } from 'react';
import { Button, Table, } from 'reactstrap';
import { Tbody, Thead } from 'react-super-responsive-table';

function AddressDetailsTable(props) {

    const ondeleteHandeler = (ele) => {

        if (!(ele === 0)) {
            var fil = props.tableData.filter((i) => {
                return !(i.id === ele);
            });
            props.func(fil);
        }
    };

    const tableRows = props.tableData.map((info) => {
        debugger
        return (
            <tr>
                {/* <td>{info.id}</td> */}
                <td>{info.AddressTypeName}</td>
                <td>{info.Address}</td>
                <td>{info.FSSAINo}</td>
                <td>{info.FSSAIExipry}</td>
                <td>{info.PIN}</td>
                < td>{`${info.IsDefault}`}</td>
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

    return (
        <>
            <div>
                {props.tableData.length > 0 ?
                    <Table className="table table-bordered table-hover">
                        <Thead>
                            <tr>
                                <th className="col col-sm-3">Address Type</th>
                                <th className="col col-sm-3">Address</th>
                                <th className="col col-sm-3">FSSAINo</th>
                                <th className="col col-sm-3">FSSAIExipry</th>
                                <th className="col col-sm-3">PIN</th>
                                <th className="col col-sm-3">IsDefault</th>
                                <th className="col col-sm-3">{"Action"}</th>
                            </tr>
                        </Thead>
                        <Tbody>{tableRows}</Tbody>
                    </Table>
                    : null}
            </div>
        </>
    );
}

export default AddressDetailsTable;
