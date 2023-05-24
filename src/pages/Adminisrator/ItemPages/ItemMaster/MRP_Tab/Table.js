import React, { useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import { Tbody, Thead } from "react-super-responsive-table";
import { deleteMRPMaster_Id, deleteMRPMaster_Id_Success } from "../../../../../store/Administrator/MRPMasterRedux/action";
import { AlertState } from "../../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { loginIsSCMCompany } from "../../../../../components/Common/CommonFunction";

function MRPTable(props) {
  const dispatch = useDispatch();
  const IsSCMCompany = loginIsSCMCompany();

  const hasSCMhide = (IsSCMCompany === 1 ? true : false)

  const { deleteMsg, } = useSelector((state) => ({
    deleteMsg: state.MRPMasterReducer.deleteIdForMRPMaster,
  }));

  const onDeleteHandeler = (info) => {
    if (info.IsAdd) {
      var fil = props.tableData.filter((i) => {
        return !(i.id === info.id);
      });
      props.func(fil);
    }
    else {
      dispatch(
        AlertState({
          Type: 5,
          Status: true,
          Message: `Are you sure you want to delete this MRP"`,
          RedirectPath: false,
          PermissionAction: deleteMRPMaster_Id,
          ID: info.id,
        })
      );
    }
  };

  useEffect(() => {
    if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
      dispatch(deleteMRPMaster_Id_Success({ Status: false }));

      var fil = props.tableData.filter((i) => {
        return !(i.id === deleteMsg.deletedId);
      });
      props.func(fil);

      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMsg.Message,
        })
      );
    } else if (deleteMsg.Status === true) {
      dispatch(deleteMRPMaster_Id_Success({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteMsg.Message),
        })
      );
    }
  }, [deleteMsg]);


  const tableRows = props.tableData.map((info) => {
    return (
      <tr>
        {/* <td>{info.id}</td> */}
        <td hidden={hasSCMhide}>{info.DivisionName}</td>
        <td hidden={hasSCMhide}>{info.PartyName}</td>
        <td>{info.EffectiveDate}</td>
        <td>{info.MRP}</td>
        <td>
          <Button
            className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
            data-mdb-toggle="tooltip"
            data-mdb-placement="top"
            title="Delete Party Type"
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
        {props.tableData.length > 0 ? (
          <Table className="table table-bordered table-hover">

            <Thead>
              <tr >
                <th className="col col-sm-3" hidden={hasSCMhide}>Division</th>
                <th className="col col-sm-3" hidden={hasSCMhide}>Party Name</th>
                <th className="col col-sm-3">Effective Date</th>
                <th className="col col-sm-3" >MRP</th>
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

export default MRPTable;
