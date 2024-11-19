import React, { useState } from "react";
import { Button, Table } from "reactstrap";
import { Tbody, Thead } from "react-super-responsive-table";

function DivisionTable(props) {

  const ondeleteHandeler = (ele) => {

    if (!(ele === 0)) {
      var fil = props.tableData.filter((i) => {
        return !(i.id === ele);
      });
      props.func(fil);
    }
  };

  const tableRows = props.tableData.map((info) => {
    return (
      <tr>
        <td>{info.DivisionName}</td>
        <td>
          <Button
            className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
            data-mdb-toggle="tooltip"
            data-mdb-placement="top"
            title="Delete Party Type"
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
        {props.tableData.length > 0 ? (
          <Table className="table table-bordered table-hover">
            <Thead>
              <tr>
                <th className="col col-sm-3">Division Name</th>
                <th className="col col-sm-3">{"Action"}</th>
              </tr>
            </Thead>
            <Tbody>{tableRows}</Tbody>
          </Table>
        ) : null}
      </div>
    </>
  );
}

export default React.memo(DivisionTable);
