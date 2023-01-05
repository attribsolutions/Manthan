import React, { useEffect, useState } from 'react';
import { Button, Input, Table, } from 'reactstrap';
import { Tbody, Thead } from 'react-super-responsive-table';

function BOMTable(props) {

  const onDeleteHandeler = (ele) => {

    if (!(ele === 0)) {
      var fil = props.tableData.filter((i) => {
        return !(i.id === ele.id);
      });
      props.func(fil);
    }
  };

  const handleChange = (event, info) => {
    info.Quantity = event.target.value
  };

  const tableRows = props.tableData.map((info, key) => {

    return (
      <tr>
        <td>{info.ItemName}</td>
        <td>
          <div className='text-center'style={{ width: "150px" }}>
            <Input type="text"
            className="text-end"
              defaultValue={info.Quantity}
              onChange={(event) => handleChange(event, info)}
            >
            </Input>
          </div>
        </td>
        <td>{info.UnitName}</td>
        <td>
          <Button
            className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Party Type"
            onClick={(e) => {
              onDeleteHandeler(info);
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
                <th className="col col-sm-3">Item</th>
                <th className="col col-sm-3">Quantity </th>
                <th className="col col-sm-3">Unit</th>
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

export default BOMTable;
