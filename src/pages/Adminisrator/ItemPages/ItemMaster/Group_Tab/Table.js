import React from "react";
import { Button, Table } from "reactstrap";
import { Tbody, Thead } from "react-super-responsive-table";


function GroupTable(props) {

  const onDeleteHandeler = (ele) => {

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
        {/* <td>{info.id}</td> */}
        <td>{info.GroupTypeName}</td>
        <td>{info.GroupName}</td>
        <td>{info.SubGroupName}</td>
        <td>
          <Button
            className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
            data-mdb-toggle="tooltip"
            data-mdb-placement="top"
            title="Delete Party Type"
            onClick={(e) => {
              onDeleteHandeler(info.id);
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
                <th className="col col-sm-3">Group Type</th>
                <th className="col col-sm-3">Group</th>
                <th className="col col-sm-3">Sub Group</th>
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

export default React.memo(GroupTable);
