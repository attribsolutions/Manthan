import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Table, } from 'reactstrap';
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
    let val = event.target.value
    const result = /^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/.test(val);
    if (result) {
      info.Quantity = event.target.value;
    }
    else if (val === "") {
      info.Quantity =""
    }
    else {
      event.target.value= ""
    }
  };

  const tableRows = props.tableData.map((info, key) => {

    return (
      <tr>
        <td>{info.ItemName}</td>
        <td>
          <div className='text-center' style={{ width: "150px" }}>
            <Input type="text"
              style={{ width: '140px', textAlign: 'center' }}
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
        <Table className="table table-bordered table-hover mb-2">
          <Thead>
            <tr>
              <th className="col col-sm-3">Item</th>
              <th className="col col-sm-3">Quantity </th>
              <th className="col col-sm-3">Unit</th>
              <th className="col col-sm-3">{"Action"}</th>
            </tr>
          </Thead>
          <Tbody>{tableRows}</Tbody>
          {props.tableData.length > 0 ?
            <></>
            :
            <tr className="text-danger text-center mt-4 "
              style={{
                marginTop: "25px",
                marginBottom: "12px"
              }}>
              <td colspan="4">Items Not available</td>
            </tr>

          }
        </Table>
       
      </div>
    </>
  );
}

export default BOMTable;
