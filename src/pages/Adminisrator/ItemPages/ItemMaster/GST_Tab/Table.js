import React, { useEffect, useState } from 'react';
import { Button, Table, } from 'reactstrap';
import { Tbody, Thead } from 'react-super-responsive-table';
import { deleteGSTId_ForMaster, deleteGSTId_ForMaster_Success } from '../../../../../store/Administrator/GSTRedux/action';
import { useDispatch, useSelector } from 'react-redux';
import { customAlert } from '../../../../../CustomAlert/ConfirmDialog';

function GSTTable(props) {
  
  const dispatch = useDispatch();

  const {
    deleteMsg,
  } = useSelector((state) => ({
    deleteMsg: state.GSTReducer.deleteMsg,
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
        customAlert({
          Type: 5,
          Status: true,
          Message: `Are you sure you want to delete this GST"`,
          RedirectPath: false,
          PermissionAction: deleteGSTId_ForMaster,
          ID: info.id,
        })
      );
    }
  };

  useEffect(() => {
    if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
      dispatch(deleteGSTId_ForMaster_Success({ Status: false }));

      var fil = props.tableData.filter((i) => {
        return !(i.id === deleteMsg.deletedId);
      });
      props.func(fil);

      dispatch(
        customAlert({
          Type: 1,
          Status: true,
          Message: deleteMsg.Message,
        })
      );
    } else if (deleteMsg.Status === true) {
      dispatch(deleteGSTId_ForMaster_Success({ Status: false }));
      dispatch(
        customAlert({
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
        <td>{info.EffectiveDate}</td>
        <td>{info.GSTPercentage}</td>
        <td>{info.HSNCode}</td>
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
                <th className="col col-sm-3">Effective Date</th>
                <th className="col col-sm-3">GST</th>
                <th className="col col-sm-3">HSN Code</th>
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

export default GSTTable;
